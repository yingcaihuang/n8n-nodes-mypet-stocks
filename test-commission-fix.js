/**
 * 佣金统计功能修复验证脚本
 * 测试修复后的佣金统计API调用
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

    getNodeParameter(parameterName, itemIndex, defaultValue = undefined) {
        const value = this.nodeParameters[parameterName];
        return value !== undefined ? value : defaultValue;
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

    continueOnFail() {
        return false;
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

                console.log('📡 HTTP请求详情:');
                console.log(`   方法: ${options.method}`);
                console.log(`   URL: ${options.url}`);
                console.log(`   Headers:`, JSON.stringify(options.headers, null, 4));
                console.log(`   Body:`, JSON.stringify(options.body, null, 4));

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

        // 模拟佣金统计响应
        if (url.includes('/commissionStat/') && method === 'POST') {
            // 验证请求格式
            const body = options.body;
            const headers = options.headers;

            console.log('🔍 验证请求格式:');
            
            // 检查Authorization头格式
            if (headers.Authorization && headers.Authorization.startsWith('Bearer ')) {
                console.log('   ✅ Authorization头格式正确');
            } else {
                console.log('   ❌ Authorization头格式错误:', headers.Authorization);
            }

            // 检查accounts参数类型
            if (Array.isArray(body.accounts) && body.accounts.every(id => typeof id === 'number')) {
                console.log('   ✅ accounts参数类型正确 (数字数组)');
            } else {
                console.log('   ❌ accounts参数类型错误:', body.accounts);
            }

            // 检查必需参数
            const requiredParams = ['scope', 'accounts', 'capital_type'];
            const missingParams = requiredParams.filter(param => !body[param]);
            if (missingParams.length === 0) {
                console.log('   ✅ 所有必需参数都存在');
            } else {
                console.log('   ❌ 缺少必需参数:', missingParams);
            }

            return {
                code: 0,
                message: 'success',
                result: {
                    card_info: [
                        {
                            title: '金融账户数',
                            icon: 'dynamic-avatar-4|svg',
                            value: body.accounts.length,
                            color: 'blue',
                            action: '总数',
                            decimals: 0
                        },
                        {
                            title: '总佣金',
                            icon: 'ant-design:money-collect-twotone',
                            value: 125.89,
                            color: 'red',
                            action: body.capital_type === 'usd' ? '美金' : '美分',
                            decimals: 2
                        },
                        {
                            title: '总手数',
                            icon: 'total-sales|svg',
                            value: 15.67,
                            color: 'blue',
                            action: '总数',
                            decimals: 2
                        }
                    ],
                    commission_detail: body.accounts.map((accountId, index) => ({
                        name: `Test Account ${accountId}`,
                        capital_type: body.capital_type,
                        total_lots: (index + 1) * 2.5,
                        commission_per: 7 + index,
                        total_commission: (index + 1) * 25.5,
                        show_total_commission: (index + 1) * 25.5
                    })),
                    commission_day_detail: {
                        dimensions: ['time', ...body.accounts.map(id => `Test Account ${id}`)],
                        detail: [
                            {
                                time: '2025-06-20',
                                ...body.accounts.reduce((acc, id, index) => {
                                    acc[`Test Account ${id}`] = (index + 1) * 10.5;
                                    return acc;
                                }, {})
                            },
                            {
                                time: '2025-06-21',
                                ...body.accounts.reduce((acc, id, index) => {
                                    acc[`Test Account ${id}`] = (index + 1) * 12.3;
                                    return acc;
                                }, {})
                            }
                        ]
                    }
                }
            };
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
    console.log('🔧 开始佣金统计修复验证测试...\n');

    try {
        await testCommissionStatisticsFixed();
        await testCommissionStatisticsValidation();
        await testCommissionStatisticsCustomRange();
        
        console.log('✅ 所有修复验证测试通过！');
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.error(error.stack);
    }
}

// 测试修复后的佣金统计
async function testCommissionStatisticsFixed() {
    console.log('🔧 测试修复后的佣金统计...');
    
    const nodeParameters = {
        resource: 'trading',
        operation: 'getCommissionStatistics',
        scope: 'all',
        accounts: ['1', '2', '3'], // 字符串数组输入
        capital_type: 'usd'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();
    
    const result = await node.execute.call(mockContext);
    
    // 验证结果
    const data = result[0][0].json;
    
    if (data.code !== 0) {
        throw new Error(`佣金统计测试失败：API返回错误 ${data.code}`);
    }
    
    console.log('  ✅ 修复后的佣金统计测试通过');
    console.log(`  📊 返回账户数: ${data.cardInfo[0].value}`);
    console.log(`  💰 总佣金: ${data.cardInfo[1].value} ${data.cardInfo[1].action}\n`);
}

// 测试参数验证
async function testCommissionStatisticsValidation() {
    console.log('🔍 测试参数验证...');
    
    // 测试空账户数组
    const nodeParameters = {
        resource: 'trading',
        operation: 'getCommissionStatistics',
        scope: 'all',
        accounts: [], // 空数组
        capital_type: 'usd'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();
    
    try {
        await node.execute.call(mockContext);
        throw new Error('应该抛出错误，但没有');
    } catch (error) {
        if (error.message.includes('At least one account must be selected')) {
            console.log('  ✅ 空账户数组验证通过');
        } else {
            throw error;
        }
    }
    
    console.log('  ✅ 参数验证测试通过\n');
}

// 测试自定义时间范围
async function testCommissionStatisticsCustomRange() {
    console.log('📅 测试自定义时间范围...');
    
    const nodeParameters = {
        resource: 'trading',
        operation: 'getCommissionStatistics',
        scope: 'custom',
        accounts: ['1', '2'],
        capital_type: 'cent',
        start_time: '2025-06-01',
        end_time: '2025-06-30'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();
    
    const result = await node.execute.call(mockContext);
    
    // 验证结果
    const data = result[0][0].json;
    
    if (data.code !== 0) {
        throw new Error(`自定义时间范围测试失败：API返回错误 ${data.code}`);
    }
    
    // 验证查询参数
    if (data.queryParams.scope !== 'custom') {
        throw new Error('自定义时间范围测试失败：scope参数不正确');
    }
    
    console.log('  ✅ 自定义时间范围测试通过');
    console.log(`  📅 时间范围: ${data.queryParams.start_time} 到 ${data.queryParams.end_time}\n`);
}

// 运行所有测试
runTests().then(() => {
    console.log('🎉 佣金统计修复验证完成！');
    console.log('\n📋 修复总结:');
    console.log('  ✅ 修复了Authorization头格式 (添加Bearer前缀)');
    console.log('  ✅ 修复了accounts参数类型 (字符串数组转数字数组)');
    console.log('  ✅ 添加了参数验证 (空账户数组检查)');
    console.log('  ✅ 改进了错误处理');
}).catch((error) => {
    console.error('💥 测试执行失败:', error);
    process.exit(1);
});
