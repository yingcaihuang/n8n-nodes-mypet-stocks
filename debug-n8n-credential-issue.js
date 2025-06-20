#!/usr/bin/env node

const https = require('https');

console.log('🔍 深度调试 n8n 凭据测试问题...\n');

// 模拟 n8n 凭据测试的完整流程
async function debugN8nCredentialTest() {
    console.log('📋 n8n 凭据测试配置:');
    
    const credentialConfig = {
        request: {
            baseURL: 'https://dash-stock.mypet.run',
            url: '/api/v1/portal/dashlogin/',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                username: 'admin',
                password: 'nicaiba_88',
            },
        },
        rules: [
            {
                type: 'responseSuccessBody',
                properties: {
                    key: 'code',
                    value: 0,
                    message: 'Authentication successful',
                },
            },
        ],
    };
    
    console.log(JSON.stringify(credentialConfig, null, 2));
    console.log('');
    
    // 步骤 1: 构建完整 URL
    const fullUrl = credentialConfig.request.baseURL + credentialConfig.request.url;
    console.log(`🔗 完整 URL: ${fullUrl}`);
    
    // 步骤 2: 准备请求数据
    const requestBody = credentialConfig.request.body;
    const postData = JSON.stringify(requestBody);
    console.log(`📤 请求体: ${postData}`);
    
    // 步骤 3: 执行请求
    console.log('\n🧪 执行 HTTP 请求...');
    
    try {
        const result = await makeHttpRequest(fullUrl, credentialConfig.request);
        
        console.log('\n📥 响应结果:');
        console.log(`- 状态码: ${result.statusCode}`);
        console.log(`- 响应头: ${JSON.stringify(result.headers, null, 2)}`);
        console.log(`- 响应体: ${result.body}`);
        
        // 步骤 4: 解析响应
        let responseData;
        try {
            responseData = JSON.parse(result.body);
            console.log('\n✅ JSON 解析成功:');
            console.log(JSON.stringify(responseData, null, 2));
        } catch (error) {
            console.log('\n❌ JSON 解析失败:');
            console.log(`错误: ${error.message}`);
            return;
        }
        
        // 步骤 5: 应用 n8n 验证规则
        console.log('\n🔍 应用 n8n 验证规则:');
        const rule = credentialConfig.rules[0];
        
        console.log(`规则类型: ${rule.type}`);
        console.log(`检查字段: ${rule.properties.key}`);
        console.log(`期望值: ${rule.properties.value}`);
        console.log(`实际值: ${responseData[rule.properties.key]}`);
        
        // HTTP 状态码检查
        const httpSuccess = result.statusCode >= 200 && result.statusCode < 300;
        console.log(`\nHTTP 状态检查: ${httpSuccess ? '✅ 通过' : '❌ 失败'} (${result.statusCode})`);
        
        // 响应体验证
        const bodySuccess = responseData[rule.properties.key] === rule.properties.value;
        console.log(`响应体验证: ${bodySuccess ? '✅ 通过' : '❌ 失败'}`);
        
        // 最终结果
        const overallSuccess = httpSuccess && bodySuccess;
        console.log(`\n🎯 n8n 凭据测试结果: ${overallSuccess ? '✅ 应该成功' : '❌ 会失败'}`);
        
        if (overallSuccess) {
            console.log(`✅ ${rule.properties.message}`);
            console.log('🎉 凭据配置正确，应该可以通过验证！');
        } else {
            console.log('\n🔧 失败原因分析:');
            if (!httpSuccess) {
                console.log(`- HTTP 状态码问题: 期望 2xx，实际 ${result.statusCode}`);
            }
            if (!bodySuccess) {
                console.log(`- 响应体验证失败: 期望 ${rule.properties.key}=${rule.properties.value}，实际 ${responseData[rule.properties.key]}`);
            }
        }
        
        // 额外的调试信息
        console.log('\n📊 详细分析:');
        console.log(`- Token 存在: ${responseData.result && responseData.result.token ? '✅' : '❌'}`);
        console.log(`- 用户名匹配: ${responseData.result && responseData.result.username === 'admin' ? '✅' : '❌'}`);
        console.log(`- 消息内容: ${responseData.message || '无'}`);
        
    } catch (error) {
        console.log('\n❌ 请求执行失败:');
        console.log(`错误: ${error.message}`);
    }
}

function makeHttpRequest(url, requestConfig) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(requestConfig.body);
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: requestConfig.method,
            headers: {
                ...requestConfig.headers,
                'Content-Length': postData.length,
                'User-Agent': 'n8n-credential-debug/1.0.4'
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: responseData
                });
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.write(postData);
        req.end();
    });
}

// 运行调试
debugN8nCredentialTest().catch(console.error);
