# VAT Validation Service

## Introduction
The VAT Validation Service is a Node.js application designed to validate VAT numbers for various countries using external web services. It provides a unified interface to interact with multiple external APIs, ensuring consistent validation and error handling.

## Purpose
The service simplifies the process of VAT validation by:
- Validating VAT numbers using country-specific patterns.
- Routing requests to the appropriate external web service based on the country code.
- Providing consistent responses for both valid and invalid VAT numbers.

## Features
- **Country-Specific Validation**: Supports VAT validation for EU countries and Switzerland.
- **Regex-Based Validation**: Ensures VAT numbers conform to country-specific formats before making external API calls.
- **Error Handling**: Returns meaningful error messages for invalid requests or unsupported countries.
- **Extensibility**: Easily extendable to support additional countries or services.
- **REST API**: Built using Express.js for handling HTTP requests.

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
Validates a VAT number for a specific country.

- **Request Body**:
  ```json
  {
    "countryCode": "DE",
    "vat": "123456789"
  }
  ```
- **Response**:
  ```json
  {
    "validated": true,
    "details": "VAT number is valid for the given country code."
  }
  ```

- **Error Response**:
  ```json
  {
    "code": 400,
    "message": "VAT number is invalid for this country."
  }
  ```

## Configuration
The service uses a `config.json` file for configuration. Example:
```json
{
  "apiUrlEU": "https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number",
  "apiUrlCH": "https://www.uid-wse.admin.ch/V5.0/PublicServices.svc?wsdl"
}
```

## Testing
The project uses Jest and Supertest for unit and API testing.

### Run Tests
```bash
pnpm run test
```

### Test Coverage
The service aims for at least 80% code coverage. Coverage reports are generated in the `coverage/` directory.

## Folder Structure
```
lutz/
├── source/
│   ├── app.ts                # Entry point
│   ├── server.ts             # Express server setup
│   ├── controllers/          # API controllers
│   ├── services/             # Service implementations
│   ├── schema/               # Validation schemas
│   └── routers/              # API routes
├── tests/                    # Unit and API tests
├── config.json               # Configuration file
├── package.json              # Project metadata and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation
```

## Dependencies
- **Runtime**:
  - [Express](https://expressjs.com/) - Web framework
  - [Zod](https://zod.dev/) - Schema validation
  - [Axios](https://axios-http.com/) - HTTP client
    - Needed to simplify REST Calls
  - [SOAP](https://github.com/vpulim/node-soap) - SOAP client
    - Needed to simplify SOAP Calls
- **Development**:
  - [Jest](https://jestjs.io/) - Testing framework
  - [Supertest](https://github.com/visionmedia/supertest) - HTTP assertions
  - [TypeScript](https://www.typescriptlang.org/) - Type safety

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