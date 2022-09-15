import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  makeStyles
} from "@material-ui/core";
const useStyles = makeStyles(() => ({
  root: {
    width: "20%",
    marginRight: "5%",
    backgroundColor: "#66BFAC"
  },
  label: {
    color: "white"
  },
  text: {
    color: "white",
    height: "100%"
  },
  selected: {
    color: "black"
  }
}));
type SelectionProps = {
  selectedParam?: string,
  select?: string,
  parentCallback?: (...args: any[]) => any,
  params?: any[]
};
const Selection: React.FC<SelectionProps> = (props: SelectionProps) => {

  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{
    name?: string;
    value: unknown;
  }>) => {
    props.parentCallback(event.target.value);
  };


  return (
    <FormControl variant="filled" className={classes.root}>
      <InputLabel className={classes.label} htmlFor="selection">
        {props.select}:
      </InputLabel>
      <Select
        className={classes.text}
        native
        value={props.selectedParam}
        onChange={handleChange}
        inputProps={{
          index: "select"
        }}
      >
        {props.params ? (props.params.map(i => (
          <option key={i} value={i} className={classes.selected}>
            {i}
          </option>
        ))) : null}
      </Select>
    </FormControl>
  );
};
export default Selection;
