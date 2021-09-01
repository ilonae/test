import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,

} from "react-router-dom";

import Auth from './server/Auth';
import LandingPage from './LandingPage';
import Dashboard from './XAIBoard';
const basename = process.env.REACT_APP_BASENAME || null;
ReactDOM.render(<Router basename={basename}>
    <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route path='/dashboard' render={props => <Auth><Dashboard {...props} /></Auth>} />
    </Switch>
</Router>, document.getElementById('root'));
