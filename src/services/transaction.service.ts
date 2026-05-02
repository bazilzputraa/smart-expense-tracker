import { supabase } from "@/lib/supabase";

export async function saveTransaction(data: any, userId: string) {
  return await supabase.from("transactions").insert([
    {
      ...data,
      user_id: userId,
    },
  ]);
}