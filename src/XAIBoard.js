import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';

import { Container, Grid } from '@material-ui/core';
import FilterComponent from './components/FilterComponent';
import ImagesComponent from './components/ImagesComponent';
import NetworkComponent from './components/NetworkComponent';
import BottomComponent from './components/BottomComponent';

const XAIBoard = () => {
  const [viewType, changeViewType] = React.useState('DEFAULTVIEW');
  const [filterAmount, changeFilterAmount] = React.useState();
  const [index, changeIndex] = React.useState(0);
  const [experiment, changeExperiment] = React.useState('');
  const [method, changeMethod] = React.useState('');
  const [layer, changeLayer] = React.useState([]);

  const [layers, setLayers] = React.useState();
  const [methods, setMethods] = React.useState();
  const [models, setExperiments] = React.useState();

  const getFilterHeatmap = () => {
    console.log('test');
    getSingleHeatmap();
  };

  const viewState = value => {
    changeViewType(value);
  };

  const indexState = value => {
    changeIndex(value);
  };

  const selectedExperiment = value => {
    changeExperiment(value);
  };

  const selectedMethod = value => {
    changeMethod(value);
  };

  const selectedFilterAmount = value => {
    changeFilterAmount(value);
  };

  const getSingleHeatmap = React.useCallback(async () => {
    await fetch('/api/get_heatmap_filter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        experiment: experiment,
        image_index: index,
        method: method,
        filter_index: 1
      })
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          console.log(json);
        });
      }
    });
  }, [index, method, experiment]);

  async function getSettings() {
    await fetch('/api/get_XAI_available', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        response.json().then(json => {
          const obj = JSON.parse(json);
          const experiments = obj.experiments;
          const methods = obj.methods;
          const layers = obj.layers;
          setLayers(layers);
          setMethods(methods);
          setExperiments(experiments);
        });
      }
    });
  }

  React.useEffect(() => {
    if (layers) {
      changeLayer(layers[experiment]);
    }
  }, [experiment, layers]);

  React.useEffect(() => {
    getSettings();
  }, []);

  const imageGrid = (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <ImagesComponent
          expansionCallback={viewState}
          indexCallback={indexState}
          viewCallback={viewState}
          viewState={viewType}
          experiment={experiment}
          method={method}
        />
        <BottomComponent bottomCallback={selectedFilterAmount} />
      </Grid>
    </Grid>
  );

  const defaultGrid = (
    <Grid container spacing={3}>
      <Grid item lg={2} md={2} xl={2} xs={2}>
        <ImagesComponent
          expansionCallback={viewState}
          indexCallback={indexState}
          viewCallback={viewState}
          viewState={viewType}
          experiment={experiment}
          method={method}
        />
      </Grid>
      <Grid item lg={10} md={10} xl={10} xs={10}>
        <FilterComponent
          filterAmount={filterAmount}
          models={models}
          experimentsCallbackParent={selectedExperiment}
          filterHeatmapCallback={getFilterHeatmap}
          methodsCallbackParent={selectedMethod}
          parentCallback={viewState}
          indexState={index}
          viewState={viewType}
          layers={layer}
          methods={methods}
        />
        <BottomComponent bottomCallback={selectedFilterAmount} />
      </Grid>
    </Grid>
  );

  const filterGrid = (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xl={12} xs={12}>
        <NetworkComponent />
        <BottomComponent bottomCallback={selectedFilterAmount} />
      </Grid>
    </Grid>
  );

  return (
    <div>
      <Container maxWidth="xl">
        {(function() {
          switch (viewType) {
            case 'IMAGEVIEW':
              return imageGrid;
            case 'DEFAULTVIEW':
              return defaultGrid;
            case 'FILTERVIEW':
              return filterGrid;
            default:
              return defaultGrid;
          }
        })()}
      </Container>
    </div>
  );
};

export default XAIBoard;
