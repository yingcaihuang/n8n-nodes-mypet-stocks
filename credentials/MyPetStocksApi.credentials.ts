import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MyPetStocksApi implements ICredentialType {
	name = 'myPetStocksApi';
	displayName = 'MyPet Stocks API';
	documentationUrl = 'https://dash-stock.mypet.run';
	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'Username & Password',
					value: 'credentials',
				},
				{
					name: 'Bearer Token',
					value: 'token',
				},
			],
			default: 'credentials',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					authMethod: ['credentials'],
				},
			},
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authMethod: ['credentials'],
				},
			},
		},
		{
			displayName: 'Bearer Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					authMethod: ['token'],
				},
			},
			description: 'The Bearer token (without "Bearer " prefix)',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://dash-stock.mypet.run',
			description: 'Base URL for the MyPet Stocks API',
		},
	];

	// 定义如何使用凭据进行身份验证
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{$credentials.authMethod === "token" ? "Bearer " + $credentials.token : ""}}',
			},
		},
	};

	// 测试凭据是否有效 - 暂时禁用自动测试，因为需要 POST 请求体
	// test: ICredentialTestRequest = {
	// 	request: {
	// 		baseURL: '={{$credentials.baseUrl}}',
	// 		url: '/api/v1/portal/dashlogin/',
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: {
	// 			username: '={{$credentials.username}}',
	// 			password: '={{$credentials.password}}',
	// 		},
	// 	},
	// };
}
