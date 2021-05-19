import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles(() => ({
  root:{
    paddingTop:'2vh'
  },
  checked:{
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    background: '#009374!important'
  },
  default: {
    width: '100%',
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
    background: '#66BFAC!important'
  }
}));

const ExpansionButton = ({ expansionCallback, viewState }) => {
  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);

  React.useEffect(() => {
    expansionCallback(view);
  }, [view, expansionCallback]);

  return (
    <div className={classes.root}>
      {
        ['LOADINGVIEW', 'DEFAULTVIEW'].includes(view)
        ? (
        <Button
          className={classes.default}
          variant="contained"
          onClick={() => changeView('IMAGEVIEW')}
          endIcon={<ArrowForwardIosIcon style={{ fontSize: 10 }} />}
        >
          <Typography noWrap>Expand view</Typography>
        </Button>
      ) : (
        <Button
          className={classes.default}
          variant="contained"
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
