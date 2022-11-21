import React from 'react';
import { makeStyles, Grid, Card, Typography } from '@material-ui/core';
import Image from '../container/Image';
import InputWidget from '../widgets/InputWidget';
import ExampleButton from '../widgets/ExampleButton';

const useStyles = makeStyles({
  images: {
    margin: 0,
    justifyContent: "center"
  },
  preselected: {
    display: "flex",
    marginBottom: "2vh",
    rowGap: "1vh",
    columnGap: "1vh",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  tools: {
    justifyContent: "center"
  },
  root: {
    height: '91vh',
    padding: '3vh',
    textAlign: 'center',
    position: "relative",
    flexDirection: 'column',
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  imgs: {
    height: '60%',
    justifyContent: 'center',
    display: 'grid',
    textAlign: 'center',
    alignItems: "center"
  },
  search: {
    height: '30%',
    justifyContent: 'center',
    display: 'grid',
    textAlign: 'center'
  },
  centering: {
    justifyContent: 'center',
    height: 'inherit'
  },
  svg: {
    paddingTop: '2vh',
    ".chartbar": {
      fill: 'red'
    }
  },
  marginText: {
    marginTop: "2em"
  }
});

const presetList = [
  {
    layer: "features.40",
    id: '1234',
    samplename: "Great grey owl",
    sampletag: "great_grey_owl"
  },
  {
    layer: "features.40",
    id: '2339',
    samplename: "Green lizard",
    sampletag: "green_lizard"
  },
  {
    layer: "features.40",
    id: '4200',
    samplename: "Peacock",
    sampletag: "peacock"
  },
  {
    layer: "features.40",
    id: '7000',
    samplename: "Red-backed sandpiper",
    sampletag: "red-backed_sandpiper"
  },
  {
    layer: "features.40",
    id: '0',
    samplename: "Tench",
    sampletag: "tench"
  }
]

export interface SidebarProps {
  target: string;
  maxIndex: number;
  indexCallback: (value: any) => void;
  image: string;
  heatmap: string;
  localAnalysisCallback(x: any, y: any, width: any, height: any, maskId?: number): Promise<void>;
  index: number;
  classIndices: any[];
  heatmapClasses: any[];
  heatmapConfidence: any[];
  heatmapRelevances: {
    [key: string]: any;
  };
  currLayer: string;
  presetcallback: (layer: string, id: string, sampletag: string) => void;
  targetCallback: (value: React.SetStateAction<string>) => void;
}

export const SidebarComponent: React.FC<SidebarProps> = (props: SidebarProps) => {
  const classes = useStyles();
  const [, changeCurrentClassIndices] = React.useState([""]);

  React.useEffect(() => {
    if (Object.keys(props.classIndices).length > 0) {
      const classNames = Object.keys(props.classIndices);
      changeCurrentClassIndices(classNames);
    }
  }, [props.classIndices]);

  const presets: any = () => {
    let presets: any[] = []
    for (let preset in presetList) {
      presets.push(<ExampleButton
        key={preset}
        sampletag={presetList[preset].sampletag}
        presetcallback={props.presetcallback}
        layer={presetList[preset].layer}
        id={presetList[preset].id}
        samplename={presetList[preset].samplename} />)
    }
    return presets
  }

  return <Card className={classes.root} id={'inputsCard'}>
    <Grid container className={classes.tools} >
      <Typography gutterBottom variant="body2" style={{ fontWeight: 'bold' }}>Preselected Examples: </Typography>
      <div className={classes.preselected}>
        {presets()}
      </div>
      <Typography gutterBottom variant="body2">Target class: {props.target}</Typography>
    </Grid>
    <Grid container className={classes.images} >
      <Typography gutterBottom variant="body2">Analyze image by index: </Typography>
      <InputWidget id="index" value={props.index} maxIndex={props.maxIndex} params={""} type="number" input="" inputCallback={props.indexCallback} filterNameCallback={() => console.log("test")} />
      <Image content={props.image} title={'Input'} getLocalAnalysisCallback={props.localAnalysisCallback} />
      <Image content={props.heatmap} title={'Heatmap'} getLocalAnalysisCallback={props.localAnalysisCallback}
      />
      <Typography variant="body2" className={classes.marginText} gutterBottom>Heatmap confidence: {props.heatmapConfidence.length ? Math.round(props.heatmapConfidence[0] * 10000 + Number.EPSILON) / 100 : null} %</Typography>
      <Typography variant="body2" gutterBottom>Current layer: {props.currLayer} </Typography>
      <Typography variant="body2" gutterBottom> Layer's heatmap contribution:
        {Math.round(props.heatmapRelevances[props.currLayer] * 100 + Number.EPSILON) / 100} %
      </Typography>
    </Grid>
  </Card>
};

export default SidebarComponent;
