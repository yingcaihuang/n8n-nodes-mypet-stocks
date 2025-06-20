#!/usr/bin/env node

const https = require('https');

console.log('🔐 测试凭据配置...\n');

// 模拟 n8n 凭据测试的配置
const credentialTestConfig = {
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

console.log('📋 凭据测试配置:');
console.log(`- Base URL: ${credentialTestConfig.request.baseURL}`);
console.log(`- 端点: ${credentialTestConfig.request.url}`);
console.log(`- 方法: ${credentialTestConfig.request.method}`);
console.log(`- 请求头: ${JSON.stringify(credentialTestConfig.request.headers)}`);
console.log(`- 请求体: ${JSON.stringify(credentialTestConfig.request.body)}`);
console.log('');

// 构建完整 URL
const fullUrl = credentialTestConfig.request.baseURL + credentialTestConfig.request.url;
console.log(`🔗 完整 URL: ${fullUrl}`);

// 模拟 n8n 的凭据测试请求
console.log('\n🧪 执行凭据测试请求...');

const postData = JSON.stringify(credentialTestConfig.request.body);
const urlObj = new URL(fullUrl);

const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || 443,
    path: urlObj.pathname,
    method: credentialTestConfig.request.method,
    headers: {
        ...credentialTestConfig.request.headers,
        'Content-Length': postData.length,
        'User-Agent': 'n8n-credential-test/1.0.3'
    }
};

console.log('📤 请求选项:');
console.log(JSON.stringify(options, null, 2));
console.log('');

const req = https.request(options, (res) => {
    console.log('📥 响应信息:');
    console.log(`- 状态码: ${res.statusCode} ${res.statusMessage}`);
    console.log(`- 响应头: ${JSON.stringify(res.headers, null, 2)}`);
    console.log('');

    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log('📄 响应数据:');
        console.log(responseData);
        console.log('');

        try {
            const jsonResponse = JSON.parse(responseData);
            console.log('✅ JSON 解析成功:');
            console.log(JSON.stringify(jsonResponse, null, 2));
            console.log('');

            // 应用 n8n 凭据测试规则
            console.log('🔍 应用凭据测试规则:');
            const rule = credentialTestConfig.rules[0];
            console.log(`- 规则类型: ${rule.type}`);
            console.log(`- 检查字段: ${rule.properties.key}`);
            console.log(`- 期望值: ${rule.properties.value}`);
            console.log(`- 实际值: ${jsonResponse[rule.properties.key]}`);
            
            // 验证规则
            if (res.statusCode >= 200 && res.statusCode < 300) {
                console.log('✅ HTTP 状态码检查: 通过');
                
                if (jsonResponse[rule.properties.key] === rule.properties.value) {
                    console.log('✅ 响应体验证: 通过');
                    console.log(`✅ ${rule.properties.message}`);
                    console.log('\n🎉 凭据测试应该成功! n8n 中的凭据验证现在应该可以工作了。');
                } else {
                    console.log('❌ 响应体验证: 失败');
                    console.log(`   期望 ${rule.properties.key} = ${rule.properties.value}`);
                    console.log(`   实际 ${rule.properties.key} = ${jsonResponse[rule.properties.key]}`);
                }
            } else {
                console.log('❌ HTTP 状态码检查: 失败');
                console.log(`   状态码: ${res.statusCode}`);
            }

        } catch (error) {
            console.log('❌ JSON 解析失败:');
            console.log(`   错误: ${error.message}`);
            console.log(`   原始数据: ${responseData}`);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ 请求错误:');
    console.log(`   错误: ${error.message}`);
    console.log(`   代码: ${error.code}`);
});

console.log('📤 发送请求...');
req.write(postData);
req.end();
