Status: **WAITING FOR APPROVAL**

# Implementation Plan

## Objective
Implement **SCRUM-4** (https://myneworg.atlassian.net/browse/SCRUM-4): when a task is deleted, remove it from the UI immediately and show a **non-blocking toast/snackbar** offering **Undo** for ~5.10 seconds. If Undo is clicked before expiry, restore the **exact same task object** (same `id`, `title`, `date`, `time`, `completed`, `createdAt`) and keep using the existing `taskloom_data` localStorage persistence.

## Files / Components
Verified relevant files in repo:
- `App.tsx` — owns `tasks` state, `deleteTask`, and localStorage persistence (`taskloom_data`).
- `components/TaskCard.tsx` — triggers delete via `onDelete(task.id)`.
- `types.ts` – defines `Task` shape (includes `id`, `title`, optional `date/time`, `completed`, `createdAt`).

No existing toast/snackbar component found during this inspection.

## Frontend Changes
- Add “Undo delete” UI (toast/snackbar) driven from `App.tsx` state:
  - Track the **most recently deleted task** (full `Task` object) and an “undo window” timer.
  - Display a toast message like “Task deleted” with an **Undo** action.
  - Auto-dismiss after a configurable duration (5-10 seconds), clearing the stored deleted task so the delete becomes permanent.
- Update deletion flow:
  - On delete confirmation, capture the task being deleted **before** removing it.
  - Remove task from `tasks` immediately (current behavior), then show toast.
  - Update delete window handling for moultiple deletes (reset timer) so only the most recent delete is undoable.

- Update undo flow:
  - If Undo is clicked before expiry, re-insert the task into `tasks` with the original id and fields.
  - The restored task should appear according to existing sort/filter rules (already applied in the `filteredTasks` memo in `App.tsx`).

## Data / Backend Changes
- No backend changes (app is local-only).
- Continue using the same localStorage key: `taskloom_data`.
  - `App.tsx` already persists `tasks` via `useEffect(() => localStorage.setItem('taskloom_data', JSON.stringify(tasks)), [tasks])`.
  - Ensuring undo modifies `tasks` will automatically persist the restored list without new keys.

## Testing
Repo inspection did not reveal an existing test setup/files in the tree snapshot (no `tests/*` verified here).
- Manual verification steps (in browser):
  1. Create a task; note its properties (title/date/time) and completion state.
  2. Delete task → confirm it disappears immediately and toast appears with Undo.
  3. Click Undo within window — task reappears with same data; confirm it persists after refresh (localStorage).
  4. Delete task and wait for toast to expire → refresh; confirm task remains deleted.
  5. Confirm restored task ordering matches current sort behavior (completed last; then due datetime; then `createdAt`).

## Implementation Steps
1. Inspect current delete flow in `App.tsx` (`deleteTask` uses `confirm()` then filters by `id`).
2. Add new state in `App.tsx` to support undo:
  - Store the last deleted `Task | null`.
  - Store visibility state for toast.
  - Store/track a timeout id for auto-dismiss.
2. Update `deleteTask(id)` in `App.tsx`:
  - Find the task object in `tasks` matching `id` and store it as the “recently deleted task”.
  - Remove it from `tasks` immediately (existing `setTasks(prev => prev.filter(...))`).
  - Start/reset an auto-dismiss timer (5–10 seconds) that clears the stored deleted task + hides toast.
3. Add an `undoDelete()` handler in `App.tsx`:
  - If there is a stored deleted task, add it back into `tasks` (e.g., prepend or append — ordering will be handled by the existing sort logic in `filteredTasks`).
  - Clear toast + cancel any pending timer.
4. Add toast/snackbar markup inside `App.tsx` render:
  - Conditionally render when there is a stored deleted task / toast visible.
  - Include an Undo button wired to `undoDelete()`.
  - (Optional per AC) allow manual dismiss; on dismiss, clear stored deleted task so delete becomes permanent.
5. Verify that localStorage updates correctly after:
  - delete (task removed) and
  - undo (task restored),
  using the existing persistence effect in `App.tsx`.

## Risks / Dependencies
- **Timer cleanup / stale state:** If multiple deletes occur quickly, ensure the previous timer is cleared and the “recently deleted task” reflects the most recent delete.
- **Editing flow interaction:** `App.tsx` has `editingTask` state; if a task is deleted while being edited, ensure the UI doesn’t remain in an invalid edit state (may require clearing `editingTask` if it matches the deleted id).
- **Current confirm() behavior:** Deletion currently requires user confirmation. The story doesn’t forbid this; ensure toast appears only after confirmed deletion.
