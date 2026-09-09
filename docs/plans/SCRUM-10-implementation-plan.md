Status: WAITING FOR APPROVAL

# Implementation Plan

## Objective
Add a “Clear All” action to TaskLoom that is only shown when there is at least one task, prompts the user for confirmation, and on confirm removes all tasks (active + completed) from the UI and clears/updates the stored tasks in localStorage.

Jira: SCRUM-10
https://myneworg.atlassian.net/browse/SCRUM-10

## Files / Components
Verified relevant files in repo:
- App.tsx (task state, localStorage persistence, existing delete/clear behaviors, dashboard counts)

Potentially relevant existing components (not yet confirmed necessary to change for this story):
- components/TaskCard.tsx (individual delete/edit/toggle UI)
- components/EmptyState.tsx (shown when no tasks / no results)

## Frontend Changes
- Add a “Clear All” button in the tasks UI when total task count > 0.
  - In App.tsx, total task count is currently derived as `totalCount = tasks.length`.
  - Current UI already conditionally shows “Clear Archive” when `completedCount > 0`; “Clear All” should be similarly conditional, but based on `totalCount > 0`.
- Add confirmation prompt with Cancel and Confirm.
  - App.tsx currently uses `confirm(...)` for:
    - deleting a single task (`deleteTask`)
    - clearing completed tasks (`clearCompleted`)
  - Plan is to follow the same pattern (confirmation prompt) for “Clear All” in App.tsx.
- On Confirm, remove all tasks so that:
  - task list becomes empty
  - dashboard counts (Total/Active/Success/Flow) reflect zero
  - “Clear All” no longer renders because totalCount becomes 0
  - EmptyState renders (existing behavior when there are no tasks and no “no results” state)

## Data / Backend Changes
- No backend changes (repo uses local state + localStorage).
 - localStorage key currently used: `taskloom_data` .
   - App.tsx persists tasks via `useEffect(() => localStorage.setItem('taskloom_data', JSON.stringify(tasks)), [tasks])`.
  - Clearing all tasks should set tasks state to an empty array; the existing effect will update localStorage accordingly.

## Testing
Repo contains Playwright tests under `tests/` (e.g., `tests/scrum8-search-due-date-time.spec.ts`).
Planned testing approach (what to add/adjust in later dev PR):
- E2E coverage for SCRUM-10:
  - Seed at least one task, verify “Clear All” is visible.
  - Click “Clear All” and cancel; verify tasks remain and persisted storage is unchanged.
  - Click “Clear All” and confirm; verify list is empty, counts are zero, and “Clear All” is no longer visible.
  - Reload page and verify tasks remain cleared (localStorage updated).

## Implementation Steps
1. In App.tsx, add a new handler function (similar to `clearCompleted` / `deleteTask`) that:
   - prompts for confirmation
   - if canceled: returns without state change
  - if confirmed: clears all tasks via `setTasks([])� and updates `statPulse` (pattern currently used after mutations)
2> In the “Your Current List” header area (where “Clear Archive” is currently conditionally rendered), add a second control for “Clear All” that:
   - renders only when `totalCount > 0` (Acceptance Criteria #1)
  - calls the new handler on click
3. Manually verify in browser:
  - visibility conditions for the button
  - cancel path leaves tasks and localStorage intact
  - confirm path clears UI and localStorage (`taskloom_data` becomes `[]`)
   - counts/sections reflect zero and “Clear All” disappears (Acceptance Criteria #5)
4. Add/update Playwright E2E spec(s) for the above behaviors.

## Risks / Dependencies
- Confirmation UI: Jira allows modal/dialog “e.g.”; current implementation uses browser `confirm(...)`. If a custom modal is desired later, it would require additional UI/component work not currently present in repo.
- localStorage consistency: Must ensure “Cancel” path does not call `setTasks`, otherwise localStorage will be overwritten by the `useEffect` persistence.

HITL CHECKPOINT:
Implementation plan is ready for review.
Nothing has been changed in Git.
Approve or provide feedback.

Approval:
- Approve
- Reject / Request Changes