export default function FighterPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#1a0b2e", color: "#fff", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "3rem", color: "#a78bfa", textShadow: "0 0 10px rgba(167, 139, 250, 0.8)", marginBottom: 10 }}>FIGHTER ARENA</h1>
      <h2 style={{ fontSize: "1.5rem", color: "#fb923c", marginBottom: 30 }}>Status: Under Construction</h2>
      
      <div style={{ display: "flex", gap: 20, marginBottom: 40 }}>
        {["Riteesh", "Dhanvi", "Manideep", "Sai Tarun"].map(name => (
          <div key={name} style={{ width: 120, height: 160, background: "rgba(0,0,0,0.5)", border: "2px solid #a78bfa", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontSize: "3rem", marginBottom: 10 }}>👤</div>
            <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>{name}</div>
          </div>
        ))}
      </div>

      <p style={{ maxWidth: 500, textAlign: "center", color: "#cbd5e1" }}>
        The full-on fighter game link will be redirected here. For now, enjoy this placeholder arena!
      </p>

      <a href="/" style={{ marginTop: 40, padding: "10px 20px", background: "#a78bfa", color: "#000", fontWeight: "bold", textDecoration: "none", borderRadius: 4 }}>
        Back to Desktop
      </a>
    </div>
  );
}
