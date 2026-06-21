"use client";

import { useRouter } from "next/navigation";

export default function SignedOutPage() {
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100vw",
      background: "#D38B27", 
      fontFamily: "'Inter', system-ui, sans-serif",
      overflow: "hidden",
      position: "relative"
    }}>
      
      {/* --- FLOATING PARTICLE DYNAMICS --- */}
      <div className="blob-1" style={{
        position: "absolute", width: "400px", height: "400px",
        background: "rgba(255,255,255,0.15)", borderRadius: "50%",
        filter: "blur(80px)", animation: "float 10s infinite"
      }} />
      <div className="blob-2" style={{
        position: "absolute", width: "300px", height: "300px",
        background: "rgba(0,0,0,0.1)", borderRadius: "50%",
        filter: "blur(60px)", animation: "float 15s infinite reverse"
      }} />

      {/* --- MASTER GLASS CARD --- */}
      <div style={{
        background: "rgba(23, 29, 52, 0.75)", 
        backdropFilter: "blur(30px)",
        padding: "60px",
        borderRadius: "40px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 25px 50px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.05)",
        textAlign: "center",
        maxWidth: "420px",
        width: "90%",
        zIndex: 2,
        animation: "fadeInUp 0.8s ease-out"
      }}>
        
        {/* Glow Icon */}
        <div style={{
          width: "80px", height: "80px",
          background: "rgba(211, 139, 39, 0.15)",
          borderRadius: "25px",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 30px auto",
          border: "1px solid rgba(230, 155, 56, 0.3)"
        }}>
          <i className="fa-solid fa-lock" style={{ fontSize: "32px", color: "#E69B38" }}></i>
        </div>

        <h1 style={{ color: "#fff", fontSize: "32px", fontWeight: "800", marginBottom: "15px" }}>
          Signed Out
        </h1>
        
        <p style={{ color: "#D1D5DB", fontSize: "16px", marginBottom: "40px", lineHeight: "1.6" }}>
          Session terminated. Your data integrity is confirmed.
        </p>

        <button 
          onClick={() => router.push("/signin")}
          style={{
            background: "linear-gradient(135deg, #3561ff, #1e4bdf)",
            color: "#fff",
            border: "none",
            padding: "18px 30px",
            borderRadius: "18px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px"
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(53, 97, 255, 0.5)"; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Sign Back In
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      {/* --- GLOBAL ANIMATIONS --- */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}