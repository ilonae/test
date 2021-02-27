import React from 'react';

import PropTypes from 'prop-types';

import { FormControl, InputLabel, Select, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '20%',
    marginRight: '5%'
  }
}));
const Selection = ({ select, parentCallback, params }) => {
  const [parameters, setParameters] = React.useState();
  const [parameter, setParameter] = React.useState();

  const classes = useStyles();

  const handleChange = event => {
    setParameter(event.target.value);
  };

  React.useEffect(() => {
    if (parameter) {
      parentCallback(parameter);
    }
  }, [parameter, parentCallback]);

  React.useEffect(() => {
    if (typeof params !== 'undefined' && params.length > 0) {
      setParameters(params);
    }
  }, [params]);

  React.useEffect(() => {
    if (parameters) {
      setParameter(parameters[0]);
    }
  }, [parameters]);

  if (!parameters) {
    return null;
  }

  return (
    <FormControl spacing={1} variant="filled" className={classes.root}>
      <InputLabel htmlFor="selection">{select}:</InputLabel>
      <Select
        native
        value={parameter}
        onChange={handleChange}
        inputProps={{
          index: 'select'
        }}
      >
        {parameters.map(i => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
Selection.propTypes = {
  select: PropTypes.string,
  parentCallback: PropTypes.func,
  params: PropTypes.array
};

export default Selection;
