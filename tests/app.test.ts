import request from 'supertest';
import createServer from '../source/app.js';
import { Configuration } from '../source/models/Configuration.js';

import * as VatValidationController from '../source/controllers/VatValidationController.js';

describe('Server Initialization', () => {
  let app: any;
  let server: any;

  beforeAll(() => {
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

    const serverInstance = createServer(mockConfiguration);
    app = serverInstance.app;
    server = serverInstance.server;
  });

  afterAll(() => {
    server.close();
  });

  it('should initialize the server with correct configurations', () => {
    expect(server.keepAliveTimeout).toBe(5000);
    expect(server.maxHeadersCount).toBe(2000);
    expect(server.timeout).toBe(120000);
    expect(server.maxConnections).toBe(100);
    expect(server.headersTimeout).toBe(60000);
    expect(server.requestTimeout).toBe(120000);
  });

it('should handle errors with a 500 status code', async () => {
  // Mock the validateVatController to throw an error
  jest.spyOn(VatValidationController, 'validateVatController').mockImplementation(() => {
    throw new Error('Test error');
  });

  const response = await request(app).post('/').send({
    countryCode: 'DE',
    vat: 'DE123456789',
  });

  expect(response.status).toBe(500);
  expect(response.body).toEqual({
    code: 500,
    message: 'Internal Server Error',
  });

  // Restore the original implementation
  jest.restoreAllMocks();
});

  it('should include middleware like Helmet and responseTime', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should respond with 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      code: 404,
      message: 'Not Found',
    });
  });
});