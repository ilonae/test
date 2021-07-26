import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import queueries from '../util/queries';

let jwt;

class Auth extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Authenticated: false,

        };

    }

    async componentDidMount() {
        let status = await queueries.checkJWT();
        const { history } = this.props;
        if (status != 202) {
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