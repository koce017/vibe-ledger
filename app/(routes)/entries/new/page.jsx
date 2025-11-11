'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

const ENTRY_TYPES = ["UI", "API", "test", "security"];

export default function NewEntryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    project: "",
    type: ENTRY_TYPES[0],
    prompt: "",
    ai_draft: "",
    edits: "",
    why: "",
    evidence: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedProject = form.project.trim();
    const trimmedPrompt = form.prompt.trim();

    if (!trimmedProject) {
      setError("Project is required.");
      return;
    }

    if (!ENTRY_TYPES.includes(form.type)) {
      setError("Type must be one of UI, API, test, or security.");
      return;
    }

    if (!trimmedPrompt) {
      setError("Prompt is required.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: trimmedProject,
          type: form.type,
          prompt: trimmedPrompt,
          details: form.edits.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const body = await safeJson(response);
        setError(body?.error || "Failed to create entry.");
        return;
      }

      router.push("/entries");
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unexpected error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>New Entry</h1>
          <p style={{ color: "#555" }}>Log a new insight for your project.</p>
        </div>
      </header>

      <section style={{ marginTop: 24, maxWidth: 640 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>Project</span>
            <input
              name="project"
              value={form.project}
              onChange={updateField("project")}
              placeholder="acme-web"
              required
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>Type</span>
            <select
              name="type"
              value={form.type}
              onChange={updateField("type")}
              required
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            >
              {ENTRY_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>Prompt</span>
            <input
              name="prompt"
              value={form.prompt}
              onChange={updateField("prompt")}
              placeholder="What did you learn?"
              required
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>AI draft</span>
            <textarea
              name="ai_draft"
              value={form.ai_draft}
              onChange={updateField("ai_draft")}
              placeholder="Optional AI draft or notes..."
              rows={4}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>Edits</span>
            <textarea
              name="edits"
              value={form.edits}
              onChange={updateField("edits")}
              placeholder="What changes did you make?"
              rows={4}
              required
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>Why</span>
            <textarea
              name="why"
              value={form.why}
              onChange={updateField("why")}
              placeholder="Reasoning behind the change (optional)"
              rows={3}
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span>Evidence</span>
            <input
              name="evidence"
              value={form.evidence}
              onChange={updateField("evidence")}
              placeholder="Link or note (optional)"
              style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #ccc" }}
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "10px 16px",
              borderRadius: 6,
              border: "none",
              backgroundColor: submitting ? "#bbb" : "#111",
              color: "#fff",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "Saving..." : "Save Entry"}
          </button>
        </form>

        {error && <p style={{ color: "#b00020", marginTop: 16 }}>{error}</p>}
        {success && <p style={{ color: "#0b6e4f", marginTop: 16 }}>{success}</p>}
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

