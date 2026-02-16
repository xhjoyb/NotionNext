import { useGlobal } from '@/lib/global'
import { useRouter } from 'next/router'
import { useState } from 'react'

const SearchInput = ({ className = '' }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const [keyword, setKeyword] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      router.push(`/search/${encodeURIComponent(keyword.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type='text'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={locale.NAV.SEARCH}
        className='w-full pl-4 pr-10 py-2 rounded-full anime-input'
      />
      <button
        type='submit'
        className='absolute right-3 top-1/2 -translate-y-1/2 text-pink-400 cursor-pointer'>
        <i className='fas fa-search'></i>
      </button>
    </form>
  )
}

export default SearchInput
