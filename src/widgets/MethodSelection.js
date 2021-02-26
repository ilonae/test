import React from 'react';

import PropTypes from 'prop-types';

import { FormControl, InputLabel, Select } from '@material-ui/core';

const MethodSelection = ({ parentCallback, methods }) => {
  const [method, setMethod] = React.useState('');
  const [methodsArray, setMethodsArray] = React.useState([]);

  const handleChange = event => {
    setMethod(event.target.value);
  };

  React.useEffect(() => {
    setMethodsArray(methods);
  }, [methods]);

  React.useEffect(() => {
    parentCallback(method);
  }, [method, parentCallback]);

  React.useEffect(() => {
    if (methodsArray) {
      setMethod(methodsArray[0]);
    }
  }, [methodsArray]);

  if (!methodsArray) {
    return null;
  }

  return (
    <FormControl
      spacing={1}
      variant="filled"
      style={{ width: '20%', marginRight: '5%' }}
    >
      <InputLabel htmlFor="methodSelection">Method:</InputLabel>
      <Select
        native
        value={method}
        onChange={handleChange}
        inputProps={{
          index: 'method'
        }}
      >
        {methodsArray.map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
MethodSelection.propTypes = {
  parentCallback: PropTypes.func,
  methods: PropTypes.array
};

export default MethodSelection;
