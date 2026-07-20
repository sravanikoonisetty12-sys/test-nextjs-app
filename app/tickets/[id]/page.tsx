"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TicketDetail() {
  const params = useParams();
  const id = params?.id as string;
  
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchTicket() {
      try {
        setLoading(true);
        const res = await fetch(`/api/tickets/${id}`);
        const data = await res.json();
        
        console.log("Fetched Data:", data); 
        
        if (res.ok && data) {
          setTicket(data);
        } else {
          console.error("Ticket fetch failed:", data.error);
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTicket();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Loading ticket details...</div>;
  if (!ticket) return <div style={{ color: 'white', padding: '40px' }}>Ticket not found or an error occurred.</div>;

  return (
    <div style={{ padding: '40px', color: 'white', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>{ticket.title || "Untitled Ticket"}</h1>
      
      <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
        <p><strong>Category:</strong> {ticket.category || "N/A"}</p>
        <p><strong>Priority:</strong> {ticket.priority || "N/A"}</p>
        <p><strong>Due Date:</strong> {ticket.due_date || "N/A"}</p>
        <p><strong>Created At:</strong> {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "N/A"}</p>
      </div>

      <hr style={{ margin: '30px 0', borderColor: '#333' }} />
      
      <h3>Description:</h3>
      <div style={{ background: '#111', padding: '20px', borderRadius: '8px' }}>
        <p style={{ lineHeight: '1.6', color: '#ccc', margin: 0 }}>
          {ticket.description || "No description provided."}
        </p>
      </div>
    </div>
  );
}