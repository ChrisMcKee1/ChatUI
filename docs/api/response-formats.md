# API Response Formats

This document provides detailed information about the request and response formats for the Chat UI API.

## Chat API

### Request Format (Both Modes)

Both standard and multi-agent chat modes use the same request format:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    },
    {
      "role": "assistant",
      "content": "I'm doing well, thank you. How can I help you today?"
    },
    {
      "role": "user",
      "content": "Can you help me with..."
    }
  ]
}
```

The request contains the entire conversation history, with the most recent message at the end of the array.

### Standard Chat Response Format

For standard chat mode, the API returns an array containing a single response object:

```json
[
  {
    "Role": {
      "Label": "Assistant"
    },
    "Items": [
      {
        "$type": "TextContent",
        "Text": "Hello! How can I assist you today?"
      }
    ],
    "ModelId": "gpt-4o",
    "Metadata": {
      "Id": "chatcmpl-BI4EcluQGKRmOnQTODKmTDVe91gDD",
      "CreatedAt": "2025-04-03T02:04:42+00:00",
      "SystemFingerprint": "fp_ded0d14823",
      "Usage": {
        "OutputTokenCount": 11,
        "InputTokenCount": 655,
        "TotalTokenCount": 666,
        "OutputTokenDetails": {
          "ReasoningTokenCount": 0,
          "AudioTokenCount": 0,
          "AcceptedPredictionTokenCount": 0,
          "RejectedPredictionTokenCount": 0
        },
        "InputTokenDetails": {
          "AudioTokenCount": 0,
          "CachedTokenCount": 0
        }
      },
      "Refusal": null,
      "FinishReason": "Stop",
      "ContentTokenLogProbabilities": []
    }
  }
]
```

### Multi-Agent Chat Response Format

The multi-agent chat API supports two response formats:

#### 1. Streaming Response (Server-Sent Events)

For streaming, each agent response is sent as a separate event in the stream:

```
data: {"AuthorName":"BusinessAnalyst","Role":{"Label":"Assistant"},"Items":[{"$type":"TextContent","Text":"The sky appears blue due to a phenomenon called Rayleigh scattering..."}],"ModelId":"gpt-4o"}

data: {"AuthorName":"SoftwareEngineer","Role":{"Label":"Assistant"},"Items":[{"$type":"TextContent","Text":"Would you like to proceed with discussing the requirements..."}],"ModelId":"gpt-4o"}
```

Each event starts with `data: ` followed by a JSON object containing a single agent's response.

#### 2. Batch Response (Complete Chat History)

Alternatively, the API can respond with a complete chat history in a single JSON array:

```json
[
  {
    "Role": {
      "Label": "user"
    },
    "Items": [
      {
        "$type": "TextContent",
        "Text": "Why is the sky blue"
      }
    ]
  },
  {
    "AuthorName": "BusinessAnalyst",
    "Role": {
      "Label": "Assistant"
    },
    "Items": [
      {
        "$type": "TextContent",
        "Text": "The sky appears blue due to a phenomenon called Rayleigh scattering..."
      }
    ],
    "ModelId": "gpt-4o"
  },
  {
    "AuthorName": "SoftwareEngineer",
    "Role": {
      "Label": "Assistant"
    },
    "Items": [
      {
        "$type": "TextContent",
        "Text": "Would you like to proceed with discussing the requirements..."
      }
    ],
    "ModelId": "gpt-4o"
  }
]
```

This format includes the original user message followed by all agent responses in a single array.

## How the Application Handles Different Formats

### Standard Mode

- Makes a normal POST request to the API
- Processes the single response and displays it as a message from the assistant

### Multi-Agent Mode

#### Streaming API
- Makes a POST request with `Accept: text/event-stream` header
- Processes a stream of Server-Sent Events (SSE), with each event being a response from a different agent
- Each agent response is displayed as a separate message with its own visual styling

#### Batch API
- Makes a normal POST request and receives a complete chat history array
- Processes each entry in the array as a separate message
- User messages are displayed normally, agent messages are styled based on the AuthorName

Each agent response is displayed as a separate message with its own visual styling based on the agent identifier. The `AuthorName` is used as the `agentIdentifier` to apply distinct styling.

## Response Type Details

The API uses a `ChatMessageContent` type with the following structure:

```typescript
interface ChatMessageContent {
  // For agent messages only - identifies which agent sent the message
  AuthorName?: string;
  
  // Message role information
  Role: {
    Label: string; // Either "user" or "Assistant"
  };
  
  // Content items - currently only text is supported
  Items: Array<{
    $type: string; // Currently always "TextContent"
    Text: string;  // The actual message content
  }>;
  
  // Model information - only for assistant messages
  ModelId?: string;
  
  // Metadata - handled by the system
  Metadata?: any;
}
```

For implementation examples in various languages, see:
- [C# Implementation](./examples/csharp.md)
- [Java Implementation](./examples/java.md)
- [Python Implementation](./examples/python.md)

## History API

The application can also communicate with a history API for managing chat histories.

### Get Chat Histories

**Request:** `GET /chat-history?mode=standard` or `GET /chat-history?mode=multiAgent`

**Response:**

```json
[
  {
    "id": "chat-123",
    "title": "API Discussion",
    "lastMessage": "Here's the API endpoint...",
    "lastUpdated": "2023-04-05T14:48:00.000Z",
    "messageCount": 12
  },
  {
    "id": "chat-124",
    "title": "Project Planning",
    "lastMessage": "Let's start with the architecture...",
    "lastUpdated": "2023-04-06T10:15:00.000Z",
    "messageCount": 8
  }
]
```

### Get Chat Messages

**Request:** `GET /chat-history/{chatId}/messages`

**Response:**

```json
[
  {
    "id": "msg-123",
    "content": "Hello, I need help with...",
    "role": "user",
    "timestamp": "10:15 AM"
  },
  {
    "id": "msg-124",
    "content": "I'll help you with that...",
    "role": "assistant",
    "timestamp": "10:16 AM",
    "agentIdentifier": "Technical"
  }
]
```

### Create New Chat

**Request:** `POST /chat-history`

```json
{
  "mode": "standard",
  "title": "New Discussion"
}
```

**Response:**

```json
{
  "id": "chat-125",
  "title": "New Discussion",
  "lastMessage": "",
  "lastUpdated": "2023-04-07T09:30:00.000Z",
  "messageCount": 0
}
```

### Update Chat

**Request:** `PUT /chat-history/{chatId}`

```json
{
  "messages": [
    {
      "id": "msg-125",
      "content": "New message content",
      "role": "user",
      "timestamp": "09:45 AM"
    },
    {
      "id": "msg-126",
      "content": "Response to the new message",
      "role": "assistant",
      "timestamp": "09:46 AM"
    }
  ]
}
```

**Response:**

```json
{
  "id": "chat-125",
  "title": "New Discussion",
  "lastMessage": "Response to the new message",
  "lastUpdated": "2023-04-07T09:46:00.000Z",
  "messageCount": 2,
  "mode": "standard"
}
```

### Delete Chat

**Request:** `DELETE /chat-history/{chatId}?mode=standard`

**Response:** HTTP 200 OK (no body) 