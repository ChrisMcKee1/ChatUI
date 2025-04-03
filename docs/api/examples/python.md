# Python API Implementation

This example demonstrates how to implement API endpoints for Chat UI using FastAPI. The implementation supports both streaming responses (Server-Sent Events) and traditional JSON batch responses.

## Implementation

```python
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
import json
import asyncio
from typing import List, Optional, Any
from pydantic import BaseModel, Field

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class MessageRequest(BaseModel):
    messages: List[Message]

# The predefined types provided by the system
class Role(BaseModel):
    label: str

class TextContent(BaseModel):
    text: str
    
    # Pydantic will use this to add the $type field
    class Config:
        fields = {"type": {"alias": "$type"}}
        
    type: str = "TextContent"

class ChatMessageContent(BaseModel):
    author_name: str = Field(None, alias="AuthorName")
    role: Role = Field(..., alias="Role")
    items: List[Any] = Field(..., alias="Items")
    model_id: str = Field(None, alias="ModelId")
    
    class Config:
        allow_population_by_field_name = True

# Streaming endpoint
@app.post("/api/multi-agent-chat/stream")
async def stream_multi_agent_response(request: MessageRequest):
    # Set up streaming response
    async def generate_responses():
        # Agents that will respond
        agents = ["Research", "Code", "Planning"]
        
        for agent in agents:
            # Create ChatMessageContent object
            response = ChatMessageContent(
                AuthorName=agent,
                Role=Role(label="Assistant"),
                Items=[TextContent(text=f"This is a response from the {agent} agent regarding your query.")],
                ModelId="gpt-4o"
            )
            
            # Format as SSE event
            yield f"data: {response.json()}\n\n"
            
            # Delay between responses
            await asyncio.sleep(1)
    
    return StreamingResponse(
        generate_responses(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

# Batch endpoint
@app.post("/api/multi-agent-chat/batch")
async def batch_multi_agent_response(request: MessageRequest):
    # Create chat history to return
    chat_history = []
    
    # Add the original user message
    user_message_text = "No message content"
    if request.messages and len(request.messages) > 0:
        user_message_text = request.messages[-1].content
        
    user_message = ChatMessageContent(
        Role=Role(label="user"),
        Items=[TextContent(text=user_message_text)]
    )
    
    chat_history.append(user_message)
    
    # Add responses from different agents
    agents = ["Research", "Code", "Planning"]
    
    for agent in agents:
        agent_response = ChatMessageContent(
            AuthorName=agent,
            Role=Role(label="Assistant"),
            Items=[TextContent(text=f"This is a response from the {agent} agent regarding your query.")],
            ModelId="gpt-4o"
        )
        
        chat_history.append(agent_response)
    
    # Return the entire chat history as a single JSON response
    return chat_history
```

## Key Points

1. **Dual Endpoint Support**:
   - `/stream` endpoint for Server-Sent Events streaming responses
   - `/batch` endpoint for traditional JSON responses with complete chat history

2. **FastAPI Integration**:
   - Uses FastAPI's `StreamingResponse` for efficient streaming on the `/stream` endpoint
   - Returns standard JSON from the `/batch` endpoint
   - Leverages Python's async capabilities for non-blocking I/O

3. **Streaming Responses**:
   - Sets appropriate headers and media type for SSE
   - Uses an async generator function to yield responses one at a time
   - Formats each response as an SSE event with `data: {json}\n\n`

4. **Batch Responses**:
   - Returns a complete `ChatHistory` array in a single JSON response
   - Includes the original user message at the beginning of the history
   - Contains responses from all agents
   - Uses standard JSON content type

5. **Response Structure**:
   - Both endpoints use Pydantic models for `ChatMessageContent`
   - Only provides the required content, while the system handles metadata
   - Properly aliases fields to match the expected JSON format with correct casing

6. **Request Handling**:
   - Uses Pydantic for request validation and serialization
   - Leverages FastAPI's built-in JSON parsing and validation
   - Properly handles both streaming and batch response formats

7. **Deployment Considerations**:
   - Requires an ASGI server like Uvicorn or Hypercorn for async support
   - Use `pip install fastapi uvicorn pydantic` for dependencies
   - Run with `uvicorn app:app --reload` for development 