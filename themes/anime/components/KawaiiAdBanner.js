import { useState } from 'react'
import SmartLink from '@/components/SmartLink'
import { getThemeConfig } from '../config'

const KawaiiAdBanner = () => {
  const [copied, setCopied] = useState(false)

  const adConfig = {
    title: getThemeConfig('AD_BANNER.TITLE', '雨云 - 云服务器首选'),
    subtitle: getThemeConfig('AD_BANNER.SUBTITLE', '稳定 · 高速 · 性价比超高'),
    description: getThemeConfig('AD_BANNER.DESCRIPTION', '使用优惠码立享折扣，开启你的云端之旅~'),
    link: getThemeConfig('AD_BANNER.LINK', 'https://www.rainyun.com/zqf_'),
    code: getThemeConfig('AD_BANNER.CODE', 'zqf'),
    features: getThemeConfig('AD_BANNER.FEATURES', ['免费试用', '秒级开通', '24h在线客服']),
    buttonText: getThemeConfig('AD_BANNER.BUTTON_TEXT', '立即访问'),
  }

  const copyCode = () => {
    navigator.clipboard.writeText(adConfig.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full my-8">
      <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-slate-800/50 backdrop-blur-md border border-blue-200/60 dark:border-blue-700/30 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* 顶部渐变条 */}
        <div className="h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
        
        <div className="p-5">
          {/* 头部：标签 + 云图标 */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                推荐
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">云服务</span>
            </div>
            
            {/* 云图标 */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
              </svg>
            </div>
          </div>

          {/* 标题区域 */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {adConfig.title}
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {adConfig.subtitle}
            </p>
          </div>

          {/* 描述 */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {adConfig.description}
          </p>

          {/* 特性标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {adConfig.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded border border-gray-200 dark:border-gray-600"
              >
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {feature}
              </span>
            ))}
          </div>

          {/* 底部：优惠码 + 按钮 */}
          <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/50">
            {/* 优惠码区域 */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">优惠码</p>
                <div className="flex items-center gap-1">
                  <code className="px-2 py-0.5 text-sm font-mono font-bold text-orange-600 dark:text-orange-400 bg-white dark:bg-gray-800 rounded border border-orange-300 dark:border-orange-600">
                    {adConfig.code}
                  </code>
                  <button
                    onClick={copyCode}
                    className="p-1 text-orange-500 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded transition-colors cursor-pointer"
                    title="复制优惠码"
                  >
                    {copied ? (
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 填充空间 */}
            <div className="flex-1 min-w-4" />

            {/* 立即访问按钮 */}
            <SmartLink
              href={adConfig.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer shadow-md shadow-blue-500/20"
            >
              {adConfig.buttonText}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </SmartLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KawaiiAdBanner
