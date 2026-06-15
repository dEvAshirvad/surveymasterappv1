# Graph Report - app  (2026-06-14)

## Corpus Check
- 92 files · ~61,404 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 312 nodes · 249 edges · 8 communities detected
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 42|Community 42]]

## God Nodes (most connected - your core abstractions)
1. `apiGet()` - 9 edges
2. `computeProgress()` - 4 edges
3. `apiPost()` - 4 edges
4. `getPrimaryAnswerValue()` - 3 edges
5. `getVisibleQuestions()` - 3 edges
6. `handleSubmit()` - 3 edges
7. `handleCellChange()` - 3 edges
8. `apiPatch()` - 3 edges
9. `normalizeSessionEntry()` - 3 edges
10. `getSessionEntry()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `SessionsPage()` --calls--> `useSessions()`  [INFERRED]
  app/sessions/page.tsx → hooks/api/use-sessions.ts
- `apiGet()` --calls--> `listSessions()`  [INFERRED]
  lib/api/client.ts → lib/api/endpoints/sessions.ts
- `apiGet()` --calls--> `getSessionDetail()`  [INFERRED]
  lib/api/client.ts → lib/api/endpoints/sessions.ts
- `apiGet()` --calls--> `getSessionFormsSummary()`  [INFERRED]
  lib/api/client.ts → lib/api/endpoints/sessions.ts
- `apiGet()` --calls--> `listSessionDistrictOptions()`  [INFERRED]
  lib/api/client.ts → lib/api/endpoints/sessions.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.13
Nodes (20): apiDelete(), apiGet(), apiPatch(), apiPost(), createSessionEntry(), deleteSessionEntry(), getOrCreateFormEntry(), getSessionEntry() (+12 more)

### Community 1 - "Community 1"
Cohesion: 0.21
Nodes (9): computeProgress(), handleSubmit(), pickEditableContextSnapshot(), compareQid(), getPrimaryAnswerValue(), getVisibleQuestions(), isParentTriggerMet(), parseQid() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (2): SessionsPage(), useSessions()

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 13 - "Community 13"
Cohesion: 0.5
Nodes (2): fillPath(), handleCreateEntry()

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (2): CarouselNext(), useCarousel()

### Community 18 - "Community 18"
Cohesion: 0.6
Nodes (3): formatNumeric(), handleCellChange(), parseNumeric()

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (1): ApiError

## Knowledge Gaps
- **Thin community `Community 2`** (13 nodes): `page.tsx`, `use-sessions.ts`, `formatSurveyDate()`, `SessionsPage()`, `useCreateSession()`, `useSessionBlockOptions()`, `useSessionDetail()`, `useSessionDistrictOptions()`, `useSessionFormsSummary()`, `useSessionGramPanchayatOptions()`, `useSessions()`, `useSessionSearch()`, `useUpdateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 9`** (7 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenu()`, `SidebarMenuButton()`, `SidebarMenuItem()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (5 nodes): `page.tsx`, `fillPath()`, `formatLocation()`, `handleCreateEntry()`, `handleDeleteEntry()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (5 nodes): `Carousel()`, `CarouselNext()`, `cn()`, `useCarousel()`, `carousel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (3 nodes): `ApiError`, `.constructor()`, `envelope.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Are the 8 inferred relationships involving `apiGet()` (e.g. with `listSessions()` and `getSessionDetail()`) actually correct?**
  _`apiGet()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `computeProgress()` (e.g. with `getPrimaryAnswerValue()` and `getVisibleQuestions()`) actually correct?**
  _`computeProgress()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `apiPost()` (e.g. with `createSessionEntry()` and `submitSessionEntry()`) actually correct?**
  _`apiPost()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._