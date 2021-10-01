import React from 'react';
import { Typography, makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        paddingLeft: '20%',
        paddingRight: '20%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    switchToggle: {
        float: 'left',
        background: '#242729',
        '& input': {
            position: 'absolute',
            opacity: 0
        },

        '& label': {
            padding: '7px',
            float: 'left',
            color: '#fff'
        }
    },
    checked: {
        color: 'white',
        background: '#009374!important'
    },
    default: {
        background: '#66BFAC!important'
    },
    button: {
        color: '#66BFAC !important'
    },
    filter: {
        "& .MuiInputBase-input": {
            background: "#d5d5d5"
        },
        margin: 'auto'
    }

}));

const min = 0;
const max = 10;

const InputWidget = ({ id, value, type, input, inputCallback, filterNameCallback, maxIndex, params }) => {
    const [valueState, setValueState] = React.useState(value);
    const [filterName, setFilterName] = React.useState("");
    const classes = useStyles();

    return (
        input === "sample" ? <TextField
            type={type}
            variant="outlined"
            className={classes.root}
            inputProps={{ min, max }}
            value={valueState}
            onChange={(e) => {
                var value = parseInt(e.target.value);
                if (value > maxIndex) value = maxIndex;
                if (value < 0) value = 0;
                setValueState(value);
            }}
            onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                    inputCallback(valueState)
                    ev.preventDefault();
                }
            }}
        /> :
            id == "index" ?
                <TextField
                    type={type}
                    variant="outlined"
                    className={classes.root}
                    inputProps={{ min, max }}
                    value={valueState}
                    onChange={(e) => {
                        var value = parseInt(e.target.value);
                        if (value > maxIndex) value = maxIndex;
                        if (value < 0) value = 0;
                        setValueState(value);
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            inputCallback(valueState)
                            ev.preventDefault();
                        }
                    }}
                /> : id == "name" ? <TextField
                    type={type}
                    label={"Search by class name or index"}
                    {...params}
                    variant="outlined"
                /> : <TextField
                    type={type}
                    className={classes.filter}
                    label={"Edit filter name"}
                    variant="outlined"
                    onChange={(e) => {
                        setFilterName(e.target.value);
                    }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            filterNameCallback(filterName)
                            ev.preventDefault();
                        }
                    }}
                />
    );
};

InputWidget.propTypes = {
};

export default InputWidget;
