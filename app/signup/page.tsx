"use client";

import "../styles/signin.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Signup failed.");
        return;
      }

      alert("Account created successfully! Please Sign In.");

      router.replace("/signin");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Soft pastel pink & lavender background */}
      <div className="background"></div>

      <div className="signin-wrapper">
        <div className="login-card">
          <h1 style={{ marginTop: "10px" }}>
            Nexus <span>·</span> Client
          </h1>

          {/* Cute 3D Vector Illustration */}
          <div style={{ textAlign: "center", margin: "10px 0" }}>
            <img 
              src="https://img.icons8.com/clouds/200/work.png" 
              alt="Cute Illustration" 
              style={{ width: "130px", height: "130px", objectFit: "contain", margin: "0 auto" }} 
            />
          </div>

          <p>Create your account</p>

          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} id="payBtn" style={{ marginTop: "20px" }}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#8c8c8c",
            }}
          >
            Already have an account?
            <br />
            <a href="/signin" style={{ color: "#ff65a3", textDecoration: "none", fontWeight: "bold" }}>Sign In</a>
          </p>
        </div>
      </div>
    </>
  );
}