import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  image: {
    width: '100%'
  }
}));

const FilterSample = ({ callback, viewState, images, reference }) => {
  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);
  const [imgState, setImages] = React.useState([]);

  React.useEffect(() => {
    const makeImages = async () => {
      const filterImages = [];
      for (let i = 0; i < images.length; i++) {
        const img = `data:image/png;base64,${images[i]}`;
        filterImages.push(
          <Grid item xs={4} key={`${reference}_image_index${i}`}>
            <img src={img} className={classes.image} alt="" />
          </Grid>
        );
      }
      setImages(filterImages);
    };
    makeImages();
  }, [images, classes.image, reference]);

  React.useEffect(() => {
    callback(view);
  }, [view, callback]);

  return (
    <Box p={3}>
      <Grid container spacing={1} onClick={() => changeView('FILTERVIEW')}>
        {imgState}
      </Grid>
    </Box>
  );
};

FilterSample.propTypes = {
  callback: PropTypes.func,
  viewState: PropTypes.string,
  images: PropTypes.array,
  reference: PropTypes.string
};

export default FilterSample;
