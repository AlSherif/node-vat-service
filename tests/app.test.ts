import request from 'supertest';
import createApp from '../source/app.js';
import { Configuration } from '../source/models/Configuration.js';

// Optional: Controller-Mock für Fehlerfall
import * as VatValidationController from '../source/controllers/VatValidationController.js';
import {Router, Express} from 'express';
import { any } from 'zod';

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

describe('Express App', () => {
  let app: ReturnType<typeof createApp>;

  beforeAll(() => {
    app = createApp(mockConfiguration);
  });

  it('should include security headers via Helmet', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('should return 405 for unsupported HTTP method PUT', async () => {
    const response = await request(app).put('/');
    expect(response.status).toBe(405);
    console.log('Response:', response.status, response.body);
    expect(response.body).toEqual({
      code: 405,
      message: 'Method Not Allowed',
    });
  });
  
  it('should return 405 for unsupported HTTP method DELETE', async () => {
    const response = await request(app).delete('/');
    expect(response.status).toBe(405);
    expect(response.body).toEqual({
      code: 405,
      message: 'Method Not Allowed',
    });
  });

  it('should respond with 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status)
    .toBe(404);
    expect(response.body).toEqual({
      code: 404,
      message: 'Not Found',
    });
  });

  it('should handle errors with a 500 status code', async () => {
  
    // Testen Sie, ob der Fehler korrekt behandelt wird
    await request(app)
    .post('/error')
    .send({ /* Testdaten */ })
    .expect(500)
    .expect((res) => {
      expect(res.body).toEqual({
        code: 500,
        message: 'Mock Error',
      });
    });
  });

  it('should include response-time header', async () => {
    const response = await request(app).get('/');
    // response-time header ist z.B. x-response-time
    const responseTimeHeader = Object.keys(response.headers).find((h) => h.startsWith('x-response-time'));
    expect(responseTimeHeader).toBeDefined();
  });
});