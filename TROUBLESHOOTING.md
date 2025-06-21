# 故障排除指南 - 量化账户资源不显示

## 问题描述
升级到 v1.6.0 后，在 n8n 中看不到 "Quantitative Account" 资源选项。

## ✅ 验证结果
通过诊断脚本确认：
- ✅ 节点配置完全正确
- ✅ 量化账户资源已正确添加
- ✅ 所有4个操作都已配置
- ✅ 节点可以正常加载
- ✅ 构建文件完整且最新

## 🔧 解决方案

### 方案1: 重启 n8n 服务 (推荐)
这是最常见的解决方案，因为 n8n 需要重启来加载新的节点配置。

**Docker 用户:**
```bash
docker restart n8n
```

**npm/yarn 用户:**
```bash
# 停止 n8n
Ctrl+C (或关闭终端)

# 重新启动
npx n8n start
# 或
npm start
```

**PM2 用户:**
```bash
pm2 restart n8n
```

### 方案2: 清除 n8n 缓存
n8n 可能缓存了旧的节点配置。

**方法1 - 删除缓存目录:**
```bash
# Linux/Mac
rm -rf ~/.n8n/cache

# Windows
rmdir /s "%USERPROFILE%\.n8n\cache"
```

**方法2 - n8n 设置中清除:**
1. 打开 n8n 界面
2. 进入 Settings (设置)
3. 找到 "Clear cache" 选项
4. 点击清除缓存
5. 重启 n8n

### 方案3: 重新安装节点包
如果上述方法无效，尝试重新安装节点包。

```bash
# 卸载旧版本
npm uninstall n8n-nodes-mypet-stocks

# 安装新版本
npm install n8n-nodes-mypet-stocks@1.6.0

# 重启 n8n
```

### 方案4: 检查 n8n 版本兼容性
确保您的 n8n 版本支持社区节点。

```bash
# 检查 n8n 版本
npx n8n --version

# 升级 n8n (如果需要)
npm install -g n8n@latest
```

**最低要求:** n8n >= 0.190.0

### 方案5: 手动验证节点安装
检查节点是否正确安装在 n8n 的 node_modules 中。

```bash
# 查找节点包
find node_modules -name "*mypet-stocks*" -type d

# 或者检查包是否存在
ls node_modules/n8n-nodes-mypet-stocks/
```

### 方案6: 检查环境变量
确保 n8n 配置允许社区节点。

```bash
# 设置环境变量 (如果需要)
export N8N_COMMUNITY_PACKAGES_ENABLED=true

# 重启 n8n
npx n8n start
```

### 方案7: 使用测试工作流
导入提供的测试工作流来验证节点是否可用。

1. 使用 `test-workflow.json` 文件
2. 在 n8n 中导入工作流
3. 检查节点是否正确显示

## 🔍 诊断步骤

### 1. 运行诊断脚本
```bash
node diagnose-node.js
```

### 2. 检查节点加载
```bash
node test-node-loading.js
```

### 3. 验证构建
```bash
npm run build
```

### 4. 检查 n8n 日志
启动 n8n 时查看控制台输出，寻找错误信息：
```bash
npx n8n start --verbose
```

## 📋 常见问题

### Q: 为什么重启后还是看不到？
A: 可能是缓存问题，尝试清除缓存后再重启。

### Q: 其他资源显示正常，只有量化账户不显示？
A: 这不太可能，因为所有资源都在同一个配置中。请检查浏览器缓存。

### Q: Docker 环境中如何处理？
A: 确保容器重启，并且节点包正确挂载到容器中。

### Q: 开发环境中如何调试？
A: 使用 `npm run dev` 启动开发模式，查看实时编译输出。

## 🎯 验证成功

成功解决后，您应该能够：
1. 在资源下拉菜单中看到 "Quantitative Account"
2. 选择后看到4个操作选项：
   - Get All Accounts
   - Create Account
   - Update Account
   - Delete Account
3. 每个操作都有相应的参数配置

## 📞 获取帮助

如果以上方法都无效，请：
1. 提供 n8n 版本信息
2. 提供错误日志
3. 提供诊断脚本输出
4. 描述您的安装环境 (Docker/npm/yarn)

## 🔄 最后的解决方案

如果所有方法都失败了：
1. 完全卸载 n8n 和节点包
2. 重新安装 n8n
3. 重新安装节点包
4. 重新配置凭据

这应该能解决任何持久的配置问题。
