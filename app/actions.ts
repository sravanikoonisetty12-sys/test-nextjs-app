"use server";
import { supabase } from "./lib/supabase"; 

export async function deleteRequestAction(id: number) {
  // Use plain name. Supabase handles the case-sensitivity automatically.
  const { error } = await supabase
    .from('Requests') 
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Supabase Error:", error);
    throw new Error(error.message);
  }
  return { success: true };
}