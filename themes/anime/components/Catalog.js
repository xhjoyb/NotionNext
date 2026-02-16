import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import { useRouter } from 'next/router'
import { uuidToId } from 'notion-utils'

const Catalog = ({ toc }) => {
  const { locale } = useGlobal()
  const router = useRouter()

  if (!toc || toc.length === 0) return null

  const scrollToHeading = (id) => {
    if (!isBrowser) return
    // 使用 uuidToId 将 UUID 转换为短 ID
    const shortId = uuidToId(id)
    const element = document.getElementById(shortId)
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className='anime-glass rounded-2xl p-6 anime-card'>
      <h3 className='font-bold text-gray-800 dark:text-white mb-4 flex items-center'>
        <i className='fas fa-list text-pink-400 mr-2'></i>
        {locale.COMMON.TABLE_OF_CONTENTS}
      </h3>
      <nav className='space-y-1 max-h-80 overflow-y-auto'>
        {toc.map((heading, index) => (
          <button
            key={index}
            onClick={() => scrollToHeading(heading.id)}
            className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 cursor-pointer
              ${heading.level === 2 ? 'font-medium' : 'pl-6 text-gray-600 dark:text-gray-400'}
              hover:bg-pink-50 dark:hover:bg-purple-900/30 hover:text-pink-500 dark:hover:text-pink-400`}>
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Catalog
