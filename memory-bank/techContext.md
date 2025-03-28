# Technical Context: ChatUI

## Core Technologies
- **Framework:** Next.js
- **Language:** TypeScript
- **UI Library:** React
- **Component Libraries:** Material UI, Lucide
- **Component Development:** Storybook
- **Version Control:** Git (with Gitflow workflow)

## Development Setup
- Node.js/npm environment required.
- Specific setup steps TBD following `create-next-app`.

## Styling & Theming
- **Approach:** Tailwind CSS with Material UI components
- **Icons:** Lucide.dev icons
- **Themes:** Light and Dark modes, defined by provided `Monokai Pro Dark theme.json` and `Monokai Pro Light theme.json`.

## Dependencies (Planned Initial)
- `next`, `react`, `react-dom`, `typescript` (via `create-next-app`)
- `@storybook/...` dependencies (via Storybook CLI)
- `tailwindcss` for additional styling and customization
- `lucide-react` for icons
- `@mui/material`, `@emotion/react`, `@emotion/styled` for Material UI components
- State management library (if chosen, e.g., `zustand`)

## Constraints
- Must consume external Java APIs (standard chat, multi-agent chat) eventually.
- Requires a modern, high-quality UI. 