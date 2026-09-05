import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  localFolders,
  localWritings,
  localIllustrations,
  localAdvocacy,
  localPsychology,
  localContact,
} from "./localContent";

// Every explorer component calls one of these instead of touching
// Supabase or local data directly. When you're ready to go live,
// set VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY and these functions
// will automatically start reading from your database instead.

export async function getLaptopFolders() {
  if (!isSupabaseConfigured) return localFolders.laptop;
  const { data: folders, error } = await supabase
    .from("portfolio_folders")
    .select("id, name, color, icon, sort_order, portfolio_items(*)")
    .eq("section_slug", "laptop")
    .order("sort_order");
  if (error || !folders) return localFolders.laptop;
  return folders.map((f) => ({
    id: f.id,
    name: f.name,
    color: f.color,
    icon: f.icon,
    items: (f.portfolio_items || []).map((i) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      images: i.images || [],
      tools: i.tools || [],
      outcome: i.outcome,
      link: i.link,
    })),
  }));
}

export async function getWritings() {
  if (!isSupabaseConfigured) return localWritings;
  const { data, error } = await supabase.from("writings").select("*").order("date", { ascending: false });
  if (error || !data) return localWritings;
  return data;
}

export async function getIllustrations() {
  if (!isSupabaseConfigured) return localIllustrations;
  const { data, error } = await supabase.from("illustrations").select("*").order("date", { ascending: false });
  if (error || !data) return localIllustrations;
  return data;
}

export async function getAdvocacyProjects() {
  if (!isSupabaseConfigured) return localAdvocacy;
  const { data, error } = await supabase.from("advocacy_projects").select("*");
  if (error || !data) return localAdvocacy;
  return data;
}

export async function getPsychologyProfile() {
  // Simple enough to keep as a single-row table, or leave local until needed.
  return localPsychology;
}

export async function getContactInfo() {
  // Edit src/data/localContent.js -> localContact for now. Move this to a
  // simple single-row Supabase table later the same way the others work,
  // if you want to update contact details without a redeploy.
  return localContact;
}
