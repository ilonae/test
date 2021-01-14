import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '50%',
    margin: theme.spacing(3)
  }
}));

const ImgBox = ({ className, content, ...rest }) => {
  const classes = useStyles();
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      {content}
    </Card>
  );
};
ImgBox.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string
};
export default ImgBox;
