import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Box, Card, makeStyles, Grid } from '@material-ui/core';
import Filter from '../container/Filter';
import SortingButton from '../widgets/SortingButton';

import Selection from '../widgets/Selection';

const useStyles = makeStyles(() => ({
  root: {
    height: '85vh',
    position: 'relative',
    overflow: 'auto'
  },
  innergrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '1em'
  },
  grid: { width: '100%' }
}));

const FilterComponent = ({
  selectedLayer,
  selectedExperiment,
  selectedMethod,
  parentCallback,
  filterHeatmapCallback,
  orderCallback,
  order,
  viewState,
  layers,
  methods,
  models,
  experimentsCallbackParent,
  methodsCallbackParent,
  layerCallbackParent,
  filters
}) => {
  const [isFilterView, changeView] = React.useState(viewState);
  const [method, setMethod] = React.useState('');
  const [filterBoxes, setFilterBoxes] = React.useState([]);
  const classes = useStyles();

  const callback = () => {
    filterHeatmapCallback();
  };

  const experimentsCallback = value => {
    experimentsCallbackParent(value);
  };

  const methodsCallback = value => {
    methodsCallbackParent(value);
  };

  const layerCallback = value => {
    layerCallbackParent(value);
  };

  const sortingCallback = value => {
    orderCallback(value);
  };

  React.useEffect(() => {
    parentCallback(isFilterView);
  }, [isFilterView, parentCallback]);

  React.useEffect(() => {
    if (filters) {
      console.log('passed');
      const filterIndices = filters.filter_indices;
      const filterBox = [];
      for (let i = 0; i < filterIndices.length; i++) {
        filterBox.push(
          <Filter
            images={filters.images[i]}
            filterIndex={filterIndices[i]}
            parentCallback={callback}
            key={`filter_index_${i}`}
            viewState={viewState}
            relevance={filters.relevance[i]}
          />
        );
      }
      setFilterBoxes(filterBox);
    }
  }, [filters]);
  return (
    <Card className={clsx(classes.root)}>
      <Grid m={6} className={classes.grid} container spacing={3}>
        <Grid item className={classes.innergrid} xs={12}>
          <Selection
            select={'Experiment'}
            selectedParam={selectedExperiment}
            parentCallback={experimentsCallback}
            params={models}
          />
          <Selection
            select={'Layer'}
            selectedParam={selectedLayer}
            parentCallback={layerCallback}
            params={layers}
          />
          <Selection
            select={'Method'}
            selectedParam={selectedMethod}
            parentCallback={methodsCallback}
            params={methods}
          />
          <SortingButton parentOrder={order} parentCallback={sortingCallback} />
        </Grid>

        <Box mt={3} px={1}>
          <Grid container spacing={3}>
            {filterBoxes}
          </Grid>
        </Box>
      </Grid>
    </Card>
  );
};

FilterComponent.propTypes = {
  selectedLayer: PropTypes.string,
  selectedExperiment: PropTypes.string,
  selectedMethod: PropTypes.string,
  order: PropTypes.string,
  parentCallback: PropTypes.func,
  experimentsCallbackParent: PropTypes.func,
  methodsCallbackParent: PropTypes.func,
  indexState: PropTypes.number,
  viewState: PropTypes.string,
  filterAmount: PropTypes.number,
  layers: PropTypes.array,
  methods: PropTypes.array,
  models: PropTypes.array
};

export default FilterComponent;
