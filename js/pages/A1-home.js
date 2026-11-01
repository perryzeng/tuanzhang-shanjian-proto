/* A1 首页（老用户日常版）
   数据全部来自 js/data.js + window.DERIVE，页面不写死任何数字与结论。
   业务逻辑与数据来源写在 PRD（prd/PRD-V2-页面级.md 第 4 章），UI 不重复口径。
   新用户版是独立页面 A1.1，两个版本并行存在。 */

window.PAGES["A1"].prd = "PRD §4 · 首页（老用户）";
window.PAGES["A1"].sysEntry = "注册满 7 天或已发布过视频 → 登录默认落地这一版";

window.PAGES["A1"].render = function (ctx) {
  ctx = ctx || {};
  const C = window.C, G = window.G;
  const D = window.DATA, A = window.DERIVE;
  const me = D.me;

  /* ---------- Banner：只渲染没过期的，支持带链接与纯图片两种 ---------- */
  const banner = C.banner({
    items: A.banners().map((b) => ({
      img: b.img, pos: b.pos, badge: b.badge, title: b.title,
      sub: b.sub, btn: b.btn, go: b.go, poster: b.poster
    }))
  });

  /* ---------- 今天必须做：三源合并后按权重 + 剩余时长排序 ---------- */
  const tasksAll = A.mustDo(99);
  const taskCards = A.mustDo(3).map((t) => ({
    badge: t.sys,
    cls: t.leftH <= 8 ? "hot" : (t.sysCode === "sop_checkin" ? "todo" : ""),
    time: A.leftText(t.leftH),
    title: t.title,
    meta: t.reason,
    from: "来自：" + t.owner,
    btn: t.cta.tx,
    go: t.cta.go
  }));

  /* ---------- 今天发什么：打分排序 + 同商品去重 + AI 推荐理由 ---------- */
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
    m1cls: "ai",
    m2: A.meta(s),
    btn: s.cta.tx,
    go: s.cta.go
  }));

  /* ---------- 团队最新 / 平台精选 ---------- */
  const TEAM_IMG = ["assets/gen/t-shot.jpg", "assets/gen/p-unbox.jpg", "assets/gen/p-person.jpg"];
  const teamCards = A.teamVideos(3).map((v, i) => ({
    bg: v.bg, img: TEAM_IMG[i % TEAM_IMG.length], who: v.who.slice(-1), whoBg: v.whoBg,
    plays: A.plays(v.plays), title: v.title,
    sub: v.who + " · " + v.ago, go: v.go
  }));
  const picks = D.platformPicks;

  return `<div class="app">
    ${C.sb()}
    <div class="asstrow">
      <div class="asst" data-go="A2" data-label="小剪助理">
        <span class="asst-av">剪</span>
        <div style="flex:1;min-width:0">
          <div class="asst-n">小剪助理<span class="asst-on">在线</span></div>
          <div class="asst-m">${tasksAll.length ? `今天 ${tasksAll.length} 项要做 · 先做「${tasksAll[0].title}」` : "今天没有硬任务，想发点什么？"}</div>
        </div>
        <span class="asst-go">›</span>
      </div>
      <div class="bell" data-go="E5" data-label="通知">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 2 6H4c.5-.5 2-2 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>
        <i>${me.unread}</i>
      </div>
    </div>

    <div class="body">
      ${banner}

      ${C.dock({
        main: { title: "AI 剪辑发布器", sub: "选品 → 说一句口径 → 自动出片", btn: "立即开剪", go: "B1" },
        tools: [
          { ic: "✎", tx: "AI 脚本", go: "B1", bg: G("#2C5BFF", "#5B8CFF") },
          { ic: "▤", tx: "AI 素材", go: "E2", bg: G("#2C5BFF", "#00C2FF") },
          { ic: "◫", tx: "AI 封面", go: "B4", bg: G("#7C5CFF", "#B08CFF") },
          /* 第四个位是系列：它是"节奏型"创作的唯一入口，点进去是 D1 落地页。
             我的出镜（E2.1）仍可从 E2 素材库里进，不占首页黄金位 */
          { ic: "≡", tx: "SOP<br>主题系列", label: "SOP 主题系列", go: "D1", bg: G("#7C5CFF", "#B08CFF") }
        ]
      })}

      ${C.sec("我的创作", "全部 ›", "E2?open=work&tab=latest")}
      <div class="crail">
        ${(D.creations || []).map((c) => `<div class="crc" data-go="E2?open=work&tab=latest" data-label="${c.name}">
          <div class="crim" style="background:${c.bg}">
            ${c.img ? `<img src="${c.img}" alt="">` : ""}
            ${c.kind === "draft" ? `<span class="crdraft">草稿 · 未完成</span>` : ""}
          </div>
          <div class="crs">${c.at}</div>
        </div>`).join("")}
      </div>

      ${C.sec("今天必须做", tasksAll.length + " 项 · 全部 ›", "D1")}
      ${C.tasks(taskCards)}

      ${C.sec("今天发什么", "助理推荐 · 换一批")}
      ${sugg.map((x) => C.li(x)).join("")}

      ${C.sec("团队最新", "进入团队 ›", "E3")}
      ${C.vrail(teamCards)}

      ${C.sec("平台精选 · 运营推荐", "剪同款 ›", "F1")}
      ${C.themes(picks.map((p) => ({ img: p.img, pos: p.pos, title: p.title, sub: p.sub, go: p.go })))}

      <div class="xs" style="text-align:center;margin:16px 0 4px">数据更新于 ${D.now.slice(11, 16)}</div>
    </div>

    ${ctx.pop === "1" ? "" : `<div class="nudge">
      <span class="nudge-av">剪</span>
      <div style="flex:1;min-width:0">
        <div class="nudge-t"><b>小剪</b>：要我先催一下「信任背书口播」吗？还差 6 人，18:00 截止。</div>
        <div class="nudge-a">
          <span class="nudge-y" data-go="A2?q=1" data-label="去催办">去催办</span>
          <span class="nudge-n" data-set="A1.pop=1" data-label="知道了">知道了</span>
        </div>
      </div>
      <span class="nudge-x" data-set="A1.pop=1" data-label="关闭">✕</span>
    </div>`}

    ${C.tab("A1")}
  </div>`;
};
