/* 素材与经营数据（V16 · Persona Agent 体系）

   这一版的核心变化：**素材是发动机，不是仓库。**
   所以数据模型里，一条素材不是一个"文件"，而是被 Agent 拆出来的**片段集合**：
   一条 3 分钟的视频 = 6 个 8~20 秒的片段，每个片段独立打标签、独立评分。
   团长真正会用的也是片段，不是整条视频。

   三个来源（我的 / 团队的 / 平台的）在数据层就分开存，
   但在界面层不分 tab —— 它们进同一个池子，按「能不能用」组织。 */

window.LIB = (function () {
  const stats = {
    mine: { n: 128, note: "自己传的" },
    team: { n: 342, note: "成员授权共享" },
    platform: { n: 8600, note: "行业通用" },
    clips: 316,
    pending: 12,
    issue: 5
  };

  /* 一条素材 = 一条"原始料"。真正被用的是它拆出来的片段。 */
  const items = [
    {
      id: "a1", type: "video", from: "平台",
      title: "磷虾油怎么选？营养师讲 3 个指标",
      source: "抖音 · 营养师老王 · 3.2 万赞",
      img: "assets/gen/p-brand.jpg", dur: "3:12",
      clips: 6, usable: 5, score: 86,
      tags: ["成分解释", "权威背书", "可做口播"],
      status: "ready"
    },
    {
      id: "a2", type: "video", from: "我的",
      title: "我妈吃了三个月的体检单",
      source: "自己拍 · 10 月 28 日",
      img: "assets/gen/p-chat.jpg", dur: "1:40",
      clips: 4, usable: 4, score: 92,
      tags: ["真人见证", "高信任", "只有你有"],
      status: "ready"
    },
    {
      id: "a3", type: "article", from: "团队",
      title: "中国居民膳食指南：中老年脂质摄入建议",
      source: "公众号 · 团队共享 · 小敏上传",
      img: "assets/gen/t-text.jpg", dur: "长文",
      clips: 8, usable: 6, score: 78,
      tags: ["权威来源", "可引用", "数据支撑"],
      status: "ready"
    },
    {
      id: "a4", type: "video", from: "平台",
      title: "同类产品对比：磷虾油 vs 鱼油",
      source: "小红书 · 成分党测评",
      img: "assets/gen/t-compare.jpg", dur: "2:05",
      clips: 5, usable: 3, score: 64,
      tags: ["对比", "易引战", "需改口径"],
      status: "issue",
      issue: "含「降血脂」表述，属功效宣称，必须改词"
    },
    {
      id: "a5", type: "image", from: "我的",
      title: "产品摆台 · 自然光",
      source: "自己拍 · 9 张连拍",
      img: "assets/gen/p-still.jpg", dur: "9 张",
      clips: 9, usable: 7, score: 81,
      tags: ["产品特写", "可做封面"],
      status: "ready"
    },
    {
      id: "a6", type: "video", from: "团队",
      title: "仓库发货现场（可当 B-roll）",
      source: "团队共享 · 大刘上传",
      img: "assets/gen/p-warehouse.jpg", dur: "0:48",
      clips: 3, usable: 0, score: 0,
      tags: ["空镜", "待转码"],
      status: "processing"
    }
  ];

  /* 片段：素材详情页里真正被挑的东西 */
  const clips = [
    { t: "0:12–0:26", txt: "「买磷虾油只看一个数：磷脂含量。低于 40% 的基本是凑数」", use: true, tag: "核心卖点" },
    { t: "0:31–0:44", txt: "「你看这两瓶，一瓶写 500mg 是磷虾油粉，一瓶写 500mg 是磷脂」", use: true, tag: "对比解释" },
    { t: "0:52–1:08", txt: "「我自己给我妈买，先看有没有重金属检测报告」", use: true, tag: "信任背书" },
    { t: "1:15–1:22", txt: "（画面：检测报告特写，无口播）", use: true, tag: "空镜" },
    { t: "1:40–2:05", txt: "「市面上 300 以下的，基本不用考虑」", use: false, tag: "引战 · 建议删" },
    { t: "2:30–2:48", txt: "（片尾口播，有第三方水印）", use: true, tag: "需裁水印" }
  ];

  /* 7 天排期：新用户最缺的不是工具，是"明天发什么" */
  const plan7 = [
    { d: "今天", k: "讲清楚", t: "磷虾油到底适合谁", st: "today" },
    { d: "第 2 天", k: "讲清楚", t: "成分表怎么看，3 个指标", st: "ready" },
    { d: "第 3 天", k: "讲清楚", t: "为什么中老年更需要磷脂型", st: "ready" },
    { d: "第 4 天", k: "给证据", t: "我妈吃了三个月的体检单", st: "ready" },
    { d: "第 5 天", k: "给证据", t: "老客回购实拍", st: "" },
    { d: "第 6 天", k: "给理由", t: "团购价怎么算的", st: "" },
    { d: "第 7 天", k: "给理由", t: "最后一批名额", st: "" }
  ];

  /* 人设 prompt：新人引导的产物，可读可改。
     它不是一个"字段"，是 AI 每次写台词前读的那段话。 */
  const persona = {
    prompt: `你是一位做了 3 年心脑血管科普的前海团长，家里老人也在吃。
说话像邻居大姐，不端着，不说术语。
你面对的是 35–60 岁、家里有老人、怕买错怕被忽悠的人。
你从不先说产品：先说一个具体的人、一件具体的事。
你不能说「治疗」「根治」「降血脂」，不承诺效果，不用夸张对比图。`,
    keys: ["心脑血管科普", "邻居大姐", "先说人再说货"],
    industry: "保健品 / 营养品",
    role: "团长 · 自己出镜",
    goal: "让同城的中年人觉得我懂、我不坑人"
  };

  /* 小组：不是"团队管理"，是一个组每天在发生什么。
     三样东西撑起这一页：公告（组长说的）、任务（我要交的）、动态（组里刚发生什么）。

     成员视角下，他一天打开这里就为了确认三件事：
     ① 有没有新通知 / 口径变了没
     ② 我还有什么没交
     ③ 组里谁做得好，我能学什么 */
  const team = {
    name: "前海团长 · 3 组",
    members: 12,
    isLead: false,
    week: { posts: 34, reach: 5200, leads: 47, deals: 12 },
    me: { rank: 3, posts: 5, done: 4, total: 5 },
    notices: [
      {
        id: "n1", top: true,
        t: "本周主推：磷虾油 · 秋冬心脑血管",
        body: "口径统一：先讲成分，再讲家人，最后给团购信息。不要单独发价格——单独发价格容易被当广告，也容易被比价。",
        from: "组长 大 P", at: "11-02 09:00"
      },
      {
        id: "n2", top: false,
        t: "周四晚 8 点线上碰一次",
        body: "聊聊这周哪条最有效，每个人带一条自己的数据来。20 分钟结束。",
        from: "组长 大 P", at: "11-01 18:30"
      }
    ],
    tasks: [
      { t: "第 5 集 · 老客回购实拍", due: "今天 18:00", done: 8, total: 12, me: true },
      { t: "团队口径片 · 成分怎么讲", due: "周四", done: 3, total: 12, me: true },
      { t: "本周复盘 · 发了什么有效的", due: "周日", done: 0, total: 12, me: false }
    ],
    feed: [
      { who: "小敏", av: "敏", act: "交了「老客回购实拍」", at: "2 小时前", k: "done" },
      { who: "组长", av: "P", act: "表扬了小敏：那条带来 3 个潜客、1 单成交", at: "3 小时前", k: "praise" },
      { who: "大刘", av: "刘", act: "发了新片「299 两瓶，够吃两个月」", at: "5 小时前", k: "post" },
      { who: "阿北", av: "北", act: "已经 2 天没交了", at: "今天 09:00", k: "warn" },
      { who: "小美", av: "美", act: "加入了小组", at: "昨天", k: "join" },
      { who: "小敏", av: "敏", act: "发了一条 46 秒的科普片", at: "昨天", k: "post" }
    ],
    direction: {
      title: "本周主推：磷虾油 · 秋冬心脑血管",
      note: "团队统一口径：先讲成分，再讲家人，最后给团购信息。不要单独发价格。",
      from: "组长 · 大 P"
    },
    rank: [
      { n: "小敏", av: "敏", v: 8, note: "2 单成交" },
      { n: "大刘", av: "刘", v: 7, note: "本组最高触达" },
      { n: "大 P", av: "P", v: 5, note: "你" },
      { n: "阿北", av: "北", v: 3, note: "2 天没发" }
    ],

    /* 组员名册（V21）。榜单和"点开他的动态"都从这一份算，不再两处各写一套。
       open = 隐私设置里「公开我的动态」开没开。关掉的人，榜单上照样有名次和数字，
       但点进去看不到他做了什么 —— 排名是组里的公共信息，行为轨迹是私人的。 */
    crew: [
      { id: "m_min", n: "小敏", av: "敏", bg: "linear-gradient(135deg,#FF8A65,#FF6B6B)",
        role: "3 组 · 入组 8 个月", open: true, posts: 8, leads: 14,
        note: "本周第一，组长夸了两次",
        acts: [
          { t: "今天 10:12", a: "交了「老客回购实拍」", k: "done" },
          { t: "今天 09:40", a: "被组长表扬：那条带来 3 个意向、1 单成交", k: "praise" },
          { t: "昨天 21:05", a: "发了新片「我妈吃了三个月」", k: "post" },
          { t: "昨天 20:50", a: "跟进了 4 个客户，其中 2 个当天回话", k: "lead" },
          { t: "前天 19:20", a: "领了「第 5 集 · 老客回购实拍」", k: "task" },
          { t: "11-01", a: "在组里问：体检单那段能不能重复用", k: "ask" }
        ] },
      { id: "m_liu", n: "大刘", av: "刘", bg: "linear-gradient(135deg,#7C6CFF,#A78BFA)",
        role: "3 组 · 入组 1 年", open: true, posts: 7, leads: 9,
        note: "触达最高，但转化一般",
        acts: [
          { t: "今天 08:30", a: "发了新片「299 两瓶，够吃两个月」", k: "post" },
          { t: "昨天 18:00", a: "交了「团队口径片 · 成分怎么讲」", k: "done" },
          { t: "昨天 12:10", a: "跟进了 2 个客户", k: "lead" },
          { t: "前天 20:00", a: "发了一条 46 秒的科普片", k: "post" }
        ] },
      { id: "m_me", n: "大 P", av: "P", bg: "linear-gradient(135deg,#5B8CFF,#7C6CFF)",
        role: "3 组 · 组长", open: true, posts: 5, leads: 6, me: true,
        note: "你",
        acts: [
          { t: "今天 09:20", a: "出了「老客回购实拍（第 5 集）」", k: "post" },
          { t: "今天 08:10", a: "发了本周口径公告", k: "notice" },
          { t: "昨天 20:14", a: "发到朋友圈 + 2 个群", k: "post" }
        ] },
      { id: "m_fang", n: "芳姐", av: "芳", bg: "linear-gradient(135deg,#12B886,#0B8C68)",
        role: "3 组 · 入组 6 个月", open: true, posts: 5, leads: 5,
        note: "稳定输出",
        acts: [
          { t: "今天 11:00", a: "交了「老客回购实拍」", k: "done" },
          { t: "昨天 19:30", a: "发了新片「早上冲一杯」", k: "post" },
          { t: "前天 10:00", a: "跟进了 1 个客户", k: "lead" }
        ] },
      { id: "m_kai", n: "阿凯", av: "凯", bg: "linear-gradient(135deg,#F2C14E,#D9A02B)",
        role: "3 组 · 入组 4 个月", open: true, posts: 4, leads: 4,
        note: "新人里跑得最快",
        acts: [
          { t: "今天 09:05", a: "交了「老客回购实拍」", k: "done" },
          { t: "昨天 21:40", a: "发了新片「磷虾油到底适合谁」", k: "post" },
          { t: "前天 16:20", a: "在组里问：封面用哪张好", k: "ask" }
        ] },
      { id: "m_mei", n: "小美", av: "美", bg: "linear-gradient(135deg,#C39BEA,#9B72D6)",
        role: "3 组 · 入组 2 个月", open: true, posts: 3, leads: 3,
        note: "刚起量",
        acts: [
          { t: "昨天 20:10", a: "发了新片「仓库今天发了 200 箱」", k: "post" },
          { t: "昨天 09:00", a: "加入了小组", k: "join" }
        ] },
      { id: "m_bei", n: "阿北", av: "北", bg: "linear-gradient(135deg,#8FC7D8,#5B9DB0)",
        role: "3 组 · 入组 5 个月", open: false, posts: 1, leads: 0,
        note: "已经 2 天没交",
        acts: [] },
      { id: "m_zhou", n: "老周", av: "周", bg: "linear-gradient(135deg,#9FB4D6,#7C8FB5)",
        role: "3 组 · 入组 3 个月", open: true, posts: 1, leads: 0,
        note: "不太说话",
        acts: [
          { t: "昨天 15:00", a: "发了新片「磷虾油怎么选」", k: "post" }
        ] }
    ]
  };

  /* 作品：团长剪出来的东西。这是他的资产，所以进一级 tab。
     素材（积木）降级到「我的」里的入口 —— 材料不是每天看的东西，作品才是。

     每条作品要能回答四件事：
     ① 整体数据（点开/看完/问价/成交）
     ② 动态时间轴（谁几点做了什么）
     ③ 谁看了、谁是潜客
     ④ 评论里说了什么（这些是他要回的人） */
  const works = [
    {
      id: "c1", title: "我不劝你买磷虾油，先看这张体检单",
      img: "assets/gen/p-chat.jpg", dur: "0:46", at: "10 月 30 日", ch: "朋友圈 + 2 个群",
      status: "sent",
      reach: 380, open: 128, full: 41, ask: 6, deal: 2, leads: 9, cmt: 7,
      stay: "38 秒", rate: "1.6%", tag: "本周最好",
      funnel: [["送到", 380], ["点开", 128], ["看完", 41], ["问价", 6], ["成交", 2]],
      blocks: ["b6", "b5", "b10"],
      insight: "先给证据、后提产品。看完率 32%，是平均的 2.1 倍",
      timeline: [
        { t: "10:20", who: "阿梅", av: "梅", act: "点开了这条", kind: "view" },
        { t: "10:22", who: "阿梅", av: "梅", act: "看了 1 分 12 秒，停在第 3 个要点", kind: "view" },
        { t: "10:25", who: "阿梅", av: "梅", act: "点了「问团长」", kind: "ask", hot: true },
        { t: "11:05", who: "阿强", av: "强", act: "看完 2 遍，在评论区问价", kind: "cmt", hot: true },
        { t: "11:40", who: "李姐", av: "李", act: "看了一遍，收藏了", kind: "view" },
        { t: "14:02", who: "王叔", av: "王", act: "看了 12 秒划走", kind: "out" }
      ],
      commentList: [
        { who: "阿强", av: "强", tx: "多少钱一盒？能寄到梅州吗", at: "11:06", type: "问价" },
        { who: "陈姐", av: "陈", tx: "我妈也在吃这个，确实比鱼油好吸收", at: "11:20", type: "反馈" },
        { who: "周姨", av: "周", tx: "这个血压高的能吃吗", at: "12:03", type: "咨询" }
      ]
    },
    {
      id: "c2", title: "磷虾油怎么选？营养师讲 3 个指标",
      img: "assets/gen/p-brand.jpg", dur: "1:02", at: "10 月 28 日", ch: "朋友圈",
      status: "sent",
      reach: 296, open: 84, full: 19, ask: 3, deal: 1, leads: 4, cmt: 2,
      stay: "24 秒", rate: "0.9%", tag: "",
      funnel: [["送到", 296], ["点开", 84], ["看完", 19], ["问价", 3], ["成交", 1]],
      blocks: ["b3", "b12", "b11"],
      insight: "专业性强但入口太硬。前 3 秒在讲指标，没给人停留的理由",
      timeline: [
        { t: "昨天 09:12", who: "阿华", av: "华", act: "看完了，收藏", kind: "view" },
        { t: "昨天 09:40", who: "周姨", av: "周", act: "看了一半就退了", kind: "out" }
      ],
      commentList: [
        { who: "阿华", av: "华", tx: "讲得挺清楚，就是有点专业", at: "昨天", type: "反馈" }
      ]
    },
    {
      id: "c3", title: "299 两瓶，够吃两个月",
      img: "assets/gen/p-still.jpg", dur: "0:32", at: "10 月 27 日", ch: "私聊 + 1 个群",
      status: "sent",
      reach: 96, open: 41, full: 26, ask: 8, deal: 3, leads: 6, cmt: 5,
      stay: "31 秒", rate: "3.1%", tag: "转化最高",
      funnel: [["送到", 96], ["点开", 41], ["看完", 26], ["问价", 8], ["成交", 3]],
      blocks: ["b10", "b9"],
      insight: "触达最小但转化最高。看的人少，看的人都在买 —— 缺的只是曝光",
      timeline: [
        { t: "前天 20:10", who: "阿梅", av: "梅", act: "看完，直接问怎么买", kind: "ask", hot: true },
        { t: "前天 20:32", who: "陈姐", av: "陈", act: "转发给自己老公", kind: "share", hot: true }
      ],
      commentList: [
        { who: "阿梅", av: "梅", tx: "给我留两瓶，明天来拿", at: "前天", type: "成交" },
        { who: "陈姐", av: "陈", tx: "能帮我留一份吗", at: "前天", type: "问价" }
      ]
    },
    {
      id: "c4", title: "仓库今天发了 200 箱",
      img: "assets/gen/p-warehouse.jpg", dur: "0:21", at: "10 月 26 日", ch: "朋友圈",
      status: "sent",
      reach: 312, open: 38, full: 6, ask: 0, deal: 0, leads: 0, cmt: 0,
      stay: "9 秒", rate: "0%", tag: "效果最差",
      funnel: [["送到", 312], ["点开", 38], ["看完", 6], ["问价", 0], ["成交", 0]],
      blocks: ["b9"],
      insight: "当成正片发了。这类画面只适合盖在别人说话时当背景，单独发没人看",
      timeline: [
        { t: "3 天前", who: "王叔", av: "王", act: "看了 6 秒划走", kind: "out" }
      ],
      commentList: []
    },
    {
      id: "c5", title: "早上冲一杯，我妈的习惯",
      img: "assets/gen/p-unbox.jpg", dur: "0:28", at: "10 月 25 日", ch: "朋友圈",
      status: "sent",
      reach: 268, open: 62, full: 22, ask: 2, deal: 1, leads: 3, cmt: 1,
      stay: "21 秒", rate: "1.2%", tag: "",
      funnel: [["送到", 268], ["点开", 62], ["看完", 22], ["问价", 2], ["成交", 1]],
      blocks: ["b8", "b1"],
      insight: "生活感好，但没给下一步动作。结尾加一句「想要的问我」会好很多",
      timeline: [
        { t: "4 天前", who: "李姐", av: "李", act: "看完，没说话", kind: "view" }
      ],
      commentList: [
        { who: "李姐", av: "李", tx: "看着挺方便的", at: "4 天前", type: "反馈" }
      ]
    },
    {
      id: "c6", title: "老客回购实拍（第 5 集）",
      img: "assets/gen/p-person.jpg", dur: "0:45", at: "今天 09:20 出片", ch: "出好了，还没发",
      status: "ready",
      reach: 0, open: 0, full: 0, ask: 0, deal: 0, leads: 0, cmt: 0,
      stay: "—", rate: "—", tag: "",
      funnel: [["送到", 0], ["点开", 0], ["看完", 0], ["问价", 0], ["成交", 0]],
      blocks: ["b7", "b4", "b10"],
      insight: "剪好了还没发。放了 5 小时",
      timeline: [],
      commentList: []
    },
  ];
  /* 没有草稿了（V18）：剪片全自动，剪不出来的时候 U剪 会在对话里问你，
     不会在作品列表里留一条"卡住"的半成品。作品列表里只会有两种东西：
     出好的片（待发）和发出去的片。 */

  /* 作品的数据口径（V16.9）
     「点开 / 看完 / 问价 / 成交」那套是漏斗，是客户页要讲的事。
     作品页只讲这条内容本身的表现，所以换成内容侧的五个数：
     打开次数 / 完播数 / 点赞数 / 互动数 / 分享数。

     注意 打开次数 ≠ 打开人数：同一个人可能进来好几次，
     「平均访问次数」就是 打开次数 ÷ 打开人数。 */
  const wm = {
    c1: { opens: 214, likes: 53, shares: 14, stars: 19 },
    c2: { opens: 139, likes: 26, shares: 6, stars: 9 },
    c3: { opens: 63, likes: 31, shares: 8, stars: 11 },
    c4: { opens: 44, likes: 3, shares: 0, stars: 1 },
    c5: { opens: 97, likes: 18, shares: 4, stars: 6 },
    c6: { opens: 0, likes: 0, shares: 0, stars: 0 },
  };
  works.forEach((w) => {
    const m = wm[w.id] || {};
    w.opens = m.opens || 0;
    w.likes = m.likes || 0;
    w.shares = m.shares || 0;
    w.stars = m.stars || 0;
    w.inter = w.likes + w.cmt + w.shares + w.stars;
    w.doneRate = w.open ? Math.round(w.full / w.open * 100) : 0;
    w.avgVisit = w.open ? (w.opens / w.open).toFixed(1) : "—";
  });

  /* 时间轴排序键（V16.13）
     数组顺序是"当初录 mock 的顺序"，不是"发生时间"。
     时间轴必须按真实日期排 —— 否则今天剪好的会掉到 10 月 25 日后面，
     团长会以为"今天的东西没进作品列表"。
     ts 用 YYYYMMDD 整数，比解析中文日期靠谱。 */
  const today = 20261103;
  const wt = {
    c1: 20261030, c2: 20261028, c3: 20261027, c4: 20261026, c5: 20261025,
    c6: 20261103,
  };
  works.forEach((w) => { w.ts = wt[w.id] || 0; });

  /* U剪按互动数据生成评论用的语料池。
     真接大模型时这里换成一次生成调用，返回结构不变：
     谁 / 说什么 / 什么时候 / 几个赞 / 什么类型。
     写的时候刻意混了问价、犹豫、反馈、成交四种 —— 生成出来的评论区
     如果全是好话，一眼假，团长自己也不敢发。 */
  const genPool = [
    { who: "阿梅", av: "梅", tx: "多少钱一盒？能寄到梅州吗", at: "刚刚", likes: 12, type: "问价" },
    { who: "周姨", av: "周", tx: "血压高的能吃吗，我妈 68 了", at: "刚刚", likes: 8, type: "咨询" },
    { who: "陈姐", av: "陈", tx: "我妈吃了三个月，血脂确实降下来了", at: "1 分钟前", likes: 21, type: "反馈" },
    { who: "阿强", av: "强", tx: "这个跟鱼油有啥区别，别又是智商税", at: "2 分钟前", likes: 6, type: "质疑" },
    { who: "李叔", av: "李", tx: "一次买两瓶会不会太多了，能先来一瓶试试吗", at: "3 分钟前", likes: 9, type: "犹豫" },
    { who: "王姨", av: "王", tx: "刚拍了两瓶，团长说明天就能到", at: "5 分钟前", likes: 15, type: "成交" },
    { who: "小林", av: "林", tx: "给爸妈买的，他们自己不会弄，能直接寄老家吗", at: "8 分钟前", likes: 4, type: "问价" },
    { who: "张姐", av: "张", tx: "体检单那段看得我心里一紧，我妈也是这个指标", at: "12 分钟前", likes: 18, type: "反馈" },
    { who: "阿华", av: "华", tx: "299 两瓶是几个月的量？一天算下来多少钱", at: "15 分钟前", likes: 7, type: "问价" },
    { who: "刘姨", av: "刘", tx: "之前买过别家的，吃了没感觉，这个真不一样吗", at: "20 分钟前", likes: 5, type: "质疑" },
    { who: "老陈", av: "陈", tx: "我这种做过支架的能吃不", at: "26 分钟前", likes: 3, type: "咨询" },
    { who: "黄姐", av: "黄", tx: "已经推荐给我姐了，她也在问", at: "半小时前", likes: 11, type: "反馈" }
  ];

  /* 客户：从「数据」改成「人」。
     每个客户都要能回答四件事：
     ① 她是怎么来的（哪条视频、哪个渠道、什么时候）
     ② 她关心什么、卡在哪（AI 从行为里归纳，不是团长手填）
     ③ 下一步该干什么（给建议，不只给分数）
     ④ 第一句怎么说（给话术，可直接复制）

     这是"客户经营"而不是"客户统计"：分数只是排序用的，真正有用的是「怎么聊」。 */
  const customers = [
    {
      id: "u_amei", name: "阿梅", call: "梅姐", av: "梅", score: 86, stage: "hot",
      tag: "问过价",
      bg: "linear-gradient(135deg,#FF8A65,#FF6B6B)",
      from: { c: "我不劝你买磷虾油，先看这张体检单", ch: "朋友圈", at: "11 月 2 日" },
      profile: "45 岁上下，家里有老人，问过两次价格",
      cares: ["怕一次买两瓶吃不完", "在意一天花多少钱"],
      history: [
        { t: "11-02 10:20", a: "点开「体检单」那条", k: "view" },
        { t: "11-02 10:22", a: "看了 1 分 12 秒，停在第 3 个要点", k: "view" },
        { t: "11-02 10:25", a: "点了「问团长」", k: "ask" },
        { t: "11-02 15:40", a: "私聊问了「多少钱一盒」", k: "cmt" }
      ],
      bought: "还没买过",
      stuck: "在算账。想要，但怕买了吃不完浪费",
      advice: "别讲成分了。直接给她算一天多少钱，再开个小口子：先拿一瓶试试。",
      scripts: [
        "梅姐，按一天算不到 5 块，比你早上那杯豆浆还便宜。要不先拿一瓶试试，吃满一个月再看？",
        "两瓶装是团价，你真担心吃不完，我帮你跟隔壁拼一单，一人一瓶。",
        "我妈也是先吃一瓶，后来自己催我补的。你要不先拿一瓶？"
      ]
    },
    {
      id: "u_qiang", name: "阿强", call: "强哥", av: "强", score: 74, stage: "hot",
      tag: "问过价",
      bg: "linear-gradient(135deg,#7C6CFF,#A78BFA)",
      from: { c: "299 两瓶，够吃两个月", ch: "微信群", at: "10 月 27 日" },
      profile: "在外地工作，想寄给老家父母",
      cares: ["能不能寄外地", "老人自己会不会吃"],
      history: [
        { t: "10-27 20:12", a: "在群里点开「299 两瓶」", k: "view" },
        { t: "10-27 20:15", a: "看完 2 遍", k: "view" },
        { t: "10-27 20:18", a: "群里问「能寄梅州吗」", k: "cmt" },
        { t: "11-01 09:30", a: "又点开一次，没说话", k: "view" }
      ],
      bought: "还没买过",
      stuck: "想买给父母，但担心老人不会吃、寄过去麻烦",
      advice: "他不是给自己买，别跟他讲成分。解决「寄到 + 教会老人吃」这两件事，他就下单。",
      scripts: [
        "强哥，能寄，我这边发顺丰，明天到。里面有一张吃法卡，字大，叔叔阿姨照着吃就行。",
        "你要是怕他们忘了吃，我每周三在群里提醒一次，你让他们跟着我就行。",
        "寄老家的话我建议直接两瓶，够吃两个月，省得你再跑一趟。"
      ]
    },
    {
      id: "u_hua", name: "阿华", call: "华姐", av: "华", score: 58, stage: "warm",
      tag: "收藏了",
      bg: "linear-gradient(135deg,#5AC8FA,#0A86C4)",
      from: { c: "磷虾油怎么选？营养师讲 3 个指标", ch: "私聊", at: "10 月 28 日" },
      profile: "自己研究型，收藏了 2 条，没问过价",
      cares: ["成分靠不靠谱", "和鱼油比好在哪"],
      history: [
        { t: "10-28 09:12", a: "看完「3 个指标」那条", k: "view" },
        { t: "10-28 09:14", a: "收藏了", k: "save" },
        { t: "10-30 21:05", a: "又看了「体检单」那条，看了一半", k: "view" }
      ],
      bought: "还没买过",
      stuck: "在比较，还没被说服「值这个价」",
      advice: "她是研究型的，别催。给她一份能自己看的东西（检测报告/对比），让她自己得出结论。",
      scripts: [
        "华姐，你上次收藏的那条，我把里面提到的检测报告找出来了，46 项，你慢慢看。",
        "跟鱼油的区别就一句话：吸收率差 3 倍。你要是想细看，我发你一份对比表。"
      ]
    },
    {
      id: "u_li", name: "李姐", call: "李姐", av: "李", score: 46, stage: "cold",
      tag: "只看过",
      bg: "linear-gradient(135deg,#12B886,#0B8C68)",
      from: { c: "早上冲一杯，我妈的习惯", ch: "朋友圈", at: "10 月 25 日" },
      profile: "刷到过 2 条，都没互动",
      cares: ["还在观望"],
      history: [
        { t: "10-25 08:20", a: "点开「早上冲一杯」，停 48 秒", k: "view" },
        { t: "10-30 11:40", a: "点开「体检单」，看了一遍", k: "view" }
      ],
      bought: "还没买过",
      stuck: "在门口看，还没到聊的阶段",
      advice: "现在私信她只会被当广告。继续发内容，等她主动点第三次再聊。",
      scripts: [
        "（先别私信。等她下次点开或点赞，再发：李姐，看你常看这个，家里也有老人吗？）"
      ]
    },
    {
      id: "u_chen", name: "陈姐", call: "陈姐", av: "陈", score: 92, stage: "deal",
      tag: "买过 2 次",
      bg: "linear-gradient(135deg,#C4A7FF,#7C6CFF)",
      from: { c: "299 两瓶，够吃两个月", ch: "朋友圈", at: "10 月 27 日" },
      profile: "老客，买过两次，转发过给老公",
      cares: ["复购价", "吃完了没"],
      history: [
        { t: "10-27 20:30", a: "看完「299 两瓶」直接下单", k: "deal" },
        { t: "10-27 20:32", a: "转发给自己老公", k: "share" },
        { t: "11-01 19:10", a: "问「还有吗，想再拿两瓶」", k: "cmt" }
      ],
      bought: "买过 2 次 · 最近一次 11 月 1 日",
      stuck: "不用劝，她已经在复购。要做的是让她带人来",
      advice: "她要复购，直接给老客价。顺便问一句能不能带一个邻居，给点好处。",
      scripts: [
        "陈姐，老客价我给你留着，还是 299。这次要不要多拿一瓶给亲家试试？",
        "你身边要是有想试的，可以拉一个进来，我给她算首单价，你这边我再送一瓶。"
      ]
    },

    /* 下面两位是为了把四档补全：没有「潜在」和「新客」，那几个筛选项就是空的 */
    {
      id: "u_lin", name: "小林", call: "小林", av: "林", score: 52, stage: "warm",
      tag: "收藏了",
      bg: "linear-gradient(135deg,#8FC7D8,#5B9DB0)",
      from: { c: "磷虾油怎么选？营养师讲 3 个指标", ch: "视频号", at: "11 月 1 日" },
      profile: "30 岁上下，替父母研究，自己在先做功课",
      cares: ["老人能不能长期吃", "有没有副作用"],
      history: [
        { t: "11-01 21:10", a: "在视频号点开「3 个指标」", k: "view" },
        { t: "11-01 21:12", a: "看了 1 分 02 秒，收藏了", k: "save" },
        { t: "11-02 20:40", a: "又点开一次，没说话", k: "view" }
      ],
      bought: "还没买过",
      stuck: "替父母研究，还没决定要不要买",
      advice: "他不是自己吃，别讲口感。给一份能转给爸妈看的东西，让他拿去说服家里。",
      scripts: [
        "小林，你收藏的那条我整理成一页纸了，字大，直接转给叔叔阿姨看就行。",
        "他们要是担心副作用，这瓶一天两粒，饭后吃，跟降压药隔开一小时。"
      ]
    },
    {
      id: "u_zhou", name: "周姨", call: "周姨", av: "周", score: 24, stage: "cold",
      tag: "刚到",
      bg: "linear-gradient(135deg,#FFD166,#F2A33C)",
      from: { c: "我不劝你买磷虾油，先看这张体检单", ch: "朋友圈", at: "今天" },
      profile: "今天刚点进来，停了 12 秒",
      cares: ["还不清楚"],
      history: [
        { t: "今天 09:12", a: "点开「体检单」，停了 12 秒就划走", k: "out" }
      ],
      bought: "还没买过",
      stuck: "刚进来，还没到能聊的程度",
      advice: "现在私信她一定被当广告。等她自己点第二次，再开口。",
      scripts: [
        "（先别私信。她下次点开或点赞，再发：周姨，家里也有老人吧？）"
      ]
    }
  ];

  /* 客户分层（V18）
     四档不是"感觉"，是**证据推出来的**，所以每一档都要能说出为什么：
       重点跟进 = 问过价 / 买过，而且来过不止一次
       潜在客户 = 有互动（收藏、点赞、评论），但还没问价
       一般客户 = 打开过，但一次互动都没有
       新客     = 刚到，只打开过一次
     ev 就是那张"证据"：三个数，一行放得下，团长扫一眼就知道凭什么是这档。
     last = 最近一次访问，放在来源行右边 —— 凉没凉，看这个最快。 */
  /* follow = 跟进状态，是**团长自己的动作**，不是算出来的。
       todo 待跟进（该动手了）/ done 已跟进（聊过了）/ wait 先放着（还没到聊的时候）
     分层（tier）是"这人值多少"，跟进状态是"我做到哪了"。两个维度都得有：
     只分层，128 个人看完还是不知道从谁开始。 */
  const ct = {
    u_amei: { tier: "key", follow: "todo", last: "今天 10:22", n: 5, ev: [["5", "次打开"], ["1分12秒", "最长停留"], ["2", "次问价"]] },
    u_qiang: { tier: "key", follow: "todo", last: "昨天 09:30", n: 3, ev: [["3", "次打开"], ["1分28秒", "最长停留"], ["1", "次问价"]] },
    u_chen: { tier: "key", follow: "done", last: "今天 08:15", n: 4, ev: [["4", "次打开"], ["2分05秒", "最长停留"], ["2", "次复购"]] },
    u_hua: { tier: "pot", follow: "wait", last: "10 月 30 日", n: 3, ev: [["3", "次打开"], ["55 秒", "最长停留"], ["2", "条收藏"]] },
    u_lin: { tier: "pot", follow: "todo", last: "昨天 20:40", n: 2, ev: [["2", "次打开"], ["1分02秒", "最长停留"], ["1", "条收藏"]] },
    u_li: { tier: "gen", follow: "wait", last: "10 月 30 日", n: 2, ev: [["2", "次打开"], ["48 秒", "最长停留"], ["0", "次互动"]] },
    u_zhou: { tier: "new", follow: "wait", last: "今天 09:12", n: 1, ev: [["1", "次打开"], ["12 秒", "最长停留"], ["0", "次互动"]] }
  };
  customers.forEach((c) => {
    const m = ct[c.id] || { tier: "gen", follow: "todo", last: "—", n: 0, ev: [[0, "次打开"], [0, "次互动"]] };
    c.tier = m.tier; c.follow = m.follow; c.last = m.last; c.visits = m.n; c.ev = m.ev;
  });


  /* 三个平台的模拟互动数据。
     原型里一套数据通用；真实产品按「作品 × 平台」各存一份。
     团长可以手改（模拟），也可以贴真实链接让爬虫回填。 */
  /* 三平台的默认互动数。stars = 收藏/在看，forwards = 转发到群/好友。
     抖音底栏是 点赞/分享/收藏/评论，视频号右栏是 赞/评/转/藏，小红书底栏是 赞/藏/评 —— 
     叫法不一样，底下是同一组数，所以这里四个都给齐。 */
  const plats = {
    wx:  { k: "wx",  name: "视频号", short: "视", likes: 186,  comments: 23,  shares: 17,  forwards: 9,  stars: 42,  link: "" },
    dy:  { k: "dy",  name: "抖音",   short: "抖", likes: 4210, comments: 168, shares: 320, forwards: 88, stars: 386, link: "" },
    xhs: { k: "xhs", name: "小红书", short: "红", likes: 96,   comments: 12,  shares: 6,   forwards: 3,  stars: 58,  link: "" }
  };

  const board = {
    me: { visitors: 47, repeat: 9, asked: 2, deals: 3, posts: 5 },
    team: { visitors: 1204, repeat: 186, asked: 41, deals: 12, posts: 34 },
    trend: [12, 18, 15, 26, 31, 28, 47],
    leads: [
      { id: "u_amei", call: "梅姐", name: "阿梅", av: "梅", score: 86, acts: "看了 3 遍 · 点了「问团长」", bg: "linear-gradient(135deg,#FF8A65,#FF6B6B)", from: "朋友圈" },
      { id: "u_qiang", call: "强哥", name: "阿强", av: "强", score: 74, acts: "看完 2 遍 · 评论区问价", bg: "linear-gradient(135deg,#7C6CFF,#A78BFA)", from: "微信群" },
      { id: "u_hua", call: "华姐", name: "阿华", av: "华", score: 58, acts: "看完 1 遍 · 收藏了", bg: "linear-gradient(135deg,#5AC8FA,#0A86C4)", from: "私聊" }
    ]
  };


  /* 积木：加工完成的成品单元。
     素材页的主体是这一层 —— 用户平时要的是"一段能直接进片的画面/一句话"，
     而不是"我三个月前传的那条 3 分钟视频"。
     原始素材（原始料）在 A8.1.1，是一个更深一层的入口。 */

  /* 积木（切片）。字段照着真实结构化数据来，但**只把用户能懂的露出来**。
     隐藏：切片 ID / 源 ID / OSS 路径 / 运镜手法 / 画面实体语义 —— 那些是给检索和算法用的。
     露出：叙事功能（一级分类）/ 内容类型 / 画面摘要 / 景别 / 情绪 / 权威 / 星级 / 使用情况。 */
  const fnCats = [
    { k: "开场钩子", n: 18, note: "一句话让人停住" },
    { k: "展示细节", n: 42, note: "把东西讲清楚" },
    { k: "证明可信", n: 27, note: "凭什么信你" },
    { k: "场景氛围", n: 31, note: "过日子那种感觉" },
    { k: "收尾行动", n: 14, note: "怎么买、还差几个" }
  ];

  const blocks = [
    { id: "b1", fn: "开场钩子", cat: "真人出镜", dur: "0:08", img: "assets/gen/p-person.jpg",
      summary: "本人正对镜头，手里拿着体检单，第一句就说不劝你买",
      shot: "中景", mood: "真实家常", from: "我的", auth: "自己拍的", star: 5, used: 4, teamUsed: 6 },
    { id: "b2", fn: "开场钩子", cat: "产品出镜", dur: "0:06", img: "assets/gen/p-brand.jpg",
      summary: "两瓶并排放在桌上，手推过去，字幕写「差 5 倍」",
      shot: "特写", mood: "专业严谨", from: "平台", auth: "专业达人", star: 4, used: 2, teamUsed: 9 },
    { id: "b3", fn: "展示细节", cat: "成分讲解", dur: "0:14", img: "assets/gen/t-text.jpg",
      summary: "手指点在成分表「磷脂含量」那一行，镜头跟着推进去",
      shot: "特写", mood: "专业严谨", from: "平台", auth: "专业达人", star: 4, used: 3, teamUsed: 7 },
    { id: "b4", fn: "展示细节", cat: "产品实拍", dur: "0:09", img: "assets/gen/p-still.jpg",
      summary: "自然光下转瓶身，能看见瓶底的批次号",
      shot: "特写", mood: "清爽生活化", from: "我的", auth: "自己拍的", star: 5, used: 6, teamUsed: 8 },
    { id: "b5", fn: "证明可信", cat: "检测报告", dur: "0:12", img: "assets/gen/p-brand.jpg",
      summary: "翻到检测报告第 3 页，手指停在「重金属」那一栏",
      shot: "特写", mood: "专业严谨", from: "我的", auth: "自己拍的", star: 5, used: 3, teamUsed: 4 },
    { id: "b6", fn: "证明可信", cat: "顾客反馈", dur: "0:18", img: "assets/gen/p-chat.jpg",
      summary: "我妈吃了三个月，这是她的体检单，你们自己看",
      shot: "特写", mood: "真实家常", from: "我的", auth: "自己拍的", star: 5, used: 4, teamUsed: 2 },
    { id: "b7", fn: "证明可信", cat: "真人口述", dur: "0:10", img: "assets/gen/p-person.jpg",
      summary: "吴阿姨自己说：以前上两层楼要歇，现在能自己去买菜",
      shot: "中景", mood: "温暖家常", from: "团队", auth: "成员授权", star: 4, used: 2, teamUsed: 5 },
    { id: "b8", fn: "场景氛围", cat: "日常使用", dur: "0:05", img: "assets/gen/p-unbox.jpg",
      summary: "早上冲一杯，放在早餐旁边，窗外有光",
      shot: "中景", mood: "清爽生活化", from: "团队", auth: "成员授权", star: 3, used: 1, teamUsed: 3 },
    { id: "b9", fn: "场景氛围", cat: "仓库发货", dur: "0:06", img: "assets/gen/p-warehouse.jpg",
      summary: "仓库里一箱箱码好，适合盖在你说价格的时候",
      shot: "全景", mood: "忙碌真实", from: "团队", auth: "成员授权", star: 3, used: 0, teamUsed: 2 },
    { id: "b10", fn: "收尾行动", cat: "价格口播", dur: "0:11", img: "assets/gen/p-still.jpg",
      summary: "把两瓶摆正，报团购价，右下角打出剩余名额",
      shot: "中景", mood: "干脆利落", from: "我的", auth: "自己拍的", star: 4, used: 5, teamUsed: 9 },
    { id: "b11", fn: "收尾行动", cat: "引导私信", dur: "0:07", img: "assets/gen/p-chat.jpg",
      summary: "对着镜头说「想要的私信我」，手指点向屏幕下方",
      shot: "中景", mood: "亲切", from: "平台", auth: "专业达人", star: 4, used: 3, teamUsed: 11 },
    { id: "b12", fn: "展示细节", cat: "对比展示", dur: "0:15", img: "assets/gen/t-compare.jpg",
      summary: "两瓶摆一起，一瓶标磷虾油粉、一瓶标磷脂，一眼看出差别",
      shot: "特写", mood: "专业严谨", from: "平台", auth: "专业达人", star: 4, used: 2, teamUsed: 6 }
  ];


  return { stats, items, clips, fnCats, blocks, works, contents: works, customers, plats, plan7, persona, team, board, genPool, today };
})();
