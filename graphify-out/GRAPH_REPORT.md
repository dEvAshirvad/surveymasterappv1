# Graph Report - app  (2026-06-19)

## Corpus Check
- 93 files · ~65,310 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 322 nodes · 260 edges · 9 communities detected
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 44|Community 44]]

## God Nodes (most connected - your core abstractions)
1. `apiGet()` - 9 edges
2. `buildOrderedFormQuestions()` - 5 edges
3. `computeProgress()` - 4 edges
4. `sortOrderBlocks()` - 3 edges
5. `getPrimaryAnswerValue()` - 3 edges
6. `getVisibleQuestions()` - 3 edges
7. `handleCellChange()` - 3 edges
8. `getLastMatrixQuestion()` - 3 edges
9. `apiPost()` - 3 edges
10. `apiPatch()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `SessionsPage()` --calls--> `useSessions()`  [INFERRED]
  app/sessions/page.tsx → hooks/api/use-sessions.ts
- `buildOrderedFormQuestions()` --calls--> `serializeAnswersForPatch()`  [INFERRED]
  components/forms/types.ts → components/survey/fill-entry-editor.tsx
- `buildOrderedFormQuestions()` --calls--> `getLastMatrixQuestion()`  [INFERRED]
  components/forms/types.ts → components/survey/cross-sector-auto-matrix.tsx
- `apiGet()` --calls--> `listSessions()`  [INFERRED]
  lib/api/client.ts → lib/api/endpoints/sessions.ts
- `apiGet()` --calls--> `getSessionDetail()`  [INFERRED]
  lib/api/client.ts → lib/api/endpoints/sessions.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (19): apiDelete(), apiGet(), apiPatch(), apiPost(), createSessionEntry(), deleteSessionEntry(), getOrCreateFormEntry(), getSessionEntry() (+11 more)

### Community 1 - "Community 1"
Cohesion: 0.18
Nodes (9): computeProgress(), serializeAnswersForPatch(), buildOrderedFormQuestions(), compareQid(), getPrimaryAnswerValue(), getVisibleQuestions(), isParentTriggerMet(), parseQid() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (2): SessionsPage(), useSessions()

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (2): getLastMatrixQuestion(), getForm()

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 14 - "Community 14"
Cohesion: 0.5
Nodes (2): fillPath(), handleCreateEntry()

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (2): CarouselNext(), useCarousel()

### Community 19 - "Community 19"
Cohesion: 0.6
Nodes (3): formatNumeric(), handleCellChange(), parseNumeric()

### Community 44 - "Community 44"
Cohesion: 0.67
Nodes (1): ApiError

## Knowledge Gaps
- **Thin community `Community 2`** (13 nodes): `page.tsx`, `use-sessions.ts`, `formatSurveyDate()`, `SessionsPage()`, `useCreateSession()`, `useSessionBlockOptions()`, `useSessionDetail()`, `useSessionDistrictOptions()`, `useSessionFormsSummary()`, `useSessionGramPanchayatOptions()`, `useSessions()`, `useSessionSearch()`, `useUpdateSession()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 3`** (11 nodes): `forms.ts`, `cross-sector-auto-matrix.tsx`, `asMatrixValue()`, `cn()`, `getLastMatrixQuestion()`, `isSourceRowFilled()`, `mapCoverageValue()`, `normalizeKey()`, `readSourceCell()`, `updateManualCell()`, `getForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (7 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenu()`, `SidebarMenuButton()`, `SidebarMenuItem()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (5 nodes): `page.tsx`, `fillPath()`, `formatLocation()`, `handleCreateEntry()`, `handleDeleteEntry()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 18`** (5 nodes): `Carousel()`, `CarouselNext()`, `cn()`, `useCarousel()`, `carousel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (3 nodes): `ApiError`, `.constructor()`, `envelope.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buildOrderedFormQuestions()` connect `Community 1` to `Community 3`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `getLastMatrixQuestion()` connect `Community 3` to `Community 1`?**
  _High betweenness centrality (0.003) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `apiGet()` (e.g. with `listSessions()` and `getSessionDetail()`) actually correct?**
  _`apiGet()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `buildOrderedFormQuestions()` (e.g. with `serializeAnswersForPatch()` and `computeProgress()`) actually correct?**
  _`buildOrderedFormQuestions()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `computeProgress()` (e.g. with `buildOrderedFormQuestions()` and `getPrimaryAnswerValue()`) actually correct?**
  _`computeProgress()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._