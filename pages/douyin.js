import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

/**
 * 抖音解析页面
 * 提供抖音视频/图文无水印解析功能
 */
const DouyinPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutDouyin' {...props} />
}

/**
 * 清理对象中的 undefined 值
 * 使用 JSON 序列化/反序列化的方式递归处理所有层级
 */
const sanitizeProps = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    // 将 undefined 转换为 null
    if (value === undefined) {
      return null
    }
    return value
  }))
}

export async function getStaticProps({ locale }) {
  const rawProps = await fetchGlobalAllData({ from: 'douyin-page', locale })
  
  // 清理所有 undefined 值
  const props = sanitizeProps(rawProps)
  
  return {
    props,
    revalidate: process.env.EXPORT
      ? null
      : siteConfig(
          'NEXT_REVALIDATE_SECOND',
          BLOG.NEXT_REVALIDATE_SECOND,
          rawProps.NOTION_CONFIG
        )
  }
}

export default DouyinPage
