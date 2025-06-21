#!/usr/bin/env node

const https = require('https');

console.log('🔧 测试认证修复...\n');

// 模拟 n8n 节点的认证流程
async function testAuthenticationFlow() {
    console.log('📋 测试场景: 使用用户名密码获取 token 然后查询订单');
    
    // 步骤 1: 模拟获取 token
    console.log('\n🔐 步骤 1: 获取认证 token...');
    
    const loginData = JSON.stringify({
        username: 'admin',
        password: 'nicaiba_88'
    });
    
    const token = await new Promise((resolve, reject) => {
        const options = {
            hostname: 'dash-stock.mypet.run',
            port: 443,
            path: '/api/v1/portal/dashlogin/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length,
                'User-Agent': 'n8n-auth-fix-test/1.1.0'
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
    
    // 步骤 2: 使用 token 查询订单
    console.log('\n📊 步骤 2: 使用 token 查询订单...');
    
    const queryParams = new URLSearchParams({
        pageNum: '1',
        pageSize: '3',
        filter_abnormal: 'false'
    }).toString();
    
    const queryPath = `/api/v1/portal/stock/tradeOrder/?${queryParams}`;
    console.log(`🔗 查询路径: ${queryPath}`);
    console.log(`🔑 使用 Token: ${token.substring(0, 30)}...`);
    
    const queryResult = await new Promise((resolve, reject) => {
        const options = {
            hostname: 'dash-stock.mypet.run',
            port: 443,
            path: queryPath,
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': 'n8n-auth-fix-test/1.1.0'
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
                        console.log('✅ 订单查询成功');
                        console.log(`   总记录数: ${jsonResponse.result.count}`);
                        console.log(`   当前页记录数: ${jsonResponse.result.results.data.length}`);
                        
                        if (jsonResponse.result.results.data.length > 0) {
                            console.log('\n📊 订单示例:');
                            jsonResponse.result.results.data.forEach((order, index) => {
                                console.log(`   ${index + 1}. Ticket: ${order.ticket}, Symbol: ${order.symbol}, Type: ${order.tradeType}, Profit: ${order.orderProfit}`);
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
    
    console.log('\n🎉 认证流程测试成功！');
    console.log('✅ 用户名密码 → Token 获取 → 订单查询 全流程正常');
    
    return {
        token: token,
        queryResult: queryResult
    };
}

// 测试不同的认证场景
async function testDifferentAuthScenarios() {
    console.log('\n' + '='.repeat(60));
    console.log('🧪 测试不同认证场景');
    
    try {
        // 场景 1: 正常流程
        console.log('\n📋 场景 1: 正常的用户名密码认证流程');
        const result1 = await testAuthenticationFlow();
        
        // 场景 2: 直接使用 token
        console.log('\n📋 场景 2: 直接使用已有 token 查询');
        const token = result1.token;
        
        const directQueryParams = new URLSearchParams({
            pageNum: '1',
            pageSize: '2',
            tradeType: 'Buy'
        }).toString();
        
        const directQueryPath = `/api/v1/portal/stock/tradeOrder/?${directQueryParams}`;
        
        const directResult = await new Promise((resolve, reject) => {
            const options = {
                hostname: 'dash-stock.mypet.run',
                port: 443,
                path: directQueryPath,
                method: 'GET',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                    'User-Agent': 'n8n-direct-token-test/1.1.0'
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
                            console.log('✅ 直接 token 查询成功');
                            console.log(`   查询到 ${jsonResponse.result.results.data.length} 条买单记录`);
                            resolve(jsonResponse);
                        } else {
                            reject(new Error(`Direct query failed: ${jsonResponse.message}`));
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
        
        console.log('\n🎉 所有认证场景测试成功！');
        console.log('✅ n8n 节点现在应该可以正确处理订单查询的认证问题');
        
    } catch (error) {
        console.log('\n❌ 测试失败:');
        console.log(`   错误: ${error.message}`);
        process.exit(1);
    }
}

// 运行测试
testDifferentAuthScenarios();
