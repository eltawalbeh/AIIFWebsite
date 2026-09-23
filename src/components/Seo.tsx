import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type SeoProps = {
  title: string;
  description: string;
  type?: 'website' | 'article' | 'profile';
  image?: string;
  publishedAt?: string | null;
};

const organizationName = 'Arab International Investor Forum';

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(property ? 'property' : 'name', name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function Seo({ title, description, type = 'website', image, publishedAt }: SeoProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const origin = window.location.origin;
    const canonical = `${origin}${pathname}`;
    const fullTitle = title.includes('AIIF') ? title : `${title} | AIIF`;
    document.title = fullTitle;
    document.documentElement.dataset.seoReady = 'true';
    setMeta('description', description);
    setMeta('robots', 'index,follow,max-image-preview:large');
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', type === 'article' ? 'article' : 'website', true);
    setMeta('og:url', canonical, true);
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    if (image) {
      setMeta('og:image', image, true);
      setMeta('twitter:image', image);
    }
    if (publishedAt) setMeta('article:published_time', publishedAt, true);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = canonical;

    const id = 'aiif-structured-data';
    document.getElementById(id)?.remove();
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${origin}/#organization`, name: organizationName, url: origin },
        { '@type': 'WebSite', '@id': `${origin}/#website`, name: organizationName, url: origin, publisher: { '@id': `${origin}/#organization` } },
        type === 'article'
          ? { '@type': 'NewsArticle', headline: title, description, mainEntityOfPage: canonical, datePublished: publishedAt || undefined, publisher: { '@id': `${origin}/#organization` }, image: image || undefined }
          : { '@type': 'WebPage', name: title, description, url: canonical, isPartOf: { '@id': `${origin}/#website` } },
      ],
    });
    document.head.appendChild(script);
    return () => script.remove();
  }, [description, image, pathname, publishedAt, title, type]);

  return null;
}
