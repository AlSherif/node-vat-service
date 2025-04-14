import { ZodError } from 'zod';
import { vatRequestSchema } from '../../source/schema/vatSchema';

describe('vatRequestSchema', () => {
  it('should validate a correct VAT number and country code', () => {
    const result = vatRequestSchema.safeParse({
      countryCode: 'DE',
      vat: 'DE123456789',
    });
    expect(result.success).toBe(true);
  });

  it('should fail if countryCode is missing', () => {
    const result = vatRequestSchema.safeParse({
      vat: 'DE123456789',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().formErrors).toContainEqual('Country code is required.');
  });

  it('should fail if vat is missing', () => {
    const result = vatRequestSchema.safeParse({
      countryCode: 'DE',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().formErrors).toContain('VAT number is required.');
  });

  it('should fail if countryCode is not supported', () => {
    const result = vatRequestSchema.safeParse({
      countryCode: 'XX',
      vat: '123456789',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.countryCode).toContain('Country code not supported.');
  });

  it('should fail if vat does not match the regex', () => {
    const result = vatRequestSchema.safeParse({
      countryCode: 'DE',
      vat: 'INVALID',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.vat).toContain('VAT number format is invalid for this country.');
  });
});