import React from 'react';
import { Slider, Typography } from '@material-ui/core';

import { makeStyles, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  switchToggle: {
    float: 'left',
    background: '#242729',
    '& input': {
      position: 'absolute',
      opacity: 0
    },

    '& label': {
      padding: '7px',
      float: 'left',
      color: '#fff'
    }
  },
  checked:{
    color: 'white',
    background: '#009374!important'
  },
  default: {
    background: '#66BFAC!important'
  }
}));

const FSlider = withStyles({
  root: {
    color: '#66BFAC',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const FilterSlider = ({ filtersCallback, selectedAmount }) => {
  const [amount, changeAmount] = React.useState(selectedAmount);

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    filtersCallback(newValue);
  };

  React.useEffect(() => {
    if (selectedAmount) {
      changeAmount(selectedAmount);
    }
  }, [selectedAmount]);

  return (
    <div>
      <Typography gutterBottom>Filter amount:</Typography>
      <FSlider
        value={amount}
        onChangeCommitted={handleChange}
        step={2}
        marks
        min={2}
        max={12}
        valueLabelDisplay="auto"
      />
    </div>
  );
};

FilterSlider.propTypes = {
  filtersCallback: PropTypes.func
};

export default FilterSlider;
