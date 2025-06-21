# n8n-nodes-mypet-stocks

This is an n8n community node for the MyPet Stocks quantitative trading system with comprehensive account management capabilities.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Authentication
- **Get Token**: Authenticate using username and password to get a Bearer token
- **Test Connection**: Test the API connection with current credentials

### Trading
- **Get Market Data**: Retrieve market data for trading analysis
- **Commission Statistics** ✨ NEW: Comprehensive commission analysis and statistics

### Quantitative Account Management ✨ NEW
- **Get All Accounts**: Retrieve all quantitative accounts with pagination and filtering support
- **Create Account**: Create new quantitative accounts with comprehensive parameter configuration
- **Update Account**: Update existing quantitative account information
- **Delete Account**: Safely delete inactive quantitative accounts

#### Account Management Features
- **Account Types**: Support for MT4 and MT5 accounts
- **Account Nature**: Real and demo account management
- **Broker Integration**: Dynamic broker/dealer selection
- **Risk Management**: Configurable risk parameters and leverage settings
- **Multi-timezone Support**: UTC, Asia/Shanghai, Europe/Moscow, and more
- **Capital Types**: USD and Cent account support
- **Status Management**: Active/inactive account status control

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
4. Select the desired resource:
   - **Authentication**: For login and connection testing
   - **Trading**: For market data and trading operations
   - **Quantitative Account**: For account management operations
5. Choose the operation and configure parameters as needed

### Quantitative Account Examples

#### Get All Accounts
```json
{
  "resource": "quantAccount",
  "operation": "getAllAccounts",
  "pageNum": 1,
  "pageSize": 20,
  "account_type": "mt5",
  "is_real": "true"
}
```

#### Create New Account
```json
{
  "resource": "quantAccount",
  "operation": "createAccount",
  "name": "My Trading Account",
  "accountId": "MT5001",
  "account_type": "mt5",
  "is_real": true,
  "dealer": 1,
  "server": "MT5-Live-01",
  "capital_type": "usd",
  "max_lever": "1:100",
  "risk": 100,
  "time_zone": "Asia/Shanghai",
  "status": true
}
```

#### Commission Statistics
```json
{
  "resource": "trading",
  "operation": "getCommissionStatistics",
  "scope": "month",
  "accounts": ["1", "2", "3"],
  "capital_type": "usd"
}
```

#### Custom Time Range Commission Statistics
```json
{
  "resource": "trading",
  "operation": "getCommissionStatistics",
  "scope": "custom",
  "accounts": ["1", "2"],
  "capital_type": "usd",
  "start_time": "2025-04-01",
  "end_time": "2025-04-30"
}
```

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
