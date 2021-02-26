import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Box, Card, makeStyles, Grid } from '@material-ui/core';
import FilterBox from '../container/Filter';
import LayerSelection from '../widgets/LayerSelection';
import MethodSelection from '../widgets/MethodSelection';
import SortingButton from '../widgets/SortingButton';

import ExperimentSelection from '../widgets/ExperimentSelection';

const useStyles = makeStyles(() => ({
  root: {
    height: '85vh',
    position: 'relative',
    overflow: 'auto'
  }
}));

const FilterComponent = ({
  parentCallback,
  viewState,
  indexState,
  filterAmount,
  layers,
  methods,
  datasets,
  experimentsCallbackParent,
  methodsCallbackParent
}) => {
  const [isFilterView, changeView] = React.useState(viewState);
  const [index, setIndex] = React.useState(1);
  const [method, setMethod] = React.useState('epsilon_plus');
  const [experiment, setExperiment] = React.useState('LeNet');
  const [filters, setFilter] = React.useState('');
  const [layer, selectLayer] = React.useState('l1');
  const [order, setOrder] = React.useState('max');

  const classes = useStyles();

  const callback = value => {
    changeView(value);
  };

  const experimentsCallback = value => {
    setExperiment(value);
    experimentsCallbackParent(value);
  };

  const methodsCallback = value => {
    setMethod(value);
    methodsCallbackParent(value);
  };

  const getFilters = React.useCallback(async () => {
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
          console.log(filterBox.length);
          setFilter(filterBox);
        });
      }
    });
  }, [layer, filterAmount, index, order, viewState, method, experiment]);

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
    if (
      (layer &&
        filterAmount &&
        index &&
        order &&
        viewState &&
        method &&
        experiment) !== null
    ) {
      setIndex(indexState);
      getFilters();
    }
  }, [indexState, layer, order, getFilters, method]);

  return (
    <Card className={clsx(classes.root)}>
      <Grid m={6} style={{ width: '100%' }} container spacing={3}>
        <Grid
          item
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: '1em'
          }}
          xs={12}
        >
          <ExperimentSelection
            parentCallback={experimentsCallback}
            datasets={datasets}
          />
          <LayerSelection parentCallback={layerCallback} layers={layers} />
          <MethodSelection parentCallback={methodsCallback} methods={methods} />
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
  methods: PropTypes.array
};

export default FilterComponent;
