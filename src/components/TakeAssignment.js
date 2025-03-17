import React, { useState } from "react";
import { addStyles, EditableMathField } from "react-mathquill";

addStyles();

export default function TakeAssignmentPage() {
  const [problem, setProblem] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");
    if (doc.querySelector("parsererror")) return;
    const root = doc.documentElement;
    if (root.nodeName !== "Problem") return;

    const title =
      root.querySelector("Title")?.textContent || "Untitled Problem";
    const statement = root.querySelector("Statement")?.textContent || "";
    const stepsNode = root.querySelector("Steps");
    let steps = [];
    if (stepsNode) {
      const stepNodes = [...stepsNode.querySelectorAll("ProblemStep")];
      steps = stepNodes.map((sn, idx) => {
        const st =
          sn.querySelector("Statement")?.textContent || "(No Step Statement)";
        return {
          index: idx + 1,
          statement: st,
        };
      });
    }
    setProblem({ title, statement, steps });
    setAnswers({});
  };

  const updateAnswer = (index, latex) => {
    setAnswers((prev) => ({ ...prev, [index]: latex }));
  };

  return (
    <div
      style={{ maxWidth: 700, margin: "20px auto", fontFamily: "sans-serif" }}
    >
      <h2>Load Problem</h2>
      <input
        type="file"
        accept=".xml"
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />

      {problem && (
        <div style={{ border: "1px solid #ccc", padding: 10 }}>
          <h3>{problem.title}</h3>
          <p>{problem.statement}</p>
          {problem.steps.map((step) => (
            <div
              key={step.index}
              style={{ border: "1px solid #ddd", marginBottom: 10, padding: 8 }}
            >
              <h4>Part {step.index}</h4>
              <p>{step.statement}</p>
              <EditableMathField
                latex={answers[step.index] || ""}
                onChange={(mf) => updateAnswer(step.index, mf.latex())}
                style={{
                  minHeight: 40,
                  fontSize: "1em",
                  border: "1px solid #999",
                  padding: 5,
                  width: "100%",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
