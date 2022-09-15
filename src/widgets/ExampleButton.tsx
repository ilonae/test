import React, { FC } from "react";
import { Button, ButtonProps } from "@material-ui/core";


export interface ExampleButtonProps extends ButtonProps {
    layer: string,
    sampleName: string,
    sampleTag: string,
    id: string,
    presetCallback: (layer: string, id: string, sampleTag: string) => void;

}
export const ExampleButton: FC<ExampleButtonProps> = (props: ExampleButtonProps) => {

    return (
        <Button {...props}
            variant="contained"
            onClick={() => props.presetCallback(props.layer, props.id, props.sampleTag)}
            size="small"
            style={{
                color: "white",
                wordWrap: "break-word",
                whiteSpace: "normal",
                backgroundColor: "#66BFAC"
            }}>
            {props.sampleName}
        </Button>

    );
};
export default ExampleButton;
