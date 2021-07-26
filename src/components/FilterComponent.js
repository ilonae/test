import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Card, makeStyles, Grid } from '@material-ui/core';
import Filter from '../container/Filter';
import SortingButton from '../widgets/SortingButton';

import Selection from '../widgets/Selection';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '74vh',
    position: 'relative',
    overflow: 'auto'
  },
  [theme.breakpoints.up('md')]: {
    root: {
      height: '84vh'
    },
  },
  innergrid: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '1em',

  },

  grid: { width: '100%' },
  centering: {
    paddingLeft: '3vh',
    paddingBottom: '5vh',
    justifyContent: 'center'
  }
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
  filters,
  filterImgSize,
  indexCallback,
}) => {
  const [filterBoxes, setFilterBoxes] = React.useState([]);
  const [filterIndex, setFilterIndex] = React.useState(0);
  const classes = useStyles();

  const experimentsCallback = value => {
    experimentsCallbackParent(value);
  };

  const filterGraphCallback = value => {
    setFilterIndex(value)
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
    if (filterIndex) {
      parentCallback('GRAPHVIEW');
      indexCallback(filterIndex);

    }
  }, [parentCallback, filterIndex]);

  React.useEffect(() => {

    if (filters) {

      const filterIndices = filters.filter_indices;
      const filterBox = [];
      for (let i = 0; i < filterIndices.length; i++) {
        const currIndex = filterIndices[i];
        filterBox.push(
          <Filter
            filterAmount={filterIndices.length}
            images={filters.images[currIndex]}
            filterIndex={currIndex}
            filterHeatmapCallback={filterHeatmapCallback}
            key={`filter_index_${i}`}
            relevance={filters.relevance[i]}
            filterImgSize={filterImgSize}
            filterGraphCallback={filterGraphCallback}
          />
        );
      }
      setFilterBoxes(filterBox);
    }
  }, [filters, viewState, filterHeatmapCallback]);
  return (
    <Card className={clsx(classes.root)} name={'filterCard'}>
      <Grid className={classes.grid} container spacing={5}>
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

        <Grid item xs={12}>
          <Grid container spacing={5} className={classes.centering} >
            {filterBoxes}
          </Grid>
        </Grid>
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
  models: PropTypes.array,
  filterImgSize: PropTypes.number
};

export default FilterComponent;
