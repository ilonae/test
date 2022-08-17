import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import Button from "@material-ui/core/Button";
import DagreGraph from "dagre-d3-react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {
  makeStyles,
  Box,
  Card,
  CardContent,
  Typography
} from "@material-ui/core";
import Filter from "../container/Filter";
import * as d3 from "d3";

const useStyles = makeStyles(() => ({
  root: {
    height: "72vh",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    width: "100%"
  },
  nodes: {
    fill: "darkgray"
  },
  nodestext: {
    fill: "white"
  },
  path: {
    stroke: "black",
    fill: "black",
    strokeWidth: "1.5px"
  },
  buttonback: {
    whiteSpace: "nowrap",
    color: "white",
    background: "#66BFAC!important"
  },
  imagecontainer: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    textAlign: "center",
    gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
    height: "20vh",
    width: "20vh",
    cursor: "pointer"
  },
  infocontainer: {
    display: "grid",
    alignItems: "center",
    justifyItems: "center",
    textAlign: "center",
    height: "15vh",
    width: "15vh",
    whiteSpace: "pre-line",
    fontSize: "0.8em",
    cursor: "pointer"
  },
  hide: {
    display: "none"
  },
  show: {
    display: "flex"
  },
  images: {
    border: "1px solid #555",
    width: "5vh",
    height: "5vh",
    display: "block"
  }
}));

export interface graphProps {
  images?: {
    [key: string]: any[]
  };
  nodes?: any[];
  links?: any[];
  jobId: any
}

type NetworkComponentProps = {
  graph?: graphProps,
  conceptId?: number,
  viewState: string;
  target: string,
  viewCallback: (value: any) => void;
};


const NetworkComponent: React.FC<NetworkComponentProps> = (props: NetworkComponentProps) => {
  const classes = useStyles();
  const dynamicContentWrapper = React.useRef(null);
  const [showInfo, setInfoView] = React.useState(false);

  const Menu = (props: any) => <div>menu</div>;
  let content;

  function changeLayout(element: any) {
    setInfoView(!showInfo);
    showInfo
      ? (element.original.label.children[0].className = classes.hide)
      : (element.original.label.children[0].className =
        classes.imagecontainer);

    showInfo
      ? (element.original.label.children[1].className = classes.infocontainer)
      : (element.original.label.children[1].className = classes.hide);

  }

  function displayConnectionInfo(element: any) {
    console.log(element.d3source);
    console.log(element.source.label.children[1].innerHTML);
    console.log(element.target.label.children[1].innerHTML);
  }
  var scale = function (db: number) {
    return db / 100 * 7;
  };

  async function createGraph() {
    for (const link in props.graph.links) {
      console.log(props.graph.links[link])
      props.graph.links[link]["label"] = Math.round(props.graph.links[link].value * 100 + Number.EPSILON) / 100 + "%"
      const linkThickness = scale(props.graph.links[link]["label"]) * 100;
      //props.graph.links[link]["class"] = "contrib_id_" + link;
      props.graph.links[link]["config"] = {
        curve: d3.curveBasis,
        arrowheadStyle: "fill: #009374;",
        labelStyle: "font-family: roboto",
        style:
          "font-family: roboto;color: #009374;stroke: #009374;fill: none; stroke-width: " +
          linkThickness +
          "px;cursor:pointer"
      };
    }
    for (let node = 0; node < props.graph.nodes.length; node++) {
      props.graph.nodes[node]["labelType"] = "html";
      props.graph.nodes[node]["config"] = {
        style: "fill: #CCEAE3; cursor:pointer;  height: max-content"
      };
      props.graph.nodes[node].class = "";
      content = document.createElement("div");
      var imgs = document.createElement("div");
      imgs.setAttribute("class", classes.imagecontainer);
      const currNode: string = props.graph.nodes[node].id;
      const currLayer: string = props.graph.nodes[node].layer_name;
      const currFilterIndex = parseInt(currNode.split(":")[1])

      //const currFilterIndex = props.graph.properties[currNode].filter_index;
      //console.log(props.graph.images)
      //console.log(props.graph.images[currFilterIndex])

      //imgs.classList.add(classes.imagecontainer);
      /*  for (let img in graph.properties[nodeId]['images']) {
               var image = document.createElement('img');
               image.src = 'data:image/png;base64,' + graph.properties[nodeId]['images'][img];
               image.setAttribute('class', classes.images);
               imgs.appendChild(image)
       
             } */
      //content.appendChild(imgs);
      const filter = (
        <Filter
          target={props.target}
          viewState={props.viewState}
          position={0}
          partial={[]}
          synthetic={[]}
          activation={[]}
          filterPosition={[]}
          filterName={""}
          filterAmount={props.graph.nodes.length}
          images={props.graph.images[currFilterIndex]}
          placeholder={""}
          conceptId={currFilterIndex}
          parentCallback={(val) => console.log(val)}
          filterActivationCallback={() => (console.log(""))}
          filterHeatmapCallback={() => (console.log(""))}
          key={currNode}
          layer={currLayer}
          filterImgSize={28}
          filterInspectionCallback={() => console.log("hi")}
          filterSamplesCallback={() => console.log("hi")}
          nameCallback={() => console.log("hi")}
          currentTab={"test"}
          hasRelevanceStats={0}
          hasActivationStats={0}
        />
      );
      const embed = document.createElement("div");
      embed.className = "main-content-wrapper";
      const inner = document.createElement("div");
      inner.className = "test";
      //inner.append({ el => { dynamicContentWrapper = el }});
      //embed.appendChild(inner)
      content.setAttribute("style", "width:300px");
      content.innerHTML = ReactDOMServer.renderToStaticMarkup(filter);

      props.graph.nodes[node]["label"] = content;
      console.log(props.graph.nodes[node])
      //.nodes[node]['label'] = content;
      //graph.nodes[node]['label'].onmouseover = function () {setShown(true); };
      //graph.nodes[node]['label'].onmouseout = function () {setShown(false)};
    }
  }

  React.useEffect(
    () => {
      if (props.graph.nodes.length) {
        createGraph();
      }
    },
    [props.graph.nodes]);


  React.useEffect(() => {
    if (document.querySelector(".test")) {
      console.log("dfd");
      const htmlFromAjax = `
      <div class='dynamic-content'>
        <h4 class='content-header'>Dynamic content header</h4>
        <div id='test-component'>This content is dynamically added.</div>
      </div>`;
      dynamicContentWrapper.current = document.createElement("div");
      dynamicContentWrapper.current.innerHTML = htmlFromAjax;
      ReactDOM.render(<Menu />, dynamicContentWrapper.current.querySelector(".test"));
    }
  });


  return (
    <Card>
      <CardContent className={classes.root}>
        <Box display="flex" flexDirection="column" position="relative">
          <Box flexGrow={1}>
            <Typography gutterBottom>Selected Concept ID: {props.conceptId}</Typography>
            <div
              ref={el => (dynamicContentWrapper.current = el)}
              className="dynamic-content-wrapper"
            />
          </Box>
          <Button
            startIcon={<ArrowBackIosIcon />}
            onClick={() => props.viewCallback("DASHBOARDVIEW")}
            variant="contained"
            className={classes.buttonback}
          >
            {" "}
            Return back{" "}
          </Button>
        </Box>
        {props.graph.nodes ? (
          <DagreGraph
            nodes={props.graph.nodes}
            links={props.graph.links}
            width="100%"
            height="100%"
            animate={1000}
            fitBoundaries
            config={{
              nodesep: 500,
              ranksep: 150,
              edgesep: 100
            }}
            zoomable
            onNodeClick={(e: any) => changeLayout(e)}
            onRelationshipClick={(e: any) => displayConnectionInfo(e)}
          />
        ) : null}
      </CardContent>
    </Card>
  );
};
export default NetworkComponent;
