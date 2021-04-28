import React from 'react';

import { Typography,makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    fadeIn :{
      transition: 'opacity 2s ease'
  },
  fadeOut :{
      opacity: 0,
      transition: 'opacity 2s ease'
  }}));

const TextFader = () => {
    const classes = useStyles();
  const [fadeProp, setFadeProp] = React.useState({fade: classes.fadeIn});

  React.useEffect(() => {
    const timeout = setInterval(() => {
       if (fadeProp.fade === classes.fadeIn) {
          setFadeProp({
               fade: classes.fadeOut
          })
       } else {
            setFadeProp({
               fade: classes.fadeIn
            })
       }
    }, 2000);return () => clearInterval(timeout)
}, [fadeProp])


  return (

      <Typography variant="h3" noWrap className={fadeProp.fade}>
        Loading, please wait a moment...
      </Typography>

  );
};
TextFader.propTypes = {
};

export default TextFader;
