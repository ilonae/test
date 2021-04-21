import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center'
  }
}));

const ExpansionButton = ({ expansionCallback, viewState }) => {
  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);

  React.useEffect(() => {
    expansionCallback(view);
  }, [view, expansionCallback]);

  return (
    <div>
      {
        ['LOADINGVIEW', 'DEFAULTVIEW'].includes(view)
        ? (
        <Button
          className={classes.root}
          variant="contained"
          color="default"
          onClick={() => changeView('IMAGEVIEW')}
          endIcon={<ArrowForwardIosIcon style={{ fontSize: 10 }} />}
        >
          <Typography noWrap>Expand view</Typography>
        </Button>
      ) : (
        <Button
          className={classes.root}
          variant="contained"
          color="default"
          onClick={() => changeView('DEFAULTVIEW')}
          startIcon={<ArrowBackIosIcon style={{ fontSize: 10 }} />}
        >
          <Typography noWrap>Return</Typography>
        </Button>
      )}
    </div>
  );
};

ExpansionButton.propTypes = {
  expansionCallback: PropTypes.func,
  viewState: PropTypes.string
};

export default ExpansionButton;
