import request from 'supertest';
import { Express } from 'express';
import createApp from '../../source/server.js'; // Importiere die App-Erstellungsfunktion
import { Configuration } from '../../source/models/Configuration.js';
import http from 'http';

describe('POST /', () => {
  let app: Express;
  let server: http.Server; // Store the server instance

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

    server = app.listen(
      3000,
      () => {
        console.log({ description: "START" });
      }
    );
  });

  afterAll(async () => {
    // Close the server to release resources
    await server.close();
  });

  it('should return 200 for a valid VAT EU number and country code', async () => {
    const response = await request(server)
      .post('/')
      .send({
        countryCode: 'DE',
        vat: 'DE123456789', // Passendes Format für Deutschland
      });

    expect(response.status).toBe(200);
  });

  it('should return 200 for a valid VAT CH number and country code', async () => {
    const response = await request(server)
      .post('/')
      .send({
        countryCode: 'CH',
        vat: 'CHE-123.456.789', // Passendes Format für Schweiz
      });

    expect(response.status).toBe(200);
  }, 12000);

  it('should return 400 for an invalid VAT number', async () => {
    const response = await request(server)
      .post('/')
      .send({
        countryCode: 'DE',
        vat: 'INVALID', // Ungültiges Format
      });

    expect(response.status).toBe(400);
  });

  it('should return 501 for an unsupported country code', async () => {
    const response = await request(server)
      .post('/')
      .send({
        countryCode: 'XX', // Nicht unterstützter Ländercode
        vat: '123456789',
      });

    expect(response.status).toBe(501);
  });

  it('should return 400 for missing parameters', async () => {
    const response = await request(server)
      .post('/')
      .send({});

    expect(response.status).toBe(400);

  });

  it('should return 400 for a valid country code but invalid VAT format', async () => {
    const response = await request(server)
      .post('/')
      .send({
        countryCode: 'FR',
        vat: 'FRINVALID', // Ungültiges Format für Frankreich
      });

    expect(response.status).toBe(400);
  });

  it('should return 200 for a valid VAT number with complex regex', async () => {
    const response = await request(server)
      .post('/')
      .send({
        countryCode: 'FR',
        vat: 'FR12345678901', // Passendes Format für Frankreich
      });

    expect(response.status).toBe(200);
  });
});