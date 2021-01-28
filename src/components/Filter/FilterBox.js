import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import {
  Box, CardContent, Typography, makeStyles
} from '@material-ui/core';

import FilterSample from './FilterSample';

const useStyles = makeStyles(() => ({
  root: {
    float: 'left',
    width: '30%',
    paddingBottom: '30%' /* = width for a 1:1 aspect ratio */,
    margin: '1.66%',
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    position: 'relative'
  },
  text: {
    padding: '2%'
  }
}));

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
  const classes = useStyles();
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
    <Box className={clsx(classes.root)}>
      <CardContent>
        <Typography className={clsx(classes.text)}>
          Filter:
          {' '}
          {filterIndex}
          {' '}
        </Typography>

        <Typography className={clsx(classes.text)}>
          Contribution:
          {' '}
          {relevance}
        </Typography>
        <FilterSample
          callback={callback}
          reference={name}
          images={imgs}
          viewState={viewState}
        />
      </CardContent>
    </Box>
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
