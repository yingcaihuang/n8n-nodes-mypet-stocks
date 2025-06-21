#!/usr/bin/env node

const https = require('https');

console.log('📋 测试账户列表功能...\n');

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
                'User-Agent': 'n8n-account-list-test/1.2.1'
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

// 获取账户列表
async function getAccountList(token) {
    console.log('\n📋 获取账户列表...');
    
    const path = '/api/v1/portal/stock/account/';
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
                'User-Agent': 'n8n-account-list-test/1.2.1'
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
                        console.log('✅ 账户列表获取成功');
                        console.log(`   账户总数: ${jsonResponse.result.count}`);
                        
                        // 显示账户列表
                        if (jsonResponse.result.results && jsonResponse.result.results.length > 0) {
                            console.log('\n📊 账户列表:');
                            console.log('ID\t账户ID\t\t账户名称\t\t类型\t经纪商\t状态');
                            console.log('-'.repeat(80));
                            
                            jsonResponse.result.results.forEach((account) => {
                                const status = account.status ? '✅活跃' : '❌停用';
                                const accountType = account.is_real ? '🔴真实' : '🟡模拟';
                                console.log(`${account.id}\t${account.accountId}\t${account.name}\t\t${account.account_type_name}\t${account.dealername}\t${status} ${accountType}`);
                            });
                            
                            // 显示统计信息
                            const activeCount = jsonResponse.result.results.filter(acc => acc.status).length;
                            const realCount = jsonResponse.result.results.filter(acc => acc.is_real).length;
                            const demoCount = jsonResponse.result.results.filter(acc => !acc.is_real).length;
                            
                            console.log('\n📈 统计信息:');
                            console.log(`   总账户数: ${jsonResponse.result.results.length}`);
                            console.log(`   活跃账户: ${activeCount}`);
                            console.log(`   真实账户: ${realCount}`);
                            console.log(`   模拟账户: ${demoCount}`);
                            
                            // 显示ID映射关系
                            console.log('\n🔗 账户ID映射关系 (用于API调用):');
                            console.log('数据库ID\tMT账户ID\t账户名称');
                            console.log('-'.repeat(50));
                            jsonResponse.result.results.forEach((account) => {
                                console.log(`${account.id}\t\t${account.accountId}\t${account.name}`);
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
async function runAccountListTest() {
    try {
        // 1. 获取认证 token
        const token = await getAuthToken();
        
        // 2. 获取账户列表
        await getAccountList(token);
        
        console.log('\n🎉 账户列表功能测试完成！');
        console.log('\n💡 使用提示:');
        console.log('   - 在 n8n 中使用 "数据库ID" 而不是 "MT账户ID"');
        console.log('   - 例如: 要查询 MT账户 68048048，应该使用数据库ID 70');
        
    } catch (error) {
        console.log('\n❌ 测试失败:');
        console.log(`   错误: ${error.message}`);
        process.exit(1);
    }
}

// 运行测试
runAccountListTest();
