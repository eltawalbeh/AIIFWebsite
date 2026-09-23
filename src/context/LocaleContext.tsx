import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Language } from '../types/site';

type LocaleState={language:Language; toggle:()=>void; text:(en:string,ar:string)=>string};
const LocaleContext=createContext<LocaleState|null>(null);
export function LocaleProvider({children}:{children:ReactNode}){const [language,setLanguage]=useState<Language>(()=>(localStorage.getItem('aiif-language') as Language)||'en'); useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';localStorage.setItem('aiif-language',language)},[language]);return <LocaleContext.Provider value={{language,toggle:()=>setLanguage(x=>x==='en'?'ar':'en'),text:(en,ar)=>language==='ar'?ar:en}}>{children}</LocaleContext.Provider>}
export const useLocale=()=>{const value=useContext(LocaleContext);if(!value)throw new Error('LocaleProvider missing');return value};
