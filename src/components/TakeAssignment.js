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
  const blurTimer = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const doc = new DOMParser().parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) return;
    const root = doc.documentElement;
    if (root.nodeName !== "Problem") return;
    const title = root.querySelector("Title")?.textContent || "Untitled";
    const statement = root.querySelector("Statement")?.textContent || "";
    const stepsNode = root.querySelector("Steps");
    let steps = [];
    if (stepsNode) {
      const stepNodes = [...stepsNode.querySelectorAll("ProblemStep")];
      steps = stepNodes.map((sn, i) => {
        const st = sn.querySelector("Statement")?.textContent || "(No Step)";
        return { index: i + 1, statement: st };
      });
    }
    setProblem({ title, statement, steps });
    setAnswers({});
    setConvertedHtml({});
    setFocusedIdx(null);
  };

  const updateAnswer = (idx, latex) => {
    setAnswers((p) => ({ ...p, [idx]: latex }));
  };

  const convertPart = (idx) => {
    const latexVal = answers[idx] || "";
    const htmlVal = convertLatexToHtml(latexVal);
    setConvertedHtml((p) => ({ ...p, [idx]: htmlVal }));
  };

  const handleInsertSymbol = (idx, symbol) => {
    const ref = mqRefs.current[idx];
    if (ref?.write) {
      ref.write(symbol);
      ref.focus();
    }
  };

  const handleFocus = (idx) => {
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
    setFocusedIdx(idx);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => {
      setFocusedIdx(null);
    }, 150);
  };

  const handlePadMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (blurTimer.current) {
      clearTimeout(blurTimer.current);
      blurTimer.current = null;
    }
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
                  config={mathquillConfig}
                  onChange={(mf) => updateAnswer(step.index, mf.latex())}
                  mathquillDidMount={(inst) => {
                    mqRefs.current[step.index] = inst;
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
                {isFocused && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "110%",
                      zIndex: 999,
                    }}
                    onMouseDown={handlePadMouseDown}
                  >
                    <PhysicsPad
                      onInsert={(sym) => handleInsertSymbol(step.index, sym)}
                    />
                  </div>
                )}
                <p style={{ fontSize: "0.9em", marginTop: 6 }}>
                  <strong>LaTeX:</strong> {val}
                </p>
                <button
                  onClick={() => convertPart(step.index)}
                  style={{ marginBottom: 6 }}
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
