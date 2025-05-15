import { Request, Response } from 'express';
import { Configuration, readConfiguration } from '../models/Configuration';
import { EUVatValidationService } from '../services/EUVatValidationService'
import { CHVatValidationService } from '../services/CHVatValidationService';
import { ExternalVatValidationService } from '../services/VatValidationService';
import { z } from 'zod';
import { SupportedCountry } from '../models/SupportedCountry';

export const createVatValidationController = (configuration: Configuration) => {
  const externalVatServices : Array<ExternalVatValidationService> = new Array()
  externalVatServices.push( new EUVatValidationService(configuration.apiUrl['EUVatValidationService']));
  externalVatServices.push( new CHVatValidationService(configuration.apiUrl['CHVatValidationService']));

return async (req: Request, res: Response) => {

  const vatRequest = req.method === 'GET' ? req.query : req.body;
  // Define the Zod schema
  const isoMessage = "countryCode must be a string in ISO 2 format and consist of two uppercase letters";
  const vatMessage = "vat must be a string and not be empty or null";
  const simpleRequestValidationSchema = z.object({
    countryCode: z
      .string({
        required_error: isoMessage,
        invalid_type_error: isoMessage,
      })
      .length(2, isoMessage) // Ensure ISO 2 format
      .regex(/^[A-Z]{2}$/, isoMessage) // Validate uppercase letters
      ,
    vat: z
      .string({
        required_error: vatMessage,
        invalid_type_error: vatMessage,
      })
      .min(1, vatMessage) // Ensure VAT is not empty
  });

  // Basic Request Validation
  try {
    const data = simpleRequestValidationSchema.parse(vatRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Use map() to extract the "message" field and join() to concatenate with ";"
      const allErrorMessages = error.issues
        .map((issue) => issue.message) // Extract the "message" field
        .join('; '); // Concatenate with "; "
      // Return the error response
      console.log('VAT Request NOT validated', vatRequest);
      return res.status(400).json({
        code: 400,
        message: allErrorMessages,
      });
    }
  }

  console.log('VAT Request validated', vatRequest);

  //Check if countryCode is supported
  const countryCode = vatRequest.countryCode as string;
  const vat = vatRequest.vat as string;

  let supportedCountry: SupportedCountry | null  = null;
  let externalService: ExternalVatValidationService | null = null;
  for (const service of externalVatServices) {
    let temp = service.getSupportedCountry(countryCode);
    if (temp) {
      supportedCountry = temp;
      externalService = service;
      break;
    }
  }

  if (!supportedCountry) {
    const message = `The country code ${countryCode} is not supported by any VAT validation service.`;
    return res.status(501).json({
      code: 501,
      message: message,
    });
  }

  // Match the VAT number with the regex
  if(!supportedCountry.regex.test(vat)){
    const message = `The VAT number ${vat} does not match the expected format for country code ${countryCode}.`;
    return res.status(400).json({
      code: 400,
      message: message,
    }); 
  }

  // Validate the VAT number using the external service
  try {
  const isValid = await externalService?.validate(countryCode, vat);
  return res.status(200).json({
    validated: isValid,
    details: isValid?'VAT number is valid for the given country code.':'VAT number marked as invalid by the external service.',
  });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error during external VAT validation:', error.message);
      return res.status(500).json({
        code: 500,
        message: error.message,
      });
    }
  }
};
}