import React from 'react';

import PropTypes from 'prop-types';

import { FormControl, InputLabel, Select, makeStyles, MenuItem } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '20%',
    marginRight: '5%',
    backgroundColor: '#66BFAC'
  },
  label: {
    color: 'white'
  },
  text: {
    color: 'white',

  },
  selected: {
    color: 'black',

  }
}));
const Selection = ({ select, parentCallback, params, selectedParam }) => {
  const [parameters, setParameters] = React.useState();
  const [parameter, setParameter] = React.useState();

  const classes = useStyles();

  const handleChange = event => {
    console.log(event.target.value);
    setParameter(event.target.value);
    parentCallback(event.target.value);
  };

  React.useEffect(() => {
    if (typeof params !== 'undefined' && params.length > 0 && selectedParam) {
      setParameters(params);
      setParameter(selectedParam);
    }
  }, [params, selectedParam]);

  if (!parameters) {
    return null;
  }

  return (
    <FormControl spacing={1} variant="filled" className={classes.root}>
      <InputLabel className={classes.label} htmlFor="selection">{select}:</InputLabel>
      <Select
        className={classes.text}
        native
        value={parameter}
        onChange={handleChange}
        inputProps={{
          index: 'select'
        }}
      >
        {parameters.map(i => (
          <option key={i} value={i} className={classes.selected}>
            {i}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
Selection.propTypes = {
  selectedParam: PropTypes.string,
  select: PropTypes.string,
  parentCallback: PropTypes.func,
  params: PropTypes.array
};

export default Selection;
