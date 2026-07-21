# Custom Ocean Cursor Design

## Goal

Use the provided cursor assets to reinforce the underwater experience on pointer-based devices without reducing text selection, keyboard navigation, or touch usability.

## Behavior

- `public/mouse/peixe.png` is the default cursor across the ocean scene.
- `public/mouse/gato.png` appears over interactive controls: reason links, buttons, dialog controls, and form-like controls if added later.
- Readable content keeps the fish cursor while native text selection remains available.
- Coarse-pointer and touch devices retain the system cursor behavior.

## Implementation

- Define cursor custom properties in the existing global CSS tokens.
- Apply the fish cursor to the page shell only inside `@media (pointer: fine)`.
- Apply the cat cursor to semantic interactive selectors within the same media query.
- Let readable content inherit the fish cursor; cursor styling does not affect native text selection.
- Do not modify route behavior, focus styles, or dialog interaction.

## Accessibility And Fallbacks

- Keyboard focus indicators remain unchanged.
- Native cursor values are included as fallbacks after each image cursor declaration.
- The cursor customization is not applied on touch devices, where cursor imagery has no useful interaction meaning.

## Verification

- Verify fish cursor on background regions and cat cursor on bubbles and modal controls with computed-style E2E assertions.
- Verify text blocks inherit the fish cursor.
- Run lint, unit tests, build, and the existing Playwright suite.
