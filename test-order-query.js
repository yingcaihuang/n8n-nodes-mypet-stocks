#!/usr/bin/env node

const https = require('https');

console.log('🔍 测试订单查询功能...\n');

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
                'User-Agent': 'n8n-order-query-test/1.0.6'
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

// 查询订单
async function queryOrders(token, queryParams = {}) {
    console.log('\n📋 查询交易订单...');
    console.log('查询参数:', queryParams);
    
    // 构建查询字符串
    const defaultParams = {
        pageNum: '1',
        pageSize: '5', // 只查询5条记录用于测试
        filter_abnormal: 'false'
    };
    
    const params = { ...defaultParams, ...queryParams };
    const queryString = new URLSearchParams(params).toString();
    const path = `/api/v1/portal/stock/tradeOrder/?${queryString}`;
    
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
                'User-Agent': 'n8n-order-query-test/1.0.6'
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
                        
                        // 显示订单摘要
                        if (jsonResponse.result.results.data.length > 0) {
                            console.log('\n📊 订单摘要:');
                            jsonResponse.result.results.data.forEach((order, index) => {
                                console.log(`   ${index + 1}. Ticket: ${order.ticket}, Symbol: ${order.symbol}, Type: ${order.tradeType}, Lots: ${order.lots}, Profit: ${order.orderProfit}`);
                            });
                        }
                        
                        // 显示统计信息
                        if (jsonResponse.result.results.order_info) {
                            const info = jsonResponse.result.results.order_info;
                            console.log('\n📈 统计信息:');
                            console.log(`   总订单: ${info.total.total}, 总手数: ${info.total.total_lots}, 总盈亏: ${info.total.total_orderProfit}`);
                            console.log(`   多单平仓: ${info.buy_close.total}, 空单平仓: ${info.sell_close.total}`);
                        }
                        
                        resolve(jsonResponse);
                    } else {
                        reject(new Error(`Query failed: ${jsonResponse.message || 'Unknown error'}`));
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
async function runOrderQueryTest() {
    try {
        // 1. 获取认证 token
        const token = await getAuthToken();
        
        // 2. 测试基本查询
        console.log('\n' + '='.repeat(50));
        console.log('🧪 测试 1: 基本查询（前5条记录）');
        await queryOrders(token);
        
        // 3. 测试按交易类型过滤
        console.log('\n' + '='.repeat(50));
        console.log('🧪 测试 2: 查询买单（多单）');
        await queryOrders(token, { tradeType: 'Buy' });
        
        // 4. 测试按交易品种过滤
        console.log('\n' + '='.repeat(50));
        console.log('🧪 测试 3: 查询 USDJPY 交易');
        await queryOrders(token, { symbol: 'USDJPY' });
        
        // 5. 测试分页
        console.log('\n' + '='.repeat(50));
        console.log('🧪 测试 4: 分页查询（第2页）');
        await queryOrders(token, { pageNum: '2', pageSize: '3' });
        
        console.log('\n🎉 所有测试完成！订单查询功能工作正常。');
        
    } catch (error) {
        console.log('\n❌ 测试失败:');
        console.log(`   错误: ${error.message}`);
        process.exit(1);
    }
}

// 运行测试
runOrderQueryTest();
