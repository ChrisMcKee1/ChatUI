# System Patterns: ChatUI

This document outlines the key architectural and design patterns used in the ChatUI application. For visual representations, please refer to `architectureDiagrams.md`.

## Architecture
*(Refer to: [Diagram 2: Application Architecture](architectureDiagrams.md#2-application-architecture))*
- **Frontend:** Next.js (React framework)
- **Design System:** Atomic Design principles guide component structure (`atoms`, `molecules`, `organisms`, `templates`). *(Refer to: [Diagram 1: Component Architecture](architectureDiagrams.md#1-component-architecture-atomic-design))*
- **Component Development:** Storybook is used for isolated component development, documentation, and visual testing. *(Refer to: [Storybook Implementation Guidelines](../.cursorrules))*\n- **UI Components:** Material UI provides base components, customized and extended following atomic design principles.
- **Icons:** Lucide.dev icons are imported and used directly.

## Component Strategy
*(Refer to: [Diagram 1: Component Architecture](architectureDiagrams.md#1-component-architecture-atomic-design))*
- **Atoms:** Base building blocks, often directly using Material UI components (Button, TextField) and Lucide icons.
- **Molecules:** Combine MUI components into more complex components following atomic design principles.
- **Organisms:** Build larger components that may use both MUI components and custom molecules.
- **Templates:** Arrange organisms into full page layouts (e.g., `ChatPageLayout`).

## Responsive Design Patterns
*(Refer to: [Diagram 7: Responsive Design System](architectureDiagrams.md#7-responsive-design-system))*
- **Breakpoint System:** Leverages Material UI's `useMediaQuery` hook for consistent breakpoints.
  - Standard: xs (<600px), sm (600-900px), md (900-1200px), lg (1200-1536px), xl (>1536px).
  - Custom: Extra small screens (`max-width:360px`).
- **Dynamic Sizing Strategy:**
  - Components adjust sizing (width, padding, font size) based on screen size using MUI's responsive object syntax.
  - Percentage-based widths used for very small screens.
- **Compact Mode Pattern:**
  - Components with a `compact` prop that enables a space-efficient version
  - Used primarily for UI controls (AgentToggle, ThemeToggle)
  - Applies smaller icon sizes and reduced padding in compact mode
  - Abbreviates text labels where appropriate
- **Adaptive Layout:**
  - Drawer width adjusts based on screen size (smaller on mobile devices)
  - Components reorganize with different spacing and alignment on small screens
  - Elements maintain proper touch target sizes on small screens

## Loading State Patterns
*(Refer to: [Diagram 8: Loading State System](architectureDiagrams.md#8-loading-state-system))*
- **Visual Feedback Strategy:**
  - Animated indicators (Spinners) with smooth fade transitions (MUI Fade).
  - Contextual messages varying by agent mode.
- **Loading Component Structure:**
  - Primary indicator: Spinner with context-specific text in header area
  - Secondary indicator: Additional explanatory text below the input area
  - Both indicators share contextual styling and fade animations
- **Contextual Content:**
  - Standard mode loading: "Processing your request..." / "The assistant is preparing your response..."
  - Multi-agent mode loading: "Agents are thinking..." / "Multiple AI agents are collaborating on your request..."
- **Visual Styling:**
  - Loading indicators use theme colors based on current agent mode
  - Background shading for better visibility in both light and dark themes
  - Maintains proper contrast for accessibility

## Auto-Scrolling Pattern
*(Refer to: [Diagram 9: Auto-Scrolling System](architectureDiagrams.md#9-auto-scrolling-system))*
- **Implementation Strategy:**
  - React refs access DOM elements for scrolling control.
  - `useEffect` triggers scrolling on message updates.
- **Scroll Behavior Management:**
  - Differentiates between regular updates (smooth scrolling) and streaming (immediate scrolling)
  - Uses scrollIntoView with configurable behavior parameter
  - Handles window resize events with immediate scrolling
- **Streaming Content Optimization:**
  - MutationObserver watches for changes to message content during streaming
  - Targets characterData, childList, and subtree changes
  - Immediately scrolls to bottom during active streaming
- **Component Integration:**
  - ChatMessagePanel receives isLoading prop from parent components
  - Used to determine appropriate scrolling behavior
  - ChatPageLayout passes loading state from ChatContext

## Theme Integration
*(Refer to: [Diagram 4: Theming System](architectureDiagrams.md#4-theming-system))*
- **CSS Variables:** The application uses custom CSS variables defined in theme files (`src/themes/`).
- **MUI Theme:** CSS variable values are dynamically converted to actual color values for Material UI's theme object.
- **Integration Approach:**
  - `ThemeProvider` (`src/providers/ThemeProvider.tsx`) combines the custom theme context with MUI's `ThemeProvider`.
- **Markdown Rendering Pattern:**
  - **Implementation:** Uses `micromark` with GFM extensions (`micromark-extension-gfm`) for rendering Markdown in messages.
  - **Component:** A dedicated `MarkdownRenderer` atom handles the conversion from Markdown string to HTML.
  - **Styling:** Rendered Markdown elements are styled according to the active theme (light/dark).
  - **Integration:** `MessageBubble` molecule utilizes `MarkdownRenderer` to display message content.

## Accessibility Patterns
- **Focus:** Ensuring the application is usable by everyone, including those using assistive technologies. (Ongoing Improvement)
- **Practices:**
  - Semantic HTML where appropriate.
  - ARIA attributes to enhance component roles and states.
  - Keyboard navigation support.
  - Sufficient color contrast adhering to WCAG guidelines (checked via Storybook and manual testing).
  - Focus management during interactions.

## Key Technical Decisions
- **Version Control:** Gitflow workflow.
- **API Simulation:** Mock services available for development and testing.
- **State Management:** React Context API (`ChatProvider`, `ThemeProvider`, `ServiceProvider`). *(Refer to: [Diagram 3: State Management and Data Flow](architectureDiagrams.md#3-state-management-and-data-flow))*
- **Styling:** Primarily Material UI with its theming system; Tailwind CSS utility classes used sparingly where needed.
- **Icons:** Direct import of Lucide icons.
- **Testing:** Storybook for visual/component testing; Unit tests (Jest/React Testing Library) for specific logic and responsive behavior.

## Component Relationships
*(Refer to: [Diagram 1: Component Architecture](architectureDiagrams.md#1-component-architecture-atomic-design))*
- Follows the Atomic Design hierarchy: Pages use Templates, Templates arrange Organisms, Organisms compose Molecules, Molecules are built from Atoms.

## Service Architecture
*(Refer to: [Diagram 2: Application Architecture](architectureDiagrams.md#2-application-architecture))*
- **Service Factory Pattern**: `ServiceFactory` class (`src/services/ServiceFactory.ts`) instantiates appropriate service implementations based on environment variables. *(Refer to: [Diagram 5: Environment Configuration](architectureDiagrams.md#5-environment-configuration))*
  - Determines implementations for chat, multi-agent chat, and history services.
  - Centralizes service configuration.

- **API Interface Layer**: Defined in `src/interfaces/`.
  - `IChatService`: Standard chat methods.
  - `IMultiAgentChatService`: Multi-agent chat methods.
  - `IHistoryService`: Mode-aware chat history operations.
- **Implementation Layer**:
  - `MockChatService`: Implementation for standard chat using simulated responses
  - `MockMultiAgentChatService`: Implementation for multi-agent chat using simulated responses
  - `LocalHistoryService`: Browser storage implementation with separate storage keys for each mode
    - Uses 'sparkydog-standard-histories' and 'sparkydog-multiagent-histories' as storage keys
    - Automatically filters histories based on mode parameter
  - `ApiHistoryService`: Remote API implementation that passes mode parameter to endpoints
    - Adds mode as query parameter to history endpoint calls
    - Relies on API to return only relevant histories for the specified mode
  - `ApiChatService`: Full implementation for both standard and multi-agent chat
    - Handles standard chat via regular API calls
    - Supports multi-agent chat via both streaming and batch modes
    - Processes API-specific response formats into application Message format
    - Includes proper error handling and request abortion capabilities

## State Management
*(Refer to: [Diagram 3: State Management and Data Flow](architectureDiagrams.md#3-state-management-and-data-flow))*
- **Context Providers:** Uses React Context (`ChatProvider`, `ThemeProvider`, `ServiceProvider`) located in `src/providers/`.
- **Current Mode Management**: `ChatContext` tracks the current mode (`standard` or `multiAgent`).
  - `AgentToggle` component controls the mode.
  - Mode changes trigger re-fetching of relevant chat histories.
- **In-Session Persistence**: State managed by Context providers during application runtime. No persistence between restarts.

## API Response Processing
*(Refer to: [Diagram 6: Response Processing Flow](architectureDiagrams.md#6-response-processing-flow))*
- **Semantic Kernel Focus:**
  - Recommended: Backends return native Semantic Kernel `ChatMessageContent` objects (serialized JSON).
  - Frontend `ApiChatService` parses this structure (Role, AuthorName/name, Content/Items).
- **Minimal Format Alternative:**
  - For non-SK backends, a minimal format is defined (`docs/api/response-formats.md`).
  - Requires specific fields like `Role`, `Content`/`Items`. `AuthorName` needed for multi-agent minimal format.
- **Frontend Parsing:**
  - `ApiChatService` (`src/services/ApiChatService.ts`) handles both formats.
- **Tool Message Handling**:
  - The `Message` interface includes `authorRole: 'TOOL'` and optional `toolCall: ToolCall[]` for `ASSISTANT` messages.
  - `ApiChatService` parses these fields from the API response.

## Conditional Tool Message Display Pattern 🛠️
*(Refer to: [Diagram 1: Component Architecture](architectureDiagrams.md#1-component-architecture-atomic-design), [Diagram 3: State Management and Data Flow](architectureDiagrams.md#3-state-management-and-data-flow), [Diagram 4: Message Processing Flow](architectureDiagrams.md#4-message-processing-flow))*
- **Goal**: Allow users to optionally view tool execution details (calls and results) within the chat history.
- **State Management**:
  - `ChatContext` (`src/context/ChatContext.tsx`) holds a boolean state `showToolMessages` (default: `false`).
  - A `toggleToolMessageVisibility` function in the context updates this state.
- **UI Components**:
  - `ToolMessageToggle` (Molecule - `src/components/molecules/ToolMessageToggle/ToolMessageToggle.tsx`): A UI control (Switch with label and icon) placed in `ChatHeader` to trigger `toggleToolMessageVisibility`.
  - `MessageBubble` (Molecule - `src/components/molecules/MessageBubble.tsx`): 
    - Consumes `showToolMessages` state from `ChatContext`.
    - Conditionally renders messages with `authorRole: 'TOOL'` *only if* `showToolMessages` is true.
    - Conditionally renders an indicator (e.g., a small icon or label) on `ASSISTANT` messages containing `toolCall` *only if* `showToolMessages` is true.
- **Styling**:
  - `TOOL` messages are styled with a distinct, neutral background (theme-aware), a "Tool" label, and an appropriate icon (e.g., Terminal) for clear identification when visible.
  - The display of tool content (like JSON) uses a `<pre>` tag for basic formatting. Further enhancement for complex structures is possible.
- **Service Layer Integration**:
  - `ApiChatService` (`src/services/ApiChatService.ts`) parses `TOOL` roles and `toolCall` / `toolCallId` fields from the API response (both native SK and minimal formats) and maps them to the `Message` interface.

## OpenTelemetry Observability Patterns
*(Refer to: [Diagram 2: Application Architecture](architectureDiagrams.md#2-application-architecture))*
- **Configuration Approach**: Uses Next.js instrumentation hook (`instrumentation.ts`) for server-side initialization.
  - Avoids loading SDK in the browser.
  - Configured via environment variables. *(Refer to: [Diagram 5: Environment Configuration](architectureDiagrams.md#5-environment-configuration))*

- **Instrumentation Strategy**:
  - **Auto-Instrumentation**: OpenTelemetry's auto-instrumentations for HTTP on the server.
  - **Server-Side Focus**: Node.js server-side components only.
  - **Backend Integration**: Direct integration with Azure Monitor. *(Refer to: [Diagram 2: Application Architecture](architectureDiagrams.md#2-application-architecture) and [Diagram 10: Deployment Architecture](architectureDiagrams.md#10-deployment-architecture) for context)*

- **Telemetry Data Collection**:
  - **Tracing**: Distributed traces for server-side request processing.
  - **Resource Attributes**: Includes service name, version, and environment information for proper context
  - **Azure Monitor Integration**: Sends telemetry directly to Azure Application Insights

- **Resource Management**:
  - Implements proper SDK startup and shutdown procedures
  - Ensures graceful termination with SIGTERM handler
  - Provides detailed error logging for initialization failures

- **Deployment Considerations**:
  - Azure-specific implementation optimized for Azure Application Insights
  - Configurable connection string through environment variables
  - Environment-aware configuration to adapt to deployment context
  - Webpack configuration to handle Node.js specific modules 