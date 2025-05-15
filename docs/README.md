# VAT Validation Service

## Introduction
The VAT Validation Service is a Node.js/Express application for validating VAT numbers for EU countries and Switzerland using external web services. It provides a unified REST API, robust error handling, and is easily extensible for additional countries or services.

## Purpose
- Validate VAT numbers using country-specific patterns and external APIs (EU VIES, Swiss UID).
- Route requests to the correct service based on the country code.
- Provide consistent, well-structured responses and error messages.

## Features
- **Country-Specific Validation**: Supports EU and Swiss VAT numbers.
- **Regex-Based Validation**: Ensures correct format before external validation.
- **Unified Error Handling**: Returns clear error codes/messages for all error cases (400, 404, 405, 500, 501).
- **Extensible**: Add new countries/services easily.
- **OpenAPI Spec**: API is fully documented in [openapi/api.yaml](../openapi/api.yaml).
- **Comprehensive Testing**: Unit, integration, and controller/service tests with high coverage.

## Usage

### Prerequisites
- Node.js 22.13 or higher
- `pnpm` as the package manager

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lutz
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Service
1. Build the project:
   ```bash
   pnpm run build
   ```
2. Start the server:
   ```bash
   pnpm run start
   ```

### API Endpoints
#### POST /
Validates a VAT number for a specific country (JSON body):
```json
{
  "countryCode": "DE",
  "vat": "123456789"
}
```
#### GET /
Validates a VAT number for a specific country (query params):
```
GET /?countryCode=DE&vat=123456789
```

#### Responses (for both GET and POST)
- **200 OK**
  ```json
  {
    "validated": true,
    "details": "VAT number is valid for the given country code."
  }
  ```
- **400 Bad Request**
  ```json
  {
    "code": 400,
    "message": "The VAT number does not match the expected format for the given country code."
  }
  ```
- **404 Not Found**
  ```json
  {
    "code": 404,
    "message": "Not Found"
  }
  ```
- **405 Method Not Allowed**
  ```json
  {
    "code": 405,
    "message": "Method Not Allowed"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "code": 500,
    "message": "An error occurred while validating the VAT number via the external service."
  }
  ```
- **501 Not Implemented**
  ```json
  {
    "code": 501,
    "message": "The country code is not supported by any VAT validation service."
  }
  ```

### OpenAPI Documentation
The full OpenAPI 3.0 specification is available in [openapi/api.yaml](../openapi/api.yaml). Use it for client generation or interactive API docs.

## Configuration
The service uses a `config.json` file for configuration. Example:
```json
{
  "apiUrl": {
    "EUVatValidationService": "https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number",
    "CHVatValidationService": "https://www.uid-wse-a.admin.ch/V5.0/PublicServices.svc?wsdl"
  },
  "port": 3000,
  "expressServerOptions": {
    "keepAliveTimeout": 5000,
    "maxHeadersCount": 2000,
    "timeout": 120000,
    "maxConnections": 100,
    "headersTimeout": 60000,
    "requestTimeout": 120000
  }
}
```

## Testing
The project uses Jest and Supertest for unit, integration, and controller/service testing.

### Run Tests
```bash
pnpm run test
```

### Test Coverage
Coverage reports are generated in the `coverage/` directory. Aim for at least 80% code coverage.

## Folder Structure
```
lutz/
├── source/
│   ├── app.ts                # Express app factory
│   ├── server.ts             # HTTP server setup
│   ├── controllers/          # API controllers (e.g. VatValidationController)
│   ├── services/             # Service implementations (EU/CH)
│   ├── schema/               # Validation schemas and patterns
│   └── routers/              # API routes
├── tests/
│   ├── app.test.ts           # App-level integration tests
│   ├── server.test.ts        # Server config tests
│   ├── controllers/          # Controller unit tests
│   ├── services/             # Service unit tests
│   └── integration/          # API integration tests
├── openapi/api.yaml          # OpenAPI 3.0 spec
├── config.json               # Configuration file
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
└── docs/README.md            # Documentation
```

## Dependencies
- **Runtime**:
  - [Express](https://expressjs.com/) - Web framework
  - [Zod](https://zod.dev/) - Schema validation
  - [Axios](https://axios-http.com/) - HTTP client
  - [SOAP](https://github.com/vpulim/node-soap) - SOAP client
- **Development**:
  - [Jest](https://jestjs.io/) - Testing framework
  - [Supertest](https://github.com/visionmedia/supertest) - HTTP assertions
  - [TypeScript](https://www.typescriptlang.org/) - Type safety
  - [pnpm](https://pnpm.io/) - Fast package manager

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgments
- [EU VAT Information Exchange System (VIES)](https://ec.europa.eu/taxation_customs/vies/)
- [Swiss UID Services](https://www.uid-wse.admin.ch/)