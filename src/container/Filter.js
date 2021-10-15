import React from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

import { Grid, Typography, makeStyles, Container, Button, ButtonGroup } from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputWidget from 'src/widgets/InputWidget';
import { ImageAspectRatio } from '@material-ui/icons';


const useStyles = makeStyles(() => ({

  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    padding: '2em',
    alignItems: 'center'
  },
  buttonLeft: {

  },
  buttonRight: {
    marginLeft: 'auto'
  },

  add: { display: 'inline' },
  caption: { display: 'table-caption' },
  row: {
    wordWrap: 'break-word',
    display: 'flex',
    alignItems: "center",
    marginLeft: "1em"
  },
  centering: {
    textAlign: 'center',
    maxHeight: '100%'
  },
  images: {
    height: 'auto',
    width: '75%',
    display: 'grid',
    marginTop: '1em',
    gridTemplateColumns: 'repeat(9,1fr)',
    gap: "1em"
  },
  analysis: {
    display: "flex",
    flexDirection: "column",
    height: 'auto',
    width: '15%',
    marginLeft: "2%"
  },
  margins: {
    marginLeft: "2em",
    border: '1px solid #555',
    verticalAlign: 'middle',
    height: "auto"
  },
  image: {
    border: '1px solid #555',
    verticalAlign: 'middle',
    width: '100%',
    height: "auto"
  },
  singleActivation: {
    height: '80%',
    width: '80%',
    display: 'block'
  },
  positive: {
    position: 'relative',
    margin: 'auto',
    overflow: 'hidden',
    backgroundColor: '#CCEAE3',
    flexDirection: "column", /* Optional. only if you want the items to wrap */
    justifyContent: 'center',/* For horizontal alignment */
    paddingBottom: '3%',
    paddingTop: '3%',
    paddingLeft: "3%",
    "&:hover >*": {
      visibility: 'visible',
    },
  },
  hidden: {
    visibility: 'hidden'
  },
  rotated: {
    transform: 'rotate(-90deg) translate(-100%, 0)',
    transformOrigin: 'top left',
    textAlign: "center",
    fontSize: "small"

  },
  shown: {
    visibility: 'visible'
  },
  overlay: {
    visibility: 'hidden',
    position: 'absolute',
    display: 'flex',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    transition: '.1s ease',
    backgroundColor: 'rgba(100, 100, 100, 0.7)',
  },
  negative: {
    position: 'relative',
    margin: 'auto',
    overflow: 'hidden',
    backgroundColor: '#E30613',
    flexDirection: "column", /* Optional. only if you want the items to wrap */
    justifyContent: 'center',/* For horizontal alignment */
    paddingBottom: '3%',
    paddingTop: '3%',
    paddingLeft: "5%",
    "&:hover >*": {
      visibility: 'visible',
    },

  },
  gridItem: {
    width: '33%',
    height: '33%'
  }
}));

const FilterBox = ({
  filterName,
  name: reference,
  filterActivationCallback,
  filterHeatmapCallback,
  relevance,
  filterIndex,
  images,
  filterImgSize,
  filterInspectionCallback,
  filterSamplesCallback,
  nameCallback,
  hasActivationStats,
  hasRelevanceStats,
  currentTab,
  filterPosition,
  target,
  placeholder,
  activation = null,
  partial = null,
  synthetic = null,
  position = null,
  view
}) => {
  const classes = useStyles(filterImgSize);
  const [partialState, setPartialState] = React.useState([]);

  const [syntheticState, setSyntheticState] = React.useState([]);
  const [actState, setActivations] = React.useState([]);
  const [imgState, setImages] = React.useState([]);
  const [isHovered, setHovered] = React.useState(false);
  const inputRef = React.useRef();

  async function triggerTransitionPiping(viewtype) {
    filterInspectionCallback(filterIndex, viewtype);
  }

  const plot = (svg) => {
    var element = svg.node().parentNode.parentNode;
    var position = element.getBoundingClientRect();
    var x = position.left;
    var y = position.top;
    let width = element.clientWidth;
    let height = element.clientHeight;
    console.log(x, y)
    let img = document.getElementsByClassName('ReactCrop__image')[1];

    const defs = svg.append("defs");
    const marker = defs.append("marker");
    const g = svg.append("g");
    const arrow = g.append("path")

  }

  React.useEffect(() => {
    const createBarPlot = () => {

      var canvas = d3.select(inputRef.current)
      var f = canvas.insert("svg", ":first-child")

      plot(f);
    }
    if (filterPosition) {
      console.log(filterPosition)
      //createBarPlot()

    }
  }, [filterPosition]);


  React.useEffect(() => {
    /*  console.log(inputRef);
     window.addEventListener('scroll', handleScroll, true);
     let svg = d3.select(inputRef.current)
       .append('svg')
       .attr('width', 500)
       .attr('height', 500)
     let rect_width = 95;
     svg.selectAll('rect')
       .data([100, 200])
       .enter()
       .append('rect')
       .attr('x', (d, i) => 5 + i * (rect_width + 5))
       .attr('y', d => 500 - d)
       .attr('width', rect_width)
       .attr('height', d => d)
       .attr('fill', 'teal'); */
    /*  const fWidth = getComputedStyle(document.getElementsByName('filter')[0])
       .getPropertyValue("width")
       .trim(); // the result have a leading whitespace.
     setFilterWidth(
       fWidth
     ); */

  }, []);


  var imageSize = images.length === 9 ? 4 : 12;

  const makeImages = async (images, stateToSet, name) => {

    if (images instanceof Array) {
      const filterImages = [];
      filterImages.push(

      )
      for (let i = 0; i < images.length; i++) {
        const img = `data:image/png;base64,${images[i]}`;
        filterImages.push(
          <img
            src={img} className={classes.image} id={"imgg"} key={`${reference}_image_index${i}`} name={'image'} alt="" />
        );
      }
      stateToSet(filterImages);
    } else {
      const filterImages = [];
      filterImages.push(
        <Typography key={1} className={classes.rotated}>{name}</Typography>
      )
      const img = `data:image/png;base64,${images}`;
      filterImages.push(
        <img
          src={img} className={classes.margins} key={`${reference}_image`} name={'image'} alt="" />
      );
      stateToSet(filterImages);
    }
  };

  React.useEffect(() => {
    if (activation && filterImgSize) {
      makeImages(activation, setActivations, "Activations");
    }
    else if (partial) {
      makeImages(partial, setPartialState, "R(x|theta={" + target + " or " + filterIndex + "})");
    }
    else if (synthetic) {
      makeImages(synthetic, setSyntheticState, "Synthetic");
    }
    if (images && filterImgSize) {
      makeImages(images, setImages, "Samples");
    }
  }, [activation, images, classes.image, reference, filterImgSize, imageSize]);

  const defaultFilter = <div className={classes.row, 'filters'} ref={inputRef}>
    <div className={relevance >= 0 ? classes.positive : classes.negative} name={'filter'}>
      <div className={classes.row} >
        <div >
        </div>
        <Typography variant="body1" fontWeight="300">
          Relevance
          :  {relevance}
        </Typography>
        <Typography variant="body1" style={{ marginLeft: 20 }}>
          Filter:  {filterIndex}
        </Typography>
        {filterName ? <Typography variant="body1" >
          Filter name:  {filterName}
        </Typography> : null}
      </div><div className={classes.row}>
        {partial ?
          <div className={classes.analysis}>{partialState}</div> : null}

        {synthetic ?
          <div className={classes.analysis}>{syntheticState}</div> : null}
        <div className={classes.row} style={{ flexWrap: 'wrap' }} >
          <div className={classes.row}>
            <Typography className={classes.rotated} >R(x|theta={filterIndex} )</Typography>
            <div className={classes.images}  >
              {actState}
            </div>
          </div>

          <div className={classes.row}>
            <Typography className={classes.rotated}>Sample</Typography>
            <div className={classes.images}  >
              {imgState}
            </div>
          </div>
        </div>
      </div>
      {view !== "GRAPHVIEW" ?
        <div className={classes.overlay}>
          <div className={classes.buttons}>
            {/*          <ButtonGroup className="mb-2" variant="contained" orientation='vertical' className={classes.buttonLeft} >
            <Button
              onClick={() => filterActivationCallback(filterIndex)}
            ><ChevronLeftIcon></ChevronLeftIcon>
              Show Activation
            </Button>
            <Button
              onClick={() => filterHeatmapCallback(filterIndex)}
            ><ChevronLeftIcon></ChevronLeftIcon>
              Show Partial Heatmap
            </Button>
            <Button
              onClick={() => filterSamplesCallback(filterIndex)}
            ><ExpandMoreIcon></ExpandMoreIcon>
              Show more Samples
            </Button>
          </ButtonGroup>
 */}{/* 
          <InputWidget filterNameCallback={nameCallback} value={1} id={'filter'}></InputWidget> */}
            {((currentTab === 'activation' && hasActivationStats) || (currentTab === 'relevance' && hasRelevanceStats)) ?
              <ButtonGroup className="mb-2" variant="contained" orientation='vertical' className={classes.buttonRight} >
                <Button onClick={() => triggerTransitionPiping('GRAPHVIEW')}
                >
                  Show Graph <ChevronRightIcon></ChevronRightIcon>
                </Button>
                <Button onClick={() => triggerTransitionPiping('STATISTICSVIEW')}
                >
                  Show Statistics <ChevronRightIcon></ChevronRightIcon>
                </Button>
              </ButtonGroup>
              : <ButtonGroup className="mb-2" variant="contained" orientation='vertical' className={classes.buttonRight} >
                <Button onClick={() => triggerTransitionPiping('GRAPHVIEW')}
                >
                  Show Graph <ChevronRightIcon></ChevronRightIcon>
                </Button>
              </ButtonGroup>
            }
          </div>
          {/*         <div className={classes.add} onClick={() => filterSamplesCallback(filterIndex)}>
          <Typography variant="body1" gutterBottom className={classes.caption}>
            <AddCircleOutlineOutlinedIcon fontSize='large' />
            more samples
          </Typography>
        </div> */}

        </div>

        : null}

    </div >
  </div>;


  return (
    <Grid item xl={12} lg={12} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onDragStart={(e) => { e.preventDefault() }}>
      {defaultFilter}
    </Grid>
  );
};
FilterBox.propTypes = {
  filterAmount: PropTypes.number,
  name: PropTypes.string,
  parentCallback: PropTypes.func,
  viewState: PropTypes.string,
  relevance: PropTypes.string,
  filterIndex: PropTypes.number,
  filterImgSize: PropTypes.number
};

export default FilterBox;
