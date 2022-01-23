import React from "react";
import { Button, Typography } from "@material-ui/core";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

type SortingButtonProps = {
  order?: string,
  parentOrder: string,
  parentCallback?: (...args: any[]) => any
};

const SortingButton: React.FC<SortingButtonProps> = ({
  parentCallback,
  parentOrder
}) => {
  const [descending, setSorting] = React.useState(true);
  const [order, setOrder] = React.useState("");
  const inputEl = React.useRef();
  const handleChange = (e: any) => {
    setSorting(!descending);
  };
  React.useEffect(
    () => {
      if (order) {
        parentCallback(order);
      }
    },
    [order, parentCallback]
  );
  React.useEffect(
    () => {
      setOrder(descending ? "max" : "min");
    },
    [descending]
  );
  React.useEffect(
    () => {
      if (parentOrder) {
        setOrder(parentOrder);
      }
    },
    [parentOrder]
  );

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
      value={order}
      startIcon={order === "max" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
    >
      <Typography noWrap>
        {order === "max"
          ? "Sort by lowest contribution"
          : "Sort by highest contribution"}
      </Typography>
    </Button>
  );
};
export default SortingButton;
