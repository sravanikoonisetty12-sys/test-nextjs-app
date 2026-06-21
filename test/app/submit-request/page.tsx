"use client";

import "../styles/submit-request.css";

export default function SubmitRequest() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Request Submitted Successfully 🚀");
  };

  return (
    <>
      <h1 style={{ color: "#111" }}>
        Submit a Request
      </h1>

      <p
        className="subtitle"
        style={{ color: "#ffffff" }}
      >
        Send a message, feedback, or project brief to our team.
      </p>

      <div className="card">

        <h3 style={{ color: "#111" }}>
          Request Details
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="row">

            <div className="input-group">
              <label>Request Title</label>

              <input
                type="text"
                placeholder="e.g. Website redesign feedback"
              />
            </div>

            <div className="input-group">
              <label>Category</label>

              <select>
                <option>Select Category</option>
                <option>Website</option>
                <option>Mobile App</option>
                <option>UI Design</option>
              </select>
            </div>

          </div>

          <div className="row">

            <div className="input-group">
              <label>Priority</label>

              <select>
                <option>Normal</option>
                <option>Low</option>
                <option>High</option>
              </select>
            </div>

            <div className="input-group">
              <label>Preferred Due Date</label>

              <input type="date" />
            </div>

          </div>

          <div className="input-group">

            <label>Message / Description</label>

            <textarea
              rows={6}
              placeholder="Describe your request in detail..."
            />

          </div>

          <div className="buttons">

            <button
              type="submit"
              className="submit-btn"
            >
              Submit Request
            </button>

            <button
              type="reset"
              className="clear-btn"
            >
              Clear
            </button>

          </div>

        </form>

      </div>

      <div className="card">

        <h3>Attach Files (Optional)</h3>

        <div className="upload-box">

          <h4>Drag & Drop Files Here</h4>

          <p>or click to browse</p>

          <input type="file" />

        </div>

      </div>
    </>
  );
}