# Active Context: ChatUI

## Current Focus
- **Step 3: Create Basic Atoms**.
- Starting with essential UI elements like Button, Input, and Icon components within `src/components/atoms`.

## Recent Activities
- Completed **Step 2: Storybook & Atomic Design Setup**:
    - Installed and configured Storybook with default settings for Next.js, TypeScript, and Tailwind.
    - Created the Atomic Design directory structure (`atoms`, `molecules`, `organisms`, `templates`) within `src/components`.
    - Committed Storybook configuration and directory structure to the `develop` branch.
- Completed **Step 1: Project Setup & Initialization**:
    - Initialized Git repository with `main` and `develop` branches (Gitflow).
    - Set up Next.js project using `create-next-app` with TypeScript, Tailwind CSS, App Router, `src` directory, ESLint, and `@/*` import alias.
    - Integrated Memory Bank files, theme files, and original README (`README.old.md`) into the project structure.
    - Made the initial commit and committed Next.js setup to the `develop` branch.

## Next Steps
- Implement the `Button` atom component (`src/components/atoms/Button.tsx`).
- Create a corresponding Storybook story (`src/components/atoms/Button.stories.tsx`).
- Implement the `Input` atom component (`src/components/atoms/Input.tsx`) and its story.
- Implement an `Icon` atom component (`src/components/atoms/Icon.tsx`) for handling SVG icons (like the message box and robots specified in the brief) and its story.

## Decisions & Considerations
- Tailwind CSS is configured.
- Using App Router and `src` directory structure.
- Using `@/*` for absolute imports.
- Development proceeds on the `develop` branch. 