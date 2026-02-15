# Fresh Redesign: AI Educational Website

## Plan
Completely rewrite `index.html` with a new visual identity — different palette, typography, layout, and image approach from the original purple/SVG design.

## Todo

- [x] Read existing `index.html` to understand current structure
- [x] Rewrite with new brand ("Nexus AI"), dark+warm palette, Inter font
- [x] Nav — minimal, transparent over dark hero, logo + 3 links + CTA button
- [x] Hero — full-width dark section, side-by-side layout (text left, image right)
- [x] Stats bar — "50K+ Students", "120+ Lessons", "4.9 Rating"
- [x] Features — 3 white cards on light gray background with icons
- [x] Courses — 3 cards with placehold.co image thumbnails + difficulty badges
- [x] Testimonial — large quote with avatar placeholder, name, role
- [x] CTA — gradient banner with headline + button
- [x] Footer — simple, minimal links
- [x] Responsive breakpoints (900px and 640px)
- [x] Replace all inline SVGs with `<img>` tags using placehold.co URLs
- [x] CSS hover transitions on cards and buttons
- [x] Open in browser and verify

## Review

All items completed. Key changes from the original design:

- **Brand**: "Luminar AI" → "Nexus AI" with lowercase logo style
- **Palette**: Purple (`#6d28d9`) → dark hero (`#0f0f1a`) + warm off-white body (`#f8f7f4`) + coral accent (`#e8573a`)
- **Typography**: System fonts → Inter (Google Fonts), larger sizes, tighter tracking
- **Layout**: Centered hero → asymmetric side-by-side hero; added stats bar; testimonial with side-by-side avatar
- **Images**: Inline SVG illustrations → `<img>` tags with placehold.co placeholder URLs
- **Interactions**: Subtle CSS hover transitions, no JavaScript
- **Responsive**: Two breakpoints at 900px (single column) and 640px (nav hidden, reduced padding)

---

## Performance Optimizations

- [x] Add `loading="lazy"` to 4 below-fold images (3 course thumbnails + testimonial avatar)
- [x] Add `width` and `height` attributes to all 5 images to prevent CLS
- [x] Add `fetchpriority="high"` to hero image (LCP element)

### Review

All performance changes applied to `index.html`:

- **Hero image** (line 326): Added `width="600" height="440"` and `fetchpriority="high"`. No lazy loading since it's above the fold.
- **3 course images** (lines 389, 404, 419): Added `width="480" height="270"` and `loading="lazy"`.
- **Testimonial avatar** (line 440): Added `width="120" height="120"` and `loading="lazy"`.
- **Security**: No tokens or sensitive data introduced. No new vulnerabilities — changes are purely declarative HTML attributes.
