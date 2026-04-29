import { useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝服务组件
 * 引流导向：展示服务价值，引导用户联系咨询
 */
const LkwService = () => {
  const [activeTab, setActiveTab] = useState('shiny')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  // 服务数据
  const services = {
    shiny: [
      {
        id: 'shiny-1',
        title: '异色精灵代刷',
        subtitle: '噩梦枷锁保底机制',
        description: '专业刷取异色精灵，利用3×3速刷法高效触发噩梦枷锁，80次保底必出异色',
        price: '¥50-200',
        unit: '/只',
        features: ['同家族保底计数', '3×3双系循环刷法', '80次硬保底', '可指定目标精灵'],
        popular: true,
        icon: '✨'
      },
      {
        id: 'shiny-2',
        title: '赛季限定异色',
        subtitle: 'S1限定绝版精灵',
        description: '代刷S1赛季限定异色精灵，包括月牙雪熊、粉星仔、燃薪虫等绝版宠物',
        price: '¥80-300',
        unit: '/只',
        features: ['赛季限定精灵', '绝版收藏价值', '最优3×3搭配', '果实加成效率'],
        popular: false,
        icon: '🔥'
      },
      {
        id: 'shiny-3',
        title: '异色包出服务',
        subtitle: '指定精灵必出',
        description: '指定特定异色精灵，包出服务，未出全额退款或继续刷到出为止',
        price: '¥150-500',
        unit: '/只',
        features: ['指定精灵包出', '未出全额退款', '保底进度实时汇报', '可加急处理'],
        popular: true,
        icon: '🎯'
      }
    ],
    daily: [
      {
        id: 'daily-1',
        title: '日常任务代肝',
        subtitle: '每日任务全清',
        description: '代做每日任务、周常任务、活动任务，解放你的时间',
        price: '¥10',
        unit: '/天',
        features: ['每日任务全清', '周常任务完成', '活动任务参与', '资源收集'],
        popular: true,
        icon: '📅'
      },
      {
        id: 'daily-2',
        title: '主线代打服务',
        subtitle: '剧情任务通关',
        description: '代打主线剧情、副本挑战、BOSS战，快速推进游戏进度',
        price: '¥30-100',
        unit: '/章',
        features: ['主线剧情通关', '副本挑战', 'BOSS攻略', '隐藏任务解锁'],
        popular: false,
        icon: '⚔️'
      },
      {
        id: 'daily-3',
        title: '图鉴收集代肝',
        subtitle: '全图鉴达成',
        description: '代抓各种精灵完成图鉴收集，包括稀有精灵、限定精灵',
        price: '¥5-20',
        unit: '/只',
        features: ['普通精灵收集', '稀有精灵捕捉', '限定精灵获取', '图鉴进度汇报'],
        popular: false,
        icon: '📖'
      }
    ],
    pvp: [
      {
        id: 'pvp-1',
        title: 'PVP段位托管',
        subtitle: '竞技场冲分',
        description: '代打PVP竞技场，提升段位排名，获取赛季奖励',
        price: '¥50-200',
        unit: '/段位',
        features: ['段位提升', '赛季奖励获取', '对战策略优化', '精灵阵容搭配'],
        popular: true,
        icon: '🏆'
      },
      {
        id: 'pvp-2',
        title: '精灵养成优化',
        subtitle: '极品个体值刷取',
        description: '代刷精灵个体值(IV)、性格、努力值，打造极品对战精灵',
        price: '¥20-80',
        unit: '/只',
        features: ['个体值刷取', '性格筛选', '努力值分配', '技能搭配建议'],
        popular: false,
        icon: '💎'
      }
    ],
    home: [
      {
        id: 'home-1',
        title: '家园系统托管',
        subtitle: '资源种植收获',
        description: '代管家园系统，种植收获资源，完成家园日常任务',
        price: '¥5',
        unit: '/天',
        features: ['作物种植收获', '资源收集', '家园日常', '装饰布置'],
        popular: false,
        icon: '🏠'
      }
    ]
  }

  // 异色精灵图鉴数据
  const shinyPets = [
    { name: '异色大耳帽兜', type: '常驻', location: '星霜崖地', difficulty: '⭐⭐', price: '¥50' },
    { name: '异色恶魔狼', type: '常驻', location: '洛克里安庇护所', difficulty: '⭐⭐⭐', price: '¥80' },
    { name: '异色拉特', type: '常驻', location: '望风半岛', difficulty: '⭐⭐', price: '¥50' },
    { name: '异色月牙雪熊', type: '赛季限定', location: '星霜崖地', difficulty: '⭐⭐⭐⭐', price: '¥150' },
    { name: '异色粉星仔', type: '赛季限定', location: '落陨星兔前置', difficulty: '⭐⭐⭐⭐', price: '¥120' },
    { name: '异色燃薪虫', type: '赛季限定', location: '维苏威火山', difficulty: '⭐⭐⭐', price: '¥100' },
    { name: '异色空空颅', type: '赛季限定', location: '幽暗空间', difficulty: '⭐⭐⭐⭐', price: '¥130' },
    { name: '异色双灯鱼', type: '赛季限定', location: '亚特兰蒂斯', difficulty: '⭐⭐', price: '¥80' }
  ]

  const tabs = [
    { id: 'shiny', label: '异色精灵', icon: '✨' },
    { id: 'daily', label: '日常代肝', icon: '📅' },
    { id: 'pvp', label: 'PVP服务', icon: '🏆' },
    { id: 'home', label: '家园托管', icon: '🏠' }
  ]

  return (
    <div className="space-y-8">
      {/* 服务标签页 */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'anime-gradient-bg text-white shadow-lg scale-105'
                : 'anime-glass hover:bg-pink-50 dark:hover:bg-purple-900/30 dark:text-white'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 服务卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services[activeTab]?.map((service) => (
          <div
            key={service.id}
            className="anime-glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden"
          >
            {service.popular && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                热门
              </div>
            )}
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold mb-1 dark:text-white">{service.title}</h3>
            <p className="text-sm text-pink-500 mb-3">{service.subtitle}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{service.description}</p>
            
            <div className="space-y-2 mb-4">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 flex-shrink-0"></span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-2xl font-bold text-pink-500">{service.price}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{service.unit}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedService(service)
                  setShowDetailModal(true)
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                查看详情
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 异色精灵图鉴 */}
      {activeTab === 'shiny' && (
        <div className="anime-glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
            <span className="mr-2">📚</span>
            异色精灵图鉴
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shinyPets.map((pet, index) => (
              <div
                key={index}
                className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pet.type === '常驻' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {pet.type}
                  </span>
                  <span className="text-pink-500 font-bold text-sm">{pet.price}</span>
                </div>
                <h4 className="font-bold text-sm mb-1 dark:text-white">{pet.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{pet.location}</p>
                <div className="text-xs text-yellow-500">{pet.difficulty}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 服务详情模态框 */}
      {showDetailModal && selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="anime-glass rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedService.icon}</span>
                <h3 className="text-xl font-bold dark:text-white">{selectedService.title}</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedService.description}</p>
            
            <div className="mb-4">
              <span className="text-3xl font-bold text-pink-500">{selectedService.price}</span>
              <span className="text-gray-500 dark:text-gray-400">{selectedService.unit}</span>
            </div>

            <div className="mb-6">
              <h4 className="font-bold mb-3 dark:text-white">服务特色</h4>
              <div className="space-y-2">
                {selectedService.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 flex-shrink-0"></span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6">
              <h4 className="font-bold mb-2 text-purple-600 dark:text-purple-400">💡 温馨提示</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                具体价格根据精灵稀有度和当前赛季有所浮动，建议联系客服获取最新报价。
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href="#lkw-contact"
                onClick={() => setShowDetailModal(false)}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 text-center"
              >
                联系咨询
              </a>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 引流CTA区域 */}
      <div className="anime-glass rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-4 dark:text-white">
          想要获取稀有异色精灵？
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          加入我们的代肝社区，获取专业的异色刷取攻略和代肝服务。
          我们提供安全靠谱的代肝服务，让你轻松拥有心仪的异色精灵！
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#lkw-contact"
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            联系咨询
          </a>
          <a
            href="#lkw-guide"
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-gray-700 dark:text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 border border-gray-200 dark:border-white/20"
          >
            查看攻略
          </a>
        </div>
      </div>
    </div>
  )
}

export default LkwService