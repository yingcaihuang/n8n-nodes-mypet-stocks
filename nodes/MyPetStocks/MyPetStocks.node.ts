import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
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
				],
				default: 'getMarketData',
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
								url: '/api/v1/portal/dashlogin/',
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
						// 测试连接 - 这里可以调用一个简单的API端点来验证连接
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'myPetStocksApi',
							{
								method: 'GET',
								url: '/api/v1/test', // 假设有一个测试端点
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
						// 这里添加获取市场数据的逻辑
						const response = await this.helpers.httpRequestWithAuthentication.call(
							this,
							'myPetStocksApi',
							{
								method: 'GET',
								url: '/api/v1/market/data', // 假设的市场数据端点
								json: true,
							}
						);

						returnData.push({
							json: response,
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
