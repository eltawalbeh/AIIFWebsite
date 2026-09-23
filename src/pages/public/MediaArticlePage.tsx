import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SiteFooter } from '../../components/SiteFooter';
import { SiteHeader } from '../../components/SiteHeader';
import { Seo } from '../../components/Seo';
import { useLocale } from '../../context/LocaleContext';
import { getPublicMedia } from '../../lib/cms-api';

const pick = (language: 'en'|'ar', en?: string | null, ar?: string | null) => language === 'ar' ? (ar || en || '') : (en || ar || '');
const labels: Record<string, [string, string]> = { news:['News','الأخبار'], press_release:['Press release','بيان صحفي'], award:['Award','جائزة'], publication:['Publication','منشور'] };

export default function MediaArticlePage() {
  const { slug = '' } = useParams(); const { language, text } = useLocale(); const [item, setItem] = useState<any | null | undefined>(undefined);
  useEffect(() => { void getPublicMedia().then(rows => setItem(rows.find((row: any) => row.slug === slug) || null)); }, [slug]);
  if (item === undefined) return <main id="main-content"><SiteHeader/><section className="page-loading" aria-label="Loading"/></main>;
  if (!item) return <main id="main-content"><SiteHeader/><section className="empty-state"><h1>{text('This item is unavailable.','هذه المادة غير متاحة.')}</h1><Link className="underlink" to="/media-center">{text('Back to Media Center','العودة إلى المركز الإعلامي')}</Link></section><SiteFooter/></main>;
  const title = pick(language, item.title_en, item.title_ar); const excerpt = pick(language, item.excerpt_en, item.excerpt_ar); const article = pick(language, item.article_en, item.article_ar) || excerpt; const imageAlt = pick(language, item.image_alt_en, item.image_alt_ar) || title;
  return <main id="main-content"><Seo title={title} description={excerpt || title} type="article" image={item.image_path || undefined} publishedAt={item.published_on || null}/><SiteHeader/><article className="article-page"><p className="eyebrow">{labels[item.media_type]?.[language === 'ar' ? 1 : 0]} {item.published_on ? `/ ${item.published_on}` : ''}</p><h1>{title}</h1><p className="article-lead">{excerpt}</p>{item.image_path && <figure><img src={item.image_path} alt={imageAlt}/>{pick(language,item.image_caption_en,item.image_caption_ar) && <figcaption>{pick(language,item.image_caption_en,item.image_caption_ar)}</figcaption>}</figure>}<div className="article-body">{article.split(/\n{2,}/).map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}</div><div className="article-actions"><Link to="/media-center">{text('Back to Media Center','العودة إلى المركز الإعلامي')}</Link>{item.external_url && <a href={item.external_url} target="_blank" rel="noreferrer">{text('View original official source ↗','عرض المصدر الرسمي الأصلي ↗')}</a>}</div></article><SiteFooter/></main>;
}
