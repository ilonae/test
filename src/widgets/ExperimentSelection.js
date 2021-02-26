import React from 'react';

import PropTypes, { number } from 'prop-types';

import { FormControl, InputLabel, Select } from '@material-ui/core';

const ExperimentSelection = ({ parentCallback, datasets }) => {
  const [datasetArray, setDataset] = React.useState();

  const [experiment, setExperiment] = React.useState('');

  const handleChange = event => {
    setExperiment(event.target.value);
  };

  React.useEffect(() => {
    parentCallback(experiment);
  }, [experiment, parentCallback]);

  React.useEffect(() => {
    setDataset(datasets);
  }, [datasets]);

  React.useEffect(() => {
    if (datasetArray) {
      setExperiment(datasetArray[0]);
    }
  }, [datasetArray]);

  if (!datasetArray) {
    return null;
  }

  return (
    <FormControl
      spacing={1}
      variant="filled"
      style={{ width: '20%', marginRight: '5%' }}
    >
      <InputLabel htmlFor="methodSelection">Experiment:</InputLabel>
      <Select
        native
        value={experiment}
        onChange={handleChange}
        inputProps={{
          index: 'method'
        }}
      >
        {datasetArray.map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
ExperimentSelection.propTypes = {
  parentCallback: PropTypes.func,
  dataset: PropTypes.array
};

export default ExperimentSelection;
