/* 团长闪剪 · 前端数据层（原型期 mock，接的是真实业务口径）
   ------------------------------------------------------------------
   规矩：页面里不许再手写数字和文案结论，一律从这里取 + 用 DERIVE 算。
   接真接口时，只替换 DATA 的来源即可（每块都标了应当来自哪个系统），
   页面渲染代码不用动。
   时间基准：mock 里用固定 NOW，接真接口后换成服务端时间。 */

window.DATA = {
  now: "2026-11-01T14:20:00+08:00",   // 服务端时间；页面上的"还剩几小时"按它算

  /* 账号系统 + 团队关系表 + 通知中心未读数 */
  me: {
    uid: "u_10027",
    name: "阿珍",
    city: "广东深圳",
    teamName: "前海臻选战队",
    teamSize: 12,          // 团队关系表：status=active 的成员数
    unread: 3,             // 通知中心：read_at is null 且 type in (assign, review, system)
    level: "金牌团长",
    fans: 3860,
    streakDays: 4          // SOP 打卡连续天数
  },

  /* 运营后台 · banner 位：按人群包 + 时间窗下发，每条必须带落地页 */
  banners: [
    {
      id: "bn_8831", img: "assets/bn-1.jpg", pos: "center 46%",
      badge: "今晚 20:00 开团",
      title: "磷虾油专场 · 团长专项价",
      sub: "库存 300 组 · 一键生成开团视频",
      btn: "去开团", go: "B1",
      audience: "全体团长",
      window: "11-01 12:00 ~ 11-01 22:00",
      expireAt: "2026-11-01T22:00:00+08:00"
    },
    {
      id: "bn_8814", img: "assets/bn-2.jpg", pos: "center 32%",
      badge: "新功能",
      title: "AI 帮你剪，3 分钟出一条",
      sub: "不用出镜，一张照片也能当主播",
      btn: "试一下", go: "B1",
      audience: "近 30 天发过视频的团长",
      window: "10-28 ~ 11-05",
      expireAt: "2026-11-05T23:59:59+08:00"
    },
    {
      id: "bn_8802", img: "assets/bn-3.jpg", pos: "center 50%",
      badge: "团队",
      title: "团长训练营 · 第 9 期报名",
      sub: "7 天起号 · 平台流量扶持",
      btn: "报名", go: "E1",
      audience: "团队人数 ≥ 5 的团长",
      window: "10-25 ~ 11-08",
      expireAt: "2026-11-08T23:59:59+08:00"
    },
    {
      /* 纯图片位：不带落地页，不显示按钮，用于品牌 / 公告展示 */
      id: "bn_8790", img: "assets/bn-2.jpg", pos: "center 30%",
      badge: "平台公告", poster: true,
      title: "11 月团价手册已更新",
      sub: "全品类供货价 · 见素材库公告",
      btn: "", go: "",
      audience: "全体团长",
      window: "11-01 ~ 11-30",
      expireAt: "2026-11-30T23:59:59+08:00"
    }
  ],

  /* 「今天必须做」三源合并
     asset_gap   ← 发布器草稿里标记 miss 的素材段
     team_assign ← 团队派发看板里 assignee=我 且未完成
     sop_checkin ← SOP 战役里今天到期且未打卡
     weight 是业务权重：会卡住发布的最高，纯打卡最低。 */
  tasks: [
    {
      id: "tk_2041", sys: "素材缺口", sysCode: "asset_gap", weight: 50,
      title: "补 1 段花字卡，磷虾油开团才能发",
      reason: "发布器里第 5 段标了「缺画面」，不补这条发不出去",
      deadline: "2026-11-01T23:59:59+08:00",
      owner: "发布器草稿",
      cta: { tx: "去补", go: "B2?mode=fix" }
    },
    {
      id: "tk_1987", sys: "团队派发", sysCode: "team_assign", weight: 30,
      title: "发 1 条「换季免疫力」主题视频",
      reason: "带团队话题发布才计入本周榜单，你当前 0/1",
      deadline: "2026-11-01T18:00:00+08:00",
      owner: "SOP 第 3 天",
      cta: { tx: "去剪", go: "B1" }
    },
    {
      id: "tk_1720", sys: "SOP 打卡", sysCode: "sop_checkin", weight: 10,
      title: "评论区回 5 条「孩子能吃吗」",
      reason: "断签会掉连续天数，当前已连 4 天",
      deadline: "2026-11-01T23:59:59+08:00",
      owner: "SOP 战役",
      cta: { tx: "去打卡", go: "D1" }
    },
    {
      id: "tk_2055", sys: "团队派发", sysCode: "team_assign", weight: 30,
      title: "把团队 Top1 视频改成本地话术",
      reason: "阿玲那条已跑 12.4 万，团队要求每人二创一版",
      deadline: "2026-11-02T12:00:00+08:00",
      owner: "队长 · 阿玲",
      cta: { tx: "去二创", go: "C1" }
    }
  ],

  /* 「今天发什么」助理建议池
     perf        ← 内容数据后台：同类结构近 7 天完播率（0~1，过程指标）
     cvr         ← 内容数据后台：同类结构近 7 天出单率（结果指标，权重最高）
     cvrTop      ← 该出单率在全库的排名分位（越小越好）
     relevance   ← 粉丝互动库：近 7 天评论/私信里问到该话题的次数
     cost        ← 素材库存：还需补拍几段（0 = 库里现成）
     productId   ← 同商品最多推 1 条，避免自己打自己 */
  suggestions: [
    {
      id: "sg_77", productId: "p_krill", product: "磷虾油",
      title: "磷虾油 · 3 秒开箱钩子",
      structure: "开箱 → 成分 → 价格",
      duration: 38, segs: 4, stockClips: 8,
      perf: 0.86, cvr: 0.052, cvrTop: 8, relevance: 9, cost: 0,
      why: "换季囤货期又赶上今晚开团，这条上周给你出了 12 单",
      source: "团队爆款结构", short: "爆款",
      cta: { tx: "生成", go: "B1" }
    },
    {
      id: "sg_78", productId: "p_immune", product: "换季免疫",
      title: "换季免疫 · 口播拆功效",
      structure: "问题 → 原理 → 用法",
      duration: 45, segs: 5, stockClips: 6,
      perf: 0.74, cvr: 0.038, cvrTop: 22, relevance: 12, cost: 1,
      why: "这周 12 个粉丝在问「孩子能吃吗」，这条正好答",
      source: "粉丝问题库", short: "问题",
      cta: { tx: "生成", go: "B1" }
    },
    {
      id: "sg_79", productId: "p_rebuy", product: "老客复购",
      title: "老客复购 · 晒单合集",
      structure: "晒单 → 复购理由 → 团价",
      duration: 32, segs: 3, stockClips: 12,
      perf: 0.91, cvr: 0.061, cvrTop: 5, relevance: 4, cost: 0,
      why: "团队这条今天跑了 12.4 万，你的老客也到复购期了",
      source: "剪同款现成", short: "同款",
      cta: { tx: "套用", go: "C1" }
    },
    {
      id: "sg_80", productId: "p_krill", product: "磷虾油",
      title: "磷虾油 · 老人能吃吗（答疑）",
      structure: "疑问 → 回答 → 引导下单",
      duration: 40, segs: 4, stockClips: 5,
      perf: 0.79, cvr: 0.031, cvrTop: 30, relevance: 15, cost: 2,
      why: "同一个问题被问了 15 次，做成视频比逐条回省力",
      source: "粉丝问题库", short: "问题",
      cta: { tx: "生成", go: "B1" }
    }
  ],

  /* ---------- 素材库 ----------
     接真接口：GET /assets?tags=&scope=
     tags 是语义标签，入库时由打标服务自动生成（人工可修正），
     配画面时就是靠它做「语义匹配」——不是靠文件名、不是靠用户自己找。
     from：my 我的 / team 团队共享 / brand 品牌方 / stock 平台图库 / ai AI 生成 */
  assets: [
    { id: "as_501", label: "手拿产品特写", from: "my", dur: 3, tags: ["product", "hand"], bg: "linear-gradient(150deg,#7C5CFF,#B08CFF)" },
    { id: "as_510", label: "我讲成分（口播）", from: "my", dur: 6, tags: ["ingredient", "person"], bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)" },
    { id: "as_511", label: "我的照片", from: "my", dur: 0, kind: "pip", tags: ["person"], bg: "linear-gradient(150deg,#7C5CFF,#2C5BFF)" },
    { id: "as_518", label: "工作台空镜", from: "my", dur: 8, tags: ["person", "broll"], bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)" },

    { id: "as_502", label: "产品摆台", from: "team", dur: 4, tags: ["product", "still"], bg: "linear-gradient(150deg,#00A8E8,#00C2FF)" },
    { id: "as_503", label: "开箱空镜", from: "team", dur: 7, tags: ["unbox", "product"], bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)" },
    { id: "as_506", label: "成交截图", from: "team", dur: 2, tags: ["proof"], bg: "linear-gradient(150deg,#2C5BFF,#00A8E8)" },
    { id: "as_512", label: "顾客反馈聊天", from: "team", dur: 3, tags: ["proof"], bg: "linear-gradient(150deg,#00C2FF,#5B8CFF)" },
    { id: "as_513", label: "仓库发货", from: "team", dur: 5, tags: ["product", "unbox"], bg: "linear-gradient(150deg,#5B8CFF,#2C5BFF)" },

    { id: "as_508", label: "团价对比图", from: "stock", dur: 4, tags: ["cta", "price"], bg: "linear-gradient(150deg,#F5A623,#FFC85B)" },
    { id: "as_514", label: "海洋实拍空镜", from: "stock", dur: 5, tags: ["nature", "broll"], bg: "linear-gradient(150deg,#00A8E8,#5B8CFF)" },
    { id: "as_515", label: "手写字幕背景", from: "stock", dur: 3, tags: ["textcard"], bg: "linear-gradient(150deg,#2C5BFF,#7C5CFF)" },

    { id: "as_504", label: "成分特写（AI）", from: "ai", dur: 3, tags: ["ingredient"], bg: "linear-gradient(150deg,#7C5CFF,#2C5BFF)" },
    { id: "as_507", label: "花字卡 · 今晚开团", from: "ai", dur: 3, kind: "textcard", tags: ["cta", "textcard"], bg: "linear-gradient(150deg,#2C5BFF,#00C2FF)" },
    { id: "as_516", label: "血管示意动画", from: "ai", dur: 4, tags: ["ingredient", "explain"], bg: "linear-gradient(150deg,#00C2FF,#00A8E8)" },

    { id: "as_509", label: "品牌官片 · 卖点", from: "brand", dur: 10, tags: ["brand", "product"], bg: "linear-gradient(150deg,#5B3FD1,#7C5CFF)" }
  ],

  /* ---------- 草稿：段落模型 ----------
     一条视频 = N 个段落。每个段落 = 1 条台词（脚本段，vo） + 0..n 个画面（素材段，shots）
     · 段落时长由台词配音时长决定（dur），素材只负责铺满，不改变时长
     · 素材总长 ≠ 台词时长时：不足循环末段、超出截尾，差 ≥2s 提示「素材偏短/偏长」
     · lock="brand" 的段台词不可改、画面不可删，只能调顺序
     · 台词有版本（vo / voAlt），可回滚，改台词与换画面互不影响 */
  draft: {
    id: "df_3021",
    title: "磷虾油今晚开团",
    productId: "p_krill",
    product: "磷虾油",
    status: "draft",              // draft | generating | ready | published
    updatedAt: "2026-11-01T14:02:00+08:00",
    curSeg: "sg02",               // 预览停在哪一段
    compliance: { ok: true, hits: [], checkedAt: "2026-11-01T14:02:00+08:00" },
    segments: [
      {
        id: "sg01", role: "hook", name: "我是谁 · 立信任", dur: 8,
        vo: "我是阿珍，做大健康选品 5 年。", voSrc: "self",
        needTags: ["person", "broll"], lock: null,
        hint: "用你自己的空镜或照片打底，人先出现在画面上，后面说什么才有人听",
        shots: [{ id: "sh_101", asset: "as_518", dur: 8, pip: true }]
      },
      {
        id: "sg02", role: "explain", name: "磷虾油是什么", dur: 14,
        vo: "今晚开团磷虾油，选购门道一次讲清楚。", voSrc: "self",
        voAlt: "今晚开团磷虾油，选购门道一次讲清楚——从原料、含量到认准标志，三步教你不踩坑。",
        voAltSrc: "ai",
        needTags: ["product", "hand"], lock: null,
        hint: "拍你手拿产品的特写（顺手 3 秒即可），再配一个团队库特写",
        shots: [
          { id: "sh_201", asset: "as_501", dur: 3 },
          { id: "sh_202", asset: "as_502", dur: 4 },
          { id: "sh_203", asset: "as_503", dur: 7 }
        ]
      },
      {
        id: "sg03", role: "explain", name: "血管知识示意", dur: 8,
        vo: "每粒含磷脂型 Omega-3，吸收比普通鱼油更好。", voSrc: "self",
        needTags: ["ingredient", "explain"], lock: null,
        hint: "这段讲原理，用示意动画比真人讲更清楚，也更容易过审",
        shots: [
          { id: "sh_301", asset: "as_516", dur: 4 },
          { id: "sh_302", asset: "as_504", dur: 3 }
        ]
      },
      {
        id: "sg04", role: "brand", name: "产品落卖点", dur: 10,
        vo: "品牌方提供的卖点口播，锁定不可改。", voSrc: "brand",
        needTags: ["brand"], lock: "brand",
        hint: "品牌方锁定的必播片段，只能调顺序",
        shots: [{ id: "sh_401", asset: "as_509", dur: 10 }]
      },
      {
        id: "sg05", role: "cta", name: "CTA · 开团", dur: 6,
        vo: "点我头像参团，只有 500 单。", voSrc: "self",
        needTags: ["cta", "textcard"], lock: null,
        hint: "结尾要有花字卡写清价格和开团时间，观众才知道怎么买",
        shots: [{ id: "sh_501", asset: null, label: "花字卡", state: "miss", dur: 0 }]
      }
    ]
  },

  /* ---------- 剪同款二创：同一段落模型，每段多一个「原文案」 ----------
     来源是别人的视频，所以段落是"拆出来的"，不是"写出来的"：
     orig = 原片口播，vo = 我要改成的话，suggest = AI 判断这段要不要改 */
  draftRemix: {
    id: "df_2880",
    title: "阿玲爆款 · 二创版",
    kind: "remix",
    productId: "p_krill", product: "磷虾油",
    status: "draft",
    updatedAt: "2026-11-01T13:05:00+08:00",
    curSeg: "rs03",
    compliance: { ok: true, hits: [], checkedAt: "2026-11-01T13:05:00+08:00" },
    /* 来源片信息：团队动态流里的原片 + 二创安全度 */
    source: {
      who: "阿玲", plays: 124000, title: "磷虾油开箱 · 我妈也在吃",
      safety: 62, changed: 2, needChange: 2
    },
    segments: [
      {
        id: "rs01", role: "hook", name: "开场提问", dur: 9,
        orig: "磷虾油到底值不值得买？", vo: "你知道磷虾油和鱼油差在哪吗？", suggest: "换",
        needTags: ["product", "still"], lock: null, hint: "换成你自己的开场画面，别用原片开头",
        shots: [{ id: "rm_101", asset: "as_502", dur: 9 }]
      },
      {
        id: "rs02", role: "explain", name: "成分讲解", dur: 8,
        orig: "这个成分是真的猛。", vo: "这个成分是真的猛。", suggest: "",
        needTags: ["ingredient"], lock: null, hint: "成分段用示意动画，别用真人出镜",
        shots: [{ id: "rm_201", asset: "as_504", dur: 4 }, { id: "rm_202", asset: "as_516", dur: 4 }]
      },
      {
        id: "rs03", role: "proof", name: "使用感受", dur: 9,
        orig: "我吃了三个月，真的绝了，睡眠好了很多……",
        vo: "我自己吃了两个月，最明显的是早上起来不那么累。", suggest: "换",
        needTags: ["person"], lock: null, hint: "这段是原作者的出镜表述，必须换成你自己的话和画面",
        shots: [{ id: "rm_301", asset: "as_511", dur: 9, pip: true }]
      },
      {
        id: "rs04", role: "proof", name: "对比", dur: 8,
        orig: "比我之前买的那个强太多了。", vo: "比之前那款腥味小很多，也更好吸收。", suggest: "换",
        needTags: ["product", "hand"], lock: null, hint: "对比要克制，别贬低别人家产品",
        shots: [{ id: "rm_401", asset: "as_501", dur: 3 }, { id: "rm_402", asset: "as_503", dur: 5 }]
      },
      {
        id: "rs05", role: "cta", name: "团购引导", dur: 10,
        orig: "赶紧囤，链接在评论区。", vo: "赶紧囤，链接在评论区。", suggest: "",
        needTags: ["price", "cta"], lock: null, hint: "价格和开团时间要说清",
        shots: [{ id: "rm_501", asset: "as_508", dur: 4 }, { id: "rm_502", asset: "as_506", dur: 2 }, { id: "rm_503", asset: "as_512", dur: 4 }]
      },
      {
        id: "rs06", role: "cta", name: "结尾花字", dur: 8,
        orig: "扣 1，我私发你。", vo: "想试的直接扣 1，我发你配料表。", suggest: "务必改",
        needTags: ["textcard", "cta"], lock: null, hint: "结尾必须有花字卡写清参团方式",
        shots: [{ id: "rm_601", asset: null, label: "花字卡", state: "miss", dur: 0 }]
      }
    ]
  },

  /* ---------- SOP 系列：同一段落模型，多一个系列进度 ----------
     总部定主题和节奏，团长只填自己的话；素材与话术按天备好 */
  draftSeries: {
    id: "df_3102",
    title: "磷虾油战役 · Day 5 信任背书",
    kind: "series",
    productId: "p_krill", product: "磷虾油",
    status: "draft",
    updatedAt: "2026-11-01T13:10:00+08:00",
    curSeg: "se02",
    compliance: { ok: true, hits: [], checkedAt: "2026-11-01T13:10:00+08:00" },
    series: { name: "磷虾油 10 天战役", day: 5, total: 10, topic: "信任背书", owner: "总部 · 运营中心" },
    segments: [
      {
        id: "se01", role: "trust", name: "我是谁 · 立信任", dur: 8,
        vo: "我是阿珍，做大健康选品 5 年。", needTags: ["person", "broll"], lock: null,
        hint: "每天开头都用这段，观众才记得住你",
        shots: [{ id: "ss_101", asset: "as_518", dur: 8, pip: true }]
      },
      {
        id: "se02", role: "hook", name: "今天讲什么", dur: 6,
        vo: "第 5 天讲信任——为什么我敢一直推这一款。", needTags: ["product"], lock: null,
        hint: "报出天数和主题，让人觉得你在系统地讲",
        shots: [{ id: "ss_201", asset: "as_502", dur: 4 }, { id: "ss_202", asset: "as_513", dur: 2 }]
      },
      {
        id: "se03", role: "proof", name: "顾客反馈", dur: 10,
        vo: "上周有 37 个老客回购，这条是她们的原话。", needTags: ["proof"], lock: null,
        hint: "用真实的反馈截图，打码后再用",
        shots: [{ id: "ss_301", asset: "as_512", dur: 3 }, { id: "ss_302", asset: "as_506", dur: 2 }, { id: "ss_303", asset: "as_503", dur: 5 }]
      },
      {
        id: "se04", role: "explain", name: "我的观点", dur: 10,
        vo: "我不推荐所有人都吃，先看你是否真的需要。", needTags: ["person"], lock: null,
        hint: "敢说「不是人人都要」，信任才立得住",
        shots: [{ id: "ss_401", asset: "as_511", dur: 10, pip: true }]
      },
      {
        id: "se05", role: "cta", name: "CTA · 开团", dur: 6,
        vo: "今晚 8 点开团，点我头像进。", needTags: ["cta", "textcard"], lock: null,
        hint: "结尾花字卡写清开团时间和价格",
        shots: [{ id: "ss_501", asset: "as_507", dur: 3 }, { id: "ss_502", asset: "as_508", dur: 3 }]
      }
    ]
  },

  /* 团队动态流：只取本团队、近 24h、已发布视频，按播放量倒序 */
  teamVideos: [
    { id: "v_901", who: "阿玲", whoBg: "rgba(44,91,255,.92)", plays: 124000, title: "磷虾油开箱 · 我妈也在吃", ago: "2 小时前", bg: "linear-gradient(135deg,#2C5BFF,#00C2FF)", go: "F3" },
    { id: "v_898", who: "阿强", whoBg: "rgba(124,92,255,.92)", plays: 86000, title: "客户复购实录 · 第 3 次买", ago: "5 小时前", bg: "linear-gradient(135deg,#7C5CFF,#B08CFF)", go: "F3" },
    { id: "v_890", who: "小雨", whoBg: "rgba(0,168,232,.92)", plays: 52000, title: "换季话术 · 3 句话讲完", ago: "昨天", bg: "linear-gradient(135deg,#00A8E8,#5B8CFF)", go: "F3" }
  ],

  /* 新用户「同行都在这么发」：平台内容池
     只取「同类目 + 同粉丝量级 + 近 7 天完播率最高」的 3 条，给新人有样可抄 */
  newbieCases: [
    { id: "nc_21", who: "阿玲", whoBg: "rgba(44,91,255,.92)", plays: 124000, title: "开箱第一句就说价格", sub: "新手最容易抄的一条", bg: "linear-gradient(135deg,#2C5BFF,#00C2FF)", go: "F3" },
    { id: "nc_22", who: "阿强", whoBg: "rgba(124,92,255,.92)", plays: 86000, title: "先讲问题再讲产品", sub: "完播率最高结构", bg: "linear-gradient(135deg,#7C5CFF,#B08CFF)", go: "F3" },
    { id: "nc_23", who: "小雨", whoBg: "rgba(0,168,232,.92)", plays: 52000, title: "晒单 + 一句我的感受", sub: "不用出镜也能拍", bg: "linear-gradient(135deg,#00A8E8,#5B8CFF)", go: "F3" }
  ],

  /* 平台精选：运营后台专题位，按人群包下发 */  platformPicks: [
    { id: "tp_31", img: "assets/bn-2.jpg", pos: "center 34%", title: "秋季滋补专题", sub: "12 条现成素材 · 平台已过审", go: "F1", audience: "全体团长" },
    { id: "tp_28", img: "assets/bn-1.jpg", pos: "center 44%", title: "高转化开箱合集", sub: "照着结构改就能发", go: "F1", audience: "近 7 天有发布的团长" }
  ]
};

/* ------------------------------------------------------------------
   派生逻辑：页面只拿 DERIVE 的结果，不自己算、不自己排
   以后换真接口，这段逻辑搬去后端即可，输出结构不变。 */
window.DERIVE = (function () {
  const HOUR = 3600 * 1000;
  const now = () => new Date(window.DATA.now).getTime();

  /* 今天必须做：先按业务权重（是否卡住发布），再按剩余时长升序 */
  function mustDo(limit) {
    const t = now();
    return window.DATA.tasks
      .filter((x) => new Date(x.deadline).getTime() >= t - 6 * HOUR) // 过期 6 小时内仍提醒
      .map((x) => {
        const leftH = (new Date(x.deadline).getTime() - t) / HOUR;
        return { ...x, leftH, score: x.weight + Math.max(0, 48 - leftH) * 2 };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit || 3);
  }

  /* 今天发什么：出单率 45% + 完播 15% + 相关度 25% + 素材成本 15%，同商品只留一条
     为什么出单率权重最高：完播是过程指标，团长的目标是出单，不能只推"看得爽"的选题 */
  function todayPost(limit) {
    const picked = [], usedProduct = {};
    const maxCvr = Math.max(...window.DATA.suggestions.map((s) => s.cvr));
    const scored = window.DATA.suggestions
      .map((s) => ({
        ...s,
        score: Math.round(
          (s.cvr / maxCvr) * 45 +
          s.perf * 15 +
          Math.min(s.relevance / 15, 1) * 25 +
          (1 - s.cost / 4) * 15
        )
      }))
      .sort((a, b) => b.score - a.score);
    for (const s of scored) {
      if (usedProduct[s.productId]) continue;
      usedProduct[s.productId] = 1;
      picked.push(s);
      if (picked.length >= (limit || 3)) break;
    }
    return picked;
  }

  /* banner：只下发在时间窗内、且没过期的 */
  function banners() {
    const t = now();
    return window.DATA.banners.filter((b) => new Date(b.expireAt).getTime() > t);
  }

  /* 团队最新：近 24h + 播放量倒序 */
  function teamVideos(limit) {
    return window.DATA.teamVideos.slice(0, limit || 3);
  }

  /* 新用户同行案例：同池子取前 N，按播放量倒序 */
  function newbieCases(limit) {
    return window.DATA.newbieCases
      .slice()
      .sort((a, b) => b.plays - a.plays)
      .slice(0, limit || 3);
  }

  /* ================= 段落模型（B2 发布器 / B2.1 素材选择器） =================
     一条视频 = N 个段落；段落 = 台词（脚本段） + 画面（素材段）。
     页面只拿这里的结果渲染，不自己算段落状态。 */

  const SRC_W = { my: 4, team: 3, brand: 3, stock: 2, ai: 1 };   // 来源可信度权重
  const SRC_TX = { my: "我的", team: "团队", brand: "品牌", stock: "图库", ai: "AI" };

  function mmss(sec) {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  }

  /* 按素材范围取池子：rec = 推荐（按语义匹配），其余按来源过滤 */
  function pool(scope) {
    const A = window.DATA.assets;
    return !scope || scope === "rec" ? A : A.filter((a) => a.from === scope);
  }

  /* 语义匹配：重合标签数 × 10 + 来源权重；同分取时长更短的（更好铺满段落）
     scope="rec" 时只保留有语义重合的，其余 tab 不过滤 */
  function recommend(seg, scope) {
    const need = seg.needTags || [];
    return pool(scope)
      .map((a) => {
        const overlap = a.tags.filter((t) => need.includes(t)).length;
        return { ...a, overlap, score: overlap * 10 + (SRC_W[a.from] || 0), srcTx: SRC_TX[a.from] || "" };
      })
      .filter((a) => (scope && scope !== "rec" ? true : a.overlap > 0))
      .sort((a, b) => b.score - a.score || a.dur - b.dur);
  }

  /* 缺素材的四条出路：按「一次点击能解决」的先后排，P1 最省事、P4 质量最好
     ok=false 表示这条路对这个段不可用（品牌锁定段改不了台词 / 库里没有相近片段） */
  function resolveFix(seg) {
    const hits = recommend(seg, "rec");
    const locked = seg.lock === "brand";
    return [
      { key: "reuse", p: 1, tx: "从库里选", go: "B2.1?seg=" + seg.id, ok: hits.length > 0,
        note: hits.length ? "库里有 " + hits.length + " 段语义相近的，最像的是「" + hits[0].label + "」" : "库里没有语义相近的片段" },
      { key: "reword", p: 2, tx: "换说法免素材", ok: !locked,
        note: locked ? "品牌锁定段不能改台词" : "AI 重写这段台词，去掉对画面的依赖；会重新过一遍合规" },
      { key: "aigen", p: 3, tx: "✦ AI 补画面", ok: !locked,
        note: "按台词生成一段画面；健康品类涉及功效暗示的画面必须人工确认后才能用" },
      { key: "shoot", p: 4, tx: "＋ 现拍 3 秒", go: "B2.2", ok: true,
        note: "质量最好，但要自己动手，是四条路里最慢的一条" }
    ];
  }

  /* 三种来源 → 三份草稿，共用同一套段落结构与派生逻辑。
     这就是"三个发布器合成一个"的数据基础：换的是来源，不是编辑器。 */
  const DRAFT_OF = { script: "draft", remix: "draftRemix", series: "draftSeries" };
  const KINDS = [
    { k: "script", ic: "✎", tx: "AI 脚本" },
    { k: "remix", ic: "⧉", tx: "二创" },
    { k: "series", ic: "▤", tx: "系列" }
  ];

  function draft(kind) {
    const k = DRAFT_OF[kind] ? kind : "script";
    const d = window.DATA[DRAFT_OF[k]];
    let acc = 0;
    const segs = d.segments.map((s, i) => {
      const start = acc;
      acc += s.dur;
      let shotTotal = 0, missN = 0;
      const shots = s.shots.map((sh) => {
        const a = sh.asset ? window.DATA.assets.filter((x) => x.id === sh.asset)[0] : null;
        const miss = sh.state === "miss";
        const dur = sh.dur != null ? sh.dur : (a ? a.dur : 0);
        if (miss) missN++; else shotTotal += dur;
        return {
          ...sh, dur, miss,
          label: sh.label || (a ? a.label : "待补画面"),
          bg: a ? a.bg : "",
          from: a ? a.from : "",
          pip: sh.pip || (!!a && a.kind === "pip")
        };
      });
      /* 标签只标「用户需要知道」的：来源不是他自己拍的，或者有缺口 */
      const tags = [];
      if (shots.some((x) => x.pip)) tags.push(["p", "画中画"]);
      if (s.lock === "brand") tags.push(["", "品牌锁定"]);
      if (shots.some((x) => x.from === "ai")) tags.push(["a", "AI 生成"]);
      if (missN) tags.push(["r", "缺素材"]);
      if (s.suggest) tags.push([s.suggest === "务必改" ? "r" : "o", s.suggest]);
      return {
        ...s, no: (i + 1 < 10 ? "0" : "") + (i + 1), idx: i,
        start, shots, shotTotal, missN, tags,
        fit: Math.round((s.dur - shotTotal) * 10) / 10,
        state: missN ? "miss" : ""
      };
    });
    const total = segs.reduce((n, s) => n + s.dur, 0);
    segs.forEach((s) => { s.code = mmss(s.start + 4) + " / " + mmss(total); });
    const missSegs = segs.filter((s) => s.missN > 0);
    const curIdx = Math.max(0, segs.map((s) => s.id).indexOf(d.curSeg));
    const cur = segs[curIdx];
    /* 二创安全度：服务端按「画面相似度 + 文案相似度」算，这里按已改段数做前端估算，
       只用于原型演示，真实值以后端返回为准（改了文案但没换画面，分不会涨太多） */
    const changed = segs.filter((s) => s.orig && s.vo !== s.orig).length;
    const needChange = segs.filter((s) => s.suggest).length;
    return {
      ...d, kind: k, segments: segs, cur, curIdx,
      segCount: segs.length, durTotal: total,
      missCount: missSegs.reduce((n, s) => n + s.missN, 0),
      missSegs, changed, needChange,
      safety: k === "remix" ? Math.min(95, 38 + changed * 6) : null,
      code: mmss(cur.start + 4) + " / " + mmss(total),
      track: segs.map((s) => [s.dur, ""]),
      /* 缺素材不阻断「生成预览」，但阻断「发布」——预览/发布是两道门 */
      canPreview: true,
      canPublish: missSegs.length === 0
    };
  }

  /* 数字口径统一在这里格式化，页面不再各写一套 */
  function plays(n) {
    return n >= 10000 ? (n / 10000).toFixed(1).replace(/\.0$/, "") + "万" : String(n);
  }
  function leftText(h) {
    if (h <= 0) return "已过期";
    if (h < 1) return "还剩 " + Math.round(h * 60) + " 分钟";
    if (h < 24) return Math.round(h) + " 小时";
    return Math.ceil(h / 24) + " 天";
  }
  /* 推荐理由：由推荐服务生成（LLM 写 + 数据校验），前端只展示，不自己拼
     生成时必须满足：① 说清"为什么是今天" ② 至少引用一个真实事实 ③ 不超过 2 行 */
  function reason(s) {
    return s.why || "这条和你上周的爆款结构一致";
  }
  function meta(s) {
    const stock = s.cost === 0
      ? s.stockClips + " 条素材可用"
      : "缺 " + s.cost + " 段素材";
    return s.duration + " 秒 · " + s.segs + " 段 · " + stock;
  }

  return { mustDo, todayPost, banners, teamVideos, newbieCases, plays, leftText, reason, meta, now,
           draft, recommend, resolveFix, mmss, pool, KINDS };
})();
