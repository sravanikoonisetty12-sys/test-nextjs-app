"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; 
import "../styles/file-upload.css";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    const { data, error } = await supabase.storage.from("uploads").list("public");
    if (data) setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const { data: storageData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(`public/${file.name}`, file);

    if (uploadError) {
      alert("Error: " + uploadError.message);
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error: dbError } = await supabase
        .from("UploadedFiles")
        .insert([
          { 
            file_name: file.name, 
            file_path: storageData.path, 
            user_id: user?.id 
          }
        ]);

      if (dbError) console.error("DB Error:", dbError.message);
      else alert("File uploaded successfully!");

      setFile(null);
      fetchFiles(); 
    }
    setLoading(false);
  };

  const openFile = async (fileName: string) => {
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(`public/${fileName}`);
      
    if (data.publicUrl) window.open(data.publicUrl, '_blank');
  };

  const deleteFile = async (fileName: string) => {
    const { error } = await supabase.storage
      .from('uploads')
      .remove([`public/${fileName}`]);

    if (error) alert("Delete fail ayindi: " + error.message);
    else fetchFiles(); 
  };

  return (
    <>
      <h1 className="page-title">File Upload</h1>
      
      <div className="top-section">
        <div className="upload-card">
          <h3 className="card-heading">Upload Files</h3>
          <div className="upload-box" style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
            <input 
              type="file" 
              id="fileInput" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              style={{ display: 'none' }} 
            />
            <label htmlFor="fileInput" style={{ cursor: 'pointer', display: 'block' }}>
              {file ? <div style={{ color: '#0070f3', fontWeight: 'bold' }}>📄 {file.name}</div> : "Click here to select a file"}
            </label>
          </div>

          <div className="buttons">
            <button className="upload-btn" onClick={handleUpload} disabled={loading || !file}>
              {loading ? "Uploading..." : "Upload"}
            </button>
            <button className="clear-btn" onClick={() => setFile(null)}>Clear</button>
          </div>
        </div>

        <div className="right-panel">
          <div className="card">
            <h3>Storage Used</h3>
            <p>{(files.length * 2.5).toFixed(1)} MB / 500 MB</p>
          </div>
        </div>
      </div>

      <div className="table-card">
        <h3>Uploaded Files</h3>
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f, index) => (
              <tr key={index}>
                <td onClick={() => openFile(f.name)} style={{ cursor: 'pointer' }}>📄 {f.name}</td>
                <td>{(f.metadata?.size / 1024 / 1024).toFixed(2) || 0} MB</td>
                <td>
                  <button onClick={() => deleteFile(f.name)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}