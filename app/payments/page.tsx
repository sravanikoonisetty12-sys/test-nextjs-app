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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!invoiceId) return;

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
  }, [invoiceId]);

  const handlePaymentSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (loading) return;

    if (!invoice || !invoiceId) {
      alert("Invoice information is missing.");
      return;
    }

    try {
      setLoading(true);

      const amount = Number(invoice.amount);

      if (!amount || amount <= 0) {
        alert("Invalid invoice amount.");
        return;
      }

      /*
       * Step 1:
       * Create Razorpay order on server
       */
      const orderResponse = await fetch(
        "/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );

      // DEBUG LOGS - ADDED ONLY
      console.log(
        "Create Order HTTP Status:",
        orderResponse.status
      );

      console.log(
        "Create Order HTTP OK:",
        orderResponse.ok
      );

      const orderData = await orderResponse.json();

      // DEBUG LOGS - ADDED ONLY
      console.log(
        "========== CREATE ORDER RESPONSE =========="
      );

      console.log(
        "Create Order Response:",
        orderData
      );

      console.log(
        "Create Order Error:",
        orderData?.error
      );

      console.log(
        "Create Order ID:",
        orderData?.id
      );

      console.log(
        "Create Order Amount:",
        orderData?.amount
      );

      console.log(
        "Create Order Currency:",
        orderData?.currency
      );

      console.log(
        "==========================================="
      );

      if (!orderResponse.ok) {
        console.error(
          "Create order failed:",
          orderData
        );

        alert(
          orderData?.error ||
            "Unable to create payment order."
        );

        return;
      }

      if (!orderData?.id) {
        console.error(
          "Invalid Razorpay order:",
          orderData
        );

        alert(
          "Unable to create payment order."
        );

        return;
      }

      /*
       * Step 2:
       * Make sure Razorpay checkout is loaded
       */

      // DEBUG LOG - ADDED ONLY
      console.log(
        "Razorpay loaded:",
        !!window.Razorpay
      );

      if (!window.Razorpay) {
        alert(
          "Razorpay checkout is not loaded. Please refresh the page and try again."
        );

        return;
      }

      const razorpayKey =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // DEBUG LOGS - ADDED ONLY
      console.log(
        "Frontend Razorpay Key Exists:",
        !!razorpayKey
      );

      console.log(
        "Frontend Razorpay Key Prefix:",
        razorpayKey
          ? razorpayKey.substring(0, 8)
          : "MISSING"
      );

      if (!razorpayKey) {
        console.error(
          "NEXT_PUBLIC_RAZORPAY_KEY_ID is missing."
        );

        alert(
          "Razorpay checkout configuration is missing."
        );

        return;
      }

      /*
       * Step 3:
       * Open Razorpay Checkout
       */
      const options = {
        key: razorpayKey,

        amount: orderData.amount,

        currency: orderData.currency || "INR",

        name: "Nexus Client Portal",

        description: `Invoice ${invoice.invoice_number}`,

        order_id: orderData.id,

        theme: {
          color: "#ff65a3",
        },

        handler: async function (
          response: any
        ) {
          // DEBUG LOG - ADDED ONLY
          console.log(
            "Razorpay Payment Response:",
            response
          );

          try {
            /*
             * Step 4:
             * Verify payment on server
             */
            const verifyResponse =
              await fetch(
                "/api/verify-payment",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      response.razorpay_order_id,

                    razorpay_payment_id:
                      response.razorpay_payment_id,

                    razorpay_signature:
                      response.razorpay_signature,
                  }),
                }
              );

            const verifyData =
              await verifyResponse.json();

            // DEBUG LOGS - ADDED ONLY
            console.log(
              "Verify Payment Status:",
              verifyResponse.status
            );

            console.log(
              "Verify Payment Response:",
              verifyData
            );

            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {
              console.error(
                "Payment verification failed:",
                verifyData
              );

              alert(
                verifyData?.error ||
                  "Payment verification failed."
              );

              return;
            }

            /*
             * Step 5:
             * Update invoice status
             */
            const { error } =
              await supabase
                .from("invoices")
                .update({
                  status: "Paid",
                })
                .eq(
                  "invoice_number",
                  Number(invoiceId)
                );

            if (error) {
              console.error(
                "Invoice update error:",
                error
              );

              alert(
                "Payment succeeded but invoice update failed."
              );

              return;
            }

            alert(
              "Payment Successful! Status updated to Paid."
            );

            router.push("/invoices");
            router.refresh();
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              "Payment verification failed."
            );
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay payment window closed."
            );
          },
        },
      };

      // DEBUG LOGS - ADDED ONLY
      console.log(
        "Opening Razorpay with:",
        {
          keyExists: !!options.key,
          keyPrefix: options.key
            ? options.key.substring(0, 8)
            : "MISSING",
          amount: options.amount,
          currency: options.currency,
          orderId: options.order_id,
        }
      );

      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response: any) {
          console.error(
            "Razorpay payment failed:",
            response
          );

          alert(
            response?.error?.description ||
              "Payment failed. Please try again."
          );
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment error:",
        error
      );

      alert(
        "Something went wrong while opening payment."
      );
    } finally {
      setLoading(false);
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
        Securely pay outstanding invoices using your
        preferred method.
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
            disabled={loading}
          >
            <i className="fa-solid fa-lock"></i>

            {loading
              ? "Processing..."
              : `Pay ${
                  invoice
                    ? `₹${invoice.amount?.toLocaleString()}`
                    : "..."
                }`}
          </button>
        </form>

        <p className="secure">
          <i className="fa-solid fa-shield"></i>{" "}
          256-bit SSL encrypted · PCI DSS
          Compliant · Your data is safe
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