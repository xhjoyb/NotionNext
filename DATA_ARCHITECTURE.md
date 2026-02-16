# NotionNext 数据源架构详解

## 核心数据流

```
Notion Database → notion-client → SiteDataApi.js → 缓存层 → 主题组件 → 页面渲染
```

---

## 1. Notion API 交互层

### 1.1 核心 API 封装 (`lib/db/notion/getNotionAPI.js`)

```javascript
import { NotionAPI as NotionLibrary } from 'notion-client'

const notion = new NotionLibrary({
  apiBaseUrl: 'https://www.notion.so/api/v3',  // API 基础地址
  activeUser: BLOG.NOTION_ACTIVE_USER,          // 活跃用户ID
  authToken: BLOG.NOTION_TOKEN_V2,              // 认证Token
  userTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
})

// 暴露的方法
notionAPI.getPage(id)      // 获取页面及所有子块
notionAPI.getBlocks(ids)   // 批量获取块数据
notionAPI.getUsers(ids)    // 获取用户信息
```

### 1.2 请求重试机制 (`lib/db/notion/getPostBlocks.js`)

```javascript
// 失败自动重试，最多3次
async function getPageWithRetry(id, from, retryAttempts = 3) {
  try {
    const pageData = await notionAPI.getPage(id)
    return pageData
  } catch (e) {
    await delay(1000)  // 延迟1秒后重试
    return await getPageWithRetry(id, from, retryAttempts - 1)
  }
}
```

### 1.3 批量获取优化

```javascript
// 当数据库文章过多时，部分block会被丢弃
// 需要根据pageId批量抓取缺失的block
export const fetchInBatches = async (ids, batchSize = 100) => {
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    const pageChunk = await notionAPI.getBlocks(batch)
    // 合并结果
  }
}
```

---

## 2. 缓存层架构 (`lib/cache/cache_manager.js`)

### 2.1 三级缓存策略

```javascript
// 缓存优先级：Redis > 文件缓存 > 内存缓存
function getApi() {
  if (BLOG.REDIS_URL) {
    return RedisCache      // 生产环境推荐
  } else if (process.env.ENABLE_FILE_CACHE) {
    return FileCache       // 本地开发
  } else {
    return MemoryCache     // 默认内存缓存
  }
}
```

### 2.2 缓存读写流程

```javascript
// 统一缓存读写接口
async function getOrSetDataWithCache(key, getDataFunction) {
  // 1. 尝试从缓存读取
  const dataFromCache = await getDataFromCache(key)
  if (dataFromCache) return dataFromCache
  
  // 2. 缓存未命中，调用API获取
  const data = await getDataFunction()
  
  // 3. 写入缓存
  await setDataToCache(key, data)
  
  return data
}
```

### 2.3 缓存 Key 规则

| Key 格式 | 说明 |
|----------|------|
| `site_data_{pageId}` | 站点全局数据 |
| `page_content_{id}` | 页面内容块 |
| `page_block_{id}` | 单个块数据 |
| `ai_summary_{postId}` | AI 摘要缓存 |

---

## 3. 数据转换层

### 3.1 Notion 数据规范化 (`lib/db/notion/normalizeUtil.js`)

Notion API 返回的数据格式可能因版本变化，需要统一规范化：

```javascript
// 规范化 Notion 元数据
function normalizeNotionMetadata(block, pageId) {
  const rawValue = block?.[pageId]?.value
  return rawValue.type ? rawValue : rawValue.value ?? null
}

// 规范化 Collection（数据库）
function normalizeCollection(collection) {
  // 新版 Notion 会用 space_id 包裹一层
  // 统一返回包含 schema 的那一层
  let current = collection
  while (!current.schema && current.value) {
    current = current.value
  }
  return current ?? {}
}

// 规范化页面块
function normalizePageBlock(blockItem) {
  // 兼容新老结构，返回 { id, type, properties }
}
```

### 3.2 页面属性解析 (`lib/db/notion/getPageProperties.js`)

```javascript
async function getPageProperties(id, value, schema, authToken, tagOptions) {
  const properties = {}
  
  // 解析不同类型的属性
  for (const [key, val] of Object.entries(value?.properties || [])) {
    switch (schema[key]?.type) {
      case 'title':
        properties.title = getTextContent(val)
        break
      case 'date':
        properties.date = getDateValue(val)
        break
      case 'select':
      case 'multi_select':
        properties.tags = getTextContent(val).split(',')
        break
      case 'person':
        properties.authors = await fetchUsers(val)
        break
      default:
        properties[schema[key].name] = getTextContent(val)
    }
  }
  
  // 附加计算属性
  properties.publishDate = new Date(properties.date.start_date).getTime()
  properties.pageCover = mapImgUrl(value.format?.page_cover)
  properties.pageIcon = mapImgUrl(value.format?.page_icon)
  
  return properties
}
```

### 3.3 类型映射

```javascript
// 用户自定义类型映射到系统类型
const typeMap = {
  '博文': 'Post',
  '单页': 'Page',
  '公告': 'Notice',
  '菜单': 'Menu',
  '子菜单': 'SubMenu'
}

const statusMap = {
  '发布': 'Published',
  '隐藏': 'Invisible'
}
```

---

## 4. 主要数据类型详解

### 4.1 数据类型 (type 字段)

| 类型 | 字段值 | 说明 | 渲染布局 |
|------|--------|------|----------|
| **Post** | `type: 'Post'` | 博客文章 | `LayoutSlug` / `LayoutPostList` |
| **Page** | `type: 'Page'` | 独立页面 | `LayoutSlug` |
| **Menu** | `type: 'Menu'` | 导航菜单 | Header 导航栏 |
| **SubMenu** | `type: 'SubMenu'` | 子菜单 | 下拉菜单项 |
| **Notice** | `type: 'Notice'` | 公告 | 公告组件 |
| **CONFIG** | `type: 'CONFIG'` | 配置页 | 不渲染，仅读取配置 |

### 4.2 文章状态 (status 字段)

| 状态 | 说明 | 列表显示 | URL访问 |
|------|------|----------|---------|
| `Published` | 已发布 | ✅ 显示 | ✅ 可访问 |
| `Invisible` | 隐藏 | ❌ 不显示 | ✅ 可访问 |

### 4.3 核心数据结构

```javascript
// 文章/页面完整数据结构
{
  // 基础信息
  id: 'uuid-xxxx',
  title: '文章标题',
  slug: 'article-slug',
  summary: '文章摘要',
  
  // 分类标签
  category: '技术',
  tags: ['React', 'Next.js'],
  tagItems: [{ name: 'React', color: 'blue' }],
  
  // 时间相关
  date: {
    start_date: '2024-01-15',
    start_time: '10:30',
    end_date: null,      // 定时下架
    end_time: null,
    time_zone: 'Asia/Shanghai'
  },
  publishDate: 1705286400000,
  publishDay: '2024-01-15',
  lastEditedDate: Date,
  lastEditedDay: '2024-01-16',
  
  // 媒体资源
  pageCover: 'https://...',
  pageCoverThumbnail: 'https://...',
  pageIcon: '📝',
  
  // 状态控制
  type: 'Post',
  status: 'Published',
  password: 'md5hash',    // 加密文章
  fullWidth: false,       // 全宽布局
  
  // 内容相关
  blockMap: {...},        // Notion 块数据
  content: [...],         // 内容块ID列表
  toc: [...],            // 目录结构
  wordCount: 1500,        // 字数统计
  readTime: 5,            // 阅读时长(分钟)
  
  // 扩展字段
  ext: { customField: 'value' },
  comment: '开启'
}
```

---

## 5. 全局数据 (props) 详解

### 5.1 LayoutBase 接收的完整 props

```javascript
const LayoutBase = props => {
  const {
    // ===== 核心数据 =====
    allPages,        // 所有页面（文章+单页+菜单）
    allNavPages,     // 导航页面（用于搜索建议）
    
    // ===== 分类标签 =====
    categoryOptions, // 分类列表
    // [{ id, name: '技术', color: 'blue', count: 15 }]
    
    tagOptions,      // 标签列表
    // [{ id, name: 'React', color: 'red', count: 8, source: 'Published' }]
    
    // ===== 文章相关 =====
    post,            // 当前文章详情（LayoutSlug）
    posts,           // 文章列表（LayoutPostList）
    recommendPosts,  // 推荐文章（基于标签关联）
    latestPosts,     // 最新文章（按编辑时间）
    archivePosts,    // 归档数据
    // { '2024-01': [post1, post2], '2024-02': [post3] }
    
    prev,            // 上一篇文章
    next,            // 下一篇文章
    
    // ===== 站点信息 =====
    siteInfo: {
      title: '站点标题',
      description: '站点描述',
      icon: 'https://.../avatar.png',
      pageCover: 'https://.../cover.jpg',
      author: '作者名'
    },
    
    notice,          // 公告内容
    NOTION_CONFIG,   // Notion 配置表数据
    
    // ===== 菜单导航 =====
    customNav,       // 旧版导航（Page类型生成）
    customMenu,      // 新版菜单（Menu类型生成）
    // [{ name, href, icon, target, subMenus: [...] }]
    
    // ===== 分页 =====
    page,            // 当前页码
    totalPage,       // 总页数
    
    // ===== 搜索 =====
    keyword,         // 搜索关键词
    
    // ===== 其他 =====
    locale,          // 多语言字典
    tags,            // 当前文章的标签
    categories       // 当前文章的分类
  } = props
}
```

### 5.2 数据过滤示例

```javascript
// 获取已发布的文章
const publishedPosts = allPages?.filter(
  page => page.type === 'Post' && page.status === 'Published'
)

// 获取独立页面
const pages = allPages?.filter(
  page => page.type === 'Page' && page.status === 'Published'
)

// 获取菜单
const menus = allPages?.filter(
  page => page.type === 'Menu' && page.status === 'Published'
)
```

---

## 6. 配置系统详解

### 6.1 配置优先级（从高到低）

```
1. Notion CONFIG 表  →  最高优先级，可覆盖所有配置
2. Vercel 环境变量   →  NEXT_PUBLIC_XXX
3. blog.config.js    →  根配置文件
4. conf/*.config.js  →  分类配置文件
5. 主题 config.js    →  themes/anime/config.js
```

### 6.2 Notion 配置表结构

在 Notion 中创建 `type: CONFIG` 页面，内嵌表格：

| 配置名 | 配置值 | 启用 |
|--------|--------|------|
| TITLE | 我的博客 | Yes |
| THEME | anime | Yes |
| POSTS_PER_PAGE | 12 | Yes |

### 6.3 读取配置

```javascript
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

// 读取配置，支持多级回退
const value = siteConfig('KEY', defaultValue, CONFIG)
```

### 6.4 关键配置项

```javascript
// blog.config.js 核心配置
{
  NOTION_PAGE_ID: 'xxx,en:xxx,photos:xxx',  // 多语言/多数据源
  THEME: 'anime',
  LANG: 'zh-CN',
  SINCE: 2024,
  
  // 作者信息
  AUTHOR: '作者名',
  BIO: '个人简介',
  LINK: 'https://your-site.com',
  
  // 文章设置
  POSTS_PER_PAGE: 12,
  POST_URL_PREFIX: 'article',
  POSTS_SORT_BY: 'date',
  
  // 外观
  APPEARANCE: 'auto',  // light/dark/auto
  APPEARANCE_DARK_TIME: [18, 6],  // 夜间模式时段
}

// conf/contact.config.js 社交链接
{
  CONTACT_GITHUB: 'https://github.com/xxx',
  CONTACT_TWITTER: 'https://twitter.com/xxx',
  CONTACT_EMAIL: 'mail@example.com',
  CONTACT_BILIBILI: 'https://space.bilibili.com/xxx',
  // ...
}

// conf/notion.config.js Notion字段映射
{
  NOTION_PROPERTY_NAME: {
    type: 'type',
    title: 'title',
    status: 'status',
    category: 'category',
    tags: 'tags',
    slug: 'slug',
    date: 'date',
    // 可自定义中文字段名
  }
}
```

---

## 7. 路由系统详解

### 7.1 路由映射 (`conf/layout-map.config.js`)

```javascript
LAYOUT_MAPPINGS: {
  '-1': 'LayoutBase',                        // 基础布局
  '/': 'LayoutIndex',                        // 首页
  '/archive': 'LayoutArchive',               // 归档页
  '/page/[page]': 'LayoutPostList',          // 分页列表
  '/category/[category]': 'LayoutPostList',  // 分类列表
  '/category/[category]/page/[page]': 'LayoutPostList',
  '/tag/[tag]': 'LayoutPostList',            // 标签列表
  '/tag/[tag]/page/[page]': 'LayoutPostList',
  '/search': 'LayoutSearch',                 // 搜索页
  '/search/[keyword]': 'LayoutSearch',
  '/search/[keyword]/page/[page]': 'LayoutSearch',
  '/tag': 'LayoutTagIndex',                  // 标签索引
  '/category': 'LayoutCategoryIndex',        // 分类索引
  '/[prefix]': 'LayoutSlug',                 // 文章/单页
  '/[prefix]/[slug]': 'LayoutSlug',          // 二级路径
  '/[prefix]/[slug]/[...suffix]': 'LayoutSlug',
  '/404': 'Layout404',
}
```

### 7.2 URL 生成规则

```javascript
// 文章URL前缀配置
POST_URL_PREFIX: 'article'  // /article/[slug]
POST_URL_PREFIX: ''         // /[slug]
POST_URL_PREFIX: '%year%/%month%/%day%'  // /2024/01/15/[slug]
POST_URL_PREFIX: '%category%'  // /技术/[slug]

// 伪静态
PSEUDO_STATIC: true  // /article/[slug].html
```

### 7.3 多语言/多数据源路由

```javascript
// blog.config.js
NOTION_PAGE_ID: 'mainId,en:enId,photos:photosId'

// 访问路径
/           → 主数据源
/en         → 英文数据源
/photos     → 相册数据源
```

---

## 8. 图片处理系统 (`lib/db/notion/mapImage.js`)

### 8.1 图片URL映射

```javascript
// Notion 图片处理
function mapImgUrl(img, block, type = 'block') {
  // 1. 相对路径 → Notion 图床
  if (img.startsWith('/')) {
    return BLOG.NOTION_HOST + img
  }
  
  // 2. AWS 图床 → Notion 代理
  if (img.includes('amazonaws.com') || img.includes('prod-files-secure')) {
    return `${BLOG.NOTION_HOST}/image/${encodeURIComponent(img)}?table=${type}&id=${block.id}`
  }
  
  // 3. 外链图片 → 原样返回
  return img
}
```

### 8.2 图片压缩

```javascript
function compressImage(image, width, quality = 50, fmt = 'webp') {
  // Notion 图床
  if (image.includes('notion.so')) {
    params.set('width', width)
    params.set('cache', 'v2')
  }
  
  // Unsplash
  if (image.includes('unsplash.com')) {
    params.set('q', quality)
    params.set('width', width)
    params.set('fmt', fmt)
  }
  
  return newUrl.toString()
}
```

---

## 9. 目录生成 (`lib/db/notion/getPageTableOfContents.js`)

```javascript
// 从 Notion 块中提取标题生成目录
function getPageTableOfContents(page, recordMap) {
  const contents = page.content ?? []
  const toc = []
  
  for (const blockId of contents) {
    const block = recordMap.block[blockId]?.value
    
    if (block.type === 'header') {
      toc.push({
        id: blockId,
        type: 'header',
        text: getTextContent(block.properties?.title),
        indentLevel: 0  // H1
      })
    }
    if (block.type === 'sub_header') {
      toc.push({ ..., indentLevel: 1 })  // H2
    }
    if (block.type === 'sub_sub_header') {
      toc.push({ ..., indentLevel: 2 })  // H3
    }
  }
  
  return toc
}
```

---

## 10. 多语言系统 (`lib/utils/lang.js`)

### 10.1 支持的语言

```javascript
const LANGS = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
  'fr-FR': frFR,
  'tr-TR': trTR,
  'ja-JP': jaJP
}
```

### 10.2 语言字典结构

```javascript
// lib/lang/zh-CN.js
export default {
  NAV: {
    INDEX: '首页',
    ARCHIVE: '归档',
    CATEGORY: '分类',
    TAGS: '标签',
    SEARCH: '搜索',
    // ...
  },
  COMMON: {
    COPYRIGHT: '版权所有',
    ARTICLE_UNLOCK_TIPS: '文章已解锁',
    // ...
  },
  POST: {
    LAST_EDITED: '最后更新',
    READ_TIME: '阅读时长',
    // ...
  }
}

// 使用
const { locale } = useGlobal()
<h1>{locale.NAV.INDEX}</h1>
```

---

## 11. 内容渲染 (`components/NotionPage.js`)

### 11.1 Notion 块渲染

```javascript
import { NotionRenderer } from 'react-notion-x'

const NotionPage = ({ post }) => {
  return (
    <NotionRenderer
      recordMap={post.blockMap}
      fullPage={false}
      darkMode={isDarkMode}
      // 自定义组件映射
      components={{
        // 代码高亮
        Code: CustomCode,
        // 图片放大
        Image: CustomImage,
        // 数学公式
        Equation: CustomEquation,
      }}
    />
  )
}
```

### 11.2 支持的块类型

| Notion 块类型 | 渲染组件 |
|--------------|----------|
| text | 段落 |
| header/sub_header/sub_sub_header | H1/H2/H3 |
| bulleted_list/numbered_list | 列表 |
| to_do | 待办事项 |
| toggle | 折叠块 |
| code | 代码块 |
| image | 图片 |
| video | 视频 |
| audio | 音频 |
| file | 文件 |
| bookmark | 书签 |
| embed | 嵌入 |
| callout | 提示框 |
| quote | 引用 |
| divider | 分割线 |
| table | 表格 |
| column_list/column | 多列布局 |
| collection_view | 数据库视图 |

---

## 12. 主题开发最佳实践

### 12.1 读取配置

```javascript
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'

// 带默认值和主题配置的读取
const value = siteConfig('ANIME_CUSTOM_KEY', 'defaultValue', CONFIG)
```

### 12.2 使用全局状态

```javascript
import { useGlobal } from '@/lib/global'

const MyComponent = () => {
  const {
    locale,        // 多语言字典
    isDarkMode,    // 深色模式
    onLoading,     // 加载状态
    fullWidth,     // 全宽布局
    NOTION_CONFIG, // Notion配置
    THEME_CONFIG,  // 主题配置
    toggleDarkMode,// 切换深色模式
    switchTheme    // 切换主题
  } = useGlobal()
  
  return <div>{locale.NAV.INDEX}</div>
}
```

### 12.3 数据安全检查

```javascript
// 数组检查
{posts?.map(post => <Card key={post.id} post={post} />)}

// 条件渲染
{categoryOptions && categoryOptions.length > 0 && (
  <CategoryList categories={categoryOptions} />
)}

// 空状态处理
{(!posts || posts.length === 0) && (
  <EmptyState message="暂无文章" />
)}
```

### 12.4 链接处理

```javascript
import SmartLink from '@/components/SmartLink'

// 自动处理内外链
<SmartLink href={`/tag/${encodeURIComponent(tag)}`}>
  #{tag}
</SmartLink>

// 外链处理
<SmartLink href="https://example.com" target="_blank">
  外部链接
</SmartLink>
```

### 12.5 图片优化

```javascript
import LazyImage from '@/components/LazyImage'

<LazyImage
  src={post.pageCoverThumbnail}
  className='w-full h-48 object-cover'
  alt={post.title}
/>
```

---

## 13. 关键文件路径索引

| 文件路径 | 功能说明 |
|----------|----------|
| `lib/db/SiteDataApi.js` | 核心数据获取 API |
| `lib/db/notion/getNotionAPI.js` | Notion API 封装 |
| `lib/db/notion/getPostBlocks.js` | 页面块获取与格式化 |
| `lib/db/notion/getPageProperties.js` | 页面属性解析 |
| `lib/db/notion/getNotionConfig.js` | 配置表读取 |
| `lib/db/notion/getAllPageIds.js` | 获取所有页面ID |
| `lib/db/notion/getAllTags.js` | 标签统计 |
| `lib/db/notion/getAllCategories.js` | 分类统计 |
| `lib/db/notion/mapImage.js` | 图片URL映射与压缩 |
| `lib/db/notion/normalizeUtil.js` | 数据规范化工具 |
| `lib/db/notion/getPageTableOfContents.js` | 目录生成 |
| `lib/cache/cache_manager.js` | 缓存管理 |
| `lib/global.js` | 全局状态管理 |
| `lib/config.js` | 配置工具函数 |
| `lib/utils/post.js` | 文章处理工具 |
| `lib/utils/lang.js` | 多语言工具 |
| `themes/theme.js` | 主题加载逻辑 |
| `conf/layout-map.config.js` | 路由映射配置 |
| `conf/notion.config.js` | Notion 字段映射 |
| `conf/contact.config.js` | 社交链接配置 |
| `conf/post.config.js` | 文章相关配置 |
| `components/NotionPage.js` | Notion 内容渲染 |
| `components/SmartLink.js` | 智能链接组件 |
| `components/LazyImage.js` | 懒加载图片 |

---

## 14. Anime 主题组件清单

### 14.1 布局组件

| 组件 | 文件 | 功能 | 状态 |
|------|------|------|------|
| LayoutBase | `index.js` | 基础布局 | ✅ |
| LayoutIndex | `index.js` | 首页布局 | ✅ |
| LayoutPostList | `index.js` | 文章列表布局 | ✅ |
| LayoutSearch | `index.js` | 搜索结果布局 | ✅ |
| LayoutArchive | `index.js` | 归档页面布局 | ✅ |
| LayoutSlug | `index.js` | 文章详情布局 | ✅ |
| LayoutCategoryIndex | `index.js` | 分类索引布局 | ✅ |
| LayoutTagIndex | `index.js` | 标签索引布局 | ✅ |
| LayoutMusic | `index.js` | 音乐页面布局 | ✅ |
| Layout404 | `index.js` | 404 页面布局 | ✅ |

### 14.2 UI 组件

| 组件 | 文件 | 功能 | 状态 |
|------|------|------|------|
| Header | `Header.js` | 导航栏（含夜间模式切换、呼吸动画按钮） | ✅ |
| Footer | `Footer.js` | 页脚 | ✅ |
| Hero | `Hero.js` | 首页横幅 | ✅ |
| BlogPostCard | `BlogPostCard.js` | 文章卡片 | ✅ |
| SideRight | `SideRight.js` | 右侧边栏 | ✅ |
| Pagination | `Pagination.js` | 分页组件 | ✅ |
| SearchInput | `SearchInput.js` | 搜索框 | ✅ |
| Catalog | `Catalog.js` | 文章目录 | ✅ |
| ArticleLock | `ArticleLock.js` | 文章加密锁 | ✅ |
| Announcement | `Announcement.js` | 公告组件 | ✅ |
| BlogArchiveItem | `BlogArchiveItem.js` | 归档列表项 | ✅ |
| SocialButton | `SocialButton.js` | 社交按钮 | ✅ |
| ContactCard | `ContactCard.js` | 联系卡片（翻转效果） | ✅ |
| MusicPlayer | `MusicPlayer.js` | 音乐播放器 | ✅ |
| LyricsDisplay | `LyricsDisplay.js` | 歌词显示组件 | ✅ |

### 14.3 特效组件

| 组件 | 文件 | 功能 | 状态 |
|------|------|------|------|
| SakuraEffect | `index.js` | 樱花飘落效果 | ✅ |
| CardConnectionLine | `CardConnectionLine.js` | 卡片网格火车动画（可配置） | ✅ |

---

## 15. 已实现功能清单

### 15.1 核心功能
- ✅ 响应式布局（移动端适配）
- ✅ 夜间/日间模式切换（平滑过渡动画）
- ✅ 文章列表分页
- ✅ 文章搜索功能
- ✅ 分类/标签筛选
- ✅ 文章归档
- ✅ 文章目录（TOC）
- ✅ 文章加密访问
- ✅ 相关文章推荐
- ✅ 社交分享
- ✅ 评论系统集成

### 15.2 视觉效果
- ✅ 樱花飘落动画（可开关）
- ✅ 卡片网格火车动画（鼠标悬停连接线效果，可配置）
- ✅ 毛玻璃效果（anime-glass）
- ✅ 渐变文字效果
- ✅ 卡片悬停动画（缩放、阴影）
- ✅ 呼吸动画按钮
- ✅ 平滑过渡动画（夜间模式切换）
- ✅ 页面加载动画（anime-slide-up）
- ✅ 浮动动画（anime-float）

### 15.3 音乐功能
- ✅ 音乐播放器页面
- ✅ 歌词同步显示
- ✅ 播放列表管理

---

## 16. 待实现功能（Anime 主题专属）

> 注：以下列表仅包含 Anime 主题**尚未实现**的功能。NotionNext 全局功能（如友情链接、RSS等）在主题中可直接使用，无需重复开发。

| 功能 | 优先级 | 说明 | 建议实现方式 |
|------|--------|------|-------------|
| 返回顶部组件 | 中 | 悬浮按钮，点击平滑滚动到顶部 | 创建 `BackToTop.js` 组件，监听滚动位置 |
| 阅读进度条 | 中 | 文章页面顶部显示阅读进度 | 在 `LayoutSlug` 中添加 `ReadingProgress` 组件 |
| 文章字数统计 | 低 | 文章详情页显示字数和预计阅读时间 | 在 `LayoutSlug` 头部添加统计信息展示 |
| 图片灯箱效果 | 低 | 文章内图片点击放大查看 | 自定义 `NotionPage` 的 `Image` 组件，集成灯箱库 |
| 代码复制按钮 | 低 | 代码块右上角添加复制按钮 | 自定义 `NotionPage` 的 `Code` 组件 |
| 文章打赏功能 | 低 | 文章底部显示打赏二维码 | 创建 `Donate.js` 组件，配置微信/支付宝二维码 |
| 文章上下篇导航 | 低 | 文章底部显示上一篇/下一篇 | 在 `LayoutSlug` 底部添加 `PostNav` 组件 |
| 相册/图库布局优化 | 低 | 瀑布流图片展示效果优化 | 针对 Gallery 类型页面自定义样式 |
| 性能优化 | 低 | 图片懒加载、组件动态导入 | 优化 `LazyImage` 使用，添加 `next/dynamic` |

---

## 17. NotionNext 全局功能说明

以下功能由 NotionNext 核心提供，Anime 主题**无需额外开发**，可直接使用：

| 功能 | 说明 | 配置方式 |
|------|------|----------|
| 友情链接 | 通过 Notion 创建 Friend 类型页面管理友链 | 在 Notion 中创建 `type: Friend` 页面 |
| RSS 订阅 | 自动生成 RSS Feed | 访问 `/feed` 或 `/rss` 路径 |
| PWA 支持 | 离线访问、添加到主屏 | 配置 `PWA_ENABLE: true` |
| 多语言 | 支持多种语言切换 | 配置 `LANG` 和 `NOTION_PAGE_ID` 多语言映射 |
| 评论系统 | 支持多种评论插件 | 配置 `COMMENT_ENV` 等评论相关配置 |
| 搜索功能 | 全文搜索文章 | 已集成在 `LayoutSearch` |
| 图片压缩 | 自动压缩 Notion 图片 | 通过 `mapImage.js` 自动处理 |
| 缓存系统 | Redis/文件/内存三级缓存 | 配置 `REDIS_URL` 或 `ENABLE_FILE_CACHE` |
