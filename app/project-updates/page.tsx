"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import AdminProjectUpdates from "@/app/components/adminprojectupdates";
import UserProjectUpdates from "@/app/components/userprojectupdates";

export default function ProjectUpdatesPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Replace this with your actual admin email address
  const ADMIN_EMAIL = "admin0123@gmail.com";

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (session && session.user) {
        setCurrentUser(session.user);
        const userEmail = session.user.email?.toLowerCase().trim();
        
        // If the logged-in email matches the admin email, set isAdmin to true
        if (userEmail === ADMIN_EMAIL.toLowerCase().trim()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Error checking role:", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ color: "#000000", padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div>
      {isAdmin ? (
        <AdminProjectUpdates />
      ) : (
        <UserProjectUpdates />
      )}
    </div>
  );
}