"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "./lib/supabase";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono-layout",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname === "/signed-out";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/signin");
    router.refresh();
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased m-0 p-0">
        {isAuthPage ? (
          <div
            style={{
              width: "100vw",
              minHeight: "100vh",
              position: "relative",
            }}
          >
            <div className="background"></div>
            <div className="signin-wrapper">{children}</div>
          </div>
        ) : (
          <div className="app-layout">
            <aside className="sidebar shrink-0">
              <div>
                <div className="logo">
                  <span>Nexus.Client</span>
                </div>

                <div className="profile">
                  <div className="avatar">A</div>
                  <div
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#2d2d2d",
                        marginBottom: "3px",
                      }}
                    >
                      Alex
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#8c8c8c",
                      }}
                    >
                      Acme Corporation
                    </span>
                  </div>
                </div>

                <ul className="menu" style={{ marginTop: "15px" }}>
                  <li>
                    <a
                      href="/dashboard"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        background:
                          pathname === "/dashboard"
                            ? "#fef0f6"
                            : "transparent",
                        color:
                          pathname === "/dashboard"
                            ? "#ff65a3"
                            : "#2d2d2d",
                      }}
                    >
                      <i
                        className="fa-solid fa-chart-pie"
                        style={{
                          width: "20px",
                          fontSize: "16px",
                          color:
                            pathname === "/dashboard"
                              ? "#ff65a3"
                              : "#2d2d2d",
                        }}
                      ></i>
                      <span>Dashboard</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/project-updates"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        background:
                          pathname === "/project-updates"
                            ? "#fef0f6"
                            : "transparent",
                        color:
                          pathname === "/project-updates"
                            ? "#ff65a3"
                            : "#2d2d2d",
                      }}
                    >
                      <i
                        className="fa-solid fa-folder-open"
                        style={{
                          width: "20px",
                          fontSize: "16px",
                          color:
                            pathname === "/project-updates"
                              ? "#ff65a3"
                              : "#2d2d2d",
                        }}
                      ></i>
                      <span>Project Updates</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/submit-request"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        background:
                          pathname === "/submit-request"
                            ? "#fef0f6"
                            : "transparent",
                        color:
                          pathname === "/submit-request"
                            ? "#ff65a3"
                            : "#2d2d2d",
                      }}
                    >
                      <i
                        className="fa-solid fa-pen-to-square"
                        style={{
                          width: "20px",
                          fontSize: "16px",
                          color:
                            pathname === "/submit-request"
                              ? "#ff65a3"
                              : "#2d2d2d",
                        }}
                      ></i>
                      <span>Submit Request</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/file-upload"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        background:
                          pathname === "/file-upload"
                            ? "#fef0f6"
                            : "transparent",
                        color:
                          pathname === "/file-upload"
                            ? "#ff65a3"
                            : "#2d2d2d",
                      }}
                    >
                      <i
                        className="fa-solid fa-cloud-arrow-up"
                        style={{
                          width: "20px",
                          fontSize: "16px",
                          color:
                            pathname === "/file-upload"
                              ? "#ff65a3"
                              : "#2d2d2d",
                        }}
                      ></i>
                      <span>File Upload</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/invoices"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        background:
                          pathname === "/invoices"
                            ? "#fef0f6"
                            : "transparent",
                        color:
                          pathname === "/invoices"
                            ? "#ff65a3"
                            : "#2d2d2d",
                      }}
                    >
                      <i
                        className="fa-solid fa-file-invoice-dollar"
                        style={{
                          width: "20px",
                          fontSize: "16px",
                          color:
                            pathname === "/invoices"
                              ? "#ff65a3"
                              : "#2d2d2d",
                        }}
                      ></i>
                      <span>Invoices</span>
                    </a>
                  </li>

                  <li>
                    <a
                      href="/payments"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        background:
                          pathname === "/payments"
                            ? "#fef0f6"
                            : "transparent",
                        color:
                          pathname === "/payments"
                            ? "#ff65a3"
                            : "#2d2d2d",
                      }}
                    >
                      <i
                        className="fa-solid fa-credit-card"
                        style={{
                          width: "20px",
                          fontSize: "16px",
                          color:
                            pathname === "/payments"
                              ? "#ff65a3"
                              : "#2d2d2d",
                        }}
                      ></i>
                      <span>Payments</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div
                onClick={handleSignOut}
                className="logout"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  color: "#2d2d2d",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <i
                  className="fa-solid fa-right-from-bracket"
                  style={{
                    width: "20px",
                    fontSize: "16px",
                    color: "#2d2d2d",
                  }}
                ></i>
                <span>Sign Out</span>
              </div>
            </aside>

            <main className="main-content">
              <div
                style={{
                  width: "100%",
                  maxWidth: "1400px",
                  margin: "0 auto",
                }}
              >
                {children}
              </div>
            </main>
          </div>
        )}

        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}