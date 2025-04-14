# Java API Implementation (Semantic Kernel Focused)

This example demonstrates how to implement API endpoints for Chat UI using Spring Boot and **Microsoft Semantic Kernel for Java**.

**Recommended Approach:** Directly return the native `com.microsoft.semantickernel.services.chatcompletion.ChatMessageContent<?>` object (or a `List` of them) serialized as JSON. The frontend (`ApiChatService.ts`) is designed to parse this.

**Alternative (Non-SK):** If not using Semantic Kernel, see the [Minimal JSON Format definition](../response-formats.md#alternative-approach-minimal-json-format-non-semantic-kernel) and construct that structure manually (e.g., using `Map<String, Object>`).

The examples below focus on the recommended Semantic Kernel approach.

## Request Format

All chat endpoints expect the following JSON request body:

```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." },
    { "role": "user", "content": "latest message..." }
  ]
}
```

## Semantic Kernel `ChatMessageContent` Structure (Conceptual)

The API response should be the JSON serialization of one or more `ChatMessageContent` objects. Key fields the frontend expects:

*   `AuthorRole` (e.g., `AuthorRole.ASSISTANT`)
*   `Content` (string, primary text)
*   `AuthorName` (string, required for multi-agent)

## Implementation Example (Spring Boot with Semantic Kernel)

This example assumes you have a Semantic Kernel `Kernel` and a `ChatCompletionService` configured.

### Imports

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.microsoft.semantickernel.Kernel; // Assuming Kernel is available
import com.microsoft.semantickernel.services.chatcompletion.*; // Core SK chat types
import com.microsoft.semantickernel.services.chatcompletion.message.*; // For specific content types

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;
```

### Request and Message Classes

```java
// --- Request Body Classes (Minimal) ---

class MessageRequest {
    private List<MessageDto> messages;

    // Getters and setters
    public List<MessageDto> getMessages() { return messages; }
    public void setMessages(List<MessageDto> messages) { this.messages = messages; }
}

// Renamed to avoid conflict with SK's internal Message class if used directly
class MessageDto {
    private String role;
    private String content;

    // Getters and setters
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
```

### Controller Setup

```java
@RestController
@RequestMapping("/api")
public class ChatController {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ChatCompletionService chatCompletionService; // Injected SK service
    private final Kernel kernel; // Injected SK kernel (needed for plugins/planning)

    public ChatController(ChatCompletionService chatCompletionService, Kernel kernel) {
        this.chatCompletionService = chatCompletionService;
        this.kernel = kernel;
    }
```

### Standard Chat Endpoint

```java
    // Standard chat endpoint (/api/chat)
    @PostMapping(path = "/chat", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ChatMessageContent<?>>> standardChatResponse(@RequestBody MessageRequest request) {
        ChatHistory chatHistory = new ChatHistory();
        // Populate chatHistory from request.messages
        request.getMessages().forEach(m -> {
            AuthorRole role = AuthorRole.valueOf(m.getRole().toUpperCase());
            chatHistory.addMessage(ChatMessageTextContent.builder().withContent(m.getContent()).withAuthorRole(role).build());
        });

        // *** Semantic Kernel Integration Point ***
        // Use the injected ChatCompletionService
        // This might use kernel.invokePromptAsync if templating/plugins are needed
        // For simplicity, calling the service directly:
        List<ChatMessageContent<?>> results = chatCompletionService.getChatMessageContentsAsync(chatHistory, kernel, null).block(); 
        
        // Check if we got a result (usually one for standard chat)
        if (results == null || results.isEmpty()) {
            // Handle error: No response from AI
            return ResponseEntity.internalServerError().build(); 
        }

        // *** Return the SK object(s) directly ***
        // Usually results contains one ChatMessageContent for standard chat
        return ResponseEntity.ok(results); 
    }
```

### Multi-Agent Streaming Endpoint

```java
    // Streaming endpoint for multi-agent chat (/api/multi-agent-chat/stream)
    @PostMapping(path = "/multi-agent-chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamMultiAgentResponse(@RequestBody MessageRequest request) {
        ChatHistory chatHistory = new ChatHistory(); // Populate as in standard chat
         request.getMessages().forEach(m -> {
            AuthorRole role = AuthorRole.valueOf(m.getRole().toUpperCase());
            chatHistory.addMessage(ChatMessageTextContent.builder().withContent(m.getContent()).withAuthorRole(role).build());
        });

        // *** Semantic Kernel Integration Point ***
        // Simulate multiple agent responses for the example
        // In a real app, this would involve invoking multiple agents/plugins via the kernel
        // and handling their streaming results.

        List<String> agents = List.of("Research", "Code", "Planning");
        String tempConversationId = UUID.randomUUID().toString(); // Example ID

        return Flux.fromIterable(agents)
            .delayElements(Duration.ofSeconds(1)) // Simulate agent work
            .map(agent -> {
                // Simulate getting a ChatMessageContent result for each agent
                ChatMessageContent<?> agentResponse = ChatMessageTextContent.builder()
                    .withContent("Streamed response from the " + agent + " agent.")
                    .withAuthorRole(AuthorRole.ASSISTANT)
                    .withAuthorName(agent) // Set AuthorName for multi-agent
                    .withMetadata(Map.of("ConversationId", tempConversationId)) // Example metadata
                    .build();

                try {
                    // *** Serialize and stream the SK object directly ***
                    // Configure ObjectMapper for potential SK specific types if needed
                    String jsonResponse = objectMapper.writeValueAsString(agentResponse);
                    return "data: " + jsonResponse + "\n\n";
                } catch (JsonProcessingException e) {
                    System.err.println("Error serializing SK response for agent " + agent + ": " + e.getMessage());
                    return ""; // Send empty event or handle differently
                }
            })
            .filter(sseEvent -> !sseEvent.isEmpty());
    }
```

### Multi-Agent Batch Endpoint

```java
    // Batch endpoint for multi-agent chat (/api/multi-agent-chat/batch)
    @PostMapping(path = "/multi-agent-chat/batch", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ChatMessageContent<?>>> batchMultiAgentResponse(@RequestBody MessageRequest request) {
         ChatHistory chatHistory = new ChatHistory(); // Populate as in standard chat
         request.getMessages().forEach(m -> {
            AuthorRole role = AuthorRole.valueOf(m.getRole().toUpperCase());
            chatHistory.addMessage(ChatMessageTextContent.builder().withContent(m.getContent()).withAuthorRole(role).build());
        });

        // *** Semantic Kernel Integration Point ***
        // Simulate getting results from multiple agents/kernel invocations
        List<String> agents = List.of("Research", "Code", "Planning");
        List<ChatMessageContent<?>> responses = new ArrayList<>();
        String tempConversationId = UUID.randomUUID().toString(); // Example ID

        for (String agent : agents) {
             // Simulate getting a ChatMessageContent result for each agent
             ChatMessageContent<?> agentResponse = ChatMessageTextContent.builder()
                .withContent("Batch response from the " + agent + " agent.")
                .withAuthorRole(AuthorRole.ASSISTANT)
                .withAuthorName(agent) // Set AuthorName for multi-agent
                .withMetadata(Map.of("ConversationId", tempConversationId)) // Example metadata
                .build();
            responses.add(agentResponse);
        }

        // *** Return the List of SK objects directly ***
        return ResponseEntity.ok(responses);
    }
```

### Helper Methods

```java
    // --- Helper Methods ---
    private String getLastUserMessage(MessageRequest request) {
        if (request.getMessages() != null && !request.getMessages().isEmpty()) {
            for (int i = request.getMessages().size() - 1; i >= 0; i--) {
                Message msg = request.getMessages().get(i);
                if ("user".equalsIgnoreCase(msg.getRole())) {
                    return msg.getContent();
                }
            }
            return request.getMessages().get(request.getMessages().size() - 1).getContent();
        }
        return "";
    }
}
```

## Key Points

1.  **Return Native `ChatMessageContent`**: The recommended approach is to return the `com.microsoft.semantickernel.services.chatcompletion.ChatMessageContent<?>` object (or `List<>`) directly serialized as JSON. The frontend handles parsing.
2.  **Simplified Backend Logic**: No need to manually create specific DTOs or Maps for the response structure if using Semantic Kernel; leverage the native SK types.
3.  **Frontend Responsibility**: The frontend (`ApiChatService.ts`) is responsible for extracting the needed fields (`AuthorRole`, `AuthorName`, `Content`) from the potentially richer `ChatMessageContent` structure.
4.  **`AuthorName`**: Ensure `AuthorName` is set in `ChatMessageContent` (e.g., using `ChatMessageTextContent.builder().withAuthorName(...)`) for multi-agent scenarios.
5.  **Streaming**: For streaming, serialize and send each `ChatMessageContent` object as an individual SSE `data:` event.
6.  **Non-SK Alternative**: If not using Semantic Kernel, implement the [minimal JSON format](../response-formats.md#alternative-approach-minimal-json-format-non-semantic-kernel) using `Map<String, Object>` or custom DTOs.

This Semantic Kernel-centric approach simplifies the Java backend implementation significantly.