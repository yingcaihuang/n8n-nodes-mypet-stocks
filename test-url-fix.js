#!/usr/bin/env node

const https = require('https');

console.log('🔧 测试 URL 修复...\n');

// 模拟节点中的 URL 构建
const credentials = {
    baseUrl: 'https://dash-stock.mypet.run',
    username: 'admin',
    password: 'nicaiba_88'
};

const fullUrl = `${credentials.baseUrl}/api/v1/portal/dashlogin/`;
console.log(`✅ 构建的完整 URL: ${fullUrl}`);

// 验证 URL 是否有效
try {
    const url = new URL(fullUrl);
    console.log(`✅ URL 验证通过:`);
    console.log(`   - 协议: ${url.protocol}`);
    console.log(`   - 主机: ${url.hostname}`);
    console.log(`   - 端口: ${url.port || '443'}`);
    console.log(`   - 路径: ${url.pathname}`);
} catch (error) {
    console.log(`❌ URL 验证失败: ${error.message}`);
    process.exit(1);
}

console.log('\n🧪 测试实际 API 调用...');

const postData = JSON.stringify({
    username: credentials.username,
    password: credentials.password
});

const urlObj = new URL(fullUrl);
const options = {
    hostname: urlObj.hostname,
    port: urlObj.port || 443,
    path: urlObj.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'User-Agent': 'n8n-nodes-mypet-stocks/1.0.3'
    }
};

const req = https.request(options, (res) => {
    console.log(`📥 响应状态: ${res.statusCode} ${res.statusMessage}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
        responseData += chunk;
    });

    res.on('end', () => {
        try {
            const jsonResponse = JSON.parse(responseData);
            if (res.statusCode === 200 && jsonResponse.code === 0) {
                console.log('✅ API 调用成功!');
                console.log(`   - Token: ${jsonResponse.result.token.substring(0, 20)}...`);
                console.log(`   - 用户: ${jsonResponse.result.username}`);
                console.log(`   - 用户ID: ${jsonResponse.result.userId}`);
                console.log('\n🎉 URL 修复验证通过! 节点现在应该可以正常工作了。');
            } else {
                console.log('❌ API 调用失败');
                console.log(`   - 状态码: ${res.statusCode}`);
                console.log(`   - 响应: ${responseData}`);
            }
        } catch (error) {
            console.log('❌ 响应解析失败');
            console.log(`   - 错误: ${error.message}`);
            console.log(`   - 原始响应: ${responseData}`);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ 请求失败');
    console.log(`   - 错误: ${error.message}`);
    console.log(`   - 代码: ${error.code}`);
});

req.write(postData);
req.end();
