import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import { LeadershipCard } from '../../components/LeadershipCard';
import { useCms } from '../../context/CmsContext';
import { useLocale } from '../../context/LocaleContext';
import { getPublicPage } from '../../lib/cms-api';
import { Seo } from '../../components/Seo';

type Section = { id: string; section_key: string; title_en: string; title_ar: string; body_en: string; body_ar: string; settings?: Record<string, any> };
const pick = (language: 'en' | 'ar', english?: string, arabic?: string) => language === 'ar' ? arabic || english || '' : english || arabic || '';

export default function HomePage() {
  const { publicLeaders } = useCms(); const { language, text } = useLocale();
  const [sections, setSections] = useState<Section[] | null>(null); const [pageMeta, setPageMeta] = useState<any>(null);
  useEffect(() => { void getPublicPage('home').then(page => { setSections(page?.sections || []); setPageMeta(page?.page || null); }); }, []);
  const byKey = useMemo(() => Object.fromEntries((sections || []).map(section => [section.section_key, section])), [sections]);
  const section = (key: string) => byKey[key] as Section | undefined;
  const value = (item: Section | undefined, field: 'title' | 'body' = 'title') => pick(language, item?.[`${field}_en` as keyof Section] as string, item?.[`${field}_ar` as keyof Section] as string);
  const setting = (item: Section | undefined, key: string) => pick(language, item?.settings?.[`${key}_en`], item?.settings?.[`${key}_ar`]);
  const items = (item: Section | undefined) => Array.isArray(item?.settings?.items) ? item!.settings.items : [];
  if (!sections) return <main><SiteHeader/><section className="page-loading" aria-label="Loading"/></main>;
  const hero = section('hero'), about = section('about'), perspective = section('perspective'), focus = section('focus'), archive = section('archive'), approach = section('approach'), leadership = section('leadership'), closing = section('closing');
  const seoTitle = pick(language, pageMeta?.seo_title_en, pageMeta?.seo_title_ar) || text('Arab International Investor Forum', 'المنتدى العربي الدولي للمستثمرين');
  const seoDescription = pick(language, pageMeta?.seo_description_en, pageMeta?.seo_description_ar) || value(hero, 'body');
  return <main id="main-content"><Seo title={seoTitle} description={seoDescription}/><SiteHeader/>
    <section className="hero"><p className="eyebrow">{setting(hero, 'eyebrow')}</p><h1>{value(hero)}</h1><div className="hero-bottom"><b>↙</b><p>{value(hero, 'body')}</p><a href={hero?.settings?.cta_target || '#about'}>{setting(hero, 'cta') || text('Explore AIIF ↓', 'اكتشف المنتدى ↓')}</a></div><div className="motif"/></section>
    <figure className="hero-archive"><span>{text('AIIF / INSTITUTIONAL ARCHIVE', 'AIIF / الأرشيف المؤسسي')}</span><img src="/aiif-archive.jpg" alt="AIIF institutional archive"/><figcaption><b>{text('THE AIIF ARCHIVE / 2019', 'أرشيف AIIF / 2019')}</b><b>{text('Investment dialogue', 'حوار الاستثمار')}</b></figcaption></figure>
    <section id="about" className="editorial split"><p className="section-no">01 <small>{setting(about, 'eyebrow')}</small></p><div><h2>{value(about)}</h2><p className="lead">{value(about, 'body')}</p><a className="underlink" href={about?.settings?.cta_target || '#focus'}>{setting(about, 'cta')}</a></div></section>
    <section className="dark-panel"><p className="eyebrow">{setting(perspective, 'eyebrow')}</p><h2>{value(perspective)}</h2><p>{value(perspective, 'body')}</p></section>
    <section id="focus" className="focus-section"><p className="section-no">02 <small>{setting(focus, 'eyebrow')}</small></p><h2>{value(focus)}</h2><div className="focus-grid">{items(focus).map((item: any, index: number) => <article key={item.title_en || index}><span>0{index + 1}</span><h3>{pick(language, item.title_en, item.title_ar)}</h3><p>{pick(language, item.body_en, item.body_ar)}</p></article>)}</div></section>
    <section className="archive-listing"><p className="section-no">03 <small>{setting(archive, 'eyebrow')}</small></p><h2>{value(archive)}</h2><p className="lead">{value(archive, 'body')}</p><div>{items(archive).map((item: any, index: number) => <button key={item.title_en || index}><span>0{index + 1}</span><small>{pick(language, item.meta_en, item.meta_ar)}</small><strong>{pick(language, item.title_en, item.title_ar)}</strong><i>{text('View details ↗', 'عرض التفاصيل ↗')}</i></button>)}</div></section>
    <section className="approach editorial split"><p className="section-no">04 <small>{setting(approach, 'eyebrow')}</small></p><div><h2>{value(approach)}</h2>{items(approach).map((item: any, index: number) => <div className="approach-row" key={item.title_en || index}><span>0{index + 1}</span><h3>{pick(language, item.title_en, item.title_ar)}</h3><p>{pick(language, item.body_en, item.body_ar)}</p></div>)}</div></section>
    <section className="leadership"><p className="section-no">05 <small>{setting(leadership, 'eyebrow')}</small></p><h2>{value(leadership)}</h2><div className="leader-grid">{publicLeaders.map(person => <LeadershipCard leader={person} key={person.id}/>)}</div></section>
    <section className="closing"><p className="section-no">06 <small>{setting(closing, 'eyebrow')}</small></p><h2>{value(closing)}</h2><p>{value(closing, 'body')}</p><Link className="underlink" to={closing?.settings?.cta_target || '/contact-us'}>{setting(closing, 'cta')}</Link></section>
    <SiteFooter/>
  </main>;
}
