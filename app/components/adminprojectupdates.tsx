"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

export default function AdminUploadPanel() {
  const [category, setCategory] = useState("proposal");
  const [userName, setUserName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Suggestions states for all users from Requests table
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [allProjects, setAllProjects] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<string[]>([]);

  // Lists state
  const [uploadedFilesList, setUploadedFilesList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  useEffect(() => {
    fetchUploadedFiles();
    fetchFeedback();
    fetchSuggestionsData();
  }, []);

  const fetchUploadedFiles = async () => {
    const { data, error } = await supabase
      .from("uploadfiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setUploadedFilesList(data);
    }
  };

  const fetchFeedback = async () => {
    const { data, error } = await supabase
      .from("Feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFeedbackList(data);
    }
  };

  const fetchSuggestionsData = async () => {
    const { data, error } = await supabase
      .from("Requests")
      .select("user_name, project_name");

    if (!error && data) {
      const uniqueUsers = Array.from(new Set(data.map((item) => item.user_name).filter(Boolean)));
      const uniqueProjects = Array.from(new Set(data.map((item) => item.project_name).filter(Boolean)));
      
      setAllUsers(uniqueUsers);
      setAllProjects(uniqueProjects);
    }
  };

  const handleUserInputChange = (val: string) => {
    setUserName(val);
    if (val.trim() === "") {
      setFilteredUsers([]);
    } else {
      const matches = allUsers.filter((u) => u.toLowerCase().includes(val.toLowerCase()));
      setFilteredUsers(matches);
    }
  };

  const handleProjectInputChange = (val: string) => {
    setProjectName(val);
    if (val.trim() === "") {
      setFilteredProjects([]);
    } else {
      const matches = allProjects.filter((p) => p.toLowerCase().includes(val.toLowerCase()));
      setFilteredProjects(matches);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !userName || !projectName) {
      alert("Please fill in all fields!");
      return;
    }

    setUploading(true);
    try {
      const { error: dbError } = await supabase.from("uploadfiles").insert([
        {
          title: file.name,
          file_url: URL.createObjectURL(file),
          user_name: userName,
          project_name: projectName,
          category: category,
        },
      ]);

      if (dbError) throw dbError;

      alert("File uploaded successfully!");
      setFile(null);
      setUserName("");
      setProjectName("");
      fetchUploadedFiles();
    } catch (err: any) {
      console.error("Upload error:", err.message);
      alert("Error uploading file: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file record?")) return;

    try {
      const { error } = await supabase
        .from("uploadfiles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("File deleted successfully!");
      fetchUploadedFiles();
    } catch (err: any) {
      console.error("Delete error:", err.message);
      alert("Error deleting file.");
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const { error } = await supabase
        .from("Feedback")
        .delete()
        .eq("id", id);

      if (error) throw error;

      alert("Feedback deleted successfully!");
      fetchFeedback();
    } catch (err: any) {
      console.error("Delete error:", err.message);
      alert("Error deleting feedback.");
    }
  };

  return (
    <div style={{ padding: "20px", color: "#000000", maxWidth: "1100px", minHeight: "100vh" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "30px", fontWeight: "bold", color: "#000000", margin: 0 }}>
          Project Updates
        </h2>
        <img 
          src="/admin-projectupdates.png" 
          alt="Project Updates Icon" 
          style={{ width: "150px", height: "150px", objectFit: "contain" }} 
          suppressHydrationWarning={true}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
        {/* Left Side: Upload Form */}
        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3 style={{ fontSize: "18px", color: "#1e3a8a", marginBottom: "20px", fontWeight: "700" }}>
            Upload Proposal or Project Status File
          </h3>

          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Select Type:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                <option value="proposal">Upload Proposal</option>
                <option value="status">Upload Status File</option>
              </select>
            </div>

            {/* Target User Name */}
            <div style={{ marginBottom: "15px", position: "relative" }}>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Target User Name:
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => handleUserInputChange(e.target.value)}
                placeholder="Type or select user name (e.g. John Doe)"
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
              {userName.trim().length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    listStyle: "none",
                    padding: 0,
                    margin: "4px 0 0 0",
                    zIndex: 10,
                    maxHeight: "150px",
                    overflowY: "auto",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setUserName(u);
                          setFilteredUsers([]);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: "14px",
                          color: "#000000",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {u}
                      </li>
                    ))
                  ) : (
                    <li
                      style={{
                        padding: "10px 12px",
                        color: "#64748b",
                        fontStyle: "italic",
                        fontSize: "14px",
                        cursor: "default",
                      }}
                    >
                      User does not exist
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Project Name */}
            <div style={{ marginBottom: "15px", position: "relative" }}>
              <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px", fontWeight: "500" }}>
                Project Name:
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => handleProjectInputChange(e.target.value)}
                placeholder="Type or select project name (e.g. Project Alpha, Project Betas)"
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
              {projectName.trim().length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    listStyle: "none",
                    padding: 0,
                    margin: "4px 0 0 0",
                    zIndex: 10,
                    maxHeight: "150px",
                    overflowY: "auto",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((p, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setProjectName(p);
                          setFilteredProjects([]);
                        }}
                        style={{
                          padding: "8px 12px",
                          cursor: "pointer",
                          borderBottom: "1px solid #f1f5f9",
                          fontSize: "14px",
                          color: "#000000",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        {p}
                      </li>
                    ))
                  ) : (
                    <li
                      style={{
                        padding: "10px 12px",
                        color: "#64748b",
                        fontStyle: "italic",
                        fontSize: "14px",
                        cursor: "default",
                      }}
                    >
                      Project does not exist
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Choose File */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "14px", color: "#334155", display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px", fontWeight: "500" }}>
                <span>📁</span> Choose File:
              </label>
              <input
                type="file"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                style={{ 
                  color: "#334155", 
                  fontSize: "14px",
                  width: "100%",
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "8px",
                  outline: "none"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              style={{
                background: "linear-gradient(135deg, #d946ef, #9333ea)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
                boxShadow: "0 4px 6px rgba(217, 70, 239, 0.3)",
              }}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </form>
        </div>

        {/* Right Side: Uploaded Files Tracker */}
        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            maxHeight: "500px",
            overflowY: "auto",
          }}
        >
          <h3 style={{ fontSize: "18px", color: "#1e3a8a", marginBottom: "20px", fontWeight: "700" }}>
            Files Uploaded per User
          </h3>

          {uploadedFilesList.length > 0 ? (
            uploadedFilesList.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#f8fafc",
                  padding: "12px 15px",
                  borderRadius: "10px",
                  marginBottom: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "#1d4ed8" }}>
                    {item.title}
                  </span>
                  <button
                    onClick={() => handleDeleteFile(item.id)}
                    style={{
                      background: "transparent",
                      color: "#dc2626",
                      border: "1px solid #dc2626",
                      padding: "3px 10px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div style={{ fontSize: "12px", color: "#475569" }}>
                  User: <strong style={{ color: "#000000" }}>{item.user_name}</strong> | Project: <strong style={{ color: "#000000" }}>{item.project_name}</strong>
                </div>
                <div style={{ fontSize: "11px", color: "#15803d", textTransform: "uppercase", fontWeight: "600" }}>
                  Category: {item.category}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#475569", fontStyle: "italic", fontSize: "14px" }}>
              No files uploaded yet.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Compact Table Layout for Feedback */}
      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 style={{ fontSize: "18px", color: "#1e3a8a", marginBottom: "20px", fontWeight: "700" }}>
          See Feedback from Users
        </h3>

        {feedbackList.length > 0 ? (
          <div style={{ overflowX: "auto", maxHeight: "300px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e2e8f0", color: "#1e293b" }}>
                  <th style={{ padding: "10px", fontWeight: "600" }}>User Name</th>
                  <th style={{ padding: "10px", fontWeight: "600" }}>Project Name</th>
                  <th style={{ padding: "10px", fontWeight: "600" }}>Message</th>
                  <th style={{ padding: "10px", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "10px", textAlign: "right", fontWeight: "600" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbackList.map((fb) => (
                  <tr key={fb.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 10px", color: "#1d4ed8", fontWeight: "600" }}>
                      {fb.user_name || "Unknown"}
                    </td>
                    <td style={{ padding: "12px 10px", color: "#000000" }}>
                      {fb.project_name || "Unknown"}
                    </td>
                    <td style={{ padding: "12px 10px", color: "#334155", maxWidth: "400px", wordBreak: "break-word" }}>
                      {fb.message}
                    </td>
                    <td style={{ padding: "12px 10px", color: "#475569", fontSize: "13px" }}>
                      {fb.created_at ? fb.created_at.split('T')[0] : "N/A"}
                    </td>
                    <td style={{ padding: "12px 10px", textAlign: "right" }}>
                      <button
                        onClick={() => handleDeleteFeedback(fb.id)}
                        style={{
                          background: "transparent",
                          color: "#dc2626",
                          border: "1px solid #dc2626",
                          padding: "4px 10px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer",
                          fontWeight: "500",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: "#475569", fontStyle: "italic", fontSize: "14px" }}>
            No feedback received from users yet.
          </p>
        )}
      </div>
    </div>
  );
}