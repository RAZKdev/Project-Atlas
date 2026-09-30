# Project Atlas — SKILL.md

> Engineering source of truth for Project Atlas.
> Status: V1 foundation / greenfield project.
> Product model: personal travel documentation + future digital museum of memories.
> Architecture philosophy: local-first, personal, simple, maintainable, extensible without premature complexity.

## 1. Project Identity

**Project:** Project Atlas

**Purpose:** A personal travel archive for documenting experiences across the world, with a long-term vision of becoming a private digital museum of places, memories, photos, notes, souvenirs, and travel milestones.

The primary unit is not a social post. It is a **memory/place record**.

The product should help Rangga answer:
- Where have I been?
- What do I remember from that place?
- What media belongs to that memory?
- What did I collect or keep?
- Which countries/places are documented?
- What remains unexplored?

## 2. Product Character

Project Atlas should feel like:

```text
Personal
Exploratory
Calm
Cinematic
Nature-aware
Curated
Long-lasting
```

It should not feel like:

```text
Generic travel booking website
Social-media feed
Tourism advertisement
Crowded scrapbook
Gamified achievement app
```

## 3. Project Status

This is a greenfield project.

There is no stable existing implementation that must be preserved yet.

Therefore the first milestone may establish:
- project structure;
- architecture;
- design system;
- contracts;
- landing page;
- local-first data foundation.

Do not build the entire long-term vision in V1.

## 4. Core Product Goals

V1 should establish:
1. A polished landing page.
2. A world/country exploration experience.
3. A place/memory detail model.
4. Personal travel entries.
5. Photo/video references without forcing media into the app database.
6. Local-first persistence.
7. A clean data model that can later support synchronization.
8. A visual language based on authentic travel imagery.

## 5. Non-Goals

Do not implement in V1 unless explicitly requested:
- public social network;
- likes/comments/followers;
- hotel/flight booking;
- real-time travel prices;
- public user profiles;
- complex cloud sync;
- multi-user permissions;
- AI trip planner;
- autonomous travel recommendations;
- heavy gamification;
- marketplace;
- advertising system.

Project Atlas is a personal archive first.

## 6. Canonical Architecture

Use a simple separation of concerns.

Conceptual target:

```text
Project Atlas/
├── src/
│   ├── components/
│   ├── pages/
│   ├── features/
│   │   ├── landing/
│   │   ├── atlas/
│   │   ├── memories/
│   │   ├── countries/
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

This is a target, not an excuse for unnecessary layers.

## 7. Core / Contracts Rule

`core/contracts` is the single source of truth for domain contracts.

Potential contracts:

```text
Country
Place
Journey
Memory
MediaReference
Souvenir
TravelDate
Tag
AtlasStats
```

Do not duplicate domain shapes across components.

When a domain contract changes:
1. update the contract;
2. identify consumers;
3. update affected data/state;
4. run tests;
5. document material changes.

## 8. Local-First Data Model

V1 should be local-first.

Recommended persistence flow:

```text
Application
→ local domain state
→ local persistence adapter
```

Possible implementation:
- localStorage for small/simple metadata;
- IndexedDB if media metadata or larger local datasets justify it.

Do not introduce a backend just because the architecture could support one.

## 9. Media Strategy

Project Atlas should not force large photos/videos into the primary metadata store.

The app should primarily store:

```text
mediaId
type
uri / local reference
thumbnail reference if needed
caption
date
placeId
countryCode
metadata
```

The actual media may remain in:
- device gallery;
- local file storage;
- laptop filesystem.

The app stores the reference/metadata needed to reconnect the memory to its media.

If browser security prevents reliable direct file references, design a practical local-media workflow instead of inventing permanent paths.

## 10. Country Model

The long-term concept covers the world's countries.

V1 should support a country catalog without pretending that every country has been visited.

Possible states:

```text
Unknown
Interested
Planned
Visited
Documented
```

The state model should remain semantically clear.

Do not turn country count into a competitive score.

## 11. Memory Model

A memory should capture experience, not only geography.

Recommended fields:

```text
id
countryCode
placeId
title
summary
date / date range
notes
tags
mediaReferences
souvenirs
favorite
createdAt
updatedAt
```

Optional fields can be added later.

Do not require every field for a useful memory.

## 12. Souvenir Model

Souvenirs may connect physical objects to digital memories.

Possible fields:

```text
id
memoryId
countryCode
name
description
acquiredDate
photoReference
notes
```

The product should treat a souvenir as an artifact of memory, not an inventory-management system.

## 13. Landing Page Requirement

The landing page is part of V1.

It should communicate:

```text
This is my personal atlas of places and memories.
```

Required conceptual sections:
1. Hero.
2. Short Atlas introduction.
3. Visual/world discovery section.
4. Featured memories or places.
5. Personal archive philosophy.
6. Clear entry point into the Atlas.

Do not turn the landing page into a long marketing funnel.

## 14. Image Strategy

Project Atlas uses **real imagery as a core visual language**.

Rules:
- Prefer authentic photographs over illustrations.
- Use images that represent actual places, landscapes, architecture, culture, or travel context.
- Use the minimum number needed to establish atmosphere.
- Do not fill empty sections with random stock images.
- Do not use cartoon imagery as the default.
- Do not use over-edited or overly dramatic travel photography when a calmer image is more appropriate.
- Avoid repeating the same image style everywhere.
- Each major image should have a clear reason to exist.

Image quantity should follow the page's actual information architecture.

### Landing page baseline

Use:
- 1 strong hero image or visual composition;
- a restrained number of supporting real photos;
- real place imagery for featured memories;
- no image wall for its own sake.

### Image source policy

For implementation, prefer reputable sources/licensing that allow the intended use.

Document:
- source;
- photographer/creator when required;
- license/usage note where applicable.

Do not assume every web image is free to reuse.

## 15. Frontend Rules

Frontend must:
- be responsive;
- provide accessible navigation;
- avoid unnecessary animations;
- use reusable components;
- separate domain logic from presentation;
- support loading/empty/error/success states where relevant.

Do not create fake interactions to make the prototype look complete.

## 16. Backend Direction

V1 does not require a backend.

Possible future backend responsibilities:
- cloud backup/sync;
- authenticated private archive;
- multi-device synchronization;
- optional remote media metadata;
- import/export services.

Future backend should not replace local-first behavior without an explicit product decision.

## 17. Import / Export

Because this is a personal archive, portability matters.

Future-ready design should make it possible to export:
- memories;
- country status;
- metadata;
- tags;
- souvenir records.

Prefer human-readable formats where practical.

## 18. Testing

V1 tests should focus on:
- contract validity;
- state transitions;
- memory CRUD;
- persistence;
- country state changes;
- media-reference handling;
- empty states;
- import/export logic when implemented.

For UI:
- navigation;
- responsive behavior;
- forms;
- dialogs;
- accessibility;
- landing page layout.

## 19. Security and Privacy

Project Atlas is personal/private by design.

Rules:
- never expose private media references unnecessarily;
- do not hardcode credentials;
- validate imported data;
- treat stored client data as untrusted;
- avoid leaking private notes into logs/analytics;
- do not add third-party tracking by default;
- minimize external requests.

If cloud sync is added later, privacy/security architecture must be designed before implementation.

## 20. Performance

Prioritize:
- fast landing page;
- optimized image loading;
- lazy loading for secondary imagery;
- sensible thumbnails;
- limited animation;
- no unnecessary dependencies.

Do not load a full world of high-resolution images on initial page load.

## 21. Accessibility

Required baseline:
- keyboard navigation;
- visible focus;
- semantic landmarks;
- alt text for meaningful images;
- decorative images marked appropriately;
- text alternative for critical visual information;
- sufficient contrast;
- reduced-motion support.

## 22. Definition of Done

A milestone is done when:

```text
Requirement defined
+ contracts defined
+ implementation complete
+ relevant tests run
+ responsive QA complete
+ accessibility checked
+ image/source usage documented
+ privacy implications checked
+ known limitations recorded
```

## 23. Greenfield Build Sequence

```text
READ SKILL.md
→ READ DESIGN.md
→ READ MASTER_PROMPT.md
→ DEFINE CONTRACTS
→ DEFINE FOLDER STRUCTURE
→ SET UP BASE APP
→ BUILD DESIGN SYSTEM
→ BUILD LANDING PAGE
→ BUILD ATLAS / COUNTRY FOUNDATION
→ BUILD MEMORY FOUNDATION
→ ADD LOCAL PERSISTENCE
→ TEST
→ VISUAL QA
→ SECURITY / PRIVACY REVIEW
→ DELIVERY
```

Do not implement every future module before the core experience works.

## 24. AI Agent Rules

The agent must:
- read all three project documents;
- use project-local documents as authority;
- state assumptions;
- avoid inventing requirements;
- keep scope bounded;
- preserve contracts;
- perform visual QA;
- verify image sourcing/licensing;
- report what was actually tested.

## 25. Source-of-Truth Hierarchy

```text
1. Explicit human decision
2. SKILL.md
3. DESIGN.md
4. MASTER_PROMPT.md
5. Core contracts
6. Approved implementation plan
7. Existing implementation
8. Framework defaults
9. AI preference
```

The agent's aesthetic preference is never higher authority than Project Atlas's design system.
