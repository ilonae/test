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
      startIcon={props.descending === false ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
    >
      <div>
        <Typography>
          Change sorting
        </Typography>
        <Typography variant="subtitle2"
          style={{
            fontSize: "0.72em"
          }}
        >
          Current sorting :
          {props.descending === true
            ? " highest contribution "
            : " lowest contribution "}
        </Typography>


      </div>



    </Button>
  );
};
export default SortingButton;
