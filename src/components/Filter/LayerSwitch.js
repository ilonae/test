import React from 'react';

import PropTypes from 'prop-types';

import { FormControl, InputLabel, Select } from '@material-ui/core';

const LayerSwitch = ({ parentCallback }) => {
  const [layerIndex, setLayerIndex] = React.useState(1);

  const handleChange = (event) => {
    setLayerIndex(event.target.value);
  };

  React.useEffect(() => {
    parentCallback(layerIndex);
  }, [layerIndex]);
  return (
    <FormControl
      spacing={1}
      variant="filled"
      style={{ width: '30%', marginRight: '10%' }}
    >
      <InputLabel htmlFor="layerIndex">Layer:</InputLabel>
      <Select
        native
        value={layerIndex}
        onChange={handleChange}
        inputProps={{
          index: 'layerIndex'
        }}
      >
        <option value={1}>1</option>
        <option value={3}>3</option>
        <option value={6}>6</option>
        <option value={7}>7</option>
      </Select>
    </FormControl>
  );
};
LayerSwitch.propTypes = {
  parentCallback: PropTypes.func
};

export default LayerSwitch;
