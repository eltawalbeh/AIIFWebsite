import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LeadershipRecord, VerificationItem, Workflow } from '../types/cms';
import { supabase } from '../lib/supabase';

const verificationSeed: VerificationItem[] = [
  ['Official AIIF logo files','OLD PNG logo only','OLD website logo asset','2020','Unknown','Needs Verification','Upload approved master, light, dark, compact and favicon files.'],
  ['Exact brand colors','#BD932F sampled from OLD logo','OLD logo pixel sample','2026','Unknown','Needs Verification','Sampled digital colour is not an official specification.'],
  ['Official Arabic organization name','','','', 'Current','Missing','Confirm approved Arabic legal/institutional name.'],
  ['Current board members','','','', 'Current','Missing','Provide names, roles, countries, bios, photos and approval status.'],
  ['Current chairman','','','', 'Current','Missing','Confirm name, title, Arabic name, biography and portrait.'],
  ['H.E. Mohammad Sabbah official Arabic name','','','', 'Current','Missing','Do not infer Arabic spelling.'],
  ['H.E. Mohammad Sabbah official biography','','','', 'Current','Missing','Do not borrow content from Natheem Mohammad Sabbah.'],
  ['H.E. Mohammad Sabbah official portrait','','','', 'Current','Missing','Use neutral placeholder until an approved portrait is supplied.'],
  ['Office address','','OLD contact page','Unknown','Current','Missing','Confirm monitored office address before public display.'],
  ['Phone','','OLD contact page','Unknown','Current','Missing','Confirm official public number.'],
  ['Official email','','OLD contact page','Unknown','Current','Missing','Confirm monitored public email.'],
  ['Official social channels','','OLD footer','Unknown','Current','Missing','Confirm active official LinkedIn, X, Instagram and YouTube URLs.'],
  ['Active initiatives','','OLD archive pages','Unknown','Current','Needs Verification','Confirm which initiatives are active, historical or retired.'],
  ['Arab Investor Award current status','Historical record on OLD','OLD award page','Unknown','Historical','Historical / Archived','Confirm whether any current award cycle exists.'],
  ['SHUAA current status','Historical record on OLD','OLD SHUAA page','Unknown','Historical','Historical / Archived','Confirm whether the network remains active.'],
  ['Investor Market current status','Mentioned in OLD material','OLD website','Unknown','Unknown','Needs Verification','Confirm current status, owner and public URL.'],
  ['Current forum status','Historical forum record on OLD','OLD archive','2019','Historical','Needs Verification','Confirm planned/current forum activity before publishing.'],
  ['Current strategic partners','','OLD partner references','Unknown','Current','Missing','Confirm current partnerships, scope, dates and logo permissions.'],
  ['Historical partners vs current partners','Mixed OLD references','OLD website','Unknown','Historical','Needs Verification','Separate historical relationships from current ones.'],
  ['1,200+ participant figure','Historical claim on OLD','OLD website','Unknown','Historical','Needs Verification','Do not display until scope/date/source are confirmed.'],
  ['60 countries figure','Historical claim on OLD','OLD website','Unknown','Historical','Needs Verification','Do not display until scope/date/source are confirmed.'],
  ['Number of forum editions','','OLD website','Unknown','Historical','Missing','Confirm dates and numbering from authoritative records.'],
  ['Current geographic reach','','','', 'Current','Missing','Confirm countries/regions served and the measurement period.'],
  ['UNESCO historical claims','2019 archive references UNESCO Headquarters','OLD archive image','2019','Historical','Historical / Archived','This does not establish a current UNESCO partnership.'],
  ['Current statistics displayed publicly','','','', 'Current','Missing','No current metric may display without a source, date and approval.']
].map(([item,value,source,sourceDate,lifecycle,status,note], index) => ({ id:`v-${index+1}`, item, value, source, sourceDate, lifecycle:lifecycle as any, status:status as any, note }));

const leadershipSeed: LeadershipRecord[] = [{ id:'mohammad-sabbah', fullNameEN:'H.E. Mohammad Sabbah', fullNameAR:'', honorific:'H.E.', positionEN:'CEO', positionAR:'', country:'Jordan', order:1, homepageVisible:true, lifecycle:'Current', workflow:'Approved', verification:'Management Confirmed', note:'Official CEO biography and portrait pending. Separate person from Natheem Mohammad Sabbah, his father.', leadershipRole:'ceo' }];
type SiteSettings = Record<string, Record<string, any>>;
type Cms = { leadership:LeadershipRecord[]; verification:VerificationItem[]; setWorkflow:(id:string, workflow:Workflow)=>void; publicLeaders:LeadershipRecord[]; settings:SiteSettings };
const CmsContext = createContext<Cms | null>(null);
const toWorkflow=(status:string):Workflow=>({draft:'Draft',needs_verification:'Needs Verification',approved:'Approved',published:'Published',archived:'Archived'}[status]||'Draft') as Workflow;
const toStatus=(workflow:Workflow)=>({Draft:'draft','Needs Verification':'needs_verification',Approved:'approved',Published:'published',Archived:'archived'}[workflow]);
export function CmsProvider({children}:{children:ReactNode}) { const [leadership,setLeadership] = useState(leadershipSeed);
  const [settings,setSettings] = useState<SiteSettings>({});
  useEffect(()=>{if(!supabase)return;void supabase.from('leadership_records').select('*').order('display_order').then(({data})=>{if(!data)return;setLeadership(data.map((row:any)=>({id:row.id,fullNameEN:row.full_name_en,fullNameAR:row.full_name_ar,honorific:row.honorific,positionEN:row.position_en,positionAR:row.position_ar,country:row.country,photo:row.photo_path,shortBioEN:row.short_bio_en,shortBioAR:row.short_bio_ar,fullBioEN:row.full_bio_en,fullBioAR:row.full_bio_ar,linkedin:row.linkedin_url,order:row.display_order,homepageVisible:row.homepage_visible,lifecycle:row.active?'Current':'Historical',workflow:toWorkflow(row.status),verification:row.verification_note,note:row.verification_note,leadershipRole:row.leadership_role||'board_member'})))})},[]);
  useEffect(()=>{void supabase.from('site_settings').select('*').then(({data})=>{if(!data)return;setSettings(Object.fromEntries(data.map((row:any)=>[row.key,row.value||{}])))})},[]);
  const publicLeaders = useMemo(()=>leadership.filter(x=>x.homepageVisible && (x.workflow==='Approved'||x.workflow==='Published')), [leadership]);
  const setWorkflow=(id:string,workflow:Workflow)=>{setLeadership(x=>x.map(r=>r.id===id?{...r,workflow}:r));if(supabase)void supabase.from('leadership_records').update({status:toStatus(workflow)}).eq('id',id)};
  return <CmsContext.Provider value={{leadership, verification:verificationSeed, publicLeaders, setWorkflow, settings}}>{children}</CmsContext.Provider> }
export const useCms = ()=>{ const x=useContext(CmsContext); if(!x) throw new Error('CmsProvider missing'); return x; };
