import request from 'supertest';
import { Express } from 'express';
import createServer from '../source/app.js';
import { Configuration } from '../source/models/Configuration.js';

describe('App Initialization', () => {
  let app: Express;

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

    const { app: testApp } = createServer(mockConfiguration);
    app = testApp;
  });

  it('should initialize the app without errors', () => {
    expect(app).toBeDefined();
  });

  it('should include security headers via Helmet', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });
});