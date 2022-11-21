import React from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const useStyles = makeStyles(() => ({
  button: {
    color: "white",
    width: "20%",
    wordWrap: "break-word",
    whiteSpace: "normal",
    backgroundColor: "#66BFAC"
  },
  smallFont: {
    fontSize: "0.72em"
  },
  flexText: {
    display: "flex",
    flexDirection: "column"
  }
}));

type SortingButtonProps = {
  descending?: boolean,
  parentCallback?: (...args: any[]) => any
};

const SortingButton: React.FC<SortingButtonProps> = (props: SortingButtonProps) => {

  const classes = useStyles();
  const inputEl = React.useRef();

  const handleChange = (e: any) => {
    props.parentCallback(!props.descending);
  };

  return (
    <Button
      variant="contained"
      className={classes.button}
      onClick={handleChange}
      ref={inputEl}
      startIcon={props.descending === false ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
    ><div className={classes.flexText}>
        <Typography>Change sorting</Typography>
        <Typography variant="subtitle2" className={classes.smallFont}>
          Current sorting :{props.descending === true ?
            " highest contribution " : " lowest contribution "}
        </Typography>
      </div>
    </Button>
  );
};
export default SortingButton;
