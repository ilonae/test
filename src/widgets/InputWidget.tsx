import React from "react";
import { makeStyles, TextField } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    paddingLeft: "20%",
    paddingRight: "20%",
    alignItems: "center",
    marginTop: "2%",
    justifyContent: "space-between"
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
    background: "#66BFAC!important"
  },
  button: {
    color: "#66BFAC !important"
  },
  filter: {
    "& .MuiInputBase-input": {
      background: "#d5d5d5"
    },
    margin: "auto"
  }
}));

const min = 0;
const max = 10;

export interface InputWidgetProps {
  id: string,
  value: number,
  type: React.HTMLInputTypeAttribute,
  input: string,
  inputCallback: (value: any) => void,
  filterNameCallback: (value: any) => void,
  maxIndex: number,
  params: any
}

export const InputWidget: React.FC<InputWidgetProps> = (props: InputWidgetProps) => {
  const [valueState, setValueState] = React.useState(props.value);
  const [filterName, setFilterName] = React.useState("");
  const classes = useStyles();
  return props.input === "sample" ? (
    <TextField
      type={props.type}
      variant="outlined"
      className={classes.root}
      inputProps={{ min, max }}
      value={valueState}
      onChange={e => {
        var value = parseInt(e.target.value);
        if (value > props.maxIndex) value = props.maxIndex;
        if (value < 0) value = 0;
        setValueState(value);
      }}
      onKeyPress={ev => {
        if (ev.key === "Enter") {
          props.inputCallback(valueState);
          ev.preventDefault();
        }
      }}
    />
  ) : props.id == "index" ? (
    <TextField
      type={props.type}
      variant="outlined"
      className={classes.root}
      inputProps={{ min, max }}
      value={valueState}
      onChange={e => {
        var value = parseInt(e.target.value);
        if (value > props.maxIndex) value = props.maxIndex;
        if (value < 0) value = 0;
        setValueState(value);
      }}
      onKeyPress={ev => {
        if (ev.key === "Enter") {
          props.inputCallback(valueState);
          ev.preventDefault();
        }
      }}
    />
  ) : props.id == "name" ? (
    <TextField
      type={props.type}
      label={"Search by class name or index"}
      {...props.params}
      variant="outlined"
    />
  ) : (
    <TextField
      type={props.type}
      className={classes.filter}
      label={"Edit filter name"}
      variant="outlined"
      onChange={e => {
        setFilterName(e.target.value);
      }}
      onKeyPress={ev => {
        if (ev.key === "Enter") {
          props.filterNameCallback(filterName);
          ev.preventDefault();
        }
      }}
    />
  );
};
export default InputWidget;
