# Project Atlas — DESIGN.md

> UI/UX and visual source of truth for Project Atlas.
> Status: V1 greenfield design direction.
> Core visual idea: a quiet digital atlas / personal museum built around authentic photography and memories.

## 1. Design Vision

Project Atlas should feel like opening a **personal world atlas that happens to contain memories**.

The experience should combine:

```text
World exploration
+
Personal archive
+
Photography
+
Museum-like curation
```

The interface should feel timeless enough that the project still looks appropriate years later.

## 2. Emotional Direction

Intended qualities:
- wonder;
- calm;
- curiosity;
- nostalgia;
- discovery;
- personal ownership.

Avoid:
- aggressive tourism marketing;
- gamified travel challenges;
- loud social-media aesthetics;
- cartoon-heavy visuals;
- excessive gradients;
- “AI travel app” appearance.

## 3. Image Policy — IMPORTANT

Real images are a core part of Project Atlas.

### Use real imagery

Preferred:
- real landscapes;
- real architecture;
- real streets;
- real natural environments;
- real cultural places;
- real museums/monuments;
- real travel photographs;
- authentic personal photos when available.

### Use sparingly

The goal is **not** to put an image in every section.

Use a visual hierarchy:

```text
Primary image
→ supporting images
→ interface/data
```

rather than:

```text
image
image
image
image
image
```

### Image selection criteria

Every image should pass:

```text
Relevant to place/context?
Authentic-looking?
Good composition?
Appropriate crop?
Adds meaning?
Licensing/source documented?
```

If the answer is no, do not use it.

## 4. Landing Page

Landing page is a first-class V1 screen.

### Objective

Within a few seconds, the user should understand:

> This is a personal atlas for places, journeys, and memories.

### Recommended structure

```text
┌───────────────────────────────────────────────┐
│ NAVIGATION                                    │
├───────────────────────────────────────────────┤
│                                               │
│ HERO                                          │
│ Large real-world photograph                  │
│ Short personal statement                      │
│ Primary CTA → Explore the Atlas               │
│                                               │
├───────────────────────────────────────────────┤
│ ATLAS INTRO                                   │
│ Short explanation of the archive              │
│                                               │
├───────────────────────────────────────────────┤
│ VISUAL WORLD / DISCOVERY                     │
│ Map / world representation + restrained      │
│ supporting real imagery                       │
│                                               │
├───────────────────────────────────────────────┤
│ FEATURED MEMORIES                             │
│ Selected places + real photos                │
│                                               │
├───────────────────────────────────────────────┤
│ PERSONAL MUSEUM IDEA                          │
│ Why memories/souvenirs are archived           │
│                                               │
├───────────────────────────────────────────────┤
│ FINAL CTA                                     │
│ Enter the Atlas                               │
└───────────────────────────────────────────────┘
```

The actual implementation may adjust section order based on usability testing.

## 5. Hero Direction

The hero should use **one strong authentic travel image**.

Good characteristics:
- cinematic but believable;
- real place;
- generous negative space;
- strong depth;
- not overly saturated;
- not generic corporate travel stock.

Possible visual contexts:
- landscape;
- coastline;
- mountain;
- historic street;
- architectural panorama;
- quiet natural scene.

Avoid:
- collage of many countries;
- random airplane/window stock photo;
- group of people smiling at camera unless the story specifically requires it;
- excessive overlays.

### Hero content

Recommended:

```text
Project Atlas
A personal map of places, memories, and moments.
[Explore the Atlas]
```

The copy should remain personal rather than sounding like tourism advertising.

## 6. Navigation

Keep navigation minimal.

Potential items:

```text
Home
Atlas
Memories
Countries
Souvenirs
About
```

Do not expose future modules that do not exist.

The current active location must be obvious.

## 7. Atlas / World View

The Atlas view is the product's central exploration screen.

Possible presentation:
- interactive world map;
- country grid;
- country cards;
- map + detail panel.

Preferred direction:

```text
World view
→ select country
→ inspect documented places
→ open memories
```

Do not make map interaction mandatory for every task. Provide alternative navigation/search.

## 8. Country Page

A country detail page should show:
- country name;
- broad visual;
- status;
- documented places;
- memories;
- media;
- notes;
- related souvenirs.

The country's visual identity should come from an authentic image rather than a generic flag-heavy layout.

Flags may be used as secondary identifiers but should not dominate the page.

## 9. Memory Page

The memory page should feel like an archival object.

Recommended hierarchy:

```text
Place / date
→ title
→ main photograph
→ short memory
→ supporting photos/media
→ notes
→ souvenirs
→ related places
```

The main photograph should be visually important without becoming a full-screen distraction on every device.

## 10. Personal Museum

The museum concept is a differentiator.

Possible future section:

```text
Memories
Souvenirs
Photo stories
Collections
Milestones
```

The design should emphasize curation and context.

Avoid turning it into an inventory dashboard.

## 11. Cards

Cards should represent meaningful entities:
- country;
- place;
- memory;
- souvenir.

Do not create cards for every line of text.

A card should communicate:
- identity;
- context;
- image when useful;
- one clear action.

## 12. Typography

Typography should feel editorial and modern.

Use:
- a refined display face for major headings if appropriate;
- highly readable body type;
- restrained metadata;
- monospace only for technical/internal data.

Do not overuse decorative typefaces.

## 13. Color Direction

Prefer a natural, museum/editorial palette:

```text
Deep neutral base
Warm light surfaces
Natural earth/stone accents
Muted greens/blues where contextually appropriate
```

Do not lock the product to one country's colors.

Color should support photography rather than compete with it.

## 14. Spacing and Composition

Use generous spacing around:
- hero;
- section transitions;
- major photographs;
- archival content.

Do not make every section dense.

Project Atlas should have breathing room.

## 15. Image Cropping

The same photograph should not always be cropped identically.

Use:
- wide crop for hero;
- landscape crop for place cards;
- portrait crop where people/artifacts require it;
- gallery ratio suitable for the original media.

Never crop away the meaningful subject simply to force a fixed ratio.

## 16. Responsive Behavior

### Desktop

Use:
- large imagery;
- split map/detail layouts;
- multi-column galleries;
- editorial whitespace.

### Tablet

Use:
- reduced columns;
- stacked map/detail sections;
- shorter hero.

### Mobile

Prioritize:
- image + title;
- country/place selection;
- memory reading;
- primary actions.

Avoid:
- oversized hero occupying the entire first screen;
- horizontal scrolling galleries unless intentionally implemented;
- tiny map controls.

## 17. Animation

Animation should feel like subtle movement through an atlas.

Good:
- gentle image transitions;
- map focus;
- page transitions;
- gallery opening.

Avoid:
- constant parallax;
- excessive zoom;
- flashy counters;
- looping decorative motion.

Respect reduced-motion preferences.

## 18. Empty States

Because the archive begins empty, empty states are important.

### Initial Atlas

Example direction:

```text
The atlas is empty for now.

Start by documenting a place that matters to you.
[Add a Memory]
```

Avoid making an empty database look like an error.

### Empty country

```text
No memories documented here yet.
[Add Place]
```

## 19. Forms

Forms should feel like adding an archival record, not filling out an enterprise database.

Keep fields:
- understandable;
- grouped;
- optional where appropriate;
- validated;
- easy to cancel.

Do not ask for unnecessary metadata during initial capture.

## 20. Accessibility

Require:
- semantic headings;
- alt text for meaningful images;
- decorative image handling;
- visible keyboard focus;
- sufficient contrast;
- readable captions;
- accessible map alternatives;
- status not conveyed by color alone.

## 21. Performance UX

Real imagery must not make the page slow.

Use:
- optimized formats;
- responsive image sizes;
- lazy loading;
- thumbnails;
- meaningful placeholders;
- priority loading for hero image only.

Do not load the whole archive's original-resolution media at once.

## 22. Image Source and Attribution UI

When an external image is used as a temporary design/reference asset:
- preserve source information;
- preserve creator information if required;
- preserve license/usage notes;
- do not imply it is Rangga's personal photograph.

Personal photos and external reference images must remain distinguishable in data when the distinction matters.

## 23. Visual QA Checklist

### Landing
- hero composition;
- readability over image;
- CTA visibility;
- responsive crop;
- section pacing.

### Atlas
- map readability;
- country selection;
- alternative navigation;
- no clutter.

### Memory
- image hierarchy;
- caption/readability;
- gallery behavior;
- long notes.

### General
- typography;
- spacing;
- overflow;
- loading;
- empty;
- error;
- focus;
- reduced motion;
- image quality.

## 24. Design Anti-Patterns

Never:
- fill the website with random travel photos;
- use cartoons as the visual default;
- create a giant image hero on every page;
- use generic stock people to represent “travel”;
- put 10 cards in a section just because there is room;
- make every section colorful;
- sacrifice readability for cinematic effects;
- imply visits or memories that do not exist.

## 25. V1 Visual Priority

Build in this order:

```text
1. App shell
2. Landing page
3. Atlas/world foundation
4. Country exploration
5. Memory detail
6. Memory creation/editing
7. Empty/error states
8. Responsive polish
9. Image optimization
```

The landing page should establish the visual language used by the rest of the app.

## 26. Source-of-Truth Hierarchy

```text
Human decisions
→ DESIGN.md
→ approved image/reference direction
→ existing component system
→ framework defaults
→ AI preference
```

The AI must not replace the visual identity with generic generated UI.
