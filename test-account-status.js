#!/usr/bin/env node

const https = require('https');

console.log('📊 测试账户交易实况功能...\n');

// 首先获取 token
async function getAuthToken() {
    console.log('🔐 获取认证 token...');
    
    const loginData = JSON.stringify({
        username: 'admin',
        password: 'nicaiba_88'
    });
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'dash-stock.mypet.run',
            port: 443,
            path: '/api/v1/portal/dashlogin/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length,
                'User-Agent': 'n8n-account-status-test/1.4.0'
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonResponse = JSON.parse(responseData);
                    if (res.statusCode === 200 && jsonResponse.code === 0) {
                        console.log('✅ Token 获取成功');
                        resolve(jsonResponse.result.token);
                    } else {
                        reject(new Error(`Login failed: ${jsonResponse.message}`));
                    }
                } catch (error) {
                    reject(new Error(`JSON parse error: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(loginData);
        req.end();
    });
}

// 获取账户交易实况
async function getAccountTradingStatus(token, params = {}) {
    console.log('\n📊 获取账户交易实况...');
    console.log('请求参数:', params);
    
    // 构建查询参数
    const queryParams = new URLSearchParams();
    if (params.pageNum) queryParams.append('pageNum', params.pageNum.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    if (params.accountId) queryParams.append('accountId', params.accountId);
    if (params.name) queryParams.append('name', params.name);
    if (params.status) queryParams.append('status', params.status);
    if (params.account_type) queryParams.append('account_type', params.account_type);
    if (params.is_real) queryParams.append('is_real', params.is_real);

    const queryString = queryParams.toString();
    const path = `/api/v1/portal/stock/accountStat/${queryString ? '?' + queryString : ''}`;
    
    console.log(`🔗 请求路径: ${path}`);
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'dash-stock.mypet.run',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': 'n8n-account-status-test/1.4.0'
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonResponse = JSON.parse(responseData);
                    console.log(`📥 响应状态: ${res.statusCode}`);
                    
                    if (res.statusCode === 200 && jsonResponse.code === 0) {
                        console.log('✅ 账户交易实况获取成功');
                        console.log(`   账户总数: ${jsonResponse.result.count}`);
                        console.log(`   返回记录数: ${jsonResponse.result.results.length}`);
                        
                        // 显示账户交易实况
                        if (jsonResponse.result.results && jsonResponse.result.results.length > 0) {
                            console.log('\n📊 账户交易实况:');
                            console.log('ID\t账户ID\t\t账户名\t\t余额\t\t净值\t\t浮动盈亏\t持仓手数\t状态');
                            console.log('-'.repeat(100));
                            
                            jsonResponse.result.results.forEach((account) => {
                                const stat = account.stat || {};
                                const status = account.status ? '✅活跃' : '❌停用';
                                const accountType = account.is_real ? '🔴真实' : '🟡模拟';
                                
                                console.log(`${account.id}\t${account.accountId}\t${account.name}\t\t${stat.accountBalance || 0}\t\t${stat.accountEquity || 0}\t\t${stat.floatingProfit || 0}\t\t${stat.totalLots || 0}\t\t${status} ${accountType}`);
                            });
                            
                            // 显示详细统计
                            const totalBalance = jsonResponse.result.results.reduce((sum, acc) => sum + (acc.stat?.accountBalance || 0), 0);
                            const totalEquity = jsonResponse.result.results.reduce((sum, acc) => sum + (acc.stat?.accountEquity || 0), 0);
                            const totalFloatingProfit = jsonResponse.result.results.reduce((sum, acc) => sum + (acc.stat?.floatingProfit || 0), 0);
                            const totalLots = jsonResponse.result.results.reduce((sum, acc) => sum + (acc.stat?.totalLots || 0), 0);
                            const activeCount = jsonResponse.result.results.filter(acc => acc.status).length;
                            const realCount = jsonResponse.result.results.filter(acc => acc.is_real).length;
                            
                            console.log('\n📈 汇总统计:');
                            console.log(`   总余额: ${totalBalance.toFixed(2)}`);
                            console.log(`   总净值: ${totalEquity.toFixed(2)}`);
                            console.log(`   总浮动盈亏: ${totalFloatingProfit.toFixed(2)}`);
                            console.log(`   总持仓手数: ${totalLots.toFixed(2)}`);
                            console.log(`   活跃账户: ${activeCount}/${jsonResponse.result.results.length}`);
                            console.log(`   真实账户: ${realCount}/${jsonResponse.result.results.length}`);
                            
                            // 显示持仓详情
                            console.log('\n📋 持仓详情:');
                            jsonResponse.result.results.forEach((account) => {
                                const stat = account.stat || {};
                                const holtStat = stat.holtStat || {};
                                if (holtStat.total > 0) {
                                    console.log(`   ${account.name} (${account.accountId}): 多单${holtStat.buy_count}个, 空单${holtStat.sell_count}个, 总计${holtStat.total}个`);
                                }
                            });
                        }
                        
                        resolve(jsonResponse);
                    } else {
                        reject(new Error(`Query failed: ${jsonResponse.message || 'Unknown error'} (Status: ${res.statusCode})`));
                    }
                } catch (error) {
                    reject(new Error(`JSON parse error: ${error.message}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.end();
    });
}

// 主测试函数
async function runAccountStatusTest() {
    try {
        // 1. 获取认证 token
        const token = await getAuthToken();
        
        // 2. 测试不同的查询场景
        const testScenarios = [
            {
                name: '测试 1: 获取所有账户交易实况',
                params: {
                    pageNum: 1,
                    pageSize: 10
                }
            },
            {
                name: '测试 2: 筛选活跃账户',
                params: {
                    pageNum: 1,
                    pageSize: 10,
                    status: 'true'
                }
            },
            {
                name: '测试 3: 筛选MT4账户',
                params: {
                    pageNum: 1,
                    pageSize: 10,
                    account_type: 'mt4'
                }
            },
            {
                name: '测试 4: 筛选真实账户',
                params: {
                    pageNum: 1,
                    pageSize: 10,
                    is_real: 'true'
                }
            }
        ];
        
        for (const scenario of testScenarios) {
            console.log('\n' + '='.repeat(80));
            console.log(`🧪 ${scenario.name}`);
            
            try {
                await getAccountTradingStatus(token, scenario.params);
            } catch (error) {
                console.log(`❌ ${scenario.name} 失败: ${error.message}`);
            }
        }
        
        console.log('\n🎉 账户交易实况功能测试完成！');
        
    } catch (error) {
        console.log('\n❌ 测试失败:');
        console.log(`   错误: ${error.message}`);
        process.exit(1);
    }
}

// 运行测试
runAccountStatusTest();
