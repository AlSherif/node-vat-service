import request from 'supertest';
import { Express } from 'express';
import createApp from '../../source/app.js';
import { Configuration } from '../../source/models/Configuration.js';
import http from 'http';

describe('POST /', () => {
  let app: Express;
  let server: http.Server;

  beforeAll(() => {
    const mockConfiguration: Configuration = {
      apiUrl: {
        EUVatValidationService: 'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number',
        CHVatValidationService: 'https://www.uid-wse-a.admin.ch/V5.0/PublicServices.svc?wsdl',
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

    app = createApp(mockConfiguration).app;
    server = app.listen(3000);
  });

  afterAll(async () => {
    await server.close();
  });

  it('should return 405 for unsupported HTTP method PUT', async () => {
  const response = await request(server).put('/');
  expect(response.status).toBe(405);
  expect(response.body).toEqual({
    code: 405,
    message: 'Method Not Allowed',
  });
});

  it('should return 405 for unsupported HTTP method DELETE', async () => {
  const response = await request(server).delete('/');
  expect(response.status).toBe(405);
  expect(response.body).toEqual({
    code: 405,
    message: 'Method Not Allowed',
  });
});

  it('should return 200 for a valid VAT number', async () => {
    const response = await request(server)
      .post('/')
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
      .send({
        countryCode: 'DE',
        vat: 'DE000000000',
      });

    expect(response.status).toBe(200);
    expect(response.body.validated).toBe(false);
  });
});