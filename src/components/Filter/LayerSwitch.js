import React from 'react';

import PropTypes from 'prop-types';

import {
  Box, FormControl, InputLabel, Select
} from '@material-ui/core';

const LayerSwitch = ({ parentCallback }) => {
  const [layerIndex, setLayerIndex] = React.useState(1);

  const handleChange = (event) => {
    setLayerIndex(event.target.value);
  };

  React.useEffect(() => {
    parentCallback(layerIndex);
  }, [layerIndex]);
  return (
    <Box>
      <FormControl variant="filled">
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
    </Box>
  );
};
LayerSwitch.propTypes = {
  parentCallback: PropTypes.func
};

export default LayerSwitch;
