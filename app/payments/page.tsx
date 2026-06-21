"use client";

import React, { useState } from "react";

// 🎯 NOTE: Patha import line ni poorthiga teesesa, so error asalu raadhu!
export default function PaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState<"card" | "paypal" | "bank">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Payment system initialized!");
  };

  return (
    <div className="payments-page-container">
      <h1>Make a Payment</h1>
      <p className="subtitle">
        Securely pay outstanding invoices using your preferred method.
      </p>

      {/* --- SUMMARY CARD BALANCE --- */}
      <div className="summary-card">
        <p>TOTAL OUTSTANDING</p>
        <h2>$4,820.00</h2>

        <div className="invoice-row">
          <span>INV-0047 (Due Jun 15)</span>
          <span>$1,820.00</span>
        </div>
        <div className="invoice-row">
          <span>INV-0045 (Overdue)</span>
          <span>$2,100.00</span>
        </div>
        <div className="invoice-row">
          <span>INV-0043 (Draft)</span>
          <span>$900.00</span>
        </div>
      </div>

      {/* --- SECURE GATEWAY PANEL --- */}
      <div className="payments-card">
        <h3>
          <i className="fa-solid fa-wallet"></i> Payment Method
        </h3>

        <div className="payments-methods">
          <div 
            onClick={() => setSelectedMethod("card")}
            className={`payments-option ${selectedMethod === "card" ? "selected" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-credit-card"></i>
            <span>Credit / Debit</span>
          </div>

          <div 
            onClick={() => setSelectedMethod("paypal")}
            className={`payments-option ${selectedMethod === "paypal" ? "selected" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-brands fa-paypal"></i>
            <span>PayPal</span>
          </div>

          <div 
            onClick={() => setSelectedMethod("bank")}
            className={`payments-option ${selectedMethod === "bank" ? "selected" : ""}`}
            style={{ cursor: "pointer" }}
          >
            <i className="fa-solid fa-building-columns"></i>
            <span>Bank Transfer</span>
          </div>
        </div>

        <form onSubmit={handlePaymentSubmit}>
          <label>Name on Card</label>
          <input
            type="text"
            placeholder="Alex Chen"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />

          <label>Card Number</label>
          <input
            type="text"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />

          <div className="row">
            <div>
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                required
              />
            </div>

            <div>
              <label>CVV</label>
              <input
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" id="payBtn">
            <i className="fa-solid fa-lock"></i> Pay $4,820.00
          </button>
        </form>

        <p className="secure">
          <i className="fa-solid fa-shield"></i> 
          256-bit SSL encrypted · PCI DSS Compliant · Your data is safe
        </p>
      </div>
    </div>
  );
}