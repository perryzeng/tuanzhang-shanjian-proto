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
    name: "暴富者",
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
      owner: "SOP 主题系列",
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
        vo: "我是暴富者，做大健康选品 5 年。", voSrc: "self",
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
    title: "磷虾油系列 · Day 5 信任背书",
    kind: "series",
    productId: "p_krill", product: "磷虾油",
    status: "draft",
    updatedAt: "2026-11-01T13:10:00+08:00",
    curSeg: "se02",
    compliance: { ok: true, hits: [], checkedAt: "2026-11-01T13:10:00+08:00" },
    series: { name: "磷虾油 10 天系列", day: 5, total: 10, topic: "信任背书", owner: "总部 · 运营中心",
              yesterday: { day: 4, topic: "谁适合谁不适合", vo: "第 4 天讲的是谁适合——今天换个角度，讲我为什么敢一直推。" } },
    segments: [
      {
        id: "se01", role: "trust", name: "我是谁 · 立信任", dur: 8,
        vo: "我是暴富者，做大健康选品 5 年。", needTags: ["person", "broll"], lock: null, fixed: true,
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
        vo: "今晚 8 点开团，点我头像进。", needTags: ["cta", "textcard"], lock: null, fixed: true,
        hint: "结尾花字卡写清开团时间和价格",
        shots: [{ id: "ss_501", asset: "as_507", dur: 3 }, { id: "ss_502", asset: "as_508", dur: 3 }]
      }
    ]
  },

  /* ---------- 脚本库 ----------
     接真接口：GET /scripts?scope=my|team|brand
     和素材库是两回事：素材库存画面，脚本库存「已经分好段的台词」。
     团长要复用一条跑过单的脚本，比让 AI 重新写更稳。
     scope：my 我存的 / team 团队共享 / brand 总部统一口径（locked） */
  scriptLib: [
    {
      id: "sc_312", scope: "my", who: "我", title: "磷虾油 · 三步讲清成分",
      product: "磷虾油", segs: 5, dur: 46, used: 12, at: "10-28", compliance: true,
      tags: ["口播", "成分"], note: "跑过 12 单，结尾是开团话术",
      lines: [
        { name: "我是谁 · 立信任", dur: 8, vo: "我是暴富者，做大健康选品 5 年。" },
        { name: "磷虾油是什么", dur: 14, vo: "今晚开团磷虾油，选购门道一次讲清楚。" },
        { name: "血管知识示意", dur: 8, vo: "每粒含磷脂型 Omega-3，吸收比普通鱼油更好。" },
        { name: "产品落卖点", dur: 10, vo: "品牌方提供的卖点口播，锁定不可改。", lock: "brand" },
        { name: "CTA · 开团", dur: 6, vo: "点我头像参团，只有 500 单。" }
      ]
    },
    {
      id: "sc_318", scope: "my", who: "我", title: "老客复购 · 晒单三连",
      product: "磷虾油", segs: 3, dur: 32, used: 7, at: "10-24", compliance: true,
      tags: ["晒单", "复购"], note: "不用出镜，全是截图和空镜",
      lines: [
        { name: "开场晒单", dur: 10, vo: "这三个老客，这个月第三次下单了。" },
        { name: "复购理由", dur: 14, vo: "她们说的最多的一句是：比以前那款好吞。" },
        { name: "CTA · 团价", dur: 8, vo: "老客直接拍，今晚团价截止到 12 点。" }
      ]
    },
    {
      id: "sc_402", scope: "team", who: "阿玲", title: "开箱第一句先说价格",
      product: "磷虾油", segs: 4, dur: 38, used: 23, at: "10-30", compliance: true,
      tags: ["爆款结构"], note: "团队播放最高，改 2 句就能发",
      lines: [
        { name: "开场报价", dur: 8, vo: "这一瓶合下来一天不到 3 块钱。" },
        { name: "开箱", dur: 12, vo: "拆开看看里面是什么，两瓶装还有一板分装。" },
        { name: "成分", dur: 10, vo: "重点是磷脂型 Omega-3，不用再另外补鱼油。" },
        { name: "CTA", dur: 8, vo: "链接放评论区了，今晚 8 点开团。" }
      ]
    },
    {
      id: "sc_407", scope: "team", who: "阿强", title: "换季免疫 · 问题先行",
      product: "换季免疫", segs: 5, dur: 45, used: 15, at: "10-29", compliance: true,
      tags: ["问题结构"], note: "先抛粉丝问题再回答，互动率高",
      lines: [
        { name: "抛问题", dur: 8, vo: "最近最多人问我的一个问题：孩子能吃吗？" },
        { name: "给答案", dur: 10, vo: "先看年龄，再看剂量，别自己加量。" },
        { name: "讲原理", dur: 10, vo: "换季容易中招，主要是作息和营养跟不上。" },
        { name: "怎么用", dur: 9, vo: "我的做法是早饭后一粒，配温水。" },
        { name: "CTA", dur: 8, vo: "想要配料表的扣 1，我私发你。" }
      ]
    },
    {
      id: "sc_415", scope: "team", who: "小雨", title: "仓库发货 · 一句我的感受",
      product: "磷虾油", segs: 4, dur: 36, used: 9, at: "10-26", compliance: true,
      tags: ["不用出镜"], note: "仓库实拍，加一句自己的话",
      lines: [
        { name: "仓库实拍", dur: 8, vo: "今天的单已经堆到门口了。" },
        { name: "打包过程", dur: 10, vo: "每一单都塞了一张手写卡。" },
        { name: "我的感受", dur: 10, vo: "说实话我没想到这一款能卖这么久。" },
        { name: "CTA", dur: 8, vo: "想试的趁这波团价，点我头像。" }
      ]
    },
    {
      id: "sc_501", scope: "brand", who: "总部", title: "换季免疫 · 官方口径（锁定）",
      product: "换季免疫", segs: 4, dur: 40, used: 31, at: "10-31", compliance: true, locked: true,
      tags: ["锁定"], note: "统一口径，第 2 段不可改",
      lines: [
        { name: "开场", dur: 8, vo: "换季这段时间，最该先稳住的是作息。" },
        { name: "官方表述", dur: 12, vo: "本品为普通食品，不能替代药物。", lock: "brand" },
        { name: "怎么吃", dur: 10, vo: "每天一粒，早饭后温水送服。" },
        { name: "CTA", dur: 10, vo: "团购链接在视频下方，库存有限。" }
      ]
    }
  ],

  /* ---------- 视频导入记录 ----------
     接真接口：GET /imports（只留最近 5 条，超过就滚掉）
     state：done 抽取完成 / doing 抽取中 / fail 没识别到人声 */
  imports: [
    { id: "im_41", title: "磷虾油开箱 · 我妈也在吃", from: "链接 · 抖音", who: "阿玲", dur: 52, segs: 6, at: "今天 13:05", state: "done", go: "C1.2" },
    { id: "im_38", title: "仓库实拍 · 发货流水线", from: "本地相册", who: "我", dur: 38, segs: 4, at: "昨天 19:20", state: "done", go: "C1.2" },
    { id: "im_35", title: "顾客语音备忘", from: "本地相册", who: "我", dur: 0, segs: 0, at: "10-29", state: "fail", go: "C1" }
  ],

  /* ---------- 当前这一次抽取的结果 ----------
     接真接口：POST /extract → 返回 { chars, segs, lines[], cleaned[] }
     cleaned 是「原作者的痕迹」，抽取时必须清掉，否则二创会被判搬运 */
  extract: {
    id: "ex_41", from: "链接 · 抖音", who: "阿玲", title: "磷虾油开箱 · 我妈也在吃",
    chars: 312, dur: 52, segs: 6,
    cleaned: [
      { k: "口头禅「真的绝了」", n: 2 },
      { k: "原作者的自我介绍", n: 1 },
      { k: "原片字幕水印", n: 1 }
    ],
    lines: [
      { name: "开场提问", dur: 9, vo: "磷虾油到底值不值得买？" },
      { name: "成分讲解", dur: 8, vo: "这个成分是真的猛。" },
      { name: "使用感受", dur: 9, vo: "我吃了三个月，真的绝了，睡眠好了很多……",
        clean: "我吃了三个月，睡眠好了很多……" },
      { name: "对比", dur: 8, vo: "比我之前买的那个强太多了。" },
      { name: "团购引导", dur: 10, vo: "赶紧囤，链接在评论区。" },
      { name: "结尾", dur: 8, vo: "扣 1，我私发你。" }
    ]
  },

  /* ---------- SOP 战役 ----------
     接真接口：GET /campaigns（总部下发的 + 团长自建的）
     一天一个主题，团长只填自己的话；topics 是天级选题，
     today 只有「正在跑的那个战役的今天」才有，其余天进去由 AI 按主题现写。 */
  campaigns: [
    {
      id: "cp_1", name: "磷虾油 10 天系列", product: "磷虾油",
      owner: "总部 · 运营中心", total: 10, day: 5, startAt: "10-28", status: "running",
      joined: 86, mine: 4,
      topics: ["为什么选这款", "成分怎么讲", "含量看哪里", "谁适合谁不适合", "信任背书", "老客晒单", "常见问题答疑", "团价怎么算", "拍一单看看", "收官复盘"],
      today: {
        why: "前四天讲的是产品，第五天要讲人。观众信的不是参数，是「你自己吃不吃、家里人吃不吃」。",
        points: [
          "先说自己吃了多久、身体有什么变化（只说感受，不说疗效）",
          "再放一条真实顾客反馈截图，打码后用",
          "敢说「不是人人都需要」，信任才立得住"
        ],
        material: "总部备了仓库发货 + 顾客反馈截图 3 段，缺一段你的手部特写",
        ref: "同战役前 4 天平均完播 41%，晒单类高于均值 12 个点"
      }
    },
    {
      id: "cp_2", name: "换季免疫 7 天系列", product: "换季免疫",
      owner: "总部 · 运营中心", total: 7, day: 0, startAt: "11-05", status: "soon",
      joined: 0, mine: 0,
      topics: ["换季最容易忽略的一件事", "谁最需要补", "孩子能吃吗", "怎么吃不浪费", "我家的做法", "顾客真实反馈", "收官 · 团价"]
    },
    {
      id: "cp_3", name: "老客复购 14 天", product: "磷虾油",
      owner: "我自建", total: 14, day: 14, startAt: "10-10", status: "done",
      joined: 0, mine: 14,
      topics: ["为什么老客会回头", "第一次买的人最担心什么", "怎么提醒复购不烦人", "晒单怎么挑", "价格敏感期怎么讲", "囤货节奏", "送礼场景", "家庭装怎么配", "断货怎么说", "新品怎么接", "老带新怎么开口", "售后怎么处理", "年度复盘", "下一轮预告"]
    }
  ],

  /* SOP 系列落地页顶部的三个数字
     接真接口：内容数据后台按月聚合（published / avg_completion），
     连续天数取打卡表，别用前端算——用户换设备要一致 */
  seriesStats: {
    published: 18,        // 本月已发集数
    monthTarget: 26,      // 本月目标（总部给战役定的节奏）
    avgCompletion: 41,    // 已发集的平均完播率（%）
    bestTopic: "信任背书"
  },

  /* 新建系列时 AI 排选题用的「整条弧线」，每个品都是按 14 天排好的顺序：
     前段铺垫（为什么/是什么）→ 中段立信任（谁适合/反馈）→ 后段收单（价格/CTA）
     排 7 天就取前 6 + 收尾，排 10 天取前 9 + 收尾——顺序不动，只砍中间。
     这样不管几天，讲故事的节奏是对的；接真接口后换成按品 + 人群动态生成的选题。 */
  topicSeeds: {
    "磷虾油": ["为什么选这款", "成分怎么讲", "含量看哪里", "谁适合谁不适合", "信任背书", "老客晒单",
             "常见问题答疑", "怎么吃不浪费", "团价怎么算", "拍一单看看", "送礼场景", "断货怎么说",
             "老客复购怎么提醒", "收官复盘"],
    "换季免疫": ["换季最容易忽略的一件事", "谁最需要补", "成分有什么不一样", "孩子能吃吗", "怎么吃才不浪费",
              "我家的做法", "常见误区", "和其他补剂怎么搭", "顾客真实反馈", "价格值不值",
              "囤货节奏", "送礼怎么讲", "老客回访", "收官 · 团价"],
    "老客复购": ["为什么老客会回头", "第一次买的人最担心什么", "怎么提醒复购不烦人", "晒单怎么挑",
              "价格敏感期怎么讲", "囤货节奏", "送礼场景", "家庭装怎么配", "断货怎么说", "新品怎么接",
              "老带新怎么开口", "售后怎么处理", "年度复盘", "下一轮预告"]
  },

  /* ---------- 开工前先让 AI 复述一遍 ----------
     为什么值得花这几十秒：AI 猜错商品或猜错听众，五段台词全废，
     重生一次又要扣一次额度。所以写之前把它"听懂了什么"摊开给人改。

     conf = ai   AI 有把握，直接给结论（仍然可改）
     conf = ask  影响整条结构，必须人点头——**一定要给选项，不能只写在纸上**，
                 写成只读的一行字，用户只会往下滑，猜错了才知道要回来改。 */
  brief: {
    product: { conf: "ai", label: "商品", value: "磷虾油", note: "从你那句话里读出来的" },
    audience: {
      conf: "ask", label: "讲给谁", value: "both", note: "决定开头 3 秒要不要先解释这是什么",
      opts: [
        { id: "old", tx: "老客为主", say: "主要讲给已经买过的老客" },
        { id: "new", tx: "新客为主", say: "主要讲给还没买过的人" },
        { id: "both", tx: "两类都要", say: "老客和新客都要照顾到" }
      ]
    },
    focus: {
      conf: "ask", label: "这次的重点", value: "price", note: "一条只讲一件事，多了记不住",
      opts: [
        { id: "price", tx: "开团·价格", say: "重点是开团时间和团价" },
        { id: "ingredient", tx: "成分·含量", say: "重点讲成分和含量" },
        { id: "how", tx: "怎么吃", say: "重点讲怎么吃、吃多久" },
        { id: "why", tx: "为什么选它", say: "重点讲为什么选它" }
      ]
    },
    price: {
      conf: "ask", label: "带不带价格", value: "yes", note: "健康品类的价必须和团价一字不差",
      opts: [
        { id: "yes", tx: "要，说清团价", say: "会直接说清团价" },
        { id: "soft", tx: "只说有团价", say: "只说有团价，不报具体数字" },
        { id: "no", tx: "不提价", say: "全程不提价格" }
      ]
    }
  },

  /* 脚本结构：**几段 + 每段说什么**。
     不是"四个字的风格名"，是这副骨架——用户看一眼就知道这条片子会怎么走，
     而且段数本身就决定了他要拍几段、要几个画面。
     每套结构自带台词，选了谁，下一屏就按谁的段数和台词铺开（B2 不再固定 5 段）。 */
  structs: [
    { id: "s3", parts: 3, name: "钩子 → 是什么 → 价格",
      note: "最快。发过同款的人用这条，半分钟讲完",
      segs: [
        { name: "开场钩子", role: "hook", dur: 7, needTags: ["person", "broll"],
          vo: "磷虾油到底值不值得买？三句话说清。" },
        { name: "是什么", role: "what", dur: 12, needTags: ["product", "hand"],
          vo: "它是从磷虾里提的油，磷脂型 Omega-3，比鱼油好吸收。" },
        { name: "开团 · 价格", role: "cta", dur: 9, needTags: ["textcard", "cta"],
          vo: "今晚 8 点开团，一盒 89，点我头像进来。" }
      ] },
    { id: "s4", parts: 4, name: "钩子 → 是什么 → 凭什么信 → 怎么买",
      note: "最常见的带货结构，新客老客都跟得上",
      segs: [
        { name: "开场钩子", role: "hook", dur: 7, needTags: ["person"],
          vo: "别急着买磷虾油，先看我这条再决定。" },
        { name: "是什么", role: "what", dur: 11, needTags: ["product"],
          vo: "它就是磷脂型 Omega-3，每粒 500mg。" },
        { name: "凭什么信", role: "proof", dur: 12, needTags: ["proof"],
          vo: "我自己吃了三个月，还有 37 个老客回购。" },
        { name: "怎么买", role: "cta", dur: 9, needTags: ["textcard", "cta"],
          vo: "今晚 8 点开团，点我头像进，价在群里。" }
      ] },
    { id: "s5", parts: 5, name: "钩子 → 拆问题 → 讲原理 → 给证据 → 说价格",
      note: "讲透一条。账号还没人认识的时候，靠这个立信任",
      segs: [
        { name: "开场钩子", role: "hook", dur: 7, needTags: ["person"],
          vo: "补 Omega-3，为什么有人吃了半年也没感觉？" },
        { name: "拆问题", role: "problem", dur: 10, needTags: ["person", "explain"],
          vo: "多半是买成了普通鱼油，吸收率差一大截。" },
        { name: "讲原理", role: "why", dur: 13, needTags: ["ingredient"],
          vo: "磷虾油是磷脂型，直接进细胞膜，不用身体再转化一次。" },
        { name: "给证据", role: "proof", dur: 11, needTags: ["proof"],
          vo: "我吃了三个月，睡眠和状态都稳了，老客也是这么说的。" },
        { name: "说价格", role: "cta", dur: 9, needTags: ["textcard", "cta"],
          vo: "今晚 8 点开团，一盒 89，点我头像进来。" }
      ] },
    { id: "s5o", parts: 5, name: "开箱 → 成分 → 含量 → 用法 → 价格",
      note: "手里有实物、能拍开箱时最稳，画面最好凑",
      segs: [
        { name: "开箱", role: "hook", dur: 9, needTags: ["product", "unbox"],
          vo: "刚到的这一箱，我当场拆给你看。" },
        { name: "成分", role: "what", dur: 9, needTags: ["ingredient"],
          vo: "翻过来看配料表：磷虾油，磷脂型 Omega-3。" },
        { name: "含量", role: "detail", dur: 8, needTags: ["product", "hand"],
          vo: "每粒 500mg，一天两粒就够了。" },
        { name: "用法", role: "how", dur: 8, needTags: ["person", "explain"],
          vo: "饭后吃，别空腹；连着吃一个月再看变化。" },
        { name: "价格", role: "cta", dur: 9, needTags: ["textcard", "cta"],
          vo: "今晚 8 点开团，一盒 89，点我头像进来。" }
      ] }
  ],

  /* 讲多长：只说短 / 中 / 长，不报秒数。
     为什么不给"30 秒 / 45 秒 / 60 秒"：团长脑子里没有秒数这个概念，
     他想的是"这条要讲多细"。秒数交给系统换算，写出来反而要他去算。
     真实秒数只在结果页出现（约 46 秒），那是给他判断片子长短用的。 */
  lens: [
    { id: "short", name: "短", note: "一句话钩住就走，适合刷到即看" },
    { id: "mid", name: "中", note: "讲清一件事，最常见的一条" },
    { id: "long", name: "长", note: "从头讲到尾，适合讲成分和原理" }
  ],

  /* 口吻：跟 B2.4 的"谁在说"（音色）不是一件事。
     这里是**怎么写**，那里是**谁的声音念**。写完的台词换个音色还是那些字，
     换个口吻就是另一篇稿子——所以必须在这里定。 */
  tones: [
    { id: "pro", name: "专业可信", note: "像一个做了五年选品的人在讲：讲依据、给数字、不夸大" },
    { id: "humor", name: "幽默调侃", note: "先逗一句再讲正事，适合刷到就走、没耐心的人" },
    { id: "warm", name: "亲切唠嗑", note: "像跟邻居聊天，适合私域里的老客和宝妈群" },
    { id: "sharp", name: "犀利真实", note: "先把不好的一面说出来，反而更容易被信" }
  ],

  /* ---------- 生成设置：网感模板 ----------
     模板决定"这条片子长什么样"：切得多快、字幕什么样式、什么转场、BGM 什么调性。
     内置 8 款，按真实投放效果排；接真接口：GET /templates?scene=script|series
     rate 是同类视频用这个模板后相对基线的提升，来自内容数据后台。

     名字全部改成人话：上一版叫"快闪卡点"，团长问"这是什么意思"——
     名字本身不该需要解释。每款只留两样东西：
     · shape —— 卡片上直接画成版式示意，扫一眼就知道片子长什么样；
     · desc —— 一句"剪出来是什么样"，选中后在卡下显示这一行，不再展开。
     上一版还有 bits 三个标签和一句 eg 实例，加起来四行字——
     用户看一眼卡就知道是哪个了，不需要再读四行说明。 */
  templates: [
    { id: "tp_fast", name: "镜头快切", tag: "爆款", rate: "完播 +18%", shape: "grid3",
      desc: "说一句换一个镜头，30 秒能切 20 下", c1: "#FF7A45", c2: "#FF3D6E" },
    { id: "tp_big", name: "大字口播", tag: "稳妥", rate: "完播 +9%", shape: "big",
      desc: "你说的每句话，字比脸还大", c1: "#2C5BFF", c2: "#00C2FF" },
    { id: "tp_compare", name: "左右对比", tag: "带货", rate: "出单 +12%", shape: "split",
      desc: "左边打 ✕，右边打 ✓，差在哪一眼看见", c1: "#F5A623", c2: "#FFC85B" },
    { id: "tp_twist", name: "先反着说", tag: "涨粉", rate: "涨粉 +22%", shape: "ask",
      desc: "开头先说「先别买」，停一拍再翻回来", c1: "#7C5CFF", c2: "#B08CFF" },
    { id: "tp_scroll", name: "图片往上滑", tag: "省素材", rate: "完播 +4%", shape: "slide",
      desc: "不用拍，手机里的图就够", c1: "#00A8E8", c2: "#5B8CFF" },
    { id: "tp_talk", name: "真人在讲", tag: "信任", rate: "出单 +8%", shape: "face",
      desc: "你的脸占满屏，字幕缩在下面", c1: "#0E1B3D", c2: "#2C5BFF" },
    { id: "tp_bi", name: "中英双语", tag: "显专业", rate: "完播 +21%", shape: "duo",
      desc: "上排中文下排英文，讲成分最像样", c1: "#C71F37", c2: "#7A1020" },
    { id: "tp_sale", name: "促销大字", tag: "冲点击", rate: "点击 +30%", shape: "sale",
      desc: "价格和倒计时占满整屏", c1: "#E8262D", c2: "#FF8A00" }
  ],

  /* 音色：原音 or AI 配音。
     团长的人设决定选哪个——宝妈选亲和女声，讲成分选沉稳男声，讲养生选长辈音。
     接真接口：GET /voices，AI 部分走 TTS 音色库。 */
  voices: [
    { id: "v_self", k: "self", name: "我的原音", sub: "要你念一遍", tag: "" },
    { id: "v_f1", k: "ai", name: "亲和女声", sub: "像邻居姐姐", tag: "推荐" },
    { id: "v_m1", k: "ai", name: "沉稳男声", sub: "讲成分可信", tag: "" }
  ],

  /* AI 网感封面：按这条的台词生成 6 张，风格各不同，选一张发。
     为什么不是"从视频帧里截一张"：竖屏信息流里封面图决定点击，
     截帧永远是糊的、字也压不住，网感封面是投手做出来的。 */
  /* 封面 = **底图 + 版式**，不是"AI 画 6 张新图"。
     底图来自视频首帧或团长自己上传的照片，版式只负责把字压在哪儿。
     为什么不整张交给 AI：团长认的是自己那张脸、那盘货，换成本人画面的封面
     点击率本来就更高；AI 只该负责排字，不该负责编画面。
     上一版给的是 6 张各自独立的渐变图，用户反馈也是这个意思——
     "用上传的图或首帧，结合模板生成"。 */
  coverBases: [
    { k: "frame", name: "视频首帧", at: "00:00", from: "第 3 段 · 手拿产品特写",
      bg: "linear-gradient(160deg,#2C5BFF 0%,#0E2A6B 55%,#08142F 100%)" },
    { k: "photo", name: "上传本地图片", at: "", from: "相册 · 竖版优先",
      bg: "linear-gradient(160deg,#8C6BFF 0%,#4A3AA8 55%,#1B1740 100%)" }
  ],

  /* 我的相册：封面底图/画中画的来源。竖版为主，因为竖屏封面用不上横图 */
  myPhotos: [
    { id: "ph_01", label: "手拿瓶身 · 客厅", at: "11-01", bg: "linear-gradient(160deg,#8C6BFF,#2C1E63)" },
    { id: "ph_02", label: "产品摆台", at: "10-28", bg: "linear-gradient(160deg,#2C5BFF,#0B1F52)" },
    { id: "ph_03", label: "自拍 · 素颜", at: "10-26", bg: "linear-gradient(160deg,#FF7BA9,#7A2A55)" },
    { id: "ph_04", label: "仓库实拍", at: "10-22", bg: "linear-gradient(160deg,#00B389,#0A4A3C)" },
    { id: "ph_05", label: "孩子吃饭", at: "10-19", bg: "linear-gradient(160deg,#F5A623,#7A4A0C)" },
    { id: "ph_06", label: "开箱合照", at: "10-15", bg: "linear-gradient(160deg,#00A8E8,#0B3A52)" }
  ],

  /* big 里的 `|` 是**手动断行**。
     中文没有空格，交给浏览器自动折行会断在词中间（"一天不 / 到 3 块"），
     而封面标题的断句本来就是排版的一部分——所以由文案自己定哪里换行。 */
  /* 六款都是数据里跑出来"点得动"的版式：大字压底 / 顶标题 / 居中描边 /
     分屏对比 / 价签色条 / 左侧卖点。名字按信息流里的实际叫法来，不按设计术语。 */
  coverStyles: [
    { k: "bottom", name: "爆款大字", big: "一天不到|3 块", small: "今晚 8 点开团",
      note: "最常用：画面留给你，字收在下方 1/3" },
    { k: "top", name: "顶部标题党", big: "磷虾油|怎么选", small: "3 步不踩坑",
      note: "画面主体在中间时用，字压顶部不挡脸" },
    { k: "center", name: "疑问居中", big: "孩子|能吃吗？", small: "一次讲清楚",
      note: "疑问句最搭；白字加黑边，什么背景都看得清" },
    { k: "split", name: "分屏对比", big: "鱼油 vs|磷虾油", small: "差在一个吸收率",
      note: "对比内容专用：上留画面，下留结论" },
    { k: "bar", name: "价签色条", big: "37 个|老客回购", small: "原话都在评论区",
      note: "压一条实色带，字最稳，也最像广告" },
    { k: "left", name: "左侧卖点", big: "每粒 500mg", small: "磷脂型更好吸收",
      note: "信息量大时用，左下三行放得下三个卖点" }
  ],

  /* ---------- 成品详情：谁看了、看了多久、谁分享、谁评论 ----------
     数据来自发布后的回传（平台开放数据 + 小程序侧埋点），按人去重合并。
     `lead` 是潜客标记：看过 ≥ 1 次且有过互动（点购物车/问价/收藏）才算，
     只划过一眼的不算——潜客名单一旦掺水，团长就不看了。 */
  viewers: [
    { id: "u1", name: "阿梅", av: "梅", bg: "#2C5BFF", rel: "老客 · 买过 3 次", at: "21:02",
      times: 3, stay: "1 分 12 秒", act: "点了购物车", score: 86, lead: true, src: "视频号" },
    { id: "u2", name: "阿强", av: "强", bg: "#00A8E8", rel: "新客 · 关注 2 天", at: "20:56",
      times: 2, stay: "58 秒", act: "评论区问价", score: 74, lead: true, src: "抖音" },
    { id: "u3", name: "小燕", av: "燕", bg: "#00B389", rel: "潜客 · 群里来的", at: "20:07",
      times: 2, stay: "1 分 34 秒", act: "私信问了价格", score: 91, lead: true, src: "小红书" },
    { id: "u4", name: "阿玲", av: "玲", bg: "#7C5CFF", rel: "老客 · 买过 1 次", at: "20:31",
      times: 1, stay: "41 秒", act: "收藏了", score: 62, lead: true, src: "视频号" },
    { id: "u5", name: "微信用户 8***2", av: "匿", bg: "#8C93A3", rel: "陌生人", at: "20:19",
      times: 1, stay: "12 秒", act: "看了就划走", score: 18, lead: false, src: "视频号" },
    { id: "u6", name: "老周", av: "周", bg: "#F5A623", rel: "老客 · 买过 5 次", at: "19:58",
      times: 1, stay: "33 秒", act: "看了一半", score: 45, lead: false, src: "抖音" }
  ],

  /* 动态日志：按时间倒序，三种事件分别记 —— 看了 / 分享了 / 评论了。
     为什么要流水而不是只给汇总：团长真正要做的是"现在去跟进谁"，
     而"谁在三分钟前问了价"比"今天 386 个访客"有用得多。 */
  logs: [
    { t: "21:02", who: "阿梅", av: "梅", bg: "#2C5BFF", type: "view",
      act: "看了第 3 遍", extra: "停留 1 分 12 秒 · 点了购物车" },
    { t: "20:58", who: "阿梅", av: "梅", bg: "#2C5BFF", type: "like",
      act: "点了赞", extra: "第 3 遍看到这儿才点的" },
    { t: "20:56", who: "阿强", av: "强", bg: "#00A8E8", type: "comment",
      act: "评论了", extra: "「多少钱一盒？」" },
    { t: "20:48", who: "阿强", av: "强", bg: "#00A8E8", type: "share",
      act: "分享了这条", extra: "分享到朋友圈" },
    { t: "20:44", who: "小燕", av: "燕", bg: "#00B389", type: "like",
      act: "点了赞", extra: "顺手收藏了" },
    { t: "20:31", who: "阿玲", av: "玲", bg: "#7C5CFF", type: "view",
      act: "看完了", extra: "停留 41 秒 · 收藏了" },
    { t: "20:26", who: "老周", av: "周", bg: "#F5A623", type: "comment",
      act: "评论了", extra: "「吃了一个月，回购了」" },
    { t: "20:19", who: "微信用户 8***2", av: "匿", bg: "#8C93A3", type: "view",
      act: "看了 12 秒就划走", extra: "没互动" },
    { t: "20:12", who: "老周", av: "周", bg: "#F5A623", type: "like",
      act: "点了赞", extra: "" },
    { t: "20:07", who: "小燕", av: "燕", bg: "#00B389", type: "share",
      act: "转给了闺蜜", extra: "对方从小红书点进来看了" }
  ],

  /* 这条发出去之后的回传汇总。分享是有前提的：
     没分享出去，就只有自己那一次播放，所以数据是"分享带来的"。 */
  shareStat: { times: 3, stay: "38 秒" },

  /* 互动量三档：少 / 中 / 多。
     名字用"少中多"而不是"冷启动/启动中/热门"——后者是运营口径，
     团长在播放页要做的事是"这条现在大概有多少人理"，他一听"多"就懂。
     数字是一组预设，也可以在播放页里自己填（自定义）。
     档位变了，赞/评/转和播放/访客/潜客一起变——同一条片子不同热度下的样子。 */
  heatLevels: [
    { id: "cold", name: "少", note: "刚发出去，只有熟人看得到",
      like: 12, comment: 3, share: 1, plays: 42, visitors: 18, leads: 1 },
    { id: "warming", name: "中", note: "推了一波，开始有人转",
      like: 186, comment: 23, share: 17, plays: 1280, visitors: 312, leads: 12 },
    { id: "hot", name: "多", note: "进了推荐池，量还在涨",
      like: 3200, comment: 268, share: 96, plays: 38600, visitors: 7420, leads: 186 }
  ],

  /* 评论种子：播放页里按"评论数"截取前 N 条展示。
     真实产品由 AI 按台词 + 卖点现生成，原型里写死一组"像真评论"的样本——
     有问价的、有回购的、有提问的、有质疑问效果的，这四种才是团长要回的人。
     **数量要够**：评论数能填到几百，只写 8 条的话，"确定生成"之后列表看着像坏了。 */
  comments: [
    { who: "阿梅", av: "梅", bg: "#2C5BFF", tx: "我妈也在吃这个，睡眠确实好了不少", like: 23, at: "2 分钟前", tag: "老客" },
    { who: "小燕", av: "燕", bg: "#00B389", tx: "多少钱一盒？链接在哪儿", like: 41, at: "6 分钟前", tag: "问价" },
    { who: "阿强", av: "强", bg: "#00A8E8", tx: "跟鱼油比，哪个好吸收一点", like: 15, at: "11 分钟前", tag: "" },
    { who: "老周", av: "周", bg: "#F5A623", tx: "吃了一个月，精神比以前好，回购了", like: 9, at: "19 分钟前", tag: "老客" },
    { who: "微信用户 3***8", av: "匿", bg: "#8C93A3", tx: "看配方挺干净，先买一盒试试", like: 5, at: "27 分钟前", tag: "" },
    { who: "阿玲", av: "玲", bg: "#7C5CFF", tx: "开团价什么时候结束呀", like: 12, at: "38 分钟前", tag: "问价" },
    { who: "小何", av: "何", bg: "#FF7A45", tx: "一直回购，这次直接囤两盒", like: 7, at: "1 小时前", tag: "老客" },
    { who: "微信用户 9***1", av: "匿", bg: "#8C93A3", tx: "孕妇可以吃吗？在线等", like: 3, at: "1 小时前", tag: "" },
    { who: "暴富者姐", av: "暴", bg: "#2C5BFF", tx: "第 3 步那个吃法我没听清，能再说一遍吗", like: 18, at: "1 小时前", tag: "" },
    { who: "小雨", av: "雨", bg: "#00B389", tx: "上次买的还没吃完，这次囤一盒够吗", like: 6, at: "2 小时前", tag: "老客" },
    { who: "微信用户 5***7", av: "匿", bg: "#8C93A3", tx: "这个跟药一起吃有冲突没", like: 11, at: "2 小时前", tag: "" },
    { who: "阿强", av: "强", bg: "#00A8E8", tx: "已经拍了两盒，什么时候发货", like: 22, at: "2 小时前", tag: "问价" },
    { who: "果果妈", av: "果", bg: "#FF7A45", tx: "孩子八岁能吃吗？一次几粒", like: 14, at: "3 小时前", tag: "" },
    { who: "老李", av: "李", bg: "#F5A623", tx: "说实话我不信保健品，但这个成分我查过", like: 31, at: "3 小时前", tag: "" },
    { who: "微信用户 2***4", av: "匿", bg: "#8C93A3", tx: "有优惠券吗", like: 2, at: "3 小时前", tag: "问价" },
    { who: "阿梅", av: "梅", bg: "#2C5BFF", tx: "补充一句，我是饭后吃的，不腥", like: 16, at: "4 小时前", tag: "老客" },
    { who: "小燕", av: "燕", bg: "#00B389", tx: "群里姐妹说这个好，我也来看看", like: 8, at: "4 小时前", tag: "" },
    { who: "微信用户 7***0", av: "匿", bg: "#8C93A3", tx: "别买，我吃了没啥感觉", like: 4, at: "5 小时前", tag: "" },
    { who: "阿玲", av: "玲", bg: "#7C5CFF", tx: "楼上可能是没坚持，我是吃到第三周才明显", like: 27, at: "5 小时前", tag: "老客" },
    { who: "大刘", av: "刘", bg: "#00A8E8", tx: "这个牌子有检测报告吗", like: 9, at: "6 小时前", tag: "" },
    { who: "微信用户 1***6", av: "匿", bg: "#8C93A3", tx: "已经回购第三次了，家里人都吃", like: 19, at: "7 小时前", tag: "老客" },
    { who: "小雨", av: "雨", bg: "#00B389", tx: "开团到几号？我怕错过", like: 13, at: "8 小时前", tag: "问价" },
    { who: "暴富者姐", av: "暴", bg: "#2C5BFF", tx: "今晚 8 点，链接在我头像里，拍完记得看群公告", like: 45, at: "9 小时前", tag: "" },
    { who: "微信用户 4***9", av: "匿", bg: "#8C93A3", tx: "看完就下单了，试试再说", like: 3, at: "10 小时前", tag: "" }
  ],

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

  /* ============ 素材库（E2）============
     三层结构：**身份域 → 类别 → 文件夹**。
     身份域只有"我的 / 团队"两个（好友是后续要加的第三个，数据结构留好了位置）；
     类别固定三类：脚本 / 视频素材 / 作品——这三类覆盖了团长手上的全部东西，
     再多一类就分不清"这条片子该放哪儿"；
     文件夹由用户自己建，"视频素材"下天然会长出产品素材 / 平台介绍 / 素颜视频这几摞。

     为什么文件夹不写死在类别下、而是单独一张表：它是**用户资产**，
     以后要能改名、拖动、删；写进类别里以后没法动。 */
  library: {
    teamOn: true,          // 没加入团队时，页面上只有"我的"一个 tab
    notices: [
      { id: "nt_1", t: "10 月团价调整", sub: "磷虾油团价下调 8 元，脚本里的价格口径要改", at: "今天 09:20", unread: 2, go: "E5" },
      { id: "nt_2", t: "新素材包已上线", sub: "秋季滋补专题 · 12 条空镜可直接取用", at: "昨天", unread: 0, go: "E5" }
    ],
    /* 团队任务：团长派给**全员**的剪辑任务（不是我的私事）。
       每条都有"谁派的 / 派给谁 / 还差几个人 / 什么时候截止"——
       团长要的是"催谁"，团员要的是"我还有没有没交的"。 */
    teamTasks: [
      { id: "tk_1", t: "信任背书口播 · 每人 1 条", by: "暴富者 · 团长", to: "全员 12 人",
        due: "今天 18:00", done: 8, total: 12, state: "doing", go: "E4" },
      { id: "tk_2", t: "开箱合集 · 每人各发 1 条", by: "暴富者 · 团长", to: "全员 12 人",
        due: "本周日", done: 4, total: 12, state: "doing", go: "E4" },
      { id: "tk_3", t: "9 月复盘 · 填一张表", by: "总部", to: "全员",
        due: "已结束", done: 12, total: 12, state: "done", go: "E4" }
    ],
    /* 团队：一个人可以加入多个团。只有一个的时候不显示切换器，直接就是它的首页。 */
    teams: [
      { id: "tm_1", name: "暴富者的团", members: 12, role: "团长", brief: "本周目标 · 3 条开团片", day: "第 3 周" },
      { id: "tm_2", name: "深圳健康选品联盟", members: 86, role: "团员", brief: "总部直管 · 每周 5 条", day: "第 8 周" }
    ],
    /* 团队成员通讯录：点团队名进团队信息时展示。真实产品里来自团队成员表 + 手机号（脱敏） */
    teamMembers: [
      { name: "暴富者", role: "团长", av: "暴", bg: "#2C5BFF", joined: "第 1 周", posts: 18, phone: "138****6600" },
      { name: "阿玲", role: "副团长", av: "玲", bg: "#7C5CFF", joined: "第 1 周", posts: 22, phone: "137****2231" },
      { name: "阿强", role: "团员", av: "强", bg: "#00A8E8", joined: "第 2 周", posts: 15, phone: "135****8890" },
      { name: "小雨", role: "团员", av: "雨", bg: "#00B389", joined: "第 2 周", posts: 12, phone: "136****4412" },
      { name: "小敏", role: "团员", av: "敏", bg: "#FF7A45", joined: "第 3 周", posts: 9, phone: "139****7702" },
      { name: "阿黎", role: "团员", av: "黎", bg: "#F5A623", joined: "第 3 周", posts: 7, phone: "133****5521" },
      { name: "阿北", role: "团员", av: "北", bg: "#C71F37", joined: "第 4 周", posts: 6, phone: "132****9987" },
      { name: "小晓", role: "团员", av: "晓", bg: "#5B8CFF", joined: "第 5 周", posts: 4, phone: "131****3345" }
    ],
    /* 团队页 Banner 轮播：运营/团长投放的团队级横幅（目标、公告、素材包） */
    teamBanners: [
      { t: "本周冲 3 条开团片", sub: "团队目标 · 还差 1 条就达成", tag: "团队目标", bg: "linear-gradient(135deg,#2C5BFF,#7C5CFF)", go: "E4" },
      { t: "10 月团价已调整", sub: "脚本里的价格口径记得改", tag: "公告", bg: "linear-gradient(135deg,#FF7A45,#FF3D6E)", go: "E5" },
      { t: "总部素材包上线", sub: "12 条秋季空镜可直接取用", tag: "素材", bg: "linear-gradient(135deg,#00A8E8,#00C2FF)", go: "E3?open=asset" }
    ],
    /* 团队首页是一条**混排信息流**：公告置顶、任务插在中间、动态按时间排。
       分三个区块摆（公告一摞、任务一摞、动态一摞）看着整齐，但没人会挨个区块看完——
       团长打开团队是想知道"今天有什么动静"，那就该像论坛一样按时间往下刷。 */
    teamFeed: {
      tm_1: [
        { d: "今天", t: "09:20", type: "notice", who: "总部", act: "改了团价口径", extra: "磷虾油团价下调 8 元，脚本里的价格要改", pin: true, go: "E5" },
        { d: "今天", t: "08:05", type: "task", who: "系统", act: "派了一个任务", extra: "本周 3 条待发 · 2 条今天到期", go: "E4" },
        { d: "昨天", t: "21:10", type: "work", who: "阿玲", act: "发了新作品", extra: "开箱第一句就说价格 · 12.4 万播放", go: "F3", item: "li_tw1" },
        { d: "昨天", t: "16:32", type: "asset", who: "阿强", act: "上传了 3 条素材", extra: "仓库实拍 / 打包现场", go: "", item: "li_ta4" },
        { d: "前天", t: "10:00", type: "script", who: "总部", act: "更新了脚本", extra: "总部 10 月口径（必用）", go: "", item: "li_ts1" },
        { d: "前天", t: "09:12", type: "member", who: "小雨", act: "加入了团队", extra: "现在是第 12 位成员", go: "" }
      ],
      tm_2: [
        { d: "今天", t: "10:40", type: "notice", who: "联盟运营", act: "发了公告", extra: "12 月排期开始报名", pin: true, go: "E5" },
        { d: "昨天", t: "19:20", type: "work", who: "小雨", act: "发了新作品", extra: "换季话术 · 3 句话讲完 · 8.6 万播放", go: "F3", item: "li_tw2" },
        { d: "昨天", t: "14:05", type: "task", who: "系统", act: "派了一个任务", extra: "本月 5 条 · 还差 2 条", go: "E4" }
      ]
    },
    /* 好友：和团队同一套结构（三个文件夹 + 一条更新流），只是没有任务和公告——
       朋友之间没有"派活"这回事，只有"他又发了什么"。 */
    friends: [
      { id: "fr_1", name: "阿玲", av: "玲", bg: "#2C5BFF", note: "3 天前更新" },
      { id: "fr_2", name: "阿强", av: "强", bg: "#00A8E8", note: "昨天更新" },
      { id: "fr_3", name: "小雨", av: "雨", bg: "#00B389", note: "今天更新" }
    ],
    friendFeed: [
      { d: "今天", t: "10:12", who: "小雨", type: "work", act: "发了新作品", extra: "换季话术 · 3 句话讲完 · 8.6 万播放", go: "F3", item: "li_fw1" },
      { d: "今天", t: "09:30", who: "阿玲", type: "asset", act: "上传了 2 条素材", extra: "素颜出镜 · 拆快递", go: "", item: "li_fa1" },
      { d: "昨天", t: "18:40", who: "阿强", type: "script", act: "分享了一份脚本", extra: "信任背书口播 v2", go: "", item: "li_fs1" },
      { d: "前天", t: "11:05", who: "阿玲", type: "work", act: "发了新作品", extra: "开箱第一句就说价格 · 12.4 万播放", go: "F3", item: "li_fw2" }
    ],

    /* 我的动态：只记"我自己干了什么"，不掺别人的事。
       放它的理由是——素材库不只是仓库，它也是"我最近在忙什么"的镜子：
       昨天传了三条素颜视频、今天用了开团话术，这些比"共 12 个"更能帮人找回上下文。 */
    mineFeed: [
      { t: "今天", type: "asset", act: "上传了 3 条素材", extra: "素颜出镜 · 早上", go: "", item: "li_a8" },
      { t: "今天", type: "script", act: "用了「开团话术 3 连问」", extra: "生成了一条片子", go: "B2?kind=script&src=import", item: "li_s1" },
      { t: "昨天", type: "folder", act: "新建了文件夹", extra: "素颜视频", go: "" },
      { t: "昨天", type: "work", act: "收藏了一个作品", extra: "阿玲的复购实录", go: "F3", item: "li_w4" }
    ],

    /* 团队 tab 顶上的四宫格：公告 / 动态 / 任务 / 成员。
       素材库解决的是"东西在哪"，这四格解决的是"团队有什么动向"——
       团长进团队库，一半是来找素材，一半是来看有没有新通知和新爆款。 */
    teamQuad: [
      { k: "notice", n: 2, tx: "公告", go: "E5" },
      { k: "feed", n: 6, tx: "动态", go: "E1" },
      { k: "task", n: 3, tx: "任务", go: "E4" },
      { k: "member", n: 12, tx: "成员", go: "E1" }
    ],
    folders: {
      "mine.script": [
        { id: "fd_s1", name: "开团话术", n: 3 },
        { id: "fd_s2", name: "成分讲解", n: 2 },
        { id: "fd_s3", name: "复购催单", n: 2 }
      ],
      "mine.asset": [
        { id: "fd_a1", name: "产品素材", n: 4 },
        { id: "fd_a2", name: "平台介绍", n: 3 },
        { id: "fd_a3", name: "素颜视频", n: 3 },
        { id: "fd_a4", name: "我的出镜", n: 2 }
      ],
      "mine.work": [
        { id: "fd_w1", name: "已发布", n: 3 },
        { id: "fd_w2", name: "我收藏的", n: 2 }
      ],
      "team.script": [
        { id: "fd_ts1", name: "总部口径", n: 2 },
        { id: "fd_ts2", name: "结构模板", n: 1 }
      ],
      "team.asset": [
        { id: "fd_ta1", name: "品牌宣传片", n: 1 },
        { id: "fd_ta2", name: "总部产品图", n: 2 },
        { id: "fd_ta3", name: "仓库实拍", n: 1 }
      ],
      "team.work": [
        { id: "fd_tw1", name: "团队爆款", n: 2 }
      ],
      "friend.script": [
        { id: "fd_fs1", name: "阿玲分享的", n: 2 },
        { id: "fd_fs2", name: "阿强分享的", n: 1 }
      ],
      "friend.asset": [
        { id: "fd_fa1", name: "阿玲的素材", n: 2 },
        { id: "fd_fa2", name: "阿强的素材", n: 2 }
      ],
      "friend.work": [
        { id: "fd_fw1", name: "他们的作品", n: 3 }
      ]
    },
    /* 脚本正文：单独一张表，不塞进 items。
       列表只需要"标题 + 几段几秒"，正文只有点进去看的时候才要——
       塞一起会让列表数据变重，也不方便以后单独做版本管理。 */
    scriptBodies: {
      li_s1: [
        { n: "开场提问", vo: "磷虾油到底值不值得买？先说结论：看成分表，别看广告。" },
        { n: "成分讲解", vo: "每粒 500mg，这个量在同类里算高的；关键是它用的是磷脂型，吸收比普通鱼油好。" },
        { n: "使用感受", vo: "我妈吃了三个月，最明显的是睡眠，以前半夜老醒，现在能睡整觉。" },
        { n: "价格与团期", vo: "今晚 8 点开团，3 盒 99，比平时便宜 40 块，就这一天。" },
        { n: "收尾引导", vo: "链接在我头像里，拍完记得进群，群里有吃法。" }
      ],
      li_s2: [
        { n: "开头泼冷水", vo: "先别买。这个磷虾油我劝你想清楚再下单。" },
        { n: "停一拍", vo: "因为它确实有点贵，一盒的钱能买三瓶普通鱼油。" },
        { n: "翻回来", vo: "但如果你妈跟我妈一样，半夜老醒、白天没精神，那这钱花得值。" },
        { n: "收尾引导", vo: "今晚 8 点开团，想试的先进群看看别人怎么说。" }
      ],
      li_s4: [
        { n: "抛问题", vo: "500mg 到底算不算高？我给你一个参照。" },
        { n: "给参照", vo: "市面上多数是 300mg 左右，500mg 已经属于第一梯队。" },
        { n: "讲原理", vo: "但含量高不等于吸收好，磷脂型才是关键，它不用经过肝脏转化。" },
        { n: "收尾引导", vo: "所以买的时候看两个数：含量、还有是不是磷脂型。" }
      ],
      li_s5: [
        { n: "开场提问", vo: "总有人问：跟鱼油比，到底差在哪？" },
        { n: "讲差异", vo: "差在吸收路径。鱼油是甘油三酯型，要先过肝脏；磷虾油是磷脂型，直接进细胞。" },
        { n: "给证据", vo: "同样吃 500mg，血药浓度能差一倍多，这不是玄学，有临床数据。" },
        { n: "使用感受", vo: "我自己换过来之后，最明显的是不腥，吃完不打嗝。" },
        { n: "收尾引导", vo: "想换的今晚 8 点，团价 3 盒 99。" }
      ],
      li_s6: [
        { n: "开场提醒", vo: "上一盒是不是快吃完了？" },
        { n: "给理由", vo: "这个东西不能断，断了两周体内的水平就掉回去了，前面白吃。" },
        { n: "收尾引导", vo: "老客直接拍 3 盒，比单买省 40，我给你们留了库存。" }
      ],
      li_s7: [
        { n: "开场提问", vo: "一盒吃完了，该说点什么？" },
        { n: "讲变化", vo: "先说自己的变化，别说产品多好——他信的是你，不是广告。" },
        { n: "给下一步", vo: "然后告诉他：接着吃要连着，别断；顺手把团期说了。" },
        { n: "收尾引导", vo: "最后一句给个动作：链接在头像，或者直接问我。" }
      ],
      li_s3: [
        { n: "开场提醒", vo: "开团还剩 3 小时。" },
        { n: "给紧迫", vo: "这价格一个月就这一次，过了就回原价。" },
        { n: "收尾引导", vo: "还在犹豫的先进群，群里我把成分表拍给你看。" }
      ],
      li_ts1: [
        { n: "品牌开场", vo: "这是 XX 品牌的官方口径，我只讲三个点。" },
        { n: "成分", vo: "磷脂型磷虾油，每粒 500mg，原料来自南极海域。" },
        { n: "资质", vo: "检测报告在群公告里，随时可查。" },
        { n: "价格", vo: "团价以群公告为准，不要口头承诺更低的价格。" },
        { n: "收尾", vo: "有问题进群问，我不私聊报价。" }
      ],
      li_ts2: [
        { n: "开场", vo: "有人问团价，我统一说一次。" },
        { n: "说明", vo: "3 盒 99，只在这个链接、只到今天 24 点。" },
        { n: "收尾", vo: "别的地方更便宜的，我不保证是同一个批次。" }
      ],
      li_ts3: [
        { n: "开场立信任", vo: "我是谁，我为什么讲这个。" },
        { n: "开箱", vo: "当着镜头拆一盒，让人看清里面长什么样。" },
        { n: "讲卖点", vo: "只讲三个，多了记不住。" },
        { n: "给证据", vo: "检测报告 / 老客反馈，挑一个。" },
        { n: "收尾引导", vo: "价格 + 时间 + 一句动作。" }
      ]
    },

    /* at：几天前（1 = 今天），排序"最新"用；hot：使用/播放热度，"最热"用；pick：精选 */
    items: {
      "mine.script": [
        { id: "li_s1", name: "开团话术 3 连问", sub: "5 段 · 46 秒", fd: "fd_s1", at: 2, hot: 86, pick: true, by: "我" },
        { id: "li_s2", name: "先别买 · 反转开场", sub: "4 段 · 38 秒", fd: "fd_s1", at: 6, hot: 92, pick: true, by: "我" },
        { id: "li_s3", name: "开团最后 3 小时", sub: "3 段 · 26 秒", fd: "fd_s1", at: 11, hot: 64, by: "我" },
        { id: "li_s4", name: "500mg 到底算不算高", sub: "4 段 · 41 秒", fd: "fd_s2", at: 1, hot: 78, pick: true, by: "我" },
        { id: "li_s5", name: "跟鱼油比差在哪", sub: "5 段 · 48 秒", fd: "fd_s2", at: 9, hot: 71, by: "我" },
        { id: "li_s6", name: "老客回购提醒", sub: "3 段 · 24 秒", fd: "fd_s3", at: 4, hot: 58, by: "我" },
        { id: "li_s7", name: "吃完一盒该说什么", sub: "4 段 · 33 秒", fd: "fd_s3", at: 15, hot: 43, by: "我" }
      ],
      "mine.asset": [
        { id: "li_a1", name: "产品摆台", sub: "12 次使用", fd: "fd_a1", at: 3, hot: 96, pick: true, bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", by: "我" },
        { id: "li_a2", name: "开箱空镜", sub: "8 次使用", fd: "fd_a1", at: 5, hot: 88, pick: true, bg: "linear-gradient(150deg,#00A8E8,#00C2FF)", by: "我" },
        { id: "li_a3", name: "成分特写", sub: "6 次使用", fd: "fd_a1", at: 12, hot: 74, bg: "linear-gradient(150deg,#7C5CFF,#B08CFF)", by: "我" },
        { id: "li_a4", name: "手拿产品", sub: "3 次使用", fd: "fd_a1", at: 18, hot: 61, bg: "linear-gradient(150deg,#00C2FF,#8FE3FF)", by: "我" },
        { id: "li_a5", name: "平台介绍片头", sub: "5 秒 · 竖版", fd: "fd_a2", at: 1, hot: 52, bg: "linear-gradient(150deg,#2C5BFF,#00C2FF)", by: "我" },
        { id: "li_a6", name: "资质展示", sub: "8 秒 · 竖版", fd: "fd_a2", at: 21, hot: 46, bg: "linear-gradient(150deg,#5B8CFF,#8FB0FF)", by: "我" },
        { id: "li_a7", name: "总部背书讲解", sub: "12 秒 · 竖版", fd: "fd_a2", at: 26, hot: 39, bg: "linear-gradient(150deg,#0E1B3D,#2C5BFF)", by: "我" },
        { id: "li_a8", name: "素颜出镜 · 早上", sub: "9 秒 · 竖版", fd: "fd_a3", at: 2, hot: 81, pick: true, bg: "linear-gradient(150deg,#FF7A45,#FFC85B)", by: "我" },
        { id: "li_a9", name: "素颜出镜 · 晚上", sub: "7 秒 · 竖版", fd: "fd_a3", at: 8, hot: 67, bg: "linear-gradient(150deg,#F5A623,#FFC85B)", by: "我" },
        { id: "li_a10", name: "素颜出镜 · 拆快递", sub: "11 秒 · 竖版", fd: "fd_a3", at: 14, hot: 55, bg: "linear-gradient(150deg,#C71F37,#FF7A45)", by: "我" },
        { id: "li_a11", name: "我的照片 12 张", sub: "画中画专用", fd: "fd_a4", at: 7, hot: 63, bg: "linear-gradient(150deg,#7C5CFF,#2C5BFF)", go: "E2.1", by: "我" },
        { id: "li_a12", name: "我的小视频 3 段", sub: "画中画专用", fd: "fd_a4", at: 20, hot: 48, bg: "linear-gradient(150deg,#2C5BFF,#7C5CFF)", go: "E2.1", by: "我" }
      ],
      "mine.work": [
        { id: "li_w1", name: "磷虾油今晚开团，3 步选对不踩坑", sub: "1280 播放 · 今天 20:14", fd: "fd_w1", at: 1, hot: 94, pick: true, bg: "linear-gradient(160deg,#2C5BFF,#0E2A6B)", go: "B4.1", by: "我" },
        { id: "li_w2", name: "我妈吃了三个月，睡眠真的好了", sub: "860 播放 · 昨天", fd: "fd_w1", at: 2, hot: 87, bg: "linear-gradient(150deg,#00A8E8,#2C5BFF)", go: "B4.1", by: "我" },
        { id: "li_w3", name: "开箱 · 一盒里有几粒", sub: "420 播放 · 3 天前", fd: "fd_w1", at: 4, hot: 62, bg: "linear-gradient(150deg,#7C5CFF,#5B8CFF)", go: "B4.1", by: "我" },
        { id: "li_w4", name: "阿玲的复购实录", sub: "收藏 · 12.4 万播放", fd: "fd_w2", at: 9, hot: 99, pick: true, bg: "linear-gradient(150deg,#FF7A45,#FF3D6E)", go: "F3", by: "阿玲" },
        { id: "li_w5", name: "成分讲解天花板", sub: "收藏 · 8.6 万播放", fd: "fd_w2", at: 16, hot: 91, bg: "linear-gradient(150deg,#C71F37,#7A1020)", go: "F3", by: "阿强" }
      ],
      "team.script": [
        { id: "li_ts1", name: "总部 10 月口径（必用）", sub: "5 段 · 50 秒 · 品牌锁定", fd: "fd_ts1", at: 2, hot: 100, pick: true, by: "总部" },
        { id: "li_ts2", name: "团价说明模板", sub: "3 段 · 28 秒", fd: "fd_ts1", at: 5, hot: 82, pick: true, by: "总部" },
        { id: "li_ts3", name: "开箱带货结构", sub: "5 段骨架 · 可套任何品", fd: "fd_ts2", at: 13, hot: 76, by: "阿玲" }
      ],
      "team.asset": [
        { id: "li_ta1", name: "品牌宣传片", sub: "60 秒 · 横版", fd: "fd_ta1", at: 6, hot: 88, pick: true, bg: "linear-gradient(150deg,#0E1B3D,#2C5BFF)", by: "总部" },
        { id: "li_ta2", name: "总部产品图 24 张", sub: "白底 + 场景", fd: "fd_ta2", at: 3, hot: 91, pick: true, bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", by: "总部" },
        { id: "li_ta3", name: "质检报告截图", sub: "可直接贴画面", fd: "fd_ta2", at: 11, hot: 69, bg: "linear-gradient(150deg,#5B8CFF,#8FB0FF)", by: "总部" },
        { id: "li_ta4", name: "仓库发货实拍", sub: "15 秒 · 竖版", fd: "fd_ta3", at: 19, hot: 57, bg: "linear-gradient(150deg,#00A8E8,#00C2FF)", by: "阿强" }
      ],
      "team.work": [
        { id: "li_tw1", name: "阿玲爆款 · 开箱第一句就说价格", sub: "12.4 万播放", fd: "fd_tw1", at: 4, hot: 98, pick: true, bg: "linear-gradient(150deg,#2C5BFF,#00C2FF)", go: "F3", by: "阿玲" },
        { id: "li_tw2", name: "阿强 · 客户复购实录", sub: "8.6 万播放", fd: "fd_tw1", at: 10, hot: 90, bg: "linear-gradient(150deg,#7C5CFF,#B08CFF)", go: "F3", by: "阿强" }
      ],
      "friend.script": [
        { id: "li_fs1", name: "信任背书口播 v2", sub: "4 段 · 40 秒", fd: "fd_fs1", at: 2, hot: 70, pick: true, by: "阿玲" },
        { id: "li_fs2", name: "换季话术 3 句", sub: "3 段 · 25 秒", fd: "fd_fs1", at: 6, hot: 62, by: "阿玲" },
        { id: "li_fs3", name: "先讲问题再讲产品", sub: "5 段 · 48 秒", fd: "fd_fs2", at: 9, hot: 55, by: "阿强" }
      ],
      "friend.asset": [
        { id: "li_fa1", name: "素颜出镜 · 拆快递", sub: "9 秒 · 竖版", fd: "fd_fa1", at: 1, hot: 76, pick: true, bg: "linear-gradient(150deg,#FF7A45,#FFC85B)", by: "阿玲" },
        { id: "li_fa2", name: "手部特写 · 拧瓶盖", sub: "3 秒 · 竖版", fd: "fd_fa1", at: 7, hot: 58, bg: "linear-gradient(150deg,#F5A623,#FFC85B)", by: "阿玲" },
        { id: "li_fa3", name: "仓库打包现场", sub: "15 秒 · 竖版", fd: "fd_fa2", at: 11, hot: 49, bg: "linear-gradient(150deg,#00A8E8,#00C2FF)", by: "阿强" },
        { id: "li_fa4", name: "客户收货反馈截图", sub: "8 张", fd: "fd_fa2", at: 16, hot: 44, bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", by: "阿强" }
      ],
      "friend.work": [
        { id: "li_fw1", name: "换季话术 · 3 句话讲完", sub: "8.6 万播放", fd: "fd_fw1", at: 1, hot: 92, pick: true, bg: "linear-gradient(150deg,#00A8E8,#5B8CFF)", go: "F3", by: "小雨" },
        { id: "li_fw2", name: "开箱第一句就说价格", sub: "12.4 万播放", fd: "fd_fw1", at: 5, hot: 95, bg: "linear-gradient(150deg,#2C5BFF,#00C2FF)", go: "F3", by: "阿玲" },
        { id: "li_fw3", name: "客户复购实录 · 第 3 次买", sub: "8.6 万播放", fd: "fd_fw1", at: 12, hot: 84, bg: "linear-gradient(150deg,#7C5CFF,#B08CFF)", go: "F3", by: "阿强" }
      ]
    }
  },

  /* 平台精选：运营后台专题位，按人群包下发 */  platformPicks: [
    { id: "tp_31", img: "assets/bn-2.jpg", pos: "center 34%", title: "秋季滋补专题", sub: "12 条现成素材 · 平台已过审", go: "F1", audience: "全体团长" },
    { id: "tp_28", img: "assets/bn-1.jpg", pos: "center 44%", title: "高转化开箱合集", sub: "照着结构改就能发", go: "F1", audience: "近 7 天有发布的团长" }
  ]
};

/* 素材/资料统一补「使用次数 / 点赞数」——列表里每一条都要能看到这两个数。
   原型期由 hot 派生，接真接口后由后端直接返回 uses / likes，字段名不变。 */
(function fillStats() {
  const L = window.DATA.library.items;
  Object.keys(L).forEach((k) => L[k].forEach((x) => {
    if (x.uses == null) x.uses = Math.max(6, Math.round((x.hot || 50) * 1.5));
    if (x.likes == null) x.likes = Math.round((x.hot || 50) * 360);
  }));
  (window.DATA.assets || []).forEach((a, i) => {
    if (a.uses == null) a.uses = 18 + ((i * 13) % 70);
    if (a.likes == null) a.likes = 900 + i * 470;
  });
})();

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

  /* ---------- 脚本库 ----------
     和素材库分开算：脚本是「已经分好段的台词」，素材是「画面」。
     used 是这个脚本被引入过几次——复用得越多，越可能是个靠谱的底子。 */
  function scripts(scope) {
    const L = window.DATA.scriptLib;
    return !scope || scope === "all" ? L : L.filter((s) => s.scope === scope);
  }
  function script(id) {
    return window.DATA.scriptLib.filter((s) => s.id === id)[0] || window.DATA.scriptLib[0];
  }
  /* 我的库只放自己存的；团队库带上总部锁定口径，因为对团长来说都是"别人给的可直接用" */
  function scriptTabs() {
    return [
      { k: "my", tx: "我的脚本", n: scripts("my").length },
      { k: "team", tx: "团队脚本", n: scripts("team").length },
      { k: "brand", tx: "总部口径", n: scripts("brand").length }
    ];
  }

  /* ---------- 视频抽取 ---------- */
  function extract() {
    const x = window.DATA.extract;
    return {
      ...x,
      cleanedN: x.cleaned.reduce((n, c) => n + c.n, 0),
      lines: x.lines.map((l, i) => ({ ...l, no: (i + 1 < 10 ? "0" : "") + (i + 1) }))
    };
  }

  /* ---------- SOP 战役 ----------
     一条战役 = 一个天数序列，每天一个主题。
     状态只看三档：done 已发 / today 今天该发 / soon 还没到。
     团长最需要知道的是「今天讲什么」，其次才是「后面还有几天」。 */
  function campaigns(scope) {
    const L = window.DATA.campaigns;
    return !scope || scope === "all" ? L : L.filter((c) => c.status === scope);
  }
  function campaign(id) {
    return window.DATA.campaigns.filter((c) => c.id === id)[0] || window.DATA.campaigns[0];
  }
  function campaignDays(c) {
    return (c.topics || []).map((t, i) => {
      const n = i + 1;
      const state = c.status === "done" ? "done"
        : c.status === "soon" ? "soon"
        : n < c.day ? "done" : n === c.day ? "today" : "soon";
      return { n, topic: t, state, isToday: state === "today" };
    });
  }
  /* 单日详情：今天那集有总部给的解读和要点，其余天只有主题，
     进去由 AI 按主题现写——不要给没发生的事编数据 */
  function dayPlan(c, n) {
    const days = campaignDays(c);
    const d = days.filter((x) => x.n === +n)[0] || days[0];
    const today = !!d.isToday && !!c.today;
    return {
      ...d,
      cname: c.name, total: c.total, owner: c.owner, product: c.product,
      brief: today ? c.today.why.split("。")[0] + "。" : "第 " + d.n + " 天讲「" + d.topic + "」，只把这个点讲透。",
      why: today ? c.today.why
        : "第 " + d.n + " 天讲「" + d.topic + "」。这是" + c.owner + "按 " + c.total + " 天节奏排的，前几天已经铺过，这天只把一个点讲透，别贪多。",
      points: today ? c.today.points
        : ["开头一句话点题，别绕", "中间给一个具体例子或一个数字", "结尾把话头接到下一天，让人愿意等"],
      material: today ? c.today.material : "这天还没到，素材包会在开始前一天下发；现在进去 AI 会先按主题写脚本",
      ref: today ? c.today.ref : "还没发，没有数据",
      canMake: d.state !== "done"
    };
  }
  /* B2 的系列上下文要用：某一集的主题叫什么 */
  function seriesDay(n) {
    const run = window.DATA.campaigns.filter((c) => c.status === "running")[0];
    if (!run) return null;
    return campaignDays(run).filter((x) => x.n === +n)[0] || null;
  }
  function topicSeeds(product) {
    return window.DATA.topicSeeds[product] || window.DATA.topicSeeds["磷虾油"];
  }

  /* 排 N 天的选题：顺序不动，只砍中间，永远保住开头和收尾。
     为什么不是随便取前 N 个：收尾（团价 / 复盘）是整场战役的落点，
     砍掉它，后面几天就变成"一直在铺垫、始终不收单"。 */
  function planTopics(product, days) {
    const all = topicSeeds(product);
    const n = Math.max(1, Math.min(days || 10, all.length));
    if (n >= all.length) return all.slice(0, n);
    return all.slice(0, n - 1).concat([all[all.length - 1]]);
  }

  /* 一条视频里分几段（"趴"）这件事，建系列时不再让用户选——
     它其实属于"这条片子怎么写"，生成后进脚本框自然会分（见 B2 的结构骨架）。
     建系列只需要知道"这个系列一共几条视频"。 */

  /* 三种来源 → 三份草稿，共用同一套段落结构与派生逻辑。
     这就是"三个发布器合成一个"的数据基础：换的是来源，不是编辑器。 */
  const DRAFT_OF = { script: "draft", remix: "draftRemix", series: "draftSeries" };
  /* 从脚本库引入的一段话，需要配什么画面——按段名猜语义标签。
     这是引入脚本时唯一要做的一次推断：台词是现成的，画面从零配。 */
  const NEED_OF = [
    [/我是谁|立信任|开场提问|抛问题/, ["person", "broll"]],
    [/开箱/, ["unbox", "product"]],
    [/成分|原理|示意|血管/, ["ingredient", "explain"]],
    [/卖点|产品|摆台/, ["brand", "product"]],
    [/晒单|反馈|截图|成交|复购/, ["proof"]],
    [/价格|团价|CTA|引导|结尾|报价/, ["cta", "price"]],
    [/仓库|发货|打包/, ["product", "unbox"]],
    [/怎么吃|用法|答疑|问题/, ["person", "explain"]]
  ];
  function needTagsOf(name) {
    for (const [re, tags] of NEED_OF) if (re.test(name || "")) return tags;
    return ["product"];
  }

  /* 按台词时长把画面铺满：语义最像的优先，不够就用下一个，最多 3 段 */
  function fitShots(need, dur) {
    const cand = recommend({ needTags: need }, "rec");
    if (!cand.length) return [{ id: "fx0", asset: null, label: "待补画面", state: "miss", dur: 0 }];
    const out = [];
    let acc = 0, i = 0;
    while (acc < dur - 0.5 && i < cand.length && out.length < 3) {
      const a = cand[i++];
      const d = Math.min(a.dur || 3, dur - acc);
      out.push({ id: "fs_" + a.id + "_" + out.length, asset: a.id, dur: d });
      acc += d;
    }
    return out;
  }

  /* 把「一串台词」拼成一份可编辑草稿：台词照搬，画面按语义重配。
     脚本库和视频抽取都走这里——它们的差别只在台词从哪来，编辑体验完全一样。 */
  function draftFromLines(lines, meta) {
    return {
      id: meta.id, title: meta.title, kind: "script",
      product: meta.product || "磷虾油",
      status: "draft", updatedAt: window.DATA.now,
      src: meta.src, docId: meta.docId, who: meta.who,
      compliance: { ok: meta.ok !== false, hits: [], checkedAt: window.DATA.now },
      segments: lines.map((l, i) => ({
        id: "im" + (i + 1), role: "seg", name: l.name, dur: l.dur, vo: l.vo,
        voSrc: meta.who === "我" ? "self" : meta.src,
        needTags: needTagsOf(l.name), lock: l.lock || null,
        hint: "来自「" + meta.title + "」，画面按语义重新配；想换就点片段",
        shots: fitShots(needTagsOf(l.name), l.dur)
      })),
      curSeg: "im1"
    };
  }

  /* 脚本库的一份脚本 → 一份草稿 */
  function draftFromScript(id, fill) {
    const sc = script(id);
    const d = draftFromLines(sc.lines, {
      id: "df_" + sc.id, title: sc.title, product: sc.product,
      src: "import", docId: sc.id, who: sc.who, ok: sc.compliance
    });
    /* 只导入文案：台词照搬，画面全部留空，等你自己配。
       这时候每个 part 是"空槽"而不是"缺素材"——缺是指该有却缺了，
       空是指还没开始配，两者提示语和门禁都不一样。 */
    if (fill === false) d.segments = d.segments.map((x) => ({ ...x, shots: [] }));
    return d;
  }

  /* 选中的结构 → 一份草稿：段数、段名、台词、画面全按这副骨架来。
     这是"结构"这个词唯一有意义的实现——选了四段，下一屏就该是四段；
     只把结构名记住、段落还是固定五段，等于那三个选项是装饰。 */
  function draftByStruct(id) {
    const st = structOf(id);
    if (!st || !st.segs) return window.DATA.draft;
    const base = window.DATA.draft;
    return {
      ...base, id: "df_" + st.id, struct: st.id, title: base.title,
      segments: st.segs.map((x, i) => ({
        id: "sg" + (i + 1), role: x.role || "seg", name: x.name, dur: x.dur, vo: x.vo,
        needTags: x.needTags || needTagsOf(x.name), lock: x.lock || null, hint: x.hint || "",
        shots: fitShots(x.needTags || needTagsOf(x.name), x.dur)
      })),
      curSeg: "sg1"
    };
  }

  /* 抽取出来的一份文案 → 一份草稿（画面全新配，所以才叫「要文案」） */
  function draftFromExtract() {
    const x = window.DATA.extract;
    return draftFromLines(x.lines, {
      id: "df_" + x.id, title: x.title, product: "磷虾油",
      src: "extract", docId: x.id, who: x.who
    });
  }

  function draft(kind, opts) {
    opts = opts || {};
    const k = DRAFT_OF[kind] ? kind : "script";
    /* 导入脚本 / 视频抽取：都不进 DATA.draft，而是现拼一份草稿出来 */
    let d = (k === "script" && opts.src === "extract") ? draftFromExtract()
      : (k === "script" && opts.doc) ? draftFromScript(opts.doc, opts.fill)
      : (k === "script" && opts.struct && opts.struct !== "auto") ? draftByStruct(opts.struct)
      : window.DATA[DRAFT_OF[k]];
    /* AI 写完的脚本，画面先留空——让团长自己挑一遍，比 AI 猜完再逐段否掉快。
       点"一键配齐"（autoFill）才按语义一次铺满。 */
    if (k === "script" && opts.src === "ai" && !opts.autoFill) {
      d = { ...d, segments: d.segments.map((x) => ({ ...x, shots: [] })) };
    }
    if (opts.autoFill) {
      /* 一键配齐 = 把"空的"和"缺的"都配掉。缺的那种（比如结尾花字卡）如果库里
         其实有可用的，也一并补上——否则按钮写着"配齐"，点完还剩一个红槽，
         用户会以为功能坏了。 */
      d = { ...d, segments: d.segments.map((x) => (x.shots && x.shots.some((sh) => sh.asset) ? x
        : { ...x, shots: fitShots(x.needTags || needTagsOf(x.name), x.dur) })) };
    }

    /* 从素材选择器回来会带「这一段换成这个素材」，立刻反映到画面槽上——
       换完看到的就是换完的样子，不另外弹一个"已替换"的提示。
       **必须放在 ai 清空和一键配齐之后**：否则 AI 稿一进来画面又被清空一次，
       用户刚选的那段素材当场消失（这个顺序错过一次，表现为"换完没反应"）。 */
    if (opts.pick && opts.pick.seg && opts.pick.asset) {
      /* asset=up 是"刚从手机传上来的这一段"，不在素材库里，
         所以现造一个只有画面信息的 shot（有 label/bg 才画得出来）。 */
      const up = opts.pick.asset === "up";
      const a = up ? null : window.DATA.assets.filter((x) => x.id === opts.pick.asset)[0];
      if (up || a) {
        d = { ...d, segments: d.segments.map((s) => s.id !== opts.pick.seg ? s
          : { ...s, shots: [up
            ? { id: "pk_up", asset: "up", label: "我上传的 · IMG_2043", from: "my",
                bg: "linear-gradient(150deg,#0E1B3D,#2C5BFF)", dur: s.dur }
            : { id: "pk_" + a.id, asset: a.id, dur: Math.min(a.dur || 3, s.dur) }] }) };
      }
    }

    /* 系列里还没轮到的那一天：结构在，台词和画面都还没生成 */
    const pendDay = (k === "series" && opts.day && +opts.day !== d.series?.day) ? +opts.day : 0;
    let acc = 0;
    const segs = d.segments.map((s, i) => {
      const start = acc;
      acc += s.dur;
      let shotTotal = 0, missN = 0;
      /* 每天固定的段（开场立信任 / 结尾 CTA）不随日期变空，只有当天那两段要现写 */
      const blank = pendDay && !s.fixed;
      const shots = (blank ? [] : s.shots).map((sh) => {
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
        ...(blank ? { ...s, vo: "", voAlt: null, shots: [] } : s),
        no: (i + 1 < 10 ? "0" : "") + (i + 1), idx: i,
        start, shots, shotTotal, missN, tags,
        fit: Math.round((s.dur - shotTotal) * 10) / 10,
        state: missN ? "miss" : ""
      };
    });
    const total = segs.reduce((n, s) => n + s.dur, 0);
    segs.forEach((s) => { s.code = mmss(s.start + 4) + " / " + mmss(total); });
    const missSegs = segs.filter((s) => s.missN > 0);
    /* 空槽（一个画面都没有）和缺素材是两件事，但都挡住发布 */
    const emptySegs = segs.filter((s) => !s.shots.length);
    const curIdx = Math.max(0, segs.map((s) => s.id).indexOf(d.curSeg));
    const cur = segs[curIdx];
    /* 二创安全度：服务端按「画面相似度 + 文案相似度」算，这里按已改段数做前端估算，
       只用于原型演示，真实值以后端返回为准（改了文案但没换画面，分不会涨太多） */
    const changed = segs.filter((s) => s.orig && s.vo !== s.orig).length;
    const needChange = segs.filter((s) => s.suggest).length;
    const pendTopic = pendDay ? ((seriesDay(pendDay) || {}).topic || (d.series && d.series.topic) || "") : "";
    return {
      ...d, kind: k, segments: segs, cur, curIdx,
      title: pendDay ? "Day " + pendDay + " · " + pendTopic : d.title,
      pendDay, pendTopic,
      segCount: segs.length, durTotal: total,
      missCount: missSegs.reduce((n, s) => n + s.missN, 0),
      missSegs, emptySegs,
      emptyCount: emptySegs.length,
      needCount: missSegs.length + emptySegs.length,
      changed, needChange,
      safety: k === "remix" ? Math.min(95, 38 + changed * 6) : null,
      code: mmss(cur.start + 4) + " / " + mmss(total),
      track: segs.map((s) => [s.dur, ""]),
      /* 缺素材不阻断「生成预览」，但阻断「发布」——预览/发布是两道门 */
      canPreview: true,
      canPublish: missSegs.length === 0 && emptySegs.length === 0
    };
  }

  /* 一个 part 的画面槽说明：素材比台词短就循环，长就截尾。
     这句话必须写在槽下面——它决定了用户看到成片时"画面够不够用"。 */
  function slotMeta(s) {
    const sh = s.shots.filter((x) => !x.miss)[0];
    if (!sh) return s.missN ? "画面还缺" : "还没配画面 · 点加号选";
    const r = Math.ceil(s.dur / Math.max(1, sh.dur));
    const tail = r > 1 ? "循环 " + r + " 次" : (sh.dur > s.dur ? "截到 " + s.dur + "s" : "刚好铺满");
    return "素材 " + sh.dur + "s · 台词 " + s.dur + "s · " + tail;
  }

  /* ---------- 草稿箱 ----------
     首页右上角那个「草稿 N」点进来就是这里。
     只做一件事：让人一眼看出"哪条卡住了、卡在哪"，点进去接着做。
     排序：越新的越上面；同一天内按"还没配完的段数"排，缺得多的往前放。 */
  function drafts() {
    const s = draft("script"), r = draft("remix"), se = draft("series");
    const t = (x) => (x.updatedAt || "").slice(11, 16);
    const list = [
      { id: s.id, kind: "script", tag: "脚本", title: s.title,
        meta: s.segCount + " 段 · 已配 " + (s.segCount - s.missSegs.length) + "/" + s.segCount + " 段画面",
        warn: s.needCount > 0, at: t(s), go: "B2?kind=script" },
      { id: r.id, kind: "remix", tag: "二创", title: r.title,
        meta: "已改 " + r.changed + "/" + r.segCount + " 段 · 安全度 " + r.safety,
        warn: r.needCount > 0, at: t(r), go: "B2?kind=remix" },
      { id: se.id, kind: "series", tag: "系列", title: se.title,
        meta: se.series.name + " · Day " + se.series.day + "/" + se.series.total + " · " + se.segCount + " 段",
        warn: false, at: t(se), go: "D2?c=" + campaign("cp_1").id + "&d=" + se.series.day }
    ];
    return list.sort((a, b) => (b.at > a.at ? 1 : -1));
  }

  /* ---------- 开工前那几项（B1.1） ---------- */
  function brief() { return window.DATA.brief; }
  function structs() { return window.DATA.structs; }
  /* auto = 不指定，让 AI 按主题挑。返回 null，调用方自己决定怎么显示。 */
  function structOf(id) {
    if (id === "auto") return null;
    return window.DATA.structs.filter((x) => x.id === id)[0] || window.DATA.structs[0];
  }
  function tones() { return window.DATA.tones; }
  function lens() { return window.DATA.lens; }
  function len(id) {
    return window.DATA.lens.filter((x) => x.id === id)[0] || window.DATA.lens[1];
  }
  function tone(id) {
    return window.DATA.tones.filter((x) => x.id === id)[0] || window.DATA.tones[0];
  }
  /* 用户改过的选值优先，没改就用 AI 的默认值 */
  function briefOf(ctx) {
    const b = window.DATA.brief, out = {};
    Object.keys(b).forEach((k) => { out[k] = (ctx && ctx[k]) || b[k].value; });
    return out;
  }

  /* ---------- 生成设置 / 封面 ---------- */
  function templates() { return window.DATA.templates; }
  function template(id) { return window.DATA.templates.filter((x) => x.id === id)[0] || window.DATA.templates[0]; }
  function voices() { return window.DATA.voices; }
  function voice(id) { return window.DATA.voices.filter((x) => x.id === id)[0] || window.DATA.voices[0]; }
  function covers() { return window.DATA.coverStyles; }
  function cover(id) {
    return window.DATA.coverStyles.filter((x) => x.k === id)[0] || window.DATA.coverStyles[0];
  }
  function coverBases() { return window.DATA.coverBases; }
  /* 封面文案默认取自主题，不是模板里那几句示例。
     用户说的是"封面文案默认用主题文案"——主题本来就是他这次要讲的事，
     模板只该决定字压在哪，不该替他决定说什么。
     主题一般有两个分句，第一句当主标题，第二句的头一段当副标题。

     断行是这里唯一有讲究的地方：封面字一行放不下 5 个字，而中文自动折行
     会断在词中间（"磷虾油今 / 晚开团"）。所以先找时间/动作词当断点——
     "磷虾油 / 今晚开团"比"磷虾油今 / 晚开团"读着顺得多；
     找不到就断在第一行略多的位置。每行再截到 5 个字：宁可少说两个字，
     也不能让字溢出到画面外面去（封面字一出界，整张就废了）。 */
  const CUT_WORD = /(今晚|今天|明早|明天|现在|开团|上架|秒杀|返场|到手|开箱|实测|对比|怎么|为什么|到底|真的)/;
  function coverFromTopic(topic) {
    const t = String(topic || "").trim() || "磷虾油今晚开团，讲清成分和怎么买";
    const parts = t.split(/[，,。;；]/).filter(Boolean);
    let big = (parts[0] || t).trim();
    if (big.length > 10) big = big.slice(0, 10);
    const m = big.match(CUT_WORD);
    const cut = big.length < 5 ? 0
      : (m && m.index >= 2 && m.index <= big.length - 2) ? m.index : Math.ceil(big.length / 2);
    if (cut > 0 && cut < big.length) big = big.slice(0, cut) + "|" + big.slice(cut);
    /* 封面字里不留空格：「今晚 8 点」是正文的写法，压到封面上空格会把
       一行的字数吃掉半个，所以这里去掉；每行最多 5 个字，超了宁可截断。 */
    big = big.split("|").map((x) => x.replace(/\s+/g, "").slice(0, 5)).join("|");
    let small = (parts[1] || "").split(/[、，,]/)[0] || "";
    if (!small) small = "看完再决定";
    return { big, small };
  }
  function myPhotos() { return window.DATA.myPhotos; }
  function viewers() { return window.DATA.viewers; }
  function leads() { return window.DATA.viewers.filter((x) => x.lead); }
  function logs() { return window.DATA.logs; }
  function shareStat() { return window.DATA.shareStat; }
  function heatLevels() { return window.DATA.heatLevels; }
  function heat(id) {
    return window.DATA.heatLevels.filter((x) => x.id === id)[0] || window.DATA.heatLevels[1];
  }
  function comments() { return window.DATA.comments; }
  /* 素材库取数：身份域（我的/团队）+ 类别（脚本/视频素材/作品）+ 排序 + 文件夹 + 搜索词。
     顺序很重要——**先筛后排**：文件夹和搜索是"只看这些"，排序是"这些怎么摆"；
     反过来先排再筛，精选档就会变成"全库里挑几条"而不是"这一摞里挑几条"。 */
  /* 脚本正文与单条脚本：详情页要按 id 取，不想从某一类里翻 */
  function scriptBody(id) {
    return window.DATA.library.scriptBodies[id] || [];
  }
  function libItem(id) {
    const all = window.DATA.library.items;
    for (const k in all) {
      const f = all[k].filter((x) => x.id === id)[0];
      if (f) return f;
    }
    return null;
  }

  function lib(side, kind, opt) {
    opt = opt || {};
    const L = window.DATA.library;
    const sd = side === "team" ? "team" : "mine";
    const key = sd + "." + kind;
    /* moved：这一页里刚做过的"移动到文件夹"，覆盖数据里的原始归属。
       原型改不了后端，但"整理"这件事必须当场看得见——移完还留在原处，等于没移。 */
    const mv = opt.moved || {};
    let items = (L.items[key] || []).slice().map((x) => (mv[x.id] ? { ...x, fd: mv[x.id] } : x));
    if (opt.fd) items = items.filter((x) => x.fd === opt.fd);
    const q = String(opt.q || "").trim();
    if (q) items = items.filter((x) => (x.name + " " + x.sub).indexOf(q) >= 0);
    /* 三个视图，不是三个排序：
       最近用的 = 按时间倒序；我精选的 = 只留精选；按文件夹 = 分组（分组在页面里做）。
       "最热"去掉了——素材库的常态是"我记得上周用过一条"，不是"哪条最火"。 */
    if (opt.view === "pick") items = items.filter((x) => x.pick);
    items.sort((a, b) => a.at - b.at);
    const cnt = (k) => (L.items[sd + "." + k] || []).length;
    return {
      items,
      folders: (L.folders[key] || []).map((f) => ({ ...f, on: f.id === opt.fd })),
      counts: { script: cnt("script"), asset: cnt("asset"), work: cnt("work") },
      hasTeam: !!L.teamOn
    };
  }
  /* 按"评论数"取评论：填 200 条就生成 200 条，列表只渲染前 24 条，
     剩下的用一句「还有 N 条」带过——原型没必要真渲染 200 行。
     真实产品这一步是 AI 按台词 + 卖点现写，这里用种子循环。 */
  function makeComments(n) {
    const seeds = window.DATA.comments;
    const N = Math.max(0, Math.min(9999, n | 0));
    const list = seeds.slice(0, Math.min(N, seeds.length));
    return { list, total: N, more: Math.max(0, N - list.length) };
  }
  function coverBase(id) {
    return window.DATA.coverBases.filter((x) => x.k === id)[0] || window.DATA.coverBases[0];
  }

  /* 搜索：脚本库和素材库都要能搜。
     只搜"用户会用来描述的字段"（名字、标签、来源），不搜 id——
     没人会记得 as_501。空关键词返回原列表，不清空。 */
  function search(list, q, fields) {
    const k = (q || "").trim().toLowerCase();
    if (!k) return list;
    return list.filter((a) => fields.some((f) => String(a[f] || "").toLowerCase().indexOf(k) >= 0
      || (Array.isArray(a[f]) && a[f].join(" ").toLowerCase().indexOf(k) >= 0)));
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
           draft, recommend, resolveFix, mmss, pool,
           scripts, script, scriptTabs, extract,
           campaigns, campaign, campaignDays, dayPlan, seriesDay, topicSeeds, slotMeta,
           planTopics,
           templates, template, voices, voice, covers, cover, coverBases, coverBase, coverFromTopic, myPhotos,
           viewers, leads, logs, shareStat, heatLevels, heat, comments, makeComments, lib, scriptBody, libItem, search, drafts,
           brief, briefOf, structs, structOf, tones, tone, lens, len };
})();
