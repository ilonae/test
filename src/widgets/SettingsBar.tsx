import React from "react";
import SortingButton from './SortingWidget';
import Selection from './SelectionWidget';
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    innergrid: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginTop: "1em"
    }
}));

export interface SettingsBarProps {
    models: string[];
    layers: string[];
    methods: string[];
    selectedExperiment: string;
    selectedLayer: string;
    selectedMethod: string;
    experimentsCallback: (value: any) => void;
    layerCallback: (value: any) => void;
    methodsCallback: (value: any) => void;
    orderCallback: (value: any) => void;
    descending: boolean;
}

export const SettingsBar: React.FC<SettingsBarProps> = (props: SettingsBarProps) => {
    const classes = useStyles();

    return (
        <Grid item className={classes.innergrid} xs={12}>
            <Selection
                select={'Experiment'}
                selectedParam={props.selectedExperiment}
                parentCallback={props.experimentsCallback}
                params={props.models}
            />
            <Selection
                select={'Layer'}
                selectedParam={props.selectedLayer}
                parentCallback={props.layerCallback}
                params={props.layers}
            />
            <Selection
                select={'Method'}
                selectedParam={props.selectedMethod}
                parentCallback={props.methodsCallback}
                params={props.methods}
            />
            <SortingButton descending={props.descending} parentCallback={props.orderCallback} />

        </Grid>
    );
};
export default SettingsBar;
