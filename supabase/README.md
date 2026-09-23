# AIIF Supabase connection

1. Create a new dedicated Supabase project named `AIIF CMS`; do not use the unrelated existing project.
2. In Supabase SQL Editor, copy the `AIIF_SUPABASE_SQL` string from `aiif-database-setup.ts` and run it. It contains the schema and the safe starter records. This TypeScript wrapper exists because Figma Make rejects `.sql` uploads.
3. Enable email/password Auth and turn off public sign-ups.
4. Invite the first Super Admin in **Authentication > Users**, then insert their UUID into `profiles` using the final commented SQL statement in the migration.
5. Invite Content Admin users only after the Super Admin is in place; insert their profile with `content_admin`.
6. Copy the project URL and publishable key into `.env` from `.env.example`. Never put a secret or service-role key in this Vite project.

The public site reads only `published` content. Leadership requires an `approved` or `published` status to appear publicly. The CMS also supports Draft, Needs Verification and Archived records.
