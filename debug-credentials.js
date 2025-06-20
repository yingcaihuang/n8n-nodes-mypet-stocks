#!/usr/bin/env node

const https = require('https');

// 模拟 n8n 凭据测试的详细调试脚本
function debugCredentialTest() {
    console.log('🔍 调试 MyPet Stocks API 凭据测试...\n');

    // 测试配置
    const credentials = {
        authMethod: 'credentials',
        username: 'admin',
        password: 'nicaiba_88',
        baseUrl: 'https://dash-stock.mypet.run'
    };

    console.log('📋 测试配置:');
    console.log(`- 鉴权方式: ${credentials.authMethod}`);
    console.log(`- 用户名: ${credentials.username}`);
    console.log(`- 密码: ${'*'.repeat(credentials.password.length)}`);
    console.log(`- 基础 URL: ${credentials.baseUrl}`);
    console.log('');

    // 测试 1: 基本 API 调用
    console.log('🧪 测试 1: 基本 API 调用');
    testBasicApiCall(credentials);
}

function testBasicApiCall(credentials) {
    const postData = JSON.stringify({
        username: credentials.username,
        password: credentials.password
    });

    const options = {
        hostname: 'dash-stock.mypet.run',
        port: 443,
        path: '/api/v1/portal/dashlogin/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'User-Agent': 'n8n-nodes-mypet-stocks/1.0.1'
        }
    };

    console.log('📤 请求详情:');
    console.log(`- URL: https://${options.hostname}${options.path}`);
    console.log(`- 方法: ${options.method}`);
    console.log(`- 请求头: ${JSON.stringify(options.headers, null, 2)}`);
    console.log(`- 请求体: ${postData}`);
    console.log('');

    const req = https.request(options, (res) => {
        console.log('📥 响应详情:');
        console.log(`- 状态码: ${res.statusCode}`);
        console.log(`- 状态信息: ${res.statusMessage}`);
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

                // 验证响应格式
                console.log('🔍 响应验证:');
                console.log(`- 包含 'code' 字段: ${jsonResponse.hasOwnProperty('code')}`);
                console.log(`- code 值: ${jsonResponse.code}`);
                console.log(`- code === 0: ${jsonResponse.code === 0}`);
                console.log(`- 包含 'message' 字段: ${jsonResponse.hasOwnProperty('message')}`);
                console.log(`- message 值: ${jsonResponse.message}`);
                console.log(`- 包含 'result' 字段: ${jsonResponse.hasOwnProperty('result')}`);
                
                if (jsonResponse.result) {
                    console.log(`- result.token 存在: ${jsonResponse.result.hasOwnProperty('token')}`);
                    console.log(`- result.username: ${jsonResponse.result.username}`);
                    console.log(`- result.userId: ${jsonResponse.result.userId}`);
                }
                console.log('');

                // n8n 凭据测试模拟
                console.log('🎯 n8n 凭据测试模拟:');
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log('✅ HTTP 状态码检查: 通过');
                    
                    if (jsonResponse.code === 0) {
                        console.log('✅ 业务状态码检查: 通过');
                        console.log('🎉 凭据测试应该成功!');
                    } else {
                        console.log('❌ 业务状态码检查: 失败');
                        console.log(`   期望: 0, 实际: ${jsonResponse.code}`);
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

            console.log('\n' + '='.repeat(60));
            console.log('🧪 测试 2: 检查 n8n 凭据配置');
            testN8nCredentialConfig();
        });
    });

    req.on('error', (error) => {
        console.log('❌ 请求错误:');
        console.log(`   错误: ${error.message}`);
        console.log(`   代码: ${error.code}`);
    });

    req.write(postData);
    req.end();
}

function testN8nCredentialConfig() {
    console.log('');
    console.log('📋 n8n 凭据配置分析:');
    
    // 模拟 n8n 表达式解析
    const credentials = {
        authMethod: 'credentials',
        username: 'admin',
        password: 'nicaiba_88',
        baseUrl: 'https://dash-stock.mypet.run'
    };

    console.log('🔧 表达式解析测试:');
    console.log(`- baseURL: '={{$credentials.baseUrl}}' → '${credentials.baseUrl}'`);
    console.log(`- username: '={{$credentials.username}}' → '${credentials.username}'`);
    console.log(`- password: '={{$credentials.password}}' → '${'*'.repeat(credentials.password.length)}'`);
    console.log('');

    console.log('📝 建议的修复方案:');
    console.log('1. 检查 n8n 版本兼容性');
    console.log('2. 验证表达式语法');
    console.log('3. 简化凭据测试配置');
    console.log('4. 添加更详细的错误日志');
    console.log('');

    console.log('🔧 可能的问题:');
    console.log('- n8n 表达式解析问题');
    console.log('- 请求体序列化问题');
    console.log('- 响应验证规则问题');
    console.log('- SSL/TLS 证书问题');
    console.log('- 网络连接问题');
}

// 运行调试
debugCredentialTest();
