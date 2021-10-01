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


const TabContent = ({ index, value, viewTypeCallback, layerFilters, filterImgSize,
    indexCallback,
    filterInspectionCallback,
    filterSamplesCallback, filterActivationCallback,
    filterHeatmapCallback, nameCallback,
    hasActivationStats, hasRelevanceStats, currentTab }) => {

    const classes = useStyles();
    const [filters, setFilters] = React.useState();
    const [filterBoxes, setFilterBoxes] = React.useState([]);

    const filterGraphCallback = async value => {
        await indexCallback(value, 'GRAPHVIEW');
    };
    const filterStatisticsCallback = async value => {
        await indexCallback(value, 'STATISTICSVIEW');
    };
    React.useEffect(() => {
        if (layerFilters) {
            setFilters(layerFilters)
        }
    }, [layerFilters]);


    React.useEffect(() => {
        if (filters && Object.keys(filters.images).length !== 0) {
            const filterIndices = filters.filter_indices;
            const filterBox = [];
            for (let i = 0; i < filterIndices.length; i++) {
                const currIndex = filterIndices[i];

                filterBox.push(
                    <Filter
                        filterPosition={filters.position[currIndex]}
                        filterName={filters.filter_names[i]}
                        filterAmount={filterIndices.length}
                        images={filters.images[currIndex]}
                        filterIndex={currIndex}
                        filterActivationCallback={filterActivationCallback}
                        filterHeatmapCallback={filterHeatmapCallback}
                        key={`filter_index_${i}`}
                        relevance={filters.relevance[i]}
                        filterImgSize={filterImgSize}
                        filterInspectionCallback={filterInspectionCallback}
                        filterSamplesCallback={filterSamplesCallback}
                        nameCallback={nameCallback}
                        currentTab={currentTab}
                        hasRelevanceStats={hasRelevanceStats}
                        hasActivationStats={hasActivationStats}
                    />
                );
            }
            setFilterBoxes(filterBox);
        }
    }, [filters, value]);

    return (

        <div className={classes.root} >
            < Grid container spacing={5} className={classes.centering}>
                {filterBoxes}
            </Grid>
        </div >
    );
};
TabContent.propTypes = {

};

export default TabContent;
