Status: WAITING FOR APPROVAN

# Implementation Plan

## Objective
Implement a keyboard shortcut so that when a task is in edit mode, pressing Ctrl+Backspace (Windows/Linux) or Cmd+Backspace (macOS) triggers the existing delete confirmation for that same task. If confirmed, delete the task (persisted via existing localStorage behavior) and exit edit mode; if cancelled, keep the task and keep the editor open.

Jira: SCRUM-13 https://myneworg.atlassian.net/browse/SCRUM-13

## Files / Components
Verified relevant files in repo:
- `App.tsx` (contains `deleteTask` with `confirm(...)`, `editingTask` state, and passes `onCancel` + `isEditing` into `TaskForm`)
- `components/TaskForm.tsx` (edit form UI; focuses title input when `initialData` is present)
- `components/TaskCard.tsx` (invokes `onDelete(task.id)` via trash button; shows where delete is normally triggered)
- `types.ts` (Task typing; used by App/TaskForm/TaskCard)

## Frontend Changes
- Add a key handler that is active only while the task editor is open / focused (per AC).
- Detect the shortcut:
  - Windows/Linux: `Ctrl + Backspace`
  - macOS: `Meta (Cmd) + Backspace`
- When the shortcut is detected while editing:
  - Trigger the same delete confirmation message already used by `deleteTask` in `App.tsx`.
  - If confirmed: delete the currently edited task and close the editor.
  - If cancelled: do nothing and keep the editor open.

(Implementation details to be decided during dev, but must use the existing delete confirmation + existing delete behavior in `App.tsx`.)

## Data / Backend Changes
- None. Persistence is already handled via `localStorage` in `App.tsx` (`taskloom_data`) and must remain unchanged.


## Testing
Repo contains Playwright config (`playwright.config.ts`) and a `tests/` directory. Add/extend Playwright coverage later (in the development PR - not this plan PR) to verify:
- While editing a task, pressing Ctrl+Backspace shows the delete confirmation.
 - While editing a task, pressing Cmd+Backspace shows the delete confirmation.
- Confirming removes the task and closes the editor.
 - Cancelling keeps the task and keeps the editor open.
- Shortcut does not delete anything when not editing.

## Implementation Steps
1. Review current edit flow in `App.tsx`:
   - `editingTask` lifecycle (`setEditingTask(task)` from `TaskCard`, `setEditingTask(null)` on update/cancel).
   - `deleteTask(id)` uses `confirm('Are you sure you want to delete this task?')` and updates `tasks` state.
2. Decide the safest attachment point for the shortcut so it is only active during editing:
   - Likely within `components/TaskForm.tsx` (since it is the editor UI) and gated by `isEditing`.
3. Ensure the key handler can delete the *currently edited* task:
   - Confirm what identifier is available in the editor context (`initialData` is a `Task` and includes `id`).
   - Ensure deletion is routed through the existing delete behavior currently defined in `App.tsx`.4. After successful deletion confirmation:
   - Remove the task from state using the existing delete behavior.
   - Exit edit mode (set `editingTask` to `null`) so the deleted task is not displayed.
5. Verify cancel path:
   - If confirmation is cancelled, do not change state and do not exit edit mode.
6. Manually verify in browser:
   - Start editing via `TaskCard` edit button.
   - Use Ctrl/Cmd+Backspace with focus in the editor inputs.
   - Verify confirmation prompt and outcomes.

## Risks / Dependencies
- Browser/OS differences in how Backspace key combos are surfaced; need to ensure the handler correctly distinguishes Ctrl vs Meta and does not interfere with normal text editing when not intended.
- Scope control: the shortcut must not be globally active; it must be limited to the edit context (AC requirement).
- Confirmation prompt is `window.confirm(...)` in `App.tsx`; keyboard handler must trigger that same confirmation text/flow.
