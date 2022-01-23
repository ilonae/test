import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: "2vh"
  },
  checked: {
    width: "100%",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    background: "#009374!important"
  },
  default: {
    width: "100%",
    color: "white",
    justifyContent: "center",
    textAlign: "center",
    background: "#66BFAC!important"
  }
}));

type ExpansionButtonProps = {
  expansionCallback?: (...args: any[]) => any,
  viewState?: string
};

const ExpansionButton: React.SFC<ExpansionButtonProps> = ({
  expansionCallback,
  viewState
}) => {
  const classes = useStyles();
  const [view, changeView] = React.useState(viewState);
  React.useEffect(
    () => {
      expansionCallback(view);
    },
    [view, expansionCallback]
  );
  return (
    <div className={classes.root}>
      {["LOADINGVIEW", "DASHBOARDVIEW", "ERRORVIEW"].includes(view) ? (
        <Button
          className={classes.default}
          variant="contained"
          onClick={() => changeView("IMAGEVIEW")}
          endIcon={<ArrowForwardIosIcon style={{ fontSize: 10 }} />}
        >
          <Typography noWrap>Expand view</Typography>
        </Button>
      ) : (
        <Button
          className={classes.default}
          variant="contained"
          onClick={() => changeView("DASHBOARDVIEW")}
          startIcon={<ArrowBackIosIcon style={{ fontSize: 10 }} />}
        >
          <Typography noWrap>Return</Typography>
        </Button>
      )}
    </div>
  );
};
export default ExpansionButton;
