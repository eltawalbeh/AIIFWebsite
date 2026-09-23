/*
  FIGMA MAKE–COMPATIBLE DATABASE HANDOFF
  This is deliberately a .ts file because Figma Make rejects raw .sql uploads.
  Copy AIIF_SUPABASE_SQL into a new dedicated AIIF Supabase project's SQL Editor.
  Do not put any Supabase secret key in this project.
*/
export const AIIF_SUPABASE_SQL = String.raw`
create type public.aiif_admin_role as enum ('super_admin','content_admin');
create type public.aiif_status as enum ('draft','needs_verification','approved','published','archived');
create type public.aiif_media_type as enum ('news','press_release','award','publication');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null, full_name text, role public.aiif_admin_role not null default 'content_admin',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.site_pages (
  id uuid primary key default gen_random_uuid(), slug text unique not null check (slug in ('home','about-us','board','media-center','contact-us')),
  title_en text not null default '', title_ar text not null default '', seo_title_en text not null default '', seo_title_ar text not null default '',
  seo_description_en text not null default '', seo_description_ar text not null default '', status public.aiif_status not null default 'draft',
  updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.page_sections (
  id uuid primary key default gen_random_uuid(), page_id uuid not null references public.site_pages(id) on delete cascade,
  section_key text not null, title_en text not null default '', title_ar text not null default '', body_en text not null default '', body_ar text not null default '',
  image_path text, display_order integer not null default 0, status public.aiif_status not null default 'draft',
  updated_by uuid references public.profiles(id), updated_at timestamptz not null default now(), unique(page_id,section_key)
);
create table public.leadership_records (
  id uuid primary key default gen_random_uuid(), full_name_en text not null, full_name_ar text not null default '', honorific text not null default '',
  position_en text not null default '', position_ar text not null default '', country text not null default '', photo_path text,
  short_bio_en text not null default '', short_bio_ar text not null default '', full_bio_en text not null default '', full_bio_ar text not null default '', linkedin_url text,
  active boolean not null default true, homepage_visible boolean not null default false, display_order integer not null default 0,
  status public.aiif_status not null default 'draft', verification_note text not null default '', updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.media_items (
  id uuid primary key default gen_random_uuid(), media_type public.aiif_media_type not null, slug text unique not null,
  title_en text not null default '', title_ar text not null default '', excerpt_en text not null default '', excerpt_ar text not null default '',
  article_en text not null default '', article_ar text not null default '', image_path text, published_on date, featured boolean not null default false,
  status public.aiif_status not null default 'draft', updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.initiatives (
  id uuid primary key default gen_random_uuid(), title_en text not null default '', title_ar text not null default '', summary_en text not null default '', summary_ar text not null default '',
  image_path text, lifecycle text not null default 'unknown', status public.aiif_status not null default 'draft', display_order integer not null default 0,
  updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.partners (
  id uuid primary key default gen_random_uuid(), name text not null, name_ar text not null default '', logo_path text, country text, url text,
  lifecycle text not null default 'unknown', status public.aiif_status not null default 'draft', display_order integer not null default 0,
  updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.contact_settings (
  id boolean primary key default true check (id), email text not null default '', phone text not null default '', address_en text not null default '', address_ar text not null default '',
  map_url text not null default '', linkedin_url text not null default '', x_url text not null default '', instagram_url text not null default '', youtube_url text not null default '',
  status public.aiif_status not null default 'draft', updated_by uuid references public.profiles(id), updated_at timestamptz not null default now()
);
create table public.verification_items (
  id uuid primary key default gen_random_uuid(), item text not null, existing_value text not null default '', source text not null default '', source_date text not null default '',
  lifecycle text not null default 'unknown', verification_status text not null default 'Needs Verification', internal_note text not null default '', updated_at timestamptz not null default now()
);

create function public.aiif_is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists (select 1 from public.profiles where id=(select auth.uid()) and role in ('super_admin','content_admin'))
$$;
create function public.aiif_is_super_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists (select 1 from public.profiles where id=(select auth.uid()) and role='super_admin')
$$;
revoke all on function public.aiif_is_admin() from public; grant execute on function public.aiif_is_admin() to authenticated;
revoke all on function public.aiif_is_super_admin() from public; grant execute on function public.aiif_is_super_admin() to authenticated;

alter table public.profiles enable row level security; alter table public.site_pages enable row level security; alter table public.page_sections enable row level security;
alter table public.leadership_records enable row level security; alter table public.media_items enable row level security; alter table public.initiatives enable row level security;
alter table public.partners enable row level security; alter table public.contact_settings enable row level security; alter table public.verification_items enable row level security;
create policy "admins read profiles" on public.profiles for select to authenticated using (public.aiif_is_admin());
create policy "super admins manage profiles" on public.profiles for all to authenticated using (public.aiif_is_super_admin()) with check (public.aiif_is_super_admin());
create policy "public pages" on public.site_pages for select to anon,authenticated using (status='published' or public.aiif_is_admin());
create policy "admins manage pages" on public.site_pages for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
create policy "public sections" on public.page_sections for select to anon,authenticated using (status='published' or public.aiif_is_admin());
create policy "admins manage sections" on public.page_sections for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
create policy "public leadership" on public.leadership_records for select to anon,authenticated using (status in ('approved','published') or public.aiif_is_admin());
create policy "admins manage leadership" on public.leadership_records for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
create policy "public media" on public.media_items for select to anon,authenticated using (status='published' or public.aiif_is_admin());
create policy "admins manage media" on public.media_items for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
create policy "public initiatives" on public.initiatives for select to anon,authenticated using (status='published' or public.aiif_is_admin());
create policy "admins manage initiatives" on public.initiatives for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
create policy "public partners" on public.partners for select to anon,authenticated using (status='published' or public.aiif_is_admin());
create policy "admins manage partners" on public.partners for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
create policy "public contact" on public.contact_settings for select to anon,authenticated using (status='published' or public.aiif_is_admin());
create policy "admins manage contact" on public.contact_settings for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
create policy "admins manage verification" on public.verification_items for all to authenticated using (public.aiif_is_admin()) with check (public.aiif_is_admin());
insert into storage.buckets (id,name,public) values ('aiif-media','aiif-media',true) on conflict (id) do nothing;
create policy "public AIIF media" on storage.objects for select to anon,authenticated using (bucket_id='aiif-media');
create policy "admins manage AIIF media" on storage.objects for all to authenticated using (bucket_id='aiif-media' and public.aiif_is_admin()) with check (bucket_id='aiif-media' and public.aiif_is_admin());

insert into public.site_pages (slug,title_en,title_ar,seo_title_en,seo_title_ar,seo_description_en,seo_description_ar,status) values
('home','Home','الرئيسية','Arab International Investor Forum','المنتدى العربي الدولي للمستثمرين','Where capital, knowledge and opportunity connect.','حيث تلتقي رؤوس الأموال والمعرفة والفرص.','published'),
('about-us','About Us','من نحن','About AIIF','عن المنتدى العربي الدولي للمستثمرين','Institutional role, initiatives, partners and milestones.','الدور المؤسسي والمبادرات والشركاء والمحطات التاريخية.','draft'),
('board','Board','مجلس الإدارة','AIIF Board','مجلس إدارة المنتدى','Leadership and governance.','القيادة والحوكمة.','draft'),
('media-center','Media Center','المركز الإعلامي','AIIF Media Center','المركز الإعلامي للمنتدى','News, press releases, awards and publications.','الأخبار والبيانات الصحفية والجوائز والمنشورات.','draft'),
('contact-us','Contact Us','اتصل بنا','Contact AIIF','اتصل بالمنتدى','Contact the Arab International Investor Forum.','التواصل مع المنتدى العربي الدولي للمستثمرين.','draft') on conflict (slug) do nothing;
insert into public.leadership_records (full_name_en,position_en,country,active,homepage_visible,display_order,status,verification_note)
select 'H.E. Mohammad Sabbah','CEO','Jordan',true,true,1,'approved','Management Confirmed. Official CEO biography and portrait pending. Do not merge with Natheem Mohammad Sabbah.'
where not exists (select 1 from public.leadership_records where full_name_en='H.E. Mohammad Sabbah' and position_en='CEO');
`;
