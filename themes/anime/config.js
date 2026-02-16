/**
 * Anime 主题配置文件
 * 主题专属配置，不依赖 NotionNext 全局配置
 */

export const THEME_CONFIG = {
  // 导航栏配置
  NAV: {
    // 是否使用 Notion 图标
    NOTION_ICON: true,
    // 默认 Logo 图片地址（当 Notion 图标未设置或加载失败时使用）
    DEFAULT_LOGO: 'https://bad.joyb.cc/file/1771203602002_blog-logo.jpg',
    // 随机文章按钮
    RANDOM_POST: true,
    // 搜索按钮
    SEARCH_BUTTON: true,
    // 菜单项显示控制
    CATEGORY: true,
    TAG: true,
    ARCHIVE: true,
    SEARCH: true,
    RSS: false,
  },

  // 首页 Hero 配置
  HERO: {
    // 是否启用 Banner
    BANNER_ENABLE: true,
    BANNER_TITLE: 'Welcome to My World',
    BANNER_SUBTITLE: '探索二次元的奇妙世界',

    // Hero 标题
    TITLE_1: '你好，',
    TITLE_2: '欢迎来到我的博客',
    TITLE_3: '这里记录着我的日常与思考',
    TITLE_LINK: '/',
  },

  // 文章卡片配置
  POST: {
    // 封面悬停动画
    COVER_HOVER_ANIMATION: true,
    // 卡片悬停缩放
    CARD_HOVER_SCALE: true,
    // 卡片网格火车动画（鼠标在卡片间移动时的连接线动画）
    CARD_TRAIN_ANIMATION: true,
  },

  // 视觉效果配置
  EFFECTS: {
    // 樱花飘落效果
    SAKURA: true,
    // 发光效果
    GLOW: true,
    // 圆角风格
    ROUNDED_STYLE: '2xl',
  },

  // 背景图配置
  BACKGROUND: {
    // 是否启用 PNG 透明背景图
    ENABLE: true,
    // PNG 背景图 URL
    IMAGE_URL: 'https://file.notion.so/f/f/c7a5ea8e-53e3-81cc-9194-0003dc0e0ea5/79d36e87-2c7e-45f4-9247-293c789ec417/blog-mcpq-b.png?table=block&id=3095ea8e-53e3-802c-8e8a-d617379a89c5&spaceId=c7a5ea8e-53e3-81cc-9194-0003dc0e0ea5&expirationTimestamp=1771243200000&signature=ZgQjE1XDtlEwkrx1tiWzUnuHKmNTJ9ne7IHi4d5YzuU&downloadName=blog-mcpq-b.png',
    // 背景图透明度（0-1）
    OPACITY: 0.6,
    // 夜间模式透明度
    DARK_OPACITY: 0.4,
  },

  // 侧边栏配置
  SIDEBAR: {
    // 是否反转（左右互换）
    REVERSE: false,
  },

  // 推荐文章配置
  RECOMMEND: {
    // 推荐文章标签
    POST_TAG: 'Recommend',
    // 按更新时间排序
    SORT_BY_UPDATE_TIME: true,
  },

  // 联系卡片配置
  CONTACT: {
    // 是否显示
    ENABLE: true,
    // 联系链接
    URL: 'https://t.me/xh_joyb',
    // 标题
    TITLE_1: '✨ 联系我',
    TITLE_2: '一起交流吧~',
    TITLE_3: '点击这里',
  },

  // 公告配置
  // 从 Notion 数据库 type 为 Notice 的文章获取公告内容
  ANNOUNCEMENT: {
    // 是否启用公告
    ENABLE: false,
    // 公告显示位置：'home' 仅首页, 'all' 所有页面
    SHOW_ON: 'home',
  },

  // 明月浩空音乐播放器配置
  // 对接 myhkw.cn 的在线音乐播放器
  MYHK_PLAYER: {
    // 是否启用明月浩空播放器
    ENABLE: true,
    // 播放器 ID（从明月浩空后台获取）
    PLAYER_ID: '1690736841113',
    // 是否自动加载 jQuery（如果页面已有 jQuery 可设为 false）
    LOAD_JQUERY: true,
    // 播放器模式：1-默认模式
    MODE: '1'
  },

  // 音乐播放器配置（自建播放器，与明月浩空二选一）
  // 音乐列表，每首歌曲配置 lrc 字段指向 LRC 歌词文件的 URL
  MUSIC: {
    // 是否启用音乐页面
    ENABLE: true,
    // 是否显示歌词
    SHOW_LYRICS: true,
    // 是否启用歌词背景
    LYRICS_BACKGROUND: false,
    // 歌词获取方式：'fetch' 从 URL 获取，'embedded' 内嵌
    LRC_TYPE: 'fetch',
    // 音乐列表（从 NotionNext 全局配置 MUSIC_PLAYER_AUDIO_LIST 复制）
    LIST: [
      {
        name: '404的旧名字',
        artist: '本站专属音乐-其它任何地方听不到',
        url: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E6%9C%80%E5%90%8E%E4%B8%80%E6%AC%A1%E4%BF%9D%E5%AD%98.mp3',
        lrc: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E6%9C%80%E5%90%8E%E4%B8%80%E6%AC%A1%E4%BF%9D%E5%AD%98.lrc',
        cover: 'https://bad.joyb.cc/file/1769612992392_logo.png'
      },
      {
        name: '一句话的愿望',
        artist: '本站专属音乐-其它任何地方听不到',
        url: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E4%B8%80%E5%8F%A5%E8%AF%9D%E7%9A%84%E6%84%BF%E6%9C%9B.mp3',
        lrc: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E4%B8%80%E5%8F%A5%E8%AF%9D%E7%9A%84%E6%84%BF%E6%9C%9B.lrc',
        cover: 'https://bad.joyb.cc/file/1769612992392_logo.png'
      },
      {
        name: '战桥',
        artist: '本站专属音乐-其它任何地方听不到',
        url: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E6%88%98%E6%A1%A5.mp3',
        lrc: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E6%A0%88%E6%A1%A5.lrc',
        cover: 'https://bad.joyb.cc/file/1769612992392_logo.png'
      },
      {
        name: '出生点只剩我RP版',
        artist: '本站专属音乐-其它任何地方听不到',
        url: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E5%87%BA%E7%94%9F%E7%82%B9%E5%8F%AA%E5%89%A9%E6%88%91rp.mp3',
        lrc: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E5%87%BA%E7%94%9F%E7%82%B9%E5%8F%AA%E5%89%A9%E6%88%91rp.lrc',
        cover: 'https://bad.joyb.cc/file/1769612992392_logo.png'
      },
      {
        name: '出生点只剩我男版',
        artist: '本站专属音乐-其它任何地方听不到',
        url: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E5%87%BA%E7%94%9F%E7%82%B9%E5%8F%AA%E5%89%A9%E6%88%91%E7%94%B7%E7%89%88.mp3',
        lrc: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E5%87%BA%E7%94%9F%E7%82%B9%E5%8F%AA%E5%89%A9%E6%88%91%E7%94%B7%E7%89%88.lrc',
        cover: 'https://bad.joyb.cc/file/1769612992392_logo.png'
      },
      {
        name: '出生点只剩我女版',
        artist: '本站专属音乐-其它任何地方听不到',
        url: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E5%87%BA%E7%94%9F%E7%82%B9%E5%8F%AA%E5%89%A9%E6%88%91%E5%A5%B3%E7%89%88.mp3',
        lrc: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/%E5%87%BA%E7%94%9F%E7%82%B9%E5%8F%AA%E5%89%A9%E6%88%91-%E5%A5%B3%E7%89%88.lrc',
        cover: 'https://bad.joyb.cc/file/1769612992392_logo.png'
      }
    ]
  },

  // 主题颜色配置
  COLORS: {
    PRIMARY: '#ec4899',      // 粉色
    SECONDARY: '#8b5cf6',    // 紫色
    ACCENT: '#f472b6',       // 浅粉色
    BACKGROUND: '#fdf2f8',   // 背景色
  },

  // 动画配置
  ANIMATION: {
    ENABLE_PARTICLES: true,
    ENABLE_FLOATING: true,
  },

  // Live2D Cubism 3 看板娘配置
  // 支持 Cubism 3/4 格式的模型（.model3.json）
  LIVE2D_CUBISM3: {
    // 是否启用 Cubism 3 看板娘
    ENABLE: true,
    // 模型配置文件路径（.model3.json）
    // 需要将模型文件放在 public 目录下
    // 当前模型: 半人马 - 碧蓝航线
    MODEL_PATH: '/live2d/model/banrenma_2/banrenma_2.model3.json',
    // 画布宽度
    WIDTH: 300,
    // 画布高度
    HEIGHT: 400,
    // 模型缩放比例（相对于自动计算的尺寸）
    // 1.0 = 原始大小，2.0 = 2倍大小，建议范围 0.5-3.0
    SCALE: 1.5,
    // 显示位置: 'right' 右下角, 'left' 左下角
    POSITION: 'right',
    // 距离底部距离（像素）
    BOTTOM: 20,
    // 距离右侧距离（像素，POSITION为right时有效）
    RIGHT: 20,
    // 距离左侧距离（像素，POSITION为left时有效）
    LEFT: 'auto',
    // 移动端是否显示
    MOBILE_SHOW: false,

    // ===== 高级配置 =====
    // 是否启用视线跟随（鼠标移动时眼睛跟随）
    ENABLE_EYE_TRACKING: true,
    // 是否启用点击交互（点击时播放动作）
    ENABLE_CLICK_INTERACTION: true,
    // 是否自动播放 idle 动作（待机动画）
    AUTO_PLAY_IDLE: true,
    // 动作淡入时间（毫秒）
    MOTION_FADE_IN: 500,
    // 动作淡出时间（毫秒）
    MOTION_FADE_OUT: 500,
    // 表情淡入时间（毫秒）
    EXPRESSION_FADE_IN: 500,
    // 是否启用音效（如果模型有音效文件）
    ENABLE_SOUND: false,
    // 是否启用物理效果（头发、衣服飘动等）
    ENABLE_PHYSICS: true,
    // 是否启用呼吸动画
    ENABLE_BREATHING: true,
    // 点击时是否随机播放动作，false则播放指定动作
    RANDOM_MOTION_ON_CLICK: true,
    // 点击时播放的指定动作组名称（RANDOM_MOTION_ON_CLICK为false时生效）
    // 常见动作组: 'idle', 'tap', 'touch', 'login', 'home'
    CLICK_MOTION_GROUP: 'tap',

    // 是否启用表情切换（按指定间隔自动切换表情）
    ENABLE_EXPRESSION: true,
    // 表情切换间隔（毫秒）
    EXPRESSION_INTERVAL: 5000,
    // 是否启用对话框/气泡
    ENABLE_CHAT_BUBBLE: true,
    // 对话框显示的文字列表（随机显示）
    CHAT_MESSAGES: [
      '你好呀~',
      '今天也要加油哦！',
      '有什么可以帮你的吗？',
      '欢迎来到我的博客！',
      '记得多喝水哦~'
    ],
    // 对话框显示间隔（毫秒）
    CHAT_INTERVAL: 8000,
    // 是否启用鼠标悬停效果（悬停时播放特殊动作）
    ENABLE_HOVER_EFFECT: true,
    // 悬停时播放的动作组
    HOVER_MOTION_GROUP: 'touch_body',

    // ===== 拖拽和定时功能配置 =====
    // 是否启用拖拽移动
    ENABLE_DRAG: true,
    // 是否记住拖拽位置（刷新后保持位置）
    REMEMBER_DRAG_POSITION: true,
    // 是否启用定时动作（按时间间隔自动播放动作）
    ENABLE_SCHEDULED_MOTION: true,
    // 定时动作间隔（毫秒）
    SCHEDULED_MOTION_INTERVAL: 30000,
    // 定时动作时显示的消息
    SCHEDULED_MESSAGES: [
      '休息一下吧~',
      '喝口水再继续吧！',
      '坐太久要记得活动哦~',
      '眼睛累了吗？看看远处吧~'
    ],
  }
}

/**
 * 获取主题配置
 * @param {string} key - 配置键名，支持点号分隔的路径
 * @param {*} defaultValue - 默认值
 * @returns {*} 配置值
 */
export const getThemeConfig = (key, defaultValue = null) => {
  const keys = key.split('.')
  let value = THEME_CONFIG

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return defaultValue
    }
  }

  return value !== undefined ? value : defaultValue
}

export default THEME_CONFIG
