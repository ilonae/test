import * as React from "react";
import { FormControl, InputAdornment, Button, makeStyles, TextField } from '@material-ui/core';

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

const SignUpLoginForm = (socket: any) => {
    const [error, setError] = React.useState("");
    const [token, setToken] = React.useState("");
    const classes = useStyles();

    const onSubmit = (e: any) => {
        e.preventDefault();
        socket
            .on('authenticated', function () {
                window.location.href = "/dashboard"
            })
            .emit('authenticate', { token });
    };


    return (
        <div className={classes.root}>
            <form onSubmit={onSubmit} className={classes.form}>
                <FormControl>
                    <TextField type='password' helperText={error} label="Token" error={error.length === 0 ? false : true} onChange={e => {
                        setToken(e.target.value);
                        setError("gzz");
                    }} InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            </InputAdornment>
                        ),
                    }} />
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

export interface LandingPageProps {
    socket: any;
}



export const LandingPage = (props: LandingPageProps) => (
    <div >
        <SignUpLoginForm socket={props.socket} />
    </div>
);

