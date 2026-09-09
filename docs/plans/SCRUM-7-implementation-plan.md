Status: WAITING FOR APPROVAL

# Implementation Plan

## Objective
Add a task count indicator for the current list view so users can quickly see how many tasks match the current filter/search versus the overall total.

Jira: SCRUM-7
Jira URL: https://myneworg.atlassian.net/browse/SCRUM-7

## Files / Components
Verified relevant code locations in repo:
- `App.tsx`
  - Owns task state (`tasks`), filtering (`filter`), search (`searchQuery`), and computed `filteredTasks` via `useMemo`.
  - Renders the “Your Current List” header where the indicator should be displayed.

## Frontend Changes
- Add a small counter near the “Your Current List” header.
- Counter content (per approved Option 2):
  - “Showing X of Y”
  - X = `filteredTasks.length`
  - Y = `tasks.length`
- Display should work for:
  - default view (no search/filter)
  - filter buttons (`all`, `active`, `completed`)
  - non-empty `searchQuery`
  - empty states (including the existing “No results match your filter/search” empty state)

## Data / Backend Changes
- None.
 - App uses local storage (`taskloom_data`) in `App.tsx`; no changes required.

## Testing
Verified test framework exists:
- Playwright config: `playwright.config.ts`
- Existing test file: `tests/scrum8-search-due-date-time.spec.ts`

Planned test updates/additions (at a high level):
- Add/extend Playwright coverage to assert the “Showing X of Y” indicator updates when:
  - filter changes between `all` / `active` / `completed`
  - search query narrows results
  - results are empty (X = 0)

## Implementation Steps
1. In `App.tsx`, locate the “List Section” header row that renders:
   - `“Your Current List”
   - `“Clear Archive” button
2. Add UI text element near the header (same row) rendering:
   “Showing {filteredTasks.length} of {tasks.length}”
3. Ensure layout remains stable alongside the conditional “Clear Archive” button.
4. Run Playwright tests and update/add a spec to validate the indicator across filter/search scenarios.

## Risks / Dependencies
- UI/layout risk: The header row currently conditionally renders “Clear Archive”; adding another element may require minor layout adjustments to avoid crowding.
- Test selector risk: Existing UI elements may not have stable selectors; tests may need to rely on text-based locators unless a stable attribute already exists.

---

Approved for publication in PR and Confluence.