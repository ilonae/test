import React from 'react';
import { makeStyles, Grid, Card, Typography, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Image from '../container/Image';
import * as d3 from 'd3';
import InputWidget from '../widgets/InputWidget';
//import UploadButton from '../widgets/UploadButton';
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
    height: '60%',
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
  download: {
    height: '100%',
    justifyContent: 'center',
    display: 'flex',
    textAlign: 'center'
  },
  centering: {
    justifyContent: 'center',
    height: 'inherit'
  },
  svg: {
    paddingTop: '2vh',
    ".chartbar": {
      fill: 'red'
    }
  },

});


const onInputChange = (event: React.ChangeEvent<{}>, value: any, classIndices: any[], targetCallback: (value: React.SetStateAction<string>) => void) => {
  if (value !== null && classIndices && isNumeric(value)) {
    for (const k in classIndices) {  // const k: string
      const v = classIndices[k];
      let num = parseInt(value);
      if (v.includes(num)) {
        targetCallback(k);
      }
    }
  }
  if (value !== null && !isNumeric(value)) {
    targetCallback(value)
  }
  else {
    console.log(value)
  }
}

function isNumeric(value: any) {
  return /^\d+$/.test(value);
}


const plot = (chart: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>, width: number, height: number, data: any[], targetCallback: (value: React.SetStateAction<string>) => void, inputRef: React.MutableRefObject<undefined>) => {
  const sortedBars = d3.max(data, (d) => d.confidence);
  var sortedData = data.sort(function (a, b) {
    return d3.descending(a.confidence, b.confidence)
  }).slice(0, 10)
  //console.log(sortedData)
  const index = d3.local();
  const tickIndex = d3.local();
  const tickTextIndex = d3.local();
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
  const yAxis = (g: any) =>
    g.attr('class', 'chartyAxisText')
      .attr('transform', `translate(${50},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickFormat(i => String(Math.round((sortedData[Number(i)].confidence + Number.EPSILON) * 100) / 100) + "%")
          .tickSizeOuter(0)
      );
  d3.select(".chartyAxisText").selectAll(".tick").attr("id", function (d, i) { return "axisText_" + i });

  chart
    .append('g')
    .selectAll('rect')
    .data(sortedData)
    .enter().append('rect')
    .attr('x', x(0))
    .attr("y", function (d, i) {
      return y(`${i}`)
    })
    .attr('y', (d, i) => y(`${i}`))
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
    .attr('y', (d, i) => y(`${i}`) + y.bandwidth() / 2)
    .attr('dy', '0.35em')
    .text(d => (d.classname))
    .style('pointer-events', 'auto')
    .each(function (d, i) {
      index.set(this, i);
    })
    .on("click", function (event, d) {
      event.stopPropagation();
      let bar_index = index.get(this);
      let current_index = index.get(this);
      console.log(bar_index)
      d3.select(inputRef.current).selectAll("rect")
        .transition()
        .duration(500)
        .attr("y", function (d, i) {
          if (i < current_index) {
            i = i + 1;
            return (y(`${i}`));
          }
          else if (i > current_index) {
            return (y(`${i}`))
          }
          else if (i === current_index) {
            return y(String(0));
          }
        })
      d3.select(inputRef.current).selectAll("text")
        .transition()
        .duration(500)
        .attr("y", function (d, i) {
          if (i < current_index) {
            i = i + 1;
            return (y(`${i}`) + y.bandwidth() / 2);
          }
          else if (i > current_index) {
            return (y(`${i}`) + y.bandwidth() / 2)
          }
          else {
            return (y(String(0)) + y.bandwidth() / 2);
          }
        })
      let translatePos: any = {};
      d3.select(inputRef.current).selectAll('.chartyAxisText')
        .selectAll(".tick")
        .each(function (d, i) {
          let string = this.getAttribute("transform")
          let translate = string.substring(string.indexOf("(") + 1, string.indexOf(")")).split(",");
          translatePos[i] = translate;
        })
        .attr("transform", function (d, i) {

          if (i === current_index) {
            return "translate(" + translatePos[0] + ")"
          }
          else if (i < current_index) {
            i = i + 1;
            return "translate(" + translatePos[i] + ")"
          }
          else if (i > current_index) {
            return "translate(" + translatePos[i] + ")"
          }
        });
    })
  //chart.selectAll("text").attr("id", function (d, i) { return "chartText_" + i; });
  chart.append('g').call(yAxis);
}



export interface SidebarProps {
  target: string;
  maxIndex: number;
  indexCallback: (value: any) => void;
  image: string;
  heatmap: string;
  localAnalysisCallback(x: any, y: any, width: any, height: any, maskId?: number): Promise<void>;
  index: number;
  classIndices: any[];
  heatmapClasses: any[];
  heatmapConfidences: any[];
  targetCallback: (value: React.SetStateAction<string>) => void;
}

export const SidebarComponent: React.FC<SidebarProps> = (props: SidebarProps) => {

  const classes = useStyles();
  const inputRef = React.useRef();
  const [contentWidth, setContentWidth] = React.useState(null);
  const [, changeCurrentClassIndices] = React.useState([""]);
  const [currentHeatmapClasses, changeCurrentHeatmapClasses] = React.useState([]);

  React.useEffect(() => {
    if (Object.keys(props.classIndices).length > 0) {
      const classNames = Object.keys(props.classIndices);
      changeCurrentClassIndices(classNames);
    }
  }, [props.classIndices]);

  React.useEffect(() => {
    const createBarPlot = () => {
      let object = [];
      for (let className in props.heatmapConfidences) {
        object.push({ "classname": props.heatmapClasses[className], "confidence": props.heatmapConfidences[className] })
      }
      let iWidth: number = parseInt(getComputedStyle(document.getElementById('inputsCard'))
        .getPropertyValue("width")
        .trim());
      setContentWidth(
        iWidth
      );
      d3.select(inputRef.current).selectAll("*").remove();
      var canvas = d3.select(inputRef.current)
        .append("svg")
        .attr("width", iWidth).attr("height", iWidth - 80);
      plot(canvas, iWidth, iWidth, object, props.targetCallback, inputRef);
    }
    if (props.heatmapClasses.length &&
      props.heatmapConfidences.length && currentHeatmapClasses !== props.heatmapClasses) {
      changeCurrentHeatmapClasses(props.heatmapClasses)
      createBarPlot();
    }
  }, [props.heatmapClasses, props.targetCallback, currentHeatmapClasses, props.heatmapConfidences]);


  return <Card className={classes.root} id={'inputsCard'}>
    <Grid className={classes.imgs}  >
      <Grid container className={classes.tools} >
        <Typography gutterBottom>Target class: {props.target}</Typography>
      </Grid>
      <Grid container
        className={
          classes.images
        }
      >
        <Typography gutterBottom>Analyze image by index: </Typography>
        <InputWidget id="index" value={props.index} maxIndex={props.maxIndex} params={""} type="number" input="" inputCallback={props.indexCallback} filterNameCallback={() => console.log("test")}></InputWidget>
        <Image
          content={props.image}
          title={'Image'}
          getLocalAnalysisCallback={props.localAnalysisCallback}
        />
        <Image
          content={props.heatmap}
          title={'R(x|theta={' + props.target + '})'}
          getLocalAnalysisCallback={props.localAnalysisCallback}
        />
      </Grid>
    </Grid>
    <Grid className={classes.search}>
      <Typography gutterBottom>Target: </Typography>
      <Autocomplete
        freeSolo
        options={props.heatmapClasses}
        style={{ width: contentWidth, zIndex: 300 }}
        onChange={(event, value) => onInputChange(event, value, props.classIndices, props.targetCallback)}
        renderInput={props => {
          return <TextField {...props} />;
        }}

      />
      < div className={classes.svg} ref={inputRef} >
      </div>
    </Grid>
  </Card>
};


export default SidebarComponent;
