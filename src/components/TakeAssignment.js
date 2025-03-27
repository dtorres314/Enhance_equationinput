// TakeAssignmentPage.js
import React, { useState, useRef } from "react";
import { addStyles, EditableMathField } from "react-mathquill";
import { renderToString } from "katex";
import "katex/dist/katex.min.css";
import { mathquillConfig } from "./AutoCommandsConfig";
import PhysicsPad from "./PhysicsPad";

addStyles();

function convertLatexToHtml(latex) {
  if (!latex.trim()) return "";
  try {
    return renderToString(latex, { throwOnError: false });
  } catch {
    return "<span style='color:red;'>Invalid LaTeX</span>";
  }
}

export default function TakeAssignmentPage() {
  const [problem, setProblem] = useState(null);
  const [answers, setAnswers] = useState({});
  const [convertedHtml, setConvertedHtml] = useState({});
  const [focusedIdx, setFocusedIdx] = useState(null);

  const mqRefs = useRef({});

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) return;
    const root = doc.documentElement;
    if (root.nodeName !== "Problem") return;

    const title = root.querySelector("Title")?.textContent || "Untitled";
    const statement = root.querySelector("Statement")?.textContent || "";
    const stepsNode = root.querySelector("Steps");
    let steps = [];
    if (stepsNode) {
      const stepNodes = [...stepsNode.querySelectorAll("ProblemStep")];
      steps = stepNodes.map((sn, idx) => {
        const st = sn.querySelector("Statement")?.textContent || "(No Step)";
        return { index: idx + 1, statement: st };
      });
    }
    setProblem({ title, statement, steps });
    setAnswers({});
    setConvertedHtml({});
    setFocusedIdx(null);
  };

  const updateAnswer = (idx, latex) => {
    setAnswers((prev) => ({ ...prev, [idx]: latex }));
  };

  const convertThisPart = (idx) => {
    const latexVal = answers[idx] || "";
    const htmlVal = convertLatexToHtml(latexVal);
    setConvertedHtml((prev) => ({ ...prev, [idx]: htmlVal }));
  };

  const handleInsert = (idx, symbol) => {
    const ref = mqRefs.current[idx];
    if (ref && ref.write) {
      ref.write(symbol);
      ref.focus();
    }
  };

  const handleFocus = (stepIndex) => {
    setFocusedIdx(stepIndex);
  };

  const handleBlur = () => {
    // Delay so that a click on the pad doesn't close immediately
    setTimeout(() => {
      setFocusedIdx(null);
    }, 150);
  };

  return (
    <div
      style={{ maxWidth: 700, margin: "20px auto", fontFamily: "sans-serif" }}
    >
      <h2>Take Assignment Page</h2>
      <input
        type="file"
        accept=".xml"
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />

      {problem && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: 10,
            position: "relative",
          }}
        >
          <h3>{problem.title}</h3>
          <p>{problem.statement}</p>
          {problem.steps.map((step) => {
            const val = answers[step.index] || "";
            const isFocused = focusedIdx === step.index;
            return (
              <div
                key={step.index}
                style={{
                  marginBottom: 12,
                  border: "1px solid #ddd",
                  background: "#fafafa",
                  padding: 10,
                  position: "relative",
                }}
              >
                <h4>Part {step.index}</h4>
                <p>{step.statement}</p>

                <EditableMathField
                  latex={val}
                  onChange={(mf) => updateAnswer(step.index, mf.latex())}
                  config={mathquillConfig}
                  mathquillDidMount={(instance) => {
                    mqRefs.current[step.index] = instance;
                  }}
                  onFocus={() => handleFocus(step.index)}
                  onBlur={handleBlur}
                  style={{
                    minHeight: 40,
                    fontSize: "1em",
                    border: "1px solid #999",
                    padding: 6,
                    background: "#fff",
                    width: "100%",
                  }}
                />

                {/* Show the pad if this field has focus */}
                {isFocused && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "110%",
                      zIndex: 999,
                    }}
                  >
                    <PhysicsPad
                      onInsert={(sym) => handleInsert(step.index, sym)}
                    />
                  </div>
                )}

                <p style={{ fontSize: "0.9em", marginTop: 6 }}>
                  <strong>LaTeX:</strong> {val}
                </p>

                <button
                  style={{ cursor: "pointer", marginBottom: 6 }}
                  onClick={() => convertThisPart(step.index)}
                >
                  Convert to HTML
                </button>
                <div
                  style={{
                    minHeight: 40,
                    border: "1px solid #999",
                    background: "#fff",
                    padding: 6,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: convertedHtml[step.index] || "",
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
