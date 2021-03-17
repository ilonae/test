import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

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
    },
    '& my-checkbox-wrapper': {
      background: 'red!important'
    }
  },
  checked: {
    '&:checked + label': {
      background: 'blue!important'
    },

    checkbox: { checkedColor: 'red' }
  }
}));

const SamplesSwitch = () => {
  const classes = useStyles();
  const [name, setName] = React.useState(false);

  function handleCheckboxChange(checkbox) {
    const val = checkbox.target.value;
    setName(val => !val);
  }
  return (
    <div className={clsx(classes.root)}>
      <Typography component="div">
        <Grid
          component="div"
          container
          spacing={1}
          className={clsx(classes.root)}
        >
          <div
            lass="switch-toggle switch-3 switch-candy"
            className={classes.switchToggle}
          >
            <input
              id="activations"
              className={classes.checked}
              type="radio"
              onClick={handleCheckboxChange.bind(this)}
            />
            <label htmlFor="activations">Activations</label>

            <input
              id="realSamples"
              type="radio"
              value={name}
              className={classes.checked}
              onChange={handleCheckboxChange.bind(this)}
            />
            <label htmlFor="realSamples"> Real Samples</label>

            <input
              className={classes.checked}
              id="syntheticSamples"
              type="radio"
              value={name}
              onClick={handleCheckboxChange.bind(this)}
            />
            <label htmlFor="syntheticSamples">Synthetic samples</label>
          </div>
        </Grid>
      </Typography>
    </div>
  );
};

export default SamplesSwitch;
