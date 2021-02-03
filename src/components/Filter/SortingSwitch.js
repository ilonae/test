import React from 'react';

import PropTypes from 'prop-types';

import { Box, Button } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const SortingSwitch = ({ parentCallback }) => {
  const [descending, setSorting] = React.useState(true);

  const handleChange = () => {
    setSorting(!descending);
  };

  React.useEffect(() => {
    parentCallback(descending);
  }, [descending]);
  return (
    <Box>
      <Button
        variant="contained"
        color="default"
        onClick={handleChange}
        startIcon={descending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
      >
        {descending
          ? 'Sort by lowest contribution'
          : 'Sort by highest contribution'}
      </Button>
    </Box>
  );
};
SortingSwitch.propTypes = {
  parentCallback: PropTypes.func
};

export default SortingSwitch;
