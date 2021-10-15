import React from 'react';
import { makeStyles, Grid, Card, Typography, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import Image from '../container/Image';
import InputWidget from 'src/widgets/InputWidget';
import * as d3 from 'd3';
import SearchIcon from '@material-ui/icons/Search';
import { parseSvg } from 'd3-interpolate/src/transform/parse';
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
    display: 'grid',
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
  localAnalysisCallback,
  index: parentIndex,
  classIndices,
  heatmapClasses,
  heatmapConfidences,
  targetCallback,
  processTargetCallback

}) => {
  const classes = useStyles();
  const inputRef = React.useRef();

  const [index, setIndex] = React.useState(0);
  const [isInitial, setInitial] = React.useState(true);
  const [barPlots, updateBarPlots] = React.useState();
  const [contentWidth, setContentWidth] = React.useState(null);
  const [currentClassIndices, changeCurrentClassIndices] = React.useState();
  const [currentHeatmapClasses, changeCurrentHeatmapClasses] = React.useState();


  const onInputChange = (event, value) => {
    if (value !== null && classIndices && isNumeric(value)) {
      for (const [k, v] of Object.entries(classIndices)) {
        let num = parseInt(value);
        if (v.includes(num)) {
          targetCallback(k);
        }
      }
    }
    //correct autocomplete target
    if (value !== null && !isNumeric(value)) {
      targetCallback(value)
    }
    else {
      console.log(value)
    }
  }

  function isNumeric(value) {
    return /^\d+$/.test(value);
  }


  React.useEffect(() => {
    if (Object.keys(classIndices).length > 0) {
      const classNames = Object.keys(classIndices);
      changeCurrentClassIndices(classNames);
    }
  }, [classIndices]);

  const plot = (chart, width, height, data) => {

    const sortedBars = d3.max(data, (d) => d.confidence);

    var sortedData = data.sort(function (a, b) {
      return d3.descending(a.confidence, b.confidence)
    }).slice(0, 10)


    //if you want to just keep top three

    const index = d3.local();
    const tickIndex = d3.local();
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
        console.log(bar_index)
        d3.select(inputRef.current).selectAll("rect")
          .transition()
          .duration(500)
          .attr("y", function (d, i) {
            if (i < current_index) {
              return (y(i + 1))
            }
            else if (i > current_index) {
              return (y(i))
            }
            else if (i === current_index) {
              return y(0);
            }
          })
        d3.select(inputRef.current).selectAll("text")
          .transition()
          .duration(500)
          .attr("y", function (d, i) {
            if (i < current_index) {
              return (y(i + 1) + y.bandwidth() / 2)
            }
            else if (i > current_index) {
              return (y(i) + y.bandwidth() / 2)
            }
            else {
              return (y(0) + y.bandwidth() / 2);
            }
          })
        d3.select(inputRef.current).selectAll('.tick')
          .each(function (d, i) {
            tickIndex.set(this, i);
          })
          .call(selection => selection
            .selectAll('text')
            .attr("dy", function (d, i) {
              let current_index = tickIndex.get(this);

              if (i === current_index) {
                return y(0);
              }

              else if (i < current_index) {
                return (y(i + 1))
              }
              else if (i > current_index) {
                return (y(i))
              }

            }));
      })
    chart.selectAll("text").attr("id", function (d, i) { return "chartText_" + i; });
    chart.append('g').call(yAxis);
  }

  React.useEffect(() => {
    const createBarPlot = () => {
      let object = [];
      for (let className in heatmapConfidences) {
        object.push({ "classname": heatmapClasses[className], "confidence": heatmapConfidences[className] })
      }

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
      heatmapConfidences.length && currentHeatmapClasses !== heatmapClasses) {
      changeCurrentHeatmapClasses(heatmapClasses)
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
          <Typography gutterBottom>Target class: {target}</Typography>
        </Grid>
        <Grid container
          className={
            classes.images
          }
        >

          <Typography gutterBottom>Analyze image by index: </Typography>
          <InputWidget value={index} type="number" input={"sample"} id={'index'} inputCallback={indexCallback} maxIndex={maxIndex}></InputWidget>


          <Image
            content={image}
            title={'Image'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />
          <Image
            content={heatmap}
            title={'R(x|theta={' + target + '})'}
            getLocalAnalysisCallback={localAnalysisCallback}
          />
        </Grid>



      </Grid>
      <Grid className={classes.search}>
        <Typography gutterBottom>Target: </Typography>
        <Autocomplete
          id="combo-box-demo"
          freeSolo
          options={heatmapClasses}
          style={{ width: contentWidth, }}
          onChange={onInputChange}
          renderInput={(params) =>
            <InputWidget value={target} params={params} input={"target"} id={'name'} type="text" />}
        />
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
