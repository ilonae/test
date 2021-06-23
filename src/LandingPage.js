import React from "react";
import axios from "axios";


import { FormControl, InputAdornment, Input, FormHelperText, Button, makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        textAlign: 'center',
        marginTop: '10%'
    },
    form: {
        display: 'flex',
        marginLeft: '40%',
        marginRight: '40%',
        width: '20%',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '1em',

    },
    button: {
        marginTop: '2%'
    }
}))

const SignUpLoginForm = () => {
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");
    const [password, setPassword] = React.useState("");

    const classes = useStyles();

    const onSubmit = e => {
        e.preventDefault();

        const userData = {
            email,
            password
        };
        axios
            .post("/register_login", userData)
            .then(res => {
                window.location = "/dashboard"
            })
            .catch(err => {
                console.log(err);
                setError('Enter valid login data');
            });
    };

    return (
        <div className={classes.root}>
            <div>Sign up / Login:</div>
            <form onSubmit={onSubmit} className={classes.form}>

                <FormControl>
                    <TextField id="my-input" helperText={error} label="Email" error={error.length === 0 ? false : true} onChange={e => {
                        setEmail(e.target.value);
                    }} />
                </FormControl>

                <FormControl>
                    <TextField type='password' helperText={error} label="Password" error={error.length === 0 ? false : true} onChange={e => {
                        setPassword(e.target.value);
                    }} InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            </InputAdornment>
                        ),
                    }} />
                </FormControl>

                <FormControl controlId="formBasicCheckbox">

                </FormControl>
                <Button

                    className={classes.button}
                    type="submit"
                    variant="contained" color="primary">
                    Submit
                </Button>
            </form>
        </div>
    );
};

const SignupLoginModal = props => {
    return (
        <div show={props.show} onHide={() => props.setShow(false)}>


            <SignUpLoginForm />

        </div>

    );
};

export default SignupLoginModal;
