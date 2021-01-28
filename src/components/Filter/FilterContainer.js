import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  makeStyles,
  Typography
} from '@material-ui/core';
import FilterBox from './FilterBox';

const useStyles = makeStyles(() => ({
  root: {
    height: '90vh',
    position: 'relative',
    overflow: 'auto'
  }
}));

const FilterContainer = ({ parentCallback, viewState, layerState }) => {
  const [isFilterView, changeView] = React.useState(viewState);
  const [layer, setLayer] = React.useState(layerState);
  const [filters, setFilter] = React.useState('');
  const [count, setCount] = React.useState(1);

  const classes = useStyles();

  const callback = (value) => {
    changeView(value);
  };

  async function getFilters() {
    await fetch('/api/get_filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        layer: count,
        filter_indices: `${0}:${6}`,
        sorting: 'max',
        sample_indices: '0:9',
        image_index: layer
      })
    }).then((response) => {
      if (response.ok) {
        response.json().then((json) => {
          const obj = JSON.parse(json);
          const filterIndices = obj.filter_indices;
          const filterBox = [];
          for (let i = 0; i < filterIndices.length; i++) {
            filterBox.push(
              <FilterBox
                images={obj.images[i]}
                filterIndex={filterIndices[i]}
                parentCallback={callback}
                key={`filter_index_${i}`}
                viewState={viewState}
                relevance={obj.relevance[i]}
              />
            );
          }
          setFilter(filterBox);
        });
      }
    });
  }

  React.useEffect(() => {
    getFilters();
  }, []);

  React.useEffect(() => {
    parentCallback(isFilterView);
  }, [isFilterView]);

  React.useEffect(() => {
    setLayer(layerState);
    getFilters();
  }, [layerState]);

  return (
    <Card className={clsx(classes.root)}>
      <CardContent>
        <Box position="relative">
          <Typography onClick={() => setCount(count + 1)}>
            Selected Layer:
            {count}
          </Typography>
          {filters}
        </Box>
      </CardContent>
    </Card>
  );
};

FilterContainer.propTypes = {
  parentCallback: PropTypes.func,
  layerState: PropTypes.number,
  viewState: PropTypes.string
};

export default FilterContainer;
