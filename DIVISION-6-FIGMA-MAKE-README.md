# AIIF — Division 6: CMS usability and access control

Merge this update into the existing Figma Make project.

## What changed

- The CMS no longer exposes JSON fields.
- “Website pages” is now “Website content”: choose a page, then edit its visible blocks such as Hero, About, Focus and Closing.
- Global settings use normal Brand, Navigation and Footer fields.
- Media Center and Board & Leadership now provide image drag-and-drop upload, preview, allowed formats, size limit and image dimensions.
- Media includes image descriptions and captions in English and Arabic.
- Every leadership entry, including CEO, can be edited. CEO is a role and is never hard-coded to a person.
- User access is safe: the primary Super Admin is protected, role selectors were removed, and new users are invited only as Content Admin.

## Important

- Upload the `supabase/functions/invite-content-admin/index.ts` file with the rest of the package. It is the secure server-side invitation endpoint; it uses the Supabase function environment secrets and does not put any secret key in the browser.
- Once the function is deployed through the connected Supabase project, the “Invite Content Admin” button will send invitation emails directly from the CMS.
- Database changes required for image descriptions and the primary Super Admin protection have already been applied to the connected AIIF Supabase project. Do not upload SQL or migrations to Figma Make.

## Immediate step for the primary account

The primary account `eltawalbeh@gmail.com` has been restored to Super Admin in the database. Sign out and sign back in once after the merge so the active browser session refreshes its role.
