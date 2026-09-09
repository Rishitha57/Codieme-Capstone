Status: WAITING FOR APPROVAL

# Implementation Plan

## Objective
Add an always-available one-click “Clear Search” control to the existing task search input so that when `searchQuery` is non-empty, a small clear (X) button appears inside the input and resets `searchQuery` to an empty string (`''`) without changing the current `filter`.

Jira: SCRUM-6
Jira URL: https://myneworg.atlassian.net/browse/SCRUM-6

## Files / Components
- `App.tsx`
  - Contains the search input UI and owns `searchQuery` / `setSearchQuery` state.
  - Implements filtering via `useMemo` using `searchQuery`.
- `components/EmptyState.tsx`
  - Already provides an action button (“Clear Search & Filter”) in the no-results state that resets both filter and search.

## Frontend Changes
- Update the search input section in `App.tsx` (currently a `div` with `relative` positioning that contains the `<input>` and a left-aligned search icon).
- When `searchQuery.trim().length > 0`, render an additional right-aligned button inside the same relative container:
  - Visual: small “X” icon/button aligned to the right, vertically centered, inside the input area.
  - Behavior:
    - `onClick` sets `searchQuery` to `''` via `setSearchQuery('')`.
    - Must not change `filter`.
- Adjust input padding in `App.tsx` as heeded so text does not overlap the new right-side button (currently `pr-4`).


## Data / Backend Changes
- None. Search state is local React state (`searchQuery`) and tasks are stored in `localStorage` (`taskloom_data`).


## Testing
- Manual verification (in browser):
  - Enter text in the search input → clear (X) appears.
  - Click clear (X) → input becomes empty and full list returns (subject to current filter).
  - Confirm `filter` selection is unchanged after clearing search.
  - Verify clear (X) does not appear when search is empty/whitespace.
- Automated tests:
  - No existing test coverage for this behavior was verified in the repository (only `playwright.config.ts` and a `tests/` directory are present; specific search-related tests were not inspected/confirmed).

## Implementation Steps
1. In `App.tsx`, locate the “Search & Intelligence” block containing the `<input>` bound to `searchQuery` and the left search icon.
2. Introduce a derived boolean (or inline check) equivalent to the existing `isSearchActive` logic (`searchQuery.trim().length > 0`) to conditionally render the clear button.
 3. Add a right-positioned button element inside the same `relative` container:
   - `onClick={() => setSearchQuery('')}`
   - Use an “X” icon (SVG) similar in style to the existing search icon.
4 . Update the input’s right padding so typing doesn’t overlap the clear button.
 5. Run the manual verification steps above for both:
   - non-empty search where results exist
   - non-empty search with no results (ensuring this control complements, not replaces, the EmptyState action).

## Risks / Dependencies
- Styling/layout risk: the new right-side button may overlap input text unless right padding is increased.
- Behavior consistency: ensure the clear button only resets `searchQuery` and does not interfere with the existing no-results EmptyState action which clears both `filter` and `searchQuery`.
