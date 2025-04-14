import { z } from 'zod';
import { vatPatterns } from './vatPatterns';

// Extrahiere alle unterstützten Ländercodes
const countryCodes = vatPatterns.map((v) => v.countryCode);

export const vatRequestSchema = z
  .object({
    countryCode: z.string().optional(),
    vat: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { countryCode, vat } = data;

    // Überprüfe, ob `countryCode` fehlt oder ungültig ist
    if (!countryCode) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Country code is required.',
        path: [], // Leerer Pfad, um es als Formfehler zu behandeln
      });
    } else if (!countryCodes.includes(countryCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Country code not supported.',
        path: ['countryCode'], // Fehler wird dem Feld zugeordnet
      });
    }

    // Überprüfe, ob `vat` fehlt oder ungültig ist
    if (!vat) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'VAT number is required.',
        path: [], // Leerer Pfad, um es als Formfehler zu behandeln
      });
    } else {
      // Finde das passende Regex-Muster für den `countryCode`
      const pattern = vatPatterns.find((v) => v.countryCode === countryCode)?.regex;
      if (!pattern) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'No matching pattern found for this country code.',
          path: [], // Fehler wird dem Feld zugeordnet
        });
      } else {
        const regex = new RegExp(pattern);
        if (!regex.test(vat)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'VAT number format is invalid for this country.',
            path: ['vat'], // Fehler wird dem Feld zugeordnet
          });
        }
      }
    }
  });

export type VatRequest = z.infer<typeof vatRequestSchema>;