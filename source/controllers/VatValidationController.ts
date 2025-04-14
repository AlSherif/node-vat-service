import { Request, Response } from 'express';
import { vatRequestSchema } from '../schema/vatSchema';
import { Configuration, readAppConfiguration } from '../models/ConfigurationModel';
import { EUVatValidationService } from '../services/EUVatValidationService'
import { CHVatValidationService } from '../services/CHVatValidationService';

const configurationFile = "config.json";
const configuration: Configuration = readAppConfiguration(configurationFile);
const EUVatService = new EUVatValidationService(configuration.apiUrlEU);
const CHVatService = new CHVatValidationService(configuration.apiUrlCH);

export const validateVatController = async (req: Request, res: Response) => {
  const countryCode = (req.query?.countryCode ?? req.body.countryCode) as string;
  const vat = (req.query?.vat ?? req.body.vat) as string;

  // Validierung der Eingabe mit Zod
  const parsed = vatRequestSchema.safeParse({ countryCode, vat });

  if (!parsed.success) {
    // Fehler aus der Validierung extrahieren
    const errors = parsed.error.flatten();

    if ((errors.fieldErrors.countryCode ?? []).length > 0) {
      return res.status(501).json({
        code: 501,
        // message: 'Country code not supported.',
        message: errors.fieldErrors.countryCode?.join(', '),
      });
    } else if ((errors.fieldErrors.vat ?? []).length > 0) {
      return res.status(400).json({
        code: 400,
        // message: 'VAT number is invalid for this country.',
        message: errors.fieldErrors.vat?.join(', '),
      });
    } else if (errors.formErrors.length > 0) {
      return res.status(400).json({
        code: 400,
        // message: 'Invalid input',
        message: errors.formErrors?.join(', ')
      });
    }
  }

  let isValid = true;
  try {
    if(countryCode === 'CH') {
      isValid = await CHVatService.validate(countryCode, vat);  
    }
    else {
      isValid = await EUVatService.validate(countryCode, vat);
    }
  } catch (error) {
    console.error('Error validating VAT number:', error);
    return res.status(500).json({
      code: 500,
      message: 'An error occurred while validating the VAT number via external Service.'
    });
  }

  return res.status(200).json({
    validated: isValid,
    details: isValid?'VAT number is valid for the given country code.':'VAT number marked as invalid by the external service.',
  });
};
