/**
 * 测试已删除操作的验证脚本
 * 确认 getMarketData 和 testConnection 操作已被正确删除
 */

const { MyPetStocks } = require('./dist/nodes/MyPetStocks/MyPetStocks.node.js');

console.log('🔍 验证已删除的历史遗留操作...\n');

try {
    // 创建节点实例
    const node = new MyPetStocks();
    const description = node.description;
    
    console.log('📋 检查节点配置...');
    console.log(`   节点名称: ${description.displayName}`);
    console.log(`   节点版本: ${description.version}`);
    
    // 检查资源配置
    const resourceProp = description.properties.find(p => p.name === 'resource');
    if (!resourceProp) {
        throw new Error('资源属性未找到');
    }
    
    console.log('\n🔧 检查可用资源:');
    resourceProp.options.forEach(resource => {
        console.log(`   - ${resource.name} (${resource.value})`);
    });
    
    // 检查 Authentication 资源的操作
    console.log('\n🔐 检查 Authentication 资源操作:');
    const authOperations = description.properties.filter(p => 
        p.name === 'operation' && 
        p.displayOptions && 
        p.displayOptions.show && 
        p.displayOptions.show.resource && 
        p.displayOptions.show.resource.includes('auth')
    );
    
    if (authOperations.length > 0) {
        authOperations[0].options.forEach(op => {
            console.log(`   - ${op.name} (${op.value})`);
        });
        
        // 检查是否还有 testConnection
        const hasTestConnection = authOperations[0].options.some(op => op.value === 'testConnection');
        if (hasTestConnection) {
            console.log('   ❌ 错误: testConnection 操作仍然存在');
        } else {
            console.log('   ✅ testConnection 操作已成功删除');
        }
    } else {
        console.log('   ❌ 未找到 Authentication 操作配置');
    }
    
    // 检查 Trading 资源的操作
    console.log('\n📈 检查 Trading 资源操作:');
    const tradingOperations = description.properties.filter(p => 
        p.name === 'operation' && 
        p.displayOptions && 
        p.displayOptions.show && 
        p.displayOptions.show.resource && 
        p.displayOptions.show.resource.includes('trading')
    );
    
    if (tradingOperations.length > 0) {
        tradingOperations[0].options.forEach(op => {
            console.log(`   - ${op.name} (${op.value})`);
        });
        
        // 检查是否还有 getMarketData
        const hasGetMarketData = tradingOperations[0].options.some(op => op.value === 'getMarketData');
        if (hasGetMarketData) {
            console.log('   ❌ 错误: getMarketData 操作仍然存在');
        } else {
            console.log('   ✅ getMarketData 操作已成功删除');
        }
        
        // 检查默认操作
        const defaultOperation = tradingOperations[0].default;
        console.log(`   📌 默认操作: ${defaultOperation}`);
        
        if (defaultOperation === 'getMarketData') {
            console.log('   ❌ 错误: 默认操作仍然是 getMarketData');
        } else {
            console.log('   ✅ 默认操作已更新');
        }
    } else {
        console.log('   ❌ 未找到 Trading 操作配置');
    }
    
    // 检查 Quantitative Account 资源的操作
    console.log('\n🏦 检查 Quantitative Account 资源操作:');
    const quantAccountOperations = description.properties.filter(p => 
        p.name === 'operation' && 
        p.displayOptions && 
        p.displayOptions.show && 
        p.displayOptions.show.resource && 
        p.displayOptions.show.resource.includes('quantAccount')
    );
    
    if (quantAccountOperations.length > 0) {
        console.log(`   找到 ${quantAccountOperations[0].options.length} 个操作:`);
        quantAccountOperations[0].options.forEach(op => {
            console.log(`   - ${op.name} (${op.value})`);
        });
    } else {
        console.log('   ❌ 未找到 Quantitative Account 操作配置');
    }
    
    // 验证总体配置
    console.log('\n📊 配置统计:');
    const totalProperties = description.properties.length;
    const operationProperties = description.properties.filter(p => p.name === 'operation').length;
    const resourceProperties = description.properties.filter(p => p.name === 'resource').length;
    
    console.log(`   总属性数: ${totalProperties}`);
    console.log(`   操作属性数: ${operationProperties}`);
    console.log(`   资源属性数: ${resourceProperties}`);
    
    // 检查是否有任何引用已删除操作的代码
    console.log('\n🔍 检查代码引用:');
    const nodeCode = require('fs').readFileSync('./dist/nodes/MyPetStocks/MyPetStocks.node.js', 'utf8');
    
    const hasGetMarketDataRef = nodeCode.includes('getMarketData');
    const hasTestConnectionRef = nodeCode.includes('testConnection');
    
    if (hasGetMarketDataRef) {
        console.log('   ❌ 警告: 代码中仍有 getMarketData 引用');
    } else {
        console.log('   ✅ 代码中已清除 getMarketData 引用');
    }
    
    if (hasTestConnectionRef) {
        console.log('   ❌ 警告: 代码中仍有 testConnection 引用');
    } else {
        console.log('   ✅ 代码中已清除 testConnection 引用');
    }
    
    console.log('\n🎯 验证结果:');
    
    const issues = [];
    
    // 检查 Authentication 操作
    if (authOperations.length > 0) {
        const hasTestConnection = authOperations[0].options.some(op => op.value === 'testConnection');
        if (hasTestConnection) {
            issues.push('Authentication 资源中仍有 testConnection 操作');
        }
    }
    
    // 检查 Trading 操作
    if (tradingOperations.length > 0) {
        const hasGetMarketData = tradingOperations[0].options.some(op => op.value === 'getMarketData');
        if (hasGetMarketData) {
            issues.push('Trading 资源中仍有 getMarketData 操作');
        }
        
        const defaultOperation = tradingOperations[0].default;
        if (defaultOperation === 'getMarketData') {
            issues.push('Trading 资源的默认操作仍是 getMarketData');
        }
    }
    
    // 检查代码引用
    if (hasGetMarketDataRef) {
        issues.push('代码中仍有 getMarketData 引用');
    }
    
    if (hasTestConnectionRef) {
        issues.push('代码中仍有 testConnection 引用');
    }
    
    if (issues.length === 0) {
        console.log('   ✅ 所有历史遗留操作已成功删除！');
        console.log('   ✅ 节点配置已清理完成！');
        console.log('   ✅ 代码引用已清除！');
    } else {
        console.log('   ❌ 发现以下问题:');
        issues.forEach(issue => {
            console.log(`      - ${issue}`);
        });
    }
    
} catch (error) {
    console.error('❌ 验证失败:', error.message);
    console.error(error.stack);
    process.exit(1);
}

console.log('\n🎉 验证完成！');
