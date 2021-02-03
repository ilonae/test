import React from 'react';
import { makeStyles, Card, TextField } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import clsx from 'clsx';
import SamplesSwitch from './SamplesSwitch';

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '7%',
    marginTop: '1%',
    position: 'relative',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    padding: '1%'
  },
  navbar: {
    bottom: '50%'
  }
});

const SimpleBottomNavigation = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <Card className={clsx(classes.root)}>
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={clsx(classes.navbar)}
      >
        <TextField
          name="index"
          label="Selected index"
          type="number"
          InputProps={{
            inputProps: {
              max: 100,
              min: 10
            }
          }}
        />

        <SamplesSwitch />
      </BottomNavigation>
    </Card>
  );
};

export default SimpleBottomNavigation;
