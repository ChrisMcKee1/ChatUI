# System Patterns: ChatUI

## Architecture
- **Frontend:** Next.js (React framework)
- **Design System:** Atomic Design principles will guide component structure (`atoms`, `molecules`, `organisms`, `templates`).
- **Component Development:** Storybook will be used for isolated component development and documentation.
- **UI Components:** Material UI will be used for base components, with custom components built on top following atomic design principles.
- **Icons:** Lucide.dev icons are imported and used directly throughout the application.

## Component Strategy
- **Atoms:** Use Material UI components directly where possible (Button, TextField, etc.) and import Lucide icons directly.
- **Molecules:** Combine MUI components into more complex components following atomic design principles.
- **Organisms:** Build larger components that may use both MUI components and custom molecules.
- **Templates:** Arrange organisms into full page layouts.

## Theme Integration
- **CSS Variables:** Our application uses CSS variables for theming defined in theme files.
- **MUI Theme:** We convert CSS variable values to actual color values for Material UI.
- **Integration Approach:**
  - ThemeProvider component combines our theme context with MUI's ThemeProvider.
  - We extract computed values of CSS variables at runtime to use in MUI theme.
  - For components that need theme colors, we provide the actual color values rather than CSS variables.
  - Lucide icons receive color values directly via props rather than through CSS.

## Key Technical Decisions
- Gitflow workflow for version control.
- Mock service for initial API simulation.
- State management solution TBD (React Context or Zustand likely).
- Styling approach: Tailwind CSS with Material UI, using the MUI theming system for customization.
- Using Lucide.dev icons imported directly in components instead of a wrapper component.

## Component Relationships (Planned)
- **Pages** (e.g., Chat Page) will use **Templates** (e.g., `ChatPageLayout`).
- **Templates** will arrange **Organisms** (e.g., `Header`, `ChatHistoryPanel`, `ChatInputArea`).
- **Organisms** are composed of **Molecules** (e.g., `ChatHistoryPanel` uses `MessageBubble`, `ChatInputArea` uses `ChatInput`).
- **Molecules** are built from **Atoms** (e.g., `ChatInput` uses MUI TextField and Button) and Lucide icons. 