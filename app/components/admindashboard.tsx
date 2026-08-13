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
    <div className="dashboard-page" style={{ width: "100%", padding: "30px 40px", boxSizing: "border-box" }}>
      <div className="header" style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: "15px", marginBottom: "25px", width: "100%" }}>
        <h1 style={{ color: "#2d2d2d", margin: 0 }}>Good Morning, Admin 👋</h1>
        <img 
          src="/admin-dashboard.png" 
          alt="Admin Dashboard Icon" 
          style={{ width: "160spx", height: "150px", objectFit: "contain" }} 
          suppressHydrationWarning={true}
        />
      </div>

      <div className="stats" style={{ width: "100%" }}>
        <div className="card" style={{ background: "#ffffff", border: "1px solid rgba(255, 101, 163, 0.2)", boxShadow: "0 10px 30px rgba(255, 101, 163, 0.08)", borderRadius: "20px" }}>
          <h5 style={{ color: "#8c8c8c" }}>TOTAL PAID</h5>
          <h2 style={{ color: "#2d2d2d" }}>${data?.totalPaid || 0}</h2>
        </div>
        <div className="card" style={{ background: "#ffffff", border: "1px solid rgba(255, 101, 163, 0.2)", boxShadow: "0 10px 30px rgba(255, 101, 163, 0.08)", borderRadius: "20px" }}>
          <h5 style={{ color: "#8c8c8c" }}>OPEN TICKETS</h5>
          <h2 style={{ color: "#2d2d2d" }}>{data?.recentActivity?.filter((i: any) => i.status !== 'Completed').length || 0}</h2>
        </div>
      </div>

      <div className="content-grid" style={{ width: "100%", maxWidth: "100%", display: "block" }}>
        <div className="activity" style={{ width: "100%", background: "#ffffff", padding: "30px", borderRadius: "20px", boxShadow: "0 15px 35px rgba(255, 101, 163, 0.08)", border: "1px solid rgba(255, 101, 163, 0.2)", boxSizing: "border-box" }}>
          <h3 style={{ color: "#2d2d2d", marginBottom: "30px", fontSize: "24px", fontWeight: "700" }}>Recent Requests</h3>
          
          <div style={{ width: "100%", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f0e6ed", color: "#8c8c8c", fontSize: "0.95rem" }}>
                  <th style={{ padding: "16px 16px" }}>User Name</th>
                  <th style={{ padding: "16px 16px" }}>Project</th>
                  <th style={{ padding: "16px 16px" }}>Email</th>
                  <th style={{ padding: "16px 16px" }}>Category</th>
                  <th style={{ padding: "16px 16px" }}>Priority</th>
                  <th style={{ padding: "16px 16px" }}>Date</th>
                  <th style={{ padding: "16px 16px" }}>Message / Description</th>
                  <th style={{ padding: "16px 16px" }}>Status</th>
                  <th style={{ padding: "16px 16px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.recentActivity?.map((item: any) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f8f1f5" }}>
                    <td style={{ padding: "22px 16px", color: "#ff65a3", fontWeight: "700", fontSize: "1.1rem" }}>
                      {item.user_name || "N/A"}
                    </td>

                    <td style={{ padding: "22px 16px", color: "#b174ff", fontWeight: "700", fontSize: "1.1rem" }}>
                      {item.project_name || "N/A"}
                    </td>

                    <td style={{ padding: "22px 16px", color: "#d97706", fontSize: "0.95rem", wordBreak: "break-all" }}>
                      {item.user_email || "N/A"}
                    </td>

                    <td style={{ padding: "22px 16px", fontSize: "0.95rem", color: "#555" }}>
                      {item.category || "General"}
                    </td>

                    <td style={{ padding: "22px 16px", fontSize: "0.95rem", color: "#555" }}>
                      {item.priority || "Normal"}
                    </td>

                    <td style={{ padding: "22px 16px", fontSize: "0.95rem", color: "#666", whiteSpace: "nowrap" }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A"}
                    </td>

                    <td style={{ padding: "22px 16px", minWidth: "260px" }}>
                      <div style={{ fontSize: "0.95rem", color: "#444" }}>
                        {item.messagetext || item.description || item.message || "No description"}
                      </div>
                    </td>

                    <td style={{ padding: "22px 16px", fontSize: "0.95rem", whiteSpace: "nowrap" }}>
                      <strong style={{ color: item.status === 'Completed' ? '#ff65a3' : '#f59e0b', fontSize: "1rem" }}>
                        {item.status || "pending"}
                      </strong>
                    </td>

                    <td style={{ padding: "22px 16px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
                        {item.status !== 'Completed' && (
                          <button 
                            onClick={() => markAsDone(item.id)} 
                            style={{ 
                              background: "linear-gradient(135deg, #ff65a3 0%, #b174ff 100%)", 
                              color: "white", 
                              border: "none", 
                              padding: "8px 16px", 
                              borderRadius: "8px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "0.9rem",
                              boxShadow: "0 4px 12px rgba(255, 101, 163, 0.2)"
                            }}
                          >
                            Done
                          </button>
                        )}

                        <button 
                          onClick={() => onDelete(item.id)}
                          style={{ 
                            background: "#fef0f6", 
                            color: "#ff65a3", 
                            border: "1px solid #ffd1e3", 
                            padding: "8px 16px", 
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            fontSize: "0.9rem"
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}