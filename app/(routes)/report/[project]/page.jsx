import Link from "next/link";
import { notFound } from "next/navigation";
import { createApiUrl } from "../../../../lib/http";

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
  const totals = summarizeEntries(entries);

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Project Report</h1>
          <p style={{ color: "#555" }}>{project}</p>
        </div>
        <Link href={`/entries?project=${encodeURIComponent(project)}`}>Back to Entries</Link>
      </header>

      <section style={{ marginTop: 24, display: "grid", gap: 24 }}>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <strong>Total Entries</strong>
          <span style={{ fontSize: 24 }}>{entries.length}</span>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <strong>By Type</strong>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {Object.entries(totals.byType).map(([type, count]) => (
              <li key={type}>
                {type}: {count}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <strong>Recent Entries</strong>
          {entries.length === 0 ? (
            <p style={{ margin: 0 }}>No entries yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {entries.slice(0, 5).map((entry) => (
                <li key={entry.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontWeight: 600 }}>{entry.prompt}</span>
                  <span style={{ fontSize: 12, color: "#777" }}>
                    {entry.type} • {new Date(entry.createdAt).toLocaleString()}
                  </span>
                  {entry.details && <p style={{ margin: 0, color: "#333" }}>{entry.details}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}

function summarizeEntries(entries) {
  return entries.reduce(
    (acc, entry) => {
      const type = entry.type || "unknown";
      acc.byType[type] = (acc.byType[type] || 0) + 1;
      return acc;
    },
    { byType: {} }
  );
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

