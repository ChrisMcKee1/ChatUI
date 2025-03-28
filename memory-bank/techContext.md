# Technical Context: ChatUI

## Core Technologies
- **Framework:** Next.js
- **Language:** TypeScript
- **UI Library:** React
- **Component Development:** Storybook
- **Version Control:** Git (with Gitflow workflow)

## Development Setup
- Node.js/npm environment required.
- Specific setup steps TBD following `create-next-app`.

## Styling & Theming
- **Approach:** TBD (Tailwind CSS, CSS Modules, CSS-in-JS like Emotion/styled-components are candidates).
- **Themes:** Light and Dark modes, defined by provided `Monokai Pro Dark theme.json` and `Monokai Pro Light theme.json`.

## Dependencies (Planned Initial)
- `next`, `react`, `react-dom`, `typescript` (via `create-next-app`)
- `@storybook/...` dependencies (via Storybook CLI)
- Styling library (if chosen, e.g., `tailwindcss`, `emotion`, `styled-components`)
- State management library (if chosen, e.g., `zustand`)

## Constraints
- Must consume external Java APIs (standard chat, multi-agent chat) eventually.
- Requires a modern, high-quality UI. 