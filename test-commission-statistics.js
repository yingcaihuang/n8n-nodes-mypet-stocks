/**
 * 佣金统计功能测试脚本
 * 测试 MyPet Stocks 节点的佣金统计功能
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

        // 模拟佣金统计响应
        if (url.includes('/commissionStat/') && method === 'POST') {
            return {
                code: 0,
                message: 'success',
                result: {
                    card_info: [
                        {
                            title: '金融账户数',
                            icon: 'dynamic-avatar-4|svg',
                            value: 3,
                            color: 'blue',
                            action: '总数',
                            decimals: 0
                        },
                        {
                            title: '总佣金',
                            icon: 'ant-design:money-collect-twotone',
                            value: 125.89,
                            color: 'red',
                            action: '美金',
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
                    commission_detail: [
                        {
                            name: 'Test Account 1',
                            capital_type: 'usd',
                            total_lots: 8.45,
                            commission_per: 7,
                            total_commission: 59.15,
                            show_total_commission: 59.15
                        },
                        {
                            name: 'Test Account 2',
                            capital_type: 'usd',
                            total_lots: 5.22,
                            commission_per: 8,
                            total_commission: 41.76,
                            show_total_commission: 41.76
                        },
                        {
                            name: 'Test Account 3',
                            capital_type: 'usd',
                            total_lots: 2.00,
                            commission_per: 12.5,
                            total_commission: 24.98,
                            show_total_commission: 24.98
                        }
                    ],
                    commission_day_detail: {
                        dimensions: [
                            'time',
                            'Test Account 1',
                            'Test Account 2',
                            'Test Account 3'
                        ],
                        detail: [
                            {
                                time: '2025-06-15',
                                'Test Account 1': 15.25,
                                'Test Account 2': 12.30,
                                'Test Account 3': 8.45
                            },
                            {
                                time: '2025-06-16',
                                'Test Account 1': 18.90,
                                'Test Account 2': 14.76,
                                'Test Account 3': 6.23
                            },
                            {
                                time: '2025-06-17',
                                'Test Account 1': 25.00,
                                'Test Account 2': 14.70,
                                'Test Account 3': 10.30
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
    console.log('🚀 开始佣金统计功能测试...\n');

    try {
        await testCommissionStatisticsAllTime();
        await testCommissionStatisticsCustomRange();
        await testCommissionStatisticsToday();
        
        console.log('✅ 所有测试通过！');
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.error(error.stack);
    }
}

// 测试全时间范围佣金统计
async function testCommissionStatisticsAllTime() {
    console.log('📊 测试全时间范围佣金统计...');
    
    const nodeParameters = {
        resource: 'trading',
        operation: 'getCommissionStatistics',
        scope: 'all',
        accounts: ['1', '2', '3'],
        capital_type: 'usd'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();
    
    const result = await node.execute.call(mockContext);
    
    // 验证结果
    console.log('  📊 返回数据:', JSON.stringify(result, null, 2));
    
    if (!result || result.length === 0) {
        throw new Error('佣金统计测试失败：没有返回数据');
    }
    
    const data = result[0][0].json;
    if (data.code !== 0) {
        throw new Error(`佣金统计测试失败：API返回错误 ${data.code}`);
    }
    
    if (!data.cardInfo || !Array.isArray(data.cardInfo)) {
        throw new Error('佣金统计测试失败：卡片信息格式错误');
    }
    
    if (!data.commissionDetail || !Array.isArray(data.commissionDetail)) {
        throw new Error('佣金统计测试失败：佣金详情格式错误');
    }
    
    if (!data.commissionDayDetail || !data.commissionDayDetail.dimensions) {
        throw new Error('佣金统计测试失败：每日佣金详情格式错误');
    }
    
    console.log('  ✅ 全时间范围佣金统计测试通过');
    console.log(`  📈 总账户数: ${data.cardInfo[0].value}`);
    console.log(`  💰 总佣金: ${data.cardInfo[1].value} ${data.cardInfo[1].action}`);
    console.log(`  📊 总手数: ${data.cardInfo[2].value}\n`);
}

// 测试自定义时间范围佣金统计
async function testCommissionStatisticsCustomRange() {
    console.log('📅 测试自定义时间范围佣金统计...');
    
    const nodeParameters = {
        resource: 'trading',
        operation: 'getCommissionStatistics',
        scope: 'custom',
        accounts: ['1', '2'],
        capital_type: 'usd',
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
    
    if (data.queryParams.start_time !== '2025-06-01') {
        throw new Error('自定义时间范围测试失败：start_time参数不正确');
    }
    
    if (data.queryParams.end_time !== '2025-06-30') {
        throw new Error('自定义时间范围测试失败：end_time参数不正确');
    }
    
    console.log('  ✅ 自定义时间范围佣金统计测试通过');
    console.log(`  📅 查询时间范围: ${data.queryParams.start_time} 到 ${data.queryParams.end_time}\n`);
}

// 测试今日佣金统计
async function testCommissionStatisticsToday() {
    console.log('📅 测试今日佣金统计...');
    
    const nodeParameters = {
        resource: 'trading',
        operation: 'getCommissionStatistics',
        scope: 'today',
        accounts: ['1'],
        capital_type: 'cent'
    };

    const mockContext = new MockExecuteFunctions(testCredentials, nodeParameters);
    const node = new MyPetStocks();
    
    const result = await node.execute.call(mockContext);
    
    // 验证结果
    const data = result[0][0].json;
    
    if (data.code !== 0) {
        throw new Error(`今日佣金统计测试失败：API返回错误 ${data.code}`);
    }
    
    // 验证查询参数
    if (data.queryParams.scope !== 'today') {
        throw new Error('今日佣金统计测试失败：scope参数不正确');
    }
    
    if (data.queryParams.capital_type !== 'cent') {
        throw new Error('今日佣金统计测试失败：capital_type参数不正确');
    }
    
    console.log('  ✅ 今日佣金统计测试通过');
    console.log(`  💱 佣金单位: ${data.queryParams.capital_type}\n`);
}

// 运行所有测试
runTests().then(() => {
    console.log('🎉 佣金统计功能测试完成！');
}).catch((error) => {
    console.error('💥 测试执行失败:', error);
    process.exit(1);
});
