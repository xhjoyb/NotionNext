/* eslint-disable react/no-unknown-property */
const Style = () => {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

      :root {
        --anime-pink: #FF71CE;
        --anime-yellow: #FFCE5C;
        --anime-teal: #86CCCA;
        --anime-purple: #6A7BB4;
        --anime-coral: #FF9ECD;
        --anime-mint: #98FF98;
        --anime-lilac: #E6E6FA;
        --anime-gradient-hero: linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 30%, #FBCFE8 60%, #F9A8D4 100%);
        --anime-gradient-hero-dark: linear-gradient(180deg, #1A1625 0%, #2D2640 30%, #3B3255 60%, #4C4267 100%);
        --anime-gradient-card: linear-gradient(135deg, rgba(255, 113, 206, 0.1) 0%, rgba(106, 123, 180, 0.1) 100%);
        --anime-glass-bg: rgba(255, 255, 255, 0.85);
        --anime-glass-border: rgba(255, 113, 206, 0.2);
        --anime-shadow-soft: 0 4px 20px rgba(255, 113, 206, 0.15);
        --anime-shadow-hover: 0 8px 30px rgba(255, 113, 206, 0.25);
        --anime-shadow-card: 
          0 4px 6px rgba(255, 113, 206, 0.1),
          0 10px 20px rgba(106, 123, 180, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.6);
        --anime-border-radius: 20px;
        --anime-transition: cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .dark {
        --anime-glass-bg: rgba(26, 22, 37, 0.9);
        --anime-glass-border: rgba(167, 139, 250, 0.2);
        --anime-shadow-soft: 0 4px 20px rgba(167, 139, 250, 0.15);
        --anime-shadow-hover: 0 8px 30px rgba(167, 139, 250, 0.25);
        --anime-shadow-card: 
          0 4px 6px rgba(167, 139, 250, 0.1),
          0 10px 20px rgba(106, 123, 180, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      #theme-anime {
        font-family: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      body {
        background: var(--anime-gradient-hero);
        background-attachment: fixed;
        min-height: 100vh;
        transition: background 0.5s ease, color 0.5s ease;
      }

      /* 夜间模式过渡效果 */
      *, *::before, *::after {
        transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      }

      .dark body {
        background: var(--anime-gradient-hero-dark);
        background-attachment: fixed;
      }

      .anime-glass {
        background: var(--anime-glass-bg);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 2px solid var(--anime-glass-border);
        box-shadow: var(--anime-shadow-card);
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
        transition: all 0.4s var(--anime-transition);
        border-radius: var(--anime-border-radius);
        position: relative;
        overflow: hidden;
      }



      .anime-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--anime-shadow-hover);
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

      @keyframes sakura-fall {
        0% {
          transform: translateY(-10vh) rotate(0deg) translateX(0);
          opacity: 1;
        }
        25% {
          transform: translateY(22vh) rotate(180deg) translateX(20px);
        }
        50% {
          transform: translateY(54vh) rotate(360deg) translateX(-20px);
        }
        75% {
          transform: translateY(77vh) rotate(540deg) translateX(20px);
        }
        100% {
          transform: translateY(110vh) rotate(720deg) translateX(0);
          opacity: 0;
        }
      }

      .sakura {
        position: fixed;
        top: -10vh;
        pointer-events: none;
        z-index: 9999;
        animation: sakura-fall linear forwards;
        filter: drop-shadow(0 0 5px rgba(255, 113, 206, 0.5));
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
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(255, 113, 206, 0.1);
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, var(--anime-pink), var(--anime-purple));
        border-radius: 5px;
        border: 2px solid rgba(255, 255, 255, 0.3);
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
        .anime-slide-up,
        .sakura {
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
    `}</style>
  )
}

export { Style }
