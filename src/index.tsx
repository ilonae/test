import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

const basename = process.env.REACT_APP_BASENAME || null;

ReactDOM.render(<App basename={basename} />, document.getElementById('root'));
