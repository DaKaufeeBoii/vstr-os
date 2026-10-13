import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: 40, fontFamily: "monospace", background: "#000", color: "#fff", height: "100vh" }}>
      <h2>404 — Page Not Found</h2>
      <p>The requested page could not be found on VSTR-OS.</p>
      <Link href="/" style={{ color: "#f59e0b" }}>Return to Desktop</Link>
    </div>
  );
}
