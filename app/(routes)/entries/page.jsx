import Link from "next/link";
import { notFound } from "next/navigation";
import { createApiUrl } from "../../../lib/http";

export const dynamic = "force-dynamic";

function coerceProject(rawProject) {
  if (!rawProject) return "";
  const value = Array.isArray(rawProject) ? rawProject[0] : rawProject;
  return value.trim();
}

export default async function EntriesPage({ searchParams }) {
  const project = coerceProject(searchParams?.project);

  if (!project) {
    return (
      <main>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Entries</h1>
            <p style={{ color: "#555" }}>Pick a project to load recent entries.</p>
          </div>
          <Link href="/entries/new">Create Entry</Link>
        </header>
        <section style={{ marginTop: 24 }}>
          <p style={{ fontSize: 18 }}>Pick a project</p>
        </section>
      </main>
    );
  }

  const endpoint = createApiUrl(`/api/entries?project=${encodeURIComponent(project)}`);
  const response = await fetch(endpoint, { cache: "no-store" });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    const body = await safeJson(response);
    const message = body?.error || "Unable to load entries";
    return (
      <main>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Entries</h1>
            <p style={{ color: "#555" }}>{project}</p>
          </div>
          <Link href="/entries/new">Create Entry</Link>
        </header>
        <section style={{ marginTop: 24 }}>
          <p style={{ color: "#b00020" }}>{message}</p>
        </section>
      </main>
    );
  }

  const { entries = [] } = await response.json();

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Entries</h1>
          <p style={{ color: "#555" }}>{project}</p>
        </div>
        <Link href="/entries/new">Create Entry</Link>
      </header>

      <section style={{ marginTop: 24 }}>
        {entries.length === 0 ? (
          <p>No entries yet. Start by creating one.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {entries.map((entry) => (
              <li
                key={entry.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{entry.prompt}</strong>
                  <span style={{ fontSize: 12, color: "#777" }}>
                    {entry.type} • {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                {entry.details && <p style={{ margin: 0, color: "#333" }}>{entry.details}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

async function safeJson(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

