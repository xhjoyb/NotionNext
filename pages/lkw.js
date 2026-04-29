import BLOG from '@/blog.config'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData } from '@/lib/db/SiteDataApi'
import { DynamicLayout } from '@/themes/theme'

/**
 * 洛克王国世界 - 异色代肝页面
 */
const LkwPage = props => {
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return <DynamicLayout theme={theme} layoutName='LayoutLkw' {...props} />
}

const sanitizeProps = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (value === undefined) {
      return null
    }
    return value
  }))
}

export async function getStaticProps({ locale }) {
  const rawProps = await fetchGlobalAllData({ from: 'lkw-page', locale })
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

export default LkwPage