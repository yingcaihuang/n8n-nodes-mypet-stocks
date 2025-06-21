#!/usr/bin/env node

const https = require('https');

console.log('🎯 测试账户下拉列表格式...\n');

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
                'User-Agent': 'n8n-dropdown-test/1.3.0'
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

// 模拟下拉列表数据格式化
async function formatAccountDropdown(token) {
    console.log('\n📋 获取并格式化账户下拉列表...');
    
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'dash-stock.mypet.run',
            port: 443,
            path: '/api/v1/portal/stock/account/',
            method: 'GET',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
                'User-Agent': 'n8n-dropdown-test/1.3.0'
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
                        console.log('✅ 账户数据获取成功');
                        
                        // 格式化账户选项（模拟 n8n 下拉列表格式）
                        const accounts = jsonResponse.result.results.map((account) => {
                            const statusIcon = account.status ? '✅活跃' : '❌停用';
                            const typeIcon = account.is_real ? '🔴真实' : '🟡模拟';
                            const displayName = `${account.accountId} -- ${account.name} -- ${account.account_type_name} ${account.dealername} -- ${statusIcon} -- ${typeIcon}`;
                            
                            return {
                                name: displayName,
                                value: account.id.toString(), // 使用数据库ID作为值
                            };
                        });

                        // 按账户ID排序
                        accounts.sort((a, b) => {
                            const aAccountId = parseInt(a.name.split(' -- ')[0]);
                            const bAccountId = parseInt(b.name.split(' -- ')[0]);
                            return aAccountId - bAccountId;
                        });
                        
                        console.log('\n🎯 下拉列表选项预览:');
                        console.log('显示名称 (用户看到的) → 传递值 (API使用的数据库ID)');
                        console.log('='.repeat(100));
                        
                        accounts.forEach((option, index) => {
                            console.log(`${index + 1}. ${option.name}`);
                            console.log(`   → 传递值: ${option.value}`);
                            console.log('');
                        });
                        
                        console.log('📊 下拉列表统计:');
                        console.log(`   总选项数: ${accounts.length}`);
                        console.log(`   活跃账户: ${accounts.filter(acc => acc.name.includes('✅活跃')).length}`);
                        console.log(`   真实账户: ${accounts.filter(acc => acc.name.includes('🔴真实')).length}`);
                        console.log(`   模拟账户: ${accounts.filter(acc => acc.name.includes('🟡模拟')).length}`);
                        
                        // 验证特定账户的映射
                        const targetAccount = accounts.find(acc => acc.name.includes('68048048'));
                        if (targetAccount) {
                            console.log('\n🎯 目标账户验证:');
                            console.log(`   显示: ${targetAccount.name}`);
                            console.log(`   传递值: ${targetAccount.value}`);
                            console.log(`   ✅ 用户选择显示的账户信息，但API会收到数据库ID ${targetAccount.value}`);
                        }
                        
                        resolve(accounts);
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
async function runDropdownTest() {
    try {
        // 1. 获取认证 token
        const token = await getAuthToken();
        
        // 2. 格式化下拉列表数据
        await formatAccountDropdown(token);
        
        console.log('\n🎉 下拉列表格式测试完成！');
        console.log('\n💡 用户体验改进:');
        console.log('   ✅ 用户看到完整的账户信息');
        console.log('   ✅ 包含账户ID、名称、类型、经纪商、状态');
        console.log('   ✅ API自动接收正确的数据库ID');
        console.log('   ✅ 无需用户手动查找ID映射关系');
        
    } catch (error) {
        console.log('\n❌ 测试失败:');
        console.log(`   错误: ${error.message}`);
        process.exit(1);
    }
}

// 运行测试
runDropdownTest();
