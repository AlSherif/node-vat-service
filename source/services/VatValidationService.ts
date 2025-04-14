export interface VatValidationService {
    validate: (countryCode: string, vat: string) => Promise<boolean>;
}