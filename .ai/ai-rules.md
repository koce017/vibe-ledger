# AI Rules (Repo House Rules)

- Keep diffs small and readable. Prefer changes touching <= 5 files per edit.
- Always show preview and ask for approval before applying multi-file edits.
- Never send `.env`, `*.key`, `*.pem`, `.git/**`, `node_modules/**`, `.vercel/**` to AI.
- Validate inputs; add at least one negative test for each new public API route.
- Use meaningful HTTP status codes and a consistent error body (problem+json where applicable).
- No secrets or PII in logs. Prefer structured logs.
- Document breaking changes in CHANGELOG.md.
