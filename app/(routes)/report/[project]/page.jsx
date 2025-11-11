import Link from "next/link";
import { notFound } from "next/navigation";
import { createApiUrl } from "../../../../lib/http";
import CopyLinkButton from "./copy-link-client";

export const dynamic = "force-dynamic";

export default async function ProjectReportPage({ params }) {
  const projectParam = params?.project;

  if (!projectParam) {
    notFound();
  }

  const project = decodeURIComponent(projectParam);
  const endpoint = createApiUrl(`/api/entries?project=${encodeURIComponent(project)}`);
  const response = await fetch(endpoint, { cache: "no-store" });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    const body = await safeJson(response);
    const message = body?.error || "Unable to load project report.";
    return (
      <main>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Project Report</h1>
            <p style={{ color: "#555" }}>{project}</p>
          </div>
          <Link href={`/entries?project=${encodeURIComponent(project)}`}>Back to Entries</Link>
        </header>

        <section style={{ marginTop: 24 }}>
          <p style={{ color: "#b00020" }}>{message}</p>
        </section>
      </main>
    );
  }

  const { entries = [] } = await response.json();
  const grouped = groupByType(entries);

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Project Report</h1>
          <p style={{ color: "#555" }}>{project}</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <CopyLinkButton />
          <Link href={`/entries`}>Back to Entries</Link>
        </div>
      </header>

      <section style={{ marginTop: 24, display: "grid", gap: 24 }}>
        {["UI", "API", "test", "security"].map((type) => {
          const items = grouped[type] || [];
          return (
            <div
              key={type}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{type}</strong>
                <span style={{ color: "#555" }}>{items.length}</span>
              </div>
              {items.length === 0 ? (
                <p style={{ margin: 0, color: "#777" }}>No entries.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((entry) => (
                    <li key={entry.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600 }}>{entry.prompt}</span>
                        <span style={{ fontSize: 12, color: "#777" }}>{new Date(entry.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={{ border: "1px solid #eee", borderRadius: 6, padding: 12, background: "#fafafa" }}>
                        <span style={{ fontSize: 12, color: "#555" }}>Edits</span>
                        <p style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{entry.details || "—"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

function groupByType(entries) {
  const groups = { UI: [], API: [], test: [], security: [] };
  for (const entry of entries) {
    if (groups[entry.type]) groups[entry.type].push(entry);
  }
  return groups;
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

