import * as React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import socketIOClient from "socket.io-client";
import { LandingPage } from './LandingPage';
import Dashboard from './XAIBoard';

export interface AppProps {
    basename: string;
}

const socket = socketIOClient('http://titan:5050');
socket.on('data', data => {
    console.log(data);
});

export const App = (props: AppProps) => (
    <Router basename={props.basename}>
        <Switch>
            <Route exact path='/'
                component={(props: { socket: any; }) => <LandingPage socket={socket} {...props} />}
            ></Route>
            <Route path='/dashboard'
                component={(props: { socket: any; }) => <Dashboard socket={socket}  {...props} />} />
        </Switch>
    </Router>
);




