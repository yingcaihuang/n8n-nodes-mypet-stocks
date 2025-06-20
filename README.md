# n8n-nodes-mypet-stocks

This is an n8n community node for the MyPet Stocks quantitative trading system.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Authentication
- **Get Token**: Authenticate using username and password to get a Bearer token
- **Test Connection**: Test the API connection with current credentials

### Trading
- **Get Market Data**: Retrieve market data for trading analysis

## Credentials

This node requires MyPet Stocks API credentials. You can authenticate using either:

1. **Username & Password**: Use your MyPet Stocks account credentials
2. **Bearer Token**: Use a pre-generated Bearer token

### API Configuration

- **API Base URL**: Default is `https://dash-stock.mypet.run`
- **Authentication Endpoint**: `/api/v1/portal/dashlogin`

## Usage

1. Create new credentials of type "MyPet Stocks API"
2. Choose your authentication method:
   - For username/password: Enter your MyPet Stocks credentials
   - For token: Enter your Bearer token (without "Bearer " prefix)
3. Add the MyPet Stocks node to your workflow
4. Select the desired resource and operation
5. Configure any additional parameters as needed

## API Documentation

For more information about the MyPet Stocks API, visit: https://dash-stock.mypet.run

## Development

To build the node:

```bash
npm install
npm run build
```

To watch for changes during development:

```bash
npm run dev
```

## License

MIT
