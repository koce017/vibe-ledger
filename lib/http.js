import { headers } from "next/headers";

export function createApiUrl(path = "/") {
  const headerList = headers();
  const getHeader =
    headerList && typeof headerList.get === "function"
      ? (name) => headerList.get(name)
      : () => null;

  const protocol =
    getHeader("x-forwarded-proto") ||
    getHeader("x-forwarded-protocol") ||
    "http";
  const host = getHeader("x-forwarded-host") || getHeader("host");

  // If host is missing (e.g., build/tests/background), use env or localhost
  const envBase =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "";

  if (!host && envBase) {
    return `${stripTrailingSlash(envBase)}${normalizePath(path)}`;
  }

  if (!host && !envBase) {
    const localBase = `http://localhost:${process.env.PORT || 3000}`;
    return `${localBase}${normalizePath(path)}`;
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

function stripTrailingSlash(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

