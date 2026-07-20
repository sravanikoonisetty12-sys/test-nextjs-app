"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import AdminDashboard from "../components/admindashboard";
import UserDashboard from "../components/userdashboard";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/signin");
        return;
      }

      // Profile fetch
      const { data: profile, error: profileError } = await supabase
        .from("Profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.log("FULL ERROR DETAILS:", JSON.stringify(profileError, null, 2));
      }

      // Admin Login Logic
      const admin = user.email === "admin.123@gmail.com" || profile?.role === "admin";
      
      setIsAdmin(admin);
      await loadData(admin);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadData(admin: boolean) {
    try {
      const { data: { user } } = await supabase.auth.getUser(); 
      
      if (!user) return;

      const res = await fetch(`/api/dashboard?userId=${user.id}&isAdmin=${admin}`);
      
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  }

  // అడ్మిన్ లేదా యూజర్ రిక్వెస్ట్‌ని డిలీట్ చేయడానికి/క్లియర్ చేయడానికి హ్యాండ్లర్
  async function handleDelete(id: number) {
    try {
      const res = await fetch("/api/dashboard", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        await loadData(isAdmin); 
      } else {
        alert("Failed to delete request");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return isAdmin ? (
    <AdminDashboard data={data} onDelete={handleDelete} />
  ) : (
    <UserDashboard data={data} onDelete={handleDelete} />
  );
}