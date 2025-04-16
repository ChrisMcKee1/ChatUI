# Progress: ChatUI

## Overall Status
- **Phase:** Feature Development
- **Status:** Planning Complete / Starting Implementation
- **Current Feature:** Conditional Tool Message Display 🛠️

## Detailed To-Do List

### Current Feature: Conditional Tool Message Display

- **Phase 1: Data Structures & Service Layer Updates** ✨ ✅
    - [x] Update `Message` Interface (`src/components/molecules/ChatMessagePanel.tsx`) ✅
        - [x] Add `'TOOL'` to `authorRole`
        - [x] Add optional `toolCall?: ToolCall[]`
        - [x] Add optional `toolCallId?: string`
        - [x] Define `ToolCall` type
    - [x] Update `ApiChatService` (`src/services/ApiChatService.ts`) ✅
        - [x] Handle `'TOOL'` role and `toolCall` field in parsing (`convertToMessage`)
        - [x] Map API response to updated `Message` interface (incl. `toolCallId`) (`convertToMessage`)
        - [x] Verify streaming compatibility (`processMultiAgentStream` updated)

- **Phase 2: State Management Enhancement** 🧠 ✅
    - [x] Enhance `ChatContext` (`src/context/ChatContext.tsx`) ✅
        - [x] Add `showToolMessages: boolean` state
        - [x] Add `toggleToolMessageVisibility: () => void` function

- **Phase 3: UI Implementation & Styling** 🎨 ✅
    - [x] Create `ToolMessageToggle` Molecule (`src/components/molecules/ToolMessageToggle/ToolMessageToggle.tsx`) ✅
    - [x] Integrate `ToolMessageToggle` into `ChatHeader` (`src/components/organisms/ChatHeader.tsx`) ✅
    - [x] Modify `MessageBubble` Molecule (`src/components/molecules/MessageBubble.tsx`) ✅
        - [x] Consume/Pass `showToolMessages` state
        - [x] Add conditional rendering for `tool` role (only show if `showToolMessages` is true)
        - [x] Add conditional rendering for `assistant` `toolCall` indicator (only show if `showToolMessages` is true)
        - [x] Add "Tool" label for `tool` messages
        - [x] Apply distinct, neutral background for `tool` messages (theme-aware)
        - [x] Consider JSON formatter/viewer for `tool` content (<pre> tag used)
    - [x] Update `ChatMessagePanel` Organism (`src/components/molecules/ChatMessagePanel.tsx`) ✅

- **Phase 4: Storybook & Testing** 🧪 ✅
    - [x] Update `MessageBubble.stories.tsx` ✅
        - [x] Add stories for `tool` messages (visible/hidden, label, background, light/dark) ✅
        - [x] Add stories for `assistant` with `toolCall` (visible/hidden) ✅
        - [x] Showcase formatted JSON rendering (<pre> used) ✅
    - [x] Create `ToolMessageToggle.stories.tsx` ✅
    - [x] Update parent stories (`ChatHeader`, `ChatMessagePanel`, `ChatPageLayout`) ✅
    - [x] Manual Testing (Mock data, toggle functionality, streaming/non-streaming) ✅

- **Phase 5: Documentation** 📝 ✅
    - [x] Update Memory Bank (`activeContext.md`, `progress.md`, `productContext.md`, `systemPatterns.md`) ✅
    - [x] Update `architectureDiagrams.md` ✅
        - [x] Diagram 1: Add `ToolMessageToggle` ✅
        - [x] Diagram 3: Add `showToolMessages` state & toggle interaction ✅
        - [x] Diagram 4: Show `TOOL`/`toolCall` handling & conditional rendering ✅

## Completed Features / Previous Tasks
*(List key completed features for context, if helpful)*
- Core Chat Functionality (Standard & Multi-Agent)
- API Integration (Mock, Real, Streaming)
- Light/Dark Theming
- Atomic Design Structure with Material UI
- Comprehensive Responsive Design
- Enhanced Loading States & Auto-Scrolling
- Markdown Support in Messages
- Service Factory Pattern & Env Config
- Azure Deployment & CI/CD Workflow
- Detailed Architecture Diagrams
- Storybook Rebuild
- Enhanced API Error Handling
- Layout Fixes & Container Sizing
- GitHub-Flavored Markdown Documentation Guidelines
- OpenTelemetry implementation with Azure Monitor
- API Response Format Update (Prioritizing Semantic Kernel `ChatMessageContent`)
- Refactored Frontend API Service (`ApiChatService.ts`)
- Final Documentation Cleanup & Standardization
- Conditional Tool Message Display 🛠️ ✅

## Known Issues
- None currently identified. 