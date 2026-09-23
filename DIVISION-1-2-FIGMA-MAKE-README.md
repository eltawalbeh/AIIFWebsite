# AIIF — Division 1 + 2 update

This is an incremental update for the existing Figma Make project. Merge these
files into the project; do not remove any existing project files.

## Included

- Shared CMS-fed header, mobile navigation, language switch and footer
- A CMS-fed Home page that reads published `home` page sections from Supabase
- Global CMS settings for brand, navigation and footer copy
- RTL direction support and mobile compositions
- Public Supabase browser client configuration only

## Important

- Keep the project's existing `supabase/functions/server/` and
  `utils/supabase/` folders unchanged.
- Do not add a `.env` file, secret key, service-role key or direct database
  connection string to Figma Make.
- The AIIF database is already initialized. Do not rerun the old database
  setup file in the project.
- The Home page intentionally has no hard-coded editorial fallback. It displays
  the public Home only after the CMS returns published records.

## Figma Make prompt after upload

“Merge this Division 1 + 2 update into the current project. Keep all existing
files that are not included in the upload, especially Supabase server files.
Do not replace the existing Supabase connection with secrets.”
