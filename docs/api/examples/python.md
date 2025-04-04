# Python API Implementation

This example demonstrates how to implement API endpoints for Chat UI using FastAPI. The implementation supports both standard chat and multi-agent chat with streaming and batch responses.

## Implementation

```python
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
import json
import asyncio
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

app = FastAPI()

class Message(BaseModel):
    role: str
    content: str

class MessageRequest(BaseModel):
    messages: List[Message]

class SourceReference(BaseModel):
    id: str
    title: Optional[str] = None
    url: Optional[str] = None
    snippet: Optional[str] = None

class ErrorDetail(BaseModel):
    message: str
    code: Optional[str] = None

class ChatResponse(BaseModel):
    messageId: str
    conversationId: Optional[str] = None
    status: str
    role: str = "assistant"
    content: str
    contentType: str = "text"
    agentName: Optional[str] = None
    sources: List[SourceReference] = Field(default_factory=list)
    error: Optional[ErrorDetail] = None
    createdAt: str

    @classmethod
    def create(cls, content: str, agent_name: Optional[str] = None, status: str = "completed", 
               content_type: str = "text", conversation_id: Optional[str] = None):
        """Helper method to create a standard response"""
        return cls(
            messageId=str(uuid.uuid4()),
            conversationId=conversation_id,
            status=status,
            role="assistant",
            content=content,
            contentType=content_type,
            agentName=agent_name,
            sources=[],
            error=None,
            createdAt=datetime.utcnow().isoformat() + "Z"
        )

# Standard chat endpoint
@app.post("/api/chat")
async def standard_chat_response(request: MessageRequest):
    # Get the last user message
    user_message = request.messages[-1].content if request.messages else ""
    
    # Generate a conversation ID if not tracking elsewhere
    conversation_id = str(uuid.uuid4())
    
    # Create a simple response with required fields
    response = ChatResponse.create(
        content=f"I received your message: '{user_message}'. Here's my response.",
        conversation_id=conversation_id
    )
    
    return response

# Streaming endpoint for multi-agent chat
@app.post("/api/multi-agent-chat/stream")
async def stream_multi_agent_response(request: MessageRequest):
    # Set up streaming response
    async def generate_responses():
        # Generate a conversation ID for this session
        conversation_id = str(uuid.uuid4())
        
        # Agents that will respond
        agents = ["Research", "Code", "Planning"]
        
        for agent in agents:
            # Create message ID for this agent's message
            message_id = str(uuid.uuid4())
            
            # Initial processing message
            initial_response = ChatResponse(
                messageId=message_id,
                conversationId=conversation_id,
                status="processing",
                role="assistant",
                content=f"The {agent} agent is analyzing your request...",
                contentType="text",
                agentName=agent,
                sources=[],
                error=None,
                createdAt=datetime.utcnow().isoformat() + "Z"
            )
            
            # Send initial processing message
            yield f"data: {json.dumps(initial_response.dict())}\n\n"
            await asyncio.sleep(0.5)
            
            # Send an update with more content
            update_response = ChatResponse(
                messageId=message_id,
                conversationId=conversation_id,
                status="processing",
                role="assistant",
                content=f"The {agent} agent is analyzing your request and preparing information...",
                contentType="text",
                agentName=agent,
                sources=[],
                error=None,
                createdAt=datetime.utcnow().isoformat() + "Z"
            )
            
            yield f"data: {json.dumps(update_response.dict())}\n\n"
            await asyncio.sleep(0.5)
            
            # Final completed message with sources for Research agent
            if agent == "Research":
                sources = [
                    SourceReference(
                        id="source-1",
                        title="Important Research Paper",
                        url="https://example.com/paper",
                        snippet="Relevant information from the paper..."
                    )
                ]
            else:
                sources = []
                
            final_response = ChatResponse(
                messageId=message_id,
                conversationId=conversation_id,
                status="completed",
                role="assistant",
                content=f"This is the complete response from the {agent} agent regarding your query.",
                contentType="text" if agent != "Code" else "markdown",
                agentName=agent,
                sources=sources,
                error=None,
                createdAt=datetime.utcnow().isoformat() + "Z"
            )
            
            yield f"data: {json.dumps(final_response.dict())}\n\n"
            
            # Delay between agent responses
            await asyncio.sleep(1)
    
    return StreamingResponse(
        generate_responses(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

# Error endpoint example
@app.post("/api/chat/error-example")
async def error_example():
    # Example of returning an error response
    error_response = ChatResponse(
        messageId=str(uuid.uuid4()),
        conversationId=str(uuid.uuid4()),
        status="failed",
        role="assistant",
        content="",
        contentType="text",
        sources=[],
        error=ErrorDetail(
            message="The model encountered an error processing your request.",
            code="MODEL_ERROR"
        ),
        createdAt=datetime.utcnow().isoformat() + "Z"
    )
    
    return error_response

# Batch endpoint for multi-agent chat
@app.post("/api/multi-agent-chat/batch")
async def batch_multi_agent_response(request: MessageRequest):
    # Generate a conversation ID for this session
    conversation_id = str(uuid.uuid4())
    
    # Create responses from different agents
    agents = ["Research", "Code", "Planning"]
    responses = []
    
    for agent in agents:
        # Add sources for Research agent
        if agent == "Research":
            sources = [
                SourceReference(
                    id="source-1",
                    title="Important Research Paper",
                    url="https://example.com/paper",
                    snippet="Relevant information from the paper..."
                )
            ]
        else:
            sources = []
            
        response = ChatResponse(
            messageId=str(uuid.uuid4()),
            conversationId=conversation_id,
            status="completed",
            role="assistant",
            content=f"This is a response from the {agent} agent regarding your query.",
            contentType="text" if agent != "Code" else "markdown",
            agentName=agent,
            sources=sources,
            error=None,
            createdAt=datetime.utcnow().isoformat() + "Z"
        )
        
        responses.append(response)
    
    # Return array of agent responses
    return [response.dict() for response in responses]
```

## Key Points

1. **Standardized Response Format**:
   - Uses the complete schema with all required fields:
     - `messageId`: Unique identifier for tracking and updating messages
     - `conversationId`: Optional identifier for grouping related messages
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

3. **Streaming Implementation**:
   - Demonstrates progressive updates with the same messageId
   - Shows status transitions from "processing" to "completed"
   - Provides realistic user experience with partial content updates
   - Uses Server-Sent Events for efficient streaming

4. **Source Citations**:
   - Shows how to include source references for retrieved information
   - Full structure with id, title, url, and snippet fields

5. **Error Handling**:
   - Proper error formatting with message and code
   - Demonstrates status="failed" state

6. **Pydantic Models**:
   - Strongly typed data models for validation
   - Helper method for creating standardized responses

7. **Deployment Considerations**:
   - Requires an ASGI server like Uvicorn for async support
   - Install dependencies: `pip install fastapi uvicorn pydantic`
   - Run with `uvicorn app:app --reload` for development 