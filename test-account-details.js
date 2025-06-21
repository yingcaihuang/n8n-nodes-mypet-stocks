#!/usr/bin/env node

const https = require('https');

console.log('📊 测试账户交易详情功能...\n');

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
                'User-Agent': 'n8n-account-details-test/1.1.1'
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
                        console.log(`   Token: ${jsonResponse.result.token.substring(0, 30)}...`);
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

// 查询账户交易详情
async function getAccountTradingDetails(token, requestBody) {
    console.log('\n📋 查询账户交易详情...');
    console.log('请求参数:', requestBody);
    
    const postData = JSON.stringify(requestBody);
    const path = '/api/v1/portal/stock/accountStatDetail/';
    
    console.log(`🔗 请求路径: ${path}`);
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'dash-stock.mypet.run',
            port: 443,
            path: path,
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'User-Agent': 'n8n-account-details-test/1.1.1'
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
                        console.log('✅ 账户交易详情查询成功');
                        console.log(`   详情记录数: ${jsonResponse.result.detail ? jsonResponse.result.detail.length : 0}`);
                        
                        // 显示总体信息
                        if (jsonResponse.result.total) {
                            console.log('\n📈 总体统计:');
                            console.log(JSON.stringify(jsonResponse.result.total, null, 2));
                        }
                        
                        // 显示详情摘要
                        if (jsonResponse.result.detail && jsonResponse.result.detail.length > 0) {
                            console.log('\n📊 交易详情摘要 (前3条):');
                            jsonResponse.result.detail.slice(0, 3).forEach((detail, index) => {
                                console.log(`   ${index + 1}. 时间: ${detail.time}, 订单数: ${detail.count}, 总手数: ${detail.total_lots}, 盈亏: ${detail.orderProfit}`);
                            });
                            
                            // 计算汇总统计
                            const totalProfit = jsonResponse.result.detail.reduce((sum, item) => sum + (item.orderProfit || 0), 0);
                            const totalLots = jsonResponse.result.detail.reduce((sum, item) => sum + (item.total_lots || 0), 0);
                            const totalOrders = jsonResponse.result.detail.reduce((sum, item) => sum + (item.count || 0), 0);
                            
                            console.log('\n📈 汇总统计:');
                            console.log(`   总盈亏: ${totalProfit.toFixed(2)}`);
                            console.log(`   总手数: ${totalLots.toFixed(2)}`);
                            console.log(`   总订单数: ${totalOrders}`);
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
        
        req.write(postData);
        req.end();
    });
}

// 主测试函数
async function runAccountDetailsTest() {
    try {
        // 1. 获取认证 token
        const token = await getAuthToken();
        
        // 2. 测试不同的查询场景
        const testScenarios = [
            {
                name: '测试 1: 查询所有时间的交易详情',
                requestBody: {
                    scope: 'all',
                    account_id: 39  // 使用一个测试账户ID
                }
            },
            {
                name: '测试 2: 查询月度交易详情',
                requestBody: {
                    scope: 'month',
                    account_id: 39
                }
            },
            {
                name: '测试 3: 查询自定义时间范围',
                requestBody: {
                    scope: 'custom',
                    account_id: 39,
                    start_time: '2024-11-01',
                    end_time: '2024-11-30'
                }
            }
        ];
        
        for (const scenario of testScenarios) {
            console.log('\n' + '='.repeat(60));
            console.log(`🧪 ${scenario.name}`);
            
            try {
                await getAccountTradingDetails(token, scenario.requestBody);
            } catch (error) {
                console.log(`❌ ${scenario.name} 失败: ${error.message}`);
            }
        }
        
        console.log('\n🎉 账户交易详情功能测试完成！');
        
    } catch (error) {
        console.log('\n❌ 测试失败:');
        console.log(`   错误: ${error.message}`);
        process.exit(1);
    }
}

// 运行测试
runAccountDetailsTest();
