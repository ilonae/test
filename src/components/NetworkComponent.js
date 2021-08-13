import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DagreGraph from 'dagre-d3-react'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles, Box, Card, CardContent, Typography } from '@material-ui/core';
import Filter from '../container/Filter';
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
  nodestext: {
    fill: 'white'
  },
  path: {
    stroke: 'black',
    fill: 'black',
    strokeWidth: '1.5px'
  },
  buttonback: {
    whiteSpace: 'nowrap',
    color: 'white',
    background: '#66BFAC!important'
  },
  imagecontainer: {
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
    textAlign: 'center',
    gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)',
    height: '20vh',
    width: '20vh',
    cursor: 'pointer'
  },
  infocontainer: {
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
    textAlign: 'center',
    height: '15vh',
    width: '15vh',
    whiteSpace: 'pre-line',
    fontSize: '0.8em',
    cursor: 'pointer'
  },
  hide: {
    display: 'none'
  },
  show: {
    display: 'flex'
  },
  images: {
    border: '1px solid #555',

    width: '5vh',
    height: '5vh',
    display: 'block',
  }
}));

const Menu = props => <div>menu</div>;

let content;


const NetworkComponent = ({ graph, viewState, viewCallback, filterIndex }) => {

  let dynamicContentWrapper;


  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);

  const [showInfo, setInfoView] = React.useState(false);

  function changeLayout(element) {

    setInfoView(!showInfo)
    {
      showInfo ? element.original.label.children[0].className = classes.hide : element.original.label.children[0].className = classes.imagecontainer
    };
    {
      showInfo ? element.original.label.children[1].className = classes.infocontainer : element.original.label.children[1].className = classes.hide
    };
  }

  function displayConnectionInfo(element) {
    console.log(element.d3source)
    console.log(element.source.label.children[1].innerHTML)
    console.log(element.target.label.children[1].innerHTML)
  }

  var scale = function (db) {
    return (db / 100) * 7;
  }



  async function createGraph() {
    for (const link in graph.links) {
      const linkThickness = scale(graph.links[link]['label']);
      graph.links[link]['class'] = 'contrib_id_' + link
      graph.links[link]['config'] = { curve: d3.curveBasis, arrowheadStyle: "fill: #009374;", labelStyle: "font-family: roboto", style: 'font-family: roboto;color: #009374;stroke: #009374;fill: none; stroke-width: ' + linkThickness + 'px;cursor:pointer' };
    }
    const filterBox = [];
    for (const node in graph.nodes) {
      graph.nodes[node]['labelType'] = 'html';
      graph.nodes[node]['config'] = { style: 'fill: #CCEAE3; cursor:pointer, width:200px, height:200px' };
      const nodeId = graph.nodes[node]['id'];
      graph.nodes[node].class = ''

      content = document.createElement("div");
      var imgs = document.createElement("div");
      imgs.setAttribute('class', classes.imagecontainer);
      //imgs.classList.add(classes.imagecontainer);
      for (let img in graph.properties[nodeId]['images']) {
        var image = document.createElement('img');
        image.src = 'data:image/png;base64,' + graph.properties[nodeId]['images'][img];
        image.setAttribute('class', classes.images);
        imgs.appendChild(image)

      }
      //content.appendChild(imgs);

      /*  const filter = <Filter
         filterAmount={graph.nodes.length}
         images={graph.properties[nodeId]['images']}
         filterIndex={node}
         filterActivationCallback={console.log('hi')}
         filterHeatmapCallback={console.log('hi')}
         key={`filter_index_${node}`}
         relevance={1}
         filterImgSize={20}
         filterGraphCallback={console.log('hi')}
         filterStatisticsCallback={console.log('hi')}
       />;*/


      const embed = document.createElement("div");
      embed.className = "main-content-wrapper";
      const inner = document.createElement("div");
      inner.className = 'test';

      //inner.append({ el => { dynamicContentWrapper = el }});






      embed.appendChild(inner)

      content.appendChild(embed)



      graph.nodes[node]['label'] = content;


      //.nodes[node]['label'] = content;
      //graph.nodes[node]['label'].onmouseover = function () {setShown(true); };
      //graph.nodes[node]['label'].onmouseout = function () {setShown(false)};

    };
    console.log(graph)

  }
  if (graph) {
    createGraph();
  }

  React.useEffect(() => {

    if (document.querySelector('.test')) {
      console.log("dfd")
      const htmlFromAjax = `
      <div class='dynamic-content'>
        <h4 class='content-header'>Dynamic content header</h4>
        <div id='test-component'>This content is dynamically added.</div>
      </div>`;
      dynamicContentWrapper = document.createElement("div");
      dynamicContentWrapper.innerHTML = htmlFromAjax;
      ReactDOM.render(<Menu></Menu>, dynamicContentWrapper.querySelector('.test'));

    }

  });

  React.useEffect(() => {
    viewCallback(view);
  }, [view, viewCallback]);

  return (
    <Card>
      <CardContent className={classes.root}>
        <Box display="flex" flexDirection="column" position="relative">
          <Box flexGrow={1}>
            <Typography gutterBottom  >Selected Filter: {filterIndex}</Typography>
            <div ref={el => (dynamicContentWrapper = el)}
              className="dynamic-content-wrapper" />


          </Box>
          <Button
            startIcon={<ArrowBackIosIcon />}
            onClick={() => changeView('DASHBOARDVIEW')}

            variant="contained"
            className={classes.buttonback}
          > Return back </Button></Box>{
          graph ? <DagreGraph
            nodes={graph.nodes}
            links={graph.links}

            width='100%'
            height='100%'
            animate={1000}
            fitBoundaries
            config={{

              nodesep: 200,
              edgesep: 100
            }
            }

            zoomable
            onNodeClick={e => changeLayout(e)}
            onRelationshipClick={e => displayConnectionInfo(e)}
          /> : null}

      </CardContent>
    </Card >
  );
};

NetworkComponent.propTypes = {
  graph: PropTypes.object,
  filterIndex: PropTypes.number
};


export default NetworkComponent;
