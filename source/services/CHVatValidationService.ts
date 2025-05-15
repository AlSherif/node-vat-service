import {createClientAsync} from 'soap';
import {ExternalVatValidationService} from './VatValidationService';
import {SupportedCountry} from '../models/SupportedCountry';

const supportedCountries = new Array<SupportedCountry>({
  countryCode: 'CH',
  regex: new RegExp('^CHE-[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}$'),
});

export class CHVatValidationService extends ExternalVatValidationService {
  getSupportedCountries(): Array<SupportedCountry> {
    return supportedCountries;
  }

  private readonly wsdlUrl: string;

  constructor(wsdlUrl: string) {
    super();
    this.wsdlUrl = wsdlUrl;
  }

  async validate(countryCode: string, vat: string): Promise<boolean> {
    if (countryCode !== 'CH') {
      throw new Error(
        'This service only supports Swiss VAT numbers (countryCode: CH).',
      );
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
