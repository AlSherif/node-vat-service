import { validateVatController } from '../../source/controllers/VatValidationController';
import { Request, Response } from 'express';
import { CHVatValidationService } from '../../source/services/CHVatValidationService';
import { EUVatValidationService } from '../../source/services/EUVatValidationService';

// Mock the services
jest.mock('../../source/services/CHVatValidationService');
jest.mock('../../source/services/EUVatValidationService');

const MockCHVatValidationService = CHVatValidationService as jest.MockedClass<typeof CHVatValidationService>;
const MockEUVatValidationService = EUVatValidationService as jest.MockedClass<typeof EUVatValidationService>;

describe('validateVatController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 for a valid Swiss VAT number (CH)', async () => {
    // Mock CHVatValidationService to return true
    MockCHVatValidationService.prototype.validate.mockResolvedValue(true);

    mockRequest = {
      body: {
        countryCode: 'CH',
        vat: 'CHE-123.456.789',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      validated: true,
      details: 'VAT number is valid for the given country code.',
    });
  });

  it('should return 200 for a valid German VAT number (DE)', async () => {
    // Mock EUVatValidationService to return true
    MockEUVatValidationService.prototype.validate.mockResolvedValue(true);

    mockRequest = {
      body: {
        countryCode: 'DE',
        vat: 'DE123456789',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      validated: true,
      details: 'VAT number is valid for the given country code.',
    });
  });

  it('should return 400 for an invalid German VAT number (DE)', async () => {
    // Mock EUVatValidationService to return false
    MockEUVatValidationService.prototype.validate.mockResolvedValue(false);

    mockRequest = {
      body: {
        countryCode: 'DE',
        vat: 'INVALID',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);

  });

  it('should return 501 for an unsupported country code', async () => {
    mockRequest = {
      body: {
        countryCode: 'XX',
        vat: '123456789',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(501);
    expect(jsonMock).toHaveBeenCalledWith({
      code: 501,
      message: 'Country code not supported.',
    });
  });

  it('should return 400 for missing parameters', async () => {
    mockRequest = {
      body: {},
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
  });

  it('should return 500 for an internal server error', async () => {
    // Mock CHVatValidationService to throw an error
    MockCHVatValidationService.prototype.validate.mockRejectedValue(new Error('Internal error'));

    mockRequest = {
      body: {
        countryCode: 'CH',
        vat: 'CHE-123.456.789',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      code: 500,
      message: 'An error occurred while validating the VAT number via external Service.',
    });
  });
});