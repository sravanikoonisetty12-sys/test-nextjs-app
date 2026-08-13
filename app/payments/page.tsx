"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

function PaymentContent() {
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

    const { error } = await supabase
      .from("invoices")
      .update({ status: "Paid" })
      .eq("invoice_number", invoiceId);

    if (!error) {
      alert("Payment Successful! Status updated to Paid.");
      router.push("/invoices");
    } else {
      alert("Error processing payment: " + error.message);
    }
  };

  return (
    <div className="payments-page-container">
      {/* Make a Payment heading పక్కన ఇమేజ్ సైజ్ మరింత పెంచడం జరిగింది (width: 130px, height: 130px) */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "40px", fontWeight: 400, color: "#111111", margin: 0, lineHeight: 1.2 }}>
          Make a Payment
        </h1>
        <img 
          src="/payments.png" 
          alt="Payments" 
          style={{ width: "130px", height: "130px", objectFit: "contain" }} 
          suppressHydrationWarning={true}
        />
      </div>

      <p className="subtitle" style={{ color: "#000000", fontSize: "16px", marginBottom: "30px", opacity: 1 }}>
        Securely pay outstanding invoices using your preferred method.
      </p>

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
          <input type="text" placeholder="Alex Chen" value={cardName} onChange={(e) => setCardName(e.target.value)} required suppressHydrationWarning={true} />

          <label>Card Number</label>
          <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required suppressHydrationWarning={true} />

          <div className="row">
            <div>
              <label>Expiry Date</label>
              <input type="text" placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} required suppressHydrationWarning={true} />
            </div>
            <div>
              <label>CVV</label>
              <input type="password" placeholder="•••" value={cvv} onChange={(e) => setCvv(e.target.value)} required suppressHydrationWarning={true} />
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

export default function PaymentsPage() {
  return (
    <Suspense fallback={<div className="payments-page-container">Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}