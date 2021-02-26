import React from 'react';

import PropTypes from 'prop-types';

import { FormControl, InputLabel, Select, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '20%',
    marginRight: '5%'
  }
}));

const LayerSelection = ({ parentCallback, layers }) => {
  const [layerIndex, setLayerIndex] = React.useState('');
  const [layerArray, setLayerArray] = React.useState([]);
  const classes = useStyles();

  const handleChange = event => {
    setLayerIndex(event.target.value);
  };

  React.useEffect(() => {
    if (layerIndex) {
      parentCallback(layerIndex);
    }
  }, [layerIndex, parentCallback]);

  React.useEffect(() => {
    if (layers) {
      let layerArray = [];
      for (let i in layers) {
        layerArray.push(layers[i]);
      }
      setLayerArray(layerArray);
      setLayerIndex(layerArray[0]);
    }
  }, [layers]);

  if (!layerArray) {
    return null;
  }

  return (
    <FormControl spacing={1} variant="filled" className={classes.root}>
      <InputLabel>Layer:</InputLabel>
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
LayerSelection.propTypes = {
  parentCallback: PropTypes.func,
  layers: PropTypes.array
};

export default LayerSelection;
