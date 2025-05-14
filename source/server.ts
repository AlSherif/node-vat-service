import { Configuration, readConfiguration } from "./models/Configuration.js";
import createApp from "./app.js";
import { createServer as createHttpServer, Server } from "http";

// read the configuration file
const configurationFile = "config.json";
const configuration: Configuration = readConfiguration(configurationFile);

// Create an Express application
  const app = createApp(configuration);

  // Create the HTTP server
const server = createHttpServer(app);

// Server-specific configurations
server.keepAliveTimeout = configuration.expressServerOptions.keepAliveTimeout;
server.maxHeadersCount = configuration.expressServerOptions.maxHeadersCount;
server.maxConnections = configuration.expressServerOptions.maxConnections;
server.headersTimeout = configuration.expressServerOptions.headersTimeout;
server.requestTimeout = configuration.expressServerOptions.requestTimeout;
server.timeout = configuration.expressServerOptions.timeout;

server.listen(configuration.port, () => {
  console.log({ description: "START", port: configuration.port });
});
export { app, server };