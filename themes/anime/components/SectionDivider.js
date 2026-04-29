/**
 * 区域分隔装饰组件
 * 用于各个内容区块之间的视觉分隔
 */
const SectionDivider = ({ text, icon }) => {
  return (
    <div className="relative py-8 flex items-center justify-center">
      {/* 左侧装饰线 */}
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-300/50 to-purple-500/50 dark:via-purple-700/50 dark:to-purple-500/50" />
      
      {/* 中间装饰 */}
      <div className="mx-6 flex items-center gap-3">
        {/* 左侧小装饰 */}
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
          <div className="w-1 h-1 rounded-full bg-pink-400/40" />
        </div>
        
        {/* 主内容 */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-700/30">
          {icon && <span className="text-lg">{icon}</span>}
          {text && <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{text}</span>}
        </div>
        
        {/* 右侧小装饰 */}
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-pink-400/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
        </div>
      </div>
      
      {/* 右侧装饰线 */}
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-300/50 to-purple-500/50 dark:via-purple-700/50 dark:to-purple-500/50" />
    </div>
  )
}

export default SectionDivider
