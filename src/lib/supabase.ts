import { createClient, type SupabaseClient } from '@supabase/supabase-js';
const url='https://izgonjmvdrosupowpvza.supabase.co';
const key='sb_publishable_0eP7cgvJgXlXIgeHs-GUew_GyrMKGLf';
type AIIFGlobal=typeof globalThis & {__aiif_supabase_client__?:SupabaseClient};
const scope=globalThis as AIIFGlobal;
export const supabase=scope.__aiif_supabase_client__??(()=>{const client=createClient(url,key,{auth:{storageKey:'aiif-auth-token',persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});scope.__aiif_supabase_client__=client;return client})();
export const isSupabaseConfigured=true;