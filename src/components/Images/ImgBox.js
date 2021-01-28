import React from 'react';
import PropTypes from 'prop-types';
import { Card, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3)
  },
  side: {
    width: '50%'
  },
  img: {
    height: '100%',
    width: '100%',
    objectFit: 'cover',
    flex: 1
  }
}));

const ImgBox = ({ viewType, content }) => {
  const classes = useStyles();

  return (
    <Card className={viewType === 'DEFAULTVIEW' ? classes.root : classes.side}>
      <img className={classes.img} src={content} alt="" />
    </Card>
  );
};
ImgBox.propTypes = {
  viewType: PropTypes.string,
  content: PropTypes.string
};
export default ImgBox;
