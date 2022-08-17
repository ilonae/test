import React from "react";
import { Button, Typography } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

type SortingButtonProps = {
  descending?: boolean,
  parentCallback?: (...args: any[]) => any
};

const SortingButton: React.FC<SortingButtonProps> = (props: SortingButtonProps) => {
  const inputEl = React.useRef();
  const handleChange = (e: any) => {
    props.parentCallback(!props.descending);
  };

  return (
    <Button
      variant="contained"
      style={{
        color: "white",
        width: "20%",
        wordWrap: "break-word",
        whiteSpace: "normal",
        backgroundColor: "#66BFAC"
      }}
      onClick={handleChange}
      ref={inputEl}
      startIcon={props.descending === true ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
    >
      <Typography noWrap>
        {props.descending === true
          ? "Sort by lowest contribution"
          : "Sort by highest contribution"}
      </Typography>
    </Button>
  );
};
export default SortingButton;
