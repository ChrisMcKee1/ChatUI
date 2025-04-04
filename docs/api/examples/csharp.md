# C# API Implementation

This example shows how to implement API endpoints for Chat UI using ASP.NET Core. The implementation supports both standard chat and multi-agent chat with streaming and batch responses.

## Implementation

```csharp
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

[ApiController]
[Route("api")]
public class ChatController : ControllerBase
{
    // Standard chat endpoint
    [HttpPost("chat")]
    public ActionResult<ChatResponse> StandardChatResponse([FromBody] MessageRequest request)
    {
        // Get the last user message
        string userMessage = request.Messages.Count > 0 ? request.Messages[^1].Content : "";
        
        // Create a simple response with all required fields
        var response = new ChatResponse
        {
            MessageId = Guid.NewGuid().ToString(),
            ConversationId = Guid.NewGuid().ToString(),
            Status = "completed",
            Role = "assistant",
            Content = $"I received your message: '{userMessage}'. Here's my response.",
            ContentType = "text",
            Sources = new List<SourceReference>(),
            Error = null,
            CreatedAt = DateTime.UtcNow.ToString("o")
        };
        
        // Return as JSON
        return Ok(response);
    }

    // Streaming endpoint for multi-agent chat
    [HttpPost("multi-agent-chat/stream")]
    public async Task StreamMultiAgentResponse([FromBody] MessageRequest request)
    {
        // Configure response for SSE
        Response.Headers.Add("Content-Type", "text/event-stream");
        Response.Headers.Add("Cache-Control", "no-cache");
        Response.Headers.Add("Connection", "keep-alive");
        
        // Simulate responses from different agents
        var agents = new List<string> { "Research", "Code", "Planning" };
        
        foreach (var agent in agents)
        {
            // Create response with minimum required fields
            var response = new AssistantResponse
            {
                Role = "assistant",
                Content = $"This is a response from the {agent} agent regarding your query.",
                AgentName = agent
            };
            
            // Serialize to JSON
            string jsonResponse = JsonSerializer.Serialize(response);
            
            // Send as SSE event
            await Response.WriteAsync($"data: {jsonResponse}\n\n");
            await Response.Body.FlushAsync();
            
            // Add delay between responses to simulate thinking time
            await Task.Delay(1000);
        }
    }
    
    // Batch endpoint for multi-agent chat
    [HttpPost("multi-agent-chat/batch")]
    public ActionResult<List<ChatResponse>> BatchMultiAgentResponse([FromBody] MessageRequest request)
    {
        // Create responses from different agents
        var agents = new List<string> { "Research", "Code", "Planning" };
        var responses = new List<ChatResponse>();
        
        foreach (var agent in agents)
        {
            responses.Add(new AssistantResponse
            {
                Role = "assistant",
                Content = $"This is a response from the {agent} agent regarding your query.",
                AgentName = agent
            });
        }
        
        // Return array of agent responses
        return Ok(responses);
    }
}

public class MessageRequest
{
    public List<Message> Messages { get; set; } = new List<Message>();
}

public class Message
{
    public string Role { get; set; }
    public string Content { get; set; }
}

// Simplified response model with only required fields
public class AssistantResponse
{
    public string Role { get; set; }
    public string Content { get; set; }
    
    [JsonPropertyName("agentName")]
    public string AgentName { get; set; }
}
```

## Key Points

1. **Simplified Response Format**:
   - Uses only the minimum required fields:
     - `role`: Always "assistant" for responses
     - `content`: The actual message content
     - `agentName`: Only for multi-agent responses

2. **Multiple Endpoint Support**:
   - `/api/chat` endpoint for standard chat responses
   - `/api/multi-agent-chat/stream` endpoint for streaming multi-agent responses
   - `/api/multi-agent-chat/batch` endpoint for batch multi-agent responses

3. **Standard Chat**:
   - Returns a single response object with role and content
   - Simple JSON structure that's easy to process

4. **Streaming Response**:
   - Sets `Content-Type` to `text/event-stream` for Server-Sent Events
   - Writes each agent response as an SSE event with the format `data: {json}\n\n`
   - Flushes the response buffer after each event to ensure immediate delivery

5. **Batch Response**:
   - Returns an array of agent responses in a single JSON response
   - Each response contains only the required fields
   - Uses standard JSON `Content-Type: application/json`

6. **JSON Serialization**:
   - Uses `JsonPropertyName` attribute to ensure the correct casing for `agentName`
   - Standard System.Text.Json serialization

7. **Error Handling**:
   - In a production environment, add try-catch blocks and proper error handling
   - Consider adding cancellation token support for request cancellation 