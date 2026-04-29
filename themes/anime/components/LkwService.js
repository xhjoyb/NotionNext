import { useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝服务组件
 * 引流导向：展示服务价值，引导用户联系咨询
 */
const LkwService = () => {
  const [activeTab, setActiveTab] = useState('shiny')
  const [expandedService, setExpandedService] = useState(null)

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
        details: {
          process: '选择目标精灵 → 制定刷取方案 → 开始代刷 → 实时汇报进度 → 出货交付',
          notice: '保底按家族独立计算，不同家族不共享保底次数。建议提前确定目标精灵。',
          time: '根据运气不同，通常1-3天完成。'
        },
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
        details: {
          process: '确认赛季精灵 → 准备果实加成 → 3×3循环刷取 → 触发噩梦枷锁 → 捕获异色',
          notice: '赛季限定精灵有活动时间限制，请在赛季结束前下单。',
          time: '赛季期间随时可刷，建议尽早下单避免赛季结束。'
        },
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
        details: {
          process: '指定目标精灵 → 支付定金 → 开始包出服务 → 每日进度汇报 → 出货结清',
          notice: '包出服务需支付定金，未出货可全额退款或继续刷取。',
          time: '最长不超过80次保底周期，通常1-5天完成。'
        },
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
        details: {
          process: '登录账号 → 完成每日任务 → 领取奖励 → 截图汇报',
          notice: '需要账号密码或扫码登录，支持每日/每周/包月多种模式。',
          time: '每日约30-60分钟完成。'
        },
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
        details: {
          process: '确认当前进度 → 制定通关方案 → 代打主线 → 解锁新内容',
          notice: '根据当前进度和精灵练度定价，难度越高价格越高。',
          time: '每章约1-2小时，视难度而定。'
        },
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
        details: {
          process: '确认目标精灵 → 前往捕捉地点 → 捕捉精灵 → 更新图鉴',
          notice: '稀有精灵和限定精灵价格较高，普通精灵价格优惠。',
          time: '普通精灵当场完成，稀有精灵可能需要多次尝试。'
        },
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
        details: {
          process: '评估当前阵容 → 优化精灵搭配 → 竞技场冲分 → 达到目标段位',
          notice: '需要一定的精灵练度基础，纯新手号可能需要先养成。',
          time: '根据目标段位不同，通常1-7天完成。'
        },
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
        details: {
          process: '选择目标精灵 → 刷取个体值 → 筛选性格 → 分配努力值 → 技能搭配',
          notice: '极品个体值(6V)需要较长时间，请耐心等待。',
          time: '普通极品1-2天，6V极品3-7天。'
        },
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
        details: {
          process: '登录账号 → 种植作物 → 收获资源 → 完成家园日常',
          notice: '支持长期托管，包月更优惠。',
          time: '每日约15-30分钟完成。'
        },
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

  const toggleExpand = (serviceId) => {
    setExpandedService(expandedService === serviceId ? null : serviceId)
  }

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
            onClick={() => {
              setActiveTab(tab.id)
              setExpandedService(null)
            }}
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
            className={`anime-glass rounded-2xl p-6 hover:shadow-xl transition-all duration-500 relative overflow-hidden ${
              expandedService === service.id ? 'md:col-span-2 lg:col-span-3' : ''
            }`}
          >
            {service.popular && (
              <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
                热门
              </div>
            )}
            
            {/* 基础信息 - 始终显示 */}
            <div className={`transition-all duration-500 ${expandedService === service.id ? 'mb-6' : ''}`}>
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{service.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-1 dark:text-white">{service.title}</h3>
                  <p className="text-sm text-pink-500 mb-2">{service.subtitle}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{service.description}</p>
                </div>
              </div>
              
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-2xl font-bold text-pink-500">{service.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{service.unit}</span>
                </div>
                <button
                  onClick={() => toggleExpand(service.id)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-1"
                >
                  <span>{expandedService === service.id ? '收起详情' : '查看详情'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${expandedService === service.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 展开详情 */}
            <div className={`overflow-hidden transition-all duration-500 ${
              expandedService === service.id ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 grid md:grid-cols-3 gap-6">
                {/* 服务特色 */}
                <div>
                  <h4 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    服务特色
                  </h4>
                  <div className="space-y-2">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-2 flex-shrink-0"></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 服务流程 */}
                <div>
                  <h4 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 00-1-1H3zm6 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    服务流程
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{service.details.process}</p>
                </div>

                {/* 注意事项 */}
                <div>
                  <h4 className="font-bold mb-3 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    注意事项
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">{service.details.notice}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    <span className="font-semibold">预计时间：</span>{service.details.time}
                  </p>
                </div>
              </div>

              {/* 底部CTA */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-center">
                <a
                  href="#lkw-contact"
                  onClick={() => setExpandedService(null)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  联系咨询此服务
                </a>
              </div>
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