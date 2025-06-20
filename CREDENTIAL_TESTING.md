# 🔐 MyPet Stocks n8n 节点 - 凭据测试说明

## 📋 当前状态

**版本**: v1.0.2  
**凭据自动测试**: ❌ 已禁用  
**手动验证**: ✅ 可用  

## 🚨 重要说明

由于 MyPet Stocks API 的登录端点需要 POST 请求体（包含用户名和密码），而 n8n 的内置凭据测试机制在处理复杂 POST 请求时存在限制，我们暂时禁用了自动凭据测试功能。

## 🔍 问题分析

### API 要求
```http
POST /api/v1/portal/dashlogin/
Content-Type: application/json

{
  "username": "admin",
  "password": "nicaiba_88"
}
```

### n8n 凭据测试限制
- n8n 的 `ICredentialTestRequest` 在处理 POST 请求体时存在表达式解析问题
- 复杂的请求体结构可能导致测试失败
- 不同版本的 n8n 对凭据测试的支持程度不同

## ✅ 手动验证方法

### 方法 1: 使用提供的测试脚本

```bash
# 在项目根目录运行
node test-auth.js
```

**预期输出**:
```
🔐 使用凭据测试: admin / **********
状态码: 200
✅ 鉴权成功!
Token: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
用户名: admin
用户ID: 1
```

### 方法 2: 使用 curl 命令

```bash
curl -X POST https://dash-stock.mypet.run/api/v1/portal/dashlogin/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"nicaiba_88"}'
```

**预期响应**:
```json
{
  "message": "success",
  "code": 0,
  "result": {
    "token": "Bearer ...",
    "username": "admin",
    "userId": 1
  }
}
```

### 方法 3: 在 n8n 工作流中测试

1. 创建一个新的工作流
2. 添加 "MyPet Stocks" 节点
3. 配置凭据（用户名: `admin`, 密码: `nicaiba_88`）
4. 选择 "Login" 操作
5. 执行节点

**预期结果**: 节点应该成功执行并返回登录信息

## 🔧 在 n8n 中使用凭据

### 步骤 1: 安装节点
```bash
npm install n8n-nodes-mypet-stocks@1.0.2
```

### 步骤 2: 重启 n8n
```bash
# 重启你的 n8n 实例
```

### 步骤 3: 配置凭据
1. 在 n8n 中，转到 **Credentials** 页面
2. 点击 **Add Credential**
3. 搜索并选择 **MyPet Stocks API**
4. 填写以下信息：
   - **Authentication Method**: Username & Password
   - **Username**: `admin`
   - **Password**: `nicaiba_88`
   - **API Base URL**: `https://dash-stock.mypet.run`

### 步骤 4: 保存凭据
- 点击 **Save** 保存凭据
- ⚠️ **注意**: 由于自动测试已禁用，不会显示连接测试结果
- 这是正常现象，凭据仍然可以正常使用

### 步骤 5: 在工作流中使用
1. 创建新工作流
2. 添加 "MyPet Stocks" 节点
3. 选择刚才创建的凭据
4. 配置节点操作
5. 执行测试

## 🎯 验证凭据是否正确配置

### 成功指标
- ✅ 节点执行成功
- ✅ 返回有效的 API 响应
- ✅ 没有认证错误

### 失败指标
- ❌ 401 Unauthorized 错误
- ❌ 连接超时
- ❌ 无效的响应格式

## 🔄 故障排除

### 问题 1: 凭据保存后无法使用
**解决方案**:
1. 检查用户名和密码是否正确
2. 确认 API Base URL 是否为 `https://dash-stock.mypet.run`
3. 重启 n8n 实例

### 问题 2: 节点执行失败
**解决方案**:
1. 使用测试脚本验证 API 连接
2. 检查网络连接
3. 确认 API 服务是否可用

### 问题 3: 认证错误
**解决方案**:
1. 验证凭据是否正确
2. 检查 API 端点是否变更
3. 联系 API 提供方确认服务状态

## 📞 获取帮助

### 测试 API 连接
```bash
# 运行详细的调试脚本
node debug-credentials.js
```

### 检查日志
- 查看 n8n 的执行日志
- 检查节点的错误输出
- 使用浏览器开发者工具检查网络请求

## 🚀 未来改进

### 计划中的功能
1. **改进的凭据测试**: 研究更好的 POST 请求测试方法
2. **更多认证方式**: 支持 API Key 认证
3. **连接状态指示**: 提供更好的连接状态反馈

### 贡献
如果您找到了解决凭据自动测试的方法，欢迎提交 Pull Request！

## 📊 版本历史

### v1.0.2 (当前版本)
- ❌ 禁用自动凭据测试
- ✅ 修复 API URL 路径问题
- ✅ 添加详细的测试脚本
- ✅ 改进错误处理

### v1.0.1
- ✅ 修复 API URL 尾部斜杠问题
- ✅ 基本功能实现

### v1.0.0
- ✅ 初始版本发布

---

**注意**: 虽然自动凭据测试被禁用，但这不影响节点的正常功能。凭据配置和 API 调用都能正常工作。

*最后更新: 2025-06-20*
