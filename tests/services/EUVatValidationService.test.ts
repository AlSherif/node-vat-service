import { EUVatValidationService } from '../../source/services/EUVatValidationService';
import axios from 'axios';
import http from 'http';
import https from 'https';

beforeAll(() => {
  const httpAgent = new http.Agent({ keepAlive: true });
  const httpsAgent = new https.Agent({ keepAlive: true });
  // Set default agents
  axios.defaults.httpAgent = httpAgent;
  axios.defaults.httpsAgent = httpsAgent;
});


afterAll(() => {
  axios.defaults.httpAgent.destroy();
  axios.defaults.httpsAgent.destroy();
});

describe('EUVatValidationService', () => {
  const apiUrl = 'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number';
  const vatService = new EUVatValidationService(apiUrl);


// Find valid number and test it
//   it('should validate a correct VAT number and country code', async () => {
//     const countryCode = 'DE';
//     const vatNumber = 'DE123456789';

//     const isValid = await vatService.validate(countryCode, vatNumber);
//     expect(isValid).toBe(true);
//   });

  it('should return false for an invalid VAT number', async () => {
    const countryCode = 'DE';
    const vatNumber = 'INVALID';

    const isValid = await vatService.validate(countryCode, vatNumber);
    expect(isValid).toBe(false);
  });

});