import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import theme from 'src/styles';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    marginTop: theme.spacing(1),
    justifyContent: 'center'
  }
}));

const WatershedSwitch = ({ isToggledCallback }) => {
  const classes = useStyles();
  const [useWatershed, setWatershed] = React.useState(false);

  const toggleButton = async () => {
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
          className={clsx(classes.root)}
        >
          <Grid item>Off</Grid>
          <Grid item>
            <Switch checked={useWatershed} onChange={toggleButton} />
          </Grid>
          <Grid item>On</Grid>
        </Grid>
      </Typography>
    </div>
  );
};

WatershedSwitch.propTypes = {
  isToggledCallback: PropTypes.func
};

export default WatershedSwitch;
