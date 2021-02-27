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
  filterAmount,
  parentCallback,
  filterHeatmapCallback,
  viewState,
  indexState,
  layers,
  methods,
  models,
  experimentsCallbackParent,
  methodsCallbackParent
}) => {
  const [isFilterView, changeView] = React.useState(viewState);
  const [index, setIndex] = React.useState();
  const [method, setMethod] = React.useState();
  const [experiment, setExperiment] = React.useState();
  const [filters, setFilter] = React.useState();
  const [layer, selectLayer] = React.useState();
  const [order, setOrder] = React.useState('max');

  const classes = useStyles();

  const callback = () => {
    filterHeatmapCallback();
  };

  const experimentsCallback = value => {
    setExperiment(value);
    experimentsCallbackParent(value);
  };

  const methodsCallback = value => {
    setMethod(value);
    methodsCallbackParent(value);
  };

  async function getFilter() {
    await fetch('/api/get_filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        layer: layer,
        filter_indices: `${0}:${filterAmount}`,
        sorting: order,
        sample_indices: '0:9',
        experiment: experiment,
        image_index: index,
        method: method
      })
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          const obj = JSON.parse(json);
          const filterIndices = obj.filter_indices;
          const filterBox = [];
          for (let i = 0; i < filterIndices.length; i++) {
            filterBox.push(
              <Filter
                images={obj.images[i]}
                filterIndex={filterIndices[i]}
                parentCallback={callback}
                key={`filter_index_${i}`}
                viewState={viewState}
                relevance={obj.relevance[i]}
              />
            );
          }
          console.log(filterBox.length);
          setFilter(filterBox);
        });
      }
    });
  }

  React.useEffect(() => {
    if (
      (layer && filterAmount && order && experiment && index && method) !==
      undefined
    ) {
      getFilter();
    }
  }, [layer, filterAmount, order, index, method]);

  const layerCallback = value => {
    selectLayer(value);
  };

  const sortingCallback = value => {
    if (value === true) {
      setOrder('max');
    } else {
      setOrder('min');
    }
  };

  React.useEffect(() => {
    parentCallback(isFilterView);
  }, [isFilterView, parentCallback]);

  React.useEffect(() => {
    setIndex(indexState);
  }, [indexState]);

  return (
    <Card className={clsx(classes.root)}>
      <Grid m={6} className={classes.grid} container spacing={3}>
        <Grid item className={classes.innergrid} xs={12}>
          <Selection
            select={'Experiment'}
            parentCallback={experimentsCallback}
            params={models}
          />
          <Selection
            select={'Layer'}
            parentCallback={layerCallback}
            params={layers}
          />
          <Selection
            select={'Method'}
            parentCallback={methodsCallback}
            params={methods}
          />
          <SortingButton parentCallback={sortingCallback} />
        </Grid>

        <Box mt={3} px={1}>
          <Grid container spacing={3}>
            {filters}
          </Grid>
        </Box>
      </Grid>
    </Card>
  );
};

FilterComponent.propTypes = {
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
