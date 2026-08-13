"use client";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; 
import { deleteRequestAction } from "../actions"; 
import "../../styles/dashboard.css";

export default function UserDashboard({ 
  data, 
  onDelete 
}: { 
  data: any; 
  onDelete?: (id: number) => Promise<void>; 
}) {
  const router = useRouter();

  const deleteRequest = async (id: number) => {
    try {
      if (onDelete) {
        await onDelete(id);
      } else {
        await deleteRequestAction(id);
      }
      router.refresh(); 
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the request. Please check permissions.");
    }
  };

  const handlePay = async (invoiceId: number) => {
    alert("Redirecting to payment gateway...");
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'Paid' })
      .eq('id', invoiceId);

    if (!error) {
      alert("✅ Payment Done Successfully!");
      router.refresh();
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header with image */}
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
            <h1 style={{ margin: 0 }}>Welcome back, User 👋</h1>
            <img 
              src="/admin-dashboard.png" 
              alt="Dashboard Illustration" 
              style={{ width: "95px", height: "95px", objectFit: "contain" }}
            />
          </div>
          <p style={{ color: "#2d2d2d", fontWeight: "500", marginTop: "5px" }}>Here is your dashboard overview</p>
        </div>
      </div>

      <div className="stats">
        <div className="card"><h5>OUTSTANDING</h5><h2>${data?.totalBalance || 0}</h2></div>
        <div className="card"><h5>TOTAL PAID</h5><h2>${data?.totalPaid || 0}</h2></div>
        <div className="card"><h5>ACTIVE PROJECTS</h5><h2>{data?.activeProjects || 0}</h2></div>
        <div className="card"><h5>OPEN TICKETS</h5><h2>{data?.recentActivity?.length || 0}</h2></div>
      </div>

      <div className="content-grid">
        <div className="activity">
          <h3>Your Recent Requests</h3>
          {data?.recentActivity?.length > 0 ? (
            data.recentActivity.map((item: any) => (
              <div key={item.id} className="item" style={{ 
                borderBottom: "1px solid #f0e6ed", 
                padding: "16px 0", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "flex-start" 
              }}>
                <div style={{ flex: 1, marginRight: "15px" }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1.2rem", color: "#ff65a3" }}>{item.title}</h4>
                  
                  <p style={{ margin: "4px 0", color: "#555", fontSize: "0.9rem" }}>
                    <strong>Message:</strong> {item.messagetext || item.description || item.message || "No description provided"}
                  </p>

                  <div style={{ display: "flex", gap: "15px", fontSize: "0.85rem", color: "#8c8c8c", marginTop: "8px", flexWrap: "wrap" }}>
                    <span>👤 <strong>User Name:</strong> <span style={{ color: "#ff65a3" }}>{item.user_name || "N/A"}</span></span>
                    <span>📁 <strong>Project Name:</strong> <span style={{ color: "#b174ff" }}>{item.project_name || "N/A"}</span></span>
                    <span>📂 <strong>Category:</strong> {item.category || "General"}</span>
                    <span>⚡ <strong>Priority:</strong> {item.priority || "Normal"}</span>
                    <span>📅 <strong>Due Date:</strong> {item.due_date || "N/A"}</span>
                  </div>

                  <p style={{ color: item.status === 'Completed' ? '#10a246' : '#ff65a3', fontWeight: "bold", margin: "8px 0 0 0", fontSize: "0.9rem" }}>
                    {item.status === 'Completed' ? '✅ Work Completed' : '✅ Submitted Successfully'}
                  </p>
                </div>

                <button 
                  onClick={() => deleteRequest(item.id)}
                  style={{ background: "#ff65a3", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                >
                  Clear
                </button>
              </div>
            ))
          ) : <p style={{ color: "#8c8c8c" }}>No recent requests found.</p>}
        </div>

        <div className="sidebar-container">
          <div className="quick-card">
            <h3>Quick Actions</h3>
            <button 
              onClick={() => router.push("/submit-request")}
              style={{
                width: "100%",
                padding: "12px",
                background: "linear-gradient(135deg, #ff65a3 0%, #b174ff 100%)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              New Request
            </button>
          </div>

          <div className="quick-card" style={{ marginTop: "20px" }}>
            <h3>Your Files</h3>
            {data?.uploadedFiles?.length > 0 && (
              data.uploadedFiles.map((file: any) => (
                <div key={file.id} style={{ fontSize: "0.85rem", marginBottom: "5px", color: "#555" }}>
                  📄 {file.file_name?.replace('public/', '') || "file"}
                </div>
              ))
            )}
            <button 
              onClick={() => router.push("/file-upload")} 
              style={{ 
                marginTop: data?.uploadedFiles?.length > 0 ? "10px" : "0px",
                width: "100%",
                padding: "10px",
                background: "#faf6fa",
                color: "#2d2d2d",
                border: "1px solid #f0e6ed",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Manage Uploads
            </button>
          </div>

          <div className="quick-card" style={{ marginTop: "20px" }}>
            <h3>Invoices</h3>
            {data?.invoices?.length > 0 && (
              data.invoices.map((inv: any) => (
                <div key={inv.id} style={{ marginBottom: "15px", borderBottom: "1px solid #f0e6ed", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "#2d2d2d" }}>
                    <span>Due: {inv.due_date || "N/A"}</span>
                    <strong>${inv.amount || 0}</strong>
                  </div>
                  {inv.status === 'Paid' ? (
                    <p style={{ color: "#10a246", fontSize: "0.80rem", margin: "5px 0", fontWeight: "bold" }}>✅ Paid Successfully</p>
                  ) : (
                    <button 
                      onClick={() => handlePay(inv.id)}
                      style={{ width: "100%", background: "#10a246", color: "white", marginTop: "5px", border: "none", padding: "8px", cursor: "pointer", borderRadius: "6px", fontWeight: "bold" }}
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}