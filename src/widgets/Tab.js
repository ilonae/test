import React from 'react';

import PropTypes from 'prop-types';
import Filter from '../container/Filter';
import { Grid, makeStyles, MenuItem, Box, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {
        height: '91vh',
        padding: '3vh',
        position: 'relative',
        overflow: 'auto',
        width: "100%",
    },

    label: {
        color: 'white'
    },
    text: {
        color: 'white',

    },
    selected: {
        color: 'black',

    },
    centering: {
        paddingLeft: '3vh',
        paddingBottom: '5vh',
        justifyContent: 'center'
    },
    innergrid: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '1em',

    },
}));


const TabContent = ({ index, value, parentCallback, layerFilters, filterImgSize,
    indexCallback,
    filterSamplesCallback, filterActivationCallback,
    filterHeatmapCallback, }) => {

    const classes = useStyles();
    const [filters, setFilters] = React.useState([]);
    const [filterBoxes, setFilterBoxes] = React.useState([]);

    const filterGraphCallback = value => {
        parentCallback('GRAPHVIEW');
        indexCallback(value);
    };
    const filterStatisticsCallback = value => {
        parentCallback('STATISTICSVIEW');
        indexCallback(value);
    };

    let currLayer;
    React.useEffect(() => {
        if (layerFilters.length) {
            setFilters(layerFilters)
        }
    }, [layerFilters]);


    React.useEffect(() => {

        if (filters.length) {
            console.log(value)
            currLayer = filters[value];

            const filterIndices = currLayer.filter_indices;
            const filterBox = [];
            for (let i = 0; i < filterIndices.length; i++) {
                const currIndex = filterIndices[i];
                console.log(currIndex)
                filterBox.push(
                    <Filter
                        filterAmount={filterIndices.length}
                        images={currLayer.images[currIndex]}
                        filterIndex={currIndex}
                        filterActivationCallback={filterActivationCallback}
                        filterHeatmapCallback={filterHeatmapCallback}
                        key={`filter_index_${i}`}
                        relevance={currLayer.relevance[i]}
                        filterImgSize={filterImgSize}
                        filterGraphCallback={filterGraphCallback}
                        filterStatisticsCallback={filterStatisticsCallback}
                        filterSamplesCallback={filterSamplesCallback}
                    />
                );
            }
            setFilterBoxes(filterBox);
        }
    }, [filters, value]);

    return (

        <div className={classes.root}>
            < Grid container spacing={5} className={classes.centering}>
                {filterBoxes}
            </Grid>
        </div >
    );
};
TabContent.propTypes = {

};

export default TabContent;
