import React from 'react';
import { makeStyles, Card, Grid, Typography } from '@material-ui/core';
import clsx from 'clsx';

import PropTypes from 'prop-types';
import SamplesSwitch from '../widgets/SamplesSwitch';
import FilterSlider from '../widgets/SliderWidget';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '16vh',
    marginTop: '2vh',
    position: 'relative',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: '3vh'
  },
  [theme.breakpoints.up('md')]: {
    root: {
      height: '6vh'
    },
  },
}));

const BottomComponent = ({
  modus,
  bottomCallback,
  filterAmount,
  isSynthLayer,
  isCnnLayer,
  isCnnCallback,
  isSynthCallback,
  selectedButtonCallback
}) => {
  const classes = useStyles();

  const filterAmountCallback = value => {
    bottomCallback(value);
  };
  const activationsCallback = value => {
    isCnnCallback(value);
  };

  const synthCallback = value => {
    isSynthCallback(value)
  }
  const buttonClickedCallback = value => {
    selectedButtonCallback(value);
  };

  return (
    <Card className={clsx(classes.root)}>
      <Grid container >
        <Grid item md={3} xs={6}>
          <Typography gutterBottom>Placeholder</Typography>
        </Grid>
        <Grid item md={3} xs={6}>

          <FilterSlider
            filtersCallback={filterAmountCallback}
            selectedAmount={filterAmount}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <SamplesSwitch
            modus={modus}
            isSynthLayer={isSynthLayer}
            isCnnLayer={isCnnLayer}
            activationsCallback={activationsCallback}
            synthCallback={synthCallback}
            buttonClickedCallback={buttonClickedCallback}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
BottomComponent.propTypes = {
  modus: PropTypes.number,
  isSynthLayer: PropTypes.number,
  isCnnLayer: PropTypes.number,
  bottomCallback: PropTypes.func,
  isCnnCallback: PropTypes.func,
  selectedButtonCallback: PropTypes.func
};

export default BottomComponent;
