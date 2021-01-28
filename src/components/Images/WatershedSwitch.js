import React from 'react';
import clsx from 'clsx';
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

const WatershedContainer = () => {
  const classes = useStyles();
  const [useWatershed, setWatershed] = React.useState(false);

  const toggleButton = async () => {
    setWatershed((prev) => !prev);
    await fetch('/api/watershed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ index: 0 })
    }).then((response) => {
      console.log(response);
      if (response.ok) {
        response.json().then((json) => {
          console.log(json);
        });
      }
    });
  };
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

export default WatershedContainer;
