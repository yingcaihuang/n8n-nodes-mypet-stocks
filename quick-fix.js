/**
 * 快速修复脚本 - 解决量化账户资源不显示的问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 MyPet Stocks 节点快速修复工具\n');

// 检查当前环境
console.log('📋 1. 检查当前环境');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log(`   ✅ 当前版本: ${packageJson.version}`);
    
    // 检查构建文件
    const nodeFile = 'dist/nodes/MyPetStocks/MyPetStocks.node.js';
    if (fs.existsSync(nodeFile)) {
        const stats = fs.statSync(nodeFile);
        console.log(`   ✅ 构建文件存在 (${stats.mtime.toLocaleString()})`);
    } else {
        console.log('   ❌ 构建文件不存在，需要重新构建');
        throw new Error('需要重新构建');
    }
} catch (error) {
    console.log(`   ❌ 环境检查失败: ${error.message}`);
}

// 重新构建节点
console.log('\n🔨 2. 重新构建节点');
try {
    console.log('   正在执行: npm run build');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('   ✅ 构建完成');
} catch (error) {
    console.log('   ❌ 构建失败:', error.message);
    process.exit(1);
}

// 验证节点配置
console.log('\n🔍 3. 验证节点配置');
try {
    const nodeModule = require('./dist/nodes/MyPetStocks/MyPetStocks.node.js');
    const instance = new nodeModule.MyPetStocks();
    
    // 检查量化账户资源
    const resourceProp = instance.description.properties.find(p => p.name === 'resource');
    const quantAccountResource = resourceProp.options.find(opt => opt.value === 'quantAccount');
    
    if (quantAccountResource) {
        console.log('   ✅ 量化账户资源配置正确');
        
        // 检查操作
        const quantAccountOps = instance.description.properties.filter(p => 
            p.name === 'operation' && 
            p.displayOptions && 
            p.displayOptions.show && 
            p.displayOptions.show.resource && 
            p.displayOptions.show.resource.includes('quantAccount')
        );
        
        if (quantAccountOps.length > 0) {
            console.log(`   ✅ 找到 ${quantAccountOps[0].options.length} 个量化账户操作`);
        } else {
            throw new Error('量化账户操作未找到');
        }
    } else {
        throw new Error('量化账户资源未找到');
    }
} catch (error) {
    console.log('   ❌ 验证失败:', error.message);
    process.exit(1);
}

// 生成修复指令
console.log('\n📝 4. 生成修复指令');

const instructions = `
🎯 节点已成功构建和验证！

现在请按照以下步骤在 n8n 中应用修复：

📋 方法1: 重启 n8n (推荐)
---------------------------------
如果您使用 Docker:
  docker restart n8n

如果您使用 npm/yarn:
  1. 停止当前的 n8n 进程 (Ctrl+C)
  2. 重新启动: npx n8n start

如果您使用 PM2:
  pm2 restart n8n

📋 方法2: 清除缓存 (如果方法1无效)
---------------------------------
删除 n8n 缓存目录:
  
Linux/Mac:
  rm -rf ~/.n8n/cache
  
Windows:
  rmdir /s "%USERPROFILE%\\.n8n\\cache"

然后重启 n8n。

📋 方法3: 重新安装节点 (最后手段)
---------------------------------
npm uninstall n8n-nodes-mypet-stocks
npm install n8n-nodes-mypet-stocks@${JSON.parse(fs.readFileSync('package.json', 'utf8')).version}

然后重启 n8n。

🔍 验证成功标志:
---------------------------------
修复成功后，您应该能在 MyPet Stocks 节点中看到：
✅ Resource 下拉菜单包含 "Quantitative Account"
✅ 选择后显示4个操作选项:
   - Get All Accounts
   - Create Account  
   - Update Account
   - Delete Account

📞 如果仍有问题:
---------------------------------
请查看 TROUBLESHOOTING.md 文件获取详细的故障排除指南。
`;

console.log(instructions);

// 保存指令到文件
fs.writeFileSync('QUICK_FIX_INSTRUCTIONS.txt', instructions);
console.log('📄 修复指令已保存到 QUICK_FIX_INSTRUCTIONS.txt\n');

console.log('🎉 快速修复完成！请按照上述指令重启 n8n。');
