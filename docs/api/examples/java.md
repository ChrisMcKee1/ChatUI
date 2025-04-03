# Java API Implementation

This example demonstrates how to implement API endpoints for Chat UI using Spring Boot. The implementation supports both streaming responses (Server-Sent Events) and traditional JSON batch responses.

## Implementation

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/api/multi-agent-chat")
public class MultiAgentChatController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Streaming endpoint - responds with Server-Sent Events
    @PostMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamMultiAgentResponse(@RequestBody MessageRequest request) {
        // Define the agents that will respond
        List<String> agents = List.of("Research", "Code", "Planning");
        
        // Return a stream of SSE events
        return Flux.fromIterable(agents)
                .delayElements(Duration.ofSeconds(1)) // Delay between responses
                .map(agent -> {
                    // Create ChatMessageContent object
                    ChatMessageContent response = new ChatMessageContent();
                    response.setAuthorName(agent);
                    
                    Role role = new Role();
                    role.setLabel("Assistant");
                    response.setRole(role);
                    
                    List<ContentItem> items = new ArrayList<>();
                    TextContent textContent = new TextContent();
                    textContent.setText("This is a response from the " + agent + " agent regarding your query.");
                    items.add(textContent);
                    response.setItems(items);
                    
                    response.setModelId("gpt-4o");
                    
                    // Format as SSE event
                    try {
                        return "data: " + objectMapper.writeValueAsString(response) + "\n\n";
                    } catch (JsonProcessingException e) {
                        return "data: {\"error\": \"Failed to serialize response\"}\n\n";
                    }
                });
    }
    
    // Batch endpoint - responds with complete ChatHistory in a single JSON response
    @PostMapping(path = "/batch", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ChatMessageContent>> batchMultiAgentResponse(@RequestBody MessageRequest request) {
        // Create chat history to return
        List<ChatMessageContent> chatHistory = new ArrayList<>();
        
        // Add the original user message
        ChatMessageContent userMessage = new ChatMessageContent();
        Role userRole = new Role();
        userRole.setLabel("user");
        userMessage.setRole(userRole);
        
        List<ContentItem> userItems = new ArrayList<>();
        TextContent userContent = new TextContent();
        
        // Extract the last user message if available
        String messageText = "No message content";
        if (request.getMessages() != null && !request.getMessages().isEmpty()) {
            messageText = request.getMessages().get(request.getMessages().size() - 1).getContent();
        }
        userContent.setText(messageText);
        userItems.add(userContent);
        userMessage.setItems(userItems);
        
        chatHistory.add(userMessage);
        
        // Add responses from different agents
        List<String> agents = Arrays.asList("Research", "Code", "Planning");
        
        for (String agent : agents) {
            ChatMessageContent agentResponse = new ChatMessageContent();
            agentResponse.setAuthorName(agent);
            
            Role assistantRole = new Role();
            assistantRole.setLabel("Assistant");
            agentResponse.setRole(assistantRole);
            
            List<ContentItem> items = new ArrayList<>();
            TextContent textContent = new TextContent();
            textContent.setText("This is a response from the " + agent + " agent regarding your query.");
            items.add(textContent);
            agentResponse.setItems(items);
            
            agentResponse.setModelId("gpt-4o");
            
            chatHistory.add(agentResponse);
        }
        
        // Return the entire chat history
        return ResponseEntity.ok(chatHistory);
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

// The predefined type provided by the system
class ChatMessageContent {
    private String authorName;
    private Role role;
    private List<ContentItem> items;
    private String modelId;
    
    // Getters and setters
    public String getAuthorName() {
        return authorName;
    }
    
    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public List<ContentItem> getItems() {
        return items;
    }
    
    public void setItems(List<ContentItem> items) {
        this.items = items;
    }
    
    public String getModelId() {
        return modelId;
    }
    
    public void setModelId(String modelId) {
        this.modelId = modelId;
    }
    
    // Metadata is handled by the system
}

class Role {
    private String label;
    
    public String getLabel() {
        return label;
    }
    
    public void setLabel(String label) {
        this.label = label;
    }
}

interface ContentItem {
}

class TextContent implements ContentItem {
    private String text;
    
    public String getText() {
        return text;
    }
    
    public void setText(String text) {
        this.text = text;
    }
    
    // Jackson will use this to add the $type field
    public String get$type() {
        return "TextContent";
    }
}
```

## Key Points

1. **Dual Endpoint Support**:
   - `/stream` endpoint for Server-Sent Events streaming responses
   - `/batch` endpoint for traditional JSON responses with complete chat history

2. **Reactive Streaming**:
   - Uses Spring WebFlux with `Flux` for reactive streaming on the `/stream` endpoint
   - Returns proper content type (`MediaType.TEXT_EVENT_STREAM_VALUE`) for SSE
   - Formats each response as an SSE event with `data: {json}\n\n`

3. **Batch Response**:
   - Returns a complete `ChatHistory` array in a single JSON response via the `/batch` endpoint
   - Includes the original user message at the beginning of the history
   - Contains responses from all agents in a single response
   - Uses standard JSON content type (`MediaType.APPLICATION_JSON_VALUE`)

4. **Response Structure**:
   - Both endpoints use the predefined `ChatMessageContent` class 
   - Only provide necessary content, while the system handles metadata
   - Each agent response includes the `AuthorName` field for agent identification

5. **Client Integration**:
   - Client can choose between endpoints based on whether streaming is desired
   - For streaming, client sets `Accept: text/event-stream` header
   - For batch responses, client uses standard JSON parsing

6. **Error Handling**:
   - Streaming endpoint includes basic error handling for JSON serialization
   - Batch endpoint returns appropriate HTTP status codes
   - In production, add more robust error handling and logging

7. **Dependencies**:
   - Requires Spring Boot with WebFlux for streaming
   - Uses Jackson for JSON serialization
</rewritten_file> 