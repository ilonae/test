import React from "react";
import { makeStyles, Card, Grid, Typography } from "@material-ui/core";
import clsx from "clsx";
import SamplesSwitch from "../widgets/SamplesSwitch";
import FilterSlider from "../widgets/SliderWidget";
const useStyles = makeStyles(theme => ({
  root: {
    height: "16vh",
    marginTop: "2vh",
    position: "relative",
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    padding: "3vh"
  },
  [theme.breakpoints.up("md")]: {
    root: {
      height: "6vh"
    }
  }
}));
type BottomComponentProps = {
  modus?: number,
  isSynthLayer?: number,
  isCnnLayer?: number,
  filterAmount: number,
  bottomCallback?: (...args: any[]) => any,
  isCnnCallback?: (...args: any[]) => any,
  isSynthCallback?: (...args: any[]) => any,
  selectedButtonCallback?: (...args: any[]) => any
};
const BottomComponent: React.FC<BottomComponentProps> = ({
  modus,
  bottomCallback,
  filterAmount,
  isSynthLayer,
  isCnnLayer,
  isCnnCallback,
  isSynthCallback,
  selectedButtonCallback
}) => {
  const classes = useStyles();
  const filterAmountCallback = (value: any) => {
    bottomCallback(value);
  };
  const activationsCallback = (value: any) => {
    isCnnCallback(value);
  };
  const synthCallback = (value: any) => {
    isSynthCallback(value);
  };
  const buttonClickedCallback = (value: any) => {
    selectedButtonCallback(value);
  };
  return (
    <Card className={clsx(classes.root)}>
      <Grid container>
        <Grid item md={3} xs={6}>
          <Typography gutterBottom>Placeholder</Typography>
        </Grid>
        <Grid item md={3} xs={6}>
          <FilterSlider
            filtersCallback={filterAmountCallback}
            selectedAmount={filterAmount}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <SamplesSwitch
            modus={modus}
            isSynthLayer={isSynthLayer}
            isCnnLayer={isCnnLayer}
            activationsCallback={activationsCallback}
            synthCallback={synthCallback}
            buttonClickedCallback={buttonClickedCallback}
          />
        </Grid>
      </Grid>
    </Card>
  );
};
export default BottomComponent;
