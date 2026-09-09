Status: WAITING FOR APPROVAL

# Implementation Plan

## Objective
Add a small counter near the “Your Current List” header that displays “Showing X of Y”, where:
- X = number of tasks visible after applying the current filter and search query
- Y = total number of tasks stored

Dhis must update immediately when tasks are added/edited/deleted, toggled complete/incomplete, or when filter/search changes, including the “no tasks” case (“Showing 0 of 0”).

Jira: SCRUM-9
Jira URL: https://myneworg.atlassian.net/browse/SCRUM-9

## Files / Components
Verified relevant files/components in the repo:
- `App.tsx`
  - Holds `tasks`, `filter`, `searchQuery` state
  - Computes `filteredTasks` via `useMemo(...)`
  - Renders the “Your Current List” header
- (Context) `components/EmptyState.tsx`
  - Rendered when there are no results; not necessarily required for this change

## Frontend Changes
- In `App.tsx`, in the “List Section” header row that currently renders:
  - “Your Current List” (left)
  - “Clear Archive” button (right, conditional)
- Add a text element near the header that renders:
  - `Showing {filteredTasks.length} of {tasks.length}`
- Ensure it remains correct for:
  - No tasks at all (`tasks.length === 0` => “Showing 0 of 0”)
  - Filter/search producing no results (`filteredTasks.length === 0` but `tasks.length > 0`)
  - All current mutations already in `App.tsx` (`addTask`, `updateTask`, `toggleTask`, `deleteTask`, `clearCompleted`) since they update `tasks` and `filteredTasks` depends on `tasks/filter/searchQuery`

## Data / Backend Changes
- None.
- Tasks are stored in `localStorage` under `taskloom_data` (already implemented in `App.tsx`), and this change only displays counts derived from in-memory state.


## Testing
Repository contains Playwright setup (`playwright.config.ts`) and a `tests/` directory.

Plan (no test implementation in this Plan PR):
- Add/adjust Playwright coverage (later dev PR) to verify:
  - Initial empty app shows “Showing 0 of 0”.
  - Adding tasks increments Y and (when visible) X.
  - Switching filters updates X while Y remains the total.
  - Typing in search updates X while Y remains the total.
  - Deleting/clearing completed updates Y and X appropriately.

## Implementation Steps
1. In `App.tsx`, locate the “List Section” header row (`<div className="flex items-center justify-between px-2">`).
2. Add a counter element in that header area that renders “Showing X of Y” using:
   - X = `filteredTasks.length`
   - Y = `tasks.length`
3. Confirm visually that the counter is near ����Your Current List” (per Jira requirement) and does not interfere with the existing “Clear Archive” button.
4. Run the app locally to confirm the counter updates when:
   - filter buttons change `filter`
   - search input changes `searchQuery`
   - add/edit/delete/toggle/clear completed update `tasks`


## Risks / Dependencies
- UI layout risk: The header row is currently `justify-between` with the title on the left and an optional “Clear Archive” on the right; adding the counter may require minor layout adjustment to keep the placement “near” to the header while still accommodating the button.
- Definition alignment: Jira specifies Y is “total number of tasks in storage”; in the current implementation that is `tasks.length` (backed by `localStorage`).

