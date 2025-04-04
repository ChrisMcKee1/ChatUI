# Java API Implementation

This example demonstrates how to implement API endpoints for Chat UI using Spring Boot. The implementation supports both standard chat and multi-agent chat with streaming and batch responses.

## Minimal Implementation

Here's a minimal implementation example that uses the simplified response format:

```java
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class MinimalChatController {

    @PostMapping("/chat")
    public List<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        // Minimal response format
        List<Map<String, Object>> response = new ArrayList<>();
        
        Map<String, Object> messageObj = new HashMap<>();
        List<Map<String, Object>> items = new ArrayList<>();
        
        Map<String, Object> textItem = new HashMap<>();
        textItem.put("Text", "This is the response from the Java API.");
        
        items.add(textItem);
        messageObj.put("Items", items);
        response.add(messageObj);
        
        return response;
    }
}
```

This minimal implementation:
1. Returns an array containing one object
2. The object has an "Items" array
3. The item in the array has a "Text" field with the response content

## Complete Implementation

```java
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Standard chat endpoint
    @PostMapping(path = "/chat", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChatResponse> standardChatResponse(@RequestBody MessageRequest request) {
        // Get the last user message
        String userMessage = "";
        if (request.getMessages() != null && !request.getMessages().isEmpty()) {
            userMessage = request.getMessages().get(request.getMessages().size() - 1).getContent();
        }
        
        // Create conversation ID
        String conversationId = UUID.randomUUID().toString();
        
        // Create response with all required fields
        ChatResponse response = new ChatResponse();
        response.setMessageId(UUID.randomUUID().toString());
        response.setConversationId(conversationId);
        response.setStatus("completed");
        response.setRole("assistant");
        response.setContent("I received your message: '" + userMessage + "'. Here's my response.");
        response.setContentType("text");
        response.setSources(new ArrayList<>());
        response.setError(null);
        response.setCreatedAt(Instant.now().toString());
        
        return ResponseEntity.ok(response);
    }

    // Streaming endpoint for multi-agent chat
    @PostMapping(path = "/multi-agent-chat/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamMultiAgentResponse(@RequestBody MessageRequest request) {
        // Generate a conversation ID for this session
        String conversationId = UUID.randomUUID().toString();
        
        // Define the agents that will respond
        List<String> agents = List.of("Research", "Code", "Planning");
        
        // Return a stream of SSE events
        return Flux.fromIterable(agents)
                .concatMap(agent -> {
                    // Create a message ID for this agent's response
                    String messageId = UUID.randomUUID().toString();
                    
                    // Return a flux of progressive updates for this agent
                    return Flux.concat(
                        // Initial processing message
                        Flux.just(createProcessingMessage(messageId, conversationId, agent, 
                            "The " + agent + " agent is analyzing your request..."))
                            .delayElement(Duration.ofMillis(100)),
                        
                        // Update with more content
                        Flux.just(createProcessingMessage(messageId, conversationId, agent,
                            "The " + agent + " agent is analyzing your request and preparing information..."))
                            .delayElement(Duration.ofSeconds(1)),
                        
                        // Final completed message
                        Flux.just(createCompletedMessage(messageId, conversationId, agent,
                            "This is the complete response from the " + agent + " agent regarding your query.",
                            agent.equals("Research")))
                            .delayElement(Duration.ofSeconds(1))
                    );
                });
    }
    
    // Helper method to create a processing message
    private String createProcessingMessage(String messageId, String conversationId, String agent, String content) {
        ChatResponse response = new ChatResponse();
        response.setMessageId(messageId);
        response.setConversationId(conversationId);
        response.setStatus("processing");
        response.setRole("assistant");
        response.setContent(content);
        response.setContentType("text");
        response.setAgentName(agent);
        response.setSources(new ArrayList<>());
        response.setError(null);
        response.setCreatedAt(Instant.now().toString());
        
        try {
            return "data: " + objectMapper.writeValueAsString(response) + "\n\n";
        } catch (JsonProcessingException e) {
            return "data: {\"error\": \"Failed to serialize response\"}\n\n";
        }
    }
    
    // Helper method to create a completed message
    private String createCompletedMessage(String messageId, String conversationId, String agent, 
                                         String content, boolean includeSources) {
        ChatResponse response = new ChatResponse();
        response.setMessageId(messageId);
        response.setConversationId(conversationId);
        response.setStatus("completed");
        response.setRole("assistant");
        response.setContent(content);
        response.setContentType(agent.equals("Code") ? "markdown" : "text");
        response.setAgentName(agent);
        
        // Add sources for Research agent
        List<SourceReference> sources = new ArrayList<>();
        if (includeSources) {
            SourceReference source = new SourceReference();
            source.setId("source-1");
            source.setTitle("Important Research Paper");
            source.setUrl("https://example.com/paper");
            source.setSnippet("Relevant information from the paper...");
            sources.add(source);
        }
        
        response.setSources(sources);
        response.setError(null);
        response.setCreatedAt(Instant.now().toString());
        
        try {
            return "data: " + objectMapper.writeValueAsString(response) + "\n\n";
        } catch (JsonProcessingException e) {
            return "data: {\"error\": \"Failed to serialize response\"}\n\n";
        }
    }
    
    // Error example endpoint
    @PostMapping(path = "/chat/error-example", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ChatResponse> errorExample() {
        // Example of returning an error response
        ChatResponse errorResponse = new ChatResponse();
        errorResponse.setMessageId(UUID.randomUUID().toString());
        errorResponse.setConversationId(UUID.randomUUID().toString());
        errorResponse.setStatus("failed");
        errorResponse.setRole("assistant");
        errorResponse.setContent("");
        errorResponse.setContentType("text");
        errorResponse.setSources(new ArrayList<>());
        
        ErrorDetail error = new ErrorDetail();
        error.setMessage("The model encountered an error processing your request.");
        error.setCode("MODEL_ERROR");
        errorResponse.setError(error);
        
        errorResponse.setCreatedAt(Instant.now().toString());
        
        return ResponseEntity.ok(errorResponse);
    }
    
    // Batch endpoint for multi-agent chat
    @PostMapping(path = "/multi-agent-chat/batch", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ChatResponse>> batchMultiAgentResponse(@RequestBody MessageRequest request) {
        // Generate a conversation ID for this session
        String conversationId = UUID.randomUUID().toString();
        
        // Create responses from different agents
        List<String> agents = List.of("Research", "Code", "Planning");
        List<ChatResponse> responses = new ArrayList<>();
        
        for (String agent : agents) {
            ChatResponse agentResponse = new ChatResponse();
            agentResponse.setMessageId(UUID.randomUUID().toString());
            agentResponse.setConversationId(conversationId);
            agentResponse.setStatus("completed");
            agentResponse.setRole("assistant");
            agentResponse.setContent("This is a response from the " + agent + " agent regarding your query.");
            agentResponse.setContentType(agent.equals("Code") ? "markdown" : "text");
            agentResponse.setAgentName(agent);
            
            // Add sources for Research agent
            List<SourceReference> sources = new ArrayList<>();
            if (agent.equals("Research")) {
                SourceReference source = new SourceReference();
                source.setId("source-1");
                source.setTitle("Important Research Paper");
                source.setUrl("https://example.com/paper");
                source.setSnippet("Relevant information from the paper...");
                sources.add(source);
            }
            
            agentResponse.setSources(sources);
            agentResponse.setError(null);
            agentResponse.setCreatedAt(Instant.now().toString());
            
            responses.add(agentResponse);
        }
        
        // Return array of agent responses
        return ResponseEntity.ok(responses);
    }
}

class MessageRequest {
    private List<Message> messages;
    
    // Getters and setters
    public List<Message> getMessages() {
        return messages;
    }
    
    public void setMessages(List<Message> messages) {
        this.messages = messages;
    }
}

class Message {
    private String role;
    private String content;
    
    // Getters and setters
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
}

class SourceReference {
    @JsonProperty("id")
    private String id;
    
    @JsonProperty("title")
    private String title;
    
    @JsonProperty("url")
    private String url;
    
    @JsonProperty("snippet")
    private String snippet;
    
    // Getters and setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getUrl() {
        return url;
    }
    
    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getSnippet() {
        return snippet;
    }
    
    public void setSnippet(String snippet) {
        this.snippet = snippet;
    }
}

class ErrorDetail {
    @JsonProperty("message")
    private String message;
    
    @JsonProperty("code")
    private String code;
    
    // Getters and setters
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
}

// Standardized response class with all required fields
class ChatResponse {
    @JsonProperty("messageId")
    private String messageId;
    
    @JsonProperty("conversationId")
    private String conversationId;
    
    @JsonProperty("status")
    private String status;
    
    @JsonProperty("role")
    private String role;
    
    @JsonProperty("content")
    private String content;
    
    @JsonProperty("contentType")
    private String contentType;
    
    @JsonProperty("agentName")
    private String agentName;
    
    @JsonProperty("sources")
    private List<SourceReference> sources;
    
    @JsonProperty("error")
    private ErrorDetail error;
    
    @JsonProperty("createdAt")
    private String createdAt;
    
    // Getters and setters
    public String getMessageId() {
        return messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    
    public String getConversationId() {
        return conversationId;
    }
    
    public void setConversationId(String conversationId) {
        this.conversationId = conversationId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getContentType() {
        return contentType;
    }
    
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    
    public String getAgentName() {
        return agentName;
    }
    
    public void setAgentName(String agentName) {
        this.agentName = agentName;
    }
    
    public List<SourceReference> getSources() {
        return sources;
    }
    
    public void setSources(List<SourceReference> sources) {
        this.sources = sources;
    }
    
    public ErrorDetail getError() {
        return error;
    }
    
    public void setError(ErrorDetail error) {
        this.error = error;
    }
    
    public String getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
```

## Key Points

1. **Standardized Response Format**:
   - Uses the complete schema with all required fields:
     - `messageId`: Unique identifier for tracking and updating messages
     - `conversationId`: Identifier for grouping related messages
     - `status`: "processing", "completed", or "failed"
     - `role`: Always "assistant" for responses
     - `content`: The actual message content
     - `contentType`: "text" or "markdown"
     - `agentName`: Only for multi-agent responses
     - `sources`: Array of source references when available
     - `error`: Details when status is "failed"
     - `createdAt`: ISO 8601 timestamp

2. **Multiple Endpoint Support**:
   - `/api/chat` endpoint for standard chat responses
   - `/api/multi-agent-chat/stream` endpoint for streaming multi-agent responses
   - `/api/multi-agent-chat/batch` endpoint for batch multi-agent responses
   - `/api/chat/error-example` showing how to format errors

3. **Standard Chat**:
   - Returns a single response object with all required fields
   - Simple JSON structure that's easy to process

4. **Reactive Streaming**:
   - Demonstrates progressive updates with the same messageId
   - Shows status transitions from "processing" to "completed"
   - Uses helper methods to create consistent messages
   - Uses Spring WebFlux with `Flux` for efficient reactive streaming

5. **Source Citations**:
   - Shows how to include source references for retrieved information
   - Full structure with id, title, url, and snippet fields
   - Conditionally includes sources for specific agent types

6. **Error Handling**:
   - Proper error formatting with message and code
   - Dedicated endpoint example for error responses
   - Demonstrates status="failed" state

7. **Performance Considerations**:
   - Reactive processing for efficient handling of streaming responses
   - Helper methods to reduce code duplication
   - Efficient concatMap for sequential streaming of agent responses