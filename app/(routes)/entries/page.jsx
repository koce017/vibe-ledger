import Link from "next/link";
import { createApiUrl } from "../../../lib/http";
import EntriesClient from "./table-client";

export const dynamic = "force-dynamic";

export default async function EntriesPage() {
  const endpoint = createApiUrl(`/api/entries`);
  const response = await fetch(endpoint, { cache: "no-store" });

  if (!response.ok) {
    const body = await safeJson(response);
    const message = body?.error || "Unable to load entries";
    return (
      <main>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ marginBottom: 4 }}>Entries</h1>
            <p style={{ color: "#555" }}>Latest 50</p>
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
          <p style={{ color: "#555" }}>Latest 50</p>
        </div>
        <Link href="/entries/new">Create Entry</Link>
      </header>

      <EntriesClient initialEntries={entries} />
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

