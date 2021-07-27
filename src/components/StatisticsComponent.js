import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { makeStyles, Box, Card, Grid, CardContent, Typography } from '@material-ui/core';
import Statistic from '../container/Statistic';

const useStyles = makeStyles(() => ({
    root: {
        height: '72vh',
        position: 'relative',
        overflow: 'scroll',
        flexDirection: 'row'
    },
    nodes: {
        fill: 'darkgray'
    },
    nodestext: {
        fill: 'white'
    },
    path: {
        stroke: 'black',
        fill: 'black',
        strokeWidth: '1.5px'
    },
    buttonback: {
        whiteSpace: 'nowrap',
        color: 'white',
        background: '#66BFAC!important',
        marginTop: '2em'
    },
    imagecontainer: {
        display: 'grid',
        alignItems: 'center',
        justifyItems: 'center',
        textAlign: 'center',
        gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)',
        height: '20vh',
        width: '20vh',
        cursor: 'pointer'
    },
    infocontainer: {
        display: 'grid',
        alignItems: 'center',
        justifyItems: 'center',
        textAlign: 'center',
        height: '15vh',
        width: '15vh',
        whiteSpace: 'pre-line',
        fontSize: '0.8em',
        cursor: 'pointer'
    },
    hide: {
        display: 'none'
    },
    show: {
        display: 'flex'
    },
    images: {
        border: '1px solid #555',

        width: '5vh',
        height: '5vh',
        display: 'block',
    }
}));



const StatisticsComponent = ({ statistics, viewState, viewCallback, filterIndex }) => {


    const classes = useStyles();
    const [view, changeView] = React.useState(viewState);
    const [statisticsBox, setStatisticsBox] = React.useState();

    React.useEffect(() => {

        if (statistics) {
            console.log(statistics)
            const statisticsArr = [];
            for (let i = 0; i < statistics.class_rel.length; i++) {
                statisticsArr.push(
                    <Statistic
                        name={statistics.class_name[i]}
                        relevance={statistics.class_rel[i]}
                        images={statistics.image[i]}
                        key={`statistic_${i}`}
                        amount={statistics.class_rel.length}
                    />
                );
            }
            setStatisticsBox(statisticsArr);
        }
    }, [statistics]);


    React.useEffect(() => {
        viewCallback(view);
    }, [view, viewCallback]);

    return (
        <Card>
            <CardContent className={classes.root}>
                <Box display="flex" flexDirection="column" position="relative">
                    <Box flexGrow={1}>
                        <Typography gutterBottom variant='h4' align='center' >Selected Filter: {filterIndex}</Typography>
                    </Box>
                    <Grid container>
                        {statisticsBox}

                    </Grid>
                </Box>

                <Button
                    startIcon={<ArrowBackIosIcon />}
                    onClick={() => changeView('DEFAULTVIEW')}

                    variant="contained"
                    className={classes.buttonback}
                > Return back </Button>

            </CardContent>
        </Card>
    );
};

StatisticsComponent.propTypes = {
    statistics: PropTypes.object,
    filterIndex: PropTypes.number
};


export default StatisticsComponent;
