import React from 'react';
import { Slider, Typography } from '@material-ui/core';

import PropTypes from 'prop-types';

const FilterSlider = ({ filtersCallback }) => {
  const [amount, changeAmount] = React.useState(6);

  const handleChange = (event, newValue) => {
    changeAmount(newValue);
  };

  React.useEffect(() => {
    filtersCallback(amount);
  }, [amount, filtersCallback]);
  return (
    <div>
      <Typography gutterBottom>Filter amount</Typography>
      <Slider
        value={amount}
        onChangeCommitted={handleChange}
        step={2}
        marks
        min={2}
        max={8}
        valueLabelDisplay="auto"
      />
    </div>
  );
};

FilterSlider.propTypes = {
  filtersCallback: PropTypes.func
};

export default FilterSlider;
