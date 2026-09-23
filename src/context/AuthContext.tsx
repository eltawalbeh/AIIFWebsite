import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { AdminRole } from '../types/site';

type Profile={id:string;email:string;role:AdminRole};
type AuthState={session:Session|null;profile:Profile|null;loading:boolean;signOut:()=>Promise<void>};
const AuthContext=createContext<AuthState|null>(null);
export function AuthProvider({children}:{children:ReactNode}){const [session,setSession]=useState<Session|null>(null),[profile,setProfile]=useState<Profile|null>(null),[loading,setLoading]=useState(Boolean(supabase));
useEffect(()=>{const client=supabase;if(!client){setLoading(false);return}let alive=true;const load=async(next:Session|null)=>{if(!alive)return;setSession(next);if(!next){setProfile(null);setLoading(false);return}const {data}=await client.from('profiles').select('id,email,role').eq('id',next.user.id).maybeSingle();if(alive){setProfile(data as Profile|null);setLoading(false)}};client.auth.getSession().then(({data})=>load(data.session));const {data:{subscription}}=client.auth.onAuthStateChange((_event,next)=>{void load(next)});return()=>{alive=false;subscription.unsubscribe()}},[]);
return <AuthContext.Provider value={{session,profile,loading,signOut:async()=>{if(supabase)await supabase.auth.signOut()}}}>{children}</AuthContext.Provider>}
export const useAuth=()=>{const value=useContext(AuthContext);if(!value)throw new Error('AuthProvider missing');return value};
export function RequireAdmin({children}:{children:ReactNode}){const {loading,session,profile}=useAuth();const location=useLocation();if(!isSupabaseConfigured)return <>{children}</>;if(loading)return <main className="login"><p>Loading secure dashboard…</p></main>;if(!session)return <Navigate to="/cms/login" replace state={{from:location.pathname}}/>;if(!profile)return <main className="login"><section><p className="eyebrow">AIIF / PRIVATE</p><h1>Access pending</h1><p>Your account has signed in, but a Super Admin has not assigned an AIIF role.</p></section></main>;return <>{children}</>}
