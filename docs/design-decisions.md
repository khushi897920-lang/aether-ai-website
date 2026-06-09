# Design Decisions - Aether AI Website

This document records the architectural and style choices made for the **Aether AI Enterprise Platform** static website.

## 1. Style & Theme Architecture
- **Pure CSS3**: Styling is partitioned across specialized files (e.g. `base.css` for variables/resets, `layout.css` for grids/flex, `components.css` for UI widgets).
- **Harmonious Palette**: Custom properties are declared in `:root` inside `base.css` adhering to professional high-contrast dark rules:
  - Deep Green (`#003c33`)
  - Dark Primary Ink (`#17171c`)
  - Coral Accent (`#ff7759`)
  - Soft background surfaces (`#eeece7`, `#f5f3ee`).

## 2. Interactive Features
- **Forms Handling**: Real-time validation checks for blank fields and email patterns using vanilla JS and snackbar feedback.
- **Scroll Transitions**: Viewport intersection thresholds fade in key features dynamically with options to honor `prefers-reduced-motion` settings.
- **Unified Dark Footer**: A synchronized, high-contrast dark footer block across all page modules.
