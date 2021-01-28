import React from 'react';
import { makeStyles, Card } from '@material-ui/core';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Brightness1Icon from '@material-ui/icons/Brightness1';
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
        <BottomNavigationAction
          label="Positive Contribution"
          icon={<Brightness1Icon />}
        />
        <BottomNavigationAction
          label="Negative Contribution"
          icon={<Brightness1Icon />}
        />

        <SamplesSwitch />
      </BottomNavigation>
    </Card>
  );
};

export default SimpleBottomNavigation;
