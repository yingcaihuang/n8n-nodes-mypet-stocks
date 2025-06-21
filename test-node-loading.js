/**
 * 简单的节点加载测试
 */

console.log('🔍 测试节点加载...\n');

try {
    // 尝试加载节点
    const nodeModule = require('./dist/nodes/MyPetStocks/MyPetStocks.node.js');
    console.log('✅ 节点模块加载成功');
    
    // 检查导出
    console.log('📋 检查导出:');
    console.log('   - exports keys:', Object.keys(nodeModule));
    
    if (nodeModule.MyPetStocks) {
        console.log('✅ MyPetStocks 类找到');
        
        const nodeClass = nodeModule.MyPetStocks;
        const instance = new nodeClass();
        
        console.log('📝 节点信息:');
        console.log(`   - 显示名称: ${instance.description.displayName}`);
        console.log(`   - 节点名称: ${instance.description.name}`);
        console.log(`   - 版本: ${instance.description.version}`);
        
        // 检查资源配置
        const resourceProp = instance.description.properties.find(p => p.name === 'resource');
        if (resourceProp) {
            console.log('✅ 资源属性找到');
            console.log('📋 可用资源:');
            resourceProp.options.forEach(option => {
                console.log(`   - ${option.name} (${option.value})`);
            });
            
            // 检查量化账户资源
            const quantAccountResource = resourceProp.options.find(opt => opt.value === 'quantAccount');
            if (quantAccountResource) {
                console.log('✅ 量化账户资源配置正确');
                
                // 检查量化账户操作
                const quantAccountOps = instance.description.properties.filter(p => 
                    p.name === 'operation' && 
                    p.displayOptions && 
                    p.displayOptions.show && 
                    p.displayOptions.show.resource && 
                    p.displayOptions.show.resource.includes('quantAccount')
                );
                
                if (quantAccountOps.length > 0) {
                    console.log('✅ 量化账户操作配置找到');
                    console.log('📋 量化账户操作:');
                    quantAccountOps[0].options.forEach(op => {
                        console.log(`   - ${op.name} (${op.value})`);
                    });
                } else {
                    console.log('❌ 量化账户操作配置未找到');
                }
            } else {
                console.log('❌ 量化账户资源未找到');
            }
        } else {
            console.log('❌ 资源属性未找到');
        }
        
        // 检查方法
        console.log('\n🔧 检查方法:');
        if (typeof instance.execute === 'function') {
            console.log('✅ execute 方法存在');
        } else {
            console.log('❌ execute 方法不存在');
        }
        
        if (instance.methods && instance.methods.loadOptions) {
            console.log('✅ loadOptions 方法存在');
            const loadOptionsMethods = Object.keys(instance.methods.loadOptions);
            console.log(`   - 可用方法: ${loadOptionsMethods.join(', ')}`);
        } else {
            console.log('❌ loadOptions 方法不存在');
        }
        
    } else {
        console.log('❌ MyPetStocks 类未找到');
        console.log('   可用导出:', Object.keys(nodeModule));
    }
    
} catch (error) {
    console.log('❌ 节点加载失败:', error.message);
    console.log('   错误详情:', error.stack);
}

console.log('\n🎯 测试完成！');
