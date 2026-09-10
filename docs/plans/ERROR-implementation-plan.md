Status: WAITING FOR APPROVAL

# Implementation Plan

## Objective
Update the task list UI so that when a task has a due date, the TaskCard displays the full year (e.g., “Sep 15, 2026”) Instead of the current “Mon Day” format (e.g., “Sep 15”), while keeping sorting and the localStorage data schema unchanged.

Jira Story: ERROR
Jira URL: https://myneworg.atlassian.net

## Files / Components
- `components/TaskCard.tsx` (renders the due date/time display on each task card)

## Frontend Changes
- In `components/TaskCard.tsx`, update the due date formatting used in the task card display.
  - Current behavior (verified):
    - If `task.date` exists, the card renders:
      - `new Date(task.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })`J      - This omits the year.
  - Proposed change:
    - Include `year: 'numeric'` in the `toLocaleDateString` options so the rendered output becomes “Mon Day, YYYY”.
  - Keep the existing time rendering unchanged:
    - If `task.time` exists, it is displayed as ` @ {task.time}`.

## Data / Backend Changes
- None.
  - No backend is present/required for this change.
  - No changes to `Task` shape or localStorage model are required/allowed for this option.

## Testing
- Run existing Playwright tests to ensure no regressions, especially any coverage around due date/time rendering/search.
  - Existing test file present in repo: `tests/scrum8-search-due-date-time.spec.ts`.
  - If existing tests assert the old “Mon Day” format, they may fail and will need updating in the future development PR (not in this Plan PR).

## Implementation Steps
1. Verify the Jira story details for Option 2 (Display full due year in task card date).
   - Note: Jira issue key `ERROR` could not be retrieved (permission/does-not-exist). This plan is based on the provided Option 2 text plus verified repo behavior.
2. In `components/TaskCard.tsx`, locate the due date rendering within the `task.date || task.time` block.
3. Update the date formatting call:
   - From: `{ month: 'short', day: 'numeric' } 
   - To: { month: 'short', day: 'numeric', year: 'numeric' }
4. Confirm visually (manual run) that a task with a due date shows “Sep 15, 2026” style formatting.
5. Run Playwright test suite and address any failures related to date display expectations (in the subsequent development workflow).

## Risks / Dependencies
- Jira verification blocked:
  - Attempting to fetch Jira issue `ERROR` returned: “Issue does not exist or you do not have permission to see it”.
  - Dependency: provide a valid Jira issue key (or grant access) so the plan can be fully verified against the Jira story.
 - Locale-dependent formatting:
  - `toLocaleDateString(undefined, ...)` is can vary slightly by environment/locale; adding `year: 'numeric'` still depends on locale conventions (comma placement, ordering).
  - This may affect any UI snapshot/string-matching tests.
