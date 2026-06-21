"use client";

import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">

      {/* ================= HEADER ================= */}
      <div className="header">
        <h1>Good morning, Alex 👋</h1>
        <p>Here's an overview of your account — last updated just now.</p>
      </div>

      {/* ================= STATS ================= */}
      <div className="stats">

        <div className="card">
          <h5>OUTSTANDING BALANCE</h5>
          <h2 className="red">$4,820</h2>
          <p className="red">3 unpaid invoices</p>
        </div>

        <div className="card">
          <h5>TOTAL PAID (YTD)</h5>
          <h2 className="green">$28,540</h2>
          <p className="green">↑ 18% vs last year</p>
        </div>

        <div className="card">
          <h5>ACTIVE PROJECTS</h5>
          <h2>4</h2>
          <p>2 in review</p>
        </div>

        <div className="card">
          <h5>OPEN TICKETS</h5>
          <h2>3</h2>
          <p className="green">↓ 2 closed today</p>
        </div>

      </div>

      {/* ================= CONTENT GRID ================= */}
      <div className="content-grid">

        {/* LEFT: ACTIVITY */}
        <div className="activity">

          <h3>Recent Activity</h3>

          <div className="item">
            <div className="activity-icon success">✓</div>
            <div className="activity-text">
              <h4>Invoice #INV-0042 paid — $2,400</h4>
              <p>2 hours ago</p>
            </div>
          </div>

          <div className="item">
            <div className="activity-icon file">📄</div>
            <div className="activity-text">
              <h4>Document uploaded: Q3_Brief.pdf</h4>
              <p>Yesterday at 4:30 PM</p>
            </div>
          </div>

          <div className="item">
            <div className="activity-icon invoice">🧾</div>
            <div className="activity-text">
              <h4>New invoice issued: INV-0047 ($1,820)</h4>
              <p>2 days ago</p>
            </div>
          </div>

          <div className="item">
            <div className="activity-icon success">✓</div>
            <div className="activity-text">
              <h4>Invoice #INV-0040 paid — $3,200</h4>
              <p>1 week ago</p>
            </div>
          </div>

        </div>

        {/* RIGHT: PANEL */}
        <div className="right-panel">

          {/* QUICK ACTIONS */}
          <div className="quick-card">
            <h3>Quick Actions</h3>

            <button className="primary">New Request</button>
            <button>Make a Payment</button>
            <button>Upload Files</button>
          </div>

          {/* INVOICES */}
          <div className="invoice-card">
            <h3>Pending Invoices</h3>

            <div className="invoice">
              <span>#INV-0047</span>
              <strong>$1,820</strong>
              <p className="red">Due in 2 days</p>
            </div>

            <div className="invoice">
              <span>#INV-0045</span>
              <strong>$2,100</strong>
              <p className="red">Due in 5 days</p>
            </div>

            <div className="invoice">
              <span>#INV-0043</span>
              <strong>$900</strong>
              <p className="red">Due in 10 days</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}