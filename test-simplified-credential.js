#!/usr/bin/env node

const https = require('https');

console.log('🔧 测试简化的凭据配置...\n');

// 模拟简化后的 n8n 凭据测试配置
const simplifiedConfig = {
    request: {
        baseURL: 'https://dash-stock.mypet.run',
        url: '/api/v1/portal/dashlogin/',
        method: 'POST',
        body: {
            username: 'admin',
            password: 'nicaiba_88',
        },
    },
    // 没有显式的 rules，依赖默认的 HTTP 状态码检查
};

console.log('📋 简化的凭据测试配置:');
console.log(JSON.stringify(simplifiedConfig, null, 2));
console.log('');

async function testSimplifiedCredential() {
    const fullUrl = simplifiedConfig.request.baseURL + simplifiedConfig.request.url;
    console.log(`🔗 完整 URL: ${fullUrl}`);
    
    const postData = JSON.stringify(simplifiedConfig.request.body);
    console.log(`📤 请求体: ${postData}`);
    
    try {
        const result = await makeRequest(fullUrl, postData);
        
        console.log('\n📥 响应结果:');
        console.log(`- 状态码: ${result.statusCode}`);
        console.log(`- 响应体: ${result.body}`);
        
        // 解析响应
        let responseData;
        try {
            responseData = JSON.parse(result.body);
            console.log('\n✅ JSON 解析成功:');
            console.log(JSON.stringify(responseData, null, 2));
        } catch (error) {
            console.log('\n❌ JSON 解析失败');
            return;
        }
        
        // n8n 默认验证逻辑（没有显式 rules 时）
        console.log('\n🔍 n8n 默认验证逻辑:');
        const httpSuccess = result.statusCode >= 200 && result.statusCode < 300;
        console.log(`HTTP 状态检查: ${httpSuccess ? '✅ 通过' : '❌ 失败'} (${result.statusCode})`);
        
        if (httpSuccess) {
            console.log('🎉 简化配置应该成功！');
            console.log('💡 n8n 将认为凭据有效，因为 HTTP 状态码是 2xx');
        } else {
            console.log('❌ 简化配置会失败');
            console.log(`   HTTP 状态码: ${result.statusCode}`);
        }
        
        // 额外验证
        console.log('\n📊 API 响应分析:');
        console.log(`- 成功标志 (code=0): ${responseData.code === 0 ? '✅' : '❌'}`);
        console.log(`- Token 存在: ${responseData.result && responseData.result.token ? '✅' : '❌'}`);
        console.log(`- 消息: ${responseData.message || '无'}`);
        
    } catch (error) {
        console.log('\n❌ 请求失败:');
        console.log(`错误: ${error.message}`);
    }
}

function makeRequest(url, postData) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
                'User-Agent': 'n8n-simplified-test/1.0.4'
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

console.log('🧪 开始测试...');
testSimplifiedCredential().catch(console.error);
