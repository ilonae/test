import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Dashboard from './XAIBoard';

export interface AppProps {
    basename: string;
}
const socket = socketIOClient('172.17.21.147:5059');

export const App = (props: AppProps) => (
    <Router basename={props.basename}>
        <Switch>
            <Route exact path='/' component={(props: { socket: any; }) => <Dashboard socket={socket} {...props} />} />
        </Switch>
    </Router>
);




