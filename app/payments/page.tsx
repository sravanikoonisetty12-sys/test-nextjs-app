"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

// This forces the page to render at runtime, fixing the prerender error
export const dynamic = 'force-dynamic';

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
        <h3>Payment Method</h3>
        <form onSubmit={handlePaymentSubmit}>
          <label>Name on Card</label>
          <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} required />
          <label>Card Number</label>
          <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
          <div className="row">
            <div>
              <label>Expiry Date</label>
              <input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} required />
            </div>
            <div>
              <label>CVV</label>
              <input type="password" value={cvv} onChange={(e) => setCvv(e.target.value)} required />
            </div>
          </div>
          <button type="submit" id="payBtn">
            Pay {invoice ? `$${invoice.amount?.toLocaleString()}` : "..."}
          </button>
        </form>
      </div>
    </div>
  );
}

// Next.js requires the use of Suspense when using useSearchParams()
export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}