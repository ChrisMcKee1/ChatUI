// OpenTelemetry configuration for our Next.js Chat application
// This file is imported only on the server side

// Core OpenTelemetry packages
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Define the service name and version
const resource = new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: 'chat-ui',
  [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV || 'development',
});

// Configure the OpenTelemetry SDK
const sdk = new opentelemetry.NodeSDK({
  resource: resource,
  traceExporter: new OTLPTraceExporter({
    // The default URL for the OpenTelemetry collector, change as needed
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    headers: {
      // Optional headers for authentication or other purposes
    },
  }),
  metricExporter: new OTLPMetricExporter({
    url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT || 'http://localhost:4318/v1/metrics',
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      // Enable HTTP instrumentation
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        // Ignore specific paths like healthchecks or static assets
        ignoreIncomingPaths: [/\/health$/, /\.(ico|png|jpg|jpeg|gif|svg)$/],
      },
      // Enable Next.js specific instrumentation (if available)
      '@opentelemetry/instrumentation-next': {
        enabled: true,
      },
      // Enable fetch instrumentation
      '@opentelemetry/instrumentation-fetch': {
        enabled: true,
        // Ignore specific URLs like analytics calls
        ignoreUrls: [/analytics/, /telemetry/],
      },
    }),
  ],
});

// Start the OpenTelemetry SDK
sdk.start()
  .then(() => console.log('OpenTelemetry SDK started successfully'))
  .catch((error) => console.error('Error starting OpenTelemetry SDK:', error));

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully'))
    .catch((error) => console.error('Error shutting down OpenTelemetry SDK:', error))
    .finally(() => process.exit(0));
});

module.exports = sdk; 