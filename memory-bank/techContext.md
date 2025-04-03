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
- **Themes:** Light and Dark modes, defined by provided `DarkTheme.json` and `LightTheme.json`.
- **Responsive Design:** Material UI's useMediaQuery hook and breakpoint system
- **Loading Animations:** Material UI's Fade component and CSS transitions

## Responsive Design Technologies
- **Breakpoint System:** Material UI's useMediaQuery hook paired with theme breakpoints
- **Responsive Properties:** MUI's responsive object syntax for properties like padding and margin
- **Custom Breakpoints:** CSS media queries for specific needs (e.g., very small screens)
- **Adaptive Components:** Props-based configuration (e.g., `compact` prop) for size variations
- **Screen Size Detection:** Client-side detection with mounted state to prevent hydration mismatches

## User Experience Enhancements
- **Loading States:** 
  - Material UI's Fade component for smooth transitions
  - Lucide's Loader2 icon with CSS animation for spinner effects
  - Contextual loading messages based on app state
  - Layered feedback with primary and secondary indicators
- **Touch Experience:**
  - Properly sized touch targets for mobile (minimum 44x44px effective area)
  - Optimized drawer behavior for touch screens
  - Responsive padding and spacing to prevent touch errors

## Dependencies (Planned Initial)
- `next`, `react`, `react-dom`, `typescript` (via `create-next-app`)
- `@storybook/...` dependencies (via Storybook CLI)
- `tailwindcss` for additional styling and customization
- `lucide-react` for icons
- `@mui/material`, `@emotion/react`, `@emotion/styled` for Material UI components
- State management library (if chosen, e.g., `zustand`)

## Environment Configuration
- **API Endpoints**: Three environment variables define service endpoints:
  - `NEXT_PUBLIC_STANDARD_CHAT_API_URL`: URL for standard chat endpoint
  - `NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL`: URL for multi-agent chat endpoint
  - `NEXT_PUBLIC_CHAT_HISTORY_API_URL`: URL for chat history endpoint
- **API Modes**: Three environment variables control which implementation to use:
  - `NEXT_PUBLIC_STANDARD_CHAT_API_MODE`: Set to 'mock' or 'api' for standard chat
  - `NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE`: Set to 'mock' or 'api' for multi-agent chat
  - `NEXT_PUBLIC_CHAT_HISTORY_MODE`: Set to 'local' for browser storage or 'api' for remote endpoint
- Environment variables are exposed through Next.js's environment variables system
- Local development can configure each service individually for better flexibility

### Deployment Environment Configuration
- **Build-time Configuration (Development & CI/CD)**:
  - Local development uses `.env.local` file
  - CI/CD builds use GitHub Secrets to generate `.env` file
  - Variables are passed to build environment in GitHub Actions
  - All environment variables (client and server) use this approach during development

- **Runtime Configuration (Azure Production)**:
  - Runtime variables for backend/API are configured in Azure App Settings
  - Can be configured via Azure Portal or programmatically via GitHub Actions
  - Allows updating configuration without rebuilds
  - Recommended approach for production environment in Azure
  - Uses azure/appservice-settings action:
    ```yaml
    - uses: azure/appservice-settings@v1
      with:
        app-name: 'app-name'
        mask-inputs: true
        app-settings-json: '[{ "name": "SETTING_NAME", "value": "SETTING_VALUE" }]'
    ```

### Azure Key Vault Integration
- Sensitive information can be stored in Azure Key Vault
- Static Web App can access Key Vault via system-assigned managed identity
- Key Vault secrets are referenced using `@Microsoft.KeyVault(...)` syntax
- Only available on Azure Static Web Apps Standard plan
- Only supported in production environment

## Next.js Build Configuration
- **ESLint and TypeScript Error Handling**:
  - Build process configured to ignore ESLint and TypeScript errors
  - Configuration in `next.config.ts`:
    ```typescript
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    }
    ```
  - Prevents build failures due to linting or type errors
  - Used primarily for deployment builds
  - Local development should still address errors

## GitHub Workflow Configuration
- **GitHub Actions Workflow**: 
  - Defined in `.github/workflows/azure-static-web-apps.yml`
  - Workflow includes:
    - Checkout of source code
    - Node.js setup
    - Dependency installation
    - Environment file generation from GitHub Secrets
    - Build and test
    - Deployment to Azure Static Web Apps
  - Supports multiple trigger types:
    - Push to main branch
    - Pull request events
    - Manual trigger (workflow_dispatch)
  - No API backend connected directly to this Static Web App

## API Integration
- **Standard Chat API**: Configured via `NEXT_PUBLIC_STANDARD_CHAT_API_URL` and `NEXT_PUBLIC_STANDARD_CHAT_API_MODE`
  - Returns an array with a single response containing Items with text content
  - Processed as a single response message
- **Multi-agent Chat API**: Configured via `NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL` and `NEXT_PUBLIC_MULTI_AGENT_CHAT_API_MODE`
  - Implemented as a streaming API using Server-Sent Events (SSE)
  - Each agent's response comes as a separate event in the stream
  - Uses AuthorName to identify different agents for styling
  - Supports fallback to non-streaming mode if needed
- **History API**: Configured via `NEXT_PUBLIC_CHAT_HISTORY_API_URL` and `NEXT_PUBLIC_CHAT_HISTORY_MODE`
- **Service Implementation**:
  - `ApiChatService`: Makes HTTP calls to chat endpoints with proper error handling and request abortion
    - Handles both normal requests and streaming requests
    - Processes API-specific response formats into our application's Message format
  - `ApiHistoryService`: Full CRUD operations for chat history management
  - Services selected via `ServiceFactory` based on environment variables
  - Mock implementations available for development and testing

## Constraints
- Must consume external Java APIs (standard chat, multi-agent chat) eventually.
- Requires a modern, high-quality UI. 