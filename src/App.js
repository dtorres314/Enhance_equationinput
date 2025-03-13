// App.js

import React, { useState } from "react";
import { addStyles, EditableMathField } from "react-mathquill";

// Load MathQuill styles ONCE:
addStyles();

export default function App() {
  const [latex, setLatex] = useState("");

  return (
    <div style={{ margin: "2rem" }}>
      <h2>React + MathQuill Demo</h2>

      {/* This is the interactive math editor */}
      <EditableMathField
        latex={latex} // the initial field value (double-slash escapes!)
        onChange={(mathField) => {
          setLatex(mathField.latex());
        }}
        style={{
          minHeight: "50px",
          border: "1px solid #ccc",
          padding: "8px",
          fontSize: "1.2em",
          width: "300px",
        }}
      />

      <p>LaTeX: {latex}</p>
    </div>
  );
}
