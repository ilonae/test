import React from "react";
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
  buttonRight: {
    marginLeft: "auto"
  },
  partial: {
    height: "100%",
    width: "100%"
  },
  add: {
    display: "inline"
  },
  caption: { display: "table-caption" },
  row: {
    display: "flex",
    wordWrap: "break-word",
    alignItems: "center",
    marginLeft: "1em"
  },
  block: {
    background: "red"
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
  partialText: {
    top: "80%",
    right: 0,
    position: "absolute"
  },
  filters: {
    border: '1px solid black',
    padding: "20px"
  },
  filter: {
    display: "flex"
  },
  tablerow: {
    display: "flex"
  },
  leftfloat: {
    float: "left"
  },
  imagesGraph: {
    height: "auto",
    gap: "1em",
    gridTemplateColumns: "repeat(9,1fr)"
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
    flexDirection: "row",
    height: "auto",
    position: "relative",
    marginLeft: "2%"
  },
  rotation: {
    transform: "rotate(-90deg)",
    whiteSpace: "nowrap"
  },
  italic: {
    fontStyle: 'italic',
    whiteSpace: "nowrap"
  },
  margins: {
    border: "1px solid #555",
    marginLeft: "-5em",
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
    paddingLeft: "3%",
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
  reference?: string,
  viewState?: string,
  relevance?: number,
  conceptId?: number,
  filterImgSize?: number,
  layer?: string,
  filterName?: string,
  images: any[],
  filterInspectionCallback: (index: number, viewType: string) => void;
  currentTab: string,
  activation: any[],
  conditionalHeatmap: any,
};
const FilterBox: React.FC<FilterBoxProps> = (props: FilterBoxProps) => {
  let imageSize;
  const classes = useStyles();
  const [conditionalState, setConditionalState] = React.useState([]);
  const [actState, setActivations] = React.useState([]);
  const [imgState, setImages] = React.useState([]);
  const inputRef = React.useRef();


  if (props.images) {
    imageSize = props.images.length === 9 ? 4 : 12;
  }
  const createFilterImgs = React.useCallback((images, stateToSet, reference, classes) => {
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
    }
    return stateToSet(filterImages);
  }, [classes.image, classes.margins, props.reference]);

  React.useEffect(
    () => {
      if (props.activation && props.filterImgSize) {
        createFilterImgs(props.activation, setActivations, props.reference, classes);
      }
      if (props.conditionalHeatmap) {
        createFilterImgs(props.conditionalHeatmap, setConditionalState, props.reference, classes);
      }
      if (props.images) {
        createFilterImgs(props.images, setImages, props.reference, classes);
      }
    },
    [
      props.activation,
      props.conditionalHeatmap,
      props.images,
      classes.image,
      props.reference,
      props.filterImgSize,
      imageSize
    ]
  );

  const defaultFilter =
    <div className={`${classes.row}  filters`} ref={inputRef}>
      <div className={(props.relevance >= 0 || props.layer) ? classes.positive : classes.negative + " filter"} >
        <div className={classes.row} >
          {props.filterName ? <Typography variant="body2" >
            Filter name:  {props.filterName}
          </Typography> : null}
        </div>
        <div className={classes.row}>
          <div className={classes.analysis}>
            <Typography variant="body2" className={classes.rotation}>
              Concept ID: {props.conceptId}
            </Typography>
            {conditionalState}
            <div className={classes.partialText}>
              <var>R<sub>{props.conceptId}</sub>(x|y)</var> = {Math.round(props.relevance * 100 + Number.EPSILON)} %
            </div>
            <Typography variant="body2" className={classes.italic}>
            </Typography>
          </div>
          <div className={classes.row} style={{ flexWrap: 'wrap' }} >
            <div className={classes.rowCol}>
              <Typography className={classes.smallText}  >
                {"R(x|\u03B8)=" + props.conceptId}</Typography>
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

        <div className={classes.overlay}>
          <div className={classes.buttons}>
            {((props.currentTab === 'activation') || (props.currentTab === 'relevance')) ?
              <ButtonGroup variant="contained" orientation='vertical' className={`${classes.buttonRight}  mb-2`} >
                <Button onClick={() => props.filterInspectionCallback(props.conceptId, 'GRAPHVIEW')}
                >Show Graph <ChevronRightIcon></ChevronRightIcon>
                </Button>
                <Button onClick={() => props.filterInspectionCallback(props.conceptId, 'STATISTICSVIEW')}
                >
                  Show Statistics <ChevronRightIcon></ChevronRightIcon>
                </Button>
              </ButtonGroup>
              : <ButtonGroup variant="contained" orientation='vertical' className={`${classes.buttonRight}  mb-2`} >
                {/*     <Button onClick={() => props.filterInspectionCallback(props.conceptId, 'GRAPHVIEW')}>
                    Show Graph <ChevronRightIcon></ChevronRightIcon>
                  </Button> */}
              </ButtonGroup>
            }
          </div>
        </div>
      </div >
    </div>;
  const graphFilter =
    <div className={`${classes.positive} ${classes.filters}  filters`} >
      <div className={classes.tablerow + " filter"} >
        <Typography className={classes.leftfloat} variant="body1" >
          Layer : {props.layer}
        </Typography>
        <Typography className={classes.leftfloat} variant="body1" style={{ marginLeft: 20 }}>
          Concept ID : {props.conceptId}
        </Typography >
        {props.filterName ?
          <Typography variant="body1" > Filter name : {props.filterName} </Typography>
          : null}
      </div >
      <div className={classes.row}>
        <div className={classes.analysis}>
          {conditionalState}
          <div className={classes.partialText}>
            <var>R<sub>{props.conceptId}</sub>(x|y)</var> = {Math.round(props.relevance * 100 + Number.EPSILON)} %
          </div>
          <Typography variant="body2" className={classes.italic}>
          </Typography>
        </div>
        <div className={classes.row} style={{ flexWrap: 'wrap' }} >
          <div className={classes.rowCol}>
            <Typography className={classes.smallText}  >
              {"R(x|\u03B8)=" + props.conceptId}</Typography>
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
      <div className={classes.tablerow}>
        <Typography className={classes.smallText} >Sample</Typography>
        <div className={classes.imagesGraph}  >
          {imgState}
        </div>
      </div>

    </div>;

  return (
    <Grid
      item
      xl={12}
      lg={12}
      onDragStart={e => {
        e.preventDefault();
      }} >
      {props.viewState === "DASHBOARDVIEW" ? defaultFilter : graphFilter}
    </Grid>
  );
};
export default FilterBox;
