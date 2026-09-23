# AIIF — Division 5: CMS completion + QA

Upload and merge this update into the existing Figma Make project. It contains no SQL, migrations, secret keys, or `.env` file.

## Included

- CMS editor for every public page and its published sections
- English and Arabic editorial fields, SEO fields, workflow state, image URL and display order
- JSON settings field for CMS-controlled repeaters (cards, archive entries and calls to action)
- Global Brand, Navigation and Footer settings editor
- Super Admin-only user role screen, restricted to Super Admin and Content Admin
- Launch QA checklist inside the CMS
- Home page reads its editorial content from published CMS records

## Upload these files as a merge

Keep existing files that are not included in this update. Do not upload a database migration to Figma Make. The existing Supabase connection and database schema stay unchanged.

## After merge

1. Open `/cms/pages` and save one small change in a Home section.
2. Confirm the public Home page shows the update in the correct language.
3. Open `/cms/brand` and confirm the header/footer reflect the published settings.
4. Open `/cms/qa` for the final responsive and Arabic/RTL review.
5. Invite future Content Admin users from Supabase Authentication, then assign `content_admin` in `/cms/users` after their first sign-in. Do not add a service-role key to the browser.
