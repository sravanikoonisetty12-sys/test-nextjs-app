"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

// 1. Force the page to be dynamic, skipping static pre-rendering
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
      
      {/* ... keep your existing JSX/UI code here ... */}
      
      <form onSubmit={handlePaymentSubmit}>
          {/* Your form inputs remain exactly the same */}
          <button type="submit" id="payBtn">Pay</button>
      </form>
    </div>
  );
}

// 2. Wrap the content in Suspense to satisfy Next.js requirements
export default function PaymentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}