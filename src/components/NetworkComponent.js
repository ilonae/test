import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DagreGraph from 'dagre-d3-react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles, Box, Card, CardContent,Typography } from '@material-ui/core';
import * as d3 from 'd3'


const useStyles = makeStyles(() => ({
  root: {
    height: '72vh',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row'
  },
  nodes: {
    fill: 'darkgray'
  },
  nodestext :{
    fill:'white'
  },
  path: {
    stroke: 'black',
    fill: 'black',
    strokeWidth: '1.5px'
  },
  buttonback:{
    whiteSpace: 'nowrap',
    color: 'white',
    background: '#66BFAC!important'
  },
  imagecontainer:{
    display:'grid',
    alignItems:'center',
    justifyItems:'center',
    textAlign:'center',
    gridTemplate:'repeat(3, 1fr) / repeat(3, 1fr)',
    height:'20vh',
    width:'20vh'
  },
  images:{
    border: '1px solid #555',

    width: '5vh',
    height:'5vh',
    display: 'block',
  }
}));



const NetworkComponent = ({graph, viewState, viewCallback,filterIndex}) => {


  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);
  

  if(graph){
    console.log(graph)
    for (const link in graph.links){
      graph.links[link]['config']=  {curve: d3.curveBasis,arrowheadStyle: "fill: #009374;",   labelStyle: "font-family: roboto", style: 'font-family: roboto;color: #009374;stroke: #009374;fill: none; stroke-width: 1.5px;'};
    }
    for (const node in graph.nodes){
      graph.nodes[node]['labelType']= 'html';
      graph.nodes[node]['config']= {style: 'fill: #CCEAE3'};
      const nodeId = graph.nodes[node]['id'];
      console.log(graph.properties[nodeId])
          var imgs = document.createElement("div");
          imgs.setAttribute('class', classes.imagecontainer);
          for (let img in graph.properties[nodeId]['images']) {
            var image = document.createElement('img');
            image.src = 'data:image/png;base64,'+graph.properties[nodeId]['images'][img];
            image.setAttribute('class', classes.images);
            imgs.appendChild(image)
            
          }
          graph.nodes[node]['label']= imgs;
    };



    console.log(graph)
  }


  React.useEffect(() => {
    viewCallback(view);
  }, [view, viewCallback]);


    function handleClick(event, node) {
      console.log(node);
    }
    
    function onRightClick(event, nodeKey) {
      event.preventDefault();
      alert(`Right clicked ${nodeKey}`);
    }

const filterData ={ 
filter_indices: 'j',
images:  [ "iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAAAAABQ7I24AAAA0klEQVR4nO3bsQkCURRFQZUtzC4syNqMrEQbEE20gQMPROQHc+LL2+Hnu3/txi7j4jgfeYyLw3zkX6FUKBVKhVKhVCgVSoVSoVQoFUqFUqFUKBVKhVItRNmu8+Y0Lm7zkee4WOhVUCqUCqVCqVAqlAqlQqlQKpQKpUKpUCqUCqVCqbbzvLn/5EPjYqFXQalQKpQKpUKpUCqUCqVCqVAqlAqlQqlQKpQKpVqIsv/Jlfc88d/hd6FUKBVKhVKhVCgVSoVSoVQoFUqFUqFUKBVKtRDlAxjkCni5+EynAAAAAElFTkSuQmCC", "iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAAAAABQ7I24AAAA0UlEQVR4nO3bsY1CQRAFQT7CAREQMREQ6ZAP9vmQQElzxhprdNtPq9L4e3xPC/qbJ9dxcV4AWVQUFUVFUVFUFBVFRVFRVBQVRUVRUVQUFUVFUVHURpTjOW9e4+I9P/IYFxtdJYqKoqKoKCqKiqKiqCgqioqioqgoKoqKoqKoKOpY8spnntzHxUZXiaKiqCgqioqioqgoKoqKoqKoKCqKiqKiqCgqitqIclnyyj/+Hd7GxUZXiaKiqCgqioqioqgoKoqKoqKoKCqKiqKiqCgqivoBO+0G+7kGjc4AAAAASUVORK5CYII=", "iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAAAAABQ7I24AAAAzUlEQVR4nO3YsQmCMRhFUX9xBFdwAcd1RWux1AUufBZBUpxTP5JLyhzP0+g6T2bvcXFecc0aUoqUIqVIKVKKlCKlSClSipQipUgpUoqUIqVIKRulHJ95cx8Xj/mQ27jY6FWkFClFSpFSpBQpRUqRUqQUKUVKkVKkFClFSpFSjiWn/PB19RoXG72KlCKlSClSipQipUgpUoqUIqVIKVKKlCKlSClSykYpl39dNP+RbfQqUoqUIqVIKVKKlCKlSClSipQipUgpUoqUIqVIKV+qAwft1K7Q/QAAAABJRU5ErkJggg==" ],
relevance:  '40'
}

const filterData2 ={ 
  filter_indices: 'i',
  images:  [ "iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAAAAABQ7I24AAAA0klEQVR4nO3bsQkCURRFQZUtzC4syNqMrEQbEE20gQMPROQHc+LL2+Hnu3/txi7j4jgfeYyLw3zkX6FUKBVKhVKhVCgVSoVSoVQoFUqFUqFUKBVKhVItRNmu8+Y0Lm7zkee4WOhVUCqUCqVCqVAqlAqlQqlQKpQKpUKpUCqUCqVCqbbzvLn/5EPjYqFXQalQKpQKpUKpUCqUCqVCqVAqlAqlQqlQKpQKpVqIsv/Jlfc88d/hd6FUKBVKhVKhVCgVSoVSoVQoFUqFUqFUKBVKtRDlAxjkCni5+EynAAAAAElFTkSuQmCC", "iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAAAAABQ7I24AAAA0UlEQVR4nO3bsY1CQRAFQT7CAREQMREQ6ZAP9vmQQElzxhprdNtPq9L4e3xPC/qbJ9dxcV4AWVQUFUVFUVFUFBVFRVFRVBQVRUVRUVQUFUVFUVHURpTjOW9e4+I9P/IYFxtdJYqKoqKoKCqKiqKiqCgqioqioqgoKoqKoqKoKOpY8spnntzHxUZXiaKiqCgqioqioqgoKoqKoqKoKCqKiqKiqCgqitqIclnyyj/+Hd7GxUZXiaKiqCgqioqioqgoKoqKoqKoKCqKiqKiqCgqivoBO+0G+7kGjc4AAAAASUVORK5CYII=", "iVBORw0KGgoAAAANSUhEUgAAAIoAAACKCAAAAABQ7I24AAAAzUlEQVR4nO3YsQmCMRhFUX9xBFdwAcd1RWux1AUufBZBUpxTP5JLyhzP0+g6T2bvcXFecc0aUoqUIqVIKVKKlCKlSClSipQipUgpUoqUIqVIKRulHJ95cx8Xj/mQ27jY6FWkFClFSpFSpBQpRUqRUqQUKUVKkVKkFClFSpFSjiWn/PB19RoXG72KlCKlSClSipQipUgpUoqUIqVIKVKKlCKlSClSykYpl39dNP+RbfQqUoqUIqVIKVKKlCKlSClSipQipUgpUoqUIqVIKV+qAwft1K7Q/QAAAABJRU5ErkJggg==" ],
  relevance:  '20'
  }

var node = document.createElement(filterData.filter_indices);
node.innerHTML = filterData.relevance;
for (var img in filterData.images) {
  var image = document.createElement('img');
  image.src = 'data:image/png;base64,'+filterData.images[img];
  node.appendChild(image)
  
}

var node2 = document.createElement(filterData2.filter_indices);
node2.innerHTML = filterData2.relevance;
for (var img in filterData2.images) {
  var image = document.createElement('img');
  image.src = 'data:image/png;base64,'+filterData2.images[img];
  node2.appendChild(image)
  
}

    let data = {
      nodes: [
        {
          id: 50,
          label: node2,
          labelType: "html",
          config: {
            style: 'fill: #afa'
        }
        },
        {
          id: 1,
          label: 'B',
          labelType: 'string',
          config: {
            style: 'fill: #afa'
        }
        },
        {
          id: 2,
          label: node,
      labelType: "html",
          config: {
            style: 'fill: #afa'
        }
        },
        {
          id: 3,
          label: node2,
          labelType: "html",
          config: {
            style: 'fill: #afa'
        }
        }
      ],
      links: [
        {
          source: 50,
          target: 1,
          label: 'to',
          config: {
			  curve: d3.curveBasis,
			  style: 'stroke: black;fill: none; stroke-width: 1.5px;'
          },
          
        },
        {
          source: 1,
          target: 2,
          label: 'to',
          config: {
			  curve: d3.curveBasis,
			  style: 'stroke: black;fill: none; stroke-width: 1.5px;'
          },
          
        },
        {
          source: 50,
          target: 2,
          label: 'to',
          config: {
			  curve: d3.curveBasis,
			  style: 'stroke: black; fill:none; stroke-width: 1.5px;'
          },
          
        },
        {
          source: 50,
          target: 3,
          label: 'to',
          config: {
			  curve: d3.curveBasis,
			  style: 'stroke: black; fill:none; stroke-width: 1.5px;'
          },
          
        },
        {
          source: 2,
          target: 3,
          label: 'to',
          config: {
			  curve: d3.curveBasis,
			  style: 'stroke: black; fill:none; stroke-width: 1.5px;'
          },
          
        }
      ]
    }

  return (
    <Card>
      <CardContent className={classes.root}>
        <Box display="flex"  flexDirection="column" position="relative">
          <Box flexGrow={1}>
        <Typography gutterBottom  >Selected Filter: {filterIndex}</Typography>
        </Box>
               <Button 
               startIcon={<ArrowBackIosIcon />} 
               onClick={() => changeView('DEFAULTVIEW')}
              
            variant="contained"
          className={classes.buttonback}
          > Return back </Button></Box>{
            graph?<DagreGraph
            nodes={graph.nodes}
            links={graph.links}
          
            width='100%'
            height='100%'
            animate={1000}
            fitBoundaries
            zoomable
            onNodeClick={e => console.log(e)}
            onRelationshipClick={e => console.log(e)}
        />:null}
        

       {/*  <RD3Component data={d3} /> */}


      </CardContent>
    </Card>
  );
};

NetworkComponent.propTypes = {
  graph: PropTypes.object,
  filterIndex: PropTypes.number
};


export default NetworkComponent;
