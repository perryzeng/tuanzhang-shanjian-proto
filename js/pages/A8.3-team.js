/* A8.3 小组（V22 · 一页看完，不分 tab）
   四块还是那四块：公告 / 任务 / 榜单 / 动态。
   但不再切成 tab —— 成员打开小组，想要的是"一眼扫完全组在发生什么"，
   切 tab 等于逼他点四次才知道组里有没有事。

   所以做法反过来：**每块只放"最少但够判断"的量**，从上一路排下来。
   - 公告只留置顶那条，正文两行截断
   - 任务只放我名下的
   - 榜单只放前 5，我不在前 5 就补我那一行
   - 动态只放最近 4 条
   一屏半能看完，比四个 tab 各翻一次快。

   右上角「管理」只有管理员看得到 —— 组员那边不是灰色不可点，是压根不出现。 */

window.PAGES["A8.3"].prd = "PRD V22 §4 · 小组（一页：公告 / 任务 / 榜单 / 动态）";
window.PAGES["A8.3"].sysEntry = "底部 tab「小组」";

window.PAGES["A8.3"].render = function (ctx) {
  const C = window.C, T = window.LIB.team;
  const board = ctx.b || "post";
  const isAdmin = !!T.isAdmin;

  const mine = T.tasks.filter((x) => x.me);
  const top = T.notices.filter((n) => n.top)[0];
  const restN = T.notices.filter((n) => !n.top).length;

  const key = board === "lead" ? "leads" : "posts";
  const ranked = T.crew.slice().sort((a, b) => b[key] - a[key]);
  const max = Math.max(1, ranked[0][key]);
  const meRow = ranked.filter((m) => m.me)[0];
  const myIdx = ranked.indexOf(meRow);
  const showTop = ranked.slice(0, 5);
  const needMe = myIdx >= 5;

  const KIND = {
    done: { ic: "交", cls: "" }, praise: { ic: "赞", cls: "praise" },
    post: { ic: "发", cls: "" }, warn: { ic: "催", cls: "warn" },
    join: { ic: "新", cls: "" }
  };

  const totalDone = mine.reduce((a, x) => a + x.done, 0);
  const totalAll = mine.reduce((a, x) => a + x.total, 0);
  const pct = totalAll ? Math.round(totalDone / totalAll * 100) : 0;

  const rankRow = (m, i) => `<div class="v32-rk-i${m.me ? " me" : ""}" data-go="A8.3.1?m=${m.id}" data-label="${m.n} 的动态">
    <b class="no${i < 3 ? " top" : ""}">${i + 1}</b>
    <i class="av" style="background:${m.bg}">${m.av}${m.open ? "" : `<span class="lock">锁</span>`}</i>
    <b class="nm">${m.n}${m.me ? `<em>你</em>` : ""}</b>
    <div class="bar"><i style="width:${Math.round(m[key] / max * 100)}%"></i></div>
    <span class="v">${m[key]}<i>${board === "lead" ? "个" : "条"}</i></span>
  </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">${T.name}<small>${T.members} 人 · 我是成员</small></div>
      ${isAdmin ? `<span class="act" data-go="A8.3.2" data-label="小组管理">管理</span>` : ""}
    </div>

    <div class="body">
      <div class="v31-hero">
        <div class="v31-hero-hd">
          <b>组里 ${mine.length} 个任务在跑</b>
          <em>${totalDone}<i>/${totalAll}</i></em>
        </div>
        <div class="v31-hero-bar"><i style="width:${pct}%"></i></div>
        <div class="v31-hero-ft">
          <span>进度按人次算</span>
          <span>我 ${T.me.done}/${T.me.total} · 组里第 ${T.me.rank}</span>
        </div>
      </div>

      <div class="v32-sect">公告${restN ? `<em>还有 ${restN} 条 ›</em>` : ""}</div>
      ${top ? `<div class="v31-nt v32-nt">
        <div class="v31-nt-hd"><span>置顶</span><em>${top.from} · ${top.at}</em></div>
        <b>${top.t}</b>
        <p>${top.body}</p>
      </div>` : ""}

      <div class="v32-sect">派给我的活<em>${mine.length} 条</em></div>
      ${mine.map((x) => `<div class="v32-task${x.due.indexOf("今天") >= 0 ? " hot" : ""}" data-go="A8" data-label="${x.t}">
        <div class="tx">
          <b>${x.t}</b>
          <span>${x.done} / ${x.total} 人已交</span>
        </div>
        <div class="rt">
          <em>${x.due}</em>
          <span class="go">去交 ›</span>
        </div>
      </div>`).join("")}

      <div class="v32-sect wide">
        <span>榜单</span>
        <div class="v32-seg">
          <i class="${board === "post" ? "on" : ""}" data-set="A8.3.b=post">发布</i>
          <i class="${board === "lead" ? "on" : ""}" data-set="A8.3.b=lead">拓客</i>
        </div>
      </div>
      <div class="v32-rk">
        ${showTop.map(rankRow).join("")}
        ${needMe ? `<div class="v32-rk-more">⋯</div>${rankRow(meRow, myIdx)}` : ""}
      </div>
      <div class="xs" style="margin:7px 2px 0;line-height:1.6">
        点头像看这个人这周做了什么。排名是公开的，具体轨迹要他自己开。
      </div>

      <div class="v32-sect">组里动态<em>最近 ${Math.min(4, T.feed.length)} 条</em></div>
      <div class="v22-fd">
        ${T.feed.slice(0, 4).map((f) => {
          const k = KIND[f.k] || KIND.post;
          return `<div class="v22-fd-i ${k.cls}">
            <i class="v22-fd-ic">${k.ic}</i>
            <div class="v22-fd-tx"><p><b>${f.who}</b> ${f.act}</p><span>${f.at}</span></div>
          </div>`;
        }).join("")}
      </div>

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        动态只显示和你有关的：任务、表扬、组里的新片。不推送成员的私聊和客户。
      </div>
    </div>

    ${C.tab8("A8.3")}
  </div>`;
};
