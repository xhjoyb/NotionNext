import { useState, useEffect, useRef } from 'react'

// SVG Icons
const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
)

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ZapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
)

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
  </svg>
)

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/**
 * 洛克王国世界 - 专业代肝服务页面
 * 设计风格：深色专业风格，参考游戏工作室官网
 */
const LkwPage = () => {
  const [activeTab, setActiveTab] = useState('shiny')
  const [showModal, setShowModal] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [copiedText, setCopiedText] = useState('')
  const canvasRef = useRef(null)

  // 粒子背景效果
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    const particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(124, 58, 237, 0.3)'
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const tabs = [
    { id: 'shiny', label: '异色精灵' },
    { id: 'daily', label: '日常任务' },
    { id: 'pvp', label: '竞技服务' },
  ]

  const services = {
    shiny: [
      {
        id: 's1',
        title: '异色精灵代刷',
        desc: '噩梦枷锁保底机制，80次必出异色',
        price: '50',
        unit: '起/只',
        features: ['同家族保底计数', '3×3双系循环刷法', '80次硬保底', '可指定目标'],
        tag: '热门',
      },
      {
        id: 's2',
        title: '赛季限定异色',
        desc: 'S1限定绝版精灵，赛季结束无法获取',
        price: '80',
        unit: '起/只',
        features: ['赛季限定精灵', '绝版收藏价值', '最优3×3搭配', '果实加成'],
        tag: '限定',
      },
      {
        id: 's3',
        title: '异色包出服务',
        desc: '指定精灵必出，未出全额退款',
        price: '150',
        unit: '起/只',
        features: ['指定精灵包出', '未出全额退款', '进度实时汇报', '可加急'],
        tag: '包出',
      },
    ],
    daily: [
      {
        id: 'd1',
        title: '日常任务代肝',
        desc: '每日任务全清，解放你的时间',
        price: '10',
        unit: '/天',
        features: ['每日任务全清', '周常任务完成', '活动任务参与', '资源收集'],
        tag: '日常',
      },
      {
        id: 'd2',
        title: '主线剧情代打',
        desc: '剧情任务通关，快速推进进度',
        price: '30',
        unit: '起/章',
        features: ['主线剧情通关', '副本挑战', 'BOSS攻略', '隐藏任务'],
        tag: '主线',
      },
      {
        id: 'd3',
        title: '图鉴收集代肝',
        desc: '全图鉴达成，按只计费',
        price: '5',
        unit: '起/只',
        features: ['普通精灵收集', '稀有精灵捕捉', '限定精灵获取', '进度汇报'],
        tag: '图鉴',
      },
    ],
    pvp: [
      {
        id: 'p1',
        title: 'PVP段位托管',
        desc: '竞技场冲分，获取赛季奖励',
        price: '50',
        unit: '起/段位',
        features: ['段位提升', '赛季奖励', '策略优化', '阵容搭配'],
        tag: '竞技',
      },
      {
        id: 'p2',
        title: '精灵养成优化',
        desc: '极品个体值刷取，打造对战精灵',
        price: '20',
        unit: '起/只',
        features: ['个体值刷取', '性格筛选', '努力值分配', '技能搭配'],
        tag: '养成',
      },
    ],
  }

  const steps = [
    {
      num: '01',
      title: '触发噩梦枷锁',
      desc: '连续捕捉同系精灵，刷出带护盾的污染怪',
    },
    {
      num: '02',
      title: '打破污染盾',
      desc: '击败污染精灵，每次破盾=1次保底计数',
    },
    {
      num: '03',
      title: '累计保底',
      desc: '同家族累计80次破盾，100%必出异色',
    },
    {
      num: '04',
      title: '捕捉异色',
      desc: '使用高级球捕捉，注意异色头像颜色不同',
    },
  ]

  const contacts = [
    { label: 'QQ客服', value: '123456789', color: 'blue' },
    { label: '微信客服', value: 'lkw_service', color: 'green' },
    { label: 'Telegram', value: '@lkw_service', color: 'sky' },
  ]

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(''), 2000)
  }

  const openModal = (service) => {
    setSelectedService(service)
    setShowModal(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-200">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            服务在线接单中
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            洛克王国世界
          </h1>
          <p className="text-xl sm:text-2xl text-violet-400 mb-4 font-medium">
            专业异色代肝服务
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            利用3×3速刷法高效触发噩梦枷锁，80次保底必出异色精灵。
            专业团队，安全可靠。
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#services" className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors">
              查看服务
            </a>
            <a href="#contact" className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-medium transition-colors">
              联系客服
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '80', label: '次保底', icon: <ShieldIcon /> },
            { value: '1.8', label: '%基础出率', icon: <ZapIcon /> },
            { value: '24', label: '小时服务', icon: <ClockIcon /> },
            { value: '100', label: '%安全', icon: <CheckIcon /> },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-violet-400 mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">代肝服务</h2>
            <p className="text-gray-400">专业团队，价格透明，选择你需要的服务</p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services[activeTab]?.map((service) => (
              <div
                key={service.id}
                className="group p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md bg-violet-500/10 text-violet-400 text-xs font-medium">
                    {service.tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{service.desc}</p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="text-violet-500"><CheckIcon /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-end justify-between pt-4 border-t border-white/[0.06]">
                  <div>
                    <span className="text-xs text-gray-500">起价</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-gray-400">¥</span>
                      <span className="text-2xl font-bold text-white">{service.price}</span>
                      <span className="text-sm text-gray-500">{service.unit}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(service)}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    下单
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">异色获取流程</h2>
            <p className="text-gray-400">了解异色精灵的获取机制</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-3xl font-bold text-violet-500/30 mb-3">{step.num}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">联系客服</h2>
            <p className="text-gray-400">有任何问题？随时联系我们</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {contacts.map((contact, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                <h3 className="text-sm font-medium text-gray-400 mb-2">{contact.label}</h3>
                <p className="text-xl font-mono text-white mb-4">{contact.value}</p>
                <button
                  onClick={() => handleCopy(contact.value)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    copiedText === contact.value
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {copiedText === contact.value ? (
                    <><CheckIcon /> 已复制</>
                  ) : (
                    <><CopyIcon /> 复制</>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-violet-500/5 border border-violet-500/10 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">服务时间</h3>
            <p className="text-gray-400">每日 9:00 - 23:00</p>
            <p className="text-sm text-gray-500 mt-1">非工作时间下单，上班后第一时间处理</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto text-center text-sm text-gray-600">
          <p>专业代肝服务 · 安全可靠 · 价格透明</p>
        </div>
      </footer>

      {/* Modal */}
      {showModal && selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#13131f] rounded-xl p-6 max-w-md w-full border border-white/[0.08]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">确认订单</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-white/[0.03] mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 text-xs">
                  {selectedService.tag}
                </span>
                <span className="font-semibold text-white">{selectedService.title}</span>
              </div>
              <p className="text-sm text-gray-500">{selectedService.desc}</p>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-sm text-gray-400">¥</span>
                <span className="text-2xl font-bold text-white">{selectedService.price}</span>
                <span className="text-sm text-gray-500">{selectedService.unit}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">联系方式 *</label>
                <input
                  type="text"
                  placeholder="QQ / 微信 / 手机号"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">备注</label>
                <textarea
                  rows={3}
                  placeholder="具体需求描述"
                  className="w-full px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                alert('订单已提交！客服会尽快联系您。')
                setShowModal(false)
              }}
              className="w-full mt-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors"
            >
              确认下单
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LkwPage