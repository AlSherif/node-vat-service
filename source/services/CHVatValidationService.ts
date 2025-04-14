import { createClientAsync } from 'soap';
import { VatValidationService } from './VatValidationService';

export class CHVatValidationService implements VatValidationService {
  private readonly wsdlUrl: string;

  constructor(wsdlUrl: string) {
    this.wsdlUrl = wsdlUrl;
  }

  async validate(countryCode: string, vat: string): Promise<boolean> {
    if (countryCode !== 'CH') {
      throw new Error('This service only supports Swiss VAT numbers (countryCode: CH).');
    }

    try {
      // Erstelle einen SOAP-Client
      const client = await createClientAsync(this.wsdlUrl);

      // Parameter für die SOAP-Operation
      const args = {
        vatNumber: vat,
      };

      // Führe die SOAP-Operation aus
      const [result] = await client.ValidateVatNumberAsync(args);

      // Überprüfe die Antwort
      if (result && result.valid) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('SOAP request failed:', error);
      throw new Error('Failed to validate VAT number.');
    }
  }
}