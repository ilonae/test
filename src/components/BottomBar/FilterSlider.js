import React from 'react';
import { Slider, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

const FilterSlider = ({ callback }) => {
  const [amount, changeAmount] = React.useState(6);
  const handleChange = (event, newValue) => {
    changeAmount(newValue);
  };

  React.useEffect(() => {
    callback(amount);
  }, [amount]);
  return (
    <div>
      <Typography gutterBottom>Filter amount</Typography>
      <Slider
        defaultValue={amount}
        onChange={handleChange}
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
  callback: PropTypes.func
};

export default FilterSlider;
