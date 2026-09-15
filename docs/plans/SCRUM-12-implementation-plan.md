Status: WAITING FOR APPROVAL

# Implementation Plan

## Objective
Add an edit-mode-only keyboard shortcut (Ctrl+Backspace on Windows/Linux, Cmd+Backspace on macOS) that triggers the existing delete confirmation for the currently edited task. If confirmed, delete the task using the existing delete behavior and persist via existing localStorage key `taskloom_data`. If cancelled, remain in edit mode with no changes.

Jira: SCRUM-12 https://myneworg.atlassian.net/browse/SCRUM-12

## Files / Components
- `components/TaskForm.tsx` (task edit/add form; currently receives `initialData` and `isEditing`)
- `App.tsx` (holds `editingTask` state and `deleteTask(id)` which uses `confirm(...)` and updates `tasks` persisted to `taskloom_data`)
- `components/TaskCard.tsx` (invokes `onDelete(task.id)` this is the existing delete flow the shortcut must reuse)

## Frontend Changes
- Add a keydown handler while the form is in edit mode.
- Detect modifier + Backspace:
  - Windows/Linux: `Ctrl` + `Backspace`
  - macOS: `Meta` (Cmd) + `Backspace`
- Ensure it does not interfere with normal typing:
  - Only act when `ctrlKey` or `metaKey`  is pressed.
- When triggered in edit mode, invoke the existing delete flow for the currently edited task:
  - Must display the same confirmation prompt used today.
  - On confirm: delete the task and exit edit mode (consistent with existing behavior where the edited task would no longer exist).
  - On cancel: do nothing; remain in edit mode.
- Ensure no effect when:
  - creating a new task (`isEditing` false)
  - no task is being edited.

## Data / Backend Changes
- None.
- Persistence remains unchanged: `App.tsx` already saves `tasks` into `localStorage` under `taskloom_data` on tasks state changes.


## Testing
- Add/extend Playwright coverage to verify shortcut behavior:
  - Enter edit mode for an existing task.
  - Press shortcut and handle confirm dialog:
    - Accept -> task removed from list.
    - Dismiss -> task remains and edit mode remains active.
  - Verify shortcut has no effect in add mode.

## Implementation Steps
1. Verify current delete behavior is centralized in `App.tsx` `deleteTask(id)` (uses `confirm('Are you sure you want to delete this task?')` and updates `tasks`).
2. Decide where to implement the shortcut so it can reuse `deleteTask(id)` with the currently edited task id:
  - Option A (likely): add an `onDeleteCurrent` callback prop to `TaskForm` that `App.tsx` wires to `deleteTask(editingTask.id)`.
  - Keep activation gated by `isEditing` and presence of `initialData`.
3. In `components/TaskForm.tsx`, attach a keydown listener (e.g., on the form element or via `useEffect` with `window.addEventListener`) that:
  - checks `isEditing` and `initialData?.id`
  - checks `(e.ctrlKey || e.metaKey) && e.key === 'Backspace'`
  - prevents default and calls `onDeleteCurrent`.
4. In `App.tsx`, pass the handler only when `editingTask` is set; ensure that on confirmed deletion, the edit form is no longer showing (may require clearing `editingTask` if it isn't implicitly cleared by removal).
5. Add/adjust Playwright spec(s) to cover the new shortcut path, including confirm accept/dismiss and add-mode no-op.

## Risks / Dependencies
- Browser/OS key differences: macOS uses `metaKey` (Cmd), Windows/Linux uses `ctrlKey`; ensure both are supported.
- Event handler scope: attaching to `window` vs form/input can change when the shortcut fires; must ensure it only applies during edit mode.
- Confirm dialog handling in Playwright: tests must explicitly accept/dismiss the `confirm(...)` dialog.

Approval:
- Approve
- Reject / Request Changes

HITL CHECKPOINT:
Implementation plan is ready for review.
Nothing has been changed in Git.
Approve or provide feedback.