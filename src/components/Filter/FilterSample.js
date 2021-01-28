import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { Box, CardContent, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '92%',
    paddingBottom: '20%',
    position: 'absolute',
    backgroundColor: 'yellow'
  },
  image: {
    width: '100px',
    height: '100px'
  }
}));

const FilterSample = ({
  callback, viewState, images, reference
}) => {
  const [view, changeView] = React.useState(viewState);
  const [imgState, setImages] = React.useState([]);
  const classes = useStyles();

  async function makeImages() {
    const filterImages = [];
    for (let i = 0; i < images.length; i++) {
      const img = `data:image/png;base64,${images[i]}`;
      filterImages.push(
        <img
          src={img}
          className={classes.image}
          key={`${reference}_image_index${i}`}
          alt=""
        />
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
    <Box className={clsx(classes.root)}>
      <CardContent onClick={() => changeView('FILTERVIEW')}>
        {imgState}
      </CardContent>
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
