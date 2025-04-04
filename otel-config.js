// OpenTelemetry configuration for our Next.js Chat application
// Simple stub configuration to avoid runtime errors

// Create a no-op telemetry SDK that satisfies the interface but doesn't do anything
const noopSdk = {
  start: () => Promise.resolve(console.log('OpenTelemetry: Using no-op implementation')),
  shutdown: () => Promise.resolve(console.log('OpenTelemetry: No-op shutdown')),
  // Add other methods as needed with no-op implementations
};

// Only try to initialize if in a production Node.js environment
let sdk = noopSdk;

try {
  // Only load this in a true Node.js server environment, not during build
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV === 'production' &&
    process.env.NEXT_RUNTIME === 'nodejs' &&
    typeof process.env.EDGE_RUNTIME === 'undefined'
  ) {
    // Core OpenTelemetry packages
    const opentelemetry = require('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
    const { Resource } = require('@opentelemetry/resources');
    const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

    // Only create the SDK in production
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'chat-ui',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV
    });

    sdk = new opentelemetry.NodeSDK({
      resource: resource,
      traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
      }),
      metricExporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics',
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-http': { enabled: true },
          '@opentelemetry/instrumentation-next': { enabled: true },
          '@opentelemetry/instrumentation-fetch': { enabled: true },
        }),
      ],
    });

    // Handle graceful shutdown only in production
    process.on('SIGTERM', () => {
      sdk.shutdown()
        .catch(error => console.error('Error shutting down OpenTelemetry:', error))
        .finally(() => process.exit(0));
    });

    console.log('OpenTelemetry production SDK initialized');
  } else {
    console.log('OpenTelemetry: Not in production Node.js environment, using no-op implementation');
  }
} catch (error) {
  console.error('Failed to initialize OpenTelemetry:', error);
  // Fallback to no-op implementation
}

// Exports for both CommonJS and ESM
module.exports = sdk;
module.exports.default = sdk; 