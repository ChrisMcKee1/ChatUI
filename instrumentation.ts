// This file is loaded by Next.js when the instrumentation hook is enabled

export async function register() {
  try {
    // Import the OpenTelemetry configuration
    // This will now use a no-op implementation in development or edge environments
    const otelConfig = await import('./otel-config.js');
    
    // Start OpenTelemetry - this will be a no-op in development
    await otelConfig.default.start();
    
    console.log('Instrumentation registered');
  } catch (error) {
    // Safely log error without causing further issues
    console.error('Error in instrumentation register:', 
                  error instanceof Error ? error.message : 'Unknown error');
  }
} 