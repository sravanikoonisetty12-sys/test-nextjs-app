"use client";

import "../styles/file-upload.css";

export default function FileUpload() {
  return (
    <>
      <h1 className="page-title">File Upload</h1>

      <p className="subtitle">
        Upload documents, images, and other files to share with our team.
      </p>

      <div className="top-section">

        {/* Upload Card */}
        <div className="upload-card">

          <h3 className="card-heading">
            Upload Files
          </h3>

          <div className="upload-box">

            <h4>Drag & Drop Files Here</h4>

            <p>or click to browse</p>

            <input type="file" multiple />

          </div>

          <div className="buttons">

            <button
              type="button"
              className="upload-btn"
            >
              Upload
            </button>

            <button
              type="button"
              className="clear-btn"
            >
              Clear
            </button>

          </div>

        </div>

        {/* Right Panel */}
        <div className="right-panel">

          <div className="card">

            <h3>Storage Used</h3>

            <p>21.4 MB / 500 MB</p>

            <div className="progress">
              <div className="progress-fill"></div>
            </div>

            <small>478.6 MB Remaining</small>

          </div>

          <div className="card">

            <h3>Accepted Formats</h3>

            <div className="formats">
              <span>PDF</span>
              <span>JPG</span>
              <span>PNG</span>
              <span>SVG</span>
              <span>DOCX</span>
              <span>XLSX</span>
              <span>ZIP</span>
            </div>

          </div>

        </div>

      </div>

      {/* Uploaded Files */}
      <div className="table-card">

        <h3>Uploaded Files</h3>

        <table>

          <thead>
            <tr>
              <th>File</th>
              <th>Type</th>
              <th>Size</th>
              <th>Uploaded</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>📄 Brand_Guidelines.pdf</td>
              <td>PDF</td>
              <td>2.4 MB</td>
              <td>Today</td>
            </tr>

            <tr>
              <td>🖼️ Homepage_Mockup.png</td>
              <td>PNG</td>
              <td>5.2 MB</td>
              <td>Today</td>
            </tr>

          </tbody>

        </table>

      </div>
    </>
  );
}