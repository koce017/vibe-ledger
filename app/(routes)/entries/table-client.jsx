'use client';

import { useMemo, useState } from "react";

const ENTRY_TYPES = ["", "UI", "API", "test", "security"];

export default function EntriesClient({ initialEntries }) {
  const [projectFilter, setProjectFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    return initialEntries.filter((e) => {
      const matchProject =
        !projectFilter ||
        (e.project || "").toLowerCase().includes(projectFilter.toLowerCase());
      const matchType = !typeFilter || e.type === typeFilter;
      return matchProject && matchType;
    });
  }, [initialEntries, projectFilter, typeFilter]);

  return (
    <section style={{ marginTop: 24 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <input
          placeholder="Project contains..."
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
        >
          {ENTRY_TYPES.map((t) => (
            <option key={t || "all"} value={t}>
              {t || "All types"}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No entries match.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <Th>Created</Th>
                <Th>Project</Th>
                <Th>Type</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} style={{ borderTop: "1px solid #eee" }}>
                  <Td>{new Date(e.createdAt).toLocaleString()}</Td>
                  <Td>{e.project}</Td>
                  <Td>{e.type}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Th({ children }) {
  return (
    <th style={{ textAlign: "left", padding: "10px 8px", borderBottom: "1px solid #ddd", fontWeight: 600 }}>
      {children}
    </th>
  );
}

function Td({ children }) {
  return <td style={{ padding: "10px 8px", verticalAlign: "top" }}>{children}</td>;
}


