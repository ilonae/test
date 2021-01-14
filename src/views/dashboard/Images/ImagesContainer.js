import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Card,
  makeStyles
} from '@material-ui/core';

import ImgBox from './ImgBox';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const imageContent = 'Image';
const heatmapContent = 'Heatmap';

const ImagesContainer = ({ className, ...rest }) => {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <ImgBox content={imageContent} />
      <ImgBox content={heatmapContent} />
    </Card>
  );
};

ImagesContainer.propTypes = {
  className: PropTypes.string
};

export default ImagesContainer;
