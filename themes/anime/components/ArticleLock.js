import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useState } from 'react'
import CONFIG from '../config'

const ArticleLock = ({ validPassword }) => {
  const { locale } = useGlobal()
  const router = useRouter()
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    validPassword(password)
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='anime-glass rounded-3xl p-8 max-w-md w-full text-center anime-card'>
        <div className='w-20 h-20 mx-auto mb-6 rounded-full anime-gradient-bg flex items-center justify-center'>
          <i className='fas fa-lock text-3xl text-white'></i>
        </div>
        
        <h2 className='text-2xl font-bold anime-gradient-text mb-4'>
          文章已加密
        </h2>
        
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          请输入密码查看文章内容
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='请输入密码'
            className='w-full px-4 py-3 rounded-full anime-input text-center'
          />
          <button
            type='submit'
            className='w-full anime-btn py-3'>
            解锁文章
          </button>
        </form>
      </div>
    </div>
  )
}

export default ArticleLock
