import React from "react";
import clsx from "clsx";
import { makeStyles, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

const useStyles = makeStyles(() => ({
  root: {
    textAlign: "center",
    justifyContent: "center"
  },
  switchToggle: {
    float: "left",
    background: "#242729",
    "& input": {
      position: "absolute",
      opacity: 0
    },
    "& label": {
      padding: "7px",
      float: "left",
      color: "#fff"
    }
  },
  checked: {
    color: "white",
    background: "#009374!important"
  },
  default: {
    color: "white",
    background: "#66BFAC!important"
  },
  btnGroup: {
    width: "90%",
    boxShadow: "none"
  }
}));

type SamplesSwitchProps = {
  modus?: number,
  isSynthLayer?: number,
  isCnnLayer: number,
  synthCallback: (value: any) => void,
  activationsCallback?: (...args: any[]) => any,
  buttonClickedCallback?: (...args: any[]) => any
};

const SamplesSwitch: React.FC<SamplesSwitchProps> = ({
  modus,
  isCnnLayer,
  isSynthLayer,
  activationsCallback,
  synthCallback,
  buttonClickedCallback
}) => {
  const classes = useStyles();
  const [selectedBtn, setSelectedBtn] = React.useState(0);
  React.useEffect(
    () => {
      if (modus) {
        setSelectedBtn(modus);
      }
    },
    [modus]
  );

  const toggleButton = (val: number) => {
    if (selectedBtn === val) {
      setSelectedBtn(0);
      buttonClickedCallback(0);
    } else {
      buttonClickedCallback(val);
    }
  };
  return (
    <Grid container className={clsx(classes.root)}>
      <ButtonGroup variant="contained" className={classes.btnGroup}>
        {isCnnLayer === 1 ? (
          <Button
            className={selectedBtn === 1 ? classes.checked : classes.default}
            onClick={() => {
              toggleButton(1);
              activationsCallback(isCnnLayer);
            }}
          >
            <Typography noWrap>Activations</Typography>
          </Button>
        ) : (
          <Button disabled>
            <Typography noWrap>Activations</Typography>
          </Button>
        )}
        <Button
          className={selectedBtn === 2 ? classes.checked : classes.default}
          onClick={() => toggleButton(2)}
        >
          <Typography noWrap>Real Samples</Typography>
        </Button>
        {isSynthLayer === 1 ? (
          <Button
            className={selectedBtn === 1 ? classes.checked : classes.default}
            onClick={() => {
              toggleButton(3);
              synthCallback(isCnnLayer);
            }}
          >
            <Typography noWrap>Synthetic Samples</Typography>
          </Button>
        ) : (
          <Button disabled>
            <Typography noWrap>Synthetic Samples</Typography>
          </Button>
        )}
      </ButtonGroup>
    </Grid>
  );
};
export default SamplesSwitch;
