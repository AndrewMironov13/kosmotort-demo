# Design QA — Космоторт

## Comparison target

- Source visual truth:
  - `/var/folders/wc/36sgkdb12h91cth4lk7yhbwm0000gn/T/TemporaryItems/NSIRD_screencaptureui_mR0k8O/Снимок экрана 2026-06-19 в 18.14.52.png`
  - `/var/folders/wc/36sgkdb12h91cth4lk7yhbwm0000gn/T/codex-clipboard-a6e43729-0a5c-4087-890d-b97067162cee.png`
  - остальные предоставленные пользователем скриншоты секций About, Process, Reviews и Contact.
- Implementation:
  - `http://127.0.0.1:5173/`
- Desktop QA viewport:
  - hero: `1440 × 790`
  - catalog and sections: `1440 × 900`
- Mobile QA viewport:
  - `390 × 844`
- State:
  - light theme, default page state; отдельно проверены открытое мобильное меню и раскрытый FAQ.

## Evidence

- Full-view comparison:
  - `qa-comparison-hero.jpg`
  - implementation capture: `qa-implementation-hero.png`
- Focused catalog comparison:
  - `qa-comparison-catalog.jpg`
  - implementation capture: `qa-implementation-catalog.png`
- Additional live browser checks:
  - About image overlap and two-column rhythm.
  - Four-card catalog masonry.
  - Alternating vertical process timeline.
  - Horizontal review-card strip.
  - Dark contact section with three contact cards and map.
  - Mobile hero, catalog, timeline, fixed contact bar, menu and FAQ.

## Findings

No actionable P0, P1 or P2 mismatches remain.

- Fonts and typography: Cormorant Garamond is used for display typography and Onest for body/UI text. Weight, italics, hierarchy and line wrapping closely follow the reference.
- Spacing and layout rhythm: header, two-column hero, overlapping About imagery, asymmetric catalog grid, centered timeline and review strip reproduce the reference structure. Responsive layouts do not overflow horizontally.
- Colors and tokens: warm ivory background, near-black text, muted grey copy and restrained gold accents match the source direction.
- Image quality: all visible cake and location imagery uses real public photographs associated with Космоторт rather than placeholders or CSS drawings. Crops are responsive and remain sharp.
- Copy and content: unsupported claims and fictional reviews from the reference generation were replaced with verified public information while preserving the same visual hierarchy.
- Interaction: navigation, mobile menu, CTA links, review links, FAQ, phone, VK and map are functional.

## Patches made during QA

- Replaced the previous dark-green editorial direction with the supplied light luxury reference.
- Added local Cyrillic Cormorant Garamond font files.
- Reduced desktop hero top spacing and image height to align the first-screen composition with the reference.
- Restored the reference-style logo, pill label, dual CTAs, image quote card and three metrics.
- Rebuilt About, catalog, timeline, reviews and contact layouts to match the supplied screenshots.
- Kept real photos, verified ratings, real contacts and qualified pricing language.
- Verified mobile layout at 390 px with no horizontal overflow.

## Follow-up polish

- [P3] The original mock contains extremely subtle decorative dust/noise. It is intentionally omitted to keep the page lighter and avoid introducing a synthetic texture asset.
- [P3] Exact image subjects differ from the mock because the implementation intentionally uses real Космоторт photography.

final result: passed
