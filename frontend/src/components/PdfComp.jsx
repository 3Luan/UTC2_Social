import { useState } from "react";

function PdfComp({ pathFile }) {
  return (
    <embed
      src={`http://localhost:3001/${pathFile}`}
      width="100%"
      height="500px"
    />
  );
}
export default PdfComp;
