'use client';

export default function CopyLinkButton() {
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (_e) {
      // ignore
    }
  }

  return (
    <button
      onClick={copy}
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
      }}
    >
      Copy public link
    </button>
  );
}


