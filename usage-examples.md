# 量化账户功能使用示例

## 在 n8n 中使用量化账户功能

### 前置条件

1. **配置 MyPet Stocks API 凭据**
   - 在 n8n 中添加 "MyPet Stocks API" 凭据
   - 选择认证方式：用户名密码 或 Token
   - 填写 API 基础URL、用户名、密码或Token

2. **添加 MyPet Stocks 节点**
   - 在工作流中添加 "MyPet Stocks" 节点
   - 选择资源类型为 "Quantitative Account"

## 使用场景示例

### 场景1: 获取所有量化账户

**配置步骤**:
1. 资源: `Quantitative Account`
2. 操作: `Get All Accounts`
3. 可选参数:
   - Page Number: `1`
   - Page Size: `20`
   - Filter by Name: `测试账户` (可选)
   - Filter by Account Type: `MT5` (可选)
   - Filter by Account Nature: `Real Account` (可选)

**输出示例**:
```json
{
  "message": "Success",
  "code": 0,
  "pagination": {
    "totalCount": 25,
    "nextPage": "...",
    "previousPage": null
  },
  "accounts": [
    {
      "id": 1,
      "name": "主账户",
      "accountId": "MT5001",
      "account_type": "mt5",
      "is_real": true,
      "dealer": 1,
      "server": "MT5-Live-01",
      "capital_type": "usd",
      "max_lever": "1:100",
      "risk": 100,
      "time_zone": "UTC",
      "status": true
    }
  ]
}
```

### 场景2: 创建新的量化账户

**配置步骤**:
1. 资源: `Quantitative Account`
2. 操作: `Create Account`
3. 必需参数:
   - Account Name: `新测试账户`
   - Account ID: `MT5999`
   - Account Type: `MT5`
   - Is Real Account: `true`
   - Dealer: 选择券商 (动态加载)
   - Server: `MT5-Live-Server`
   - Capital Type: `USD (Dollar)`
   - Max Leverage: `1:100`
   - Risk: `100`
   - Time Zone: `Asia/Shanghai`
   - Status: `true`
4. 可选参数:
   - View Password: `view123`
   - Note: `通过n8n创建的测试账户`

**输出示例**:
```json
{
  "message": "Account created successfully",
  "code": 0,
  "account": {
    "id": 15,
    "name": "新测试账户",
    "accountId": "MT5999",
    "account_type": "mt5",
    "is_real": true,
    "dealer": 1,
    "server": "MT5-Live-Server",
    "capital_type": "usd",
    "max_lever": "1:100",
    "risk": 100,
    "time_zone": "Asia/Shanghai",
    "status": true,
    "note": "通过n8n创建的测试账户",
    "created_at": "2025-06-21T12:30:00Z"
  }
}
```

### 场景3: 更新现有账户

**配置步骤**:
1. 资源: `Quantitative Account`
2. 操作: `Update Account`
3. 参数:
   - Account to Update: `15` (要更新的账户ID)
   - Account Name: `更新后的账户名称`
   - 其他参数按需修改...

### 场景4: 删除账户

**配置步骤**:
1. 资源: `Quantitative Account`
2. 操作: `Delete Account`
3. 参数:
   - Account to Delete: `15` (要删除的账户ID)

**注意**: 只能删除状态为非活跃的账户

## 工作流示例

### 示例1: 账户管理工作流

```
[Trigger] → [Get All Accounts] → [Filter Active Accounts] → [Update Status] → [Send Notification]
```

1. **触发器**: 定时触发 (每天检查一次)
2. **获取账户**: 获取所有量化账户
3. **过滤**: 筛选出活跃账户
4. **更新**: 根据条件更新账户状态
5. **通知**: 发送账户状态报告

### 示例2: 批量创建账户

```
[Manual Trigger] → [Read CSV] → [Create Account] → [Log Results]
```

1. **手动触发**: 管理员手动启动
2. **读取数据**: 从CSV文件读取账户信息
3. **创建账户**: 批量创建量化账户
4. **记录结果**: 记录创建成功/失败的账户

### 示例3: 账户监控

```
[Schedule Trigger] → [Get All Accounts] → [Check Risk Levels] → [Send Alert]
```

1. **定时触发**: 每小时检查一次
2. **获取账户**: 获取所有账户信息
3. **风险检查**: 检查账户风险水平
4. **发送警报**: 风险过高时发送警报

## 错误处理

### 常见错误及解决方案

1. **认证失败**
   - 检查API凭据配置
   - 确认用户名密码或Token正确

2. **账户创建失败**
   - 检查必需参数是否完整
   - 确认账户ID不重复
   - 验证券商ID有效性

3. **账户删除失败**
   - 确认账户状态为非活跃
   - 检查账户ID是否存在

4. **网络错误**
   - 检查API基础URL配置
   - 确认网络连接正常

## 最佳实践

1. **参数验证**: 在创建/更新账户前验证参数完整性
2. **错误处理**: 使用n8n的错误处理节点处理API错误
3. **日志记录**: 记录重要操作的日志便于调试
4. **批量操作**: 对于大量账户操作，考虑分批处理避免超时
5. **权限控制**: 确保只有授权用户可以执行敏感操作

## 性能优化

1. **分页查询**: 使用适当的页面大小避免一次性加载过多数据
2. **过滤条件**: 使用过滤条件减少不必要的数据传输
3. **缓存券商**: 券商列表变化不频繁，可以考虑缓存
4. **并发控制**: 避免同时进行大量API调用

## 安全注意事项

1. **凭据保护**: 妥善保管API凭据，不要在日志中暴露
2. **权限最小化**: 只授予必要的API权限
3. **操作审计**: 记录重要操作的审计日志
4. **数据验证**: 对用户输入进行严格验证
