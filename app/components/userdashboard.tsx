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
      <div className="header">
        <h1>Welcome back, User 👋</h1>
        <p>Here is your dashboard overview</p>
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
                borderBottom: "1px solid #333", 
                padding: "16px 0", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center" 
              }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{item.title}</h4>
                  
                  <p style={{ margin: "4px 0", color: "#ccc", fontSize: "0.9rem" }}>
                    {item.messagetext || item.description || item.message || "No description provided"}
                  </p>

                  <p style={{ color: item.status === 'Completed' ? '#28a745' : '#ffc107', fontWeight: "bold", margin: "4px 0 0 0" }}>
                    {item.status === 'Completed' ? '✅ Work Completed' : '✅ Submitted Successfully'}
                  </p>
                </div>
                <button 
                  onClick={() => deleteRequest(item.id)}
                  style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
                >
                  Clear
                </button>
              </div>
            ))
          ) : <p>No recent requests found.</p>}
        </div>

        <div className="sidebar-container">
          <div className="quick-card">
            <h3>Quick Actions</h3>
            <button onClick={() => router.push("/submit-request")}>New Request</button>
          </div>

          <div className="quick-card" style={{ marginTop: "20px" }}>
            <h3>Your Files</h3>
            {data?.uploadedFiles?.length > 0 && (
              data.uploadedFiles.map((file: any) => (
                <div key={file.id} style={{ fontSize: "0.85rem", marginBottom: "5px" }}>
                  📄 {file.file_name?.replace('public/', '') || "file"}
                </div>
              ))
            )}
            <button onClick={() => router.push("/file-upload")} style={{ marginTop: data?.uploadedFiles?.length > 0 ? "10px" : "0px" }}>Manage Uploads</button>
          </div>

          <div className="quick-card" style={{ marginTop: "20px" }}>
            <h3>Invoices</h3>
            {data?.invoices?.length > 0 && (
              data.invoices.map((inv: any) => (
                <div key={inv.id} style={{ marginBottom: "15px", borderBottom: "1px solid #444", paddingBottom: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span>Due: {inv.due_date || "N/A"}</span>
                    <span>${inv.amount || 0}</span>
                  </div>
                  {inv.status === 'Paid' ? (
                    <p style={{ color: "#28a745", fontSize: "0.80rem", margin: "5px 0" }}>✅ Paid Successfully</p>
                  ) : (
                    <button 
                      onClick={() => handlePay(inv.id)}
                      style={{ width: "100%", background: "#28a745", color: "white", marginTop: "5px", border: "none", padding: "5px", cursor: "pointer", borderRadius: "4px" }}
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