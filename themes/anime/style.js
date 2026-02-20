/* eslint-disable react/no-unknown-property */
const Style = () => {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

      :root {
        /* 现代精致配色 - 降低饱和度 */
        --anime-pink: #EC4899;
        --anime-pink-light: #F9A8D4;
        --anime-pink-soft: #FCE7F3;
        --anime-purple: #A78BFA;
        --anime-purple-soft: #E9E5FF;
        --anime-lavender: #C4B5FD;
        --anime-coral: #FDA4AF;
        --anime-mint: #A7F3D0;
        --anime-yellow: #FDE68A;
        --anime-teal: #5EEAD4;
        
        /* 背景渐变 - 更通透 */
        --anime-gradient-hero: linear-gradient(135deg, #FDF2F8 0%, #F5F3FF 25%, #FCE7F3 50%, #FDF4FF 75%, #FDF2F8 100%);
        --anime-gradient-hero-dark: linear-gradient(135deg, #1E1B2E 0%, #2D2640 25%, #1F2937 50%, #312E81 75%, #1E1B2E 100%);
        --anime-gradient-card: linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(167, 139, 250, 0.08) 100%);
        
        /* 玻璃拟态 - 更精致 */
        --anime-glass-bg: rgba(255, 255, 255, 0.72);
        --anime-glass-bg-hover: rgba(255, 255, 255, 0.85);
        --anime-glass-border: rgba(255, 255, 255, 0.5);
        --anime-glass-border-accent: rgba(236, 72, 153, 0.15);
        
        /* 阴影系统 - 更柔和 */
        --anime-shadow-soft: 0 4px 20px rgba(236, 72, 153, 0.08);
        --anime-shadow-medium: 0 8px 32px rgba(236, 72, 153, 0.12);
        --anime-shadow-hover: 0 20px 50px rgba(236, 72, 153, 0.15);
        --anime-shadow-card: 
          0 2px 8px rgba(236, 72, 153, 0.06),
          0 8px 24px rgba(167, 139, 250, 0.08),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        
        /* 圆角系统 */
        --anime-border-radius-sm: 12px;
        --anime-border-radius: 20px;
        --anime-border-radius-lg: 28px;
        --anime-border-radius-xl: 36px;
        
        /* 动画曲线 */
        --anime-transition: cubic-bezier(0.34, 1.56, 0.64, 1);
        --anime-transition-smooth: cubic-bezier(0.4, 0, 0.2, 1);
      }

      .dark {
        --anime-glass-bg: rgba(30, 27, 46, 0.75);
        --anime-glass-bg-hover: rgba(30, 27, 46, 0.88);
        --anime-glass-border: rgba(255, 255, 255, 0.1);
        --anime-glass-border-accent: rgba(167, 139, 250, 0.25);
        --anime-shadow-soft: 0 4px 20px rgba(167, 139, 250, 0.1);
        --anime-shadow-medium: 0 8px 32px rgba(167, 139, 250, 0.15);
        --anime-shadow-hover: 0 20px 50px rgba(167, 139, 250, 0.2);
        --anime-shadow-card: 
          0 2px 8px rgba(167, 139, 250, 0.08),
          0 8px 24px rgba(139, 92, 246, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.08);
      }

      #theme-anime {
        font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      body {
        background: var(--anime-gradient-hero);
        background-attachment: scroll;
        min-height: 100vh;
        transition: background 0.5s ease, color 0.5s ease;
      }

      /* 夜间模式过渡效果 - 只对特定元素应用 */
      body, .anime-glass, .anime-card, .anime-btn, .anime-tag, .anime-input {
        transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .dark body {
        background: var(--anime-gradient-hero-dark);
        background-attachment: scroll;
      }

      .anime-glass {
        background: var(--anime-glass-bg);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid var(--anime-glass-border);
        box-shadow: var(--anime-shadow-card);
        will-change: transform;
        transform: translateZ(0);
        transition: all 0.4s var(--anime-transition-smooth);
      }

      .anime-glass:hover {
        background: var(--anime-glass-bg-hover);
        border-color: var(--anime-glass-border-accent);
        box-shadow: var(--anime-shadow-medium);
      }

      /* 减少毛玻璃效果以提升滚动性能 */
      @media (prefers-reduced-motion: reduce) {
        .anime-glass {
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
      }

      .anime-gradient-text {
        background: linear-gradient(135deg, var(--anime-pink) 0%, var(--anime-purple) 50%, var(--anime-teal) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .anime-gradient-bg {
        background: linear-gradient(135deg, var(--anime-pink) 0%, var(--anime-purple) 100%);
      }

      .anime-card {
        transition: all 0.5s var(--anime-transition-smooth);
        border-radius: var(--anime-border-radius-lg);
        position: relative;
        overflow: hidden;
      }

      .anime-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        opacity: 0.8;
      }

      .anime-card:hover {
        transform: translateY(-8px) scale(1.01);
        box-shadow: var(--anime-shadow-hover);
      }

      /* 文章详情页禁用悬浮效果 */
      .anime-card.article-detail,
      .anime-card.article-detail:hover {
        transform: none;
        box-shadow: var(--anime-shadow-card);
      }

      /* 瀑布流卡片样式 */
      .masonry-card {
        break-inside: avoid;
        margin-bottom: 1.5rem;
        border-radius: var(--anime-border-radius-lg);
        overflow: hidden;
      }

      .masonry-card .card-image {
        position: relative;
        overflow: hidden;
      }

      .masonry-card .card-image img,
      .masonry-card .card-image .lazy-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }

      .anime-btn {
        background: linear-gradient(135deg, var(--anime-pink) 0%, var(--anime-coral) 100%);
        color: white;
        padding: 0.625rem 1.5rem;
        border-radius: 9999px;
        font-weight: 600;
        border: 3px solid transparent;
        transition: all 0.3s var(--anime-transition);
        box-shadow: 
          0 4px 15px rgba(255, 113, 206, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        position: relative;
        overflow: hidden;
      }

      .anime-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s ease;
      }

      .anime-btn:hover::before {
        left: 100%;
      }

      .anime-btn:hover {
        box-shadow: 
          0 6px 20px rgba(255, 113, 206, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.4);
      }

      .anime-btn:active {
        opacity: 0.9;
      }

      .anime-tag {
        background: linear-gradient(135deg, rgba(255, 113, 206, 0.15) 0%, rgba(106, 123, 180, 0.15) 100%);
        color: var(--anime-pink);
        padding: 0.375rem 0.875rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        border: 2px solid rgba(255, 113, 206, 0.3);
        transition: all 0.3s var(--anime-transition);
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }

      .anime-tag:hover {
        background: linear-gradient(135deg, rgba(255, 113, 206, 0.25) 0%, rgba(106, 123, 180, 0.25) 100%);
        border-color: var(--anime-pink);
      }

      .dark .anime-tag {
        color: var(--anime-coral);
        border-color: rgba(255, 158, 205, 0.3);
      }

      .anime-glow {
        box-shadow: 
          0 0 20px rgba(255, 113, 206, 0.4),
          0 0 40px rgba(106, 123, 180, 0.2),
          inset 0 0 20px rgba(255, 255, 255, 0.1);
      }

      .dark .anime-glow {
        box-shadow: 
          0 0 20px rgba(167, 139, 250, 0.4),
          0 0 40px rgba(134, 204, 202, 0.2),
          inset 0 0 20px rgba(255, 255, 255, 0.05);
      }

      .anime-input {
        background: var(--anime-glass-bg);
        border: 3px solid var(--anime-glass-border);
        border-radius: 9999px;
        padding: 0.625rem 1.25rem;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .anime-input:focus {
        outline: none;
        border-color: var(--anime-pink);
        box-shadow: 
          0 0 0 4px rgba(255, 113, 206, 0.2),
          0 4px 15px rgba(255, 113, 206, 0.15);
      }

      .anime-divider {
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--anime-pink), var(--anime-purple), var(--anime-teal), transparent);
        opacity: 0.5;
        border-radius: 2px;
      }

      @keyframes float {
        0%, 100% { 
          transform: translateY(0px) rotate(0deg); 
        }
        25% { 
          transform: translateY(-8px) rotate(2deg); 
        }
        50% { 
          transform: translateY(-12px) rotate(0deg); 
        }
        75% { 
          transform: translateY(-8px) rotate(-2deg); 
        }
      }

      .anime-float {
        animation: float 4s ease-in-out infinite;
        will-change: transform;
      }

      @keyframes sparkle {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1) rotate(0deg); 
        }
        50% { 
          opacity: 0.6; 
          transform: scale(0.8) rotate(180deg); 
        }
      }

      .anime-sparkle {
        animation: sparkle 2s ease-in-out infinite;
      }

      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 
            0 0 20px rgba(255, 113, 206, 0.3),
            0 0 40px rgba(106, 123, 180, 0.2);
        }
        50% {
          box-shadow: 
            0 0 30px rgba(255, 113, 206, 0.5),
            0 0 60px rgba(106, 123, 180, 0.3);
        }
      }

      .anime-pulse-glow {
        animation: pulse-glow 3s ease-in-out infinite;
      }

      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      .anime-gradient-animate {
        background-size: 200% 200%;
        animation: gradient-shift 8s ease infinite;
      }

      @keyframes bounce-in {
        0% {
          opacity: 0;
          transform: scale(0.3);
        }
        50% {
          transform: scale(1.05);
        }
        70% {
          transform: scale(0.9);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      .anime-bounce-in {
        animation: bounce-in 0.6s var(--anime-transition);
        will-change: transform, opacity;
      }

      @keyframes slide-up {
        0% {
          opacity: 0;
          transform: translateY(30px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .anime-slide-up {
        animation: slide-up 0.5s ease-out forwards;
        will-change: transform, opacity;
      }

      /* 推荐阅读区域专用动画 - 更大的偏移量 */
      @keyframes hero-card-enter {
        0% {
          opacity: 0;
          transform: translateY(60px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .anime-hero-card {
        animation: hero-card-enter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        will-change: transform, opacity;
      }

      /* 淡入动画 */
      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      .anime-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }

      /* 气泡淡入上移动画 */
      @keyframes fade-in-up {
        0% {
          opacity: 0;
          transform: translateX(-50%) translateY(10px);
        }
        100% {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      .animate-fade-in-up {
        animation: fade-in-up 0.3s ease-out forwards;
      }

      /* 萌化标签云弹跳动画 - 更弹性的效果 */
      @keyframes kawaii-bounce {
        0% {
          transform: translateY(0) scale(1);
        }
        20% {
          transform: translateY(-6px) scale(1.08);
        }
        40% {
          transform: translateY(-10px) scale(1.12);
        }
        60% {
          transform: translateY(-4px) scale(1.06);
        }
        80% {
          transform: translateY(-2px) scale(1.02);
        }
        100% {
          transform: translateY(0) scale(1);
        }
      }

      .animate-kawaii-bounce {
        animation: kawaii-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      }

      /* 标签入场动画 */
      @keyframes tag-pop-in {
        0% {
          opacity: 0;
          transform: scale(0.5) translateY(10px);
        }
        70% {
          transform: scale(1.1) translateY(-2px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .animate-tag-pop {
        animation: tag-pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }

      /* 萌化加载动画 - 心跳效果 */
      @keyframes kawaii-heartbeat {
        0%, 100% {
          transform: scale(1);
        }
        10% {
          transform: scale(1.1);
        }
        20% {
          transform: scale(1);
        }
        30% {
          transform: scale(1.15);
        }
        40% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.1);
        }
        60% {
          transform: scale(1);
        }
      }

      .animate-kawaii-heartbeat {
        animation: kawaii-heartbeat 1.5s ease-in-out infinite;
      }

      /* Memphis 风格旋转 */
      @keyframes memphis-spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .animate-memphis-spin {
        animation: memphis-spin 2s linear infinite;
      }

      /* TODO: [春节装饰] 2026马年春节临时动画，年后移除 */
      /* 春节灯笼摇摆动画 */
      /* 移除方法: 删除 swing keyframes 和 .animate-swing 类 */
      @keyframes swing {
        0%, 100% {
          transform: rotate(-3deg);
        }
        50% {
          transform: rotate(3deg);
        }
      }

      .animate-swing {
        animation: swing 2s ease-in-out infinite;
        transform-origin: top center;
      }
      /* [春节装饰] 结束 */

      /* 萌化返回顶部按钮点击弹跳动画 */
      @keyframes bounce-click {
        0% {
          transform: scale(1);
        }
        30% {
          transform: scale(0.85);
        }
        50% {
          transform: scale(1.15);
        }
        70% {
          transform: scale(0.95);
        }
        100% {
          transform: scale(1);
        }
      }

      .animate-bounce-click {
        animation: bounce-click 0.6s ease-out;
      }

      /* 粒子爆发动画 */
      @keyframes particle-burst {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx, 30px), var(--ty, -30px)) scale(0);
          opacity: 0;
        }
      }

      /* 弹幕飘动动画 */
      @keyframes danmaku-float {
        0% {
          transform: translateX(0) scale(var(--scale, 1));
        }
        100% {
          transform: translateX(calc(-100vw - 100%)) scale(var(--scale, 1));
        }
      }

      /* 猫咪眨眼动画 */
      @keyframes blink {
        0%, 90%, 100% {
          transform: scaleY(1);
        }
        95% {
          transform: scaleY(0.1);
        }
      }

      .animate-blink {
        animation: blink 3s ease-in-out infinite;
        transform-origin: center;
      }

      /* 睡觉 Zzz 浮动动画 */
      @keyframes float {
        0%, 100% {
          transform: translateY(0) translateX(0);
          opacity: 1;
        }
        50% {
          transform: translateY(-4px) translateX(2px);
          opacity: 0.7;
        }
      }

      .animate-float {
        animation: float 2s ease-in-out infinite;
      }

      /* 猫耳朵摆动动画 */
      @keyframes ear-left {
        0%, 100% {
          transform: rotate(-12deg);
        }
        50% {
          transform: rotate(-18deg);
        }
      }

      @keyframes ear-right {
        0%, 100% {
          transform: rotate(12deg);
        }
        50% {
          transform: rotate(18deg);
        }
      }

      .animate-ear-left {
        animation: ear-left 2s ease-in-out infinite;
        transform-origin: bottom center;
      }

      .animate-ear-right {
        animation: ear-right 2s ease-in-out infinite;
        animation-delay: 0.3s;
        transform-origin: bottom center;
      }

      /* 联系卡片弹跳动画 */
      @keyframes contact-bounce {
        0%, 100% {
          transform: translateY(0) rotate(0deg);
        }
        25% {
          transform: translateY(-3px) rotate(-3deg);
        }
        50% {
          transform: translateY(0) rotate(0deg);
        }
        75% {
          transform: translateY(-2px) rotate(3deg);
        }
      }

      .animate-contact-bounce {
        animation: contact-bounce 2s ease-in-out infinite;
      }

      /* 慢速旋转动画 */
      @keyframes spin-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .animate-spin-slow {
        animation: spin-slow 8s linear infinite;
      }

      /* 尊重用户减少动画偏好 */
      @media (prefers-reduced-motion: reduce) {
        .animate-kawaii-bounce,
        .animate-tag-pop,
        .animate-kawaii-heartbeat,
        .animate-memphis-spin,
        .animate-swing,
        .animate-bounce-click {
          animation: none;
        }

        /* 弹幕在减少动画模式下禁用 */
        [style*="animation: danmaku-float"] {
          animation: none !important;
          opacity: 0 !important;
        }
      }

      .anime-content-section {
        position: relative;
        z-index: 10;
      }

      .anime-shape {
        position: absolute;
        pointer-events: none;
        opacity: 0.6;
        z-index: 0;
      }

      .anime-shape-circle {
        border-radius: 50%;
        background: linear-gradient(135deg, var(--anime-pink), var(--anime-purple));
      }

      .anime-shape-triangle {
        width: 0;
        height: 0;
        border-left: 30px solid transparent;
        border-right: 30px solid transparent;
        border-bottom: 52px solid var(--anime-yellow);
        opacity: 0.4;
      }

      .anime-shape-diamond {
        width: 40px;
        height: 40px;
        background: var(--anime-teal);
        transform: rotate(45deg);
        opacity: 0.4;
      }

      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, var(--anime-pink), var(--anime-purple));
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, var(--anime-coral), var(--anime-purple));
      }

      @media (prefers-reduced-motion: reduce) {
        .anime-float,
        .anime-sparkle,
        .anime-pulse-glow,
        .anime-gradient-animate,
        .anime-bounce-in,
        .anime-slide-up {
          animation: none !important;
        }
        
        .anime-card:hover {
          transform: none;
        }
      }

      .prose {
        --tw-prose-body: #4A044E;
        --tw-prose-headings: #1F2937;
        --tw-prose-links: var(--anime-pink);
        --tw-prose-bold: #1F2937;
        --tw-prose-counters: #6B7280;
      }

      .dark .prose {
        --tw-prose-body: #E5E7EB;
        --tw-prose-headings: #F9FAFB;
        --tw-prose-links: var(--anime-coral);
        --tw-prose-bold: #F9FAFB;
        --tw-prose-counters: #9CA3AF;
      }

      .prose a {
        color: var(--anime-pink);
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
      }

      .prose a:hover {
        border-bottom-color: var(--anime-pink);
      }

      .prose img {
        border-radius: var(--anime-border-radius);
        box-shadow: var(--anime-shadow-soft);
      }

      .prose pre {
        background: linear-gradient(135deg, rgba(255, 113, 206, 0.05) 0%, rgba(106, 123, 180, 0.05) 100%);
        border: 2px solid var(--anime-glass-border);
        border-radius: var(--anime-border-radius);
      }

      .prose blockquote {
        border-left: 4px solid var(--anime-pink);
        background: linear-gradient(90deg, rgba(255, 113, 206, 0.1) 0%, transparent 100%);
        border-radius: 0 var(--anime-border-radius) var(--anime-border-radius) 0;
        padding: 1rem 1.5rem;
        font-style: italic;
      }

      .prose code {
        background: rgba(255, 113, 206, 0.1);
        color: var(--anime-pink);
        padding: 0.125rem 0.375rem;
        border-radius: 0.375rem;
        font-weight: 500;
      }

      .dark .prose code {
        background: rgba(167, 139, 250, 0.1);
        color: var(--anime-coral);
      }

      /* 二次元风格文字选中效果 - 无背景 */
      ::selection {
        background: transparent;
        color: #FF1493;
        text-shadow: 
          1px 1px 0 #FFF,
          -1px -1px 0 #FFF,
          1px -1px 0 #FFF,
          -1px 1px 0 #FFF,
          0 0 10px rgba(255, 113, 206, 0.8),
          0 0 20px rgba(255, 113, 206, 0.5);
        font-weight: 600;
      }

      .dark ::selection {
        background: transparent;
        color: #FFB6C1;
        text-shadow: 
          1px 1px 0 #4A044E,
          -1px -1px 0 #4A044E,
          1px -1px 0 #4A044E,
          -1px 1px 0 #4A044E,
          0 0 10px rgba(255, 158, 205, 1),
          0 0 20px rgba(255, 158, 205, 0.6);
        font-weight: 600;
      }

      /* 玻璃卡片内选中 */
      .anime-glass ::selection,
      .prose ::selection {
        background: transparent;
        color: #E91E8C;
      }

      .dark .anime-glass ::selection,
      .dark .prose ::selection {
        background: transparent;
        color: #FFC0CB;
      }

      /* ==========================================
       * View Transitions API 主题切换动画
       * 浏览器原生支持的视图过渡效果
       * ========================================== */
      
      /* 根元素的视图过渡名称
       * view-transition-name: CSS 属性，为元素指定视图过渡名称
       * 作用: 让浏览器知道哪些元素需要参与过渡动画
       * 标注: CSS 属性
       */
      html {
        view-transition-name: root;
      }

      /* 旧视图（当前状态）的过渡效果
       * ::view-transition-old(root): 伪元素，表示过渡前的视图
       * 作用: 控制旧视图在过渡中的动画
       */
      ::view-transition-old(root) {
        animation: none;
      }

      /* 新视图（目标状态）的过渡效果
       * ::view-transition-new(root): 伪元素，表示过渡后的视图
       * 作用: 控制新视图在过渡中的动画
       * animation: 使用 clip-path 实现圆形扩散效果
       */
      ::view-transition-new(root) {
        animation: none;
      }

      /* 尊重用户减少动画偏好
       * prefers-reduced-motion: 用户系统偏好设置，减少动画
       * 作用: 当用户选择减少动画时，禁用视图过渡
       */
      @media (prefers-reduced-motion: reduce) {
        html {
          view-transition-name: none;
        }
      }
    `}</style>
  )
}

export { Style }
