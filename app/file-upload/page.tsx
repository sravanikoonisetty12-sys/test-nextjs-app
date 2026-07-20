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

  const deleteFile = async (
    id: string,
    filePath: string
  ) => {
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
    <>
      <h1 className="page-title">File Upload</h1>

      <div className="top-section">
        <div className="upload-card">
          <h3 className="card-heading">Upload Files</h3>

          <div
            className="upload-box"
            style={{
              border: "2px dashed #ccc",
              padding: "20px",
              textAlign: "center",
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
              style={{
                cursor: "pointer",
                display: "block",
              }}
            >
              {file ? (
                <div
                  style={{
                    color: "#0070f3",
                    fontWeight: "bold",
                  }}
                >
                  📄 {file.name}
                </div>
              ) : (
                "Click here to select a file"
              )}
            </label>
          </div>

          <div className="buttons">
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={loading || !file}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            <button
              className="clear-btn"
              onClick={() => setFile(null)}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h3>Storage Used</h3>
            <p>
              {(files.length * 2.5).toFixed(1)} MB / 500 MB
            </p>
          </div>
        </div>
      </div>

      <div className="table-card">
        <h3>
          {isAdmin
            ? "All Users Uploaded Files (Admin View)"
            : "My Uploaded Files"}
        </h3>

        <table>
          <thead>
            <tr>
              <th>File Name</th>

              {isAdmin && (
                <th>Uploaded By (Email)</th>
              )}

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {files.length > 0 ? (
              files.map((f) => (
                <tr key={f.id}>
                  <td
                    onClick={() =>
                      openFile(f.file_path)
                    }
                    style={{
                      cursor: "pointer",
                      color: "#0070f3",
                    }}
                  >
                    📄 {f.file_name}
                  </td>

                  {isAdmin && (
                    <td>
                      {f.Profiles?.email ??
                        "Unknown User"}
                    </td>
                  )}

                  <td>
                    <button
                      onClick={() =>
                        deleteFile(
                          f.id,
                          f.file_path
                        )
                      }
                      style={{
                        color: "red",
                        border: "none",
                        background: "none",
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
                    padding: "20px",
                  }}
                >
                  No files uploaded
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}