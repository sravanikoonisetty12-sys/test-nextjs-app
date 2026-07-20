"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function UserInvoices() {
  const [invoices, setInvoices] = useState<any[]>([]);

  const fetchInvoices = async () => {
    const { data } = await supabase.from("invoices").select("*");
    if (data) setInvoices(data);
  };

  useEffect(() => {
    fetchInvoices();
    // Optional: Realtime subscription for instant updates
    const channel = supabase.channel('realtime-invoices').on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, fetchInvoices).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <table>
      {invoices.map((inv) => (
        <tr key={inv.invoice_number}>
          <td>{inv.invoice_number}</td>
          <td>{inv.description}</td>
          <td>{inv.status}</td>
        </tr>
      ))}
    </table>
  );
}