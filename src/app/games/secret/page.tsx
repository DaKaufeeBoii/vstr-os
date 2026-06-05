export default function SecretPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#000", color: "#0f0", fontFamily: "monospace" }}>
      <h1 style={{ fontSize: "4rem", marginBottom: 20 }}>YOU FOUND ME</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: 600, textAlign: "center", lineHeight: 1.6 }}>
        Congratulations! You found this secret page.
        <br /><br />
        This portfolio is full of surprises. Keep exploring!
      </p>
      <a href="/" style={{ marginTop: 40, padding: "10px 20px", border: "1px solid #0f0", color: "#0f0", textDecoration: "none" }}>
        Return to VSTR-OS
      </a>
    </div>
  );
}
