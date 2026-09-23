import { supabase } from './supabase';
import type { PageSlug } from '../types/site';

/** Public queries depend on RLS: only published records are returned. */
export async function getPublicPage(slug: PageSlug) {
  const { data: page, error } = await supabase.from('site_pages').select('*').eq('slug', slug).maybeSingle();
  if (error || !page) return null;
  const { data: sections } = await supabase.from('page_sections').select('*').eq('page_id', page.id).order('display_order');
  return { page, sections: sections || [] };
}

export async function getPublicLeadership() {
  const { data, error } = await supabase.from('leadership_records').select('*').eq('homepage_visible', true).order('display_order');
  return error ? [] : data || [];
}

export async function getPublicMedia() {
  const { data, error } = await supabase.from('media_items').select('*').eq('status', 'published').order('published_on', { ascending: false });
  return error ? [] : data || [];
}

export async function getPublicContact() {
  const { data, error } = await supabase.from('contact_settings').select('*').eq('id', true).eq('status', 'published').maybeSingle();
  return error ? null : data;
}

export async function getPublicSiteSettings() {
  const { data, error } = await supabase.from('site_settings').select('*');
  return error ? [] : data || [];
}

export async function upsertSitePage(values: Record<string, unknown>) {
  return supabase.from('site_pages').upsert(values, { onConflict: 'slug' }).select().single();
}

export async function upsertSection(values: Record<string, unknown>) {
  return supabase.from('page_sections').upsert(values, { onConflict: 'page_id,section_key' }).select().single();
}
