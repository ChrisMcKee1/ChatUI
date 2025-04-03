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

## Responsive Design Patterns
- **Breakpoint System:** Uses Material UI's useMediaQuery hook for consistent breakpoints across the application
  - Standard breakpoints: xs (<600px), sm (600-900px), md (900-1200px), lg (1200-1536px), xl (>1536px)
  - Custom breakpoint for very small screens: `(max-width:360px)`
- **Dynamic Sizing Strategy:**
  - Components set sizing values (width, padding, font size) conditionally based on screen size
  - Uses responsive object syntax from Material UI (e.g., `p: { xs: 2, sm: 3, md: 4 }`)
  - Calculates percentage-based widths for very small screens where needed
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
- **Visual Feedback Strategy:**
  - Animated indicators with smooth fade transitions using Material UI's Fade component
  - Contextual messages that change based on the current agent mode
  - Secondary descriptive messages to provide additional context
  - Disabled state for input elements during loading
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
- **Implementation Strategy:** 
  - Uses React refs to access DOM elements for scrolling
  - Employs useEffect hooks to trigger scrolling when messages change
  - Implements MutationObserver to detect DOM changes during streaming
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
- Using Material UI's useMediaQuery hook for responsive breakpoints.
- Implementing compact mode pattern for mobile optimization.
- Using fade transitions for loading states to improve perceived performance.

## Component Relationships (Planned)
- **Pages** (e.g., Chat Page) will use **Templates** (e.g., `ChatPageLayout`).
- **Templates** will arrange **Organisms** (e.g., `Header`, `ChatHistoryPanel`, `ChatInputArea`).
- **Organisms** are composed of **Molecules** (e.g., `ChatHistoryPanel` uses `MessageBubble`, `ChatInputArea` uses `ChatInput`).
- **Molecules** are built from **Atoms** (e.g., `ChatInput` uses MUI TextField and Button) and Lucide icons.

## Service Architecture
- **Service Factory Pattern**: `ServiceFactory` class creates appropriate service implementations based on environment variables
  - Inspects environment variables to determine which implementation to create
  - Creates chat, multi-agent chat, and history services with appropriate implementations
  - Provides a single point of configuration for all service creation

- **API Interface Layer**: Clear interfaces for all API communications
  - `IChatService`: Interface defining standard chat-related service methods
  - `IMultiAgentChatService`: Interface defining multi-agent chat-related service methods
  - `IHistoryService`: Interface for chat history operations, with mode-aware methods
    - `getHistories(mode: 'standard' | 'multiAgent')`: Fetches histories for specific mode
    - `saveHistory(history)`: Saves history with mode information
    - `deleteHistory(id, mode)`: Deletes history for specific mode
    - `clearHistories(mode)`: Clears all histories for a specific mode

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

- **Service Registration**: Services registered and accessed through a service factory pattern
  - Factory determines which implementation to use based on environment variables
  - Each service type has its own mode setting for individual control
  - History service is created based on NEXT_PUBLIC_CHAT_HISTORY_MODE environment variable

## State Management
- **Current Mode Management**: Application tracks the current chat mode
  - AgentToggle component controls the current mode 
  - Mode changes trigger reloading of appropriate chat histories
  - Mode is stored in React state (no persistence needed across page reloads)

- **In-Session Persistence**: Chat history and state management during application runtime
  - Uses React context for sharing state across components
  - Maintains current chat mode ('standard' or 'multiAgent') in state
  - Loads appropriate histories when mode changes
  - No persistence between application restarts (intentional design)

- **Mode-Specific History**: Chat histories are separated by mode
  - Standard and multi-agent histories are stored separately
  - UI displays only histories relevant to current mode
  - History operations (create, read, delete) respect current mode

- **Environment Configuration**: Environment variables control API endpoints and modes
  - Individual mode settings for each service type (standard chat, multi-agent chat, history)
  - Local development can mix mock and real implementations as needed
  - Production builds can target real endpoints through environment configuration 

## API Response Processing
- **Standard Chat Responses**:
  - Processed as single message from array response
  - Extracts text content from items with type "TextContent"
  - Converts API format to application Message format

- **Multi-Agent Responses**:
  - Supports two response modes: streaming and batch
  - Streaming mode uses Server-Sent Events (SSE) protocol
  - Each agent response comes as separate event in the stream
  - Processes events by extracting AuthorName for agent identification
  - Creates separate Message objects for each agent response
  - Agent responses styled with distinct colors in the UI
  - Batch mode processes an array of responses
  - Each response includes agent identification information

- **Error Handling**:
  - API calls include proper error handling and user feedback
  - Supports request abortion for cancelling in-progress requests
  - Maintains user message in case of API failure to allow retries
  - Uses AbortController for clean cancellation of in-flight requests 

## OpenTelemetry Observability Patterns

- **Configuration Approach**: Uses Next.js instrumentation hook to initialize OpenTelemetry only on the server side
  - Keeps OpenTelemetry configuration in a separate file (otel-config.js)
  - Only imports OpenTelemetry in a Node.js environment to avoid browser compatibility issues
  - Uses environment variables for flexible configuration

- **Instrumentation Strategy**:
  - **Auto-Instrumentation**: Leverages OpenTelemetry's auto-instrumentations for Next.js, HTTP, and fetch
  - **Custom Instrumentation**: Uses utility functions for manual instrumentation of:
    - User actions (e.g., sending messages, changing agent mode)
    - API calls with detailed performance metrics
    - Component render performance

- **Telemetry Data Collection**:
  - **Tracing**: Captures distributed traces for request processing across the application
  - **Metrics**: Records performance metrics for API calls and component renders
  - **Attributes**: Adds contextual information to spans for better analysis
    - Agent mode, message count, and content length for user actions
    - Response times and error details for API calls
    - Component-specific details for render performance

- **Resource Management**:
  - Uses sampling to control the amount of telemetry data collected
  - Implements timeout mechanism for long-running spans
  - Ensures proper cleanup of resources with span.end() calls

- **Error Handling Integration**:
  - Enhances existing error handling with detailed span attributes
  - Records error types, messages, and stack traces when available
  - Maintains spans for errors to track failure points

- **Deployment Considerations**:
  - Configurable endpoints for different environments (development, staging, production)
  - Service name and version tracking for proper identification
  - Environment-aware configuration to adapt to deployment context

- **Observability Backend Options**:
  - Configured to work with standard OpenTelemetry collectors
  - Compatible with Jaeger, Zipkin, Prometheus, and other observability tools
  - Enables seamless switching between backends without code changes 