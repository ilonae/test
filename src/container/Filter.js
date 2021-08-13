import React from 'react';
import PropTypes from 'prop-types';

import * as d3 from 'd3';

import { Grid, Typography, makeStyles, Container, Button, ButtonGroup } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


const useStyles = makeStyles(() => ({
  image: () => ({
    border: '1px solid #555',
    verticalAlign: 'middle',
    width: '100%',
    height: '100%',
    display: 'block'
  }),
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
    display: 'inline-flex',
    gap: '2em',
    alignItems: "center",
  },
  centering: {
    textAlign: 'center',
    maxHeight: '100%'
  },
  images: {
    height: 'auto',
    width: '90%',
    display: 'grid',
    marginTop: '1em',
    gridTemplateColumns: 'repeat(9, 1fr)',
    gap: "1em"
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
    paddingLeft: "5%",
    "&:hover >*": {
      visibility: 'visible',
    },
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
  test: {
    padding: ' 2px',
    overflow: 'hidden',
    minWidth: '0'
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
  filterAmount,
  name: reference,
  filterActivationCallback,
  filterHeatmapCallback,
  relevance,
  filterIndex,
  images,
  filterImgSize,
  filterGraphCallback,
  filterStatisticsCallback,
  filterSamplesCallback
}) => {
  const classes = useStyles(filterImgSize);
  const [imgState, setImages] = React.useState([]);
  const [filterWidth, setFilterWidth] = React.useState(null);

  const [isHovered, setHovered] = React.useState(false);

  const inputRef = React.useRef();

  function triggerTransitionPiping() {

    d3.select(inputRef.current)

      // First, make the bar wider
      .transition()
      .duration(2000)
      .attr("width", "400")

      // Second, higher
      .transition()
      .attr("height", "100")

      // Change its color
      .transition()
      .style("fill", "red")

      // And now very small
      .transition()
      .duration(200)
      .attr("height", "10")
      .attr("width", "10")
  }


  React.useEffect(() => {
    console.log(inputRef);
    let svg = d3.select(inputRef.current)
      .append('svg')
      .attr('width', 500)
      .attr('height', 500);
    let rect_width = 95;
    svg.selectAll('rect')
      .data([100, 200])
      .enter()
      .append('rect')
      .attr('x', (d, i) => 5 + i * (rect_width + 5))
      .attr('y', d => 500 - d)
      .attr('width', rect_width)
      .attr('height', d => d)
      .attr('fill', 'teal');
    const fWidth = getComputedStyle(document.getElementsByName('filter')[0])
      .getPropertyValue("width")
      .trim(); // the result have a leading whitespace.
    setFilterWidth(
      fWidth
    );

  }, []);


  var imageSize = images.length === 9 ? 4 : 12;

  React.useEffect(() => {
    const makeImages = async () => {
      const filterImages = [];
      for (let i = 0; i < images.length; i++) {
        const img = `data:image/png;base64,${images[i]}`;
        filterImages.push(
          <Container xs={imageSize} className={classes.test} key={`${reference}_image_index${i}`}>
            <img src={img} className={classes.image} name={'image'} alt="" />
          </Container>
        );
      }
      setImages(filterImages);
    };
    if (images && filterImgSize) {

      makeImages();
    }

  }, [images, classes.image, reference, filterImgSize, imageSize]);

  const defaultFilter =
    <div className={relevance >= 0 ? classes.positive : classes.negative} name={'filter'}>
      <div className={classes.row}>
        <div ref={inputRef}>
        </div>
        <Typography variant="body1" gutterBottom fontWeight="300">
          Relevance:  {relevance}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Filter:  {filterIndex}
        </Typography>
      </div>
      <div className={classes.row}>
        <div className={classes.images}  >
          {imgState}
        </div>

      </div>
      <div className={classes.overlay}>
        <div className={classes.buttons}>
          <ButtonGroup className="mb-2" variant="contained" orientation='vertical' className={classes.buttonLeft} >
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

          <ButtonGroup className="mb-2" variant="contained" orientation='vertical' className={classes.buttonRight} >
            <Button onClick={() => filterGraphCallback(filterIndex)}
            >
              Show Graph <ChevronRightIcon></ChevronRightIcon>
            </Button>
            <Button onClick={() => (triggerTransitionPiping(), filterStatisticsCallback(filterIndex))}
            >
              Show Statistics <ChevronRightIcon></ChevronRightIcon>
            </Button>
          </ButtonGroup>
        </div>
        {/*         <div className={classes.add} onClick={() => filterSamplesCallback(filterIndex)}>
          <Typography variant="body1" gutterBottom className={classes.caption}>
            <AddCircleOutlineOutlinedIcon fontSize='large' />
            more samples
          </Typography>
        </div> */}

      </div>
    </div >;


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
  relevance: PropTypes.number,
  filterIndex: PropTypes.number,
  images: PropTypes.array,
  filterImgSize: PropTypes.number
};

export default FilterBox;
