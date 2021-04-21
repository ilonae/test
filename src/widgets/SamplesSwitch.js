import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  switchToggle: {
    float: 'left',
    background: '#242729',
    '& input': {
      position: 'absolute',
      opacity: 0
    },

    '& label': {
      padding: '7px',
      float: 'left',
      color: '#fff'
    }
  },
  checked: {
    padding: '3em',
    '&:checked + label': {
      background: 'blue!important'
    }
  }
}));

const SamplesSwitch = ({
  modus,
  isCnnLayer,
  activationsCallback,
  buttonClickedCallback
}) => {
  const classes = useStyles();

  const [selectedBtn, setSelectedBtn] = React.useState(0);

  React.useEffect(() => {
    if (modus) {
      setSelectedBtn(modus);
    }
  }, [modus]);

  const selectionCallback = () => {
    activationsCallback(isCnnLayer);
  };

  const toggleButton = val => {
    if (selectedBtn === val) {
      setSelectedBtn(0);

      buttonClickedCallback(0);
    } else {
      buttonClickedCallback(val);
    }
  };

  return (
    <Grid component="div" container spacing={1} className={clsx(classes.root)}>
        <ButtonGroup className="mb-2" variant="contained" color="primary">
          {isCnnLayer === 1 ? (
            <Button
              color={selectedBtn === 1 ? 'primary' : 'default'}
              onClick={() => {
                toggleButton(1);
                selectionCallback();
              }}
            >
              Activations
            </Button>
          ) : (
            null
          )}
          <Button
            color={selectedBtn === 2 ? 'primary' : 'default'}
            onClick={() => toggleButton(2)}
          >
            Real Samples
          </Button>
          <Button
            color={selectedBtn === 3 ? 'primary' : 'default'}
            onClick={() => toggleButton(3)}
          >
            Synthetic Samples
          </Button>
      </ButtonGroup>
    </Grid>
  );
};

SamplesSwitch.propTypes = {
  modus: PropTypes.number,
  activationsCallback: PropTypes.func,
  buttonClickedCallback: PropTypes.func
};

export default SamplesSwitch;
