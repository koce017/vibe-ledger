import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

const ENTRY_TYPES = ["UI", "API", "test", "security"];

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const project = searchParams.get("project")?.trim();

  if (!project) {
    return NextResponse.json(
      { error: "Bad Request", details: "Query parameter 'project' is required." },
      { status: 400 }
    );
  }

  try {
    const entries = await prisma.entry.findMany({
      where: { project },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      entries: entries.map((entry) => ({
        id: entry.id,
        project: entry.project,
        type: entry.type,
        prompt: entry.prompt,
        details: entry.details,
        createdAt: entry.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Bad Request", details: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const project = typeof payload.project === "string" ? payload.project.trim() : "";
  const type = typeof payload.type === "string" ? payload.type.trim() : "";
  const prompt = typeof payload.prompt === "string" ? payload.prompt.trim() : "";
  const details = typeof payload.details === "string" ? payload.details.trim() : undefined;

  if (!project) {
    return NextResponse.json(
      { error: "Bad Request", details: "Field 'project' is required." },
      { status: 400 }
    );
  }

  if (!ENTRY_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "Bad Request", details: "Field 'type' must be one of UI, API, test, security." },
      { status: 400 }
    );
  }

  if (!prompt) {
    return NextResponse.json(
      { error: "Bad Request", details: "Field 'prompt' is required." },
      { status: 400 }
    );
  }

  try {
    const entry = await prisma.entry.create({
      data: {
        project,
        type,
        prompt,
        details: details || null,
      },
    });

    return NextResponse.json(
      {
        id: entry.id,
        project: entry.project,
        type: entry.type,
        prompt: entry.prompt,
        details: entry.details ?? undefined,
        createdAt: entry.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error.",
      },
      { status: 500 }
    );
  }
}

