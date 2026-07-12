import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase client initialization
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ID ni await cheyali
    const { id } = await params;
    const ticketId = parseInt(id);

    if (isNaN(ticketId)) {
      return NextResponse.json({ error: "Invalid ticket ID" }, { status: 400 });
    }

    // Requests table nunchi data fetch chesthunnam
    const { data, error } = await supabase
      .from("Requests")
      .select("id, title, category, priority, due_date, messagetext, created_at")
      .eq("id", ticketId)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json(
        { error: "Ticket not found", details: error.message },
        { status: 404 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Mapping: Database column names ni frontend ki kavalsina names ki map chestunnam
    const ticket = {
      id: data.id,
      title: data.title || "Untitled",
      category: data.category || "General",
      priority: data.priority || "Low",
      due_date: data.due_date || "N/A",
      description: data.messagetext || "No description provided.",
      created_at: data.created_at,
    };

    return NextResponse.json(ticket, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}