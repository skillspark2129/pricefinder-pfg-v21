# Project memory

## Product intent & audience

- PriceFinder PK is a production-ready price comparison PWA for Pakistani shoppers, focused on comparing local store prices, price history, deals, categories, and wishlist items.
- A secure admin panel supports catalog and store management.
- Planned `/download` page should explain app installation, show participating stores, provide a QR code, highlight savings/local-store benefits, and distinguish direct APK availability from PWA installation.
- The app should remain usable as an installable PWA while a direct APK is not yet published.

## Brand personality & voice

- Brand name currently established as “PriceFinder PK”; the requested manifest name is “Price Finder PK - Local Stores,” but the final installed-app naming is unresolved.
- Keep the existing dark visual identity and current color system unchanged unless a specific implementation detail requires clarification.
- Download/install language should be concise, practical, and Pakistan-focused, emphasizing local price comparison and saving money.
- Existing WhatsApp support remains available via the established floating action button and contact channel.

## Visual design & UX direction

- Preserve the existing Home, Categories, Deals, and Wishlist bottom navigation, dark theme, layout, and colors.
- Add a compact green “📲 Get App” header action beside the existing sun and heart controls; it should route to `/download`.
- `/download` should include:
  - “Download Price Finder App” title.
  - A complete local-store list, intended to contain 11 stores, with the exact list still pending confirmation.
  - Primary “📲 Install App (1 Click)” action with browser instructions: menu/three dots → Add to Home Screen → Install.
  - Secondary “⬇️ Download APK (Direct)” action marked Coming Soon until PWABuilder publishing is complete.
  - QR code for the app URL.
  - Benefits covering local Pakistani store comparisons and saving money.
- Add a bottom install prompt reading “Install PFG Local App?” with an Install action driven by `beforeinstallprompt`; avoid showing it when the browser does not expose an install prompt.
- Add footer links for Privacy Policy and Terms, with destinations/content still to be defined.
- Continue using shared components and existing icon conventions; do not duplicate product-grid or navigation markup.

## Decisions, constraints & rationale

- The requested feature is additive: do not redesign existing pages, alter the current dark theme, or change bottom-navigation behavior.
- Existing PWA infrastructure and manifest should be checked before modifying it. Required manifest details include the requested app name, orange theme color, standalone display, root start URL, and existing icon requirements.
- Current memory records orange as `#FF6A00`; the request specifies `#FF6B00` for the manifest. Treat this as a small unresolved color discrepancy rather than changing the broader palette.
- APK download is not available yet; the direct-download control must clearly communicate “Coming Soon” rather than imply a working file.
- Store naming/list content and installed-app branding conflict with previously discussed global-store/app-name directions; confirm before implementation.
- QR generation may require adding a dependency because the current project does not have a QR-code library. Prefer an existing capability or approve a minimal dependency before installing one.
- Preserve the project’s established PWA, routing, import-alias, icon, and build-quality conventions.

## Open questions & assumptions

- Confirm the exact 11 local stores to display; “Dealz.pk” and “Cellular” are examples, not a complete authoritative list.
- Confirm whether the installed/manifest name should be “Price Finder PK - Local Stores,” the existing “PriceFinder PK,” or another previously discussed name.
- Confirm whether `#FF6B00` should replace the recorded `#FF6A00` only in the manifest or everywhere.
- Confirm the public app URL encoded in the QR code.
- Decide whether a QR-code package may be added, or whether QR generation should use an existing/local approach.
- Define the Privacy Policy and Terms routes or external URLs.