import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
	IDataObject,
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
				],
				default: 'getMarketData',
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
				displayName: 'Account ID',
				name: 'accountId',
				type: 'number',
				required: true,
				default: '',
				description: 'Quantitative account ID to query',
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
		],
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
