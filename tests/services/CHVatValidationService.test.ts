import { CHVatValidationService } from '../../source/services/CHVatValidationService';

import axios from 'axios';

afterAll(() => {
  // Schließe alle offenen Verbindungen
  axios.defaults.adapter = undefined;
});

describe('CHVatValidationService', () => {
  const soapUrl = 'https://www.uid-wse-a.admin.ch/V5.0/PublicServices.svc?wsdl';
  const vatService = new CHVatValidationService(soapUrl);

  // Setze ein längeres Timeout für die Tests (z. B. 30 Sekunden)
  jest.setTimeout(30000);

    // find a valid VAT number and test it
//   it('should validate a valid Swiss VAT number', async () => {
//     const countryCode = 'CH';
//     const validVatNumber = 'CHE-123.456.789'; // Beispiel für eine gültige VAT-Nummer

//     const isValid = await vatService.validate(countryCode, validVatNumber);
//     expect(isValid).toBe(true);
//   });

  it('should return false for an invalid Swiss VAT number', async () => {
    const countryCode = 'CH';
    const invalidVatNumber = 'CHE-000.000.000'; // Beispiel für eine ungültige VAT-Nummer

    const isValid = await vatService.validate(countryCode, invalidVatNumber);
    expect(isValid).toBe(false);
  });
});