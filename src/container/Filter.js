import React from 'react';
import PropTypes from 'prop-types';

import { Box, Grid, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  image: {
    width: '100px',
    height: '100px',
    border: '1px solid #555'
  },
  typography: { wordWrap: 'break-word' },
  positive: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingTop: '5%',
    width: '90%',
    marginRight: '1%'
  },
  negative: {
    backgroundColor: 'rgba(0, 0, 255, 0.2)',
    paddingTop: '5%',
    width: '90%',
    marginRight: '1%'
  }
}));

const FilterBox = ({
  name: reference,
  parentCallback,
  viewState,
  relevance,
  filterIndex,
  images
}) => {
  const classes = useStyles();
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

  return (
    <Grid item xl={4} lg={4} md={6} xs={6}>
      <div className={relevance >= 0 ? classes.positive : classes.negative}>
        <Box mx={3} className={classes.typography}>
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
          <Grid container onClick={() => parentCallback()}>
            {imgState}
          </Grid>
        </Box>
      </div>
    </Grid>
  );
};
FilterBox.propTypes = {
  name: PropTypes.string,
  parentCallback: PropTypes.func,
  viewState: PropTypes.string,
  relevance: PropTypes.number,
  filterIndex: PropTypes.number,
  images: PropTypes.array
};

export default FilterBox;
