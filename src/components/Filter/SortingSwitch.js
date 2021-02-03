import React from 'react';

import PropTypes from 'prop-types';

import { Button, Typography } from '@material-ui/core';
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
    <Button
      variant="contained"
      color="default"
      style={{ width: '30%', wordWrap: 'break-word', whiteSpace: 'normal' }}
      onClick={handleChange}
      startIcon={descending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
    >
      <Typography noWrap>
        {descending
          ? 'Sort by lowest contribution'
          : 'Sort by highest contribution'}
      </Typography>
    </Button>
  );
};
SortingSwitch.propTypes = {
  parentCallback: PropTypes.func
};

export default SortingSwitch;
