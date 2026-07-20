"use client";

import "../../styles/submit-request.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function SubmitRequest() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
      // 1. Fetch the current logged-in user to get their ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to submit a request.");
        return;
      }

      // 2. Insert the request including the user_id
      const { error } = await supabase.from("Requests").insert([
        {
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          due_date: formData.dueDate || null,
          messagetext: formData.message,
          user_id: user.id, // This links the request to your user profile
        },
      ]);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      alert("✅ Request Submitted Successfully");

      setFormData({
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
    <div className="submit-request-page">
      <h1>Submit a Request</h1>

      <p className="subtitle">
        Send a message, feedback, or project brief to our team.
      </p>

      <div className="card">
        <h3>Request Details</h3>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="input-group">
              <label>Request Title</label>

              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Category</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Website">Website</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI Design">UI Design</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="input-group">
              <label>Preferred Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Message / Description</label>

            <textarea
              rows={6}
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className="buttons">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={() =>
                setFormData({
                  title: "",
                  category: "Website",
                  priority: "Normal",
                  dueDate: "",
                  message: "",
                })
              }
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}