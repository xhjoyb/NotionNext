/**
 * 洛克王国世界 - 异色代肝指南组件
 * 展示刷异色方法对比 - 简洁卡片设计
 */
const LkwGuide = () => {
  const methods = [
    {
      name: '单系速刷法',
      description: '适合常驻异色，单系连续捕捉80次',
      efficiency: '⭐⭐⭐',
      difficulty: '简单'
    },
    {
      name: '3×3双系循环',
      description: '适合赛季限定，抓3只A系→3只B系循环',
      efficiency: '⭐⭐⭐⭐',
      difficulty: '中等'
    },
    {
      name: '果实加成法',
      description: '在庇护所放果实，大幅提高污染触发率',
      efficiency: '⭐⭐⭐⭐⭐',
      difficulty: '需要准备'
    }
  ]

  return (
    <div className="space-y-8">
      {/* 刷法对比 */}
      <div className="anime-glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          <span className="mr-2">⚔️</span>
          刷异色方法对比
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {methods.map((method, index) => (
            <div
              key={index}
              className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <h3 className="font-bold text-lg mb-2 dark:text-white">{method.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{method.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-500">效率: {method.efficiency}</span>
                <span className="text-blue-500">难度: {method.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LkwGuide