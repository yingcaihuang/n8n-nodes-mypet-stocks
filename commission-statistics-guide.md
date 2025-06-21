# 佣金统计功能使用指南

## 功能概述

佣金统计功能已成功添加到 MyPet Stocks 节点的交易资源中，提供了全面的佣金数据分析和统计功能。

### 🎯 主要特性

- **多时间范围支持**: 全时间、今日、昨日、本周、上周、本月、上月、自定义范围
- **多账户选择**: 支持选择多个量化账户进行统计
- **佣金单位选择**: 支持美元(USD)和美分(Cent)两种单位
- **详细数据展示**: 提供卡片信息、账户详情和每日详情三个维度的数据

## 📋 配置参数

### 必需参数

1. **Time Scope (时间范围)**
   - `all` - 全时间
   - `today` - 今日
   - `yesterday` - 昨日
   - `week` - 本周
   - `last_week` - 上周
   - `month` - 本月
   - `last_month` - 上月
   - `custom` - 自定义范围

2. **Accounts (账户选择)**
   - 多选下拉菜单，动态加载量化账户列表
   - 支持选择多个账户进行统计

3. **Capital Type (佣金单位)**
   - `usd` - 美元
   - `cent` - 美分

### 条件参数

当选择 `custom` 时间范围时，需要额外配置：

4. **Start Date (开始日期)**
   - 格式: YYYY-MM-DD
   - 示例: 2025-04-01

5. **End Date (结束日期)**
   - 格式: YYYY-MM-DD
   - 示例: 2025-04-30

## 🔧 在 n8n 中使用

### 基本配置步骤

1. **添加 MyPet Stocks 节点**
2. **选择资源**: `Trading`
3. **选择操作**: `Commission Statistics`
4. **配置参数**:
   - Time Scope: 选择时间范围
   - Accounts: 选择要统计的账户
   - Capital Type: 选择佣金单位
   - 如果选择自定义范围，填写开始和结束日期

### 配置示例

#### 示例1: 全时间范围统计
```json
{
  "resource": "trading",
  "operation": "getCommissionStatistics",
  "scope": "all",
  "accounts": ["1", "2", "3"],
  "capital_type": "usd"
}
```

#### 示例2: 本月统计
```json
{
  "resource": "trading",
  "operation": "getCommissionStatistics",
  "scope": "month",
  "accounts": ["1", "5"],
  "capital_type": "cent"
}
```

#### 示例3: 自定义时间范围
```json
{
  "resource": "trading",
  "operation": "getCommissionStatistics",
  "scope": "custom",
  "accounts": ["2", "4", "6"],
  "capital_type": "usd",
  "start_time": "2025-04-01",
  "end_time": "2025-04-30"
}
```

## 📊 返回数据结构

### 完整响应示例
```json
{
  "message": "success",
  "code": 0,
  "cardInfo": [
    {
      "title": "金融账户数",
      "icon": "dynamic-avatar-4|svg",
      "value": 3,
      "color": "blue",
      "action": "总数",
      "decimals": 0
    },
    {
      "title": "总佣金",
      "icon": "ant-design:money-collect-twotone",
      "value": 125.89,
      "color": "red",
      "action": "美金",
      "decimals": 2
    },
    {
      "title": "总手数",
      "icon": "total-sales|svg",
      "value": 15.67,
      "color": "blue",
      "action": "总数",
      "decimals": 2
    }
  ],
  "commissionDetail": [
    {
      "name": "账户名称",
      "capital_type": "usd",
      "total_lots": 8.45,
      "commission_per": 7,
      "total_commission": 59.15,
      "show_total_commission": 59.15
    }
  ],
  "commissionDayDetail": {
    "dimensions": ["time", "账户1", "账户2"],
    "detail": [
      {
        "time": "2025-06-15",
        "账户1": 15.25,
        "账户2": 12.30
      }
    ]
  },
  "queryParams": {
    "scope": "all",
    "accounts": ["1", "2", "3"],
    "capital_type": "usd",
    "start_time": null,
    "end_time": null
  }
}
```

### 数据字段说明

#### cardInfo (卡片信息)
- `title`: 指标名称
- `value`: 指标数值
- `action`: 单位或说明
- `color`: 显示颜色
- `decimals`: 小数位数

#### commissionDetail (佣金详情)
- `name`: 账户名称
- `capital_type`: 资金类型
- `total_lots`: 总手数
- `commission_per`: 每手佣金
- `total_commission`: 总佣金
- `show_total_commission`: 显示的总佣金

#### commissionDayDetail (每日佣金详情)
- `dimensions`: 数据维度（时间 + 账户名称）
- `detail`: 每日详细数据数组

## 🎯 使用场景

### 场景1: 日常佣金监控
```
[Schedule Trigger] → [Commission Statistics] → [Data Processing] → [Send Report]
```
- 每日自动获取昨日佣金统计
- 处理数据并生成报告
- 发送给相关人员

### 场景2: 月度佣金分析
```
[Manual Trigger] → [Commission Statistics] → [Excel Export] → [Email Notification]
```
- 手动触发月度佣金统计
- 导出到Excel文件
- 邮件发送给管理层

### 场景3: 账户佣金对比
```
[HTTP Request] → [Commission Statistics] → [Data Comparison] → [Chart Generation]
```
- 获取多个账户的佣金数据
- 进行对比分析
- 生成可视化图表

## ⚠️ 注意事项

1. **账户选择**: 必须选择至少一个账户
2. **时间格式**: 自定义时间范围必须使用 YYYY-MM-DD 格式
3. **权限要求**: 需要有相应账户的查看权限
4. **数据延迟**: 佣金数据可能有一定延迟，建议查询前一日或更早的数据

## 🔍 故障排除

### 常见问题

1. **账户列表为空**
   - 检查API凭据是否正确
   - 确认账户权限设置

2. **自定义时间范围报错**
   - 检查日期格式是否为 YYYY-MM-DD
   - 确认结束日期晚于开始日期

3. **佣金数据为0**
   - 检查选择的时间范围内是否有交易
   - 确认账户是否有佣金产生

## 📈 数据分析建议

1. **趋势分析**: 使用每日佣金详情分析佣金趋势
2. **账户对比**: 比较不同账户的佣金效率
3. **时间对比**: 对比不同时间段的佣金表现
4. **成本分析**: 结合交易手数分析佣金成本

## 🔄 版本信息

- **添加版本**: v1.6.1
- **API端点**: `/api/v1/portal/stock/commissionStat/`
- **请求方法**: POST
- **认证方式**: Bearer Token

---

**API文档参考**: https://stock-docs.apifox.cn/281863262e0
