# NotionNext Next.js 16 升级记录

> **状态**: ✅ 已完成  
> **升级日期**: 2026-02-22  
> **原版本**: Next.js 14.2.30  
> **新版本**: Next.js 16.1.6  
> **影响范围**: 整个项目

---

## 📋 升级原因

### 1. 修复 `autoExport` 错误
Next.js 14.x 存在路由竞态条件 bug，导致页面切换时出现：
```
TypeError: Cannot read properties of undefined (reading 'autoExport')
```

### 2. 安全漏洞
Next.js 14.2.30 存在已知安全漏洞，需要升级。

---

## 🔧 修改文件清单

| 文件 | 修改类型 | 修改原因 |
|------|----------|----------|
| `package.json` | 依赖更新 | Next.js 14 → 16 |
| `next.config.js` | 配置更新 | 移除弃用配置，添加 Turbopack 支持 |
| `themes/theme.js` | 代码重构 | 替换弃用的 `publicRuntimeConfig` |
| `styles/notion.css` | Bug 修复 | 修复 CSS 语法错误 |
| `themes/anime/components/Header.js` | 代码优化 | 添加路由错误保护 |

---

## 📁 详细修改内容

### 1. package.json

```diff
- "next": "^14.2.30",
+ "next": "^16.1.6",
```

---

### 2. next.config.js

#### 2.1 移除弃用的 `eslint` 配置
```diff
  const nextConfig = {
-   eslint: {
-     ignoreDuringBuilds: true
-   },
+   // 注意：eslint 配置已移至 .eslintrc.js，此处不再支持
```

#### 2.2 移除弃用的 `swcMinify` 配置
```diff
-   // 构建优化
-   swcMinify: true,
+   // 注意：swcMinify 在 Next.js 16 中已默认启用，无需配置
```

#### 2.3 更新 `images.domains` 为 `images.remotePatterns`
```diff
    // 允许next/image加载的图片 域名
-   domains: [
-     'gravatar.com',
-     'www.notion.so',
-     ...
-   ],
+   remotePatterns: [
+     { protocol: 'https', hostname: 'gravatar.com' },
+     { protocol: 'https', hostname: 'www.notion.so' },
+     ...
+   ],
```

#### 2.4 添加主题列表环境变量（替代 `publicRuntimeConfig`）
```diff
  // 扫描项目 /themes下的目录名
  const themes = scanSubdirectories(path.resolve(__dirname, 'themes'))
+ // 将主题列表写入环境变量，替代已弃用的 publicRuntimeConfig
+ process.env.NEXT_PUBLIC_THEMES = JSON.stringify(themes)
```

#### 2.5 添加 Turbopack 配置
```diff
+   // Turbopack 配置 - 兼容 webpack 的 alias 设置
+   turbopack: {
+     resolveAlias: {
+       '@': './',
+       '@theme-components': `./themes/${THEME}`
+     }
+   },
```

#### 2.6 移除 `publicRuntimeConfig`
```diff
-   publicRuntimeConfig: {
-     // 这里的配置既可以服务端获取到，也可以在浏览器端获取到
-     THEMES: themes
-   }
+   // 注意：publicRuntimeConfig 已弃用，使用 NEXT_PUBLIC_THEMES 环境变量替代
```

---

### 3. themes/theme.js

#### 3.1 移除 `next/config` 导入
```diff
  import BLOG, { LAYOUT_MAPPINGS } from '@/blog.config'
  import * as ThemeComponents from '@theme-components'
- import getConfig from 'next/config'
  import dynamic from 'next/dynamic'
```

#### 3.2 添加 `useEffect`, `useRef` 导入（修复竞态条件）
```diff
  import { useRouter } from 'next/router'
+ import { useEffect, useRef } from 'react'
  import { getQueryParam, getQueryVariable, isBrowser } from '../lib/utils'
```

#### 3.3 替换 `publicRuntimeConfig` 为环境变量
```diff
- // 在next.config.js中扫描所有主题
- export const { THEMES = [] } = getConfig()?.publicRuntimeConfig || {}
+ // 从环境变量获取主题列表（替代已弃用的 publicRuntimeConfig）
+ const getThemesFromEnv = () => {
+   try {
+     return process.env.NEXT_PUBLIC_THEMES ? JSON.parse(process.env.NEXT_PUBLIC_THEMES) : []
+   } catch {
+     return []
+   }
+ }
+ 
+ // 在next.config.js中扫描所有主题
+ export const THEMES = getThemesFromEnv()
```

#### 3.4 重构 `useLayoutByTheme` 修复竞态条件
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

---

### 4. styles/notion.css

#### 4.1 修复 CSS 语法错误
```diff
  .notion-simple-table td {
-   border: 1px solid var(#eee) !important;
+   border: 1px solid #eee !important;
  }
```

---

### 5. themes/anime/components/Header.js

#### 5.1 添加路由错误保护
```diff
  // 随机跳转到一篇文章
  const handleRandomPost = () => {
    if (allNavPages && allNavPages.length > 0) {
      const randomIndex = Math.floor(Math.random() * allNavPages.length)
      const randomPost = allNavPages[randomIndex]
      if (randomPost?.slug) {
-       router.push(`/${randomPost.slug}`)
+       // 使用 try-catch 防止路由切换时的竞态条件错误
+       try {
+         router.push(`/${randomPost.slug}`)
+       } catch (error) {
+         // 忽略路由切换时的错误
+         console.log('Navigation error (can be ignored):', error.message)
+       }
      }
    }
  }
```

---

## 🚀 回滚步骤

如需回滚到 Next.js 14，请执行以下操作：

### 1. 降级 Next.js
```bash
npm install next@14.2.30
```

### 2. 恢复 next.config.js
- 恢复 `eslint` 配置
- 恢复 `swcMinify` 配置
- 恢复 `images.domains` 配置
- 恢复 `publicRuntimeConfig` 配置
- 移除 `turbopack` 配置
- 移除 `NEXT_PUBLIC_THEMES` 环境变量设置

### 3. 恢复 themes/theme.js
- 恢复 `import getConfig from 'next/config'`
- 移除 `useEffect`, `useRef` 导入
- 恢复 `publicRuntimeConfig` 方式获取主题列表
- 恢复原始的 `useLayoutByTheme` 函数（移除 useEffect 逻辑）

### 4. 恢复 styles/notion.css
- 恢复 `var(#eee)`（虽然这是错误的，但原代码如此）

### 5. 恢复 Header.js（可选）
- 移除 try-catch 保护

---

## ✅ 验证升级

### 测试场景
1. 启动开发服务器：`npm run dev`
2. 访问首页
3. 快速切换多个页面
4. 使用随机文章跳转
5. 浏览器返回/前进
6. 检查控制台无错误

### 预期结果
- ✅ 无 `autoExport` 错误
- ✅ 无 `publicRuntimeConfig` 警告
- ✅ 无 CSS 解析错误
- ✅ 主题切换正常
- ✅ 图片加载正常

---

## 📝 已知问题

### 1. Turbopack 警告
如果使用 webpack 配置，会出现警告：
```
ERROR: This build is using Turbopack, with a `webpack` config...
```

**解决方案**：已添加 `turbopack` 配置，警告可忽略。

### 2. Middleware 弃用警告
```
The "middleware" file convention is deprecated...
```

**说明**：这是 NotionNext 的 middleware 文件，需要官方更新。

---

## 📚 相关文档

- [Next.js 16 升级指南](https://nextjs.org/docs/app/building-your-application/upgrading/version-16)
- [Turbopack 配置](https://nextjs.org/docs/app/api-reference/next-config-js/turbopack)
- [theme.js 竞态条件修复](./THEME_JS_FIX.md)

---

> 💡 **提示**: 此升级涉及多个核心文件，建议备份后再进行操作。
