"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import "../styles/invoices.css";

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string>("user");
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  
  const [newInv, setNewInv] = useState({ 
    invoice_number: "", 
    description: "", 
    amount: 0, 
    user_email: "" 
  });

  const checkUserAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      setCurrentUserEmail(user.email);

      const { data: profileData } = await supabase
        .from("Profiles")
        .select("role")
        .eq("email", user.email)
        .single();

      const role = profileData ? profileData.role : "user";
      setCurrentUserRole(role);

      if (role === "admin") {
        const { data } = await supabase.from("invoices").select("*");
        if (data) setInvoices(data);
        fetchUsers();
      } else {
        const { data } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_email", user.email);

        if (data) {
          setInvoices(data);
        }
      }
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("Profiles")
      .select("email")
      .eq("role", "user");
    if (data) setUsersList(data);
  };

  useEffect(() => { 
    checkUserAndFetch();

    const channel = supabase.channel('realtime-invoices')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        checkUserAndFetch();
      })
      .subscribe();
      
    return () => { supabase.removeChannel(channel); };
  }, []);

  const addInvoice = async () => {
    if (!newInv.invoice_number || !newInv.user_email) {
      alert("Please enter the Invoice # and select a User Email!");
      return;
    }

    const { error } = await supabase.from("invoices").insert([{ 
      ...newInv, 
      status: "Due Soon", 
      date: new Date().toISOString().split('T')[0] 
    }]);
    
    if (!error) {
      setNewInv({ invoice_number: "", description: "", amount: 0, user_email: "" });
      checkUserAndFetch();
    } else {
      alert("Error: " + error.message);
    }
  };

  const clearInvoice = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await supabase.from("invoices").delete().eq("invoice_number", id);
      checkUserAndFetch();
    }
  };

  return (
    <div className="main-content" style={{ padding: "0px 30px 30px 30px", maxWidth: "1200px" }}>
      
      {/* Header section: Title and Image side by side */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div>
          <h1 className="page-title" style={{ fontSize: "30px", margin: 0, fontWeight: "bold", color: "#000000" }}>
            {currentUserRole === 'admin' ? 'Admin Invoices' : 'My Invoices'}
          </h1>
          <p style={{ fontSize: "14px", color: "#475569", marginTop: "5px", marginBottom: "0px", fontWeight: "500" }}>
            {currentUserRole === 'admin' ? 'Manage and create client invoices efficiently.' : 'View and pay your pending invoices securely.'}
          </p>
        </div>
        <img 
          src="/invoice.png" 
          alt="Invoices Illustration" 
          style={{ width: "190px", height: "190x", objectFit: "contain" }}
        />
      </div>
      
      <div className="invoice-card">
        {currentUserRole === 'admin' && (
          <div className="add-invoice-form" style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input 
              className="search-input" 
              placeholder="Invoice #" 
              value={newInv.invoice_number}
              onChange={(e) => setNewInv({...newInv, invoice_number: e.target.value})} 
            />
            <input 
              className="search-input" 
              placeholder="Description" 
              value={newInv.description}
              onChange={(e) => setNewInv({...newInv, description: e.target.value})} 
            />
            <input 
              className="search-input" 
              type="number" 
              placeholder="Amount" 
              value={newInv.amount || ""}
              onChange={(e) => setNewInv({...newInv, amount: Number(e.target.value)})} 
            />
            
            <select 
              className="search-input" 
              value={newInv.user_email}
              onChange={(e) => setNewInv({...newInv, user_email: e.target.value})}
            >
              <option value="">Select User Email</option>
              {usersList.map((user, index) => (
                <option key={index} value={user.email}>
                  {user.email}
                </option>
              ))}
            </select>

            <button className="new-btn" onClick={addInvoice}>Add Invoice</button>
          </div>
        )}

        <table className="invoice-table">
          <thead>
            <tr>
              <th>INVOICE #</th>
              <th>USER</th>
              <th>DESCRIPTION</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "#475569", fontStyle: "italic", fontSize: "14px" }}>No invoices found.</td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.invoice_number}>
                  <td>{inv.invoice_number}</td>
                  <td>{inv.user_email || "N/A"}</td>
                  <td>{inv.description}</td>
                  <td>${inv.amount}</td>
                  <td>
                    <span className={`status ${inv.status === 'Received' ? 'paid' : 'due'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    {currentUserRole !== 'admin' ? (
                      <button 
                        className="action-btn" 
                        style={{backgroundColor: "#ffc107", color: "black", fontWeight: "bold"}} 
                        onClick={() => router.push(`/payments?invoice=${inv.invoice_number}&amount=${inv.amount}`)}
                      >
                        Pay
                      </button>
                    ) : (
                      <button 
                        className="action-btn" 
                        style={{backgroundColor: "#dc3545", color: "white"}} 
                        onClick={() => clearInvoice(inv.invoice_number)}
                      >
                        Clear
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}