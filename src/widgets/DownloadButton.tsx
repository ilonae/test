import React from "react";
import jsPDF from "jspdf";
//import html2canvas from "html2canvas";
import * as htmlToImage from "html-to-image";
//import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { Button } from "@material-ui/core";
type DownloadButtonProps = {
  order?: string,
  name: string,
  id: string,
  parentCallback?: (...args: any[]) => any
};
const DownloadButton: React.FC<DownloadButtonProps> = ({
  parentCallback,
  name,
  id
}) => {
  //const [textValue, changeTextValue] = React.useState("");
  //const fileRef = React.useRef(null);
  const downloadPDF = () => {
    htmlToImage
      .toPng(document.getElementById("root"), { quality: 0.95 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "my-image-name.jpeg";
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = imgProps.height * pdfWidth / imgProps.width;
        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("summary.pdf");
      });
  };
  const downloadSettings = () => {
    console.log("test");
  };
  return (
    <Button
      id={id}
      onClick={id === "pdf" ? downloadPDF : downloadSettings}
      variant="contained"
      component="label"
      style={{
        color: "white",
        width: "30%",
        textAlign: "center",
        margin: "5%",
        wordWrap: "break-word",
        whiteSpace: "normal",
        backgroundColor: "#66BFAC"
      }}
    >
      {name}
    </Button>
  );
};
export default DownloadButton;
