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
        vo: "我是阿珍，做大健康选品 5 年。", needTags: ["person", "broll"], lock: null, fixed: true,
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
        { name: "我是谁 · 立信任", dur: 8, vo: "我是阿珍，做大健康选品 5 年。" },
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
      { name: "使用感受", dur: 9, vo: "我吃了三个月，真的绝了，睡眠好了很多……" },
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

  /* ---------- 生成设置：网感模板 ----------
     模板决定"这条片子长什么样"：切得多快、字幕什么样式、什么转场、BGM 什么调性。
     内置 6 款，按真实投放效果排；接真接口：GET /templates?scene=script|series
     rate 是同类视频用这个模板后相对基线的提升，来自内容数据后台。 */
  templates: [
    { id: "tp_fast", cat: "hot", name: "快闪卡点", tag: "爆款", rate: "完播 +18%", c1: "#FF7A45", c2: "#FF3D6E",
      big: "一天不到 3 块", sub: "今晚 8 点开团", desc: "每 1.5 秒切一次，适合开箱 / 晒单", bits: ["1.5s 一切", "鼓点卡点", "大字闪出"] },
    { id: "tp_big", cat: "hot", name: "大字口播", tag: "稳妥", rate: "完播 +9%", c1: "#2C5BFF", c2: "#00C2FF",
      big: "磷虾油怎么选", sub: "3 步不踩坑", desc: "台词逐句出大字，不出镜也清楚", bits: ["逐句大字", "描边白字", "缓慢推近"] },
    { id: "tp_bi", cat: "bi", name: "双语红", tag: "双语", rate: "完播 +21%", c1: "#C71F37", c2: "#7A1020",
      big: "双行排版", sub: "中英双语 · 更显专业", desc: "上下双语字幕，适合讲成分", bits: ["双语字幕", "红底白字", "双行排版"] },
    { id: "tp_bi2", cat: "bi", name: "明快彩彩", tag: "双语", rate: "完播 +14%", c1: "#00B389", c2: "#00C2FF",
      big: "智能加标题", sub: "自动识别并加字幕", desc: "彩色描边 + 自动字幕", bits: ["自动字幕", "彩色描边", "双行排版"] },
    { id: "tp_pink", cat: "bi", name: "甜趣桃粉", tag: "双语", rate: "完播 +11%", c1: "#FF7BA9", c2: "#FF4E88",
      big: "为双屏字幕", sub: "边讲边出字", desc: "粉调柔和，适合讲使用感受", bits: ["柔光", "双行字幕", "轻转场"] },
    { id: "tp_scroll", cat: "new", name: "图文滚动", tag: "省素材", rate: "完播 +4%", c1: "#00A8E8", c2: "#5B8CFF",
      big: "5 个细节", sub: "图往上滑着讲", desc: "图片往上滑 + 字幕，缺画面时最好用", bits: ["竖向滚动", "图片优先", "轻音乐"] },
    { id: "tp_twist", cat: "new", name: "剧情反转", tag: "涨粉", rate: "涨粉 +22%", c1: "#7C5CFF", c2: "#B08CFF",
      big: "先别急着买", sub: "看完再说", desc: "先抛一句反常识，再解释", bits: ["开头反问", "停顿 1 秒", "字幕放大"] },
    { id: "tp_compare", cat: "hot", name: "对比测评", tag: "带货", rate: "出单 +12%", c1: "#F5A623", c2: "#FFC85B",
      big: "鱼油 vs 磷虾油", sub: "差在一个吸收率", desc: "左右分屏，讲成分差异最直观", bits: ["左右分屏", "打勾标记", "价格收尾"] },
    { id: "tp_talk", cat: "hot", name: "真人出镜", tag: "信任", rate: "出单 +8%", c1: "#0E1B3D", c2: "#2C5BFF",
      big: "我吃了两个月", sub: "变化就在这", desc: "口播为主，画中画辅助", bits: ["人像抠图", "画中画", "原声优先"] },
    { id: "tp_sale", cat: "sale", name: "双 11 大促", tag: "促销", rate: "点击 +30%", c1: "#E8262D", c2: "#FF8A00",
      big: "今晚 8 点开团", sub: "库存 300 组", desc: "红金促销版，价格和倒计时压满屏", bits: ["价格大字", "倒计时", "红金配色"] },
    { id: "tp_diary", cat: "diary", name: "视频日记", tag: "朴实", rate: "完播 +7%", c1: "#5B6B8C", c2: "#9AA5BD",
      big: "第 5 天", sub: "记录一下", desc: "手账感字幕，适合日更打卡", bits: ["手写体", "日期角标", "慢节奏"] }
  ],

  /* 音色：原音 or AI 配音。
     团长的人设决定选哪个——宝妈选亲和女声，讲成分选沉稳男声，讲养生选长辈音。
     接真接口：GET /voices，AI 部分走 TTS 音色库。 */
  voices: [
    { id: "v_self", k: "self", name: "我的原音", sub: "用你录的声音 · 信任最高", tag: "" },
    { id: "v_f1", k: "ai", name: "亲和女声", sub: "30 岁 · 邻居姐姐感", tag: "推荐" },
    { id: "v_f2", k: "ai", name: "干脆女声", sub: "25 岁 · 节奏快，适合带货", tag: "" },
    { id: "v_m1", k: "ai", name: "沉稳男声", sub: "40 岁 · 讲成分可信", tag: "" },
    { id: "v_m2", k: "ai", name: "长辈音", sub: "50+ · 讲养生更可信", tag: "" }
  ],

  /* AI 网感封面：按这条的台词生成 6 张，风格各不同，选一张发。
     为什么不是"从视频帧里截一张"：竖屏信息流里封面图决定点击，
     截帧永远是糊的、字也压不住，网感封面是投手做出来的。 */
  coverStyles: [
    { k: "price", name: "大字价格", big: "一天不到 3 块", small: "今晚 8 点开团", c1: "#FF7A45", c2: "#FFB020" },
    { k: "ask", name: "疑问钩子", big: "孩子能吃吗？", small: "一次讲清楚", c1: "#2C5BFF", c2: "#00C2FF" },
    { k: "vs", name: "左右对比", big: "鱼油 vs 磷虾油", small: "差在一个吸收率", c1: "#5B3FD1", c2: "#7C8CFF" },
    { k: "face", name: "真人大字", big: "我吃了两个月", small: "变化就在这", c1: "#0E1B3D", c2: "#2C5BFF" },
    { k: "ing", name: "成分特写", big: "磷脂型更好吸收", small: "每粒 500mg", c1: "#00A8E8", c2: "#5B8CFF" },
    { k: "proof", name: "晒单背书", big: "37 个老客回购", small: "原话都在评论区", c1: "#00B389", c2: "#00C2FF" }
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

  /* 一天几趴 → 这一天的段落骨架。3 趴最省事，5 趴最完整。
     "趴"就是脚本框里的 part：一段台词 + 一个画面槽。 */
  const SKELETON = {
    3: ["开场立信任", "今天讲什么", "CTA · 开团"],
    4: ["开场立信任", "今天讲什么", "例子或反馈", "CTA · 开团"],
    5: ["开场立信任", "报天数", "今天讲什么", "例子或反馈", "CTA · 开团"]
  };
  function partSkeleton(n) {
    return SKELETON[+n] || SKELETON[5];
  }

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
      : window.DATA[DRAFT_OF[k]];
    /* 从素材选择器回来会带「这一段换成这个素材」，立刻反映到画面槽上——
       换完看到的就是换完的样子，不另外弹一个"已替换"的提示 */
    if (opts.pick && opts.pick.seg && opts.pick.asset) {
      const a = window.DATA.assets.filter((x) => x.id === opts.pick.asset)[0];
      if (a) {
        d = { ...d, segments: d.segments.map((s) => s.id !== opts.pick.seg ? s
          : { ...s, shots: [{ id: "pk_" + a.id, asset: a.id, dur: Math.min(a.dur || 3, s.dur) }] }) };
      }
    }
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

  /* ---------- 生成设置 / 封面 ---------- */
  function templates() { return window.DATA.templates; }
  function template(id) { return window.DATA.templates.filter((x) => x.id === id)[0] || window.DATA.templates[0]; }
  function voices() { return window.DATA.voices; }
  function voice(id) { return window.DATA.voices.filter((x) => x.id === id)[0] || window.DATA.voices[0]; }
  function covers() { return window.DATA.coverStyles; }

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
           planTopics, partSkeleton,
           templates, template, voices, voice, covers, search, drafts };
})();
