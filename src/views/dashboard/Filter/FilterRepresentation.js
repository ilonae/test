import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const FilterRepresentation = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          height={800}
          position="relative"
        >
          Network representation
        </Box>
      </CardContent>
    </Card>
  );
};

FilterRepresentation.propTypes = {
  className: PropTypes.string
};

export default FilterRepresentation;
