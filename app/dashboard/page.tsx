"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
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

      const { data: profile, error: profileError } = await supabase
        .from("Profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.log("FULL ERROR DETAILS:", JSON.stringify(profileError, null, 2));
      }

      const admin = user.email === "admin0123@gmail.com" || profile?.role === "admin";
      
      setIsAdmin(admin);
      await loadData(admin, user.id);
    } catch (err) {
      console.error("CheckUser Error:", err);
      router.replace("/signin");
    } finally {
      setLoading(false);
    }
  }

  async function loadData(admin: boolean, userId: string) {
    try {
      const res = await fetch(`/api/dashboard?userId=${userId}&isAdmin=${admin}`);
      
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("LoadData Error:", err);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch("/api/dashboard", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await loadData(isAdmin, user.id);
        }
      } else {
        alert("Failed to delete request");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#fdf2f8" }}>
        <img 
          src="https://img.icons8.com/clouds/200/work.png" 
          alt="Loading Illustration" 
          style={{ width: "120px", height: "120px", marginBottom: "15px", objectFit: "contain" }} 
        />
        <h2 style={{ color: "#ec4899", fontFamily: "sans-serif" }}>Loading...</h2>
      </div>
    );
  }

  return isAdmin ? (
    <AdminDashboard data={data} onDelete={handleDelete} />
  ) : (
    <UserDashboard data={data} onDelete={handleDelete} />
  );
}