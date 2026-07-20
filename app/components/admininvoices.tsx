"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/invoices.css"; // Ensure this matches your project path

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [newInv, setNewInv] = useState({ invoice_number: "", description: "", amount: 0 });

  const fetchInvoices = async () => {
    const { data } = await supabase.from("invoices").select("*");
    if (data) setInvoices(data);
  };

  useEffect(() => { 
    fetchInvoices(); 
    // Realtime update listener
    const channel = supabase.channel('realtime-admin').on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchInvoices).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addInvoice = async () => {
    const { error } = await supabase.from("invoices").insert([{ ...newInv, status: "Due Soon", date: new Date().toISOString().split('T')[0] }]);
    if (!error) {
      setNewInv({ invoice_number: "", description: "", amount: 0 });
      fetchInvoices();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("invoices").update({ status }).eq("invoice_number", id);
    fetchInvoices();
  };

  const clearInvoice = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await supabase.from("invoices").delete().eq("invoice_number", id);
      fetchInvoices();
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Admin Invoices</h1>
      
      <div className="invoice-card">
        {/* Input area */}
        <div className="add-invoice-form" style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <input className="search-input" placeholder="Invoice #" onChange={(e) => setNewInv({...newInv, invoice_number: e.target.value})} />
          <input className="search-input" placeholder="Description" onChange={(e) => setNewInv({...newInv, description: e.target.value})} />
          <input className="search-input" type="number" placeholder="Amount" onChange={(e) => setNewInv({...newInv, amount: Number(e.target.value)})} />
          <button className="new-btn" onClick={addInvoice}>Add Invoice</button>
        </div>

        {/* Table area */}
        <table className="invoice-table">
          <thead>
            <tr><th>INVOICE #</th><th>DESCRIPTION</th><th>AMOUNT</th><th>STATUS</th><th>ACTIONS</th></tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.invoice_number}>
                <td>{inv.invoice_number}</td>
                <td>{inv.description}</td>
                <td>${inv.amount}</td>
                <td><span className={`status ${inv.status === 'Received' ? 'paid' : 'due'}`}>{inv.status}</span></td>
                <td>
                  <button className="action-btn" style={{backgroundColor: "#28a745", color: "white"}} onClick={() => updateStatus(inv.invoice_number, 'Received')}>Received</button>
                  <button className="action-btn" style={{backgroundColor: "#dc3545", color: "white", marginLeft: "10px"}} onClick={() => clearInvoice(inv.invoice_number)}>Clear</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}