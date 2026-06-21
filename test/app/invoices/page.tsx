"use client";

import "../styles/invoices.css";

export default function Invoices() {
  return (
    <div>

      <h1 className="page-title">
        Invoices
      </h1>

      <p className="subtitle">
        View and manage all your invoices in one place.
      </p>

      <div className="invoice-card">

        <div className="top-bar">

          <input
            type="text"
            placeholder="Search by invoice number, description..."
            className="search-input"
          />

          <select className="status-filter">
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="draft">Draft</option>
            <option value="overdue">Overdue</option>
            <option value="due">Due Soon</option>
          </select>

          <button className="new-btn">
            New Invoice
          </button>

        </div>

        <table className="invoice-table">

          <thead>
            <tr>
              <th>INVOICE #</th>
              <th>DESCRIPTION</th>
              <th>DATE</th>
              <th>DUE DATE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>#INV-0047</td>
              <td>Brand Identity – Phase 3</td>
              <td>Jun 01, 2025</td>
              <td>Jun 15, 2025</td>
              <td>$1,820.00</td>
              <td>
                <span className="status due">Due Soon</span>
              </td>
              <td>
                <button className="action-btn">View</button>
              </td>
            </tr>

            <tr>
              <td>#INV-0045</td>
              <td>UI/UX Design – Sprint 4</td>
              <td>May 15, 2025</td>
              <td>May 30, 2025</td>
              <td>$2,100.00</td>
              <td>
                <span className="status overdue">Overdue</span>
              </td>
              <td>
                <button className="action-btn">View</button>
              </td>
            </tr>

            <tr>
              <td>#INV-0042</td>
              <td>Website Development – Final</td>
              <td>Apr 18, 2025</td>
              <td>May 02, 2025</td>
              <td>$2,400.00</td>
              <td>
                <span className="status paid">Paid</span>
              </td>
              <td>
                <button className="action-btn">PDF</button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}