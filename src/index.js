import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,

} from "react-router-dom";

import Auth from './server/Auth';

import socketIOClient from "socket.io-client";
import LandingPage from './LandingPage';
import Dashboard from './XAIBoard';


class App extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            socket: null,
        };
    }
    componentDidMount() {
        const socket = socketIOClient('http://titan:5050');
        socket.on('connect', function () {

        });


        this.setState({ socket: socket }, () => {
        });

    }

    render() {
        const basename = process.env.REACT_APP_BASENAME || null;
        return (
            <div>
                <Router basename={basename}>
                    <Switch>
                        <Route exact path='/'
                            component={props => <LandingPage socket={this.state.socket} {...props} />}
                        ></Route>
                        <Route path='/dashboard' render={props => <Dashboard socket={this.state.socket}  {...props} />} />
                    </Switch>
                </Router>
            </div>
        )
    }
}



ReactDOM.render(<App>  {

}</App>, document.getElementById('root'));
