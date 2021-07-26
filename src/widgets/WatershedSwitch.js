import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import theme from 'src/styles';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    justifyContent: 'center',

  },
  font: {
    display: 'inherit',
    alignItems: 'center'

  },
  switch: {
    textAlign: 'center',
    justifyContent: 'center'
  }
}));

const WSwitch = withStyles({
  switchBase: {
    color: '#66BFAC',
    '&$checked': {
      color: '#009374',
      backgroundColor: '#66BFAC',
    },
    '&$checked + $track': {
      backgroundColor: '#66BFAC',
    },
  },
  checked: {},
  track: {},
})(Switch);

const WatershedSwitch = ({ isToggledCallback }) => {
  const classes = useStyles();
  const [useWatershed, setWatershed] = React.useState(false);

  const toggleButton = async () => {
    console.log('toggle')
    setWatershed(prev => !prev);
  };
  React.useEffect(() => {
    isToggledCallback(useWatershed);
  }, [useWatershed, isToggledCallback]);

  /*  React.useEffect(() => {
    isToggledCallback(useWatershed);
    const queryWatershed = async () => {
      await fetch('/api/watershed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image_index: imageIndex })
      }).then(response => {
        console.log(response);
        if (response.ok) {
          response.json().then(json => {
            maskCallback(json);
          });
        }
      });
    };
    if (useWatershed === true) {
      queryWatershed();
    }
  }, [useWatershed]); */

  return (
    <div className={clsx(classes.root)}>
      <Typography component="div">
        Watershed
        <Grid
          component="div"
          container
          spacing={1}
          className={clsx(classes.switch)}
        >
          <Grid item className={classes.font}>Off</Grid>
          <Grid item>
            <WSwitch checked={useWatershed} onChange={toggleButton} />
          </Grid>
          <Grid item className={classes.font}>On</Grid>
        </Grid>
      </Typography>
    </div>
  );
};

WatershedSwitch.propTypes = {
  isToggledCallback: PropTypes.func
};

export default WatershedSwitch;
