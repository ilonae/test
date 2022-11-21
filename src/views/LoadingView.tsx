import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core';
import React from "react";
import { DotLoader } from 'react-spinners'


const useStyles = makeStyles(() => ({
    loading: {
        display: 'table-cell',
        textAlign: 'center',
        verticalAlign: 'middle',
        marginTop: '-10vh'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.7)',
        zIndex: 100
    }
}));

type LoadingViewProps = {
    defaultView: any,
    loadPercentage: number
};


const LoadingView: React.FC<LoadingViewProps> = (props: LoadingViewProps) => {
    const classes = useStyles();

    return (
        <div id='expansioncontainer' className={classes.loading}>
            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={3} wrap="nowrap" className={classes.overlay}>
                <DotLoader size={100} color={"#333333"} loading={true} />
                <h3> Loading... {props.loadPercentage} %</h3>
            </Grid>
            {props.defaultView}
        </div >
    )
}
export { LoadingView, type LoadingViewProps }