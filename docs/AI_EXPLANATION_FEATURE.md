# AI 解释功能

> **状态**: ✅ 已上线  
> **创建日期**: 2026-02-21  
> **最后更新**: 2026-02-22

---

## 📋 功能概述

为 NotionNext 的 anime 主题添加 AI 解释功能，允许用户在文章详情页选中文本后，通过右键菜单获取 DeepSeek AI 的智能解释。

**核心特性**
- 右键选中文本 → AI 解释
- 保留原文格式（代码、表格等）
- 支持 Markdown 渲染
- 二次元动漫风格 UI
- 亮色/暗色主题适配

---

## 📁 文件变更清单

### ✅ 新增文件（主题内）

| 文件 | 作用 |
|------|------|
| `themes/anime/components/AIExplanation.js` | AI 解释主组件 |
| `themes/anime/components/AIConfigModal.js` | API Key 配置弹窗 |
| `docs/AI_EXPLANATION_FEATURE.md` | 本文档 |

### ✏️ 修改文件（主题内）

| 文件 | 修改内容 |
|------|----------|
| `themes/anime/components/Header.js` | 添加 AI 配置按钮入口 |
| `themes/anime/index.js` | 集成 AIExplanation 组件 |

### ⚠️ 全局修改（NotionNext 核心）

| 文件 | 修改内容 | 回滚影响 |
|------|----------|----------|
| `package.json` | 添加 `marked` 依赖 | 需执行 `npm uninstall marked` |

> **注意**: 除 `package.json` 外，所有修改都在 `themes/anime/` 目录内，**不影响其他主题**。

---

## 🚀 快速回滚

### 方式一：一键回滚（推荐）

```bash
# 1. 卸载依赖
npm uninstall marked

# 2. 删除新增文件
rm themes/anime/components/AIExplanation.js
rm themes/anime/components/AIConfigModal.js
rm docs/AI_EXPLANATION_FEATURE.md

# 3. 恢复 Header.js（手动删除 AI 相关代码）
# 4. 恢复 index.js（手动删除 AIExplanation 组件）
```

### 方式二：Git 回滚（如有版本控制）

```bash
# 查看提交历史
git log --oneline

# 回滚到添加功能前的提交
git revert <commit-hash>
# 或
git reset --hard <commit-hash>
```

---

## 🔧 详细回滚步骤

### Step 1: 卸载依赖

```bash
npm uninstall marked
```

**依赖说明**:
- `marked`: Markdown 渲染库，用于将 AI 返回的 Markdown 转为 HTML
- 卸载后 AI 解释内容将无法正确显示格式

### Step 2: 删除新增组件

```bash
# AI 解释主组件
rm themes/anime/components/AIExplanation.js

# API 配置弹窗
rm themes/anime/components/AIConfigModal.js

# 本文档
rm docs/AI_EXPLANATION_FEATURE.md
```

### Step 3: 恢复 Header.js

**删除内容**:

```javascript
// 1. 删除 import
import AIConfigModal from './AIConfigModal'

// 2. 删除 state
const [showAIConfig, setShowAIConfig] = useState(false)

// 3. 删除 AI 配置按钮（桌面端）
<button onClick={() => setShowAIConfig(true)}>...</button>

// 4. 删除 AIConfigModal 组件
<AIConfigModal isOpen={showAIConfig} onClose={() => setShowAIConfig(false)} />
```

### Step 4: 恢复 index.js

**删除内容**:

```javascript
// 1. 删除 import
import AIExplanation from './components/AIExplanation'

// 2. 删除组件使用（在文章详情页 JSX 中）
<AIExplanation />
```

### Step 5: 验证回滚

```bash
# 1. 重新安装依赖（清理缓存）
npm ci

# 2. 构建测试
npm run build

# 3. 检查是否有报错
```

---

## 📝 修改详情

### Header.js 修改点

```diff
+ import AIConfigModal from './AIConfigModal'

+ const [showAIConfig, setShowAIConfig] = useState(false)

+ {/* AI配置按钮 */}
+ <button onClick={() => setShowAIConfig(true)}>AI配置</button>

+ <AIConfigModal isOpen={showAIConfig} onClose={() => setShowAIConfig(false)} />
```

### index.js 修改点

```diff
+ import AIExplanation from './components/AIExplanation'

+ <AIExplanation />
```

---

## 🎨 功能特性

### 文本选择
- ✅ 支持任意文本选中
- ✅ 保留 HTML 格式（代码、粗体、表格等）
- ✅ 长文本自动截断（2000 字符限制）

### 右键菜单
- ✅ 自定义二次元风格菜单
- ✅ 智能位置计算
- ✅ 移动端自动禁用

### AI 对话框
- ✅ 毛玻璃效果
- ✅ 可折叠原文区域
- ✅ Markdown 完整支持
- ✅ 一键复制解释内容
- ✅ 固定高度，不随内容变化

### 主题适配
- ✅ 亮色/暗色自动切换
- ✅ 粉紫色渐变主题
- ✅ 所有图标使用 SVG（无 emoji）

---

## ⚙️ 配置说明

### API Key 存储

- **存储位置**: 浏览器 localStorage
- **键名**: `deepseek_api_key`
- **有效期**: 永久（除非手动清除）
- **安全性**: 仅本地存储，不上传到服务器

### 使用方法

1. 点击导航栏「AI 配置」按钮
2. 输入 DeepSeek API Key
3. 在文章页选中文本
4. 右键选择「AI 解释」
5. 查看 AI 生成的解释

---

## 🐛 常见问题

### Q: 右键菜单不出现？
A: 检查是否在文章详情页，且选中了文本。移动端不支持此功能。

### Q: AI 解释加载失败？
A: 检查 API Key 是否正确，以及网络连接是否正常。

### Q: 如何清除 API Key？
A: 打开 AI 配置弹窗，点击「清除」按钮。

---

## 📊 版本历史

| 日期 | 版本 | 变更 |
|------|------|------|
| 2026-02-21 | v1.0 | 初始版本 |
| 2026-02-22 | v1.1 | 优化 UI、添加复制功能、移动端适配 |

---

## 🔗 相关链接

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [marked 文档](https://marked.js.org/)
- [NotionNext 文档](https://github.com/tangly1024/NotionNext)

---

> 💡 **提示**: 如需完全移除此功能，建议先备份当前代码，或创建 Git 分支后再执行回滚操作。
