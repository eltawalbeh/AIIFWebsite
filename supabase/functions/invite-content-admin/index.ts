import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
const secretKey = () => Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default;

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const url = Deno.env.get('SUPABASE_URL') || '';
    const publishableKey = Deno.env.get('SUPABASE_ANON_KEY') || JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}').default || '';
    const authorization = request.headers.get('Authorization') || '';
    const caller = createClient(url, publishableKey, { global: { headers: { Authorization: authorization } } });
    const token = authorization.replace('Bearer ', '');
    const { data: userData, error: userError } = await caller.auth.getUser(token);
    if (userError || !userData.user) return json({ error: 'Sign in again and retry.' }, 401);
    const admin = createClient(url, secretKey());
    const { data: profile } = await admin.from('profiles').select('role').eq('id', userData.user.id).single();
    if (profile?.role !== 'super_admin') return json({ error: 'Only a Super Admin can invite users.' }, 403);
    const body = await request.json(); const email = String(body.email || '').trim().toLowerCase(); const fullName = String(body.fullName || '').trim();
    if (!email || !email.includes('@')) return json({ error: 'Enter a valid email address.' }, 400);
    const { data, error } = await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName } });
    if (error) return json({ error: error.message }, 400);
    if (data.user) await admin.from('profiles').upsert({ id: data.user.id, email, full_name: fullName || null, role: 'content_admin' }, { onConflict: 'id' });
    return json({ message: `Invitation sent to ${email}.` });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Invitation failed.' }, 500); }
});
