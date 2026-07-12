"use client";

import "../../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [data, setData] = useState<any>({ 
    recentActivity: [], 
    openTickets: 0,
    outstandingBalance: "0",
    totalPaid: "0",
    activeProjects: 0,
    pendingInvoices: [] 
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();
        setData({
          recentActivity: json.recentActivity || [],
          openTickets: json.openTickets || 0,
          outstandingBalance: json.outstandingBalance || "0",
          totalPaid: json.totalPaid || "0",
          activeProjects: json.activeProjects || 0,
          pendingInvoices: json.pendingInvoices || [] 
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const res = await fetch("/api/dashboard", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    
    if (res.ok) {
      setData((prev: any) => ({
        ...prev,
        recentActivity: prev.recentActivity.filter((item: any) => item.id !== id),
        openTickets: Math.max(0, prev.openTickets - 1)
      }));
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <div className="dashboard-page">
      <div className="header"><h1>Good morning, Alex 👋</h1></div>

      <div className="stats">
        <div className="card"><h5>OUTSTANDING BALANCE</h5><h2>${data.outstandingBalance}</h2></div>
        <div className="card"><h5>TOTAL PAID</h5><h2>${data.totalPaid}</h2></div>
        <div className="card"><h5>ACTIVE PROJECTS</h5><h2>{data.activeProjects}</h2></div>
        <div className="card"><h5>OPEN TICKETS</h5><h2>{data.openTickets}</h2></div>
      </div>

      <div className="content-grid">
        <div className="activity">
          <h3>Recent Activity</h3>
          {data.recentActivity?.length > 0 ? (
            data.recentActivity.map((act: any) => (
              <div 
                key={act.id} 
                className="item" 
                onClick={() => router.push(`/tickets/${act.id}`)}
                style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #333', cursor: 'pointer' }}
              >
                <div>
                  <h4 style={{ margin: '0', color: '#3b82f6' }}>{act.title || "Untitled"}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#888' }}>Category: {act.category || "General"}</p>
                </div>
                <button 
                  onClick={(e) => handleDelete(e, act.id)} 
                  style={{ color: '#ef4444', background: 'transparent', border: '1px solid #ef4444', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Clear
                </button>
              </div>
            ))
          ) : (
            <p>No recent activity found.</p>
          )}
        </div>

        <div className="right-panel">
          <div className="quick-card">
            <h3>Quick Actions</h3>
            <button onClick={() => router.push("/submit-request")}>New Request</button>
            <button onClick={() => router.push("/payments")}>Make a Payment</button>
          </div>
          
          <div className="quick-card" style={{ marginTop: '20px' }}>
            <h3>Pending Invoices</h3>
            {data.pendingInvoices?.length > 0 ? (
              data.pendingInvoices.map((inv: any, index: number) => (
                <div key={inv.id || index} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  Invoice #{inv.invoice_number} - ${inv.amount}
                </div>
              ))
            ) : (
              <p style={{ color: '#666' }}>No pending invoices.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}