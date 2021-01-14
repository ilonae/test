import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import FilterRepresentation from './dashboard/Filter/FilterRepresentation';
import ImagesContainer from './dashboard/Images/ImagesContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(0)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Dashboard"
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <ImagesContainer />
          </Grid>

          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <FilterRepresentation />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
