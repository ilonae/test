import React from 'react';
import PropTypes from 'prop-types';

import { Box, Grid, Typography } from '@material-ui/core';

import FilterSample from './FilterSample';

const FilterBox = ({
  name,
  parentCallback,
  viewState,
  relevance,
  filterIndex,
  images
}) => {
  const [isFilterView, changeView] = React.useState(viewState);
  const [imgs, setImgs] = React.useState([]);
  const callback = (value) => {
    changeView(value);
  };
  React.useEffect(() => {
    parentCallback(isFilterView);
  }, [isFilterView]);

  React.useEffect(() => {
    setImgs(images);
  }, [images]);

  return (
    <Grid item xl={4} lg={4} md={6} xs={6}>
      <Box mx={3} style={{ wordWrap: 'break-word' }}>
        <Typography>
          Filter:
          {filterIndex}
        </Typography>

        <Typography>
          Contribution:
          {relevance}
        </Typography>
      </Box>
      <FilterSample
        callback={callback}
        reference={name}
        images={imgs}
        viewState={viewState}
      />
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
