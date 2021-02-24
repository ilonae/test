import React from 'react';
import { Container, Grid } from '@material-ui/core';
import FilterContainer from 'src/components/Filter/FilterContainer';
import ImagesContainer from '../components/Sidebar/ImagesContainer';
import NetworkContainer from '../components/Network/NetworkContainer';
import SimpleBottomNavigation from '../components/BottomBar/BottomBar';
import { get } from 'http';

const Dashboard = () => {
  const [isExpanded, changeLayout] = React.useState('DEFAULTVIEW');

  const [amount, changeAmount] = React.useState(0);
  const [index, changeIndex] = React.useState(0);
  const [experiment, changeExperiment] = React.useState('');
  const [method, changeMethod] = React.useState('');

  const [layers, setLayers] = React.useState();
  const [methods, setMethods] = React.useState();
  const [datasets, setDatasets] = React.useState();

  const [settingsReceived, setSettings] = React.useState(false);

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

  const filterAmount = value => {
    changeAmount(value);
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
          const layers = obj.layers['LeNet'];
          const methods = obj.methods;
          const datasets = obj.experiments;
          setLayers(layers);
          setMethods(methods);
          setDatasets(datasets);
          setSettings(true);
        });
      }
    });
  }

  React.useEffect(() => {
    getSettings();
  }, []);

  return (
    <div>
      <Container maxWidth="xl">
        {(function() {
          switch (isExpanded) {
            case 'IMAGEVIEW':
              return (
                <Grid container spacing={3}>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <ImagesContainer
                      expansionCallback={viewState}
                      indexCallback={indexState}
                      viewCallback={viewState}
                      viewState={isExpanded}
                      settings={settingsReceived}
                      experiment={experiment}
                      method={method}
                    />
                    <SimpleBottomNavigation bottomCallback={filterAmount} />
                  </Grid>
                </Grid>
              );
            case 'DEFAULTVIEW':
              return (
                <Grid container spacing={3}>
                  <Grid item lg={2} md={2} xl={2} xs={2}>
                    <ImagesContainer
                      expansionCallback={viewState}
                      indexCallback={indexState}
                      viewCallback={viewState}
                      viewState={isExpanded}
                      settings={settingsReceived}
                      experiment={experiment}
                      method={method}
                    />
                  </Grid>
                  <Grid item lg={10} md={10} xl={10} xs={10}>
                    <FilterContainer
                      filterAmount={amount}
                      experimentsCallbackParent={selectedExperiment}
                      methodsCallbackParent={selectedMethod}
                      parentCallback={viewState}
                      indexState={index}
                      viewState={isExpanded}
                      layers={layers}
                      methods={methods}
                      datasets={datasets}
                    />
                    <SimpleBottomNavigation bottomCallback={filterAmount} />
                  </Grid>
                </Grid>
              );
            case 'FILTERVIEW':
              return (
                <Grid container spacing={3}>
                  <Grid item lg={12} md={12} xl={12} xs={12}>
                    <NetworkContainer />
                    <SimpleBottomNavigation bottomCallback={filterAmount} />
                  </Grid>
                </Grid>
              );
            default:
              return (
                <Grid container spacing={3}>
                  <Grid item lg={2} md={2} xl={2} xs={2}>
                    <ImagesContainer
                      expansionCallback={viewState}
                      indexCallback={indexState}
                      viewCallback={viewState}
                      viewState={isExpanded}
                      settings={settingsReceived}
                      experiment={experiment}
                      method={method}
                    />
                  </Grid>
                  <Grid item lg={10} md={10} xl={10} xs={10}>
                    <FilterContainer
                      filterAmount={amount}
                      experimentsCallbackParent={selectedExperiment}
                      methodsCallbackParent={selectedMethod}
                      parentCallback={viewState}
                      indexState={index}
                      viewState={isExpanded}
                      layers={layers}
                      methods={methods}
                      datasets={datasets}
                    />
                    <SimpleBottomNavigation bottomCallback={filterAmount} />
                  </Grid>
                </Grid>
              );
          }
        })()}
      </Container>
    </div>
  );
};

export default Dashboard;
