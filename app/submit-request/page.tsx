"use client";

import "../../styles/submit-request.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SubmitRequest() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "Select Category",
    priority: "Normal",
    dueDate: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('Requests')
      .insert([
        { 
          title: formData.title, 
          category: formData.category, 
          priority: formData.priority, 
          due_date: formData.dueDate, 
          messagetext: formData.message  // ✅ Fix: space తీసేశాం
        },
      ]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Request Submitted Successfully 🚀");
      router.push("/dashboard");
    }
  };

  return (
    <div className="submit-request-page">
      <h1>Submit a Request</h1>
      <p className="subtitle">Send a message, feedback, or project brief to our team.</p>

      <div className="card">
        <h3>Request Details</h3>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-group">
              <label>Request Title</label>
              <input name="title" onChange={handleChange} value={formData.title} type="text" required />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select name="category" onChange={handleChange} value={formData.category}>
                <option value="Select Category">Select Category</option>
                <option value="Website">Website</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI Design">UI Design</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Priority</label>
              <select name="priority" onChange={handleChange} value={formData.priority}>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="input-group">
              <label>Preferred Due Date</label>
              <input name="dueDate" onChange={handleChange} value={formData.dueDate} type="date" />
            </div>
          </div>

          <div className="input-group">
            <label>Message / Description</label>
            <textarea name="message" onChange={handleChange} value={formData.message} rows={6} />
          </div>

          <div className="buttons">
            <button type="submit" className="submit-btn">Submit Request</button>
            <button 
              type="button" 
              className="clear-btn" 
              onClick={() => setFormData({ 
                title: "", 
                category: "Select Category", 
                priority: "Normal", 
                dueDate: "", 
                message: "" 
              })}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}