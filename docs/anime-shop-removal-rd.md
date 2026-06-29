# RD 技术文档：移除 anime 主题商品小店功能

## 变更概述

将 NotionNext 项目 anime 主题中的"商品小店"功能完整移除。该功能原本通过对接 WordPress Zibll Shop Bridge 插件的 REST API 实现商品展示、下单、支付等电商流程。移除后 anime 主题不再包含任何 shop 相关代码，其他主题不受影响。

## 移除范围

### 一、删除的文件（2 个）

| 文件路径 | 原行数 | 说明 |
|---------|-------|------|
| `themes/anime/components/ShopPage.js` | 1480 | 商品小店核心页面，含商品列表、规格选择、下单、支付、订单等完整逻辑 |
| `themes/anime/components/ShopPaymentSuccessPage.js` | 45 | 支付成功提示页，仅被 ShopPage 引用 |

> 这两个文件已移至系统回收站，可通过回收站恢复；项目在 git 版本控制下，也可通过 `git checkout` 恢复。

### 二、修改的文件（3 个）

#### 1. `themes/anime/index.js`（入口文件）

| 变更位置 | 操作 | 说明 |
|---------|------|------|
| 原 import 区 | 删除 | 移除 `import ShopPage from './components/ShopPage'` |
| LayoutBase 内 | 删除 | 移除 `shopSlug`、`isShopRoute` 两个变量 |
| LayoutBase 布局类名 | 简化 | `(fullWidth \|\| isShopRoute)` → `fullWidth`（2 处） |
| LayoutBase 条件渲染 | 简化 | `!fullWidth && !isShopRoute` → `!fullWidth`（3 处：侧边栏、文章时间轴、杂志轮播） |
| LayoutSlug 内 | 删除 | 移除 `shopSlug`、`isShopPage` 两个变量 |
| LayoutSlug 内 | 删除 | 移除 `if (isShopPage) { return <LayoutShop {...props} /> }` 条件块 |
| 文件末尾 | 删除 | 移除 `LayoutShop` 组件定义 |
| export 语句 | 删除 | 移除 `LayoutShop` 导出 |

#### 2. `themes/anime/config.js`（配置文件）

| 变更位置 | 操作 | 说明 |
|---------|------|------|
| `EXTRA_MENU` 块 | 删除 | 移除 `SHOW_SHOP: true` 菜单开关及注释 |
| `SHOP` 配置块 | 删除 | 移除整个 `SHOP: { ... }` 对象（含 SLUG、API_BASE_URL、RETURN_URL、REQUIRE_EMAIL、DEFAULT_PAYMENT_METHOD、REDIRECT_TO_CHECKOUT、PRODUCTS_QUERY、PAYMENT_METHODS） |

#### 3. `themes/anime/components/Header.js`（导航组件）

| 变更位置 | 操作 | 说明 |
|---------|------|------|
| `themeExtraLinks` 数组 | 删除 | 移除"商品小店"菜单项对象（保留同数组的"洛克代肝"菜单项） |

## 影响分析

- **anime 主题**：商品小店功能完全移除，导航栏不再显示"商品小店"入口，`/shop` URL 不再渲染专用商品页，访问该路径将按普通 Notion 页面处理。
- **其他主题**：不受影响。商品小店的所有代码均为 anime 主题专属，无公共组件被其他主题共享。
- **路由**：无需修改。Shop 页面通过 Notion slug 机制动态匹配，删除代码后访问 `/shop` 将回退到普通页面布局。
- **构建依赖**：无外部包依赖变化，不影响 package.json。

## 验证结果

- 全项目源码搜索（themes/lib/components/pages 目录）确认无 `ShopPage`、`LayoutShop`、`ShopPaymentSuccessPage` 残留引用。
- index.js 修改后代码结构完整，无语法问题，条件简化正确。
- 两个 shop 文件已确认从工作区移除。

## 回退方式

本次变更在 git master 分支上执行，变更前工作区为干净状态。如需回退：

```bash
git checkout -- themes/anime/
git checkout -- themes/anime/components/ShopPage.js themes/anime/components/ShopPaymentSuccessPage.js
```

或直接从回收站恢复已删除的两个文件。

## 变更日期

2026-06-28
