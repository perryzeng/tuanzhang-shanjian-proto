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
      title: "补 3 秒手部特写，磷虾油开团才能发",
      reason: "发布器里第 2 段标了「缺画面」，不补这条发不出去",
      deadline: "2026-11-01T23:59:59+08:00",
      owner: "运营 · 阿强",
      cta: { tx: "去拍", go: "B2.2" }
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
      source: "团队爆款结构", short: "爆款",
      cta: { tx: "生成", go: "B1" }
    },
    {
      id: "sg_78", productId: "p_immune", product: "换季免疫",
      title: "换季免疫 · 口播拆功效",
      structure: "问题 → 原理 → 用法",
      duration: 45, segs: 5, stockClips: 6,
      perf: 0.74, cvr: 0.038, cvrTop: 22, relevance: 12, cost: 1,
      source: "粉丝问题库", short: "问题",
      cta: { tx: "生成", go: "B1" }
    },
    {
      id: "sg_79", productId: "p_rebuy", product: "老客复购",
      title: "老客复购 · 晒单合集",
      structure: "晒单 → 复购理由 → 团价",
      duration: 32, segs: 3, stockClips: 12,
      perf: 0.91, cvr: 0.061, cvrTop: 5, relevance: 4, cost: 0,
      source: "剪同款现成", short: "同款",
      cta: { tx: "套用", go: "C1" }
    },
    {
      id: "sg_80", productId: "p_krill", product: "磷虾油",
      title: "磷虾油 · 老人能吃吗（答疑）",
      structure: "疑问 → 回答 → 引导下单",
      duration: 40, segs: 4, stockClips: 5,
      perf: 0.79, cvr: 0.031, cvrTop: 30, relevance: 15, cost: 2,
      source: "粉丝问题库", short: "问题",
      cta: { tx: "生成", go: "B1" }
    }
  ],

  /* 团队动态流：只取本团队、近 24h、已发布视频，按播放量倒序 */
  teamVideos: [
    { id: "v_901", who: "阿玲", whoBg: "rgba(44,91,255,.92)", plays: 124000, title: "磷虾油开箱 · 我妈也在吃", ago: "2 小时前", bg: "linear-gradient(135deg,#2C5BFF,#00C2FF)", go: "F3" },
    { id: "v_898", who: "阿强", whoBg: "rgba(124,92,255,.92)", plays: 86000, title: "客户复购实录 · 第 3 次买", ago: "5 小时前", bg: "linear-gradient(135deg,#7C5CFF,#B08CFF)", go: "F3" },
    { id: "v_890", who: "小雨", whoBg: "rgba(0,168,232,.92)", plays: 52000, title: "换季话术 · 3 句话讲完", ago: "昨天", bg: "linear-gradient(135deg,#00A8E8,#5B8CFF)", go: "F3" }
  ],

  /* 平台精选：运营后台专题位，按人群包下发 */
  platformPicks: [
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
  /* 建议理由：用分项指标说话，不写"我觉得" */
  function reason(s) {
    if (s.relevance >= 12) return "粉丝 7 天问了 " + s.relevance + " 次同类问题";
    return "出单率 " + (s.cvr * 100).toFixed(1) + "%，全库前 " + s.cvrTop + "%";
  }
  function meta(s) {
    const stock = s.cost === 0
      ? s.stockClips + " 条素材可用"
      : "缺 " + s.cost + " 段素材";
    return s.duration + " 秒 · " + s.segs + " 段 · " + stock;
  }

  return { mustDo, todayPost, banners, teamVideos, plays, leftText, reason, meta, now };
})();
