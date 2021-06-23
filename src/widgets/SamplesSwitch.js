import React from 'react';
import clsx from 'clsx';
import { makeStyles, Typography } from '@material-ui/core';
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
    color: 'white',
    background: '#009374!important'
  },
  default: {
    color: 'white',
    background: '#66BFAC!important'
  },
  btnGroup: {
    width: '90%',
    boxShadow: 'none'
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
    <Grid container className={clsx(classes.root)}>
      <ButtonGroup variant="contained" className={classes.btnGroup} >
        {isCnnLayer === 1 ? (
          <Button
            className={selectedBtn === 1 ? classes.checked : classes.default}
            onClick={() => {
              toggleButton(1);
              selectionCallback();
            }}
          ><Typography noWrap>
              Activations
            </Typography>

          </Button>
        ) : (
          null
        )}
        <Button
          className={selectedBtn === 2 ? classes.checked : classes.default}
          onClick={() => toggleButton(2)}
        ><Typography noWrap>
            Real Samples
          </Typography>
        </Button>
        <Button
          className={selectedBtn === 3 ? classes.checked : classes.default}
          onClick={() => toggleButton(3)}
        >
          <Typography noWrap>
            Synthetic Samples
          </Typography>
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
