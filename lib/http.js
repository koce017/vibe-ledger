import { headers } from "next/headers";

export function createApiUrl(path = "/") {
  const headerList = headers();
  const protocol =
    headerList.get("x-forwarded-proto") ||
    headerList.get("x-forwarded-protocol") ||
    "http";
  const host =
    headerList.get("x-forwarded-host") ||
    headerList.get("host");

  if (!host) {
    throw new Error("Unable to resolve request host for API fetch");
  }

  const base = `${protocol}://${host}`;
  return `${base}${normalizePath(path)}`;
}

function normalizePath(path) {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path;
}

