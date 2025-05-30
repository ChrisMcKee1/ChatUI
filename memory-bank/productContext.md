# Product Context: ChatUI

## Problem Space
Users need a web interface to interact with both a standard chat completion service and a specialized multi-agent chat completion service, provided by a separate Java API.

## Goals
- Provide a seamless and modern user interface for chat interactions.
- Allow users to easily switch between the standard and multi-agent chat modes.
- Ensure a visually appealing experience with support for light and dark themes.
- Allow optional visibility of underlying tool/function calls happening during a chat (implemented).

## User Experience
- The UI should feel intuitive and responsive, adhering to modern web standards.
- Sending messages (via button click or Enter key) should feel immediate, even with the mock service.
- Switching between agent modes via the toggle should clearly indicate the current mode.
- Theme switching should instantly update the entire UI appearance.
- Users interested in the underlying process can toggle the visibility of tool messages (API calls and responses) within the chat flow using a dedicated control in the header. 