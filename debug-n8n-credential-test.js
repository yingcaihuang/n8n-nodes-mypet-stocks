#!/usr/bin/env node

const https = require('https');

console.log('🔍 调试 n8n 凭据测试失败问题...\n');

// 测试不同的配置场景
const testScenarios = [
    {
        name: '场景 1: 完整配置',
        credentials: {
            authMethod: 'credentials',
            username: 'admin',
            password: 'nicaiba_88',
            baseUrl: 'https://dash-stock.mypet.run'
        }
    },
    {
        name: '场景 2: 缺少 baseUrl',
        credentials: {
            authMethod: 'credentials',
            username: 'admin',
            password: 'nicaiba_88',
            baseUrl: ''
        }
    },
    {
        name: '场景 3: 默认 baseUrl',
        credentials: {
            authMethod: 'credentials',
            username: 'admin',
            password: 'nicaiba_88',
            baseUrl: 'https://dash-stock.mypet.run'
        }
    }
];

async function testCredentialScenario(scenario) {
    console.log(`\n🧪 ${scenario.name}`);
    console.log('=' .repeat(50));
    
    const creds = scenario.credentials;
    console.log(`- authMethod: ${creds.authMethod}`);
    console.log(`- username: ${creds.username}`);
    console.log(`- password: ${'*'.repeat(creds.password.length)}`);
    console.log(`- baseUrl: ${creds.baseUrl || '(空)'}`);
    
    // 模拟 n8n 表达式解析
    const resolvedBaseUrl = creds.baseUrl || 'https://dash-stock.mypet.run';
    const resolvedUsername = creds.username;
    const resolvedPassword = creds.password;
    
    console.log('\n📋 解析后的值:');
    console.log(`- baseURL: ${resolvedBaseUrl}`);
    console.log(`- username: ${resolvedUsername}`);
    console.log(`- password: ${'*'.repeat(resolvedPassword.length)}`);
    
    if (!resolvedBaseUrl) {
        console.log('❌ baseURL 为空，跳过测试');
        return;
    }
    
    try {
        const fullUrl = resolvedBaseUrl + '/api/v1/portal/dashlogin/';
        console.log(`\n🔗 完整 URL: ${fullUrl}`);
        
        const result = await makeRequest(fullUrl, resolvedUsername, resolvedPassword);
        
        if (result.success) {
            console.log('✅ 请求成功');
            console.log(`   - 状态码: ${result.statusCode}`);
            console.log(`   - 响应 code: ${result.data.code}`);
            console.log(`   - 消息: ${result.data.message}`);
            
            // 应用 n8n 验证规则
            if (result.statusCode >= 200 && result.statusCode < 300 && result.data.code === 0) {
                console.log('🎉 n8n 凭据测试应该通过');
            } else {
                console.log('❌ n8n 凭据测试会失败');
                console.log(`   - HTTP 状态: ${result.statusCode >= 200 && result.statusCode < 300 ? '通过' : '失败'}`);
                console.log(`   - 响应验证: ${result.data.code === 0 ? '通过' : '失败'}`);
            }
        } else {
            console.log('❌ 请求失败');
            console.log(`   - 错误: ${result.error}`);
        }
        
    } catch (error) {
        console.log('❌ 测试异常');
        console.log(`   - 错误: ${error.message}`);
    }
}

function makeRequest(url, username, password) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({ username, password });
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'User-Agent': 'n8n-credential-test-debug/1.0.4'
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    resolve({
                        success: true,
                        statusCode: res.statusCode,
                        data: jsonData
                    });
                } catch (error) {
                    resolve({
                        success: false,
                        error: `JSON 解析失败: ${error.message}`,
                        rawData: responseData
                    });
                }
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                error: error.message
            });
        });
        
        req.write(postData);
        req.end();
    });
}

async function runAllTests() {
    for (const scenario of testScenarios) {
        await testCredentialScenario(scenario);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🔧 可能的解决方案:');
    console.log('1. 确保在凭据配置中填写了 "API Base URL" 字段');
    console.log('2. API Base URL 应该是: https://dash-stock.mypet.run');
    console.log('3. 检查 n8n 版本兼容性');
    console.log('4. 尝试删除并重新创建凭据');
    console.log('5. 重启 n8n 服务');
}

runAllTests().catch(console.error);
