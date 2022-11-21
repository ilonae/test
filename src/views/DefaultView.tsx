import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core';
import React from "react";
import { NetworkComponent } from "../components/NetworkComponent";
import SidebarComponent from "../components/SidebarComponent";
import { StatisticsComponent } from "../components/StatisticsComponent";

const useStyles = makeStyles(() => ({
    expansionContainer: {
        display: 'flex', width: '196vw'
    },
    defaultContainer: {
        display: 'flex', width: '98vw',
    },
    default: {
        display: 'flex', flexGrow: 1, width: '98vw', visibility: "visible"
    },
    hiddenStatistics: {
        visibility: 'hidden',
        width: 0,
    },
    expandedStatistics: {
        display: 'flex',
        flexGrow: 1,
        width: '98vw',
        visibility: "visible"
    },
    zIndex: {
        zIndex: 100
    }
}));

type DefaultViewProps = {
    viewType?: string;
    viewState: string;
    currentLayer: string,
    viewCallback: (value: any) => void;
    indexState: (value: any) => void;
    localAnalysis: (x: any, y: any, width: any, height: any, maskId?: number) => Promise<void>;
    layerInfo: {
        experimentUpdate: false,
        graphUpdate: false,
        tabChange: false,
        changeView: false,
        statsUpdate: false,
        updateAfterAnalysis: false,
        glocalAnalysisUpdate: false,
        filterDataUpdate: false,
        comparing: false,
        experiment: "",
        experiments: [],
        method: "epsilon_plus_flat",
        index: 0,
        conceptId: 0,
        targetId: 0,
        target: "",
        targets: [],
        singleLayer: "",
        layer: [],
        currentImage: '',
        descending: true,
        maxIndex: 49999,
        currentAnalysis: "relevance",
        heatmap: {
            heatmapImg: "",
            heatmapClasses: [],
            heatmapConfidence: [],
            heatmapRelevances: {},
        },
    }
};



const DefaultView: React.FC<DefaultViewProps> = (props: DefaultViewProps) => {
    const classes = useStyles();

    const indexState = (value: any) => {
        setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            index: value
        }))
    };

    const presetChange = (layer: string, index: string, sampletag: string) => {
        let targetId = (Object.keys(props.layerInfo.targets).find(key => props.layerInfo.targets[key] === sampletag))
        setLayerInfo((layerInfo: any) => ({
            ...layerInfo,
            index: parseInt(index),
            targetId: parseInt(targetId),
            singleLayer: layer
        }))
    }

    return (
        <div id='expansioncontainer' className={(props.viewType === 'STATISTICSVIEW' || props.viewType === 'GRAPHVIEW') ? classes.expansionContainer : classes.defaultContainer}>
            <div className={classes.default}>
                <Grid item xl={2} lg={3} md={4} xs={4}>
                    <SidebarComponent
                        target={props.layerInfo.target}
                        maxIndex={props.layerInfo.maxIndex}
                        indexCallback={indexState}
                        image={props.layerInfo.currentImage}
                        heatmap={props.layerInfo.heatmap.heatmapImg}
                        localAnalysisCallback={props.localAnalysis}
                        index={props.layerInfo.index}
                        presetcallback={presetChange}
                        classIndices={props.layerInfo.targets}
                        heatmapClasses={props.layerInfo.heatmap.heatmapClasses}
                        currLayer={props.layerInfo.singleLayer}
                        heatmapConfidence={props.layerInfo.heatmap.heatmapConfidence}
                        heatmapRelevances={props.layerInfo.heatmap.heatmapRelevances}
                        targetCallback={newTarget => setLayerInfo((layerInfo: any) => ({
                            ...layerInfo,
                            target: newTarget
                        }))} />
                </Grid>
                <FilterComponent
                    target={props.layerInfo.target}
                    orderCallback={selectedOrder}
                    viewState={"DASHBOARDVIEW"}
                    selectedLayer={props.layerInfo.singleLayer}
                    selectedExperiment={props.layerInfo.experiment}
                    selectedMethod={props.layerInfo.method}
                    layers={props.layerInfo.layer}
                    descending={props.layerInfo.descending}
                    methods={methods}
                    selectedTab={props.layerInfo.currentAnalysis}
                    models={props.layerInfo.experiments}
                    experimentsCallback={selectedExperiment}
                    methodsCallback={selectedMethod}
                    layerCallback={selectedLayer}
                    filters={filterData}
                    compareFilters={comparingData}
                    filterImgSize={filterImgSize}
                    filterInspectionCallback={inspectFilter}
                    analysisCallback={checkAnalysisCallback}
                />
            </div>
            <div className={(viewType === 'STATISTICSVIEW' || viewType === 'GRAPHVIEW') ? classes.expandedStatistics : classes.hiddenStatistics}>
                {viewType === 'STATISTICSVIEW' ?
                    < StatisticsComponent viewState={viewType}
                        viewCallback={viewState}
                        statistics={statisticsData}
                        statisticName={props.layerInfo.currentAnalysis}
                        currentLayer={props.layerInfo.singleLayer}
                        conceptId={props.layerInfo.filters.current_id} />
                    : viewType === 'GRAPHVIEW' ?
                        <NetworkComponent viewState={viewType} viewCallback={viewState} graph={graphData} conceptId={props.layerInfo.filters.current_id} />
                        : null}
            </div>
        </div >
    )
}
export { DefaultView, type statistDefaultViewPropsicsProps }