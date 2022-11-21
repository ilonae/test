import React, { FC } from "react";
import { Button } from "@material-ui/core";

type PresetButtonProps = {
    layer: string,
    samplename: string,
    sampletag: string,
    id: string,
    presetcallback?: (layer: string, id: string, sampletag: string) => void

}
export const ExampleButton: FC<PresetButtonProps> = ({ presetcallback, id, layer, samplename, sampletag }: PresetButtonProps) => {
    return (
        <Button
            variant="contained"
            onClick={() => presetcallback(layer, id, sampletag)}
            size="small"
            style={{
                color: "white",
                wordWrap: "break-word",
                whiteSpace: "normal",
                backgroundColor: "#66BFAC"
            }}>
            {samplename}
        </Button>
    );
};
export default ExampleButton;
