"use client";

import "../../styles/submit-request.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SubmitRequest() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",      
    projectName: "",    
    title: "",
    category: "Website",
    priority: "Normal",
    dueDate: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to submit a request.");
        return;
      }

      const { error } = await supabase.from("Requests").insert([
        {
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          due_date: formData.dueDate || null,
          user_name: formData.userName,
          project_name: formData.projectName,
          messagetext: formData.message,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      alert("✅ Request Submitted Successfully");

      setFormData({
        userName: "",
        projectName: "",
        title: "",
        category: "Website",
        priority: "Normal",
        dueDate: "",
        message: "",
      });

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "0px 30px 30px 30px", color: "#000000", maxWidth: "1200px" }}>
      
      {/* Header section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "0px", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "30px", margin: 0, fontWeight: "bold", color: "#000000" }}>
          Submit a Request
        </h2>
        <img 
          src="/user-submitrequest.png" 
          alt="Submit Request Illustration" 
          style={{ width: "170px", height: "170px", objectFit: "contain" }}
        />
      </div>

      <p style={{ fontSize: "14px", color: "#475569", marginBottom: "5px", fontWeight: "500" }}>
        Send a message, feedback, or project brief to our team.
      </p>

      {/* Request Details card */}
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          marginTop: "0px"
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "#1e3a8a", marginTop: "0px" }}>
          Request Details
        </h3>

        <form onSubmit={handleSubmit}>
          {/* First Row: User Name & Project Name */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px" }}>
                User Name
              </label>
              <input
                type="text"
                name="userName"
                required
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter your name"
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#000000",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px" }}>
                Project Name
              </label>
              <input
                type="text"
                name="projectName"
                required
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#000000",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Second Row: Request Title & Category */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px" }}>
                Request Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter request title"
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#000000",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px" }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#000000",
                  outline: "none",
                }}
              >
                <option value="Website">Website</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI Design">UI Design</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
            <div>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px" }}>
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#000000",
                  outline: "none",
                }}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px" }}>
                Preferred Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                style={{
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "10px",
                  color: "#000000",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px" }}>
              Message / Description
            </label>
            <textarea
              rows={6}
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message, feedback, or project brief here..."
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "12px",
                color: "#000000",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                color: "#ffffff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  userName: "",
                  projectName: "",
                  title: "",
                  category: "Website",
                  priority: "Normal",
                  dueDate: "",
                  message: "",
                })
              }
              style={{
                background: "#f3e8ff",
                color: "#7e22ce",
                border: "1px solid #d8b4fe",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}