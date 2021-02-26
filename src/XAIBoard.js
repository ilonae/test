import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';

import { Container, Grid } from '@material-ui/core';
import FilterComponent from './components/FilterComponent';
import ImagesComponent from './components/ImagesComponent';
import NetworkComponent from './components/NetworkComponent';
import BottomComponent from './components/BottomComponent';

const XAIBoard = () => {
  const [isExpanded, changeLayout] = React.useState('DEFAULTVIEW');
  const [filterAmount, changeFilterAmount] = React.useState(0);
  const [index, changeIndex] = React.useState(0);
  const [experiment, changeExperiment] = React.useState('');
  const [method, changeMethod] = React.useState('');
  const [layer, changeLayer] = React.useState([]);

  const [layers, setLayers] = React.useState();
  const [methods, setMethods] = React.useState();
  const [datasets, setExperiments] = React.useState();

  const viewState = value => {
    changeLayout(value);
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
    console.log(value);
    changeFilterAmount(value);
  };

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
          console.log(obj.layers);
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
          viewState={isExpanded}
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
          viewState={isExpanded}
          experiment={experiment}
          method={method}
        />
      </Grid>
      <Grid item lg={10} md={10} xl={10} xs={10}>
        <FilterComponent
          filterAmount={filterAmount}
          experimentsCallbackParent={selectedExperiment}
          methodsCallbackParent={selectedMethod}
          parentCallback={viewState}
          indexState={index}
          viewState={isExpanded}
          layers={layer}
          methods={methods}
          datasets={datasets}
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
          switch (isExpanded) {
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
