import { validateVatController } from '../../source/controllers/VatValidationController';
import { Request, Response } from 'express';
import { CHVatValidationService } from '../../source/services/CHVatValidationService';
import { EUVatValidationService } from '../../source/services/EUVatValidationService';
import axios from 'axios';
import { createClientAsync } from 'soap';

// Mock external dependencies
jest.mock('axios');
jest.mock('soap');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCreateClientAsync = createClientAsync as jest.Mock;

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

  it('should return 200 for a valid VAT number', async () => {
    // Mock the external HTTP call for EUVatValidationService
    mockedAxios.post.mockResolvedValue({ status: 200, data: { valid: true } });

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

  it('should return 200 for an invalid VAT number in correct format', async () => {
    // Mock the external HTTP call for EUVatValidationService
    mockedAxios.post.mockResolvedValue({ status: 200, data: { valid: false } });

    mockRequest = {
      body: {
        countryCode: 'DE',
        vat: 'DE123456789',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      validated: false,
      details: 'VAT number marked as invalid by the external service.',
    });
  });

  it('should return 200 for a valid Swiss VAT number', async () => {
    // Mock the external SOAP call for CHVatValidationService
    mockedCreateClientAsync.mockResolvedValue({
      ValidateVatNumberAsync: jest.fn().mockResolvedValue([{ valid: true }]),
    });

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

  it('should return 200 for an invalid Swiss VAT number', async () => {
    // Mock the external SOAP call for CHVatValidationService
    mockedCreateClientAsync.mockResolvedValue({
      ValidateVatNumberAsync: jest.fn().mockResolvedValue([{ valid: false }]),
    });

    mockRequest = {
      body: {
        countryCode: 'CH',
        vat: 'CHE-000.000.000',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      validated: false,
      details: 'VAT number marked as invalid by the external service.',
    });
  });

  it('should return 400 for an invalid VAT format', async () => {
    mockRequest = {
      body: {
        countryCode: 'DE',
        vat: 'INVALID',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      code: 400,
      message: 'The VAT number INVALID does not match the expected format for country code DE.',
    });
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
      message: 'The country code XX is not supported by any VAT validation service.',
    });
  });

  it('should return 400 if countryCode is missing', async () => {
    mockRequest = {
      body: {
        vat: 'DE123456789',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      code: 400,
      message: 'countryCode must be a string in ISO 2 format and consist of two uppercase letters',
    });
  });

  it('should return 400 if vat is missing', async () => {
    mockRequest = {
      body: {
        countryCode: 'DE',
      },
    };

    await validateVatController(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      code: 400,
      message: 'vat must be a string and not be empty or null',
    });
  });
});