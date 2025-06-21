# 量化账户功能测试指南

## 新增功能概述

已成功为 MyPet Stocks 节点添加了量化账户资源类型，包含以下四个操作：

### 1. 获取所有量化账户 (Get All Accounts)
- **API端点**: `GET /api/v1/portal/stock/account/`
- **支持的查询参数**:
  - `pageNum`: 页码 (默认: 1)
  - `pageSize`: 每页记录数 (默认: 20)
  - `name`: 按账户名称过滤
  - `accountId`: 按量化账户ID过滤
  - `account_type`: 按账户类型过滤 (mt4/mt5)
  - `is_real`: 按账户性质过滤 (true/false)
  - `status`: 按状态过滤 (true/false)

### 2. 创建量化账户 (Create Account)
- **API端点**: `POST /api/v1/portal/stock/account/`
- **必需参数**:
  - `name`: 账户名称
  - `accountId`: 量化账户ID
  - `account_type`: 账户类型 (mt4/mt5)
  - `is_real`: 是否为真实账户
  - `dealer`: 券商ID (动态加载)
  - `server`: 服务器名称
  - `capital_type`: 资金类型 (usd/cent)
  - `max_lever`: 最大杠杆
  - `risk`: 风险值
  - `time_zone`: 时区
  - `status`: 账户状态
- **可选参数**:
  - `view_password`: 查看密码
  - `note`: 备注

### 3. 更新量化账户 (Update Account)
- **API端点**: `PUT /api/v1/portal/stock/account/{id}/`
- **参数**: 与创建账户相同，但需要额外指定要更新的账户ID

### 4. 删除量化账户 (Delete Account)
- **API端点**: `DELETE /api/v1/portal/stock/account/{id}/`
- **参数**: 要删除的账户ID
- **注意**: 账户必须为非活跃状态才能删除

## 新增特性

### 动态券商加载
- 添加了 `getDealers` 方法，可以动态从API加载券商列表
- 在创建和更新账户时，券商选项会自动从 `/api/v1/portal/stock/dealer/` 端点获取

### 完整的参数验证
- 所有必需参数都有适当的验证
- 支持多种数据类型：字符串、数字、布尔值、选项
- 提供了丰富的选项列表（杠杆、时区、资金类型等）

### 错误处理
- 完整的API错误处理
- 认证失败时的详细错误信息
- 网络请求失败时的错误处理

## 测试建议

1. **获取所有账户测试**:
   - 测试无参数查询
   - 测试分页功能
   - 测试各种过滤条件

2. **创建账户测试**:
   - 测试所有必需参数
   - 测试可选参数
   - 测试参数验证

3. **更新账户测试**:
   - 测试更新现有账户
   - 测试不存在的账户ID

4. **删除账户测试**:
   - 测试删除非活跃账户
   - 测试删除活跃账户（应该失败）

## 配置示例

在 n8n 中使用时，需要：
1. 配置 MyPet Stocks API 凭据
2. 选择 "Quantitative Account" 资源
3. 选择相应的操作
4. 填写必要的参数

## API 文档参考

- 获取所有量化账户: https://stock-docs.apifox.cn/281436188e0
- 创建量化账户: https://stock-docs.apifox.cn/281231983e0
- 更新量化账户: https://stock-docs.apifox.cn/281396113e0
- 删除量化账户: https://stock-docs.apifox.cn/281435209e0
