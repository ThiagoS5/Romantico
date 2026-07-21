# Custom Ocean Cursor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the fish image the fine-pointer default, including selectable text, and the cat image the interactive cursor.

**Architecture:** Keep the behavior in the existing global stylesheet with CSS custom properties backed by the provided public assets. Scope the custom cursors to fine-pointer devices so touch devices keep native interaction. Extend the existing Playwright ocean test file with computed-style assertions.

**Tech Stack:** React, TypeScript, Vite, CSS, Playwright.

## Global Constraints

- Use `public/mouse/peixe.png` for the default fine-pointer cursor.
- Use `public/mouse/gato.png` for semantic interactive controls.
- Let readable and selectable content inherit the fish cursor; selection remains native.
- Do not apply image cursors to coarse-pointer or touch devices.
- Preserve existing keyboard focus styles and modal route behavior.

---

### Task 1: Add Scoped Cursor Styling

**Files:**
- Modify: `src/styles/globals.css`

**Interfaces:**
- Consumes: public asset URLs `/mouse/peixe.png` and `/mouse/gato.png`.
- Produces: CSS cursor behavior for `.ocean-shell`, interactive descendants, and readable text descendants on fine-pointer devices.

- [ ] **Step 1: Add CSS cursor tokens below the existing root color tokens**

```css
--cursor-fish: url("/mouse/peixe.png") 4 4;
--cursor-cat: url("/mouse/gato.png") 4 4;
```

- [ ] **Step 2: Add the fine-pointer cursor rules after the base `button` rule**

```css
@media (pointer: fine) {
  .ocean-shell {
    cursor: var(--cursor-fish), default;
  }

  .ocean-shell :is(a, button, [role="button"], input, select, textarea, summary) {
    cursor: var(--cursor-cat), pointer;
  }

}
```

- [ ] **Step 3: Ensure interactive selectors override the inherited fish cursor**

```css
@media (pointer: fine) {
  .ocean-shell :is(a, button, [role="button"], input, select, textarea, summary) {
    cursor: var(--cursor-cat), pointer;
  }
}
```

- [ ] **Step 4: Run lint**

Run: `npm run lint`

Expected: exit code 0.

### Task 2: Add Browser Coverage For Cursor States

**Files:**
- Modify: `e2e/ocean.spec.ts`

**Interfaces:**
- Consumes: computed CSS cursor values from Task 1.
- Produces: a desktop-only regression test for fish and cat cursor states.

- [ ] **Step 1: Add a desktop cursor test**

```ts
test('desktop maps fish and cat cursors to their intended surfaces', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium', 'Fine-pointer cursor check')
  await page.goto('/')

  const fishCursor = await page.getByTestId('ocean-layout').evaluate((element) => getComputedStyle(element).cursor)
  const catCursor = await page.getByRole('link', { name: /Poesia/i }).evaluate((element) => getComputedStyle(element).cursor)
  const headingCursor = await page.getByRole('heading', { name: /por que você deveria dar uma chance a mim/i }).evaluate((element) => getComputedStyle(element).cursor)

  expect(fishCursor).toContain('peixe-32.png')
  expect(catCursor).toContain('gato-32.png')
  expect(headingCursor).toContain('peixe-32.png')
})
```

- [ ] **Step 2: Run the cursor regression test**

Run: `npx playwright test -g "fish and cat cursors"`

Expected: one desktop test passes and the mobile project skips it.

- [ ] **Step 3: Run the full verification suite**

Run: `npm test -- --run`

Expected: all Vitest tests pass.

Run: `npm run build`

Expected: Vite production build completes successfully.

Run: `npm run test:e2e`

Expected: all enabled Playwright tests pass with no console errors.

- [ ] **Step 4: Commit the feature**

```bash
git add src/styles/globals.css e2e/ocean.spec.ts docs/superpowers/specs/2026-07-20-custom-ocean-cursor-design.md docs/superpowers/plans/2026-07-20-custom-ocean-cursor.md
git commit -m "feat: add ocean-themed cursors"
```
