import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Box, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  image: {
    width: '100%'
  }
}));

const FilterSample = ({
  callback, viewState, images, reference
}) => {
  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);
  const [imgState, setImages] = React.useState([]);

  async function makeImages() {
    const filterImages = [];
    for (let i = 0; i < images.length; i++) {
      const img = `data:image/png;base64,${images[i]}`;
      filterImages.push(
        <Grid item xs={4}>
          <img
            src={img}
            className={classes.image}
            key={`${reference}_image_index${i}`}
            alt=""
          />
        </Grid>
      );
    }
    setImages(filterImages);
  }
  React.useEffect(() => {
    makeImages();
  }, [images]);

  React.useEffect(() => {
    callback(view);
  }, [view]);

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
