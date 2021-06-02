import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography, makeStyles, Container, Button, ButtonGroup } from '@material-ui/core';


const useStyles = makeStyles(() => ({
  image: () => ({
    border: '1px solid #555',
    verticalAlign: 'middle',
    width: '100%',
    height: '100%',
    display: 'block'
  }),
  typography: {
    wordWrap: 'break-word',
    height: '10%'
  },
  centering: {
    textAlign: 'center',
    maxHeight: '100%'
  },
  height: {
    height: '80%',
    width: '80%',
    display: 'grid',
    gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)'
  },
  positive: {
    backgroundColor: '#CCEAE3',
    display: 'flex',
    flexWrap: 'wrap', /* Optional. only if you want the items to wrap */
    justifyContent: 'center',/* For horizontal alignment */
    alignItems: 'center',
    paddingBottom: '5%',
    paddingTop: '5%',

  },
  test: {
    padding: '10px',
    overflow: 'hidden',
    minWidth: '0'
  },
  negative: {
    backgroundColor: '#E30613',
    display: 'flex',
    flexWrap: 'wrap', /* Optional. only if you want the items to wrap */
    justifyContent: 'center',/* For horizontal alignment */
    alignItems: 'center',
    paddingBottom: '5%',
    paddingTop: '5%'

  },
  gridItem: {
    width: '33%',
    height: '33%'
  }
}));

const FilterBox = ({
  filterAmount,
  name: reference,
  filterHeatmapCallback,
  relevance,
  filterIndex,
  images,
  filterImgSize,
  filterGraphCallback
}) => {
  const classes = useStyles(filterImgSize);
  const [imgState, setImages] = React.useState([]);
  const [filterWidth, setFilterWidth] = React.useState(null);

  const [isHovered, setHovered] = React.useState(false);


  React.useLayoutEffect(() => {
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

  var filterSize =
    filterAmount === 2
      ? 6
      : filterAmount === 4
        ? 6
        : filterAmount === 6
          ? 4
          : filterAmount === 8
            ? 3
            : 3;

  const defaultFilter = <div className={relevance >= 0 ? classes.positive : classes.negative} style={{ height: filterWidth }} name={'filter'}>
    <div className={classes.typography}>

      <Typography variant="body1" gutterBottom>
        Filter:
               {filterIndex}
      </Typography>

      <Typography variant="body1" gutterBottom>
        Contribution:
               {relevance}
      </Typography>
    </div>
    <div className={classes.height}  >

      {imgState}

    </div> </div>;
  const flippedFilter = <div className={relevance >= 0 ? classes.positive : classes.negative} style={{ height: filterWidth }} name={'filter'}>
    <div className={classes.typography}>
      <ButtonGroup className="mb-2" variant="contained" >

        <Button
          onClick={() => filterHeatmapCallback(filterIndex)}
        >
          Show Heatmap
            </Button>
        <Button onClick={() => filterGraphCallback(filterIndex)}

        >
          Show Graph
    </Button>


      </ButtonGroup>


    </div>
  </div>;

  return (
    <Grid item xl={filterSize} lg={filterSize} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onDragStart={(e) => { e.preventDefault() }}>
      {isHovered ? flippedFilter : defaultFilter}


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
