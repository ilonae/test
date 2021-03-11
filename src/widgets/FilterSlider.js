import React from 'react';
import { Slider, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

const FilterSlider = ({ filtersCallback, selectedAmount }) => {
  const [amount, changeAmount] = React.useState(0);

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
      <Typography gutterBottom>Filter amount</Typography>
      <Slider
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
