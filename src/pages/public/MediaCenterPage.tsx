import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../../components/SiteHeader';
import { useLocale } from '../../context/LocaleContext';
import { getPublicMedia, getPublicPage } from '../../lib/cms-api';
import { Seo } from '../../components/Seo';

type Kind = 'all'|'news'|'press_release'|'award'|'publication';
const kinds:Kind[]=['all','news','press_release','award','publication'];
const label:Record<Kind,[string,string]>={all:['All','الكل'],news:['News','الأخبار'],press_release:['Press releases','البيانات الصحفية'],award:['Awards','الجوائز'],publication:['Publications','المنشورات']};
const pick=(language:'en'|'ar', en?:string|null, ar?:string|null)=>language==='ar'?(ar||en||''):(en||ar||'');

export default function MediaCenterPage(){const {language,text}=useLocale();const [page,setPage]=useState<any>(null);const [items,setItems]=useState<any[]>([]);const [active,setActive]=useState<Kind>('all');
  useEffect(()=>{void Promise.all([getPublicPage('media-center'),getPublicMedia()]).then(([p,m])=>{setPage(p);setItems(m)})},[]);
  const intro=page?.sections?.find((section:any)=>section.section_key==='intro');
  const shown=useMemo(()=>active==='all'?items:items.filter(item=>item.media_type===active),[active,items]);
  const title=pick(language,intro?.title_en,intro?.title_ar)||text('A record of activity and ideas.','سجلّ للأنشطة والأفكار.');
  const body=pick(language,intro?.body_en,intro?.body_ar)||text('News, announcements, awards and publications are made available here after review.','تُنشر هنا الأخبار والإعلانات والجوائز والمنشورات بعد مراجعتها.');
  const seoTitle=pick(language,page?.page?.seo_title_en,page?.page?.seo_title_ar)||text('AIIF Media Center','المركز الإعلامي للمنتدى'); const seoDescription=pick(language,page?.page?.seo_description_en,page?.page?.seo_description_ar)||body;
  return <main id="main-content"><Seo title={seoTitle} description={seoDescription}/><SiteHeader/><section className="media-hero"><p className="eyebrow">{text('Media Center','المركز الإعلامي')}</p><h1>{title}</h1><p>{body}</p></section>
    <section className="media-workspace"><div className="media-filter" role="group" aria-label={text('Media categories','فئات المركز الإعلامي')}>{kinds.map(kind=><button type="button" aria-pressed={active===kind} className={active===kind?'is-active':''} onClick={()=>setActive(kind)} key={kind}>{label[kind][language==='ar'?1:0]}</button>)}</div>
      {shown.length?<div className="media-grid">{shown.map(item=><article className="media-card" key={item.id}>{item.image_path?<img src={item.image_path} alt={pick(language,item.image_alt_en,item.image_alt_ar)||pick(language,item.title_en,item.title_ar)}/>:<div className="media-card-figure"><span>{label[item.media_type as Kind]?.[language==='ar'?1:0]||text('Media','إعلام')}</span></div>}<div className="media-card-copy"><p className="eyebrow">{label[item.media_type as Kind]?.[language==='ar'?1:0]} {item.published_on?`/ ${item.published_on}`:''}</p><h2>{pick(language,item.title_en,item.title_ar)}</h2><p>{pick(language,item.excerpt_en,item.excerpt_ar)}</p><Link className="underlink" to={`/media-center/item/${item.slug}`}>{text('Read item ↗','اقرأ المادة ↗')}</Link></div></article>)}</div>:<div className="media-empty"><p className="section-no">01 <small>{text('Publishing desk','منصة النشر')}</small></p><h2>{text('The record begins with confirmed information.','يبدأ السجل بمعلومات مؤكدة.')}</h2><p>{text('Published AIIF news, press releases, awards and publications will appear here.','ستظهر هنا أخبار المنتدى وبياناته الصحفية وجوائزه ومنشوراته بعد نشرها.')}</p><Link className="underlink" to="/contact-us">{text('Contact AIIF ↗','تواصل مع المنتدى ↗')}</Link></div>}</section>
    <footer><p>{text('Arab International Investor Forum','المنتدى العربي الدولي للمستثمرين')}</p><Link to="/contact-us">{text('Contact us','تواصل معنا')}</Link></footer></main>}
