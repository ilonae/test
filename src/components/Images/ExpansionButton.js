import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles(() => ({
  root: {
    justifyContent: 'center',
    textAlign: 'center'
  }
}));

const ExpansionButton = ({ callback, viewState }) => {
  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);

  React.useEffect(() => {
    callback(view);
  }, [view]);

  return (
    <div className={classes.root}>
      {view === 'DEFAULTVIEW' ? (
        <Button
          variant="contained"
          color="default"
          onClick={() => changeView('IMAGEVIEW')}
          endIcon={<ArrowForwardIosIcon style={{ fontSize: 10 }} />}
        >
          Expand view
        </Button>
      ) : (
        <Button
          variant="contained"
          color="default"
          onClick={() => changeView('DEFAULTVIEW')}
          startIcon={<ArrowBackIosIcon style={{ fontSize: 10 }} />}
        >
          Return
        </Button>
      )}
    </div>
  );
};

ExpansionButton.propTypes = {
  callback: PropTypes.func,
  viewState: PropTypes.string
};

export default ExpansionButton;
