import React from 'react';
import { makeStyles, Grid, Card, Typography, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import Image from '../container/Image';
import InputWidget from 'src/widgets/InputWidget';
import * as d3 from 'd3';
import SearchIcon from '@material-ui/icons/Search';
const useStyles = makeStyles({
  images: {
    maxHeight: '90%',
    display: 'inherit',
    flexDirection: 'row'

  },
  tools: {
    justifyContent: 'center',
    whiteSpace: 'nowrap'
  },
  root: {
    height: '91vh',
    padding: '3vh',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  imgs: {
    height: '70%',
    justifyContent: 'center',
    display: 'grid',
    textAlign: 'center'
  },
  search: {
    height: '30%',
    justifyContent: 'center',
    display: 'grid',
    textAlign: 'center'
  },

  centering: {
    justifyContent: 'center',
    height: 'inherit'
  },
  svg: {
    paddingTop: '3vh',
    ".chartbar": {
      fill: 'red'
    }
  },

});

const SidebarComponent = ({
  maxIndex,
  target,
  indexCallback,
  classIndexCallback,
  image,
  heatmap,
  parentLACallback,
  index: parentIndex,
  classIndices,
  heatmapClasses,
  heatmapConfidences,
  targetCallback
}) => {
  const classes = useStyles();
  const inputRef = React.useRef();

  const [index, setIndex] = React.useState(0);
  const [barPlots, updateBarPlots] = React.useState();
  const [contentWidth, setContentWidth] = React.useState(null);
  const [currentClassIndices, changeCurrentClassIndices] = React.useState(classIndices);

  const inputCallback = value => {
    console.log(value)
    indexCallback(value);
  };

  const onInputChange = (event, value) => {
    classIndexCallback(value)
  }

  const localAnalysisCallback = (x, y, width, height) => {
    parentLACallback(x, y, width, height);
  };

  React.useEffect(() => {
    if (Object.keys(classIndices).length > 0) {
      const classNames = Object.keys(classIndices);

      /* Object.values(classIndices).forEach((entry) => {
        console.log(entry);
      }); */
      //classEntries.map(k, v)
      changeCurrentClassIndices(classNames);
    }
    console.log(classIndices)

  }, [classIndices]);

  const plot = (chart, width, height, data) => {

    const sortedBars = d3.max(data, (d) => d.confidence);

    var sortedData = data.sort(function (a, b) {
      return d3.descending(a.confidence, b.confidence)
    });

    //if you want to just keep top three
    sortedData = sortedData.filter(function (d, i) {
      return i < 5;
    });

    const index = d3.local();
    const x = d3
      .scaleLinear()
      .domain([0, sortedBars])
      .range([50, width - 50])
      .nice();
    const y = d3
      .scaleBand()
      .domain(d3.range(sortedData.length))
      .range([0, height - 100])
      .padding(0.1);

    /*   const xAxis = g =>
        g
          .attr('class', 'chartxAxisText')
          .attr('transform', `translate(0,${20})`)
          .call(d3.axisTop(x))
          .call(g => g.select('.domain').remove()); */
    const yAxis = g =>
      g.attr('class', 'chartyAxisText')
        .attr('transform', `translate(${50},0)`)
        .call(
          d3
            .axisLeft(y)
            .tickFormat(i => Math.round((sortedData[i].confidence + Number.EPSILON) * 100) / 100)
            .tickSizeOuter(0)
        );
    chart
      .append('g')
      .selectAll('rect')
      .data(sortedData)
      .enter().append('rect')
      .attr('x', x(0))
      .attr("y", function (d, i) {
        return y(i)
      })
      .attr('y', (d, i) => y(i))
      .attr('width', d => x(d.confidence) - x(0))
      .attr('height', y.bandwidth())
      .attr('fill', 'rgba(102,191,172,1)')
    chart.selectAll("rect").attr("id", function (d, i) { return "bar_" + i; });

    chart
      .append('g')
      .attr('class', 'chartbarTextWrap')
      .selectAll('text')
      .data(sortedData)
      .enter().append('text')
      .attr('x', d => x(0))
      .attr('y', (d, i) => y(i) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .text(d => (d.classname))
      .style('pointer-events', 'auto')
      .each(function (d, i) {
        index.set(this, i);
        console.log(index.get(this));
      })
      .on("click", function (event, d) {
        event.stopPropagation();
        targetCallback(d.classname);
        let bar_index = index.get(this);
        let current_index = index.get(this);
        d3.select(inputRef.current).selectAll("rect")
          .transition()
          .duration(500)
          .attr("y", function (d, i) {
            index.set(this, current_index + 1);
            console.log(current_index)
            return (y(i) + y(current_index))
          })
        d3.select(inputRef.current).selectAll("text")
          .transition()
          .duration(500)
          .attr("y", function (d, i) {
            return ((y(i) + y.bandwidth() / 2) + y(current_index))
          })
        d3.select(inputRef.current).selectAll("#bar_" + bar_index)
          .transition()
          .duration(500)
          .attr('y', y(0));
        d3.select(inputRef.current).selectAll("#chartText_" + bar_index)
          .transition()
          .duration(500)
          .attr('y', y(0) + y.bandwidth() / 2);
      })
    chart.selectAll("text").attr("id", function (d, i) { return "chartText_" + i; });
    chart.append('g').call(yAxis);
  }

  React.useEffect(() => {
    const createBarPlot = () => {
      let object = [];
      for (let className in heatmapClasses) {
        object.push({ "classname": heatmapClasses[className], "confidence": heatmapConfidences[className] })
      }
      console.log(object)
      let iWidth = getComputedStyle(document.getElementsByName('inputsCard')[0])
        .getPropertyValue("width")
        .trim();
      iWidth = parseInt(iWidth)
      setContentWidth(
        iWidth
      );
      d3.select(inputRef.current).selectAll("*").remove();
      var canvas = d3.select(inputRef.current)
        .append("svg")
        .attr("width", iWidth).attr("height", iWidth);
      plot(canvas, iWidth, iWidth, object);
    }
    if (heatmapClasses.length &&
      heatmapConfidences.length) {
      console.log(heatmapClasses)
      createBarPlot();
    }
  }, [heatmapClasses,
    heatmapConfidences]);

  React.useEffect(() => {
    if (parentIndex) {
      setIndex(parentIndex);
    }
  }, [parentIndex]);

  return (
    <Card className={classes.root} name={'inputsCard'}>
      <Grid className={classes.imgs}  >
        <Grid container className={classes.tools} >
          <Typography gutterBottom>True class: {target}</Typography>
        </Grid>
        <Grid container
          className={
            classes.images
          }
        >
          <Image
            content={image}
            title={'Image'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />
          <Image
            content={heatmap}
            title={'Heatmap'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />
        </Grid>



      </Grid>
      <Grid className={classes.search}>
        {currentClassIndices.length > 0 ? <Autocomplete
          id="combo-box-demo"
          freeSolo
          options={currentClassIndices}
          style={{ width: contentWidth, }}
          onChange={onInputChange}
          renderInput={(params) =>
            <InputWidget value={index} params={params} id={'name'} type="text" inputCallback={inputCallback} />}
        /> : <InputWidget value={index} type="number" id={'index'} inputCallback={inputCallback} maxIndex={maxIndex}></InputWidget>}

        <div className={classes.svg} ref={inputRef} >
        </div>
      </Grid>
    </Card>
  );
};

SidebarComponent.propTypes = {
  expansionCallback: PropTypes.func,
  viewCallback: PropTypes.func,
  indexCallback: PropTypes.func,
  viewState: PropTypes.string,
  experiment: PropTypes.string,
  method: PropTypes.string,
  parentLACallback: PropTypes.func,
  parentToggleCallback: PropTypes.func
};

export default SidebarComponent;
