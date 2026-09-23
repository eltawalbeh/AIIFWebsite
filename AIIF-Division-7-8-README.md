# AIIF - Division 7 + 8 implementation

This is an incremental update for the existing Figma Make AIIF project.

## Included

- CMS-driven page titles and search descriptions for the public pages.
- Canonical URL, Open Graph/Twitter tags and JSON-LD for Organization, WebSite, WebPage and published Media articles.
- A public Media article route: `/media-center/item/:slug`.
- A clear “Original official source link” field in the Media CMS, using the existing external-link field; no database migration is required.
- `robots.txt` and `sitemap.xml` for the current `aiif.figma.site` domain.
- Navigation active state, a keyboard skip-to-content link, selected state for Media filters and multilingual image alternatives.
- Contact page handling that hides empty fields instead of rendering empty channels.

## Important

- Keep all existing files that are not part of this update.
- No SQL file is included. This uses the existing Supabase schema and existing `media_items.external_url` field.
- `sitemap.xml` and `robots.txt` currently use `https://aiif.figma.site`. If a custom production domain is connected later, replace that domain in both files.
- The CMS source-link field is for an official AIIF page, approved partner announcement or approved PDF only. It is not a replacement for management approval.
- SEO descriptions, titles and all public text remain controlled from the CMS.

## Smoke test after upload

1. Open Home, About, Board, Media Center and Contact Us in both English and Arabic.
2. Confirm the current menu item is visibly highlighted and that pressing Tab reveals “Skip to main content”.
3. Publish one Media item with title, summary, article, publication date, image alt text and original official source link.
4. Open its “Read item” link, then confirm the article and source link work.
5. View page source or browser inspector: title, description, canonical and JSON-LD should be page-specific.
