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

const BottomComponent = ({
  modus,
  bottomCallback,
  filterAmount,
  isCnnLayer,
  isCnnCallback,
  selectedButtonCallback
}) => {
  const classes = useStyles();

  const filterAmountCallback = value => {
    bottomCallback(value);
  };
  const activationsCallback = value => {
    isCnnCallback(value);
  };
  const buttonClickedCallback = value => {
    selectedButtonCallback(value);
  };

  return (
    <Card className={clsx(classes.root)}>
      <Grid container spacing={8}>
        <Grid item xs={4}>
        Placeholder
        </Grid>
        <Grid item xs={4}>
        
          <FilterSlider
            filtersCallback={filterAmountCallback}
            selectedAmount={filterAmount}
          />
        </Grid>
        <Grid item xs={4}>
          <SamplesSwitch
            modus={modus}
            isCnnLayer={isCnnLayer}
            activationsCallback={activationsCallback}
            buttonClickedCallback={buttonClickedCallback}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
BottomComponent.propTypes = {
  modus: PropTypes.number,
  isCnnLayer: PropTypes.number,
  bottomCallback: PropTypes.func,
  isCnnCallback: PropTypes.func,
  selectedButtonCallback: PropTypes.func
};

export default BottomComponent;
