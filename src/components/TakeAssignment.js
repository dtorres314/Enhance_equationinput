// src/takeAssignmentPage.js

import React, { useState } from "react";
import { addStyles, EditableMathField } from "react-mathquill";

// 1) Load MathQuill styles once at startup
addStyles();

/*
  This component:
   - Lets you select an XML file
   - Parses it into a DOM
   - Recursively displays all Element/Text nodes
   - If an element is named "OriginalRawText" (example) or "Answer", we show a MathQuill input box

  Usage:
    <TakeAssignmentPage />
*/
export default function TakeAssignmentPage() {
  const [xmlRoot, setXmlRoot] = useState(null);
  const [mathValues, setMathValues] = useState({}); // track latex state for each node

  // Load XML from file
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) {
      alert("Invalid XML file");
      return;
    }
    // Store the root <Problem> (or the entire doc if you prefer)
    setXmlRoot(doc.documentElement);
    // Reset any prior mathValues
    setMathValues({});
  };

  // Update latex for a specific node path
  const handleLatexChange = (path, latex) => {
    setMathValues((old) => ({ ...old, [path]: latex }));
  };

  // Recursively render a single DOM node + children
  function renderNode(node, path = "root") {
    // If text node
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue.trim();
      if (!text) return null; // skip empty
      return <span key={path}>{text} </span>;
    }

    // If it's not an element, ignore
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const nodeName = node.nodeName;
    const children = [...node.childNodes];

    // Check if we want a MathQuill input for this node's text content
    // Example: "OriginalRawText", or "Answer"
    if (nodeName === "OriginalRawText" || nodeName === "Answer") {
      // We'll use path as unique key
      const latex = mathValues[path] || node.textContent.trim();
      return (
        <div
          key={path}
          style={{ border: "1px solid #ccc", margin: "5px 0", padding: "5px" }}
        >
          <strong>{nodeName}:</strong>
          <EditableMathField
            latex={latex}
            onChange={(mf) => handleLatexChange(path, mf.latex())}
            style={{
              minHeight: "40px",
              fontSize: "1.1em",
              border: "1px solid #999",
              padding: "4px",
              width: "100%",
            }}
          />
          <p style={{ fontSize: "0.85em", color: "#666" }}>Latex: {latex}</p>
        </div>
      );
    }

    // Otherwise, just display nodeName + recursively show children
    return (
      <div
        key={path}
        style={{
          marginLeft: "10px",
          borderLeft: "2px solid #eee",
          paddingLeft: "6px",
        }}
      >
        <strong>{nodeName}:</strong>
        <div style={{ marginLeft: "10px" }}>
          {children.map((child, index) => {
            const childPath = path + "-" + index;
            return renderNode(child, childPath);
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>Load XML</h2>
      <input
        type="file"
        accept=".xml"
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />

      {xmlRoot && (
        <div style={{ border: "1px solid #ccc", padding: "10px" }}>
          {/* Render the entire XML root recursively */}
          {renderNode(xmlRoot, "root")}
        </div>
      )}
    </div>
  );
}
