import React, { FC } from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
        color: "white",
        wordWrap: "break-word",
        whiteSpace: "normal",
        backgroundColor: "#66BFAC"
    }
}));

type PresetButtonProps = {
    layer: string,
    samplename: string,
    sampletag: string,
    id: string,
    presetcallback?: (layer: string, id: string, sampletag: string) => void
}

export const ExampleButton: FC<PresetButtonProps> = ({ presetcallback, id, layer, samplename, sampletag }: PresetButtonProps) => {
    const classes = useStyles();
    return (
        <Button variant="contained"
            onClick={() => presetcallback(layer, id, sampletag)}
            size="small"
            className={classes.root}>
            {samplename}
        </Button>
    );
};
export default ExampleButton;
