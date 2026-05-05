import { useState, useEffect } from 'react'
import { getThemeConfig } from '../config'

/**
 * 洛克王国世界 - 异色代肝服务组件
 * 引流导向：展示服务价值，引导用户联系咨询
 */
const LkwService = () => {
  const [activeTab, setActiveTab] = useState('shiny')
  const [animateKey, setAnimateKey] = useState(0)

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return
    setActiveTab(tabId)
    setAnimateKey(prev => prev + 1)
  }

  // 获取主题配置中的购买地址
  const purchaseUrls = getThemeConfig('LKW.PURCHASE_URLS', {})
  const defaultButtonText = getThemeConfig('LKW.DEFAULT_BUTTON_TEXT', '联系咨询')
  const purchaseButtonText = getThemeConfig('LKW.PURCHASE_BUTTON_TEXT', '前往购买')

  // 服务数据
  const services = {
    shiny: [
      {
        id: 'shiny-1',
        title: '极光千兽/绒仙子代肝',
        subtitle: '纯手工操作 包球',
        description: '洛克王国世界异色极光千兽、绒仙子代肝，纯手工操作，包球，效率高，安全靠谱',
        price: '¥22',
        unit: '/只',
        features: ['纯手工操作', '包球服务', '24小时内出', '扫码登录'],
        details: {
          notice: '需要提前加好友4小时，不牵手抓需确保每月好友世界捕捉机会还在。牵手抓不消耗次数，加5元可牵手。',
          time: '24小时内出。'
        },
        popular: true,
        icon: '✨',
        purchaseKey: 'shiny'
      },
      {
        id: 'shiny-2',
        title: 'S1赛季全套异色代肝',
        subtitle: '16只常规异色全包',
        description: 'S1赛季全套16只常规异色精灵代肝，包含粉星仔、粉粉星、贝瑟、月牙雪熊、空空颅、双灯鱼、柴渣虫、嗜光嗡嗡等全部异色',
        price: '¥450',
        unit: '/全套',
        features: ['16只异色全包', '纯手工操作', '包球服务', '赛季限定'],
        details: {
          notice: 'S1赛季共18只异色精灵（16只常规+2只通行证专属），本服务包含16只常规异色代肝。通行证专属异色需自行购买通行证获取。全套服务更优惠，平均每只仅需28元。',
          time: '根据具体情况，通常3-7天完成全套。'
        },
        popular: false,
        icon: '🎁',
        purchaseKey: 'shiny_set'
      }
    ],
    daily: [
      {
        id: 'daily-1',
        title: '跑图拿资源',
        subtitle: '纯手工跑图',
        description: '纯手工跑图，无任何脚本工具，纯靠记忆跑图，不用任何外部工具甚至是导航',
        price: '¥10',
        unit: '/天',
        features: ['纯手工跑图', '无脚本工具', '纯记忆跑图', '不用导航'],
        details: {
          notice: '纯手工跑图，无任何脚本工具，纯靠记忆跑图，不用任何外部工具甚至是导航。需要账号密码或扫码登录，支持每日/每周/包月多种模式。',
          time: '每日约30-60分钟完成。'
        },
        popular: true,
        icon: '📅',
        purchaseKey: 'daily'
      },
      {
        id: 'daily-2',
        title: '主线及子任务',
        subtitle: '剧情任务通关',
        description: '帮我完成主线及其子任务，快速推进游戏进度',
        price: '¥20',
        unit: '/4章',
        features: ['主线剧情通关', '子任务完成', 'BOSS攻略', '隐藏任务解锁'],
        details: {
          notice: '每4章节20元，根据当前进度和精灵练度调整，难度越高耗时越长。',
          time: '每章约1-2小时，视难度而定。'
        },
        popular: false,
        icon: '⚔️',
        purchaseKey: 'mainline'
      },
      {
        id: 'daily-3',
        title: '图鉴收集代肝',
        subtitle: '全图鉴达成',
        description: '代抓各种精灵完成图鉴收集，包括稀有精灵、限定精灵',
        price: '¥1',
        unit: '/只',
        features: ['普通精灵收集', '稀有精灵捕捉', '限定精灵获取', '图鉴进度汇报'],
        details: {
          notice: '稀有精灵和限定精灵价格较高，普通精灵价格优惠。',
          time: '普通精灵当场完成，稀有精灵可能需要多次尝试。'
        },
        popular: false,
        icon: '📖',
        purchaseKey: 'collection'
      }
    ],
    pvp: [
      {
        id: 'pvp-1',
        title: 'PVP段位托管',
        subtitle: '帮上大师段',
        description: '帮上大师段，当前赛季内每周帮拿每周排位战奖励',
        price: '¥50-200',
        unit: '/段位',
        features: ['帮上大师段', '每周排位战奖励', '对战策略优化', '精灵阵容搭配'],
        details: {
          notice: '需要一定的精灵练度基础，纯新手号可能需要先养成。当前赛季内每周帮拿每周排位战奖励。',
          time: '根据目标段位不同，通常1-7天完成。'
        },
        popular: true,
        icon: '🏆',
        purchaseKey: 'pvp'
      },
      {
        id: 'pvp-2',
        title: '精灵养成优化',
        subtitle: '帮刷指定性格精灵',
        description: '帮刷指定性格精灵，打造极品对战精灵',
        price: '详谈',
        unit: '',
        features: ['指定性格刷取', '个体值筛选', '努力值分配', '技能搭配建议'],
        details: {
          notice: '帮刷指定性格精灵，价格根据具体需求详谈。极品个体值(6V)需要较长时间，请耐心等待。',
          time: '普通极品1-2天，6V极品3-7天。'
        },
        popular: false,
        icon: '💎',
        purchaseKey: 'training'
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
          notice: '支持长期托管，包月更优惠。',
          time: '每日约15-30分钟完成。'
        },
        popular: false,
        icon: '🏠',
        purchaseKey: 'home'
      }
    ]
  }

  const tabs = [
    { id: 'shiny', label: '异色精灵', icon: '✨' },
    { id: 'daily', label: '日常代肝', icon: '📅' },
    { id: 'pvp', label: 'PVP服务', icon: '🏆' },
    { id: 'home', label: '家园托管', icon: '🏠' }
  ]

  // 获取购买按钮配置
  const getPurchaseConfig = (purchaseKey) => {
    const url = purchaseUrls[purchaseKey]
    if (url && url.trim() !== '') {
      return { text: purchaseButtonText, href: url, isExternal: true }
    }
    return { text: defaultButtonText, href: '#lkw-contact', isExternal: false }
  }

  return (
    <div className="space-y-8">
      {/* 服务标签页 */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
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

      {/* 服务卡片 - 带动画 */}
      <div key={animateKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
        {services[activeTab]?.map((service) => {
          const purchaseConfig = getPurchaseConfig(service.purchaseKey)
          return (
            <div
              key={service.id}
              className="anime-glass rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden flex flex-col"
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

              {/* 内容填充区 - 让价格区域固定在底部 */}
              <div className="flex-1 flex flex-col justify-end">
                {/* 注意事项 */}
                <div className="mb-4">
                  <h4 className="font-bold mb-2 dark:text-white text-sm">注意事项</h4>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-3 space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{service.details.notice}</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      <span className="font-semibold">预计时间：</span>{service.details.time}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <span className="text-2xl font-bold text-pink-500">{service.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{service.unit}</span>
                </div>
                <a
                  href={purchaseConfig.href}
                  target={purchaseConfig.isExternal ? '_blank' : undefined}
                  rel={purchaseConfig.isExternal ? 'noopener noreferrer' : undefined}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  {purchaseConfig.text}
                </a>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default LkwService
