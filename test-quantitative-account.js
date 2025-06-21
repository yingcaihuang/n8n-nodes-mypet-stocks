/**
 * 量化账户功能测试脚本
 * 测试 MyPet Stocks 节点的量化账户相关功能
 */

const { MyPetStocks } = require('./dist/nodes/MyPetStocks/MyPetStocks.node.js');

// 模拟 n8n 的执行上下文
class MockExecuteFunctions {
    constructor(credentials, nodeParameters) {
        this.credentials = credentials;
        this.nodeParameters = nodeParameters;
        this.httpRequestCalls = [];
    }

    async getCredentials(type) {
        return this.credentials;
    }

    getNodeParameter(parameterName, itemIndex) {
        return this.nodeParameters[parameterName];
    }

    getNode() {
        return {
            name: 'MyPetStocks Test Node',
            type: 'n8n-nodes-mypet-stocks.myPetStocks'
        };
    }

    getInputData() {
        return [{ json: {} }];
    }

    helpers = {
        httpRequest: {
            call: async (context, options) => {
                // 记录HTTP请求用于验证
                this.httpRequestCalls.push({
                    method: options.method,
                    url: options.url,
                    headers: options.headers,
                    body: options.body
                });

                // 模拟不同的API响应
                return this.mockApiResponse(options);
            }
        }
    };

    mockApiResponse(options) {
        const url = options.url;
        const method = options.method;

        // 模拟登录响应
        if (url.includes('/dashlogin/') && method === 'POST') {
            return {
                code: 0,
                message: 'Login successful',
                result: {
                    token: 'mock-auth-token-12345'
                }
            };
        }

        // 模拟获取券商列表响应
        if (url.includes('/dealer/') && method === 'GET') {
            return {
                code: 0,
                message: 'Success',
                result: {
                    results: [
                        { id: 1, name: 'Broker A' },
                        { id: 2, name: 'Broker B' },
                        { id: 3, name: 'Broker C' }
                    ]
                }
            };
        }

        // 模拟获取所有量化账户响应
        if (url.includes('/stock/account/') && method === 'GET') {
            return {
                code: 0,
                message: 'Success',
                result: {
                    count: 25,
                    next: 'http://example.com/api/v1/portal/stock/account/?pageNum=2',
                    previous: null,
                    results: [
                        {
                            id: 1,
                            name: 'Test Account 1',
                            accountId: 'ACC001',
                            account_type: 'mt5',
                            is_real: true,
                            dealer: 1,
                            server: 'MT5-Server-01',
                            capital_type: 'usd',
                            max_lever: '1:100',
                            risk: 100,
                            time_zone: 'UTC',
                            status: true,
                            note: 'Test account'
                        },
                        {
                            id: 2,
                            name: 'Test Account 2',
                            accountId: 'ACC002',
                            account_type: 'mt4',
                            is_real: false,
                            dealer: 2,
                            server: 'MT4-Demo-01',
                            capital_type: 'cent',
                            max_lever: '1:500',
                            risk: 50,
                            time_zone: 'Asia/Shanghai',
                            status: false,
                            note: 'Demo account'
                        }
                    ]
                }
            };
        }

        // 模拟创建量化账户响应
        if (url.includes('/stock/account/') && method === 'POST') {
            return {
                code: 0,
                message: 'Account created successfully',
                result: {
                    id: 3,
                    name: options.body.name,
                    accountId: options.body.accountId,
                    account_type: options.body.account_type,
                    is_real: options.body.is_real,
                    dealer: options.body.dealer,
                    server: options.body.server,
                    capital_type: options.body.capital_type,
                    max_lever: options.body.max_lever,
                    risk: options.body.risk,
                    time_zone: options.body.time_zone,
                    status: options.body.status,
                    note: options.body.note || '',
                    created_at: new Date().toISOString()
                }
            };
        }

        // 模拟更新量化账户响应
        if (url.includes('/stock/account/') && method === 'PUT') {
            const accountId = url.split('/').slice(-2, -1)[0];
            return {
                code: 0,
                message: 'Account updated successfully',
                result: {
                    id: parseInt(accountId),
                    name: options.body.name,
                    accountId: options.body.accountId,
                    account_type: options.body.account_type,
                    is_real: options.body.is_real,
                    dealer: options.body.dealer,
                    server: options.body.server,
                    capital_type: options.body.capital_type,
                    max_lever: options.body.max_lever,
                    risk: options.body.risk,
                    time_zone: options.body.time_zone,
                    status: options.body.status,
                    note: options.body.note || '',
                    updated_at: new Date().toISOString()
                }
            };
        }

        // 模拟删除量化账户响应 (DELETE通常返回204，但我们模拟一个成功响应)
        if (url.includes('/stock/account/') && method === 'DELETE') {
            return null; // DELETE请求通常没有响应体
        }

        // 默认错误响应
        throw new Error(`Unexpected API call: ${method} ${url}`);
    }

    getLastHttpRequest() {
        return this.httpRequestCalls[this.httpRequestCalls.length - 1];
    }

    getAllHttpRequests() {
        return this.httpRequestCalls;
    }

    clearHttpRequests() {
        this.httpRequestCalls = [];
    }
}

// 测试配置
const testCredentials = {
    baseUrl: 'https://api.example.com',
    authMethod: 'userpass',
    username: 'testuser',
    password: 'testpass'
};

// 测试用例
async function runTests() {
    console.log('🚀 开始量化账户功能测试...\n');

    try {
        await testGetAllAccounts();
        await testCreateAccount();
        await testUpdateAccount();
        await testDeleteAccount();
        await testGetDealers();
        
        console.log('✅ 所有测试通过！');
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.error(error.stack);
    }
}

// 测试获取所有量化账户
async function testGetAllAccounts() {
    console.log('📋 测试获取所有量化账户...');
    
    const nodeParameters = {
        resource: 'quantAccount',
        operation: 'getAllAccounts',
        pageNum: 1,
        pageSize: 20,
        name: '',
        accountId: '',
        account_type: '',
        is_real: '',
        status: ''
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();
    
    const result = await node.execute.call(mockContext);
    
    // 验证结果
    console.log('  📊 返回数据:', JSON.stringify(result, null, 2));

    if (!result || result.length === 0) {
        throw new Error('获取所有账户测试失败：没有返回数据');
    }

    // 修复：result是一个数组，包含一个数组，其中包含返回的数据项
    const data = result[0][0].json;
    if (data.code !== 0) {
        throw new Error(`获取所有账户测试失败：API返回错误 ${data.code}`);
    }
    
    if (!data.accounts || !Array.isArray(data.accounts)) {
        throw new Error('获取所有账户测试失败：返回的账户列表格式错误');
    }
    
    console.log('  ✅ 获取所有账户测试通过');
    console.log(`  📈 共获取到 ${data.accounts.length} 个账户`);
    console.log(`  📄 总记录数: ${data.pagination.totalCount}\n`);
}

// 测试创建量化账户
async function testCreateAccount() {
    console.log('➕ 测试创建量化账户...');

    const nodeParameters = {
        resource: 'quantAccount',
        operation: 'createAccount',
        name: 'Test New Account',
        accountId: 'ACC999',
        account_type: 'mt5',
        is_real: true,
        dealer: 1,
        server: 'MT5-Test-Server',
        capital_type: 'usd',
        max_lever: '1:200',
        view_password: 'view123',
        risk: 75,
        time_zone: 'Asia/Shanghai',
        status: true,
        note: 'Created by test script'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();

    const result = await node.execute.call(mockContext);

    // 验证结果
    console.log('  📊 返回数据:', JSON.stringify(result, null, 2));

    if (!result || result.length === 0) {
        throw new Error('创建账户测试失败：没有返回数据');
    }

    const data = result[0][0].json;
    if (data.code !== 0) {
        throw new Error(`创建账户测试失败：API返回错误 ${data.code}`);
    }

    if (!data.account) {
        throw new Error('创建账户测试失败：没有返回创建的账户信息');
    }

    // 验证创建的账户信息
    const account = data.account;
    if (account.name !== nodeParameters.name) {
        throw new Error('创建账户测试失败：账户名称不匹配');
    }

    if (account.accountId !== nodeParameters.accountId) {
        throw new Error('创建账户测试失败：账户ID不匹配');
    }

    console.log('  ✅ 创建账户测试通过');
    console.log(`  🆔 新账户ID: ${account.id}`);
    console.log(`  📝 账户名称: ${account.name}\n`);
}

// 测试更新量化账户
async function testUpdateAccount() {
    console.log('✏️ 测试更新量化账户...');

    const nodeParameters = {
        resource: 'quantAccount',
        operation: 'updateAccount',
        updateAccountId: '1',
        name: 'Updated Test Account',
        accountId: 'ACC001-UPDATED',
        account_type: 'mt4',
        is_real: false,
        dealer: 2,
        server: 'MT4-Updated-Server',
        capital_type: 'cent',
        max_lever: '1:500',
        view_password: 'newview123',
        risk: 50,
        time_zone: 'Europe/Moscow',
        status: false,
        note: 'Updated by test script'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();

    const result = await node.execute.call(mockContext);

    // 验证结果
    console.log('  📊 返回数据:', JSON.stringify(result, null, 2));

    if (!result || result.length === 0) {
        throw new Error('更新账户测试失败：没有返回数据');
    }

    const data = result[0][0].json;
    if (data.code !== 0) {
        throw new Error(`更新账户测试失败：API返回错误 ${data.code}`);
    }

    if (!data.account) {
        throw new Error('更新账户测试失败：没有返回更新的账户信息');
    }

    // 验证更新的账户信息
    const account = data.account;
    if (account.name !== nodeParameters.name) {
        throw new Error('更新账户测试失败：账户名称未正确更新');
    }

    if (account.account_type !== nodeParameters.account_type) {
        throw new Error('更新账户测试失败：账户类型未正确更新');
    }

    console.log('  ✅ 更新账户测试通过');
    console.log(`  🆔 账户ID: ${account.id}`);
    console.log(`  📝 新名称: ${account.name}\n`);
}

// 测试删除量化账户
async function testDeleteAccount() {
    console.log('🗑️ 测试删除量化账户...');

    const nodeParameters = {
        resource: 'quantAccount',
        operation: 'deleteAccount',
        deleteAccountId: '2'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();

    const result = await node.execute.call(mockContext);

    // 验证结果
    console.log('  📊 返回数据:', JSON.stringify(result, null, 2));

    if (!result || result.length === 0) {
        throw new Error('删除账户测试失败：没有返回数据');
    }

    const data = result[0][0].json;
    if (!data.success) {
        throw new Error('删除账户测试失败：删除操作未成功');
    }

    if (data.accountId !== nodeParameters.deleteAccountId) {
        throw new Error('删除账户测试失败：删除的账户ID不匹配');
    }

    console.log('  ✅ 删除账户测试通过');
    console.log(`  🗑️ 已删除账户ID: ${data.accountId}\n`);
}

// 测试获取券商列表
async function testGetDealers() {
    console.log('🏢 测试获取券商列表...');

    // 创建模拟的 ILoadOptionsFunctions 上下文
    class MockLoadOptionsFunctions {
        constructor(credentials) {
            this.credentials = credentials;
            this.httpRequestCalls = [];
        }

        async getCredentials(type) {
            return this.credentials;
        }

        helpers = {
            httpRequest: {
                call: async (context, options) => {
                    this.httpRequestCalls.push({
                        method: options.method,
                        url: options.url,
                        headers: options.headers,
                        body: options.body
                    });

                    // 模拟登录响应
                    if (options.url.includes('/dashlogin/') && options.method === 'POST') {
                        return {
                            code: 0,
                            message: 'Login successful',
                            result: {
                                token: 'mock-auth-token-12345'
                            }
                        };
                    }

                    // 模拟获取券商列表响应
                    if (options.url.includes('/dealer/') && options.method === 'GET') {
                        return {
                            code: 0,
                            message: 'Success',
                            result: {
                                results: [
                                    { id: 1, name: 'XM Trading' },
                                    { id: 2, name: 'FXCM' },
                                    { id: 3, name: 'IG Markets' },
                                    { id: 4, name: 'OANDA' },
                                    { id: 5, name: 'Pepperstone' }
                                ]
                            }
                        };
                    }

                    throw new Error(`Unexpected API call: ${options.method} ${options.url}`);
                }
            }
        };
    }

    const mockLoadContext = new MockLoadOptionsFunctions(testCredentials);
    const node = new MyPetStocks();

    // 调用 getDealers 方法
    const dealers = await node.methods.loadOptions.getDealers.call(mockLoadContext);

    // 验证结果
    console.log('  📊 券商列表:', JSON.stringify(dealers, null, 2));

    if (!dealers || !Array.isArray(dealers)) {
        throw new Error('获取券商列表测试失败：返回数据不是数组');
    }

    if (dealers.length === 0) {
        throw new Error('获取券商列表测试失败：券商列表为空');
    }

    // 验证券商数据格式
    for (const dealer of dealers) {
        if (!dealer.name || !dealer.value) {
            throw new Error('获取券商列表测试失败：券商数据格式错误');
        }
    }

    console.log('  ✅ 获取券商列表测试通过');
    console.log(`  🏢 共获取到 ${dealers.length} 个券商\n`);
}

// 运行所有测试
runTests().then(() => {
    console.log('🎉 测试完成！');
}).catch((error) => {
    console.error('💥 测试执行失败:', error);
    process.exit(1);
});
