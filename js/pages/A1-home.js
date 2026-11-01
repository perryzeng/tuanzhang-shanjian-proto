/* A1 首页
   两个场景（右侧「本页状态」切换）：
   - old：老用户日常首页
   - new：新用户首周首页
   数据全部来自 js/data.js + window.DERIVE，页面不写死任何数字与结论。 */

window.PAGES["A1"].states = [
  { k: "old", n: "老用户：今天必须做 + 今天发什么 + 团队/平台" },
  { k: "new", n: "新用户：引导发第一条 + 立身份 IP 人设" }
];

/* 右侧面板「数据来源」：给共创和开发看每个数字从哪来 */
window.PAGES["A1"].sources = [
  { block: "问候行", sys: "账号系统 / 团队关系表 / 通知中心", rule: "团队人数=成员表 status=active；未读=read_at 为空" },
  { block: "Banner", sys: "运营后台 · banner 位", rule: "按人群包 + 时间窗下发，过期自动下线，必带落地页" },
  { block: "今天必须做", sys: "素材缺口 + 团队派发 + SOP 打卡", rule: "三源合并；卡住发布的权重 50，团队任务 30，打卡 10；再按剩余时长排序，最多 3 条" },
  { block: "今天发什么", sys: "内容数据后台 + 粉丝互动库 + 素材库存", rule: "出单率 45% + 完播 15% + 粉丝相关度 25% + 素材成本 15%，同商品只推 1 条，最多 3 条" },
  { block: "团队最新", sys: "团队动态流", rule: "本团队近 24h 已发布视频，按播放量倒序" },
  { block: "平台精选", sys: "运营后台 · 专题位", rule: "按人群包下发，与 banner 共用投放系统" }
];

window.PAGES["A1"].render = function (ctx) {
  const C = window.C, G = window.G;
  const D = window.DATA, A = window.DERIVE;
  const mode = (ctx.mode || "old") === "new" ? "new" : "old";
  const me = D.me;

  /* ---------- Banner：只渲染没过期的（数据来自运营后台） ---------- */
  const bannerAll = A.banners();
  const bannerOld = C.banner({
    items: bannerAll.map((b) => ({
      img: b.img, pos: b.pos, badge: b.badge, title: b.title,
      sub: b.sub, btn: b.btn, go: b.go
    }))
  });
  const bannerNew = C.banner({
    items: [{
      img: "assets/bn-3.jpg", pos: "center 50%", badge: "新人专享",
      title: "新人 7 天流量扶持计划", sub: "前 3 条视频平台加倍推送",
      btn: "看规则", go: "D1"
    }]
  });

  /* ---------- 今天必须做：三源合并后按权重 + 剩余时长排序 ---------- */
  const tasksAll = A.mustDo(99);
  const taskCards = A.mustDo(3).map((t) => ({
    badge: t.sys,                                  // 来源系统直接做角标
    cls: t.leftH <= 8 ? "hot" : (t.sysCode === "sop_checkin" ? "todo" : ""),
    time: A.leftText(t.leftH),
    title: t.title,
    meta: t.reason,
    from: "来自：" + t.owner,
    btn: t.cta.tx,
    go: t.cta.go
  }));

  /* ---------- 今天发什么：打分排序 + 同商品去重 ---------- */
  const sugg = A.todayPost(3).map((s) => ({
    bg: s.productId === "p_krill" ? G("#2C5BFF", "#5B8CFF")
      : s.productId === "p_immune" ? G("#7C5CFF", "#B08CFF")
      : G("#00A8E8", "#00C2FF"),
    im: `<span style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px">
          <i style="font-style:normal;font-size:15px;line-height:1">${s.cta.tx === "套用" ? "⚡" : "✦"}</i>
          <span style="font-size:9px;font-weight:700;opacity:.92;letter-spacing:.3px">${s.short}</span>
        </span>`,
    title: s.title,
    m1: "✦ " + A.reason(s),
    m1cls: "hint",
    m2: A.meta(s),
    btn: s.cta.tx,
    go: s.cta.go
  }));

  /* ---------- 团队最新 ---------- */
  const teamCards = A.teamVideos(3).map((v) => ({
    bg: v.bg, who: v.who.slice(-1), whoBg: v.whoBg,
    plays: A.plays(v.plays), title: v.title,
    sub: v.who + " · " + v.ago, go: v.go
  }));

  /* ---------- 平台精选 ---------- */
  const picks = D.platformPicks;

  /* ---------- 老用户 ---------- */
  if (mode === "old") {
    return `<div class="app">
      ${C.sb()}
      ${C.hrow({
        av: me.name.slice(-1),
        hi: "下午好，" + me.name,
        hs: me.city + " · " + me.teamName + " " + me.teamSize + " 人",
        unread: String(me.unread)
      })}

      <div class="body">
        ${bannerOld}

        ${C.dock({
          main: { title: "AI 剪辑发布器", sub: "选品 → 说一句口径 → 自动出片", btn: "立即开剪", go: "B1" },
          tools: [
            { ic: "✎", tx: "AI 脚本", go: "B1", bg: G("#2C5BFF", "#5B8CFF") },
            { ic: "▤", tx: "AI 素材", go: "E2", bg: G("#2C5BFF", "#00C2FF") },
            { ic: "◫", tx: "AI 封面", go: "B4", bg: G("#7C5CFF", "#B08CFF") },
            { ic: "◎", tx: "我的出镜", go: "E2.1", bg: G("#00A8E8", "#5B8CFF") }
          ]
        })}

        ${C.sec("今天必须做", tasksAll.length + " 项 · 全部 ›", "D1")}
        <div class="rule">口径：素材缺口 + 团队派发 + SOP 打卡三源合并，卡住发布的排前面，同权重看剩余时长 · 每 10 分钟刷新</div>
        ${C.tasks(taskCards)}

        ${C.sec("今天发什么", "助理推荐 · 换一批")}
        <div class="rule">口径：出单率 45% + 完播 15% + 你粉丝问题相关度 25% + 素材补拍成本 15%，同商品只推 1 条</div>
        ${sugg.map((x) => C.li(x)).join("")}

        ${C.sec("团队最新", "团队 ›", "E1")}
        <div class="rule">口径：本团队近 24 小时已发布的视频，按播放量倒序</div>
        ${C.vrail(teamCards)}

        ${C.sec("平台精选 · 运营推荐", "广场 ›", "F1")}
        <div class="rule">口径：运营专题位，按你所在人群包下发</div>
        ${C.themes(picks.map((p) => ({ img: p.img, pos: p.pos, title: p.title, sub: p.sub, go: p.go })))}

        <div class="xs" style="text-align:center;margin:16px 0 4px">数据更新于 ${D.now.slice(11, 16)} · 原型 mock，接真实接口后口径不变</div>
      </div>

      ${C.tab("A1")}
    </div>`;
  }

  /* ---------- 新用户 ---------- */
  return `<div class="app">
    ${C.sb()}
    ${C.hrow({
      av: me.name.slice(-1),
      hi: "下午好，" + me.name,
      hs: "新人第 1 天 · 已解锁流量扶持",
      unread: String(me.unread)
    })}

    <div class="body">
      ${bannerNew}

      ${C.onb({
        k: "第一步 · 从这里开始", steps: 1,
        t: "今天先把第一条视频发出去",
        d: "AI 已经写好脚本、配好画面，你只要点一下，3 分钟出片。",
        btn: "帮我发第一条", go: "B1"
      })}

      ${C.persona({
        title: "让 AI 认识你（身份 IP 人设）", note: "0/3",
        desc: "回答 3 个问题，之后每条脚本都按你的人设写，越用越像你。",
        tags: [{ tx: "我是谁" }, { tx: "卖什么" }, { tx: "给谁看" }],
        go: "G1"
      })}

      ${C.sec("新手清单", "1/4 已完成")}
      <div class="rule">口径：账号开通状态 + 人设完成度 + 首条发布 + 是否加入团队素材库</div>
      ${C.checklist([
        { tx: "注册并绑定微信", done: true },
        { tx: "设置身份 IP 人设（2 分钟）", go: "G1" },
        { tx: "发出第一条视频", go: "B1" },
        { tx: "加入团队素材库", go: "E2" }
      ])}

      ${C.sec("同行都在这么发", "更多案例 ›", "F1")}
      <div class="rule">口径：平台内容池里你这类目、同粉丝量级、近 7 天完播率最高的 3 条</div>
      ${C.vrail([
        { bg: G("#2C5BFF", "#00C2FF"), who: "玲", whoBg: "rgba(44,91,255,.92)", plays: "12.4万", title: "开箱第一句就说价格", sub: "新手最容易抄的一条", go: "F3" },
        { bg: G("#7C5CFF", "#B08CFF"), who: "强", whoBg: "rgba(124,92,255,.92)", plays: "8.6万", title: "先讲问题再讲产品", sub: "完播率最高结构", go: "F3" },
        { bg: G("#00A8E8", "#5B8CFF"), who: "雨", whoBg: "rgba(0,168,232,.92)", plays: "5.2万", title: "晒单 + 一句我的感受", sub: "不用出镜也能拍", go: "F3" }
      ])}
    </div>

    ${C.tab("A1")}
  </div>`;
};
