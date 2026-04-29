import { useState } from 'react'

/**
 * 洛克王国世界 - 异色代肝服务组件
 * 游戏工作室风格，专业代肝服务展示
 */
const LkwService = () => {
  const [activeTab, setActiveTab] = useState('shiny')
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  const tabs = [
    { id: 'shiny', label: '异色精灵', icon: '✨', desc: '专业异色代刷服务' },
    { id: 'daily', label: '日常代肝', icon: '📅', desc: '每日任务全清' },
    { id: 'pvp', label: 'PVP服务', icon: '🏆', desc: '竞技场冲分' },
    { id: 'home', label: '家园托管', icon: '🏠', desc: '资源种植收获' }
  ]

  const services = {
    shiny: [
      {
        id: 'shiny-1',
        title: '异色精灵代刷',
        subtitle: '噩梦枷锁保底机制',
        description: '专业刷取异色精灵，利用3×3速刷法高效触发噩梦枷锁，80次保底必出异色。支持指定目标精灵，同家族保底计数共享。',
        price: '50',
        priceUnit: '起',
        unit: '/只',
        features: ['同家族保底计数', '3×3双系循环刷法', '80次硬保底', '可指定目标精灵'],
        popular: true,
        tag: '热门',
        tagColor: 'from-pink-500 to-rose-500'
      },
      {
        id: 'shiny-2',
        title: '赛季限定异色',
        subtitle: 'S1限定绝版精灵',
        description: '代刷S1赛季限定异色精灵，包括月牙雪熊、粉星仔、燃薪虫等绝版宠物。赛季结束后将无法获取，具有极高收藏价值。',
        price: '80',
        priceUnit: '起',
        unit: '/只',
        features: ['赛季限定精灵', '绝版收藏价值', '最优3×3搭配', '果实加成效率'],
        popular: false,
        tag: '限定',
        tagColor: 'from-amber-500 to-orange-500'
      },
      {
        id: 'shiny-3',
        title: '异色包出服务',
        subtitle: '指定精灵必出',
        description: '指定特定异色精灵，包出服务。未出全额退款或继续刷到出为止。适合追求特定异色精灵的玩家。',
        price: '150',
        priceUnit: '起',
        unit: '/只',
        features: ['指定精灵包出', '未出全额退款', '保底进度实时汇报', '可加急处理'],
        popular: true,
        tag: '包出',
        tagColor: 'from-purple-500 to-indigo-500'
      }
    ],
    daily: [
      {
        id: 'daily-1',
        title: '日常任务代肝',
        subtitle: '每日任务全清',
        description: '代做每日任务、周常任务、活动任务，解放你的时间。包含所有日常玩法，确保不遗漏任何奖励。',
        price: '10',
        priceUnit: '',
        unit: '/天',
        features: ['每日任务全清', '周常任务完成', '活动任务参与', '资源收集'],
        popular: true,
        tag: '日常',
        tagColor: 'from-blue-500 to-cyan-500'
      },
      {
        id: 'daily-2',
        title: '主线代打服务',
        subtitle: '剧情任务通关',
        description: '代打主线剧情、副本挑战、BOSS战，快速推进游戏进度。专业团队，高效通关。',
        price: '30',
        priceUnit: '起',
        unit: '/章',
        features: ['主线剧情通关', '副本挑战', 'BOSS攻略', '隐藏任务解锁'],
        popular: false,
        tag: '主线',
        tagColor: 'from-green-500 to-emerald-500'
      },
      {
        id: 'daily-3',
        title: '图鉴收集代肝',
        subtitle: '全图鉴达成',
        description: '代抓各种精灵完成图鉴收集，包括稀有精灵、限定精灵。按只计费，进度透明。',
        price: '5',
        priceUnit: '起',
        unit: '/只',
        features: ['普通精灵收集', '稀有精灵捕捉', '限定精灵获取', '图鉴进度汇报'],
        popular: false,
        tag: '图鉴',
        tagColor: 'from-teal-500 to-green-500'
      }
    ],
    pvp: [
      {
        id: 'pvp-1',
        title: 'PVP段位托管',
        subtitle: '竞技场冲分',
        description: '代打PVP竞技场，提升段位排名，获取赛季奖励。专业PVP玩家操作，胜率有保障。',
        price: '50',
        priceUnit: '起',
        unit: '/段位',
        features: ['段位提升', '赛季奖励获取', '对战策略优化', '精灵阵容搭配'],
        popular: true,
        tag: 'PVP',
        tagColor: 'from-red-500 to-pink-500'
      },
      {
        id: 'pvp-2',
        title: '精灵养成优化',
        subtitle: '极品个体值刷取',
        description: '代刷精灵个体值(IV)、性格、努力值，打造极品对战精灵。让你的精灵在PVP中占据优势。',
        price: '20',
        priceUnit: '起',
        unit: '/只',
        features: ['个体值刷取', '性格筛选', '努力值分配', '技能搭配建议'],
        popular: false,
        tag: '养成',
        tagColor: 'from-violet-500 to-purple-500'
      }
    ],
    home: [
      {
        id: 'home-1',
        title: '家园系统托管',
        subtitle: '资源种植收获',
        description: '代管家园系统，种植收获资源，完成家园日常任务。让你的家园始终保持最佳状态。',
        price: '5',
        priceUnit: '',
        unit: '/天',
        features: ['作物种植收获', '资源收集', '家园日常', '装饰布置'],
        popular: false,
        tag: '家园',
        tagColor: 'from-yellow-500 to-amber-500'
      }
    ]
  }

  const handleOrder = (service) => {
    setSelectedService(service)
    setShowOrderModal(true)
  }

  return (
    <div id="services" className="space-y-8">
      {/* 标题区域 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-black mb-4 dark:text-white">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            代肝服务
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          专业团队，安全可靠，价格透明。选择你需要的服务，轻松享受游戏乐趣。
        </p>
      </div>

      {/* 标签页 */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25 scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
            {activeTab === tab.id && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {/* 服务卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services[activeTab]?.map((service, index) => (
          <div
            key={service.id}
            className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* 顶部渐变条 */}
            <div className={`h-1 bg-gradient-to-r ${service.tagColor}`}></div>
            
            {/* 标签 */}
            <div className="absolute top-4 right-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${service.tagColor}`}>
                {service.tag}
              </span>
            </div>

            <div className="p-6">
              {/* 标题 */}
              <h3 className="text-xl font-bold mb-1 dark:text-white group-hover:text-purple-500 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-purple-500 mb-3">{service.subtitle}</p>
              
              {/* 描述 */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {service.description}
              </p>
              
              {/* 特性列表 */}
              <div className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 text-purple-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>

              {/* 价格和按钮 */}
              <div className="flex items-end justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <span className="text-xs text-gray-400">起价</span>
                  <div className="flex items-baseline">
                    <span className="text-sm text-gray-500">¥</span>
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{service.price}</span>
                    <span className="text-sm text-gray-500 ml-1">{service.priceUnit}{service.unit}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleOrder(service)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  立即下单
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 下单弹窗 */}
      {showOrderModal && selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold dark:text-white">确认订单</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* 服务信息 */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${selectedService.tagColor}`}>
                  {selectedService.tag}
                </span>
                <h4 className="font-bold dark:text-white">{selectedService.title}</h4>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedService.description}</p>
              <div className="mt-3 flex items-baseline">
                <span className="text-sm text-gray-500">¥</span>
                <span className="text-2xl font-black text-purple-600">{selectedService.price}</span>
                <span className="text-sm text-gray-500 ml-1">{selectedService.priceUnit}{selectedService.unit}</span>
              </div>
            </div>

            {/* 表单 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">联系方式 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="QQ / 微信 / 手机号"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">游戏账号</label>
                <input
                  type="text"
                  placeholder="游戏内昵称或ID"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-white">备注需求</label>
                <textarea
                  rows={3}
                  placeholder="请描述具体需求，如指定精灵、时间要求等"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* 提示 */}
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <p className="text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>双方需提前成为4小时以上好友才能进行世界捕捉。建议下单前先联系客服确认服务细节。</span>
              </p>
            </div>

            <button
              onClick={() => {
                alert('订单已提交！客服会尽快联系您确认细节。')
                setShowOrderModal(false)
              }}
              className="w-full mt-6 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              确认下单
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LkwService