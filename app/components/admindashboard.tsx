"use client";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; 
import "../../styles/dashboard.css";

export default function AdminDashboard({ data, onDelete }: { data: any; onDelete: (id: number) => void }) {
  const router = useRouter();

  const markAsDone = async (requestId: number) => {
    const { error } = await supabase.from('Requests').update({ status: 'Completed' }).eq('id', requestId);
    if (error) alert("Error: " + error.message);
    else { alert("✅ Request Completed!"); router.refresh(); }
  };

  return (
    <div className="dashboard-page">
      <div className="header">
        <h1>Good Morning, Admin 👋</h1>
      </div>

      <div className="stats">
        <div className="card"><h5>TOTAL PAID</h5><h2>${data?.totalPaid || 0}</h2></div>
        <div className="card"><h5>OPEN TICKETS</h5><h2>{data?.recentActivity?.filter((i: any) => i.status !== 'Completed').length || 0}</h2></div>
      </div>

      <div className="content-grid">
        <div className="activity" style={{ width: "100%" }}>
          <h3>Recent Requests</h3>
          {data?.recentActivity?.map((item: any) => (
            <div key={item.id} style={{ 
              borderBottom: "1px solid #333", 
              padding: "20px 0"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>{item.title}</h4>
                  
                  {/* Updated here to check messagetext, description, or message */}
                  <p style={{ margin: "5px 0", color: "#ccc" }}>
                    {item.messagetext || item.description || item.message || "No description provided"}
                  </p>
                  
                  <div style={{ display: "flex", gap: "15px", fontSize: "0.85rem", color: "#888", marginTop: "10px", flexWrap: "wrap" }}>
                    <span>✉️ <strong>User:</strong> <span style={{ color: "#ffc107" }}>{item.user_email || "N/A"}</span></span>
                    <span>📂 <strong>Category:</strong> {item.category || "General"}</span>
                    <span>⚡ <strong>Priority:</strong> {item.priority || "Normal"}</span>
                    <span>📅 <strong>Date:</strong> {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}</span>
                  </div>
                  
                  <div style={{ marginTop: "5px", fontSize: "0.85rem" }}>
                    <span>Status: <strong style={{ color: item.status === 'Completed' ? '#28a745' : '#ffc107' }}>{item.status || "pending"}</strong></span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  {item.status !== 'Completed' && (
                    <button 
                      onClick={() => markAsDone(item.id)} 
                      style={{ 
                        background: "#28a745", 
                        color: "white", 
                        border: "none", 
                        padding: "8px 16px", 
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      Done
                    </button>
                  )}

                  <button 
                    onClick={() => onDelete(item.id)}
                    style={{ 
                      background: "#dc3545", 
                      color: "white", 
                      border: "none", 
                      padding: "8px 16px", 
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}