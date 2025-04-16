// Mock modules for Storybook
// Provides mock implementations of modules that shouldn't be used in Storybook

// This will intercept the import of useServices from ServiceProvider and replace it with our mock
// in MockServiceProvider.tsx

// We need this because the real useServices depends on browser APIs or environment variables
// that aren't available in the Storybook environment

// Mock modules that rely on Node.js specific features
if (typeof window !== 'undefined') {
  // Define __dirname in browser context
  window.__dirname = '';
  window.process = window.process || {};
  window.process.env = window.process.env || {};
  
  // Mock other Node.js globals as needed
  window.global = window;
  
  // Let's explicitly create the mocks before the modules are loaded
  // This is needed because OpenTelemetry API expects __dirname to be defined
  window.mockOpenTelemetry = {
    trace: {
      getTracer: () => ({
        startSpan: () => ({
          end: () => {},
        }),
      }),
    },
    context: { active: () => ({}) },
    propagation: { inject: () => {} },
  };
} 