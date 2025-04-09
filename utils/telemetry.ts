import { trace, context, SpanStatusCode } from '@opentelemetry/api';

/**
 * Utility functions for custom telemetry in the chat application
 */

/**
 * Create a traced function that automatically captures telemetry
 * 
 * @param name The name of the operation being traced
 * @param fn The function to be traced
 * @param attributes Additional attributes to add to the span
 */
export function traced<T>(
  name: string,
  fn: () => Promise<T>,
  attributes: Record<string, string | number | boolean> = {}
): Promise<T> {
  const tracer = trace.getTracer('chat-ui');
  
  const span = tracer.startSpan(name);
  Object.entries(attributes).forEach(([key, value]) => {
    span.setAttribute(key, value);
  });
  
  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await fn();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : String(error)
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Track a chat message being sent
 * 
 * @param content The message content
 * @param agentMode The current agent mode
 */
export function trackMessageSent(content: string, agentMode: 'standard' | 'multiAgent'): void {
  const tracer = trace.getTracer('chat-ui');
  const span = tracer.startSpan('send-message');
  
  try {
    span.setAttribute('message.length', content.length);
    span.setAttribute('agent.mode', agentMode);
    span.setAttribute('message.timestamp', Date.now());
  } finally {
    span.end();
  }
}

/**
 * Track agent mode changes
 * 
 * @param newMode The new agent mode
 * @param previousMode The previous agent mode
 */
export function trackAgentModeChange(
  newMode: 'standard' | 'multiAgent',
  previousMode: 'standard' | 'multiAgent'
): void {
  const tracer = trace.getTracer('chat-ui');
  const span = tracer.startSpan('agent-mode-change');
  
  try {
    span.setAttribute('agent.new_mode', newMode);
    span.setAttribute('agent.previous_mode', previousMode);
    span.setAttribute('agent.change_timestamp', Date.now());
  } finally {
    span.end();
  }
}

/**
 * Track API request performance
 * 
 * @param endpoint The API endpoint
 * @param method The HTTP method
 * @param startTime The start time of the request
 * @param endTime The end time of the request
 * @param success Whether the request was successful
 * @param statusCode The HTTP status code
 */
export function trackApiPerformance(
  endpoint: string,
  method: string,
  startTime: number,
  endTime: number,
  success: boolean,
  statusCode?: number
): void {
  const tracer = trace.getTracer('chat-ui');
  const span = tracer.startSpan('api-request');
  
  try {
    const duration = endTime - startTime;
    
    span.setAttribute('api.endpoint', endpoint);
    span.setAttribute('api.method', method);
    span.setAttribute('api.duration_ms', duration);
    span.setAttribute('api.success', success);
    
    if (statusCode) {
      span.setAttribute('api.status_code', statusCode);
    }
    
    if (!success) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `API request failed with status ${statusCode}`
      });
    }
  } finally {
    span.end();
  }
} 