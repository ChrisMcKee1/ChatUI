# C# API Implementation

This example shows how to implement API endpoints for Chat UI using ASP.NET Core. The implementation supports both streaming and batch responses for multi-agent chat.

## Implementation

```csharp
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

[ApiController]
[Route("api/[controller]")]
public class MultiAgentChatController : ControllerBase
{
    // Streaming endpoint - responds with Server-Sent Events
    [HttpPost("stream")]
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
            // Create ChatMessageContent object
            var response = new ChatMessageContent
            {
                AuthorName = agent,
                Role = new Role { Label = "Assistant" },
                Items = new[]
                {
                    new TextContent
                    {
                        Text = $"This is a response from the {agent} agent regarding your query."
                    }
                },
                ModelId = "gpt-4o"
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
    
    // Batch endpoint - responds with complete ChatHistory in a single JSON response
    [HttpPost("batch")]
    public ActionResult<List<ChatMessageContent>> BatchMultiAgentResponse([FromBody] MessageRequest request)
    {
        // Create chat history to return
        var chatHistory = new List<ChatMessageContent>();
        
        // Add the original user message
        chatHistory.Add(new ChatMessageContent
        {
            Role = new Role { Label = "user" },
            Items = new[]
            {
                new TextContent
                {
                    Text = request.Messages.Count > 0 ? request.Messages[^1].Content : "No message content"
                }
            }
        });
        
        // Add responses from different agents
        var agents = new List<string> { "Research", "Code", "Planning" };
        
        foreach (var agent in agents)
        {
            chatHistory.Add(new ChatMessageContent
            {
                AuthorName = agent,
                Role = new Role { Label = "Assistant" },
                Items = new[]
                {
                    new TextContent
                    {
                        Text = $"This is a response from the {agent} agent regarding your query."
                    }
                },
                ModelId = "gpt-4o"
            });
        }
        
        // Return the entire chat history as a single JSON response
        return Ok(chatHistory);
    }
}

public class MessageRequest
{
    public List<Message> Messages { get; set; }
}

public class Message
{
    public string Role { get; set; }
    public string Content { get; set; }
}

// The predefined type provided by the system
public class ChatMessageContent
{
    public string AuthorName { get; set; }
    public Role Role { get; set; }
    public IEnumerable<IContentItem> Items { get; set; }
    public string ModelId { get; set; }
    
    // Metadata is handled by the system
}

public class Role
{
    public string Label { get; set; }
}

public interface IContentItem
{
}

public class TextContent : IContentItem
{
    public string Text { get; set; }
    public string $type => "TextContent";
}
```

## Key Points

1. **Dual Endpoint Support**:
   - `/stream` endpoint for Server-Sent Events streaming responses
   - `/batch` endpoint for traditional JSON responses with complete chat history

2. **Streaming Response**:
   - Sets `Content-Type` to `text/event-stream` for Server-Sent Events
   - Writes each agent response as an SSE event with the format `data: {json}\n\n`
   - Flushes the response buffer after each event to ensure immediate delivery

3. **Batch Response**:
   - Returns a complete `ChatHistory` array in a single JSON response
   - Includes the original user message at the beginning of the history
   - Contains responses from all agents
   - Uses standard JSON `Content-Type: application/json`

4. **Response Structure**:
   - Both endpoints use the predefined `ChatMessageContent` type
   - Only provide necessary content, while the system handles metadata and formatting
   - Each agent response includes an `AuthorName` field to identify the agent

5. **Client Integration**:
   - Client can choose between endpoints based on whether streaming is desired
   - For streaming, client should set `Accept: text/event-stream` header
   - For batch responses, client uses standard JSON handling

6. **Error Handling**:
   - In a production environment, add try-catch blocks and proper error handling
   - Consider adding cancellation token support for request cancellation 