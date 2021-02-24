import React from 'react';

import PropTypes, { number } from 'prop-types';

import { FormControl, InputLabel, Select } from '@material-ui/core';

const LayerSwitch = ({ parentCallback, layers }) => {
  const [layerIndex, setLayerIndex] = React.useState('l1');

  const [layerArray, setLayerArray] = React.useState([]);

  const handleChange = event => {
    setLayerIndex(event.target.value);
  };

  React.useEffect(() => {
    parentCallback(layerIndex);
  }, [layerIndex, parentCallback]);

  React.useEffect(() => {
    let layerArray = [];
    for (let i in layers) {
      layerArray.push(layers[i]);
    }
    setLayerArray(layerArray);
  }, [layers]);

  if (!layerArray) {
    return null;
  }

  return (
    <FormControl
      spacing={1}
      variant="filled"
      style={{ width: '20%', marginRight: '5%' }}
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
        {layerArray.map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
LayerSwitch.propTypes = {
  parentCallback: PropTypes.func,
  layers: PropTypes.array
};

export default LayerSwitch;
