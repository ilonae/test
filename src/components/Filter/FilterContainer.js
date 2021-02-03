import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box, Card, CardContent, makeStyles, Grid
} from '@material-ui/core';
import FilterBox from './FilterBox';
import LayerSwitch from './LayerSwitch';
import SortingSwitch from './SortingSwitch';

const useStyles = makeStyles(() => ({
  root: {
    height: '90vh',
    position: 'relative',
    overflow: 'auto'
  },
  content: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

const FilterContainer = ({ parentCallback, viewState, layerState }) => {
  const [isFilterView, changeView] = React.useState(viewState);
  const [layer, setLayer] = React.useState(layerState);
  const [filters, setFilter] = React.useState('');
  const [count, setCount] = React.useState(1);
  const [order, setOrder] = React.useState('max');

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
        sorting: order,
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

  const indexCallback = (value) => {
    setCount(value);
  };

  const sortingCallback = (value) => {
    console.log(value);
    if (value === true) {
      setOrder('max');
    } else {
      setOrder('min');
    }
  };

  React.useEffect(() => {
    parentCallback(isFilterView);
  }, [isFilterView]);

  React.useEffect(() => {
    setLayer(layerState);
    getFilters();
  }, [layerState, count, order]);

  return (
    <Card className={clsx(classes.root)}>
      <Grid container spacing={3}>
        <CardContent>
          <Grid item xs={12}>
            <div className={clsx(classes.content)}>
              <LayerSwitch parentCallback={indexCallback} />

              <SortingSwitch parentCallback={sortingCallback} />
            </div>
          </Grid>
          <Box mt={6}>
            <Grid container spacing={3}>
              {filters}
            </Grid>
          </Box>
        </CardContent>
      </Grid>
    </Card>
  );
};

FilterContainer.propTypes = {
  parentCallback: PropTypes.func,
  layerState: PropTypes.number,
  viewState: PropTypes.string
};

export default FilterContainer;
