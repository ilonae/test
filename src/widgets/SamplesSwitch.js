import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    justifyContent: 'center'
  }
}));

const SamplesSwitch = () => {
  const classes = useStyles();
  const [useWatershed, setWatershed] = React.useState(false);

  const toggleButton = () => {
    console.log(useWatershed);
    setWatershed((prev) => !prev);
  };
  return (
    <div className={clsx(classes.root)}>
      <Typography component="div">
        Switch between real and synthetic samples
        <Grid
          component="div"
          container
          spacing={1}
          className={clsx(classes.root)}
        >
          <Grid item>Real</Grid>
          <Grid item>
            <Switch checked={useWatershed} onChange={toggleButton} />
          </Grid>
          <Grid item>Synthetic</Grid>
        </Grid>
      </Typography>
    </div>
  );
};

export default SamplesSwitch;
