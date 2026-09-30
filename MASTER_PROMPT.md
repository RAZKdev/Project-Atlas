# Project Atlas — MASTER_PROMPT.md

You are the primary implementation agent for **Project Atlas**.

Project Atlas is a greenfield personal travel archive and future digital museum. It documents places, journeys, memories, photos/media references, and souvenirs.

The project is currently empty. Build the foundation deliberately.

## 1. Mandatory Source-of-Truth Files

Before coding, read:
1. `SKILL.md`
2. `DESIGN.md`
3. `MASTER_PROMPT.md`

Do not use another project's `SKILL.md`, `DESIGN.md`, or visual language as a substitute.

## 2. Mission

Build Project Atlas as a personal, local-first digital atlas.

The V1 experience must include a real landing page and an authentic visual identity based on real-world travel imagery.

Do not build the whole long-term museum vision immediately.

## 3. Mandatory Execution Order

```text
READ DOCS
→ DEFINE CORE CONTRACTS
→ DESIGN FOLDER STRUCTURE
→ INITIALIZE APP
→ BUILD DESIGN SYSTEM
→ BUILD LANDING PAGE
→ BUILD ATLAS FOUNDATION
→ BUILD COUNTRY FOUNDATION
→ BUILD MEMORY FOUNDATION
→ ADD LOCAL PERSISTENCE
→ TEST
→ VISUAL QA
→ PRIVACY / SECURITY REVIEW
→ DELIVERY REPORT
```

## 4. Step 1 — Define Contracts

Before implementing feature-heavy UI, establish the minimum domain contracts needed by V1.

At minimum consider:

```text
Country
Place
Memory
MediaReference
Souvenir
```

Keep contracts small.

Do not create speculative schemas for every future idea.

## 5. Step 2 — Folder Structure

Create a clean, understandable project tree.

Recommended starting point:

```text
Project-Atlas/
├── src/
│   ├── components/
│   ├── pages/
│   ├── features/
│   │   ├── landing/
│   │   ├── atlas/
│   │   ├── countries/
│   │   ├── memories/
│   │   └── media/
│   ├── core/
│   │   ├── contracts/
│   │   ├── domain/
│   │   └── services/
│   ├── data/
│   ├── utils/
│   └── styles/
├── public/
│   └── assets/
├── tests/
├── docs/
├── SKILL.md
├── DESIGN.md
├── MASTER_PROMPT.md
└── README.md
```

Only create directories that have a real purpose.

## 6. Step 3 — Initial App

Choose a modern, maintainable frontend stack appropriate for the laptop development environment.

Do not add a backend in V1 unless a concrete requirement appears.

Prefer simple local-first architecture.

## 7. Step 4 — Design System

Implement a reusable foundation matching `DESIGN.md`:
- typography;
- spacing;
- buttons;
- cards;
- navigation;
- image containers;
- metadata;
- status;
- empty states;
- dialogs/forms.

Do not create a separate visual style for every page.

## 8. Step 5 — Landing Page

The landing page is mandatory.

It must not look like a generic SaaS landing page.

### Required structure

```text
Navigation
→ Hero
→ Atlas introduction
→ World/discovery section
→ Featured memories/places
→ Personal museum philosophy
→ Final CTA
```

### Hero

Use one strong real-world image.

The image should:
- represent travel/discovery;
- be authentic;
- have an appropriate composition;
- support text placement;
- not overwhelm the page.

Example conceptual copy:

```text
Project Atlas

A personal map of places, memories, and moments.

[Explore the Atlas]
```

Do not use placeholder cartoons.

## 9. Real Image Implementation

This project explicitly uses real imagery.

### Rules
- use authentic photography or legitimate photographic references;
- choose imagery based on the actual section;
- use the smallest number of images that creates the intended experience;
- do not fill whitespace with random photos;
- do not use generic travel stock people unless genuinely relevant;
- preserve source/creator/license metadata when using external images.

### Image slots

For V1, prioritize:

```text
Hero:
1 strong real travel image

Featured memories:
small curated set of real images

Country/place:
real place image when useful

Gallery:
personal media first
```

Do not create an image for every card automatically.

## 10. Atlas Foundation

Build an initial world/country exploration experience.

It should allow the user to:
- browse countries;
- inspect country status;
- open country details;
- see documented memories.

Provide a non-map fallback navigation method.

A map can be the primary visual exploration mode but must not be the only way to navigate.

## 11. Country States

Use a clear state model such as:

```text
Unknown
Interested
Planned
Visited
Documented
```

Do not imply a country was visited merely because it exists in the country catalog.

## 12. Memory Foundation

Build the minimum useful memory flow:

```text
Create
→ view
→ edit
→ delete
```

Memory should support at least:

```text
Title
Country
Place
Date/date range
Summary/notes
Media references
Tags
```

Keep the first form simple.

## 13. Media

Do not upload or duplicate original videos/photos into the application unnecessarily.

The model should support references to local media.

For browser limitations, implement an honest workflow. Never pretend the app permanently owns a local path if the browser cannot guarantee it.

## 14. Local Persistence

Implement local-first persistence.

Use:
- localStorage for small metadata if appropriate;
- IndexedDB if dataset/media metadata grows enough to justify it.

Persistence must:
- survive reload;
- handle missing/corrupted data;
- use safe defaults;
- keep domain contracts consistent.

## 15. Empty-State First Design

The project begins empty, so design the first-use experience deliberately.

No content should feel like a broken application.

Show a clear onboarding path:

```text
Your Atlas is waiting.

Document your first place or memory.
[Add a Memory]
```

Avoid mandatory account creation.

## 16. Privacy

Treat Atlas content as private by default.

Do not:
- add analytics without explicit need;
- log private notes;
- expose local media references unnecessarily;
- include secret tokens;
- send personal archive data to third-party services.

## 17. Testing

At minimum:
- contract tests or validation where appropriate;
- memory CRUD;
- persistence;
- country status transitions;
- route/navigation behavior;
- responsive layout;
- landing CTA;
- empty states.

Check:
- reload;
- edit repeatedly;
- delete;
- invalid input;
- empty archive.

## 18. Visual QA

Inspect the actual rendered application.

### Landing page
- hero image quality;
- text contrast;
- crop;
- spacing;
- section rhythm;
- mobile behavior;
- CTA visibility.

### Atlas
- browsing;
- map/fallback navigation;
- country state display;
- image loading.

### Memories
- image hierarchy;
- readable notes;
- forms;
- mobile layout.

### General
- no overflow;
- no broken assets;
- no placeholder illustrations;
- no excessive imagery;
- no fake interactions.

## 19. Image Quality Gate

Before accepting an image:
- verify relevance;
- verify source;
- verify usage/licensing status;
- verify correct crop;
- verify resolution;
- verify visual restraint.

The goal is **authentic and intentional**, not “as many real images as possible.”

## 20. Anti-Overengineering Rule

Do not build:
- auth;
- backend;
- cloud sync;
- AI trip planning;
- social features;
- complex map infrastructure;

unless a V1 requirement genuinely needs them.

The first goal is a beautiful, useful local archive.

## 21. Delivery Report

At the end of each milestone, report:

```text
IMPLEMENTED
TESTED
VISUAL QA
IMAGE SOURCES / LICENSE NOTES
PRIVACY REVIEW
KNOWN LIMITATIONS
NEXT MILESTONE
```

Separate verified results from assumptions.

## 22. Final Directive

Build Project Atlas as a **personal digital museum that starts as a practical travel archive**.

The landing page must establish the visual identity.

Use authentic imagery, but use it with restraint.

The application should feel:

```text
quietly beautiful
+
useful
+
personal
+
real
```

not:

```text
loud
+
generic
+
image-heavy
+
template-like
```
