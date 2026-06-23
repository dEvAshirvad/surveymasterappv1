# Graph Report - app  (2026-06-23)

## Corpus Check
- 119 files · ~78,610 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 419 nodes · 393 edges · 14 communities detected
- Extraction: 86% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 55 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 51|Community 51]]

## God Nodes (most connected - your core abstractions)
1. `getOfflineDb()` - 13 edges
2. `processItem()` - 11 edges
3. `apiGet()` - 10 edges
4. `draftId()` - 7 edges
5. `downloadFile()` - 6 edges
6. `buildOrderedFormQuestions()` - 5 edges
7. `ActiveFillSession()` - 4 edges
8. `AdminFiltersBar()` - 4 edges
9. `computeProgress()` - 4 edges
10. `hydrateDraft()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `loadDraftStatuses()` --calls--> `listDraftsBySession()`  [INFERRED]
  app/session/[sessionId]/forms/[formCode]/entries/page.tsx → lib/storage/draft-store.ts
- `hydrateDraft()` --calls--> `getDraft()`  [INFERRED]
  components/survey/fill-entry-editor.tsx → lib/storage/draft-store.ts
- `hydrateCrossSectorAnswers()` --calls--> `getDraftAnswersByFormCodes()`  [INFERRED]
  components/survey/fill-entry-editor.tsx → lib/storage/draft-store.ts
- `ActiveFillSession()` --calls--> `useSessionDetail()`  [INFERRED]
  app/fill/[formCode]/page.tsx → hooks/api/use-sessions.ts
- `ActiveFillSession()` --calls--> `useSessionEntry()`  [INFERRED]
  app/fill/[formCode]/page.tsx → hooks/api/use-session-entries.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (24): isOnline(), draftId(), getDraft(), getDraftAnswersByFormCodes(), getDraftBySessionAndForm(), listDraftsBySession(), makeDraftId(), removeDraft() (+16 more)

### Community 1 - "Community 1"
Cohesion: 0.09
Nodes (8): AdminFiltersBar(), ActiveFillSession(), useGetOrCreateFormEntry(), useSessionEntry(), useSessionBlockOptions(), useSessionDetail(), useSessionDistrictOptions(), useSessionGramPanchayatOptions()

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (20): apiDelete(), apiGet(), apiPatch(), apiPost(), createSessionEntry(), deleteSessionEntry(), getOrCreateFormEntry(), getSessionEntry() (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (12): computeProgress(), hydrateCrossSectorAnswers(), hydrateDraft(), pickEditableContextSnapshot(), serializeAnswersForPatch(), buildOrderedFormQuestions(), compareQid(), getPrimaryAnswerValue() (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (2): getLastMatrixQuestion(), getForm()

### Community 8 - "Community 8"
Cohesion: 0.38
Nodes (5): AdminSessionPage(), filtersKey(), useAdminDashboard(), useAdminSessionDrillDown(), useAdminSessions()

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (2): SidebarMenuButton(), useSidebar()

### Community 12 - "Community 12"
Cohesion: 0.48
Nodes (5): fromSchemeSelectValue(), hasSchemeNoneOption(), resolveSelectChange(), resolveSelectValue(), toSchemeSelectValue()

### Community 13 - "Community 13"
Cohesion: 0.43
Nodes (5): buildFilterParams(), adminGet(), getAdminDashboard(), getAdminSessionDrillDown(), listAdminSessions()

### Community 14 - "Community 14"
Cohesion: 0.52
Nodes (6): downloadFile(), downloadSessionArchive(), downloadSessionFormCsv(), downloadSessionFormPdf(), downloadSessionFormXlsx(), parseFilename()

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (3): fillPath(), handleCreateEntry(), loadDraftStatuses()

### Community 23 - "Community 23"
Cohesion: 0.5
Nodes (2): CarouselNext(), useCarousel()

### Community 24 - "Community 24"
Cohesion: 0.6
Nodes (3): formatNumeric(), handleCellChange(), parseNumeric()

### Community 51 - "Community 51"
Cohesion: 0.67
Nodes (1): ApiError

## Knowledge Gaps
- **Thin community `Community 4`** (11 nodes): `forms.ts`, `cross-sector-auto-matrix.tsx`, `asMatrixValue()`, `cn()`, `getLastMatrixQuestion()`, `isSourceRowFilled()`, `mapCoverageValue()`, `normalizeKey()`, `readSourceCell()`, `updateManualCell()`, `getForm()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (7 nodes): `sidebar.tsx`, `cn()`, `handleKeyDown()`, `SidebarMenu()`, `SidebarMenuButton()`, `SidebarMenuItem()`, `useSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (5 nodes): `Carousel()`, `CarouselNext()`, `cn()`, `useCarousel()`, `carousel.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (3 nodes): `ApiError`, `.constructor()`, `envelope.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getDraft()` connect `Community 0` to `Community 3`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `hydrateDraft()` connect `Community 3` to `Community 0`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Are the 12 inferred relationships involving `getOfflineDb()` (e.g. with `upsertDraft()` and `getDraft()`) actually correct?**
  _`getOfflineDb()` has 12 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `processItem()` (e.g. with `makeDraftId()` and `updateDraftSyncState()`) actually correct?**
  _`processItem()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `apiGet()` (e.g. with `listSessions()` and `getSessionDetail()`) actually correct?**
  _`apiGet()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._