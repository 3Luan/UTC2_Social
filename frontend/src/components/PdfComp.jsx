import { useState } from "react";

function PdfComp({ pathFile }) {
  return (
    <embed
      src={`${process.env.REACT_APP_URL_BACKEND}/${pathFile}`}
      width="100%"
      height="500px"
    />
  );
}
export default PdfComp;
