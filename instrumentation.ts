// This file is loaded by Next.js when the experimental instrumentation hook is enabled

export async function register() {
  // Check if we are in a Node.js environment (server-side)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Only import OpenTelemetry on the server-side to avoid issues with browser code
      await import('./otel-config.js');
      console.log('OpenTelemetry instrumentation registered successfully');
    } catch (error) {
      console.error('Failed to register OpenTelemetry instrumentation:', error);
    }
  }
} 