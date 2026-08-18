"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceId = searchParams.get("invoice");

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    if (invoiceId) {
      const fetchInvoice = async () => {
        const { data, error } = await supabase
          .from("invoices")
          .select("*")
          .eq("invoice_number", Number(invoiceId))
          .single();

        if (error) {
          console.error("Invoice fetch error:", error);
          return;
        }

        if (data) {
          setInvoice(data);
        }
      };

      fetchInvoice();
    }
  }, [invoiceId]);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invoice || !invoiceId) {
      alert("Invoice information is missing.");
      return;
    }

    try {
      console.log("Creating Razorpay order...");
      console.log("Invoice amount:", invoice.amount);

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(invoice.amount),
        }),
      });

      const order = await res.json();

      console.log("Create order response:", order);

      if (!res.ok || !order.id) {
        console.error("Create Order API Error:", order);

        alert(
          `Unable to create payment order.\n\n${
            order.error || "Unknown error occurred."
          }`
        );

        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Nexus Client Portal",

        description: `Invoice ${invoice.invoice_number}`,

        order_id: order.id,

        theme: {
          color: "#ff65a3",
        },

        handler: async function (response: any) {
          try {
            console.log("Payment response:", response);

            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",

              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,

                razorpay_payment_id: response.razorpay_payment_id,

                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            console.log("Payment verification response:", verifyData);

            if (verifyData.success) {
              const { error } = await supabase
                .from("invoices")
                .update({
                  status: "Paid",
                })
                .eq("invoice_number", Number(invoiceId));

              if (!error) {
                alert(
                  "Payment Successful! Status updated to Paid."
                );

                router.push("/invoices");
                router.refresh();
              } else {
                console.error(
                  "Invoice update error:",
                  error
                );

                alert(
                  "Payment succeeded but invoice update failed."
                );
              }
            } else {
              alert(
                `Payment verification failed.\n\n${
                  verifyData.error || "Unknown verification error."
                }`
              );
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              "Payment verification failed. Please contact support."
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed.");
          },
        },
      };

      if (!window.Razorpay) {
        alert(
          "Razorpay Checkout failed to load. Please refresh the page and try again."
        );

        return;
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error(
          "Razorpay Payment Failed:",
          response
        );

        alert(
          `Payment failed.\n\n${
            response?.error?.description ||
            "Please try again."
          }`
        );
      });

      rzp.open();
    } catch (error) {
      console.error(
        "Payment creation error:",
        error
      );

      alert(
        "Something went wrong while opening payment."
      );
    }
  };

  return (
    <div className="payments-page-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "10px",
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: 400,
            color: "#111111",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Make a Payment
        </h1>

        <img
          src="/payments.png"
          alt="Payments"
          style={{
            width: "130px",
            height: "130px",
            objectFit: "contain",
          }}
          suppressHydrationWarning={true}
        />
      </div>

      <p
        className="subtitle"
        style={{
          color: "#000000",
          fontSize: "16px",
          marginBottom: "30px",
          opacity: 1,
        }}
      >
        Securely pay outstanding invoices using your preferred
        method.
      </p>

      <div className="summary-card">
        <p>TOTAL OUTSTANDING</p>

        <h2>
          {invoice
            ? `₹${invoice.amount?.toLocaleString()}`
            : "Loading..."}
        </h2>

        {invoice && (
          <div className="invoice-row">
            <span>
              Invoice: {invoice.invoice_number}
            </span>

            <span>
              ₹{invoice.amount?.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      <div className="payments-card">
        <h3>
          <i className="fa-solid fa-wallet"></i>{" "}
          Payment Method
        </h3>

        <div
          className="payments-option selected"
          style={{
            cursor: "default",
            padding: "18px",
            marginBottom: "25px",
            border: "2px solid #ff65a3",
            borderRadius: "12px",
            background: "#fff5fa",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <i
              className="fa-solid fa-shield-halved"
              style={{
                fontSize: "24px",
                color: "#ff65a3",
              }}
            ></i>

            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: "#111",
                  marginBottom: "4px",
                }}
              >
                Razorpay Secure Checkout
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#666",
                }}
              >
                UPI • Cards • Net Banking • Wallets
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handlePaymentSubmit}>
          <button
            type="submit"
            id="payBtn"
          >
            <i className="fa-solid fa-lock"></i>

            Pay{" "}
            {invoice
              ? `₹${invoice.amount?.toLocaleString()}`
              : "..."}
          </button>
        </form>

        <p className="secure">
          <i className="fa-solid fa-shield"></i>{" "}
          256-bit SSL encrypted · PCI DSS Compliant · Your
          data is safe
        </p>
      </div>
    </div>
  );
}

export default function PaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="payments-page-container">
          Loading...
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}