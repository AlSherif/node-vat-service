import { SupportedCountry } from "../models/SupportedCountry";

export abstract class ExternalVatValidationService {
    abstract validate(countryCode: string, vat: string): Promise<boolean> ;
    abstract getSupportedCountries(): Array<SupportedCountry>;
    getSupportedCountry(countryCode: string): SupportedCountry | null {
        const supportedCountry = this.getSupportedCountries().find(country => country.countryCode === countryCode);
        return supportedCountry ? supportedCountry : null;  
      }
}