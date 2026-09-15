Status: WAITING FOR APPROVAL

# Implementation Plan

## Objective
Implement an “Undo delete” inline toast/banner that appears immediately after a task is deleted (after user confirmation), allowing restoration of only the most recently deleted task within a short timeout (5-10 seconds), while preserving the localStorage-only architecture.

Jira: SCRUM-14
Jira URL: https://myneworg.atlassian.net/browse/SCRUM-14

## Files / Components
Verified relevant files in repo:
- `App.tsx` (task state management, localStorage persistence, delete confirmation + removal)
- `components/TaskCard.tsx` (invokes `onDelete(task.id)` from delete button)

## Frontend Changes
- Add UI for an inline toast/banner in `App.tsx` that:
  - Renders immediately after a confirmed deletion.
  - Shows an “Undo” action.
  - Auto-dismisses after a short timeout (5-10 seconds).
  - On “Undo,” restores the most recently deleted task back into the task list.
  - If another task is deleted while a toast is active, replace the undo state with the most recent deletion.
  - After dismissal, “Undo” is no longer available.

## Data / Backend Changes
- No backend changes.
- Continue using the existing localStorage key `taskloom_data` written in `App.tsx` via the existing `useEffect([tasks])` persistence.
 - Deletion remains a removal from `tasks` state (and therefore persisted to localStorage).
- Undo restores by re-inserting the saved deleted task object into `tasks` state (and therefore persisted back to localStorage).

## Testing
Verified test setup exists (`playwright.config.tsx, `tests/` directory).
Plan for coverage (implementation later):
- Add/extend Playwright E2E test to verify:
  - Deleting with confirm removes task from list.
  - Toast/banner appears immediately after deletion.
  - Clicking “Undo ” restores the deleted task.
  - Toast auto-dismisses after timeout and undo is not possible afterward.
  - Deleting a second task while toast is visible updates undo target to the most recent deletion.


## Implementation Steps
1. In `App.tsx`, introduce state to track the most recently deleted task (e.g., store the deleted `Task` object) and whether the undo toast is visible.
2. Update `deleteTask` in `App.tsx`:
  - Keep the existing `confirm('Are you sure you want to delete this task?')` flow.
  - Before filtering it out, locate the task being deleted from current `tasks` state so it can be stored for undo.
  - After removal, set the “recently deleted task” state and show the toast.
3. Add timeout handling in `App.tsx`:
  - Start/reset a timer when a deletion occurs.
  - Auto-hide the toast after 5-10 seconds and clear the stored undo task.
  - Ensure deleting another task clears/replaces any existing timer and updates the stored undo task to the latest.
2. Implement the “Undo,” handler in `App.tsx`:
  - If the stored deleted task exists and toast is still active, restore it into `tasks` state.
  - Hide the toast and clear undo state.
3. Render an inline toast/banner in `App.tsx` UI:
  - Display only when undo state is active.
  - Include an “Undo” button wired to the undo handler.
6. Confirm `components/TaskCard.tsx` remains compatible (it already calls `onDelete(task.id)`), so no changes are strictly required there unless needed for UX.


## Risks / Dependencies
- Timer lifecycle: must clear any existing timeout when a new delete occurs or when undo is clicked to avoid stale state updates.
- Ordering on restore: current app sorts tasks in `filteredTasks` (`useMemo`) by completion, then due date/time, then `createdAt ;restoring a task should rely on existing sorting to place it appropriately.
- Confirm dialog is native `confirm()`: havior depends on browser, but existing flow already uses it and acceptance criteria require confirm then deletion.

Approval:
- Approve
- Reject / Request Changes

HITL CHECKPOINT:
 Implementation plan is ready for review.
Nothing has been changed in Git.
Approve or provide feedback.