"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

// This tells Next.js to skip the build-time generation completely
export const dynamic = 'force-dynamic';

export default function PaymentsPage() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Ensure this only runs on the client to avoid prerender conflicts
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return <PaymentContent router={router} />;
}

function PaymentContent({ router }: { router: any }) {
  const searchParams = useSearchParams();
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
      alert("Payment Successful!");
      router.push("/invoices");
    } else {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="payments-page-container">
      <h1>Make a Payment</h1>
      {/* UI Content goes here */}
      <form onSubmit={handlePaymentSubmit}>
        <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Name" required />
        {/* ... other inputs ... */}
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
}