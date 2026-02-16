import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import CONFIG from '../config'

const Pagination = ({ page, totalPage }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const currentPage = page || 1

  const getPageUrl = (pageNum) => {
    const basePath = router.pathname.replace('/page/[page]', '')
    return pageNum === 1 ? basePath : `${basePath}/page/${pageNum}`
  }

  const pages = []
  const maxVisible = 5
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPage, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  if (totalPage <= 1) return null

  return (
    <div className='flex justify-center items-center space-x-2 my-8'>
      {currentPage > 1 && (
        <SmartLink
          href={getPageUrl(currentPage - 1)}
          className='w-10 h-10 flex items-center justify-center rounded-full anime-glass hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer'>
          <i className='fas fa-chevron-left text-pink-500'></i>
        </SmartLink>
      )}

      {startPage > 1 && (
        <>
          <SmartLink
            href={getPageUrl(1)}
            className='w-10 h-10 flex items-center justify-center rounded-full anime-glass hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer'>
            1
          </SmartLink>
          {startPage > 2 && (
            <span className='text-gray-400'>...</span>
          )}
        </>
      )}

      {pages.map((pageNum) => (
        <SmartLink
          key={pageNum}
          href={getPageUrl(pageNum)}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer
            ${pageNum === currentPage
              ? 'anime-gradient-bg text-white shadow-lg'
              : 'anime-glass hover:bg-pink-50 dark:hover:bg-purple-900/30'
            }`}>
          {pageNum}
        </SmartLink>
      ))}

      {endPage < totalPage && (
        <>
          {endPage < totalPage - 1 && (
            <span className='text-gray-400'>...</span>
          )}
          <SmartLink
            href={getPageUrl(totalPage)}
            className='w-10 h-10 flex items-center justify-center rounded-full anime-glass hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer'>
            {totalPage}
          </SmartLink>
        </>
      )}

      {currentPage < totalPage && (
        <SmartLink
          href={getPageUrl(currentPage + 1)}
          className='w-10 h-10 flex items-center justify-center rounded-full anime-glass hover:bg-pink-50 dark:hover:bg-purple-900/30 transition-all duration-300 cursor-pointer'>
          <i className='fas fa-chevron-right text-pink-500'></i>
        </SmartLink>
      )}
    </div>
  )
}

export default Pagination
