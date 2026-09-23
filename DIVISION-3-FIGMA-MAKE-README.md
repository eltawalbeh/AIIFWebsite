# AIIF — Division 3 update

Merge this update into the existing Figma Make project. Keep all files that
are not included in this package, especially `supabase/functions/server/` and
`utils/supabase/`.

## Included

- Dedicated About Us page
- Dedicated Board page, grouped Chairman → CEO → Board Members
- Leadership CMS screen with Add record form and role selection
- Arabic-ready public leadership cards
- Division 3 responsive styling and route updates

## Database already prepared

The AIIF Supabase project already has the required `leadership_role` column,
published About/Board CMS content, and the public read policies. Do not run a
second database initialization.

## Editorial rule

Only leadership records marked Approved or Published are allowed on the public
Board page. Do not add biography or portrait details for H.E. Mohammad Sabbah
until management supplies them.
