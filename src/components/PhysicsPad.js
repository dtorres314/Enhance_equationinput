import React, { useState, useCallback } from "react";

const PAD_GROUPS = [
  {
    title: "Operations",
    items: [
      { label: "frac", symbol: "\\frac" },
      { label: "sup", symbol: "^{\\square}" },
      { label: "sqrt", symbol: "\\sqrt" },
      { label: "sub", symbol: "_{\\square}" },
      { label: "nRoot", symbol: "\\sqrt[\\square]{}" },
      { label: "supSub", symbol: "^{\\square}_{\\square}" },
      { label: "exp", symbol: "e^{\\square}" },
      { label: "ln", symbol: "\\ln" },
      { label: "powerOfTen", symbol: "10^{\\square}" },
      { label: "log", symbol: "\\log" },
      { label: "abs", symbol: "\\left|\\square\\right|" },
      { label: "factorial", symbol: "\\square!" },
    ],
  },
  {
    title: "Symbols",
    items: [
      { label: "pi", symbol: "\\pi" },
      { label: "infinity", symbol: "\\infty" },
      { label: "imaginary", symbol: "i" },
      { label: "alpha", symbol: "\\alpha" },
      { label: "beta", symbol: "\\beta" },
      { label: "gamma", symbol: "\\gamma" },
      { label: "theta", symbol: "\\theta" },
      { label: "phi", symbol: "\\phi" },
      { label: "hbar", symbol: "\\hbar" },
    ],
  },
  {
    title: "Relations",
    items: [
      { label: "<", symbol: "<" },
      { label: ">", symbol: ">" },
      { label: "≤", symbol: "\\le" },
      { label: "≥", symbol: "\\ge" },
      { label: "=", symbol: "=" },
      { label: "≠", symbol: "\\ne" },
    ],
  },
  {
    title: "Trig",
    items: [
      { label: "sin", symbol: "\\sin" },
      { label: "cos", symbol: "\\cos" },
      { label: "tan", symbol: "\\tan" },
      { label: "sec", symbol: "\\sec" },
      { label: "cot", symbol: "\\cot" },
      { label: "csc", symbol: "\\csc" },
      { label: "arcsin", symbol: "\\sin^{-1}" },
      { label: "arccos", symbol: "\\cos^{-1}" },
      { label: "arctan", symbol: "\\tan^{-1}" },
    ],
  },
  {
    title: "Greek",
    items: [
      { label: "α", symbol: "\\alpha" },
      { label: "β", symbol: "\\beta" },
      { label: "γ", symbol: "\\gamma" },
      { label: "δ", symbol: "\\delta" },
      { label: "ε", symbol: "\\epsilon" },
      { label: "λ", symbol: "\\lambda" },
      { label: "μ", symbol: "\\mu" },
      { label: "π", symbol: "\\pi" },
      { label: "ρ", symbol: "\\rho" },
      { label: "σ", symbol: "\\sigma" },
      { label: "τ", symbol: "\\tau" },
      { label: "φ", symbol: "\\phi" },
      { label: "ω", symbol: "\\omega" },
      { label: "Γ", symbol: "\\Gamma" },
      { label: "Δ", symbol: "\\Delta" },
      { label: "Θ", symbol: "\\Theta" },
      { label: "Λ", symbol: "\\Lambda" },
      { label: "Π", symbol: "\\Pi" },
      { label: "Σ", symbol: "\\Sigma" },
      { label: "Φ", symbol: "\\Phi" },
      { label: "Ω", symbol: "\\Omega" },
    ],
  },
];
export default function PhysicsPad({ onInsert }) {
  const [activeTab, setActiveTab] = useState(PAD_GROUPS[0].title);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseDown = useCallback(
    (e) => {
      setDragging(true);
      setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    },
    [pos]
  );

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    },
    [dragging, offset]
  );

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const handleTabClick = (title) => setActiveTab(title);

  const currentGroup =
    PAD_GROUPS.find((g) => g.title === activeTab) || PAD_GROUPS[0];

  return (
    <div
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: 220,
        background: "#ddd",
        border: "1px solid #444",
        fontSize: "0.85em",
        cursor: dragging ? "grabbing" : "default",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <div
        style={{ background: "#ccc", fontWeight: "bold", padding: "4px 6px" }}
      >
        physPad
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: 80, borderRight: "1px solid #999" }}>
          {PAD_GROUPS.map((grp) => (
            <div
              key={grp.title}
              style={{
                padding: "4px 6px",
                background: grp.title === activeTab ? "#bbb" : "",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleTabClick(grp.title);
              }}
            >
              {grp.title}
            </div>
          ))}
        </div>
        <div
          style={{ flex: 1, minHeight: 140, background: "#eee", padding: 6 }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {currentGroup.items.map((it) => (
              <button
                key={it.symbol}
                style={{
                  padding: "3px 6px",
                  border: "1px solid #999",
                  background: "#fff",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onInsert(it.symbol);
                }}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
