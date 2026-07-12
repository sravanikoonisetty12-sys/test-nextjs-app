import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log("--- Fetching Dashboard Data ---");
    
    // 1. Fetch Requests
    const { data: requests, error: reqError } = await supabase
      .from('Requests')
      .select('*')
      .order('id', { ascending: false });

    if (reqError) throw new Error("Requests Table Error: " + reqError.message);

    const { data: pendingInvoices, error: invError } = await supabase
      .from('invoices') 
      .select('*')
      .neq('status', 'Paid'); 

    if (invError) throw new Error("Invoices Table Error: " + invError.message);

    console.log("Requests found:", requests?.length);
    console.log("Pending/Due Invoices found:", pendingInvoices?.length);

    return NextResponse.json({
      outstandingBalance: "0",
      totalPaid: "0",
      activeProjects: 0,
      openTickets: requests ? requests.length : 0,
      recentActivity: requests || [],
      pendingInvoices: pendingInvoices || []
    });
  } catch (error: any) {
    console.error("Critical API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) throw new Error("ID missing");

    const { error } = await supabase.from('Requests').delete().eq('id', id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}