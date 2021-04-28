import React from 'react';
import node from './diagram';
import rd3 from 'react-d3-library';
import Tree from 'react-tree-graph';
import PropTypes from 'prop-types';



import { makeStyles, Box, Card, CardContent } from '@material-ui/core';

const RD3Component = rd3.Component;



const useStyles = makeStyles(() => ({
  root: {
    height: '70vh',
    margin: '2vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  }
}));



const NetworkComponent = ({filterAmount, filters}) => {

  let data = {
    name: 'Parent',
    children: [{
      name: 'Child One',
      children: [{
        name: 'Child One'
      }, {
        name: 'Child Two'
      }],
    }, {
      name: 'Child Two'
    }]
  };
  const classes = useStyles();

  const [d3, setD3] = React.useState('');

  React.useEffect(() => {
     setD3(node)
    })

    function handleClick(event, node) {
      console.log(node);
    }
    
    function onRightClick(event, nodeKey) {
      event.preventDefault();
      alert(`Right clicked ${nodeKey}`);
    }

  return (
    <Card>
      <CardContent className={classes.root}>
        <Box position="relative">Selected Filter:</Box>
        <Tree
         animated={true}
	data={data}
	height={400}
	width={400}
  gProps={{
		onClick: handleClick,
		onContextMenu: onRightClick
	}}
  svgProps={{
		transform: 'rotate(90)'
	}}
  steps={30}
 />
       {/*  <RD3Component data={d3} /> */}
      </CardContent>
    </Card>
  );
};

NetworkComponent.propTypes = {
  filterAmount: PropTypes.number,
  filters: PropTypes.array
};


export default NetworkComponent;
