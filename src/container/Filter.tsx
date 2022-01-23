import React from "react";
//import * as d3 from "d3";
import {
  Grid,
  Typography,
  makeStyles,
  Button,
  ButtonGroup
} from "@material-ui/core";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
const useStyles = makeStyles(() => ({
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    padding: "2em",
    alignItems: "center"
  },
  buttonLeft: {},
  buttonRight: {
    marginLeft: "auto"
  },
  add: { display: "inline" },
  caption: { display: "table-caption" },
  row: {
    display: "flex",
    wordWrap: "break-word",
    alignItems: "center",
    marginLeft: "1em"
  },
  rowCol: {
    display: "flex",
    flexDirection: "column",
    wordWrap: "break-word",
    marginLeft: "1em",
    marginBottom: "1em"
  },
  centering: {
    textAlign: "center",
    maxHeight: "100%"
  },
  images: {
    height: "auto",
    width: "75%",
    display: "grid",
    gridTemplateColumns: "repeat(9,1fr)",
    gap: "1em"
  },
  analysis: {
    display: "flex",
    flexDirection: "column",
    height: "auto",
    marginLeft: "2%"
  },
  margins: {
    marginLeft: "2em",
    border: "1px solid #555",
    verticalAlign: "middle",
    width: "10em",
    height: "10em",
    backgroundImage:
      "linear-gradient(45deg, #000000 12.50%, #ffffff 12.50%, #ffffff 50%, #000000 50%, #000000 62.50%, #ffffff 62.50%, #ffffff 100%)",
    backgroundSize: "5.66px 5.66px"
  },
  image: {
    border: "1px solid #555",
    verticalAlign: "middle",
    width: "5em",
    height: "5em",
    backgroundImage:
      "linear-gradient(45deg, #ffffff 40%, #000000 40%, #000000 50%, #ffffff 50%, #ffffff 90%, #000000 90%, #000000 100%)",
    backgroundSize: "7.07px 7.07px"
  },
  singleActivation: {
    height: "80%",
    width: "80%",
    display: "block"
  },
  positive: {
    position: "relative",
    margin: "auto",
    overflow: "hidden",
    backgroundColor: "#CCEAE3",
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: "3%",
    paddingTop: "3%",
    paddingLeft: "3%",
    "&:hover >*": {
      visibility: "visible"
    }
  },
  hidden: {
    visibility: "hidden"
  },
  rotated: {
    transform: "rotate(-90deg) translate(-100%, 0)",
    transformOrigin: "top left",
    textAlign: "center",
    fontSize: "small"
  },
  smallText: {
    fontSize: "small"
  },
  shown: {
    visibility: "visible"
  },
  overlay: {
    visibility: "hidden",
    position: "absolute",
    display: "flex",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    width: "100%",
    transition: ".1s ease",
    backgroundColor: "rgba(100, 100, 100, 0.7)"
  },
  negative: {
    position: "relative",
    margin: "auto",
    overflow: "hidden",
    backgroundColor: "#E30613",
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: "3%",
    paddingTop: "3%",
    paddingLeft: "5%",
    "&:hover >*": {
      visibility: "visible"
    }
  },
  gridItem: {
    width: "33%",
    height: "33%"
  }
}));
type FilterBoxProps = {
  filterAmount?: number,
  name?: string,
  parentCallback?: (...args: any[]) => any,
  viewState?: string,
  relevance?: number,
  filterIndex?: number,
  filterImgSize?: number,
  cnnActivation?: any,
  filterName: string,
  images: any[],
  filterInspectionCallback: (index: number, viewType: string) => void;
  filterActivationCallback: (value: any) => void;
  filterSamplesCallback: (value: any) => void;
  filterHeatmapCallback: (value: any) => void;
  nameCallback: (value: any) => void;
  hasActivationStats: number,
  hasRelevanceStats: number,
  currentTab: string,
  filterPosition: any[],
  target: string,
  placeholder: string,
  activation: any[],
  partial: any[],
  synthetic: any[],
  position: any,
  view: string
};
const FilterBox: React.FC<FilterBoxProps> = ({
  filterName,
  name: reference,
  relevance,
  filterIndex,
  images,
  filterImgSize,
  filterInspectionCallback,
  nameCallback,
  filterSamplesCallback,
  filterHeatmapCallback,
  hasActivationStats,
  hasRelevanceStats,
  currentTab,
  filterPosition,
  target,
  filterActivationCallback,
  placeholder,
  activation = null,
  partial = null,
  synthetic = null,
  position = null,
  view
}) => {
  const classes = useStyles(filterImgSize);
  const [partialState, setPartialState] = React.useState([]);
  const [syntheticState, setSyntheticState] = React.useState([]);
  const [actState, setActivations] = React.useState([]);
  const [imgState, setImages] = React.useState([]);
  const [, setHovered] = React.useState(false);
  const inputRef = React.useRef();
  async function triggerTransitionPiping(viewtype: string) {
    filterInspectionCallback(filterIndex, viewtype);
  }
  /* const plot = svg => {
    var element = svg.node().parentNode.parentNode;
    var position = element.getBoundingClientRect();
    var x = position.left;
    var y = position.top;
    //let width = element.clientWidth;
    //let height = element.clientHeight;
    /* console.log(x, y);
    let img = document.getElementsByClassName("ReactCrop__image")[1];
    const defs = svg.append("defs");
    const marker = defs.append("marker");
    const g = svg.append("g");
    const arrow = g.append("path");
    }; */

  React.useEffect(
    () => {
      /*  const createBarPlot = () => {
         var canvas = d3.select(inputRef.current);
         var f = canvas.insert("svg", ":first-child");
         plot(f);
       }; */
      if (filterPosition) {
      }
    },
    [filterPosition]
  );
  /* React.useEffect(() => {
         console.log(inputRef);
        window.addEventListener('scroll', handleScroll, true);
        let svg = d3.select(inputRef.current)
          .append('svg')
          .attr('width', 500)
          .attr('height', 500)
        let rect_width = 95;
        svg.selectAll('rect')
          .data([100, 200])
          .enter()
          .append('rect')
          .attr('x', (d, i) => 5 + i * (rect_width + 5))
          .attr('y', d => 500 - d)
          .attr('width', rect_width)
          .attr('height', d => d)
          .attr('fill', 'teal'); */
  /*  const fWidth = getComputedStyle(document.getElementsByClassName('filter')[0])
       .getPropertyValue("width")
       .trim(); // the result have a leading whitespace.
     setFilterWidth(
       fWidth
     );
   
  }, []);*/
  let imageSize;
  if (images) {
    imageSize = images.length === 9 ? 4 : 12;
  }
  const makeImages = React.useCallback((images, stateToSet) => {
    const filterImages = [];
    if (images instanceof Array) {
      for (let i = 0; i < images.length; i++) {
        const img = `data:image/png;base64,${images[i]}`;
        filterImages.push(
          <img
            src={img}
            className={classes.image}
            key={`${reference}_image_index${i}`}
            alt=""
          />
        );
      }
      stateToSet(filterImages);
    } else {
      const img = `data:image/png;base64,${images}`;
      filterImages.push(
        <img
          src={img}
          className={classes.margins}
          key={`${reference}_image`}
          alt=""
        />
      );
      stateToSet(filterImages);
    }
  }, [classes.image, classes.margins, reference]);
  React.useEffect(
    () => {
      if (activation && filterImgSize) {
        makeImages(activation, setActivations);
      }
      if (partial) {
        makeImages(partial, setPartialState);
      }
      if (synthetic) {
        makeImages(synthetic, setSyntheticState);
      }
      if (images && filterImgSize) {
        makeImages(images, setImages);
      }
    },
    [
      activation,
      makeImages,
      partial,
      synthetic,
      images,
      target,
      classes.image,
      reference,
      filterImgSize,
      imageSize
    ]
  );
  return (
    <Grid
      item
      xl={12}
      lg={12}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragStart={e => {
        e.preventDefault();
      }}
    >
      <div className={`${classes.row}  filters`} ref={inputRef}>
        <div className={relevance >= 0 ? classes.positive : classes.negative + " filter"} >
          <div className={classes.row} >
            <Typography variant="body1" >
              Relevance
              :  {relevance}
            </Typography>
            <Typography variant="body1" style={{ marginLeft: 20 }}>
              Filter:  {filterIndex}
            </Typography>
            {filterName ? <Typography variant="body1" >
              Filter name:  {filterName}
            </Typography> : null}
          </div>
          <div className={classes.row}>
            {partial ? <div className={classes.analysis}>{partialState}</div> : null}
            {synthetic ? <div className={classes.analysis}>{syntheticState}</div> : null}
            <div className={classes.row} style={{ flexWrap: 'wrap' }} >
              <div className={classes.rowCol}>
                <Typography className={classes.smallText}  >R(x|theta={filterIndex} )</Typography>
                <div className={classes.images}  >
                  {actState}
                </div>
              </div>
              <div className={classes.rowCol}>
                <Typography className={classes.smallText} >Sample</Typography>
                <div className={classes.images}  >
                  {imgState}
                </div>
              </div>
            </div>
          </div>
          {view !== "GRAPHVIEW" ?
            <div className={classes.overlay}>
              <div className={classes.buttons}>
                {((currentTab === 'activation' && hasActivationStats) || (currentTab === 'relevance' && hasRelevanceStats)) ?
                  <ButtonGroup variant="contained" orientation='vertical' className={`${classes.buttonRight}  mb-2`} >
                    <Button onClick={() => triggerTransitionPiping('GRAPHVIEW')}
                    >
                      Show Graph <ChevronRightIcon></ChevronRightIcon>
                    </Button>
                    <Button onClick={() => triggerTransitionPiping('STATISTICSVIEW')}
                    >
                      Show Statistics <ChevronRightIcon></ChevronRightIcon>
                    </Button>
                  </ButtonGroup>
                  : <ButtonGroup variant="contained" orientation='vertical' className={`${classes.buttonRight}  mb-2`} >
                    <Button onClick={() => triggerTransitionPiping('GRAPHVIEW')}
                    >
                      Show Graph <ChevronRightIcon></ChevronRightIcon>
                    </Button>
                  </ButtonGroup>
                }
              </div>
            </div>
            : null}
        </div >
      </div>
    </Grid>
  );
};
export default FilterBox;
