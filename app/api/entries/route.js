import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

const ENTRY_TYPES = ["UI", "API", "test", "security"];

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const project = searchParams.get("project")?.trim();

  try {
    const filters = [];
    const values = [];

    if (project) {
      filters.push(`project = $${filters.length + 1}`);
      values.push(project);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

    const { rows } = await query(
      `
        SELECT id, project, type, prompt, details, created_at
        FROM entries
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT 50
      `,
      values
    );

    return NextResponse.json({
      entries: rows.map(serializeRow),
    });
  } catch (error) {
    return dbError(error);
  }
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch (_error) {
    return NextResponse.json(
      { error: "validation", details: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const project = typeof payload.project === "string" ? payload.project.trim() : "";
  const type = typeof payload.type === "string" ? payload.type.trim() : "";
  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  const details = typeof payload.details === "string" ? payload.details.trim() : undefined;

  if (!project) {
    return NextResponse.json(
      { error: "validation", details: "Field 'project' is required." },
      { status: 400 }
    );
  }

  if (!ENTRY_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "validation", details: "Field 'type' must be one of UI, API, test, security." },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json(
      { error: "validation", details: "Field 'prompt' is required." },
      { status: 400 }
    );
  }

  try {
    const { rows } = await query(
      `
        INSERT INTO entries (project, type, prompt, details)
        VALUES ($1, $2, $3, $4)
        RETURNING id, project, type, created_at
      `,
      [project, type, prompt, details ?? null]
    );

    return NextResponse.json(serializeRow(rows[0]), { status: 201 });
  } catch (error) {
    return dbError(error);
  }
}

function serializeRow(row) {
  if (!row) return row;
  const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at;
  return {
    id: row.id,
    project: row.project,
    type: row.type,
    prompt: row.prompt,
    details: row.details ?? null,
    created_at: createdAt,
    createdAt,
  };
}

function dbError(error) {
  return NextResponse.json(
    {
      error: "db",
      details: error instanceof Error ? error.message : "Unknown database error.",
    },
    { status: 500 }
  );
}

