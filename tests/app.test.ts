import request from 'supertest';
import { Express } from 'express';
import createApp from '../source/server.js';
import { Configuration } from '../source/models/ConfigurationModel.js';

describe('App Initialization', () => {
  let app: Express;

  beforeAll(() => {
    // Mock-Konfiguration für Tests
    const mockConfiguration: Configuration = {
      apiUrlEU: 'https://api.example.com/eu', 
      apiUrlCH: 'https://api.example.com/ch',
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

    // App erstellen
    app = createApp(mockConfiguration).app;
  });

  it('should initialize the app without errors', () => {
    expect(app).toBeDefined();
  });

  it('should respond with 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });

  it('should include security headers via Helmet', async () => {
    const response = await request(app).get('/');
    expect(response.headers['x-dns-prefetch-control']).toBe('off');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

});