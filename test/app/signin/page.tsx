"use client";

import "../styles/signin.css";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Login Success 🚀");

    router.push("/dashboard");
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
            <input type="email" required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" required />
          </div>

          <button type="submit">
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
            Sign In
          </button>
        </form>

        <small>Demo login page</small>
      </div>

    </div>
  );
}