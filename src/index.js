import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
} from "react-router-dom";

import LandingPage from './LandingPage';
import Dashboard from './XAIBoard';
ReactDOM.render(<Router>
    <Switch>
        <Route exact path='/' component={LandingPage} />
        <Route path='/dashboard' component={Dashboard} />
    </Switch>
</Router>, document.getElementById('root'));
