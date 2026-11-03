/* A8.3 小组（V26 · 作战阵地）
   定位改了：这不是"团队朋友圈"，是**小组这一仗的指挥部**。

   管理员在这里下发：一个目标（月度 / 本周 / 单场战役）、一个任务、一条公告；
   组员在这里看到两件事：**这仗打到哪了**、**我这一份还差多少**。
   排名是第三件事 —— 它能制造紧迫感，但不该是首页的主角。

   所以版面按"从集体到我、从目标到流水"排，不按功能模块排：

     ① 目标卡    这周在打什么、还差多少、每天要几单（紧迫感从这儿来）
     ② 目标切换  本周 / 本月 / 单场，同一套模板，换的只是口径
     ③ 我这一份  我的成交、我离人均差几单、我手上还没交的活
     ④ 全组战报  谁达标谁没达标，四条数按住一个字排
     ⑤ 公告      折成一条，要看才展开（广播不该压住目标）
     ⑥ 动态      最近三条，弱化在最下面

   为什么"我这一份"排在"全组战报"前面：
   组员真正会焦虑的是"我还差 2 单"，不是"小敏比我多 3 单"。
   把排名放前面，只会让尾部的人关掉这个页面。

   管理员多一个「＋ 发起」：同一页里既能看，也能下命令。 */

window.PAGES["A8.3"].prd = "PRD V26 §4 · 小组（目标 → 我这一份 → 战报 → 公告 → 动态）";
window.PAGES["A8.3"].sysEntry = "底部 tab「小组」";

window.PAGES["A8.3"].render = function (ctx) {
  const C = window.C, L = window.LIB, T = L.team, P = L.perf || {};
  const isAdmin = !!T.isAdmin;
  const G = L.goals || [];
  const nf = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const gid = G.some((x) => x.id === ctx.g) ? ctx.g : "g_week";
  const g = G.filter((x) => x.id === gid)[0] || G[0];
  const term = g.type === "month" ? "m" : g.type === "battle" ? "b" : "w";
  const sort = ["deals", "visits", "leads"].indexOf(ctx.sort) >= 0 ? ctx.sort : g.key;
  const SORT_N = { deals: "成交", visits: "访客", leads: "意向" };
  const UNIT = { deals: "单", visits: "人", leads: "个" };

  const zero = { td: 0, tt: 0, posts: 0, visits: 0, fans: 0, leads: 0, deals: 0, gmv: 0 };
  const of = (m) => (P[m.id] && P[m.id][term]) || zero;

  /* 全组已完成 = 名册求和。不另存一份，跟考核页同源 */
  const now = T.crew.reduce((a, m) => {
    const p = of(m);
    a.visits += p.visits; a.leads += p.leads; a.deals += p.deals;
    return a;
  }, { visits: 0, leads: 0, deals: 0 });

  const cur = now[g.key], tgt = g.t[g.key];
  const pct = tgt ? Math.round((cur / tgt) * 100) : 0;
  const barPct = Math.min(100, pct);
  const leftN = Math.max(0, tgt - cur);
  const perDay = g.left > 0 ? leftN / g.left : leftN;

  /* 达标线跟着排序走：按访客排，人均就是"访客 ÷ 人数"。
     不跟着走的话，右边写着 980 人、旁边却标"-2"，两个数不同单位，一定读错。 */
  const need = g.t[sort] / T.crew.length;
  const fNeed = sort === "deals" ? need.toFixed(1) : String(Math.round(need));
  const gapTxt = (gap) => "差 " + (sort === "deals" && gap < 3 ? gap.toFixed(1) : Math.round(gap));

  const rows = T.crew.map((m) => {
    const p = of(m);
    return { m, p, v: p[sort], pass: p[sort] >= need, gap: need - p[sort] };
  }).sort((a, b) => b.v - a.v || b.p.deals - a.p.deals);
  const max = Math.max(1, rows[0].v);
  const passed = rows.filter((r) => r.pass).length;

  const me = rows.filter((r) => r.m.me)[0] || rows[0];
  const myIdx = rows.indexOf(me);
  const myGap = need - me.p[sort];

  const mine = T.tasks.filter((x) => x.me);
  const nextTask = mine.filter((x) => x.done < x.total)[0] || mine[0];

  const top = T.notices.filter((n) => n.top)[0];
  const restN = T.notices.filter((n) => !n.top).length;
  const nt = ctx.nt === "1";

  const KIND = {
    done: { ic: "交", cls: "" }, praise: { ic: "赞", cls: "praise" },
    post: { ic: "发", cls: "" }, warn: { ic: "催", cls: "warn" },
    join: { ic: "新", cls: "" }
  };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">${T.name}<small>${T.crew.length} 人在打 · 还剩 ${g.left} 天</small></div>
      ${isAdmin ? `<span class="act" data-go="A8.3.2" data-label="小组管理">管理</span>` : ""}
    </div>

    <div class="body">
      <!-- ① 这一仗 -->
      <div class="v35-goals">
        ${G.map((x) => `<span class="${x.id === g.id ? "on" : ""}" data-set="A8.3.g=${x.id}"
          data-label="${x.label}目标">${x.label}<i>${x.left}天</i></span>`).join("")}
      </div>

      <div class="v35-goal">
        <div class="v35-goal-tag">${g.label}目标 · 还剩 ${g.left} 天</div>
        <h3>${g.title}</h3>
        <div class="v35-goal-num">
          <b>${cur}</b><span>/ ${tgt} 单</span>
          <em>${pct}%</em>
        </div>
        <div class="v35-goal-bar"><i style="width:${barPct}%"></i></div>
        <div class="v35-goal-ms">
          <div><b>${nf(now.visits)}<i> / ${nf(g.t.visits)}</i></b><span>带来访客</span></div>
          <div><b>${now.leads}<i> / ${g.t.leads}</i></b><span>意向</span></div>
        </div>
        <div class="v35-goal-urg">
          <i class="dot"></i>${leftN > 0
            ? `还差 ${leftN} 单 · 剩 ${g.left} 天，每天要 ${perDay.toFixed(1)} 单才够`
            : `已达成，超了 ${cur - tgt} 单 —— 往月度目标上叠`}
        </div>
      </div>

      <!-- ② 我这一份：组员最关心的是"我还差多少"，不是"谁第一" -->
      <div class="v35-me">
        <div class="v35-me-hd">
          <b>我这一份</b>
          <em class="${myGap > 0 ? "gap" : "ok"}">${myGap > 0
            ? `${gapTxt(myGap)}${UNIT[sort]}到人均`
            : (Math.abs(myGap) >= 1 ? `已超人均 ${Math.round(Math.abs(myGap))}${UNIT[sort]}` : "已过人均线")}</em>
        </div>
        <div class="v35-me-num">
          <div><b>${me.p[sort]}</b><span>我的${SORT_N[sort]} / 人均 ${fNeed}</span></div>
          <div><b>第 ${myIdx + 1}</b><span>组里 ${rows.length} 人</span></div>
        </div>
        <div class="v35-me-bar"><i style="width:${Math.min(100, (me.p[sort] / need) * 100).toFixed(1)}%"></i></div>
        ${nextTask ? `<div class="v35-task" data-go="A8" data-label="去交任务">
          <i>任</i>
          <div class="tx"><b>${nextTask.t}</b><span>${nextTask.due} 截止 · ${nextTask.done}/${nextTask.total} 人已交</span></div>
          <em>去交 ›</em>
        </div>` : ""}
      </div>

      <!-- ③ 全组战报 -->
      <div class="v35-sec">
        <span>全组战报</span>
        <em>${passed}/${rows.length} 人达标</em>
        <div class="v32-seg">
          ${["deals", "visits", "leads"].map((k) =>
            `<i class="${sort === k ? "on" : ""}" data-set="A8.3.sort=${k}" data-label="按${SORT_N[k]}排">${SORT_N[k]}</i>`).join("")}
        </div>
      </div>
      <div class="v35-rk">
        ${rows.map((r, i) => `<div class="v35-rk-i${r.m.me ? " me" : ""}" data-go="A8.3.1?m=${r.m.id}"
          data-label="${r.m.n} 的动态">
          <b class="no">${i + 1}</b>
          <i class="av" style="background:${r.m.bg}">${r.m.av}${r.m.open ? "" : `<span class="lock">锁</span>`}</i>
          <b class="nm">${r.m.n}${r.m.me ? "<em>你</em>" : ""}</b>
          <div class="bar"><i style="width:${Math.max(3, Math.round((r.v / max) * 100))}%"></i></div>
          <span class="v">${r.v}<i>${UNIT[sort]}</i></span>
          <em class="st${r.pass ? " ok" : ""}">${r.pass ? "达标" : gapTxt(r.gap)}</em>
        </div>`).join("")}
      </div>
      <div class="xs" style="margin:7px 2px 0;line-height:1.6">
        达标线 = 目标${SORT_N[sort]} ÷ 组内人数（${fNeed} ${UNIT[sort]}/人）。点头像看他这${g.type === "month" ? "月" : "周"}做了什么。
      </div>

      <!-- ④ 公告：折成一条，别压住目标 -->
      ${top ? `<div class="v35-nt${nt ? " open" : ""}" data-set="A8.3.nt=${nt ? 0 : 1}" data-label="看公告">
        <i class="ic">告</i>
        <div class="tx">
          <b>${top.t}</b>
          ${nt ? `<p>${top.body}</p>` : ""}
          <span>${top.from} · ${top.at}${restN ? ` · 还有 ${restN} 条` : ""}</span>
        </div>
        <em>${nt ? "收起" : "看"}</em>
      </div>` : ""}

      <!-- ⑤ 动态 -->
      <div class="v35-sec"><span>组里动态</span><em>最近 ${Math.min(3, T.feed.length)} 条</em></div>
      <div class="v22-fd">
        ${T.feed.slice(0, 3).map((f) => {
          const k = KIND[f.k] || KIND.post;
          return `<div class="v22-fd-i ${k.cls}">
            <i class="v22-fd-ic">${k.ic}</i>
            <div class="v22-fd-tx"><p><b>${f.who}</b> ${f.act}</p><span>${f.at}</span></div>
          </div>`;
        }).join("")}
      </div>

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        动态只显示任务、表扬和新片。组员的客户和私聊，组长也看不到。
      </div>
      ${isAdmin ? `<div class="v35-cta" data-go="A8.3.2" data-label="发起目标 / 任务 / 公告">
        <b>＋ 发起</b><span>定一个目标 · 发一个任务 · 发一条公告</span>
      </div>` : ""}
    </div>

    ${C.tab8("A8.3")}
  </div>`;
};
