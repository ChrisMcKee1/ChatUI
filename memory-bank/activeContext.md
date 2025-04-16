# Active Context

## Current Focus
- **Refactor Storybook stories and run test suite** (High Priority / Current Task) 📚✨
    - Reviewing Organism stories...
    - Ensure all stories align with current component implementations and `.cursorrules` guidelines.
    - Verify the Storybook test suite passes.
- **Add Unit Tests for responsive behavior** (Medium Priority / Next Focus) 🧪
- **Document Component API** (Medium Priority) 📝
- **Implement additional accessibility improvements** (Medium Priority) ♿️

## Recent Activities
- **Completed Molecule Story Refactoring:** Reviewed and updated stories for existing molecules (`AgentToggle`, `ChatInput`, `ChatMessagePanel`, `MessageBubble`, `ThemeToggle`). Added accessibility params and interaction tests. Noted missing `ToolMessageToggle` component/story (functionality in `ChatHeader`). ✅
- **Completed Atom Story Refactoring:** Reviewed and updated stories for `Button`, `Input`, and `MarkdownRenderer` according to guidelines. Added accessibility parameters and basic interaction tests. ✅
- **Completed Conditional Tool Message Display Feature:** 🛠️ ✅
    - Updated data structures, services, context, UI components, Storybook, and documentation.
- **Fixed `MessageBubble` Issues:**
    - Corrected conditional rendering logic to properly hide/show `tool` messages.
    - Ensured distinct styling for `tool` messages and assistant avatars.
- **Completed Storybook Refactoring for All Components:** 🎉
    - Updated and verified stories for Atoms, Molecules, Organisms, and Templates.
    - Ensured adherence to `.cursorrules` Storybook guidelines.
- **Committed and Pushed Storybook Updates:** Successfully pushed refactored stories.
- **Updated Cursor Rules with Component-Specific Storybook Guidelines**: Added detailed guidelines.
- **Completed Architecture Documentation in `docs/architecture/`:** 🏗️
    - Recreated 11 key architecture diagrams.
    - Updated diagram references.
- **Updated API Documentation & Examples for Semantic Kernel Focus:** ✅
- **Implemented OpenTelemetry with Azure Monitor Integration:** ✅
- **Completed Full Project Review & Documentation Update:** ✅
- **Fixed layout and container sizing issues:** ✅
- **Completed message box text size/resolution improvement and markdown support:** ✅
- **Completed responsive design for small and very small screens:** ✅
- **Improved loading state visual feedback:** ✅
- **Established GitHub-flavored Markdown (GFM) guidelines for documentation:** ✅
- **Implemented auto-scrolling for chat messages:** ✅
- **Reorganized component structure for better maintainability:** ✅
- **Updated Storybook stories to match current component implementations:** ✅
- **Completed API service implementations:** ✅
- **Enhanced deployment environment configuration with dual approach:** ✅
- **Created comprehensive architecture diagrams to visualize the system structure:** ✅
- **Enhanced error handling in the API services:** ✅
- **Fixed Storybook Runtime Error:** Resolved a syntax error in `ChatMessagePanel.stories.tsx` that prevented Storybook from loading. ✅
- **Updated NPM Dependencies:** Ran `npm update` to resolve sub-dependency deprecation warnings and updated `package-lock.json`. ✅
- **Completed Storybook Refactoring & Verification:** Reviewed and updated all component stories (Atom, Molecule, Organism, Template) according to guidelines and verified Storybook runs correctly. ✅

## Decisions & Considerations
- **Storybook Refactoring Plan:** Systematically review and update all stories (`Atoms`, `Molecules`, `Organisms`, `Templates`) based on current component implementations and `.cursorrules` guidelines, followed by running the `test-storybook` script.
- **Tool Message Visibility**: Implemented with a toggle in the header, default hidden.
- **Tool Message Styling**: Implemented with distinct neutral background and "Tool" label.
- **Following Phased Plan**: Completed all phases for tool message visibility.
- **Architecture First**: Diagrams reviewed and updated.
- Using Material UI's responsive utilities.
- Implementing compact mode for UI components.
- Using fade transitions for loading states.
- Using MutationObserver for streaming scroll detection.
- Differentiating scrolling behaviors.
- Multi-agent responses handled correctly.
- Themes organized in dedicated directory.
- Using functional state updates.
- Ensured architecture diagrams are up to date.
- Implemented OpenTelemetry with Azure Monitor.
- Storybook stories rebuilt and aligned.
- Consistent theming in Storybook verified.
- Next.js build ignores lint/type errors for deployment.
- Mock services used for dev deployments.
- Separate frontend/backend deployments.
- **Documentation Style**: Energetic, clear, concise GFM with emojis. 😊
- **Current State**: Application is feature-complete for this phase, stable, and deployed. Focus shifts to testing, API documentation, and accessibility.
- **API Response Format Strategy:** Prioritizing Semantic Kernel `ChatMessageContent` return type for backend simplicity.

## Open Questions
- How to best represent complex JSON content within the `TOOL` message bubble? (Current: `<pre>`, future enhancement possible)
- What additional loading state enhancements would improve user experience? (Lower priority)
- How can we further optimize the chat history panel for mobile devices? (Lower priority)
- Should we implement scroll position memory when switching between chats? (Lower priority)
- Should we implement end-to-end tests for the application? (Future consideration)
- How can we better integrate architecture diagrams into the development workflow? (Ongoing process)
- **Which OpenTelemetry backend is most suitable for our needs (Jaeger, Zipkin, etc.)?** (Needs decision - Current: Azure Monitor)
- **Should we implement custom instrumentation for specific critical paths?** (Needs decision - Currently using auto-instrumentation + basic manual)
- **How can we balance comprehensive telemetry with minimal performance impact?** (Needs research/testing)
- How can we automate testing of component states using Storybook? (Future consideration)
- What's the best approach to handle linting rules in a collaborative development environment? (Lower priority)
- How can we improve the display of very long messages or code blocks in `MessageBubble`? (Future enhancement)