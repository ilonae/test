import React from 'react';
import PropTypes from 'prop-types';

import { Box, Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  image: {
    border: '1px solid #555',
    width: '100%',
    height: '100%'
  },
  typography: {
    wordWrap: 'break-word'
  },
  positive: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingBottom: '100%',
    flexDirection: 'column',
    width: '100%',
    height: '0'
  },
  negative: {
    backgroundColor: 'rgba(0, 0, 255, 0.2)',
    paddingBottom: '100%',
    flexDirection: 'column',
    width: '100%',
    height: '0'
  }
}));

const FilterBox = ({
  filterAmount,
  name: reference,
  parentCallback,
  viewState,
  relevance,
  filterIndex,
  images
}) => {
  const classes = useStyles();
  const [imgState, setImages] = React.useState([]);

  var imageSize = images.length === 9 ? 4 : 12;

  React.useEffect(() => {
    const makeImages = async () => {
      const filterImages = [];
      for (let i = 0; i < images.length; i++) {
        const img = `data:image/png;base64,${images[i]}`;
        filterImages.push(
          <Grid item xs={imageSize} key={`${reference}_image_index${i}`}>
            <img src={img} className={classes.image} alt="" />
          </Grid>
        );
      }
      setImages(filterImages);
    };
    makeImages();
  }, [images, classes.image, reference]);

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
    <Grid item xl={filterSize} lg={filterSize} name={'filter'}>
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
  images: PropTypes.array
};

export default FilterBox;
