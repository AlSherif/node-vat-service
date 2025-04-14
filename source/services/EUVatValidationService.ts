import axios from 'axios';
import { VatValidationService } from './VatValidationService';
export class EUVatValidationService implements VatValidationService {
  private readonly apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async validate(countryCode: string, vat: string): Promise<boolean> {
    try {
      // API-Request-Body
      const requestBody = {
        countryCode,
        vatNumber: vat,
      };

      // API-Aufruf
      const response = await axios.post(this.apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Überprüfe die Antwort
      if (response.status === 200 && response.data.valid) {
        return true;
      }

      console.log('VAT number is invalid:', response.data);
      return false;
    } catch (error) {
      // Fehlerbehandlung
      if (axios.isAxiosError(error)) {
        console.error('API call failed:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw new Error('Failed to validate VAT number.');
    }
  }
}