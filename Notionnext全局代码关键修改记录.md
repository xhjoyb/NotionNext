# NotionNext 全局修改记录

## 功能：首页文章过滤（按标签/分类排除）

**修改日期**: 2025-02-21  
**修改目的**: 允许在首页文章列表中排除特定标签或分类的文章，仅在首页和分页生效，不影响 RSS、站点地图、分类页面等其他功能。

---

## 修改文件 1: conf/post.config.js

### 修改前
```javascript
  // 标签相关
  TAG_SORT_BY_COUNT: true, // 标签是否按照文章数量倒序排列，文章多的标签排在前。
  IS_TAG_COLOR_DISTINGUISHED:
    process.env.NEXT_PUBLIC_IS_TAG_COLOR_DISTINGUISHED === 'true' || true // 对于名称相同的tag是否区分tag的颜色
}
```

### 修改后
```javascript
  // 标签相关
  TAG_SORT_BY_COUNT: true, // 标签是否按照文章数量倒序排列，文章多的标签排在前。
  IS_TAG_COLOR_DISTINGUISHED:
    process.env.NEXT_PUBLIC_IS_TAG_COLOR_DISTINGUISHED === 'true' || true, // 对于名称相同的tag是否区分tag的颜色

  // 首页文章过滤配置
  // 用于排除特定标签或分类的文章不在首页显示
  POSTS_EXCLUDE_TAGS:
    process.env.NEXT_PUBLIC_POSTS_EXCLUDE_TAGS || '', // 逗号分隔的标签列表，如 'Hidden,Draft,Private'
  POSTS_EXCLUDE_CATEGORIES:
    process.env.NEXT_PUBLIC_POSTS_EXCLUDE_CATEGORIES || '' // 逗号分隔的分类列表，如 'Hidden,Test'
}
```

### 说明
- 添加两个配置项用于指定要排除的标签和分类
- 支持环境变量配置或直接在配置文件中修改
- 多个值使用逗号分隔

---

## 修改文件 2: pages/index.js

### 修改前（完整文件）
```javascript
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { generateRobotsTxt } from '@/lib/utils/robots.txt'
import { generateRss } from '@/lib/utils/rss'
import { generateSitemapXml } from '@/lib/utils/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/utils/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await fetchGlobalAllData({ from, locale })
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )
  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  // 生成robotTxt
  generateRobotsTxt(props)
  // 生成Feed订阅
  generateRss(props)
  // 生成
  generateSitemapXml(props)
  // 检查数据是否需要从algolia删除
  checkDataFromAlgolia(props)
  if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
    // 生成重定向 JSON
    generateRedirectJson(props)
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Index
```

### 修改后（完整文件）
```javascript
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { generateRobotsTxt } from '@/lib/utils/robots.txt'
import { generateRss } from '@/lib/utils/rss'
import { generateSitemapXml } from '@/lib/utils/sitemap.xml'
import { DynamicLayout } from '@/themes/theme'
import { generateRedirectJson } from '@/lib/utils/redirect'
import { checkDataFromAlgolia } from '@/lib/plugins/algolia'

/**
 * 首页布局
 * @param {*} props
 * @returns
 */
const Index = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutIndex' {...props} />
}

/**
 * SSG 获取数据
 * @returns
 */
export async function getStaticProps(req) {
  const { locale } = req
  const from = 'index'
  const props = await fetchGlobalAllData({ from, locale })
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )
  // 获取排除配置
  const excludeTags = siteConfig('POSTS_EXCLUDE_TAGS', '', props?.NOTION_CONFIG)
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean)
  const excludeCategories = siteConfig('POSTS_EXCLUDE_CATEGORIES', '', props?.NOTION_CONFIG)
    .split(',')
    .map(cat => cat.trim().toLowerCase())
    .filter(Boolean)

  // 检查文章是否应该被排除
  const shouldExcludePost = (post) => {
    // 检查标签
    if (excludeTags.length > 0 && post?.tags) {
      const postTags = post.tags.map(tag => tag.toLowerCase())
      if (excludeTags.some(tag => postTags.includes(tag))) {
        return true
      }
    }
    // 检查分类
    if (excludeCategories.length > 0 && post?.category) {
      if (excludeCategories.includes(post.category.toLowerCase())) {
        return true
      }
    }
    return false
  }

  props.posts = props.allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published' && !shouldExcludePost(page)
  )

  // 更新 postCount 为过滤后的数量
  props.postCount = props.posts.length

  // 处理分页
  if (siteConfig('POST_LIST_STYLE') === 'scroll') {
    // 滚动列表默认给前端返回所有数据
  } else if (siteConfig('POST_LIST_STYLE') === 'page') {
    props.posts = props.posts?.slice(
      0,
      siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
    )
  }

  // 预览文章内容
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  // 生成robotTxt
  generateRobotsTxt(props)
  // 生成Feed订阅
  generateRss(props)
  // 生成
  generateSitemapXml(props)
  // 检查数据是否需要从algolia删除
  checkDataFromAlgolia(props)
  if (siteConfig('UUID_REDIRECT', false, props?.NOTION_CONFIG)) {
    // 生成重定向 JSON
    generateRedirectJson(props)
  }

  // 生成全文索引 - 仅在 yarn build 时执行 && process.env.npm_lifecycle_event === 'build'

  delete props.allPages

  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Index
```

### 说明
- 添加文章过滤逻辑，排除指定标签或分类的文章
- 更新 `postCount` 为过滤后的数量，确保分页控件显示正确
- 仅在首页数据获取时过滤文章

---

## 修改文件 3: pages/page/[page].js

### 修改前（完整文件）
```javascript
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

/**
 * 文章列表分页
 * @param {*} props
 * @returns
 */
const Page = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticPaths({ locale }) {
  const from = 'page-paths'
  const { postCount, NOTION_CONFIG } = await fetchGlobalAllData({ from, locale })
  const totalPages = Math.ceil(
    postCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  )
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params: { page }, locale }) {
  const from = `page-${page}`
  const props = await fetchGlobalAllData({ from, locale })
  const { allPages } = props
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )

  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published'
  )
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
  // 处理分页
  props.posts = allPosts.slice(
    POSTS_PER_PAGE * (page - 1),
    POSTS_PER_PAGE * page
  )
  props.page = page

  // 处理预览
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  delete props.allPages
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Page
```

### 修改后（完整文件）
```javascript
import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, getPostBlocks } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

/**
 * 文章列表分页
 * @param {*} props
 * @returns
 */
const Page = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutPostList' {...props} />
}

export async function getStaticPaths({ locale }) {
  const from = 'page-paths'
  const { allPages, NOTION_CONFIG } = await fetchGlobalAllData({ from, locale })

  // 获取排除配置
  const excludeTags = siteConfig('POSTS_EXCLUDE_TAGS', '', NOTION_CONFIG)
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean)
  const excludeCategories = siteConfig('POSTS_EXCLUDE_CATEGORIES', '', NOTION_CONFIG)
    .split(',')
    .map(cat => cat.trim().toLowerCase())
    .filter(Boolean)

  // 检查文章是否应该被排除
  const shouldExcludePost = (post) => {
    if (excludeTags.length > 0 && post?.tags) {
      const postTags = post.tags.map(tag => tag.toLowerCase())
      if (excludeTags.some(tag => postTags.includes(tag))) {
        return true
      }
    }
    if (excludeCategories.length > 0 && post?.category) {
      if (excludeCategories.includes(post.category.toLowerCase())) {
        return true
      }
    }
    return false
  }

  // 计算过滤后的文章数
  const filteredPostCount = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published' && !shouldExcludePost(page)
  ).length || 0

  const totalPages = Math.ceil(
    filteredPostCount / siteConfig('POSTS_PER_PAGE', null, NOTION_CONFIG)
  )
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export async function getStaticProps({ params: { page }, locale }) {
  const from = `page-${page}`
  const props = await fetchGlobalAllData({ from, locale })
  const { allPages } = props
  const POST_PREVIEW_LINES = siteConfig(
    'POST_PREVIEW_LINES',
    12,
    props?.NOTION_CONFIG
  )

  // 获取排除配置
  const excludeTags = siteConfig('POSTS_EXCLUDE_TAGS', '', props?.NOTION_CONFIG)
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean)
  const excludeCategories = siteConfig('POSTS_EXCLUDE_CATEGORIES', '', props?.NOTION_CONFIG)
    .split(',')
    .map(cat => cat.trim().toLowerCase())
    .filter(Boolean)

  // 检查文章是否应该被排除
  const shouldExcludePost = (post) => {
    // 检查标签
    if (excludeTags.length > 0 && post?.tags) {
      const postTags = post.tags.map(tag => tag.toLowerCase())
      if (excludeTags.some(tag => postTags.includes(tag))) {
        return true
      }
    }
    // 检查分类
    if (excludeCategories.length > 0 && post?.category) {
      if (excludeCategories.includes(post.category.toLowerCase())) {
        return true
      }
    }
    return false
  }

  const allPosts = allPages?.filter(
    page => page.type === 'Post' && page.status === 'Published' && !shouldExcludePost(page)
  )
  const POSTS_PER_PAGE = siteConfig('POSTS_PER_PAGE', 12, props?.NOTION_CONFIG)
  // 处理分页
  props.posts = allPosts.slice(
    POSTS_PER_PAGE * (page - 1),
    POSTS_PER_PAGE * page
  )
  props.page = page

  // 更新 postCount 为过滤后的数量
  props.postCount = allPosts.length

  // 处理预览
  if (siteConfig('POST_LIST_PREVIEW', false, props?.NOTION_CONFIG)) {
    for (const i in props.posts) {
      const post = props.posts[i]
      if (post.password && post.password !== '') {
        continue
      }
      post.blockMap = await getPostBlocks(post.id, 'slug', POST_PREVIEW_LINES)
    }
  }

  delete props.allPages
  return {
    props,
    revalidate: process.env.EXPORT
      ? undefined
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          props.NOTION_CONFIG
        )
  }
}

export default Page
```

### 说明
- `getStaticPaths`: 使用过滤后的文章数计算总页数，确保分页路径正确生成
- `getStaticProps`: 过滤文章并更新 `postCount`，确保分页控件显示正确
- 与首页过滤逻辑保持一致

---

## 使用方法

### 在 Notion 中标记要排除的文章

**方式1 - 使用标签**:
1. 给文章添加标签，如 `Hidden`
2. 在配置中设置 `POSTS_EXCLUDE_TAGS: 'Hidden'`

**方式2 - 使用分类**:
1. 将文章分类设置为 `Hidden`
2. 在配置中设置 `POSTS_EXCLUDE_CATEGORIES: 'Hidden'`

### 配置示例

**示例1 - 排除单个标签**:
```javascript
POSTS_EXCLUDE_TAGS: 'Hidden'
```

**示例2 - 排除多个标签**:
```javascript
POSTS_EXCLUDE_TAGS: 'Hidden, Draft, Private'
```

**示例3 - 排除特定分类**:
```javascript
POSTS_EXCLUDE_CATEGORIES: 'Test, Archive'
```

**示例4 - 同时排除标签和分类**:
```javascript
POSTS_EXCLUDE_TAGS: 'Hidden',
POSTS_EXCLUDE_CATEGORIES: 'Archive'
```

### 环境变量配置

在 `.env.local` 或 Vercel 环境变量中设置:
```
NEXT_PUBLIC_POSTS_EXCLUDE_TAGS=Hidden,Draft
NEXT_PUBLIC_POSTS_EXCLUDE_CATEGORIES=Test
```

---

## 影响范围

被排除的文章将不会出现在：
- ✅ 首页文章列表 (`/`)
- ✅ 分页列表 (`/page/2`, `/page/3` 等)

但仍会正常出现在：
- ✅ RSS 订阅
- ✅ 站点地图 (sitemap.xml)
- ✅ 最新文章列表 (latestPosts)
- ✅ 文章总数统计（原始数据，不影响）
- ✅ 直接访问文章链接 `/article/[slug]`
- ✅ 分类页面 `/category/[category]`
- ✅ 标签页面 `/tag/[tag]`
- ✅ 搜索功能

---

## 注意事项

1. **大小写不敏感**: 标签和分类的匹配不区分大小写，`Hidden` 和 `hidden` 效果相同
2. **空格处理**: 配置中的空格会被自动去除
3. **空值处理**: 空字符串或只有空格的配置会被忽略
4. **多标签匹配**: 只要文章包含任一排除标签，就会被排除
5. **需要重新构建**: 修改配置后需要重新构建站点才能生效

---

## 回滚方法

### 方法1: 清空配置值
```javascript
// conf/post.config.js
POSTS_EXCLUDE_TAGS: '',
POSTS_EXCLUDE_CATEGORIES: ''
```

### 方法2: 使用 git 还原修改的文件
```bash
# 还原 post.config.js
git checkout conf/post.config.js

# 还原 pages/index.js
git checkout pages/index.js

# 还原 pages/page/[page].js
git checkout pages/page/[page].js
```

### 方法3: 手动恢复
根据上面的"修改前"完整代码块，将文件内容恢复为原始状态。

---

## 文件位置
- 本文档位置: `MODIFICATIONS.md` (项目根目录)
- 修改的配置文件: `conf/post.config.js`
- 修改的页面文件: 
  - `pages/index.js`
  - `pages/page/[page].js`
