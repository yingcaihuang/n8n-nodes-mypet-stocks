# 📊 MyPet Stocks 账户交易详情功能使用指南

## 🎯 功能概述

账户交易详情功能允许您获取特定量化账户的详细交易统计信息，支持按不同时间维度（日、周、月、季、年、自定义）进行查询和分析。

## 🚀 快速开始

### 1. 选择操作
- **Resource**: 选择 `Trading`
- **Operation**: 选择 `Get Account Trading Details`

### 2. 必需参数

| 参数 | 类型 | 说明 |
|------|------|------|
| Account ID | 数字 | 量化账户ID（必填） |
| Time Scope | 选项 | 查询时间范围（必填） |

### 3. 时间范围选项

| 选项 | 值 | 说明 |
|------|-----|------|
| All Time | all | 查询所有时间的数据 |
| Daily | day | 按日统计 |
| Weekly | week | 按周统计 |
| Monthly | month | 按月统计 |
| Quarterly | quarter | 按季度统计 |
| Yearly | year | 按年统计 |
| Custom Range | custom | 自定义时间范围 |

### 4. 自定义时间范围

当选择 `Custom Range` 时，需要额外填写：
- **Start Date**: 开始日期（YYYY-MM-DD 格式）
- **End Date**: 结束日期（YYYY-MM-DD 格式）

## 📋 返回数据结构

### 主要字段
```json
{
  "message": "success",
  "code": 0,
  "accountId": 39,
  "scope": "all",
  "timeRange": null,
  "total": {...},
  "details": [...],
  "summary": {...}
}
```

### 总体统计 (total)
仅在 `scope: "all"` 时返回：
- `sell_count`: 空单数量
- `sell_total_lots`: 空单总手数
- `sell_floatingProfit`: 空单浮动盈亏
- `buy_count`: 多单数量
- `buy_total_lots`: 多单总手数
- `buy_floatingProfit`: 多单浮动盈亏

### 详细信息 (details)
每个时间段的详细统计：
- `time`: 时间标识（如 "2025.03", "2025-03-15"）
- `total_lots`: 总交易手数
- `min_lot`: 最小手数
- `max_lot`: 最大手数
- `count`: 订单数量
- `orderProfit`: 订单盈亏
- `first_balance`: 期初余额
- `balance`: 期末余额
- `equity`: 净值
- `min_floatingProfit`: 最小浮动盈亏
- `max_floatingProfit`: 最大浮动盈亏
- `min_holding_time`: 最短持仓时间
- `max_holding_time`: 最长持仓时间
- `avg_holding_time`: 平均持仓时间
- `orderProfit_per`: 盈亏百分比
- `max_floatingProfit_per`: 最大浮动盈亏百分比
- `min_floatingProfit_per`: 最小浮动盈亏百分比

### 汇总信息 (summary)
- `totalRecords`: 返回的记录数
- `scopeDescription`: 时间范围描述

## 🎯 使用场景

### 1. 账户总体分析
```
Account ID: 39
Time Scope: All Time
```
查看账户的整体交易表现和持仓情况。

### 2. 月度绩效分析
```
Account ID: 39
Time Scope: Monthly
```
按月分析账户的交易绩效变化趋势。

### 3. 特定时期分析
```
Account ID: 39
Time Scope: Custom Range
Start Date: 2024-11-01
End Date: 2024-11-30
```
分析特定时间段的交易表现。

### 4. 日度交易监控
```
Account ID: 39
Time Scope: Daily
```
监控每日的交易活动和盈亏情况。

### 5. 季度报告
```
Account ID: 39
Time Scope: Quarterly
```
生成季度交易报告和分析。

## 📊 数据分析示例

### 示例1: 账户总体表现
```json
{
  "accountId": 39,
  "scope": "all",
  "total": {
    "sell_count": 15,
    "sell_total_lots": 1.5,
    "buy_count": 20,
    "buy_total_lots": 2.0
  }
}
```

### 示例2: 月度详情
```json
{
  "details": [
    {
      "time": "2025.03",
      "count": 3,
      "total_lots": 0.03,
      "orderProfit": -3.09,
      "avg_holding_time": "02:15:30"
    }
  ]
}
```

## ⚠️ 注意事项

1. **账户ID**: 必须是有效的量化账户ID
2. **时间格式**: 自定义时间使用 YYYY-MM-DD 格式
3. **数据权限**: 只能查询有权限的账户数据
4. **时间范围**: 自定义范围的结束时间必须大于开始时间
5. **数据实时性**: 数据可能有轻微延迟

## 🔧 故障排除

### 常见错误
- **401 Unauthorized**: Token 过期或无效
- **403 Forbidden**: 没有查询该账户的权限
- **400 Bad Request**: 参数格式错误或缺少必需参数

### 解决方案
1. 检查 Token 是否有效
2. 确认账户ID是否正确且有权限访问
3. 验证时间格式是否正确
4. 确保自定义时间范围的参数完整

## 📈 最佳实践

1. **定期监控**: 使用日度或周度查询监控账户表现
2. **趋势分析**: 结合月度和季度数据分析长期趋势
3. **风险控制**: 关注最大浮动盈亏和持仓时间
4. **绩效评估**: 使用盈亏百分比评估交易效果
5. **数据备份**: 定期保存重要的统计数据

## 🎨 可视化建议

### 图表类型
- **折线图**: 显示时间序列的盈亏趋势
- **柱状图**: 比较不同时期的交易量
- **饼图**: 显示多空单比例
- **散点图**: 分析持仓时间与盈亏关系

### 关键指标
- 累计盈亏曲线
- 月度/季度盈亏对比
- 平均持仓时间趋势
- 交易频率分析

## 🔗 相关功能

- **订单查询**: 查看具体的交易订单详情
- **实时数据**: 获取账户的实时交易状态
- **佣金统计**: 分析交易成本和佣金
