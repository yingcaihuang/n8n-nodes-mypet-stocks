# 📊 MyPet Stocks 订单查询功能使用指南

## 🎯 功能概述

订单查询功能允许您从 MyPet Stocks 量化交易系统中查询和分析交易订单，支持多种过滤条件和分页查询。

## 🚀 快速开始

### 1. 选择操作
- **Resource**: 选择 `Trading`
- **Operation**: 选择 `Query Trade Orders`

### 2. 基本参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| Page Number | 数字 | 1 | 查询第几页 |
| Page Size | 数字 | 20 | 每页记录数 |
| Filter Abnormal Orders | 布尔 | false | 是否过滤异常订单 |

### 3. 过滤条件

#### 账户和仓位
- **Stock Account ID**: 量化账户ID
- **Position**: 仓位类型
  - `All`: 所有
  - `Open Positions`: 持仓
  - `Closed Positions`: 历史

#### 交易类型
- **Trade Type**: 交易类型
  - `All`: 所有
  - `Buy (Long)`: 多单
  - `Sell (Short)`: 空单
  - `Balance`: 出入金

#### 交易品种和订单
- **Symbol**: 交易品种（如 XAUUSD, USDJPY, NAS100）
- **Ticket Number**: 交易单号
- **Magic Number**: EA魔术号
- **Comment**: 订单注释

#### 时间过滤
- **Open Time Start/End**: 开仓时间范围（北京时间）
- **Close Time Start/End**: 平仓时间范围（北京时间）

时间格式：`2025-04-01 00:00`

## 📋 返回数据结构

### 主要字段
```json
{
  "message": "success",
  "code": 0,
  "totalCount": 825,
  "nextPage": "下一页URL",
  "previousPage": null,
  "orders": [...],
  "orderInfo": {...},
  "queryParams": {...}
}
```

### 订单详情 (orders)
每个订单包含以下信息：
- `ticket`: 交易单号
- `symbol`: 交易品种
- `tradeType`: 交易类型 (Buy/Sell)
- `lots`: 交易手数
- `openPrice`: 开仓价格
- `closePrice`: 平仓价格
- `openTime_bj`: 开仓时间（北京时间）
- `closeTime_bj`: 平仓时间（北京时间）
- `orderProfit`: 订单盈亏
- `commission`: 佣金
- `swap`: 库存费
- `stopLoss`: 止损价
- `takeProfit`: 止盈价
- `comment`: 注释
- `magic`: 魔术号

### 统计信息 (orderInfo)
- `total`: 总体统计
  - `total`: 总订单数
  - `total_lots`: 总手数
  - `total_orderProfit`: 总盈亏
- `buy_close`: 多单平仓统计
- `sell_close`: 空单平仓统计
- `fund`: 资金统计

## 🎯 使用场景

### 1. 基础查询
查询最近的交易记录：
- Page Number: 1
- Page Size: 20

### 2. 按品种分析
分析特定交易品种的表现：
- Symbol: XAUUSD
- Trade Type: All

### 3. 策略分析
分析特定EA策略的交易：
- Magic Number: 12345
- Position: Closed Positions

### 4. 时间段分析
分析特定时间段的交易：
- Open Time Start: 2025-04-01 00:00
- Open Time End: 2025-04-30 23:59

### 5. 盈亏分析
查询盈利/亏损订单：
- Trade Type: Buy
- Position: Closed Positions

## 📊 数据分析示例

### 示例1: 查询黄金交易
```
Symbol: XAUUSD
Trade Type: All
Page Size: 50
```

### 示例2: 分析多单表现
```
Trade Type: Buy
Position: Closed Positions
Open Time Start: 2025-01-01 00:00
Open Time End: 2025-12-31 23:59
```

### 示例3: EA策略分析
```
Magic Number: 888
Comment: MyStrategy
Position: All
```

## ⚠️ 注意事项

1. **认证要求**: 需要有效的 Bearer Token
2. **时间格式**: 使用北京时间，格式为 `YYYY-MM-DD HH:MM`
3. **分页限制**: 建议每页不超过 100 条记录
4. **过滤组合**: 可以组合多个过滤条件进行精确查询
5. **数据实时性**: 数据可能有轻微延迟

## 🔧 故障排除

### 常见错误
- **401 Unauthorized**: Token 过期或无效
- **400 Bad Request**: 参数格式错误
- **500 Internal Error**: 服务器错误

### 解决方案
1. 检查 Token 是否有效
2. 验证时间格式是否正确
3. 确认账户ID是否存在
4. 减少查询数据量

## 📈 最佳实践

1. **分页查询**: 大量数据时使用分页
2. **时间过滤**: 使用时间范围减少数据量
3. **组合过滤**: 结合多个条件精确查询
4. **定期分析**: 定期查询进行交易分析
5. **数据备份**: 重要数据及时保存
