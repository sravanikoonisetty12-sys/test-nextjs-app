"use client";

import "../styles/signin.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert("Login Success 🚀");
        router.push("/dashboard");
      } else {
        alert("Invalid credentials, try again.");
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="login-card">
        <h1>
          Nexus <span>·</span> Client
        </h1>
        <p>Sign in to your client portal</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning={true}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suppressHydrationWarning={true}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : (
              <>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Sign In
              </>
            )}
          </button>
        </form>

        <small>Demo login page</small>
      </div>
    </div>
  );
}