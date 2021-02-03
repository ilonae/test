import React from 'react';
import { Container, Grid } from '@material-ui/core';
import FilterContainer from 'src/components/Filter/FilterContainer';
import ImagesContainer from '../components/Sidebar/ImagesContainer';
import NetworkContainer from '../components/Network/NetworkContainer';
import SimpleBottomNavigation from '../components/BottomBar/BottomBar';

const Dashboard = () => {
  const [isExpanded, changeLayout] = React.useState('DEFAULTVIEW');

  const [amount, changeAmount] = React.useState(0);
  const [layer, changeLayer] = React.useState(0);

  const viewState = (value) => {
    changeLayout(value);
  };

  const layerState = (value) => {
    changeLayer(value);
  };

  const filterAmount = (value) => {
    changeAmount(value);
  };

  return (
    <div>
      <Container maxWidth="xl">
        {(function () {
          switch (isExpanded) {
          case 'IMAGEVIEW':
            return (
              <Grid container spacing={3}>
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <ImagesContainer
                    layerCallback={layerState}
                    viewCallback={viewState}
                    viewState={isExpanded}
                  />
                  <SimpleBottomNavigation />
                </Grid>
              </Grid>
            );
          case 'DEFAULTVIEW':
            return (
              <Grid container spacing={3}>
                <Grid item lg={2} md={2} xl={2} xs={2}>
                  <ImagesContainer
                    layerCallback={layerState}
                    viewCallback={viewState}
                    viewState={isExpanded}
                  />
                </Grid>
                <Grid item lg={10} md={10} xl={10} xs={10}>
                  <FilterContainer
                    filterAmount={amount}
                    parentCallback={viewState}
                    layerState={layer}
                    viewState={isExpanded}
                  />
                  <SimpleBottomNavigation callback={filterAmount} />
                </Grid>
              </Grid>
            );
          case 'FILTERVIEW':
            return (
              <Grid container spacing={3}>
                <Grid item lg={12} md={12} xl={12} xs={12}>
                  <NetworkContainer />
                  <SimpleBottomNavigation callback={filterAmount} />
                </Grid>
              </Grid>
            );
          default:
            return (
              <Grid container spacing={3}>
                <Grid item lg={2} md={2} xl={2} xs={2}>
                  <ImagesContainer
                    layerCallback={layerState}
                    viewCallback={viewState}
                    viewState={isExpanded}
                  />
                </Grid>
                <Grid item lg={10} md={10} xl={10} xs={10}>
                  <FilterContainer
                    filterAmount={amount}
                    parentCallback={viewState}
                    layerState={layer}
                    viewState={isExpanded}
                  />
                  <SimpleBottomNavigation callback={filterAmount} />
                </Grid>
              </Grid>
            );
          }
        }())}
      </Container>
    </div>
  );
};

export default Dashboard;
