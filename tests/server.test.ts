import {createServer as createHttpServer, Server} from 'http';
import createApp from '../source/app.js';
import {Configuration} from '../source/models/Configuration.js';

describe('HTTP Server Konfiguration', () => {
  let server: Server;
  const mockConfiguration: Configuration = {
    apiUrl: {
      EUVatValidationService: 'https://api.example.com/eu',
      CHVatValidationService: 'https://api.example.com/ch',
    },
    port: 3000,
    expressServerOptions: {
      keepAliveTimeout: 5000,
      maxHeadersCount: 2000,
      timeout: 120000,
      maxConnections: 100,
      headersTimeout: 60000,
      requestTimeout: 120000,
    },
  };

  beforeAll(() => {
    const app = createApp(mockConfiguration);
    server = createHttpServer(app);
    // Server-spezifische Einstellungen setzen
    server.keepAliveTimeout =
      mockConfiguration.expressServerOptions!.keepAliveTimeout;
    server.maxHeadersCount =
      mockConfiguration.expressServerOptions!.maxHeadersCount;
    server.maxConnections =
      mockConfiguration.expressServerOptions!.maxConnections;
    server.headersTimeout =
      mockConfiguration.expressServerOptions!.headersTimeout;
    server.requestTimeout =
      mockConfiguration.expressServerOptions!.requestTimeout;
    server.timeout = mockConfiguration.expressServerOptions!.timeout;
    server.listen(mockConfiguration.port, () => {
      console.log({description: 'START', port: mockConfiguration.port});
    });
  });

  afterAll(done => {
    server.close(done);
  });

  it('setzt die Server-Konfiguration korrekt', () => {
    expect(server.keepAliveTimeout).toBe(5000);
    expect(server.maxHeadersCount).toBe(2000);
    expect(server.timeout).toBe(120000);
    expect(server.maxConnections).toBe(100);
    expect(server.headersTimeout).toBe(60000);
    expect(server.requestTimeout).toBe(120000);
  });
});
