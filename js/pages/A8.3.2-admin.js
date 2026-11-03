/* A8.3.2 小组管理（V25 · 加考核）
   从小组页右上角「管理」进来。**只有管理员能进** ——
   组员那边这个入口压根不渲染，不是灰掉，是根本不存在。
   （一个组只有一个组长，灰色按钮反而会让人觉得"申请一下就能用"。）

   这一页只管四件事：
   ① 口径 —— 全组这周按什么说。改一次，所有人跟着变
   ② 发布 —— 公告和任务，都是"往下发"的动作
   ③ 考核 —— 谁真的把客人带来了。周/月两种口径，六个维度
   ④ 提醒 —— 不点名地指出问题，比逐个踢人有用

   V25 的考核不是"打个分排个名"。组长真正要判断的是三件事：
     他接的活做完了没有（任务完成率）
     他发出去的东西有没有人看（带来访客）
     看了的人有没有变成客人（新客 / 意向 / 成交）
   所以每人一行只给一个主数字（按你选的维度排），点开才是六个维度的全貌 ——
   一屏塞七个柱状图，谁也看不清，只会变成"数字墙"。

   数据只存原始计数（js/lib.js 的 perf），完成率、合计、组均都是现算的。
   存分数的话，口径一改，历史数据全作废。 */

window.PAGES["A8.3.2"].prd = "PRD V25 §4.2 · 小组管理（仅管理员 · 含成员考核）";
window.PAGES["A8.3.2"].sysEntry = "小组页右上角「管理」，仅管理员可见";

window.PAGES["A8.3.2"].render = function (ctx) {
  const C = window.C, L = window.LIB, T = L.team, P = L.perf || {}, PV = L.perfPrev || { w: {}, m: {} };

  /* 不是管理员就到此为止。真实产品这里应该是 403，原型里说清楚就行。 */
  if (!T.isAdmin) {
    return `<div class="app">
      ${C.sb()}
      ${C.ab({ title: "小组管理", back: "A8.3" })}
      <div class="body">
        <div class="v31-lock">
          <div class="v31-lock-ic">锁</div>
          <b>这一页只有管理员能进</b>
          <p>你要是需要改口径或发任务，找组长说一声。</p>
        </div>
      </div>
    </div>`;
  }

  const nf = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const term = ctx.term === "m" ? "m" : "w";
  const sort = ["tasks", "visits", "leads", "deals"].indexOf(ctx.sort) >= 0 ? ctx.sort : "tasks";
  const open = String(ctx.open || "");
  const termName = term === "w" ? "本周" : "本月";

  const empty = { td: 0, tt: 0, posts: 0, visits: 0, fans: 0, leads: 0, deals: 0, gmv: 0 };
  const rows = T.crew.map((m) => {
    const p = (P[m.id] && P[m.id][term]) || empty;
    const rate = p.tt ? Math.round((p.td / p.tt) * 100) : 0;
    return { m, p, rate, key: sort === "tasks" ? rate : p[sort] };
  }).sort((a, b) => b.key - a.key || b.p.deals - a.p.deals || b.p.visits - a.p.visits);

  /* 合计和组均都从这张表算，不另外写一份 —— 两处各写一份，迟早对不上 */
  const sum = rows.reduce((a, r) => {
    a.td += r.p.td; a.tt += r.p.tt; a.posts += r.p.posts; a.visits += r.p.visits;
    a.fans += r.p.fans; a.leads += r.p.leads; a.deals += r.p.deals; a.gmv += r.p.gmv;
    return a;
  }, { td: 0, tt: 0, posts: 0, visits: 0, fans: 0, leads: 0, deals: 0, gmv: 0 });
  const rate = sum.tt ? Math.round((sum.td / sum.tt) * 100) : 0;

  const avg = {
    rate: rows.reduce((a, r) => a + r.rate, 0) / rows.length,
    posts: sum.posts / rows.length, visits: sum.visits / rows.length, fans: sum.fans / rows.length,
    leads: sum.leads / rows.length, deals: sum.deals / rows.length, gmv: sum.gmv / rows.length
  };
  const mx = {
    posts: Math.max(1, ...rows.map((r) => r.p.posts)), visits: Math.max(1, ...rows.map((r) => r.p.visits)),
    fans: Math.max(1, ...rows.map((r) => r.p.fans)), leads: Math.max(1, ...rows.map((r) => r.p.leads)),
    deals: Math.max(1, ...rows.map((r) => r.p.deals)), gmv: Math.max(1, ...rows.map((r) => r.p.gmv))
  };

  const prev = PV[term] || { visits: 0, leads: 0, deals: 0 };
  const pct = (cur, was) => (was ? Math.round(((cur - was) / was) * 100) : 0);
  const dV = pct(sum.visits, prev.visits);
  const dD = sum.deals - (prev.deals || 0);
  const sign = (n) => (n > 0 ? "+" + n : String(n));

  /* 一行只给一个主数字；点开才是七个维度 */
  const MAIN = {
    tasks: [(r) => r.rate + "%", "任务完成"],
    visits: [(r) => nf(r.p.visits), "带来访客"],
    leads: [(r) => r.p.leads, "意向"],
    deals: [(r) => r.p.deals, "成交单"]
  }[sort];

  const dimsOf = (r) => [
    ["任务", r.rate, r.rate + "%", 100, avg.rate],
    ["发布", r.p.posts, r.p.posts + " 条", mx.posts, avg.posts],
    ["访客", r.p.visits, nf(r.p.visits), mx.visits, avg.visits],
    ["新客", r.p.fans, r.p.fans, mx.fans, avg.fans],
    ["意向", r.p.leads, r.p.leads, mx.leads, avg.leads],
    ["成交", r.p.deals, r.p.deals + " 单", mx.deals, avg.deals],
    ["成交额", r.p.gmv, "¥" + nf(r.p.gmv), mx.gmv, avg.gmv]
  ];

  const lag = rows.slice().sort((a, b) => a.rate - b.rate)[0];
  const lowest = rows.slice().sort((a, b) => a.p.visits - b.p.visits)[0];
  /* 第二句挑"有人看、没人买"的那个，并且刻意避开第一句那个人 ——
     否则"该提一句"里两条说的是同一个阿北，等于只说了一句。 */
  const noDeal = rows.filter((r) => r.p.deals === 0 && r.m.id !== lag.m.id)
    .sort((a, b) => b.p.visits - a.p.visits)[0] || lowest;
  const quiet = T.crew.filter((m) => m.posts <= 1);

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "小组管理", sub: "只有管理员能进", back: "A8.3", act: "保存" })}

    <div class="body">
      <div class="v32-admin">
        <b>${T.name}</b>
        <span>${T.members} 人 · 你是组长</span>
      </div>

      <!-- 目标：管理员在这儿定，首页那张深色卡就是它的正面 -->
      <div class="v32-sect">目标<em>定完，首页直接变成这一仗</em></div>
      <div class="v36-goals">
        ${(L.goals || []).map((g) => {
          const term0 = g.type === "month" ? "m" : g.type === "battle" ? "b" : "w";
          const done = T.crew.reduce((a, m) => a + (((P[m.id] || {})[term0] || empty).deals || 0), 0);
          const pc = g.t.deals ? Math.min(100, Math.round((done / g.t.deals) * 100)) : 0;
          return `<div class="v36-g" data-go="A8.3?g=${g.id}" data-label="看${g.label}目标">
            <i>${g.label}</i>
            <div class="tx">
              <b>${g.title}</b>
              <span>${done} / ${g.t.deals} 单 · 剩 ${g.left} 天</span>
              <div class="v36-b"><i style="width:${pc}%"></i></div>
            </div>
            <em>›</em>
          </div>`;
        }).join("")}
        <div class="v36-add">＋ 定一个新目标（月度 / 本周 / 单场）</div>
      </div>

      <div class="v32-sect">本周口径<em>改一次，全组跟着变</em></div>
      <div class="v32-caliber">
        <b>${T.direction.title}</b>
        <p>${T.direction.note}</p>
        <span class="v32-caliber-go">改口径 ›</span>
      </div>

      <div class="v32-sect">发布</div>
      <div class="v32-pub">
        <div class="v32-pub-i"><i>告</i><b>发一条公告</b><em>›</em></div>
        <div class="v32-pub-i"><i>任</i><b>发一个任务</b><em>›</em></div>
      </div>

      <!-- ============ 考核 ============ -->
      <div class="v32-sect">成员考核<em>${T.crew.length} 人 · 六个维度</em></div>

      <div class="v34-seg">
        <span class="${term === "w" ? "on" : ""}" data-set="A8.3.2.term=w" data-label="按周">本周</span>
        <span class="${term === "m" ? "on" : ""}" data-set="A8.3.2.term=m" data-label="按月">本月</span>
      </div>

      <div class="v34-sum">
        <div class="v34-sum-hd"><b>${rate}%</b><span>全组任务完成 ${sum.td}/${sum.tt}</span></div>
        <div class="v34-bar"><i style="width:${rate}%"></i></div>
        <div class="v34-grid">
          <div><b>${nf(sum.visits)}</b><span>带来访客</span></div>
          <div><b>${nf(sum.fans)}</b><span>新客</span></div>
          <div><b>${nf(sum.leads)}</b><span>意向</span></div>
          <div><b>${sum.deals}</b><span>成交单</span></div>
        </div>
        <div class="v34-cmp">
          比${term === "w" ? "上周" : "上月"} ·
          访客 <em class="${dV >= 0 ? "up" : "down"}">${sign(dV)}%</em> ·
          成交 <em class="${dD >= 0 ? "up" : "down"}">${sign(dD)} 单</em> ·
          成交额 ¥${nf(sum.gmv)}
        </div>
      </div>

      <div class="v34-sort">
        <em>按</em>
        ${[["tasks", "任务"], ["visits", "访客"], ["leads", "意向"], ["deals", "成交"]].map(([k, n]) =>
          `<span class="${sort === k ? "on" : ""}" data-set="A8.3.2.sort=${k}" data-label="按${n}排">${n}</span>`).join("")}
      </div>

      <div class="v34-list">
        ${rows.map((r, i) => `<div class="v34-i${open === r.m.id ? " open" : ""}">
          <div class="v34-row" data-set="A8.3.2.open=${open === r.m.id ? "" : r.m.id}" data-label="${r.m.n}的考核">
            <i class="rk">${i + 1}</i>
            <i class="av" style="background:${r.m.bg}">${r.m.av}</i>
            <div class="nm">
              <b>${r.m.n}${r.m.me ? "<em>你</em>" : ""}</b>
              <span>任务 ${r.p.td}/${r.p.tt} · ${r.p.posts} 条片${r.m.posts <= 1 ? ' · <i class="warn">安静</i>' : ""}</span>
            </div>
            <div class="v"><b>${MAIN[0](r)}</b><span>${MAIN[1]}</span></div>
          </div>

          ${open === r.m.id ? `<div class="v34-dims">
            <div class="v34-dims-hd"><b>${r.m.n} · ${termName}</b><span>│ 是他 · ─ 组均</span></div>
            ${dimsOf(r).map(([lb, val, txt, max, av]) => `<div class="v34-dm">
              <span class="lb">${lb}</span>
              <div class="v34-b"><i style="width:${Math.max(2, (val / max) * 100).toFixed(1)}%"></i><u style="left:${Math.min(98, (av / max) * 100).toFixed(1)}%"></u></div>
              <b>${txt}</b>
            </div>`).join("")}
            <div class="v34-dims-ft" data-go="A8.3.1?m=${r.m.id}" data-label="看${r.m.n}的动态">看他这${term === "w" ? "周" : "月"}做了什么 ›</div>
          </div>` : ""}
        </div>`).join("")}
      </div>

      <div class="v32-invite">＋ 邀请新成员</div>

      <div class="v32-sect">该提一句</div>
      <div class="v32-warn">
        <div><b>${lag.m.n} 任务只做到 ${lag.p.td}/${lag.p.tt}</b><span>先问一句卡在哪，别一上来就谈考核</span></div>
        <div><b>${noDeal.m.n} 带来了 ${noDeal.p.visits} 个访客，一单没成</b><span>有人看没人问，多半是结尾那句团购信息没给台阶</span></div>
        <div><b>${quiet.length} 人几乎没有动静</b><span>别在大群里点名。私聊一句比公告有用</span></div>
      </div>

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        考核只看"他给组里带来了什么"：任务、发布、访客、新客、意向、成交。<br>
        组员的客户是谁、私聊说了什么，管理员也看不到 —— 那是他们自己的生意。<br>
        全组数字是上面那张表现算的，不是另写一份。
      </div>
    </div>
  </div>`;
};
