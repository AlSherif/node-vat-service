import { CHVatValidationService } from '../../source/services/CHVatValidationService';
import { createClientAsync } from 'soap';

jest.mock('soap');

const MockCreateClientAsync = createClientAsync as jest.Mock;

describe('CHVatValidationService', () => {
  const soapUrl = 'https://www.uid-wse-a.admin.ch/V5.0/PublicServices.svc?wsdl';
  const vatService = new CHVatValidationService(soapUrl);

  it('should return true for a valid Swiss VAT number', async () => {
    MockCreateClientAsync.mockResolvedValue({
      ValidateVatNumberAsync: jest.fn().mockResolvedValue([{ valid: true }]),
    });

    const isValid = await vatService.validate('CH', 'CHE-123.456.789');
    expect(isValid).toBe(true);
  });

  it('should return false for an invalid Swiss VAT number', async () => {
    MockCreateClientAsync.mockResolvedValue({
      ValidateVatNumberAsync: jest.fn().mockResolvedValue([{ valid: false }]),
    });

    const isValid = await vatService.validate('CH', 'CHE-000.000.000');
    expect(isValid).toBe(false);
  });
  
});

