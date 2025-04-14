# Message Processing Flow

This sequence diagram shows the steps involved when a user sends a message, including standard vs. multi-agent logic, API/storage interactions, and loading state changes.

```mermaid
%%{init: {'theme':'dark'}}%%
sequenceDiagram
    participant User
    participant UI as UI Components
    participant ChatCtx as ChatContext
    participant ChatSvc as ChatService
    participant HistorySvc as HistoryService
    participant API as External API
    participant Storage as Local Storage
    
    User->>UI: Submit message
    UI->>ChatCtx: sendMessage(content)
    
    ChatCtx->>ChatCtx: Add user message to state
    ChatCtx->>UI: Update with user message
    
    ChatCtx->>ChatCtx: Set loading state
    ChatCtx->>UI: Update loading indicators
    
    alt Standard Mode
        ChatCtx->>ChatSvc: sendMessage(userMessage)
        ChatSvc->>API: POST /chat with message
        API-->>ChatSvc: Minimal Response (Items[].Text)
        ChatSvc-->>ChatCtx: Return constructed Message object
    else Multi-Agent Mode
        ChatCtx->>ChatSvc: sendMultiAgentMessage(userMessage)
        alt Streaming
            ChatCtx->>ChatSvc: sendMultiAgentMessage(userMessage)
            ChatSvc->>API: POST /multi-agent-chat/stream with message
            API-->>ChatSvc: Stream of SSE events (each with Minimal Response format)
            ChatSvc-->>ChatCtx: Stream constructed Message objects
        else Batch
            ChatCtx->>ChatSvc: sendMultiAgentMessage(userMessage)
            ChatSvc->>API: POST /multi-agent-chat/batch with message
            API-->>ChatSvc: Array of Minimal Responses (Items[].Text, AuthorName)
            ChatSvc-->>ChatCtx: Return array of constructed Message objects
        end
    end
    
    ChatCtx->>ChatCtx: Add constructed Message(s) to state
    ChatCtx->>UI: Update with response
    
    ChatCtx->>HistorySvc: saveMessages(chatId, messages)
    
    alt Local History Mode
        HistorySvc->>Storage: Save to localStorage
    else API History Mode
        HistorySvc->>API: POST /history/save with messages
    end
    
    ChatCtx->>ChatCtx: Clear loading state
    ChatCtx->>UI: Update UI (hide loading indicators)
    
    UI->>User: Display complete conversation
``` 