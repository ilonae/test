import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import getJwt from './getJwt';

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Authenticated: false,
        };
    }

    componentDidMount() {
        const { history } = this.props;
        const jwt = getJwt();
        if (!jwt) {
            history.push('/');
        } else {
            this.setState({ Authenticated: true });
        }
    }

    render() {
        const { children } = this.props;
        const { Authenticated } = this.state;
        if (Authenticated === false) {
            return (
                <div>loading....</div>
            );
        }
        return (
            <div>
                {children}
            </div>
        );
    }
}

export default withRouter(Auth);