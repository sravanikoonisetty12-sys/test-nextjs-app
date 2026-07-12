"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/invoices.css";

export default function Invoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ invoice_number: "", description: "", amount: 0 });

  const fetchInvoices = async () => {
    const { data } = await supabase.from("invoices").select("*");
    if (data) setInvoices(data);
  };

  useEffect(() => {
    fetchInvoices();
    window.addEventListener('focus', fetchInvoices);
    return () => window.removeEventListener('focus', fetchInvoices);
  }, []);

  const handleSave = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase.from("invoices").insert([{
      invoice_number: newInvoice.invoice_number,
      description: newInvoice.description,
      amount: newInvoice.amount,
      date: today,
      due_date: today,
      status: 'Due Soon'
    }]);
    
    if (!error) {
      setShowModal(false);
      handleClear();
      fetchInvoices();
    }
  };

  // UPDATED: Now uses 'id' instead of 'invoice_number'
  const deleteInvoice = async (id: string) => {
    if (confirm("Are you sure you want to clear this invoice?")) {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) {
        alert("Error: " + error.message);
      } else {
        fetchInvoices();
      }
    }
  };

  const handleClear = () => {
    setNewInvoice({ invoice_number: "", description: "", amount: 0 });
  };

  const openView = (inv: any) => {
    setNewInvoice({ invoice_number: inv.invoice_number, description: inv.description, amount: inv.amount });
    setViewMode(true);
    setShowModal(true);
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Invoices</h1>
      <p className="subtitle">View and manage all your invoices in one place.</p>

      <div className="invoice-card">
        <div className="top-bar">
          <input type="text" placeholder="Search by invoice number, description..." className="search-input" />
          <select className="status-filter"><option value="all">All Statuses</option></select>
          <button className="new-btn" onClick={() => { setViewMode(false); handleClear(); setShowModal(true); }}>New Invoice</button>
        </div>

        <table className="invoice-table">
          <thead>
            <tr><th>INVOICE #</th><th>DESCRIPTION</th><th>DATE</th><th>DUE DATE</th><th>AMOUNT</th><th>STATUS</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.invoice_number}</td>
                <td>{inv.description}</td>
                <td>{inv.date}</td>
                <td>{inv.due_date}</td>
                <td>${inv.amount?.toLocaleString()}</td>
                <td>
                  <span className={`status ${inv.status === 'Paid' ? 'paid' : 'due'}`}>
                    {inv.status || "Due Soon"}
                  </span>
                </td>
                <td>
                  <button className="action-btn" onClick={() => openView(inv)}>View</button>
                  {inv.status !== "Paid" && (
                    <button 
                      className="action-btn" 
                      style={{marginLeft: "5px", backgroundColor: "#28a745", color: "white"}} 
                      onClick={() => window.location.href = `/payments?invoice=${inv.invoice_number}`}
                    >
                      Pay
                    </button>
                  )}
                  {/* UPDATED: Calling deleteInvoice with inv.id */}
                  <button 
                    className="action-btn" 
                    style={{marginLeft: "5px", backgroundColor: "#dc3545", color: "white"}} 
                    onClick={() => deleteInvoice(inv.id)}
                  >
                    Clear
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{viewMode ? "Invoice Details" : "Add New Invoice"}</h3>
            <input placeholder="INV Number" value={newInvoice.invoice_number} readOnly={viewMode} onChange={(e) => setNewInvoice({...newInvoice, invoice_number: e.target.value})} />
            <input placeholder="Description" value={newInvoice.description} readOnly={viewMode} onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})} />
            <input type="number" placeholder="Amount" value={newInvoice.amount === 0 ? "" : newInvoice.amount} readOnly={viewMode} onChange={(e) => setNewInvoice({...newInvoice, amount: parseFloat(e.target.value)})} />
            
            <div className="modal-actions">
              {!viewMode && <button className="new-btn" onClick={handleSave}>Save</button>}
              {!viewMode && <button className="action-btn" onClick={handleClear}>Clear</button>}
              <button className="action-btn" onClick={() => { setShowModal(false); handleClear(); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}