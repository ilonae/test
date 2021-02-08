import React from 'react';
import { makeStyles, Card, Grid } from '@material-ui/core';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import SamplesSwitch from './SamplesSwitch';
import FilterSlider from './FilterSlider';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '10vh',
    marginTop: '2vh',
    position: 'relative',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: '1vh'
  }
});

const SimpleBottomNavigation = ({ bottomCallback }) => {
  const classes = useStyles();
  const [amount, changeAmount] = React.useState(6);

  const filterAmount = value => {
    changeAmount(value);
  };

  React.useEffect(() => {
    bottomCallback(amount);
  }, [amount]);

  return (
    <Card className={clsx(classes.root)}>
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <FilterSlider filtersCallback={filterAmount} />
        </Grid>
        <Grid item xs={4}>
          Placeholder
        </Grid>
        <Grid item xs={4}>
          <SamplesSwitch />
        </Grid>
      </Grid>
    </Card>
  );
};
SimpleBottomNavigation.propTypes = {
  bottomCallback: PropTypes.func
};

export default SimpleBottomNavigation;
