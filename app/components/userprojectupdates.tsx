"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function UserProjectUpdates() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [statusFiles, setStatusFiles] = useState<any[]>([]);
  const [feedback, setFeedback] = useState("");
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    fetchFilesAndProjects();
  }, []);

  const fetchFilesAndProjects = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: requestData, error: reqError } = await supabase
        .from("Requests")
        .select("project_name, user_name")
        .eq("user_id", user.id); 

      if (reqError || !requestData || requestData.length === 0) {
        setLoading(false);
        return;
      }

      setUserProjects(requestData);
      setSelectedProject(requestData[0].project_name);

      const projectNames = requestData.map((r) => r.project_name);
      const currentUserName = requestData[0].user_name;

      const { data: filesData, error: fileError } = await supabase
        .from("uploadfiles")
        .select("*")
        .or(`user_name.eq.${currentUserName},project_name.in.(${projectNames.join(",")})`);

      if (fileError) {
        console.error("Error fetching files:", fileError.message);
      }

      const allFetchedFiles = filesData || [];

      setProposals(
        allFetchedFiles.filter((f) => f.category?.toLowerCase() === "proposal")
      );
      setStatusFiles(
        allFetchedFiles.filter((f) => f.category?.toLowerCase() === "status")
      );

      fetchUserFeedback(currentUserName);

    } catch (err) {
      console.error("Error in fetchFilesAndProjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFeedback = async (userName: string) => {
    const { data, error } = await supabase
      .from("Feedback")
      .select("*")
      .eq("user_name", userName)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setFeedbackList(data);
    }
  };

  const handleSendFeedback = async () => {
    if (!feedback.trim()) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const matchedProj = userProjects.find((p) => p.project_name === selectedProject);
      const userName = matchedProj?.user_name || "sita";

      const { error } = await supabase.from("Feedback").insert([
        { 
          user_name: userName, 
          project_name: selectedProject || "soul",
          message: feedback 
        }
      ]);

      if (error) {
        console.error("Supabase Error details:", error);
        alert("Error: " + error.message);
        return;
      }

      alert("Feedback sent successfully!");
      setFeedback("");
      fetchUserFeedback(userName);
    } catch (err: any) {
      console.error("Error sending feedback:", err);
      alert("Error sending feedback.");
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

      const matchedProj = userProjects.find((p) => p.project_name === selectedProject);
      const userName = matchedProj?.user_name || "sita";
      fetchUserFeedback(userName);
    } catch (err: any) {
      console.error("Delete error:", err.message);
      alert("Error deleting feedback.");
    }
  };

  if (loading) {
    return <p style={{ padding: "30px", color: "#000000" }}>Loading updates...</p>;
  }

  return (
    <div style={{ padding: "30px", color: "#000000", maxWidth: "1200px", minHeight: "100vh" }}>
      {/* Header with Project Updates title and increased image size */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px", flexWrap: "wrap" }}>
        <h2 style={{ fontSize: "30px", margin: 0, fontWeight: "bold", color: "#000000" }}>
          Project Updates
        </h2>
        <img 
          src="/user-projectupdates.png" 
          alt="Project Updates Illustration" 
          style={{ width: "130px", height: "130px", objectFit: "contain" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        {/* Left Column: Files Sent by Admin & Send Feedback Form */}
        <div>
          {/* Files Sent by Admin Box */}
          <div
            style={{
              backgroundColor: "#ffffff !important",
              background: "#ffffff",
              padding: "25px",
              borderRadius: "16px",
              marginBottom: "30px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "20px", marginRight: "10px" }}>📁</span>
              <h3 style={{ fontSize: "18px", margin: 0, color: "#1e3a8a", fontWeight: "700" }}>
                Files Sent by Admin
              </h3>
            </div>

            {/* Proposals Section */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ fontSize: "15px", color: "#1d4ed8", marginBottom: "8px", fontWeight: "600" }}>
                Proposals
              </h4>
              {proposals.length > 0 ? (
                proposals.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      background: "#f8fafc",
                      padding: "12px 15px",
                      borderRadius: "10px",
                      marginBottom: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "500", fontSize: "14px", color: "#000000" }}>{file.title}</span>
                      <span style={{ fontSize: "12px", color: "#475569", marginLeft: "8px" }}>
                        (Project: {file.project_name})
                      </span>
                    </div>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline", fontSize: "13px", fontWeight: "500" }}
                    >
                      View File
                    </a>
                  </div>
                ))
              ) : (
                <p style={{ color: "#475569", fontStyle: "italic", fontSize: "14px", margin: 0 }}>
                  No proposals sent by admin yet.
                </p>
              )}
            </div>

            {/* Project Status Files Section */}
            <div>
              <h4 style={{ fontSize: "15px", color: "#15803d", marginBottom: "8px", fontWeight: "600" }}>
                Project Status Files
              </h4>
              {statusFiles.length > 0 ? (
                statusFiles.map((file) => (
                  <div
                    key={file.id}
                    style={{
                      background: "#f8fafc",
                      padding: "12px 15px",
                      borderRadius: "10px",
                      marginBottom: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "500", fontSize: "14px", color: "#000000" }}>{file.title}</span>
                      <span style={{ fontSize: "12px", color: "#475569", marginLeft: "8px" }}>
                        (Project: {file.project_name})
                      </span>
                    </div>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", textDecoration: "underline", fontSize: "13px", fontWeight: "500" }}
                    >
                      View File
                    </a>
                  </div>
                ))
              ) : (
                <p style={{ color: "#475569", fontStyle: "italic", fontSize: "14px", margin: 0 }}>
                  No status files sent by admin yet.
                </p>
              )}
            </div>
          </div>

          {/* Send Feedback Box */}
          <div
            style={{
              backgroundColor: "#ffffff !important",
              background: "#ffffff",
              padding: "25px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <span style={{ fontSize: "18px", marginRight: "10px" }}>💬</span>
              <h3 style={{ fontSize: "18px", margin: 0, color: "#1e3a8a", fontWeight: "700" }}>
                Send Feedback to Admin
              </h3>
            </div>

            {userProjects.length > 1 && (
              <div style={{ marginBottom: "15px" }}>
                <label style={{ fontSize: "14px", color: "#334155", display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Select Project:
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
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
                  {userProjects.map((p, index) => (
                    <option key={index} value={p.project_name}>
                      {p.project_name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <p style={{ fontSize: "14px", color: "#334155", marginBottom: "10px", fontWeight: "500" }}>
              Your Feedback / Query:
            </p>

            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Type your feedback here..."
              style={{
                width: "100%",
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "12px",
                color: "#000000",
                outline: "none",
                resize: "vertical",
                marginBottom: "15px",
              }}
            />

            <button
              style={{
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                width: "fit-content",
                boxShadow: "0 4px 6px rgba(236, 72, 153, 0.2)",
              }}
              onClick={handleSendFeedback}
            >
              Send Feedback
            </button>
          </div>
        </div>

        {/* Right Column: User Sent Feedback History */}
        <div>
          <div
            style={{
              backgroundColor: "#ffffff !important",
              background: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
              height: "100%",
              maxHeight: "750px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
              <span style={{ fontSize: "18px", marginRight: "10px" }}>📋</span>
              <h3 style={{ fontSize: "18px", margin: 0, color: "#1e3a8a", fontWeight: "700" }}>
                Your Sent Feedback History
              </h3>
            </div>

            <div style={{ overflowY: "auto", paddingRight: "5px", flex: 1 }}>
              {feedbackList.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {feedbackList.map((fb) => (
                    <div
                      key={fb.id}
                      style={{
                        background: "#f8fafc",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#1d4ed8", fontWeight: "600", background: "#f1f5f9", padding: "2px 8px", borderRadius: "4px", border: "1px solid #cbd5e1" }}>
                          {fb.project_name || "N/A"}
                        </span>
                        <span style={{ fontSize: "11px", color: "#475569" }}>
                          {fb.created_at ? new Date(fb.created_at).toLocaleString() : ""}
                        </span>
                      </div>

                      <p style={{ fontSize: "13px", color: "#000000", margin: 0, lineHeight: "1.4" }}>
                        {fb.message}
                      </p>

                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
                        <button
                          onClick={() => handleDeleteFeedback(fb.id)}
                          style={{
                            background: "transparent",
                            color: "#dc2626",
                            border: "1px solid #dc2626",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "11px",
                            cursor: "pointer",
                            fontWeight: "500",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#475569", fontStyle: "italic", fontSize: "14px", textAlign: "center", marginTop: "40px" }}>
                  You have not sent any feedback yet.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}