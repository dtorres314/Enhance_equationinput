// PhysicsPad.js (unchanged)
import React from "react";

const PAD_GROUPS = [
  {
    title: "Operations",
    items: [
      { label: "\\frac", symbol: "\\frac" },
      { label: "\\sqrt", symbol: "\\sqrt" },
      { label: "\\sup", symbol: "^{\\square}" },
      { label: "\\sub", symbol: "_{\\square}" },
      { label: "\\sin", symbol: "\\sin" },
      { label: "\\cos", symbol: "\\cos" },
      { label: "\\tan", symbol: "\\tan" },
      { label: "ln", symbol: "\\ln" },
    ],
  },
  {
    title: "Symbols",
    items: [
      { label: "\\pi", symbol: "\\pi" },
      { label: "\\theta", symbol: "\\theta" },
      { label: "\\alpha", symbol: "\\alpha" },
      { label: "\\beta", symbol: "\\beta" },
      { label: "\\gamma", symbol: "\\gamma" },
    ],
  },
];

export default function PhysicsPad({ onInsert }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 200,
        border: "1px solid #444",
        background: "#eee",
        padding: 6,
        fontSize: "0.85em",
      }}
    >
      {PAD_GROUPS.map((grp) => (
        <div key={grp.title} style={{ marginBottom: 8 }}>
          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{grp.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {grp.items.map((it) => (
              <button
                key={it.symbol}
                style={{
                  padding: "3px 6px",
                  border: "1px solid #999",
                  background: "#fff",
                  cursor: "pointer",
                }}
                onClick={() => onInsert(it.symbol)}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
