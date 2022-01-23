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
    color: "white"
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
const Selection: React.FC<SelectionProps> = ({
  select,
  parentCallback,
  params,
  selectedParam
}) => {
  const [parameters, setParameters] = React.useState([]);
  const [parameter, setParameter]: any = React.useState("");
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{
    name?: string;
    value: unknown;
  }>) => {
    setParameter(event.target.value);
    parentCallback(event.target.value);
  };
  React.useEffect(
    () => {
      if (typeof params !== "undefined" && params.length > 0 && selectedParam) {
        setParameters(params);
        setParameter(selectedParam);
      }
    },
    [params, selectedParam]
  );
  if (!parameters) {
    return null;
  }
  return (
    <FormControl variant="filled" className={classes.root}>
      <InputLabel className={classes.label} htmlFor="selection">
        {select}:
      </InputLabel>
      <Select
        className={classes.text}
        native
        value={parameter}
        onChange={handleChange}
        inputProps={{
          index: "select"
        }}
      >
        {parameters.map(i => (
          <option key={i} value={i} className={classes.selected}>
            {i}
          </option>
        ))}
      </Select>
    </FormControl>
  );
};
export default Selection;
