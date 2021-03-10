import React from 'react';
import { makeStyles, Card, Grid } from '@material-ui/core';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import SamplesSwitch from '../widgets/SamplesSwitch';
import FilterSlider from '../widgets/FilterSlider';

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

const BottomComponent = ({ bottomCallback, filterAmount }) => {
  const classes = useStyles();

  const filterAmountCallback = value => {
    bottomCallback(value);
  };

  return (
    <Card className={clsx(classes.root)}>
      <Grid container spacing={8}>
        <Grid item xs={4}>
          <FilterSlider
            filtersCallback={filterAmountCallback}
            selectedAmount={filterAmount}
          />
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
BottomComponent.propTypes = {
  bottomCallback: PropTypes.func
};

export default BottomComponent;
