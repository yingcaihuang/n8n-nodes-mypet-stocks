/**
 * 诊断脚本 - 检查n8n节点配置和量化账户资源
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 开始诊断 MyPet Stocks 节点配置...\n');

// 1. 检查package.json配置
console.log('📋 1. 检查 package.json 配置');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`   ✅ 版本: ${packageJson.version}`);
    console.log(`   ✅ 节点路径: ${packageJson.n8n.nodes[0]}`);
    console.log(`   ✅ 凭据路径: ${packageJson.n8n.credentials[0]}`);
} catch (error) {
    console.log(`   ❌ package.json 读取失败: ${error.message}`);
}

// 2. 检查构建文件是否存在
console.log('\n📁 2. 检查构建文件');
const requiredFiles = [
    'dist/nodes/MyPetStocks/MyPetStocks.node.js',
    'dist/nodes/MyPetStocks/MyPetStocks.node.d.ts',
    'dist/credentials/MyPetStocksApi.credentials.js',
    'dist/credentials/MyPetStocksApi.credentials.d.ts'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`   ✅ ${file} (${Math.round(stats.size / 1024)}KB, ${stats.mtime.toLocaleString()})`);
    } else {
        console.log(`   ❌ ${file} - 文件不存在`);
    }
});

// 3. 检查节点文件内容
console.log('\n🔧 3. 检查节点配置内容');
try {
    const nodeContent = fs.readFileSync('dist/nodes/MyPetStocks/MyPetStocks.node.js', 'utf8');
    
    // 检查资源配置
    const resourceMatch = nodeContent.match(/name:\s*'Quantitative Account'/);
    if (resourceMatch) {
        console.log('   ✅ 找到 "Quantitative Account" 资源配置');
    } else {
        console.log('   ❌ 未找到 "Quantitative Account" 资源配置');
    }
    
    // 检查量化账户操作
    const operations = [
        'Get All Accounts',
        'Create Account', 
        'Update Account',
        'Delete Account'
    ];
    
    operations.forEach(op => {
        const opMatch = nodeContent.match(new RegExp(`name:\\s*'${op}'`));
        if (opMatch) {
            console.log(`   ✅ 找到操作: ${op}`);
        } else {
            console.log(`   ❌ 未找到操作: ${op}`);
        }
    });
    
    // 检查资源值
    const quantAccountMatch = nodeContent.match(/value:\s*'quantAccount'/);
    if (quantAccountMatch) {
        console.log('   ✅ 找到 quantAccount 资源值');
    } else {
        console.log('   ❌ 未找到 quantAccount 资源值');
    }
    
} catch (error) {
    console.log(`   ❌ 节点文件读取失败: ${error.message}`);
}

// 4. 检查TypeScript源文件
console.log('\n📝 4. 检查 TypeScript 源文件');
try {
    const sourceContent = fs.readFileSync('nodes/MyPetStocks/MyPetStocks.node.ts', 'utf8');
    
    const resourceMatch = sourceContent.match(/name:\s*'Quantitative Account'/);
    if (resourceMatch) {
        console.log('   ✅ 源文件包含 "Quantitative Account" 资源');
    } else {
        console.log('   ❌ 源文件缺少 "Quantitative Account" 资源');
    }
    
} catch (error) {
    console.log(`   ❌ 源文件读取失败: ${error.message}`);
}

// 5. 检查n8n节点类型定义
console.log('\n🏷️ 5. 检查节点类型定义');
try {
    const nodeJs = require('./dist/nodes/MyPetStocks/MyPetStocks.node.js');
    const nodeClass = nodeJs.MyPetStocks;
    
    if (nodeClass && nodeClass.description) {
        console.log(`   ✅ 节点类找到: ${nodeClass.description.displayName}`);
        console.log(`   ✅ 节点类型: ${nodeClass.description.name}`);
        
        if (nodeClass.description.properties) {
            const resourceProp = nodeClass.description.properties.find(p => p.name === 'resource');
            if (resourceProp) {
                console.log(`   ✅ 资源属性找到，选项数量: ${resourceProp.options.length}`);
                resourceProp.options.forEach(option => {
                    console.log(`      - ${option.name} (${option.value})`);
                });
            } else {
                console.log('   ❌ 未找到资源属性');
            }
        }
    } else {
        console.log('   ❌ 节点类未找到或无效');
    }
} catch (error) {
    console.log(`   ❌ 节点类加载失败: ${error.message}`);
}

// 6. 生成修复建议
console.log('\n🔧 6. 修复建议');
console.log('如果量化账户资源在n8n中不显示，请尝试以下步骤：');
console.log('');
console.log('1. 重新构建节点:');
console.log('   npm run build');
console.log('');
console.log('2. 重启n8n服务:');
console.log('   - 如果使用Docker: docker restart n8n');
console.log('   - 如果使用npm: 停止并重新启动n8n');
console.log('');
console.log('3. 清除n8n缓存:');
console.log('   - 删除 ~/.n8n/cache 目录');
console.log('   - 或在n8n设置中清除缓存');
console.log('');
console.log('4. 重新安装节点:');
console.log('   npm uninstall n8n-nodes-mypet-stocks');
console.log('   npm install n8n-nodes-mypet-stocks');
console.log('');
console.log('5. 检查n8n版本兼容性:');
console.log('   - 确保n8n版本 >= 0.190.0');
console.log('   - 检查节点API版本兼容性');

// 7. 创建测试工作流
console.log('\n📋 7. 创建测试工作流JSON');
const testWorkflow = {
    "name": "Test MyPet Stocks Quantitative Account",
    "nodes": [
        {
            "parameters": {
                "resource": "quantAccount",
                "operation": "getAllAccounts",
                "pageNum": 1,
                "pageSize": 10
            },
            "id": "test-node-1",
            "name": "MyPet Stocks",
            "type": "n8n-nodes-mypet-stocks.myPetStocks",
            "typeVersion": 1,
            "position": [250, 300],
            "credentials": {
                "myPetStocksApi": {
                    "id": "your-credential-id",
                    "name": "MyPet Stocks API"
                }
            }
        }
    ],
    "connections": {},
    "active": false,
    "settings": {},
    "versionId": "test-version"
};

fs.writeFileSync('test-workflow.json', JSON.stringify(testWorkflow, null, 2));
console.log('   ✅ 测试工作流已保存到 test-workflow.json');
console.log('   📝 您可以将此文件导入到n8n中进行测试');

console.log('\n🎯 诊断完成！');
