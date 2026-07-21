# Design System

## Direction

A near-night underwater scene viewed from below the surface. The center is quiet and typographic; large translucent bubbles frame it like discoverable fragments. Glass is reserved for the routed reason dialog.

## Color

- Ocean Deep: `#001A33`
- Ocean Blue: `#003B73`
- Ocean Mid: `#0B6FA4`
- Ocean Aqua: `#2EC4B6`
- Ocean Foam: `#E6F7FF`

The screen is predominantly Ocean Deep. Ocean Aqua appears only in focus, reflections, and small accents.

## Typography

- Display and bubble labels: Italiana, regular.
- Interface and body: Manrope, regular through semibold.
- Display sizes remain fluid but never scale directly with viewport width.
- Letter spacing remains `0`.

## Composition

- Desktop: six deterministic bubbles orbit a centered invitation.
- Tablet: invitation followed by a stable 3 by 2 field.
- Mobile: invitation followed by a staggered two-column field with vertical scrolling.
- Dialog: centered, maximum `80dvh` on desktop and inset nearly full-screen on mobile.

## Materials and Motion

- Ocean depth comes from gradients, a faint raster seafloor, animated light rays, dense rising bubbles, caustics, and a NyxUI-inspired WebGL ripple layer that follows the pointer.
- Bubbles use radial highlights, inset reflections, a thin luminous edge, and slow independent float.
- Transitions use short ease-out curves without bounce.
- Reduced motion removes float, parallax, and transform-based entry while retaining brief opacity fades.
- The invitation uses solid warm ivory text with a coral-to-ivory gradient accent beneath it; the ocean remains predominantly blue.

## Components

- Reason bubbles are semantic links with permanent labels and responsive previews.
- The reason dialog uses shadcn/Radix primitives for focus, Escape, backdrop closing, and scroll locking.
- Empty media frames remain visible and are replaced by configured images without changing panel structure.
