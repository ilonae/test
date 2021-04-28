import React from 'react';
import PropTypes from 'prop-types';

import { Box, Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({

  image:(filterImageSize)=>({
    border: '1px solid #555',
  maxWidth: '100%',
  maxHeight: '100%',
  width: filterImageSize,
  height: filterImageSize,
 }),

  container:{
    textAlign: 'center',
    height: '100%'
  },
  wrapper:{
    backgroundColor: '#fff',
  height: '500px',
  width: '500px',
  },
  typography: {
    wordWrap: 'break-word'
  },
  positive: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    flexDirection: 'column',
    width: '100%'
  },
  negative: {
    backgroundColor: 'rgba(0, 0, 255, 0.2)',
    flexDirection: 'column',
    width: '100%'
  }
}));

const FilterBox = ({
  filterAmount,
  name: reference,
  parentCallback,
  viewState,
  relevance,
  filterIndex,
  images,
  filterImgSize,
  viewCallback
}) => {
  const classes = useStyles(filterImgSize);
  const [imgState, setImages] = React.useState([]);
  const [view, changeView] = React.useState(viewState);

  React.useEffect(() => {
    viewCallback(view);
  }, [view, viewCallback]);

  var imageSize = images.length === 9 ? 4 : 12;

  React.useEffect(() => {
    const makeImages = async () => {
      const filterImages = [];
      for (let i = 0; i < images.length; i++) {
        const img = `data:image/png;base64,${images[i]}`;
        filterImages.push(
          <Grid item xs={imageSize} className={classes.container} key={`${reference}_image_index${i}`}>
            <img src={img} className={classes.image} alt="" />
          </Grid>
        );
      }
      setImages(filterImages);
    };
   if(images && filterImgSize){
    console.log(filterImgSize)
    makeImages();
   }

  }, [images, classes.image, reference, filterImgSize, classes.container, imageSize]);

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

  return (
    <Grid item xl={filterSize} lg={filterSize} name={'filter'} onClick={() => changeView('FILTERVIEW')}>
      <div className={relevance >= 0 ? classes.positive : classes.negative}>
        <Box mx={3} className={classes.typography} pt={3}>
          <Typography>
            Filter: 
            {filterIndex}
          </Typography>

          <Typography>
            Contribution:
            {relevance}
          </Typography>
        </Box>
        <Box p={3}>
          <Grid container spacing={3} onClick={() => parentCallback()}>
            {imgState}
          </Grid>
        </Box>
      </div>
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
