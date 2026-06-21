"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
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

  // ✅ UPDATED HOOK: Added /signed-out to display standalone page without sidebar panel mesh
  const isAuthPage = pathname === "/signin" || pathname === "/signup" || pathname === "/signed-out";

  // ✅ UPDATED HOOK: Rerouting path context redirect array to /signed-out target link
  const handleSignOut = () => {
    router.push("/signed-out");
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased m-0 p-0">
        {isAuthPage ? (
          <div style={{ width: '100vw', minHeight: '100vh', position: 'relative' }}>
            <div className="background"></div>
            <div className="signin-wrapper">
              {children}
            </div>
          </div>
        ) : (
          <div className="app-layout">
            
            {/* ✅ FIXED HOOK: Corrected comment block wrapper format here */}
            <aside className="sidebar shrink-0">
              <div>
                <div className="logo">
                  <span>Nexus.Client</span>
                </div>

                <div className="profile">
                  <div className="avatar">A</div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '3px' }}>Alex</span>
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>Acme Corporation</span>
                  </div>
                </div>

                <ul className="menu" style={{ marginTop: '15px' }}>
                  <li>
                    <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: pathname === "/dashboard" ? "#1E2640" : "transparent" }}>
                      <i className="fa-solid fa-chart-pie" style={{ width: '20px', fontSize: '16px' }}></i>
                      <span>Dashboard</span>
                    </a>
                  </li>
                  <li>
                    <a href="/submit-request" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: pathname === "/submit-request" ? "#1E2640" : "transparent" }}>
                      <i className="fa-solid fa-pen-to-square" style={{ width: '20px', fontSize: '16px' }}></i>
                      <span>Submit Request</span>
                    </a>
                  </li>
                  <li>
                    <a href="/file-upload" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: pathname === "/file-upload" ? "#1E2640" : "transparent" }}>
                      <i className="fa-solid fa-cloud-arrow-up" style={{ width: '20px', fontSize: '16px' }}></i>
                      <span>File Upload</span>
                    </a>
                  </li>
                  <li>
                    <a href="/invoices" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: pathname === "/invoices" ? "#1E2640" : "transparent" }}>
                      <i className="fa-solid fa-file-invoice-dollar" style={{ width: '20px', fontSize: '16px' }}></i>
                      <span>Invoices</span>
                    </a>
                  </li>
                  <li>
                    <a href="/payments" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: pathname === "/payments" ? "#1e4bdf" : "transparent" }}>
                      <i className="fa-solid fa-credit-card" style={{ width: '20px', fontSize: '16px' }}></i>
                      <span>Payments</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div onClick={handleSignOut} className="logout" style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#fff', fontWeight: '500', cursor: 'pointer' }}>
                <i className="fa-solid fa-right-from-bracket" style={{ width: '20px', fontSize: '16px', color: '#fff' }}></i>
                <span>Sign Out</span>
              </div>
            </aside>

            <main className="main-content" style={{ background: '#D38B27' }}>
              <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
                {children}
              </div>
            </main>

          </div>
        )}
      </body>
    </html>
  );
}