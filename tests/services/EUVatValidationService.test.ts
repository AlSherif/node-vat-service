import { EUVatValidationService } from '../../source/services/EUVatValidationService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EUVatValidationService', () => {
  const apiUrl = 'https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number';
  const vatService = new EUVatValidationService(apiUrl);

  it('should return true for a valid VAT number', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200, data: { valid: true } });

    const isValid = await vatService.validate('DE', 'DE123456789');
    expect(isValid).toBe(true);
  });

  it('should return false for an invalid VAT number', async () => {
    mockedAxios.post.mockResolvedValue({ status: 200, data: { valid: false } });

    const isValid = await vatService.validate('DE', 'INVALID');
    expect(isValid).toBe(false);
  });
});