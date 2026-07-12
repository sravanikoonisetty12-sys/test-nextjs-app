"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function PaymentsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get("invoice"); 
  
  const [invoice, setInvoice] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<"card" | "paypal" | "bank">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    if (invoiceId) {
      const fetchInvoice = async () => {
        const { data } = await supabase.from("invoices").select("*").eq("invoice_number", invoiceId).single();
        if (data) setInvoice(data);
      };
      fetchInvoice();
    }
  }, [invoiceId]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceId) return;

    // Database status update
    const { data, error } = await supabase
      .from("invoices")
      .update({ status: "Paid" })
      .eq("invoice_number", invoiceId)
      .select();

    if (!error) {
      alert("Payment Successful! Status updated to Paid.");
      router.push("/invoices");
    } else {
      alert("Error processing payment: " + error.message);
    }
  };

  return (
    <div className="payments-page-container">
      <h1>Make a Payment</h1>
      <p className="subtitle">Securely pay outstanding invoices using your preferred method.</p>

      <div className="summary-card">
        <p>TOTAL OUTSTANDING</p>
        <h2>{invoice ? `$${invoice.amount?.toLocaleString()}` : "Loading..."}</h2>
        
        {invoice && (
          <div className="invoice-row">
            <span>Invoice: {invoice.invoice_number}</span>
            <span>${invoice.amount?.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="payments-card">
        <h3><i className="fa-solid fa-wallet"></i> Payment Method</h3>

        <div className="payments-methods">
          <div onClick={() => setSelectedMethod("card")} className={`payments-option ${selectedMethod === "card" ? "selected" : ""}`} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-credit-card"></i> <span>Credit / Debit</span>
          </div>
          <div onClick={() => setSelectedMethod("paypal")} className={`payments-option ${selectedMethod === "paypal" ? "selected" : ""}`} style={{ cursor: "pointer" }}>
            <i className="fa-brands fa-paypal"></i> <span>PayPal</span>
          </div>
          <div onClick={() => setSelectedMethod("bank")} className={`payments-option ${selectedMethod === "bank" ? "selected" : ""}`} style={{ cursor: "pointer" }}>
            <i className="fa-solid fa-building-columns"></i> <span>Bank Transfer</span>
          </div>
        </div>

        <form onSubmit={handlePaymentSubmit}>
          <label>Name on Card</label>
          <input type="text" placeholder="Alex Chen" value={cardName} onChange={(e) => setCardName(e.target.value)} required />

          <label>Card Number</label>
          <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />

          <div className="row">
            <div>
              <label>Expiry Date</label>
              <input type="text" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
            </div>
            <div>
              <label>CVV</label>
              <input type="password" placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
            </div>
          </div>

          <button type="submit" id="payBtn">
            <i className="fa-solid fa-lock"></i> Pay {invoice ? `$${invoice.amount?.toLocaleString()}` : "..."}
          </button>
        </form>

        <p className="secure">
          <i className="fa-solid fa-shield"></i> 256-bit SSL encrypted · PCI DSS Compliant · Your data is safe
        </p>
      </div>
    </div>
  );
}