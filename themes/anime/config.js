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

    // 滚动时自动隐藏导航栏（向下滚动隐藏，向上滚动显示）
    AUTO_HIDE_ON_SCROLL: true,
  },

  // 主题扩展菜单配置
  // 这些菜单会追加到 Notion 配置的菜单之后
  EXTRA_MENU: {
    // 是否显示抖音解析菜单
    SHOW_DOUYIN: true,
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

    // 推荐阅读文章配置
    RECOMMEND: {
      // 筛选标签（可以是单个标签字符串或标签数组）
      // 例如: 'Recommend' 或 ['Recommend', '精选', 'Hot']
      TAGS: ['时光','AI'],
      // 最大显示文章数
      MAX_POSTS: 6,
      // 排序方式: 'date' | 'random' | 'default'
      // date: 按发布日期排序（最新的在前）
      // random: 随机排序
      // default: 保持原有顺序
      SORT_BY: 'date',
    },
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
    // 二次元萌化自定义光标
    KAWAII_CURSOR: true,
  },

  // 背景图配置
  BACKGROUND: {
    // 是否启用 PNG 透明背景图
    ENABLE: true,
    // PNG 背景图 URL
    IMAGE_URL: 'https://joyb.cc/wp-content/uploads/2026/02/20260217173643669-blog-mcpq-b.png',
    // 背景图透明度（0-1）
    OPACITY: 0.6,
    // 夜间模式透明度
    DARK_OPACITY: 0.4,
  },

  // 侧边栏配置
  SIDEBAR: {
    // 首页侧边栏位置：'left' 或 'right'
    INDEX_POSITION: 'left',
    // 文章详情页侧边栏位置：'left' 或 'right'
    POST_POSITION: 'right',
    // 归档页侧边栏位置：'left' 或 'right'
    ARCHIVE_POSITION: 'right',
    // 分类页侧边栏位置：'left' 或 'right'
    CATEGORY_POSITION: 'right',
    // 标签页侧边栏位置：'left' 或 'right'
    TAG_POSITION: 'right',
    // 搜索页侧边栏位置：'left' 或 'right'
    SEARCH_POSITION: 'right',
    // 默认侧边栏位置（其它页面）：'left' 或 'right'
    DEFAULT_POSITION: 'right',
  },

  // 动漫角色引用卡片配置
  ANIME_QUOTE: {
    // 是否启用
    ENABLE: true,
    // 是否自动轮播
    AUTO_ROTATE: true,
    // 轮播间隔（毫秒）
    ROTATE_INTERVAL: 10000,
    // 是否显示角色名
    SHOW_CHARACTER: true,
    // 是否显示作品名
    SHOW_ANIME: true,
    // 台词列表（在此添加你喜欢的台词）
    QUOTES: [
      {
        text: '我命由我不由天，是魔是仙，我自己说了算！',
        character: '哪吒',
        anime: '哪吒之魔童降世',
        color: '#DC143C'
      },
      {
        text: '这短短的一生，我们最终都会失去。不妨大胆一些，爱一个人，攀一座山，追一个梦。',
        character: '椿',
        anime: '大鱼海棠',
        color: '#FF69B4'
      },
      {
        text: '三十年河东，三十年河西，莫欺少年穷！',
        character: '萧炎',
        anime: '斗破苍穹',
        color: '#8B4513'
      },
      {
        text: '我今天就要带她走，我看谁敢拦我！',
        character: '伍六七',
        anime: '刺客伍六七',
        color: '#FF6347'
      },
      {
        text: '为你明灯三千，为你花开满城。',
        character: '谢怜',
        anime: '天官赐福',
        color: '#FFD700'
      },
      {
        text: '无论过去，不问将来。',
        character: '陆光',
        anime: '时光代理人',
        color: '#9370DB'
      }
    ],
  },

  // 标签云配置
  TAG_CLOUD: {
    // 是否启用
    ENABLE: true,
    // 最大显示标签数
    MAX_TAGS: 20,
  },

  // 萌化加载动画配置
  LOADER: {
    // 是否启用
    ENABLE: true,
    // 默认加载动画类型: star | heart | geo | avatar
    DEFAULT_TYPE: 'star',
    // 是否显示加载文字
    ENABLE_TEXT: false,
  },

  // TODO: [春节装饰] 2026马年春节临时配置，年后移除
  // 添加时间: 2026-02-16 (除夕)
  // 移除时间: 2026-03-05 (元宵节后)
  // 移除方法: 删除整个 NEW_YEAR 配置块
  // 除夕春节装饰配置
  NEW_YEAR: {
    // 是否启用
    ENABLE: true,
    // 显示萌化小马
    SHOW_HORSE: true,
    // 显示灯笼
    SHOW_LANTERN: true,
    // 祝福语
    GREETING: '春节快乐',
  },
  // [春节装饰] 结束

  // 萌化返回顶部按钮配置
  BACK_TO_TOP: {
    // 是否启用
    ENABLE: true,
    // 滚动多少像素后显示按钮
    SHOW_THRESHOLD: 300,
    // 按钮类型: rocket | cat | star
    BUTTON_TYPE: 'rocket',
    // 是否显示点击粒子效果
    SHOW_PARTICLES: true,
  },

  // 弹幕评论配置
  DANMAKU: {
    // 是否启用弹幕
    ENABLE: true,
    // 是否显示开关按钮
    SHOW_TOGGLE: true,
    // 弹幕速度 (秒数，越小越快)
    SPEED: 10,
    // 弹幕密度 (1-10)，建议 1-3
    DENSITY: 2,
    // 最大同时显示弹幕数，建议 5-8
    MAX_COMMENTS: 6,
    // 弹幕列表 - 使用国内二次元文化梗
    COMMENTS: [
      { text: '新年快乐！🎉', author: '二次元住民' },
      { text: '这个主题太可爱了~', author: '萌豚' },
      { text: '马年大吉！', author: '宅宅' },
      { text: '除夕快乐呀', author: '阿宅' },
      { text: '萌化了我的心', author: '萝莉控' },
      { text: 'awsl', author: '打call人' },
      { text: '祝大家万事如意', author: '追番人' },
      { text: '🐴 马到成功', author: '嗑糖人' },
      { text: '这也太萌了吧', author: '萌妹子' },
      { text: '我好了', author: '绅士' },
      { text: 'prpr', author: '颜控' },
      { text: '可爱即正义', author: '萌系控' },
    ],
  },

  // 推荐文章配置
  RECOMMEND: {
    // 推荐文章标签
    POST_TAG: 'Recommend',
    // 按更新时间排序
    SORT_BY_UPDATE_TIME: true,
  },

  // 萌化文章时间轴配置
  ARTICLE_TIMELINE: {
    // 是否启用
    ENABLE: true,
    // 指定标签（在 Notion 中为文章设置此标签即可显示）
    TAG: '时光',
    // 最大显示文章数
    MAX_POSTS: 6,
    // 是否显示分类
    SHOW_CATEGORY: false,
    // 是否交替显示标题和摘要（true: 封面图和文字信息交替显示在时间轴左右两侧，false: 所有内容都在卡片内）
    ALTERNATE_SUMMARY: true,
    // 是否只在首页显示
    ONLY_ON_INDEX: true,
  },

  // 萌化杂志轮播配置
  MAGAZINE_CAROUSEL: {
    // 是否启用
    ENABLE: true,
    // 最大显示文章数
    MAX_POSTS: 6,
    // 是否自动轮播
    AUTO_PLAY: true,
    // 轮播速度（毫秒，越小越快）
    AUTO_PLAY_INTERVAL: 3000,
    // 卡片宽度（像素）
    CARD_WIDTH: 280,
    // 卡片间距（像素）
    CARD_GAP: 16,
    // 是否只在首页显示
    ONLY_ON_INDEX: true,
    // 指定标签筛选（为空则显示所有文章）
    TAG: '必看精选',
    // 标题栏右侧动漫台词（为空则显示默认文本）
    QUOTE: '喵~发现好东西！',
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

  // 二次元萌化广告横幅配置（仅文章详情页显示）
  AD_BANNER: {
    // 是否启用广告横幅
    ENABLE: true,
    // 广告标题
    TITLE: '雨云 - 云服务器首选',
    // 广告副标题
    SUBTITLE: '稳定 · 高速 · 性价比超高',
    // 广告描述
    DESCRIPTION: '使用优惠码立享折扣，开启你的云端之旅~',
    // 推广链接
    LINK: 'https://www.rainyun.com/zqf_',
    // 优惠码
    CODE: 'zqf',
    // 特性标签
    FEATURES: ['一元试用', '秒级开通', '24h在线客服'],
    // 按钮文字
    BUTTON_TEXT: '立即访问',
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
    // 当前模型: 吸血姬 - 阴阳师
    MODEL_PATH: '/live2d/model/xixuegui_4/xixuegui_4.model3.json',
    // 画布宽度
    WIDTH: 330,
    // 画布高度
    HEIGHT: 400,
    // 模型缩放比例（相对于自动计算的尺寸）
    // 1.0 = 原始大小，2.0 = 2倍大小，建议范围 0.5-3.0
    SCALE: 1.2,
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
    // 建议值：300-500ms，较小的值让动作切换更流畅
    MOTION_FADE_IN: 300,
    // 动作淡出时间（毫秒）
    // 建议值：300-500ms，与淡入时间保持一致
    MOTION_FADE_OUT: 300,
    // 表情淡入时间（毫秒）
    EXPRESSION_FADE_IN: 400,
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
  },

  // 瀑布流布局配置
  MASONRY: {
    // 是否启用瀑布流布局
    ENABLE: true,
    // 列间距（像素）
    GAP: 24,
    // 响应式列数配置
    COLUMNS: {
      mobile: 1,   // 移动端
      tablet: 2,   // 平板
      desktop: 2,  // 桌面
      wide: 2      // 宽屏
    }
  },

  // 学习进度配置
  LEARNING_PROGRESS: {
    // 是否启用
    ENABLE: true,
    // 导航栏按钮文字
    BUTTON_TEXT: '我的学习进度',
    // 模态框标题
    TITLE: '我的学习进度',
    // 模态框副标题
    SUBTITLE: '记录每一步成长',
    // 指定标签（文章需要包含此标签才会显示）
    TAG: '标记学习状态',
    // 最大显示文章数
    MAX_POSTS: 5,
    // 是否显示日期
    SHOW_DATE: true,
    // 是否显示总体进度条
    SHOW_PROGRESS: true,
    // 底部文字
    FOOTER_TEXT: '学到吐,学到吐,学到吐',
    // 背景音乐配置
    MUSIC: {
      // 是否启用背景音乐
      ENABLE: true,
      // 音乐文件URL（可以是本地路径或网络链接）
      URL: 'https://blog-mcpq-music.oss-cn-guangzhou.aliyuncs.com/Agent%20Path.mp3',
      // 音量 (0-1)
      VOLUME: 0.8,
      // 是否循环播放
      LOOP: true,
    },
  },

  // 抖音解析配置
  DOUYIN: {
    // API 服务器地址
    API_URL: 'https://dy-api.joyb.cc',
    // 页面标题
    PAGE_TITLE: '抖音解析',
    // 页面副标题
    PAGE_SUBTITLE: '萌化工具箱',
    // 是否显示Hero区域
    SHOW_HERO: true,
    // 最大输入长度
    MAX_INPUT_LENGTH: 2000,
  },

  // 相册配置
  GALLERY: {
    // 是否启用相册
    ENABLE: true,
    // 相册标题
    TITLE: 'ANIME GALLERY',
    // 相册副标题（日文）
    SUBTITLE: 'アニメギャラリー',
    // 照片列表
    IMAGES: [
      {
        src: 'https://joyb.cc/wp-content/uploads/2024/07/20240721142542854-IMG20230502173944-scaled.jpg',
        title: '童话般的城堡气息',
        subtitle: '厦门方特附近的那些建筑，总带着一丝童话般的城堡气息。远远望去，仿佛每一座都有自己的故事。想必在里面工作的人，一定是幸福又惬意的吧。'
      },
      {
        src: 'https://joyb.cc/wp-content/uploads/2024/07/20240721142447624-IMG_20230306_234020-scaled.jpg',
        title: '海风和嘈杂的引擎声',
        subtitle: '厦门炳洲大桥公交站，伴着海风和嘈杂的引擎声，也承载着我无数个清晨的匆忙与思绪。'
      },
      {
        src: 'https://joyb.cc/wp-content/uploads/2025/02/20250226102427549-2025-2-25-1.jpg',
        title: '香气四溢的美食',
        subtitle: '这是我最喜欢的一道菜——香菇炒五花肉。因为喜欢，所以每次下厨我都格外用心，能把它做得香气四溢、味道恰到好处，每一口都让人满足。'
      },
      {
        src: 'https://joyb.cc/wp-content/uploads/2024/07/20240721142521100-IMG_20240206_163647.jpg',
        title: '为自己而作的工件',
        subtitle: '这是我亲手完成的第一个曲面工件。下课后自己跑到车间折腾出来的。过程中也遇到过失败——有一次甚至直接钻穿了工件，只因为在 UG 里把高度坐标设错了。'
      },
      {
        src: 'https://joyb.cc/wp-content/uploads/2024/07/20240721142603960-IMG20230502172804-scaled.jpg',
        title: '平平无奇的路边',
        subtitle: '厦门方特附近的一条普通马路.'
      },
      {
        src: 'https://joyb.cc/wp-content/uploads/2025/03/20250302072521520-学校种植薄荷实验.webp',
        title: '不同的因素产生不同的结果',
        subtitle: '薄荷种植实验，种植那些小小的植物。我们在泥土与绿叶之间忙碌着，笑声与讨论交织，那段时光温暖而纯粹，留下了难忘的记忆。'
      },
    ],
  },
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
