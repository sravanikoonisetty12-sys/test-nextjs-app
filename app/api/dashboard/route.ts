import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use direct fallback credentials or environment variables safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vqvgvmlblaarrtuiadhj.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxdmd2bWxibGFhcnJ0dWlhZGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjA1ODQsImV4cCI6MjA5ODEzNjU4NH0.Rw2SU9PoektFKznTaGIASFkSr_Es4DVg9m4q0fGNv04";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const isAdmin = searchParams.get("isAdmin") === "true";

    // 1. Fetch Requests safely
    let requests = [];
    try {
      let query = supabase.from("Requests").select("*").order("id", { ascending: false });
      if (!isAdmin && userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (!error && data) requests = data;
    } catch (e) {
      console.warn("Requests table query skipped or failed:", e);
    }

    // 2. Fetch Profiles safely
    const profileMap = new Map();
    try {
      const { data: profilesData } = await supabase.from("Profiles").select("id, email");
      if (profilesData) {
        profilesData.forEach((p: any) => profileMap.set(p.id, p.email));
      }
    } catch (e) {
      console.warn("Profiles table query skipped or failed:", e);
    }

    const formattedRequests = requests.map((item: any) => ({
      ...item,
      user_email: profileMap.get(item.user_id) || "N/A",
      description: item.messagetext || item.description || item.message || ""
    }));

    // 3. Fetch Invoices safely
    let invoicesData = [];
    try {
      let invQuery = supabase.from("invoices").select("*");
      if (!isAdmin && userId) {
        invQuery = invQuery.eq("user_id", userId);
      }
      const { data, error } = await invQuery;
      if (!error && data) invoicesData = data;
    } catch (e) {
      console.warn("Invoices table query skipped or failed:", e);
    }

    // 4. Fetch Uploaded Files safely
    let uploadedFiles = [];
    try {
      let filesQuery = supabase.from("UploadedFiles").select("*");
      if (!isAdmin && userId) {
        filesQuery = filesQuery.eq("user_id", userId);
      }
      const { data, error } = await filesQuery;
      if (!error && data) uploadedFiles = data;
    } catch (e) {
      console.warn("UploadedFiles table query skipped or failed:", e);
    }

    return NextResponse.json({
      outstandingBalance: "0",
      totalPaid: "0",
      activeProjects: 0,
      openTickets: formattedRequests.length || 0,
      recentActivity: formattedRequests,
      invoices: invoicesData,
      uploadedFiles: uploadedFiles,
    });
  } catch (error: any) {
    console.error("API Global Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const { error } = await supabase.from("Requests").delete().eq("id", id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}