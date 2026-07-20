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
      // Login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Login failed.");
        return;
      }

      // Automatically create/update profile
      const role =
        data.user.email === "admin0123@gmail.com" ? "admin" : "user";

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
        console.error(upsertError);
        alert("Failed to create profile.");
        return;
      }

      // Fetch Role
      const { data: profile, error: profileError } = await supabase
        .from("Profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error(profileError);
        alert("Profile not found.");
        return;
      }

      // Save role
      localStorage.setItem("role", profile.role);

      alert("Login Successful!");

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
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
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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