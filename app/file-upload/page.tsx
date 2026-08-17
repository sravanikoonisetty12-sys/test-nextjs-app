"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/file-upload.css";

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  created_at?: string;
  Profiles?: {
    email: string;
  } | null;
}

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchFiles = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("No active user session found.");
      return;
    }

    const { data: profile } = await supabase
      .from("Profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const userIsAdmin =
      profile?.role === "admin" ||
      user.email === "admin0123@gmail.com";

    setIsAdmin(userIsAdmin);

    let query = supabase
      .from("UploadedFiles")
      .select(`
        *,
        Profiles:user_id (
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (!userIsAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching files:", error.message);
      return;
    }

    setFiles((data as UploadedFile[]) || []);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    // File type validation
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PNG, JPG and PDF files are allowed.");
      return;
    }

    // File size validation (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5MB.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Session expired. Please login again.");
      setLoading(false);
      return;
    }

    const filePath = `public/${Date.now()}-${file.name}`;

    const { data: storageData, error: uploadError } =
      await supabase.storage
        .from("uploads")
        .upload(filePath, file, {
          upsert: true,
        });

    if (uploadError) {
      alert(uploadError.message);
      setLoading(false);
      return;
    }

    const { error: dbError } = await supabase
      .from("UploadedFiles")
      .insert([
        {
          file_name: file.name,
          file_path: storageData?.path ?? filePath,
          user_id: user.id,
        },
      ]);

    if (dbError) {
      alert(dbError.message);
    } else {
      alert("File uploaded successfully!");
      setFile(null);
      fetchFiles();
    }

    setLoading(false);
  };

  const openFile = (filePath: string) => {
    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    if (data.publicUrl) {
      window.open(data.publicUrl, "_blank");
    }
  };

  const deleteFile = async (id: string, filePath: string) => {
    if (isAdmin) {
      setFiles((prevFiles) => prevFiles.filter((f) => f.id !== id));
      return;
    }

    const { error: storageError } =
      await supabase.storage
        .from("uploads")
        .remove([filePath]);

    if (storageError) {
      alert(storageError.message);
      return;
    }

    const { error: dbError } = await supabase
      .from("UploadedFiles")
      .delete()
      .eq("id", id);

    if (dbError) {
      alert(dbError.message);
      return;
    }

    fetchFiles();
  };

  return (
    <div
      style={{
        padding: "0px 30px 30px 30px",
        color: "#000000",
        maxWidth: "1200px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "0px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2
            className="page-title"
            style={{
              fontSize: "30px",
              margin: 0,
              fontWeight: "bold",
              color: "#000000",
            }}
          >
            File Upload
          </h2>

          <p
            style={{
              fontSize: "14px",
              color: "#475569",
              marginTop: "5px",
              marginBottom: "0px",
              fontWeight: "500",
            }}
          >
            Upload and manage your files securely.
          </p>
        </div>

        <img
          src="/fileupload.png"
          alt="File Upload Illustration"
          style={{
            width: "160px",
            height: "160px",
            objectFit: "contain",
          }}
        />
      </div>

      <div
        className="top-section"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginBottom: "30px",
          marginTop: "10px",
        }}
      >
        {/* Upload Card */}
        <div
          className="upload-card"
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            className="card-heading"
            style={{
              fontSize: "18px",
              margin: "0 0 15px 0",
              color: "#1e3a8a",
            }}
          >
            Upload Files
          </h3>

          <div
            className="upload-box"
            style={{
              border: "2px dashed #cbd5e1",
              padding: "20px",
              textAlign: "center",
              background: "#f8fafc",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          >
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
            />

            <label
              htmlFor="fileInput"
              style={{ cursor: "pointer", display: "block" }}
            >
              {file ? (
                <div
                  style={{
                    color: "#8b5cf6",
                    fontWeight: "bold",
                  }}
                >
                  📄 {file.name}
                </div>
              ) : (
                <span
                  style={{
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  Click here to select a file
                </span>
              )}
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleUpload}
              disabled={loading || !file}
              style={{
                background:
                  "linear-gradient(135deg,#ec4899,#8b5cf6)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                opacity: loading || !file ? 0.6 : 1,
              }}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            <button
              onClick={() => setFile(null)}
              style={{
                background: "transparent",
                color: "#475569",
                border: "1px solid #cbd5e1",
                padding: "10px 20px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Storage Card */}
        <div
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              margin: "0 0 15px 0",
              color: "#1e3a8a",
            }}
          >
            Storage Used
          </h3>

          <p
            style={{
              color: "#000000",
              fontSize: "15px",
              fontWeight: "500",
              margin: 0,
            }}
          >
            {(files.length * 2.5).toFixed(1)} MB / 500 MB
          </p>
        </div>
      </div>

      {/* Files Table */}
      <div
        style={{
          background: "#ffffff",
          padding: "25px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            margin: "0 0 20px 0",
            color: "#1e3a8a",
          }}
        >
          {isAdmin
            ? "All Users Uploaded Files (Admin View)"
            : "My Uploaded Files"}
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: "1px solid #e2e8f0",
                textAlign: "left",
              }}
            >
              <th style={{ padding: "12px" }}>File Name</th>

              {isAdmin && (
                <th style={{ padding: "12px" }}>
                  Uploaded By
                </th>
              )}

              <th style={{ padding: "12px" }}>Action</th>
            </tr>
          </thead>

          <tbody>
            {files.length > 0 ? (
              files.map((f) => (
                <tr key={f.id}>
                  <td
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      color: "#8b5cf6",
                    }}
                    onClick={() =>
                      openFile(f.file_path)
                    }
                  >
                    📄 {f.file_name}
                  </td>

                  {isAdmin && (
                    <td style={{ padding: "12px" }}>
                      {f.Profiles?.email ??
                        "Unknown User"}
                    </td>
                  )}

                  <td style={{ padding: "12px" }}>
                    <button
                      onClick={() =>
                        deleteFile(
                          f.id,
                          f.file_path
                        )
                      }
                      style={{
                        color: "#dc2626",
                        border: "1px solid #dc2626",
                        background: "transparent",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isAdmin ? 3 : 2}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#475569",
                  }}
                >
                  No files uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}