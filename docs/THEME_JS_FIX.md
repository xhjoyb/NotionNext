# NotionNext Core Fix - theme.js 竞态条件修复

> **状态**: ✅ 已修复  
> **修复日期**: 2026-02-22  
> **问题**: Next.js 路由切换时的 `autoExport` 错误  
> **影响范围**: 所有主题（anime 及其他）

---

## 📋 问题描述

### 错误信息
```
TypeError: Cannot read properties of undefined (reading 'autoExport')
```

### 触发场景
- 快速切换页面时
- 从首页进入文章详情页
- 使用随机文章跳转功能
- 浏览器返回/前进操作

### 根本原因
`themes/theme.js` 中的 `useLayoutByTheme` 函数使用了 `setTimeout` 来修复主题 DOM，但没有正确清理定时器。当页面快速切换时：
1. 旧页面的定时器仍在队列中
2. 新页面已经加载
3. 定时器回调执行时访问了已卸载组件的 router 状态
4. 导致 `autoExport` 属性访问错误

---

## 🔧 修复详情

### 修改文件
| 文件 | 修改类型 |
|------|----------|
| `themes/theme.js` | 修改 |

### 具体修改

#### 1. 添加 React Hooks 导入
```diff
  import { useRouter } from 'next/router'
+ import { useEffect, useRef } from 'react'
  import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'
```

#### 2. 重构 `useLayoutByTheme` 函数
```diff
  export const useLayoutByTheme = ({ layoutName, theme }) => {
    const LayoutComponents =
      ThemeComponents[layoutName] || ThemeComponents.LayoutSlug

    const router = useRouter()
    const themeQuery = getQueryParam(router?.asPath, 'theme') || theme
    const isDefaultTheme = !themeQuery || themeQuery === BLOG.THEME
+   const timerRef = useRef(null)
+
+   // 使用 useEffect 管理定时器，避免竞态条件
+   useEffect(() => {
+     // 清理之前的定时器
+     if (timerRef.current) {
+       clearTimeout(timerRef.current)
+     }
+
+     // 设置新的定时器
+     timerRef.current = setTimeout(() => {
+       fixThemeDOM()
+     }, isDefaultTheme ? 100 : 500)
+
+     // 组件卸载时清理定时器
+     return () => {
+       if (timerRef.current) {
+         clearTimeout(timerRef.current)
+       }
+     }
+   }, [layoutName, themeQuery, isDefaultTheme])

    // 加载非当前默认主题
    if (!isDefaultTheme) {
      const loadThemeComponents = componentsSource => {
        const components =
          componentsSource[layoutName] || componentsSource.LayoutSlug
-       setTimeout(fixThemeDOM, 500)
        return components
      }
      return dynamic(
        () => import(`@/themes/${themeQuery}`).then(m => loadThemeComponents(m)),
        { ssr: true }
      )
    }

-   setTimeout(fixThemeDOM, 100)
    return LayoutComponents
  }
```

### 修复要点
1. **使用 `useRef`** - 存储定时器引用
2. **使用 `useEffect`** - 管理定时器生命周期
3. **清理旧定时器** - 在设置新定时器前清理旧的
4. **卸载时清理** - 组件卸载时清除定时器
5. **依赖项追踪** - 监听 `layoutName`, `themeQuery`, `isDefaultTheme` 变化

---

## 🚀 回滚步骤

如需回滚此修复，请执行以下操作：

### 方式一：手动回滚

```bash
# 1. 打开文件
themes/theme.js

# 2. 删除导入
- import { useEffect, useRef } from 'react'

# 3. 恢复 useLayoutByTheme 函数为原始版本
# （参考下方的原始代码）
```

### 方式二：Git 回滚

```bash
# 查看提交历史
git log --oneline

# 回滚到修复前的提交
git revert <commit-hash>
```

### 原始代码（修复前）

```javascript
export const useLayoutByTheme = ({ layoutName, theme }) => {
  const LayoutComponents =
    ThemeComponents[layoutName] || ThemeComponents.LayoutSlug

  const router = useRouter()
  const themeQuery = getQueryParam(router?.asPath, 'theme') || theme
  const isDefaultTheme = !themeQuery || themeQuery === BLOG.THEME

  // 加载非当前默认主题
  if (!isDefaultTheme) {
    const loadThemeComponents = componentsSource => {
      const components =
        componentsSource[layoutName] || componentsSource.LayoutSlug
      setTimeout(fixThemeDOM, 500)
      return components
    }
    return dynamic(
      () => import(`@/themes/${themeQuery}`).then(m => loadThemeComponents(m)),
      { ssr: true }
    )
  }

  setTimeout(fixThemeDOM, 100)
  return LayoutComponents
}
```

---

## ✅ 验证修复

### 测试场景
1. 快速切换首页和文章页
2. 使用随机文章跳转
3. 浏览器返回/前进
4. 切换不同主题（如果有多主题）

### 预期结果
- 不再出现 `autoExport` 错误
- 页面切换流畅
- 主题 DOM 修复功能正常工作

---

## 📝 相关文档

- [AI 解释功能文档](./AI_EXPLANATION_FEATURE.md)
- [NotionNext 官方文档](https://github.com/tangly1024/NotionNext)

---

> 💡 **提示**: 此修复是 NotionNext 核心级别的修改，会影响所有主题。建议备份后再进行修改。
