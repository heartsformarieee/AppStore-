# Our App Store ♡

A personal static app shelf for the Marie & Elias ecosystem.

## App Store 2.0

The live store is now split into a small presentation layer plus one canonical catalog:

- `index.html` — semantic store shell and dialogs
- `style.css` — original glass/pink visual identity
- `appstore-v2.css` — responsive/accessibility fixes
- `app-registry.js` — canonical app metadata and production links
- `appstore-v2.js` — search, filtering, featured rotation, detail routing and navigation

The old `script.js` remains in the repository as legacy code but is no longer loaded by the live page.

## Current catalog

The registry currently contains 11 apps:

1. Elias ♡
2. OurLittleWorld
3. Elias Phone
4. Sims 4 Build Roulette
5. SideQuest
6. The Archive
7. After Midnight
8. MarieOS
9. Elias Phone 2.0
10. Mori
11. NO SIGNAL

My Chibi Life and My Chibi Club are intentionally not part of this store catalog. Channel Nine is also not part of the active catalog.

## Adding or updating an app

Edit `app-registry.js`. Every app entry should have a unique `id`, title, tagline, icon, version, status, category, repository identifier, stable production URL and description. Prefer stable Vercel project domains such as `https://project-name.vercel.app/` instead of deployment-specific hostnames.

The interface derives the app count, search results, category filter, featured app and detail metadata directly from the registry, so those values do not need to be duplicated in HTML.

## Assets

`Background.JPG` is the store background. `Icon1.JPG` through `Icon11.JPG` are currently assigned to active registry entries. Additional uploaded icon files may remain unused until an app is intentionally added to the registry.

## Privacy

“Private” is the theme and purpose of the collection. The static site itself does not implement authentication or access control.

## Deployment

This is a static HTML/CSS/JS app designed for Vercel. Keep one Vercel project/domain as the canonical public deployment where possible to avoid duplicate deployment histories for the same Git repository.
