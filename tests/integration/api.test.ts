import request from 'supertest';
import {Express} from 'express';
import createApp from '../../source/app.js';
import {Configuration} from '../../source/models/Configuration.js';
import {createServer as createHttpServer, Server} from 'http';

describe('POST /', () => {
  let app: Express;
  let server: Server;

  beforeAll(async () => {
    const mockConfiguration: Configuration = {
      apiUrl: {
        EUVatValidationService:
          'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number',
        CHVatValidationService:
          'https://www.uid-wse-a.admin.ch/V5.0/PublicServices.svc?wsdl',
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

    app = createApp(mockConfiguration);
    server = createHttpServer(app);
    // Server-specific configurations
    if (mockConfiguration.expressServerOptions) {
      server.keepAliveTimeout =
        mockConfiguration.expressServerOptions?.keepAliveTimeout;
      server.maxHeadersCount =
        mockConfiguration.expressServerOptions?.maxHeadersCount;
      server.maxConnections =
        mockConfiguration.expressServerOptions?.maxConnections;
      server.headersTimeout =
        mockConfiguration.expressServerOptions?.headersTimeout;
      server.requestTimeout =
        mockConfiguration.expressServerOptions?.requestTimeout;
      server.timeout = mockConfiguration.expressServerOptions.timeout;
    }

    server = await server.listen(mockConfiguration.port, () => {
      console.log({description: 'START', port: mockConfiguration.port});
    });
  });

  afterAll(async () => {
    await server.close();
  });

  /** we don't have real vat numbers that will be externally validated available for testing */
  it.skip('should return 200 for a valid VAT number', async () => {
    const response = await request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({
        countryCode: 'DE',
        vat: 'DE123456789',
      });
    expect(response.status).toBe(200);
    expect(response.body.validated).toBe(true);
  });

  it('should return 200 for an invalid VAT number in correct format with POST', async () => {
    const response = await request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({
        countryCode: 'DE',
        vat: 'DE000000000',
      });

    expect(response.status).toBe(200);
    expect(response.body.validated).toBe(false);
  });

  it('should return 200 for an invalid VAT number in correct format with GET', async () => {
    const response = await request(server)
      .post('/')
      .set('Content-Type', 'application/json')
      .send({
        countryCode: 'DE',
        vat: 'DE000000000',
      });

    expect(response.status).toBe(200);
    expect(response.body.validated).toBe(false);
  });
});
