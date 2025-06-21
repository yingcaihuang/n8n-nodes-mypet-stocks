import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
	IDataObject,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

export class MyPetStocks implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'MyPet Stocks',
		name: 'myPetStocks',
		icon: 'file:mypet-stocks.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with MyPet Stocks quantitative trading system',
		defaults: {
			name: 'MyPet Stocks',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'myPetStocksApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Authentication',
						value: 'auth',
					},
					{
						name: 'Trading',
						value: 'trading',
					},
					{
						name: 'Quantitative Account',
						value: 'quantAccount',
					},
				],
				default: 'auth',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['auth'],
					},
				},
				options: [
					{
						name: 'Get Token',
						value: 'getToken',
						description: 'Get authentication token using username and password',
						action: 'Get authentication token',
					},
					{
						name: 'Test Connection',
						value: 'testConnection',
						description: 'Test the API connection with current credentials',
						action: 'Test API connection',
					},
				],
				default: 'getToken',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['trading'],
					},
				},
				options: [
					{
						name: 'Get Market Data',
						value: 'getMarketData',
						description: 'Get market data for trading',
						action: 'Get market data',
					},
					{
						name: 'Query Trade Orders',
						value: 'queryTradeOrders',
						description: 'Query trading orders with various filters',
						action: 'Query trade orders',
					},
					{
						name: 'Get Account Trading Details',
						value: 'getAccountTradingDetails',
						description: 'Get detailed trading statistics for a specific account',
						action: 'Get account trading details',
					},
					{
						name: 'List Accounts',
						value: 'listAccounts',
						description: 'Get list of available trading accounts',
						action: 'List trading accounts',
					},
					{
						name: 'Get Account Trading Status',
						value: 'getAccountTradingStatus',
						description: 'Get real-time trading status for all accounts',
						action: 'Get account trading status',
					},
				],
				default: 'getMarketData',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['quantAccount'],
					},
				},
				options: [
					{
						name: 'Get All Accounts',
						value: 'getAllAccounts',
						description: 'Get all quantitative accounts',
						action: 'Get all quantitative accounts',
					},
					{
						name: 'Create Account',
						value: 'createAccount',
						description: 'Create a new quantitative account',
						action: 'Create quantitative account',
					},
					{
						name: 'Update Account',
						value: 'updateAccount',
						description: 'Update an existing quantitative account',
						action: 'Update quantitative account',
					},
					{
						name: 'Delete Account',
						value: 'deleteAccount',
						description: 'Delete a quantitative account',
						action: 'Delete quantitative account',
					},
				],
				default: 'getAllAccounts',
			},
			// 订单查询参数
			{
				displayName: 'Page Number',
				name: 'pageNum',
				type: 'number',
				default: 1,
				description: 'Page number to query',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 20,
				description: 'Number of records per page',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Filter Abnormal Orders',
				name: 'filterAbnormal',
				type: 'boolean',
				default: false,
				description: 'Whether to filter abnormal orders',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Stock Account ID',
				name: 'stockAccount',
				type: 'string',
				default: '',
				description: 'Quantitative account ID',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'options',
				options: [
					{
						name: 'All',
						value: 'all',
					},
					{
						name: 'Open Positions',
						value: 'open',
					},
					{
						name: 'Closed Positions',
						value: 'close',
					},
				],
				default: 'all',
				description: 'Position type to query',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Trade Type',
				name: 'tradeType',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Buy (Long)',
						value: 'Buy',
					},
					{
						name: 'Sell (Short)',
						value: 'Sell',
					},
					{
						name: 'Balance (Deposit/Withdrawal)',
						value: 'Balance',
					},
				],
				default: '',
				description: 'Trade type to filter',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Symbol',
				name: 'symbol',
				type: 'string',
				default: '',
				description: 'Trading symbol to filter (e.g., USDJPY, NAS100)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Ticket Number',
				name: 'ticket',
				type: 'string',
				default: '',
				description: 'Trade order ticket number',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Magic Number',
				name: 'magic',
				type: 'string',
				default: '',
				description: 'Magic number for EA identification',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				description: 'Order comment to filter',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Open Time Start (Beijing)',
				name: 'openTimeStart',
				type: 'string',
				default: '',
				placeholder: '2025-04-01 00:00',
				description: 'Start time for open time filter (Beijing time)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Open Time End (Beijing)',
				name: 'openTimeEnd',
				type: 'string',
				default: '',
				placeholder: '2025-04-02 23:59',
				description: 'End time for open time filter (Beijing time)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Close Time Start (Beijing)',
				name: 'closeTimeStart',
				type: 'string',
				default: '',
				placeholder: '2025-04-01 00:00',
				description: 'Start time for close time filter (Beijing time)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			{
				displayName: 'Close Time End (Beijing)',
				name: 'closeTimeEnd',
				type: 'string',
				default: '',
				placeholder: '2025-04-02 23:59',
				description: 'End time for close time filter (Beijing time)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['queryTradeOrders'],
					},
				},
			},
			// 账户交易详情参数
			{
				displayName: 'Account',
				name: 'accountId',
				type: 'options',
				required: true,
				default: '',
				description: 'Select the trading account to query',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingDetails'],
					},
				},
			},
			{
				displayName: 'Time Scope',
				name: 'scope',
				type: 'options',
				required: true,
				options: [
					{
						name: 'All Time',
						value: 'all',
					},
					{
						name: 'Daily',
						value: 'day',
					},
					{
						name: 'Weekly',
						value: 'week',
					},
					{
						name: 'Monthly',
						value: 'month',
					},
					{
						name: 'Quarterly',
						value: 'quarter',
					},
					{
						name: 'Yearly',
						value: 'year',
					},
					{
						name: 'Custom Range',
						value: 'custom',
					},
				],
				default: 'all',
				description: 'Time scope for the trading details query',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingDetails'],
					},
				},
			},
			{
				displayName: 'Start Date',
				name: 'startTime',
				type: 'string',
				required: true,
				default: '',
				placeholder: '2025-04-01',
				description: 'Start date for custom time range (YYYY-MM-DD format)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingDetails'],
						scope: ['custom'],
					},
				},
			},
			{
				displayName: 'End Date',
				name: 'endTime',
				type: 'string',
				required: true,
				default: '',
				placeholder: '2025-04-30',
				description: 'End date for custom time range (YYYY-MM-DD format)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingDetails'],
						scope: ['custom'],
					},
				},
			},
			// 账户交易实况参数
			{
				displayName: 'Page Number',
				name: 'pageNum',
				type: 'number',
				default: 1,
				description: 'Page number to query',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingStatus'],
					},
				},
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 20,
				description: 'Number of records per page',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingStatus'],
					},
				},
			},
			{
				displayName: 'Filter by Account',
				name: 'filterAccountId',
				type: 'options',
				default: '',
				description: 'Filter by specific account (optional)',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingStatus'],
					},
				},
			},
			{
				displayName: 'Filter by Name',
				name: 'filterName',
				type: 'string',
				default: '',
				description: 'Filter by account name (optional)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingStatus'],
					},
				},
			},
			{
				displayName: 'Filter by Status',
				name: 'filterStatus',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Active',
						value: 'true',
					},
					{
						name: 'Inactive',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by account status (optional)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingStatus'],
					},
				},
			},
			{
				displayName: 'Filter by Account Type',
				name: 'filterAccountType',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'MT4',
						value: 'mt4',
					},
					{
						name: 'MT5',
						value: 'mt5',
					},
				],
				default: '',
				description: 'Filter by account type (optional)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingStatus'],
					},
				},
			},
			{
				displayName: 'Filter by Account Nature',
				name: 'filterIsReal',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Real Account',
						value: 'true',
					},
					{
						name: 'Demo Account',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by account nature (optional)',
				displayOptions: {
					show: {
						resource: ['trading'],
						operation: ['getAccountTradingStatus'],
					},
				},
			},
			// 量化账户参数配置
			// 获取所有量化账户的参数
			{
				displayName: 'Page Number',
				name: 'pageNum',
				type: 'number',
				default: 1,
				description: 'Page number to query',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['getAllAccounts'],
					},
				},
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 20,
				description: 'Number of records per page',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['getAllAccounts'],
					},
				},
			},
			{
				displayName: 'Filter by Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Filter by account name (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['getAllAccounts'],
					},
				},
			},
			{
				displayName: 'Filter by Account ID',
				name: 'accountId',
				type: 'string',
				default: '',
				description: 'Filter by quantitative account ID (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['getAllAccounts'],
					},
				},
			},
			{
				displayName: 'Filter by Account Type',
				name: 'account_type',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'MT4',
						value: 'mt4',
					},
					{
						name: 'MT5',
						value: 'mt5',
					},
				],
				default: '',
				description: 'Filter by account type (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['getAllAccounts'],
					},
				},
			},
			{
				displayName: 'Filter by Account Nature',
				name: 'is_real',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Real Account',
						value: 'true',
					},
					{
						name: 'Demo Account',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by account nature (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['getAllAccounts'],
					},
				},
			},
			{
				displayName: 'Filter by Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Active',
						value: 'true',
					},
					{
						name: 'Inactive',
						value: 'false',
					},
				],
				default: '',
				description: 'Filter by account status (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['getAllAccounts'],
					},
				},
			},
			// 创建量化账户的参数
			{
				displayName: 'Account Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the quantitative account',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Quantitative account ID',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Account Type',
				name: 'account_type',
				type: 'options',
				required: true,
				options: [
					{
						name: 'MT4',
						value: 'mt4',
					},
					{
						name: 'MT5',
						value: 'mt5',
					},
				],
				default: 'mt5',
				description: 'Account type',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Is Real Account',
				name: 'is_real',
				type: 'boolean',
				required: true,
				default: true,
				description: 'Whether this is a real account (true) or demo account (false)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Dealer',
				name: 'dealer',
				type: 'options',
				required: true,
				default: '',
				description: 'Select the dealer/broker',
				typeOptions: {
					loadOptionsMethod: 'getDealers',
				},
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Server',
				name: 'server',
				type: 'string',
				required: true,
				default: '',
				description: 'Server name',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Capital Type',
				name: 'capital_type',
				type: 'options',
				required: true,
				options: [
					{
						name: 'USD (Dollar)',
						value: 'usd',
					},
					{
						name: 'Cent',
						value: 'cent',
					},
				],
				default: 'usd',
				description: 'Capital type',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Max Leverage',
				name: 'max_lever',
				type: 'options',
				required: true,
				options: [
					{
						name: '1:2',
						value: '1:2',
					},
					{
						name: '1:20',
						value: '1:20',
					},
					{
						name: '1:50',
						value: '1:50',
					},
					{
						name: '1:100',
						value: '1:100',
					},
					{
						name: '1:200',
						value: '1:200',
					},
					{
						name: '1:400',
						value: '1:400',
					},
					{
						name: '1:500',
						value: '1:500',
					},
					{
						name: '1:800',
						value: '1:800',
					},
					{
						name: '1:1000',
						value: '1:1000',
					},
					{
						name: '1:2000',
						value: '1:2000',
					},
					{
						name: '1:无限',
						value: '1:无限',
					},
				],
				default: '1:100',
				description: 'Maximum leverage',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'View Password',
				name: 'view_password',
				type: 'string',
				default: '',
				description: 'View password (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Risk',
				name: 'risk',
				type: 'number',
				required: true,
				default: 100,
				description: 'Risk value - maximum loss percentage that can be tolerated (not a percentage)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Time Zone',
				name: 'time_zone',
				type: 'options',
				required: true,
				options: [
					{
						name: 'UTC',
						value: 'UTC',
					},
					{
						name: 'Europe/Moscow',
						value: 'Europe/Moscow',
					},
					{
						name: 'Asia/Shanghai',
						value: 'Asia/Shanghai',
					},
					{
						name: 'America/New_York',
						value: 'America/New_York',
					},
					{
						name: 'Asia/Tokyo',
						value: 'Asia/Tokyo',
					},
					{
						name: 'Africa/Cairo',
						value: 'Africa/Cairo',
					},
					{
						name: 'America/Los_Angeles',
						value: 'America/Los_Angeles',
					},
				],
				default: 'UTC',
				description: 'Time zone',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'boolean',
				required: true,
				default: true,
				description: 'Account status - true (active) or false (inactive)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Note (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['createAccount'],
					},
				},
			},
			// 更新量化账户的参数 - 复用创建账户的所有参数，但添加ID选择
			{
				displayName: 'Account to Update',
				name: 'updateAccountId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the quantitative account to update',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Account Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				description: 'Name of the quantitative account',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Quantitative account ID',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Account Type',
				name: 'account_type',
				type: 'options',
				required: true,
				options: [
					{
						name: 'MT4',
						value: 'mt4',
					},
					{
						name: 'MT5',
						value: 'mt5',
					},
				],
				default: 'mt5',
				description: 'Account type',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Is Real Account',
				name: 'is_real',
				type: 'boolean',
				required: true,
				default: true,
				description: 'Whether this is a real account (true) or demo account (false)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Dealer',
				name: 'dealer',
				type: 'options',
				required: true,
				default: '',
				description: 'Select the dealer/broker',
				typeOptions: {
					loadOptionsMethod: 'getDealers',
				},
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Server',
				name: 'server',
				type: 'string',
				required: true,
				default: '',
				description: 'Server name',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Capital Type',
				name: 'capital_type',
				type: 'options',
				required: true,
				options: [
					{
						name: 'USD (Dollar)',
						value: 'usd',
					},
					{
						name: 'Cent',
						value: 'cent',
					},
				],
				default: 'usd',
				description: 'Capital type',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Max Leverage',
				name: 'max_lever',
				type: 'options',
				required: true,
				options: [
					{
						name: '1:2',
						value: '1:2',
					},
					{
						name: '1:20',
						value: '1:20',
					},
					{
						name: '1:50',
						value: '1:50',
					},
					{
						name: '1:100',
						value: '1:100',
					},
					{
						name: '1:200',
						value: '1:200',
					},
					{
						name: '1:400',
						value: '1:400',
					},
					{
						name: '1:500',
						value: '1:500',
					},
					{
						name: '1:800',
						value: '1:800',
					},
					{
						name: '1:1000',
						value: '1:1000',
					},
					{
						name: '1:2000',
						value: '1:2000',
					},
					{
						name: '1:无限',
						value: '1:无限',
					},
				],
				default: '1:100',
				description: 'Maximum leverage',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'View Password',
				name: 'view_password',
				type: 'string',
				default: '',
				description: 'View password (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Risk',
				name: 'risk',
				type: 'number',
				required: true,
				default: 100,
				description: 'Risk value - maximum loss percentage that can be tolerated (not a percentage)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Time Zone',
				name: 'time_zone',
				type: 'options',
				required: true,
				options: [
					{
						name: 'UTC',
						value: 'UTC',
					},
					{
						name: 'Europe/Moscow',
						value: 'Europe/Moscow',
					},
					{
						name: 'Asia/Shanghai',
						value: 'Asia/Shanghai',
					},
					{
						name: 'America/New_York',
						value: 'America/New_York',
					},
					{
						name: 'Asia/Tokyo',
						value: 'Asia/Tokyo',
					},
					{
						name: 'Africa/Cairo',
						value: 'Africa/Cairo',
					},
					{
						name: 'America/Los_Angeles',
						value: 'America/Los_Angeles',
					},
				],
				default: 'UTC',
				description: 'Time zone',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'boolean',
				required: true,
				default: true,
				description: 'Account status - true (active) or false (inactive)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				description: 'Note (optional)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['updateAccount'],
					},
				},
			},
			// 删除量化账户的参数
			{
				displayName: 'Account to Delete',
				name: 'deleteAccountId',
				type: 'string',
				required: true,
				default: '',
				description: 'ID of the quantitative account to delete (account must be inactive to delete)',
				displayOptions: {
					show: {
						resource: ['quantAccount'],
						operation: ['deleteAccount'],
					},
				},
			},
		],
	};

	methods = {
		loadOptions: {
			async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// 获取凭据
					const credentials = await this.getCredentials('myPetStocksApi');
					let authToken: string;

					if (credentials.authMethod === 'token') {
						authToken = credentials.token as string;
					} else {
						// 使用用户名密码获取 token
						const loginResponse = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
							body: {
								username: credentials.username,
								password: credentials.password,
							},
							json: true,
						});

						if (loginResponse.code !== 0) {
							throw new Error(`Authentication failed: ${loginResponse.message}`);
						}

						authToken = loginResponse.result.token;
					}

					// 获取账户列表
					const response = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: `${credentials.baseUrl}/api/v1/portal/stock/account/`,
						headers: {
							'Authorization': authToken,
							'Content-Type': 'application/json',
						},
						json: true,
					});

					if (response.code !== 0) {
						throw new Error(`Failed to fetch accounts: ${response.message}`);
					}

					// 格式化账户选项
					const accounts: INodePropertyOptions[] = response.result.results.map((account: unknown) => {
						const acc = account as Record<string, unknown>;
						const statusIcon = acc.status ? '✅活跃' : '❌停用';
						const typeIcon = acc.is_real ? '🔴真实' : '🟡模拟';
						const displayName = `${acc.accountId} -- ${acc.name} -- ${acc.account_type_name} ${acc.dealername} -- ${statusIcon} -- ${typeIcon}`;

						return {
							name: displayName,
							value: (acc.id as number).toString(), // 使用数据库ID作为值
						};
					});

					// 按账户ID排序
					accounts.sort((a: INodePropertyOptions, b: INodePropertyOptions) => {
						const aAccountId = parseInt((a.name as string).split(' -- ')[0]);
						const bAccountId = parseInt((b.name as string).split(' -- ')[0]);
						return aAccountId - bAccountId;
					});

					return accounts;
				} catch (error) {
					// 如果获取账户列表失败，返回空数组
					return [];
				}
			},
			async getDealers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// 获取凭据
					const credentials = await this.getCredentials('myPetStocksApi');
					let authToken: string;

					if (credentials.authMethod === 'token') {
						authToken = credentials.token as string;
					} else {
						// 使用用户名密码获取 token
						const loginResponse = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
							body: {
								username: credentials.username,
								password: credentials.password,
							},
							json: true,
						});

						if (loginResponse.code !== 0) {
							throw new Error(`Authentication failed: ${loginResponse.message}`);
						}

						authToken = loginResponse.result.token;
					}

					// 获取券商列表
					const response = await this.helpers.httpRequest.call(this, {
						method: 'GET',
						url: `${credentials.baseUrl}/api/v1/portal/stock/dealer/`,
						headers: {
							'Authorization': authToken,
							'Content-Type': 'application/json',
						},
						json: true,
					});

					if (response.code !== 0) {
						throw new Error(`Failed to fetch dealers: ${response.message}`);
					}

					// 格式化券商选项
					const dealers: INodePropertyOptions[] = response.result.results.map((dealer: unknown) => {
						const d = dealer as Record<string, unknown>;
						return {
							name: d.name as string,
							value: (d.id as number).toString(),
						};
					});

					return dealers;
				} catch (error) {
					// 如果获取券商列表失败，返回空数组
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'auth') {
					if (operation === 'getToken') {
						const credentials = await this.getCredentials('myPetStocksApi');
						
						if (credentials.authMethod !== 'credentials') {
							throw new NodeOperationError(
								this.getNode(),
								'To get token, please use "Username & Password" authentication method in credentials',
								{ itemIndex: i }
							);
						}

						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'myPetStocksApi',
							{
								method: 'POST',
								url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
								body: {
									username: credentials.username,
									password: credentials.password,
								},
								json: true,
							}
						);

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Authentication failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						returnData.push({
							json: {
								token: response.result.token,
								username: response.result.username,
								userId: response.result.userId,
								message: response.message,
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'testConnection') {
						// 获取凭据
						const credentials = await this.getCredentials('myPetStocksApi');
						if (!credentials) {
							throw new NodeOperationError(
								this.getNode(),
								'No credentials found for MyPet Stocks API',
								{ itemIndex: i }
							);
						}

						// 测试连接 - 这里可以调用一个简单的API端点来验证连接
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'myPetStocksApi',
							{
								method: 'GET',
								url: `${credentials.baseUrl}/api/v1/test`, // 假设有一个测试端点
								json: true,
							}
						);

						returnData.push({
							json: {
								status: 'success',
								message: 'Connection test successful',
								response,
							},
							pairedItem: { item: i },
						});
					}
				} else if (resource === 'trading') {
					if (operation === 'getMarketData') {
						// 获取凭据
						const credentials = await this.getCredentials('myPetStocksApi');
						if (!credentials) {
							throw new NodeOperationError(
								this.getNode(),
								'No credentials found for MyPet Stocks API',
								{ itemIndex: i }
							);
						}

						// 这里添加获取市场数据的逻辑
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'myPetStocksApi',
							{
								method: 'GET',
								url: `${credentials.baseUrl}/api/v1/market/data`, // 假设的市场数据端点
								json: true,
							}
						);

						returnData.push({
							json: response,
							pairedItem: { item: i },
						});
					} else if (operation === 'queryTradeOrders') {
						// 获取凭据
						const credentials = await this.getCredentials('myPetStocksApi');
						if (!credentials) {
							throw new NodeOperationError(
								this.getNode(),
								'No credentials found for MyPet Stocks API',
								{ itemIndex: i }
							);
						}

						// 首先获取认证 token
						let authToken: string;

						if (credentials.authMethod === 'token' && credentials.token) {
							// 如果已经有 token，直接使用
							authToken = `Bearer ${credentials.token}`;
						} else if (credentials.authMethod === 'credentials') {
							// 使用用户名密码获取 token
							const loginResponse = await this.helpers.httpRequest.call(this, {
								method: 'POST',
								url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
								body: {
									username: credentials.username,
									password: credentials.password,
								},
								json: true,
							});

							if (loginResponse.code !== 0) {
								throw new NodeOperationError(
									this.getNode(),
									`Authentication failed: ${loginResponse.message}`,
									{ itemIndex: i }
								);
							}

							authToken = loginResponse.result.token;
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid authentication method. Please use either username/password or token.',
								{ itemIndex: i }
							);
						}

						// 获取查询参数
						const pageNum = this.getNodeParameter('pageNum', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;
						const filterAbnormal = this.getNodeParameter('filterAbnormal', i) as boolean;
						const stockAccount = this.getNodeParameter('stockAccount', i) as string;
						const position = this.getNodeParameter('position', i) as string;
						const tradeType = this.getNodeParameter('tradeType', i) as string;
						const symbol = this.getNodeParameter('symbol', i) as string;
						const ticket = this.getNodeParameter('ticket', i) as string;
						const magic = this.getNodeParameter('magic', i) as string;
						const comment = this.getNodeParameter('comment', i) as string;
						const openTimeStart = this.getNodeParameter('openTimeStart', i) as string;
						const openTimeEnd = this.getNodeParameter('openTimeEnd', i) as string;
						const closeTimeStart = this.getNodeParameter('closeTimeStart', i) as string;
						const closeTimeEnd = this.getNodeParameter('closeTimeEnd', i) as string;

						// 构建查询参数
						const queryParams: Record<string, string> = {};

						if (pageNum) queryParams.pageNum = pageNum.toString();
						if (pageSize) queryParams.pageSize = pageSize.toString();
						if (filterAbnormal !== undefined) queryParams.filter_abnormal = filterAbnormal.toString();
						if (stockAccount) queryParams.stock_account = stockAccount;
						if (position && position !== 'all') queryParams.position = position;
						if (tradeType) queryParams.tradeType = tradeType;
						if (symbol) queryParams.symbol = symbol;
						if (ticket) queryParams.ticket = ticket;
						if (magic) queryParams.magic = magic;
						if (comment) queryParams.comment = comment;
						if (openTimeStart) queryParams.opentime_bj_start = openTimeStart;
						if (openTimeEnd) queryParams.opentime_bj_end = openTimeEnd;
						if (closeTimeStart) queryParams.closetime_bj_start = closeTimeStart;
						if (closeTimeEnd) queryParams.closetime_bj_end = closeTimeEnd;

						// 构建查询字符串
						const queryString = new URLSearchParams(queryParams).toString();
						const url = `${credentials.baseUrl}/api/v1/portal/stock/tradeOrder/${queryString ? '?' + queryString : ''}`;

						// 使用获取的 token 发送请求
						const response = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							json: true,
						});

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Query failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						returnData.push({
							json: {
								message: response.message,
								code: response.code,
								totalCount: response.result.count,
								nextPage: response.result.next,
								previousPage: response.result.previous,
								orders: response.result.results.data,
								orderInfo: response.result.results.order_info,
								queryParams: queryParams,
								authToken: authToken.substring(0, 30) + '...', // 显示部分 token 用于调试
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'getAccountTradingDetails') {
						// 获取凭据
						const credentials = await this.getCredentials('myPetStocksApi');
						if (!credentials) {
							throw new NodeOperationError(
								this.getNode(),
								'No credentials found for MyPet Stocks API',
								{ itemIndex: i }
							);
						}

						// 首先获取认证 token
						let authToken: string;

						if (credentials.authMethod === 'token' && credentials.token) {
							// 如果已经有 token，直接使用
							authToken = `Bearer ${credentials.token}`;
						} else if (credentials.authMethod === 'credentials') {
							// 使用用户名密码获取 token
							const loginResponse = await this.helpers.httpRequest.call(this, {
								method: 'POST',
								url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
								body: {
									username: credentials.username,
									password: credentials.password,
								},
								json: true,
							});

							if (loginResponse.code !== 0) {
								throw new NodeOperationError(
									this.getNode(),
									`Authentication failed: ${loginResponse.message}`,
									{ itemIndex: i }
								);
							}

							authToken = loginResponse.result.token;
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid authentication method. Please use either username/password or token.',
								{ itemIndex: i }
							);
						}

						// 获取请求参数
						const accountId = this.getNodeParameter('accountId', i) as number;
						const scope = this.getNodeParameter('scope', i) as string;

						// 构建请求体
						const requestBody: {
							account_id: number;
							scope: string;
							start_time?: string;
							end_time?: string;
						} = {
							account_id: accountId,
							scope: scope,
						};

						// 如果是自定义时间范围，添加开始和结束时间
						if (scope === 'custom') {
							const startTime = this.getNodeParameter('startTime', i) as string;
							const endTime = this.getNodeParameter('endTime', i) as string;

							if (!startTime || !endTime) {
								throw new NodeOperationError(
									this.getNode(),
									'Start time and end time are required for custom scope',
									{ itemIndex: i }
								);
							}
							requestBody.start_time = startTime;
							requestBody.end_time = endTime;
						}

						// 发送请求
						const response = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: `${credentials.baseUrl}/api/v1/portal/stock/accountStatDetail/`,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							body: requestBody,
							json: true,
						});

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Query failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						// 构建返回数据
						const resultData: {
							message: string;
							code: number;
							accountId: number;
							scope: string;
							timeRange: { startTime: string; endTime: string } | null;
							total: unknown;
							details: unknown[];
							summary: {
								totalRecords: number;
								scopeDescription: string;
							};
						} = {
							message: response.message,
							code: response.code,
							accountId: accountId,
							scope: scope,
							timeRange: null,
							total: response.result.total || null,
							details: response.result.detail || [],
							summary: {
								totalRecords: response.result.detail ? response.result.detail.length : 0,
								scopeDescription: (() => {
									const scopeMap: Record<string, string> = {
										'all': 'All Time',
										'day': 'Daily',
										'week': 'Weekly',
										'month': 'Monthly',
										'quarter': 'Quarterly',
										'year': 'Yearly',
										'custom': 'Custom Range'
									};
									return scopeMap[scope] || scope;
								})(),
							},
						};

						// 如果是自定义范围，添加时间范围信息
						if (scope === 'custom' && requestBody.start_time && requestBody.end_time) {
							resultData.timeRange = {
								startTime: requestBody.start_time,
								endTime: requestBody.end_time
							};
						}

						returnData.push({
							json: resultData as IDataObject,
							pairedItem: { item: i },
						});
					} else if (operation === 'listAccounts') {
						// 获取凭据和认证
						const credentials = await this.getCredentials('myPetStocksApi');
						let authToken: string;

						if (credentials.authMethod === 'token') {
							authToken = credentials.token as string;
						} else {
							// 使用用户名密码获取 token
							const loginResponse = await this.helpers.httpRequest.call(this, {
								method: 'POST',
								url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
								body: {
									username: credentials.username,
									password: credentials.password,
								},
								json: true,
							});

							if (loginResponse.code !== 0) {
								throw new NodeOperationError(
									this.getNode(),
									`Authentication failed: ${loginResponse.message}`,
									{ itemIndex: i }
								);
							}

							authToken = loginResponse.result.token;
						}

						// 获取账户列表
						const response = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: `${credentials.baseUrl}/api/v1/portal/stock/account/`,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							json: true,
						});

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Query failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						// 格式化账户列表数据
						const accounts = response.result.results.map((account: unknown) => {
							const acc = account as Record<string, unknown>;
							return {
								id: acc.id,
								accountId: acc.accountId,
								name: acc.name,
								accountType: acc.account_type_name,
								capitalType: acc.capital_type_name,
								dealerName: acc.dealername,
								server: acc.server,
								maxLever: acc.max_lever,
								isReal: acc.is_real,
								status: acc.status,
								note: acc.note,
								addTime: acc.add_time,
								modTime: acc.mod_time,
							};
						});

						returnData.push({
							json: {
								message: response.message,
								code: response.code,
								totalCount: response.result.count,
								accounts: accounts,
								summary: {
									totalAccounts: accounts.length,
									activeAccounts: accounts.filter((acc: unknown) => {
										const account = acc as Record<string, unknown>;
										return account.status;
									}).length,
									realAccounts: accounts.filter((acc: unknown) => {
										const account = acc as Record<string, unknown>;
										return account.isReal;
									}).length,
									demoAccounts: accounts.filter((acc: unknown) => {
										const account = acc as Record<string, unknown>;
										return !account.isReal;
									}).length,
								},
							} as IDataObject,
							pairedItem: { item: i },
						});
					} else if (operation === 'getAccountTradingStatus') {
						// 获取凭据和认证
						const credentials = await this.getCredentials('myPetStocksApi');
						let authToken: string;

						if (credentials.authMethod === 'token') {
							authToken = credentials.token as string;
						} else {
							// 使用用户名密码获取 token
							const loginResponse = await this.helpers.httpRequest.call(this, {
								method: 'POST',
								url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
								body: {
									username: credentials.username,
									password: credentials.password,
								},
								json: true,
							});

							if (loginResponse.code !== 0) {
								throw new NodeOperationError(
									this.getNode(),
									`Authentication failed: ${loginResponse.message}`,
									{ itemIndex: i }
								);
							}

							authToken = loginResponse.result.token;
						}

						// 获取请求参数
						const pageNum = this.getNodeParameter('pageNum', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;
						const filterAccountId = this.getNodeParameter('filterAccountId', i) as string;
						const filterName = this.getNodeParameter('filterName', i) as string;
						const filterStatus = this.getNodeParameter('filterStatus', i) as string;
						const filterAccountType = this.getNodeParameter('filterAccountType', i) as string;
						const filterIsReal = this.getNodeParameter('filterIsReal', i) as string;

						// 构建查询参数
						const queryParams = new URLSearchParams();
						if (pageNum) queryParams.append('pageNum', pageNum.toString());
						if (pageSize) queryParams.append('pageSize', pageSize.toString());
						if (filterAccountId) queryParams.append('accountId', filterAccountId);
						if (filterName) queryParams.append('name', filterName);
						if (filterStatus) queryParams.append('status', filterStatus);
						if (filterAccountType) queryParams.append('account_type', filterAccountType);
						if (filterIsReal) queryParams.append('is_real', filterIsReal);

						const queryString = queryParams.toString();
						const url = `${credentials.baseUrl}/api/v1/portal/stock/accountStat/${queryString ? '?' + queryString : ''}`;

						// 发送请求
						const response = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: url,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							json: true,
						});

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Query failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						// 格式化账户交易实况数据
						const accountStats = response.result.results.map((account: unknown) => {
							const acc = account as Record<string, unknown>;
							const stat = acc.stat as Record<string, unknown>;
							const holtStat = stat?.holtStat as Record<string, unknown>;

							return {
								id: acc.id,
								username: acc.username,
								name: acc.name,
								accountId: acc.accountId,
								status: acc.status,
								isReal: acc.is_real,
								capitalType: acc.capital_type,
								tradingStats: {
									// 账户基本信息
									accountBalance: stat?.accountBalance || 0,
									accountEquity: stat?.accountEquity || 0,
									accountMargin: stat?.accountMargin || 0,
									accountFreeMargin: stat?.accountFreeMargin || 0,
									floatingProfit: stat?.floatingProfit || 0,

									// 持仓统计
									totalLots: stat?.totalLots || 0,
									totalBuyLots: stat?.totalBuyLots || 0,
									totalSellLots: stat?.totalSellLots || 0,
									totalBuyProfit: stat?.totalBuyProfit || 0,
									totalSellProfit: stat?.totalSellProfit || 0,

									// 持仓数量统计
									holdingStats: {
										sellCount: holtStat?.sell_count || 0,
										buyCount: holtStat?.buy_count || 0,
										total: holtStat?.total || 0,
									},

									// 其他信息
									remoteAddr: stat?.remoteAddr,
									lastUpdateTime: stat?.mod_time,
									addTime: stat?.add_time,
								},
							};
						});

						// 计算汇总统计
						const totalBalance = accountStats.reduce((sum: number, acc: unknown) => {
							const account = acc as Record<string, any>;
							return sum + (account.tradingStats.accountBalance || 0);
						}, 0);
						const totalEquity = accountStats.reduce((sum: number, acc: unknown) => {
							const account = acc as Record<string, any>;
							return sum + (account.tradingStats.accountEquity || 0);
						}, 0);
						const totalFloatingProfit = accountStats.reduce((sum: number, acc: unknown) => {
							const account = acc as Record<string, any>;
							return sum + (account.tradingStats.floatingProfit || 0);
						}, 0);
						const totalLots = accountStats.reduce((sum: number, acc: unknown) => {
							const account = acc as Record<string, any>;
							return sum + (account.tradingStats.totalLots || 0);
						}, 0);
						const activeAccounts = accountStats.filter((acc: unknown) => {
							const account = acc as Record<string, any>;
							return account.status;
						}).length;
						const realAccounts = accountStats.filter((acc: unknown) => {
							const account = acc as Record<string, any>;
							return account.isReal;
						}).length;

						returnData.push({
							json: {
								message: response.message,
								code: response.code,
								pagination: {
									totalCount: response.result.count,
									currentPage: pageNum,
									pageSize: pageSize,
									hasNext: !!response.result.next,
									hasPrevious: !!response.result.previous,
								},
								accounts: accountStats,
								summary: {
									totalAccounts: accountStats.length,
									activeAccounts: activeAccounts,
									realAccounts: realAccounts,
									demoAccounts: accountStats.length - realAccounts,
									totalBalance: totalBalance,
									totalEquity: totalEquity,
									totalFloatingProfit: totalFloatingProfit,
									totalLots: totalLots,
								},
								filters: {
									accountId: filterAccountId || null,
									name: filterName || null,
									status: filterStatus || null,
									accountType: filterAccountType || null,
									isReal: filterIsReal || null,
								},
							} as IDataObject,
							pairedItem: { item: i },
						});
					}
				} else if (resource === 'quantAccount') {
					// 获取凭据和认证
					const credentials = await this.getCredentials('myPetStocksApi');
					let authToken: string;

					if (credentials.authMethod === 'token') {
						authToken = credentials.token as string;
					} else {
						// 使用用户名密码获取 token
						const loginResponse = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: `${credentials.baseUrl}/api/v1/portal/dashlogin/`,
							body: {
								username: credentials.username,
								password: credentials.password,
							},
							json: true,
						});

						if (loginResponse.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Authentication failed: ${loginResponse.message}`,
								{ itemIndex: i }
							);
						}

						authToken = loginResponse.result.token;
					}

					if (operation === 'getAllAccounts') {
						// 获取查询参数
						const pageNum = this.getNodeParameter('pageNum', i) as number;
						const pageSize = this.getNodeParameter('pageSize', i) as number;
						const name = this.getNodeParameter('name', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						const account_type = this.getNodeParameter('account_type', i) as string;
						const is_real = this.getNodeParameter('is_real', i) as string;
						const status = this.getNodeParameter('status', i) as string;

						// 构建查询参数
						const queryParams: Record<string, string> = {};
						if (pageNum) queryParams.pageNum = pageNum.toString();
						if (pageSize) queryParams.pageSize = pageSize.toString();
						if (name) queryParams.name = name;
						if (accountId) queryParams.accountId = accountId;
						if (account_type) queryParams.account_type = account_type;
						if (is_real) queryParams.is_real = is_real;
						if (status) queryParams.status = status;

						// 构建查询字符串
						const queryString = Object.keys(queryParams)
							.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
							.join('&');
						const url = `${credentials.baseUrl}/api/v1/portal/stock/account/${queryString ? '?' + queryString : ''}`;

						// 发送请求
						const response = await this.helpers.httpRequest.call(this, {
							method: 'GET',
							url: url,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							json: true,
						});

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Query failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						returnData.push({
							json: {
								message: response.message,
								code: response.code,
								pagination: {
									totalCount: response.result.count,
									nextPage: response.result.next,
									previousPage: response.result.previous,
								},
								accounts: response.result.results,
								queryParams: queryParams,
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'createAccount') {
						// 获取创建参数
						const name = this.getNodeParameter('name', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						const account_type = this.getNodeParameter('account_type', i) as string;
						const is_real = this.getNodeParameter('is_real', i) as boolean;
						const dealer = this.getNodeParameter('dealer', i) as number;
						const server = this.getNodeParameter('server', i) as string;
						const capital_type = this.getNodeParameter('capital_type', i) as string;
						const max_lever = this.getNodeParameter('max_lever', i) as string;
						const view_password = this.getNodeParameter('view_password', i) as string;
						const risk = this.getNodeParameter('risk', i) as number;
						const time_zone = this.getNodeParameter('time_zone', i) as string;
						const status = this.getNodeParameter('status', i) as boolean;
						const note = this.getNodeParameter('note', i) as string;

						// 构建请求体
						const requestBody: Record<string, unknown> = {
							name,
							accountId,
							account_type,
							is_real,
							dealer,
							server,
							capital_type,
							max_lever,
							risk,
							time_zone,
							status,
						};

						if (view_password) requestBody.view_password = view_password;
						if (note) requestBody.note = note;

						// 发送创建请求
						const response = await this.helpers.httpRequest.call(this, {
							method: 'POST',
							url: `${credentials.baseUrl}/api/v1/portal/stock/account/`,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							body: requestBody,
							json: true,
						});

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Create failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						returnData.push({
							json: {
								message: response.message,
								code: response.code,
								account: response.result,
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'updateAccount') {
						// 获取更新参数
						const updateAccountId = this.getNodeParameter('updateAccountId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						const accountId = this.getNodeParameter('accountId', i) as string;
						const account_type = this.getNodeParameter('account_type', i) as string;
						const is_real = this.getNodeParameter('is_real', i) as boolean;
						const dealer = this.getNodeParameter('dealer', i) as number;
						const server = this.getNodeParameter('server', i) as string;
						const capital_type = this.getNodeParameter('capital_type', i) as string;
						const max_lever = this.getNodeParameter('max_lever', i) as string;
						const view_password = this.getNodeParameter('view_password', i) as string;
						const risk = this.getNodeParameter('risk', i) as number;
						const time_zone = this.getNodeParameter('time_zone', i) as string;
						const status = this.getNodeParameter('status', i) as boolean;
						const note = this.getNodeParameter('note', i) as string;

						// 构建请求体
						const requestBody: Record<string, unknown> = {
							name,
							accountId,
							account_type,
							is_real,
							dealer,
							server,
							capital_type,
							max_lever,
							risk,
							time_zone,
							status,
						};

						if (view_password) requestBody.view_password = view_password;
						if (note) requestBody.note = note;

						// 发送更新请求
						const response = await this.helpers.httpRequest.call(this, {
							method: 'PUT',
							url: `${credentials.baseUrl}/api/v1/portal/stock/account/${updateAccountId}/`,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							body: requestBody,
							json: true,
						});

						if (response.code !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Update failed: ${response.message}`,
								{ itemIndex: i }
							);
						}

						returnData.push({
							json: {
								message: response.message,
								code: response.code,
								account: response.result,
							},
							pairedItem: { item: i },
						});
					} else if (operation === 'deleteAccount') {
						// 获取删除参数
						const deleteAccountId = this.getNodeParameter('deleteAccountId', i) as string;

						// 发送删除请求
						await this.helpers.httpRequest.call(this, {
							method: 'DELETE',
							url: `${credentials.baseUrl}/api/v1/portal/stock/account/${deleteAccountId}/`,
							headers: {
								'Authorization': authToken,
								'Content-Type': 'application/json',
							},
							json: true,
						});

						// 删除成功通常返回204状态码，没有响应体
						returnData.push({
							json: {
								message: 'Account deleted successfully',
								accountId: deleteAccountId,
								success: true,
							},
							pairedItem: { item: i },
						});
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : String(error),
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
