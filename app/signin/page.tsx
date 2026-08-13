"use client";

import "../styles/signin.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Signin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      // 1. Sign in with password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        alert("Login failed.");
        setLoading(false);
        return;
      }

      const role =
        data.user.email === "admin0123@gmail.com" ? "admin" : "user";

      // 2. Upsert profile safely
      const { error: upsertError } = await supabase
        .from("Profiles")
        .upsert(
          {
            id: data.user.id,
            email: data.user.email,
            role,
          },
          {
            onConflict: "id",
          }
        );

      if (upsertError) {
        console.error("Profile upsert error:", upsertError.message);
        // We can let the user proceed even if profile sync fails, or alert them
      }

      // 3. Store role locally and redirect
      localStorage.setItem("role", role);

      alert("Login Successful!");

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Unexpected error during sign in:", err);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="signin-wrapper">
      <div className="login-card">
        <h1 style={{ marginTop: "10px" }}>
          Nexus <span>·</span> Client
        </h1>

        {/* Cute 3D Vector Illustration */}
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <img 
            src="https://img.icons8.com/clouds/200/work.png" 
            alt="Signin Illustration" 
            style={{ width: "130px", height: "130px", objectFit: "contain", margin: "0 auto" }} 
          />
        </div>

        <p>Sign in to your client portal</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              suppressHydrationWarning={true}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              suppressHydrationWarning={true}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}