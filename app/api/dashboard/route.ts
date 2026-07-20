import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const isAdmin = searchParams.get("isAdmin") === "true";

    // 1. Fetch Requests safely
    let query = supabase.from("Requests").select("*").order("id", { ascending: false });
    if (!isAdmin && userId) {
      query = query.eq("user_id", userId);
    }
    const { data: requests, error: reqError } = await query;
    if (reqError) console.error("Req Error:", reqError);

    // Fetch Profiles to manually map emails safely
    const { data: profilesData } = await supabase.from("Profiles").select("id, email");
    const profileMap = new Map();
    if (profilesData) {
      profilesData.forEach((p: any) => profileMap.set(p.id, p.email));
    }

    const formattedRequests = requests?.map((item: any) => ({
      ...item,
      user_email: profileMap.get(item.user_id) || "N/A",
      description: item.messagetext || item.description || item.message // Ensure description is unified
    })) || [];

    // 2. Fetch Invoices
    let invQuery = supabase.from("invoices").select("*");
    if (!isAdmin && userId) {
      invQuery = invQuery.eq("user_id", userId);
    }
    const { data: invoicesData, error: invError } = await invQuery;
    if (invError) console.error("Inv Error:", invError);

    // 3. Fetch Uploaded Files
    let uploadedFiles = [];
    try {
      let filesQuery = supabase.from("UploadedFiles").select("*");
      if (!isAdmin && userId) {
        filesQuery = filesQuery.eq("user_id", userId);
      }
      const { data: filesData, error: fileError } = await filesQuery;
      if (!fileError) {
        uploadedFiles = filesData || [];
      }
    } catch (e) {
      console.error("Files block error:", e);
    }

    return NextResponse.json({
      outstandingBalance: "0",
      totalPaid: "0",
      activeProjects: 0,
      openTickets: formattedRequests.length || 0,
      recentActivity: formattedRequests,
      invoices: invoicesData || [], // Fixed key to match user dashboard
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