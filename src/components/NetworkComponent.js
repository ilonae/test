import React from 'react';

import { makeStyles, Box, Card, CardContent } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    height: '70vh',
    margin: '2vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  }
}));

const NetworkComponent = () => {
  const classes = useStyles();
  return (
    <Card>
      <CardContent className={classes.root}>
        <Box position="relative">Selected Filter:</Box>
      </CardContent>
    </Card>
  );
};

export default NetworkComponent;
