/* A8.3 小组（V21 · 四块，用 tab 而不是堆一屏）
   成员一天里在组里干四件事，四件事的形态完全不同：

   ① 公告 —— 组长说的，要一口气读完（置顶卡）
   ② 任务 —— 我要交的，要看到截止和进度（列表 + 进度条）
   ③ 动态 —— 组里刚发生什么，要能一直往下翻（时间轴）
   ④ 榜单 —— 谁跑在前面，要能横着比（排名列表）

   上一版把①②③从上到下堆在一屏，翻到第三条就忘了公告说什么；
   加上榜单会更长。四块内容形态不同，就该分开 —— 所以用 tab。

   为什么默认停在「任务」而不是第一个「公告」：
   公告一周才一条，任务天天有截止。打开小组十次有九次是来看我要交什么。
   公告不放进默认页，但 tab 上有红点，不会错过。

   榜单是唯一"横向看别人"的地方，但它只给排名和数字 ——
   想看某个人具体做了什么，点头像进 A8.3.1，而且**得他开了动态公开**。 */

window.PAGES["A8.3"].prd = "PRD V21 §4 · 小组（公告 / 任务 / 动态 / 榜单）";
window.PAGES["A8.3"].sysEntry = "底部 tab「小组」";

window.PAGES["A8.3"].render = function (ctx) {
  const C = window.C, T = window.LIB.team;
  const t = ctx.t || "task";
  const board = ctx.b || "post";

  const mine = T.tasks.filter((x) => x.me);
  const others = T.tasks.filter((x) => !x.me);
  const top = T.notices.filter((n) => n.top)[0];
  const rest = T.notices.filter((n) => !n.top);

  /* 榜单从 crew 一份数据算出来，不再另写一套数字 */
  const key = board === "lead" ? "leads" : "posts";
  const ranked = T.crew.slice().sort((a, b) => b[key] - a[key]);
  const max = Math.max(1, ranked[0][key]);

  const KIND = {
    done: { ic: "交", cls: "" }, praise: { ic: "赞", cls: "praise" },
    post: { ic: "发", cls: "" }, warn: { ic: "催", cls: "warn" },
    join: { ic: "新", cls: "" }
  };

  const totalDone = mine.reduce((a, x) => a + x.done, 0);
  const totalAll = mine.reduce((a, x) => a + x.total, 0);
  const pct = totalAll ? Math.round(totalDone / totalAll * 100) : 0;

  const TABS = [
    ["notice", "公告", rest.length ? "new" : ""],
    ["task", "任务", mine.length],
    ["feed", "动态", ""],
    ["rank", "榜单", ""]
  ];

  /* ---------- 公告 ---------- */
  const tabNotice = `${top ? `<div class="v31-nt">
      <div class="v31-nt-hd"><span>置顶</span><em>${top.from} · ${top.at}</em></div>
      <b>${top.t}</b>
      <p>${top.body}</p>
    </div>` : ""}
    ${rest.map((n) => `<div class="v31-nt2">
      <div class="v31-nt2-hd"><b>${n.t}</b><em>${n.at}</em></div>
      <p>${n.body}</p>
      <span>${n.from}</span>
    </div>`).join("")}
    <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
      公告是小组唯一的口径来源。这条不对，后面全错 —— 所以置顶那条永远排第一。
    </div>`;

  /* ---------- 任务 ---------- */
  const tabTask = `<div class="v31-sect">派给我的（${mine.length}）</div>
    ${mine.map((x) => `<div class="v16-task2 ${x.due.indexOf("今天") >= 0 ? "on" : ""}" data-go="A8" data-label="${x.t}">
      <div class="v16-task2-hd">
        <b>${x.t}</b>
        <span class="${x.due.indexOf("今天") >= 0 ? "hot" : ""}">${x.due}</span>
      </div>
      <div class="v16-task2-bar"><i style="width:${Math.round(x.done / x.total * 100)}%"></i></div>
      <div class="v16-task2-ft">
        <span>${x.done} / ${x.total} 人已交</span>
        <span class="v16-task2-go">去交 ›</span>
      </div>
    </div>`).join("")}

    ${others.length ? `<div class="v31-sect">组里还有（${others.length}）</div>
      ${others.map((x) => `<div class="v31-task" data-go="A8" data-label="${x.t}">
        <div><b>${x.t}</b><span>${x.done} / ${x.total} 人已交 · ${x.due}</span></div>
        <em>›</em>
      </div>`).join("")}` : ""}

    <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
      任务只看得见进度，看不见别人交的是什么 —— 交上来的东西只有组长能看。
    </div>`;

  /* ---------- 动态 ---------- */
  const tabFeed = `<div class="v22-fd">
      ${T.feed.map((f) => {
        const k = KIND[f.k] || KIND.post;
        return `<div class="v22-fd-i ${k.cls}">
          <i class="v22-fd-ic">${k.ic}</i>
          <div class="v22-fd-tx"><p><b>${f.who}</b> ${f.act}</p><span>${f.at}</span></div>
        </div>`;
      }).join("")}
    </div>
    <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
      动态只显示和你有关的：任务、表扬、组里的新片。不推送成员的私聊和客户。<br>
      想看某个人具体做了什么，去「榜单」点他的头像。
    </div>`;

  /* ---------- 榜单 ---------- */
  const tabRank = `<div class="v31-seg">
      <span class="${board === "post" ? "on" : ""}" data-set="A8.3.b=post">发布榜</span>
      <span class="${board === "lead" ? "on" : ""}" data-set="A8.3.b=lead">拓客榜</span>
    </div>
    <div class="v31-rk">
      ${ranked.map((m, i) => `<div class="v31-rk-i${m.me ? " me" : ""}" data-go="A8.3.1?m=${m.id}" data-label="${m.n} 的动态">
        <b class="no ${i < 3 ? "top" : ""}">${i + 1}</b>
        <i class="av" style="background:${m.bg}">${m.av}${m.open ? "" : `<span class="lock">锁</span>`}</i>
        <div class="tx">
          <b>${m.n}${m.me ? `<em>你</em>` : ""}</b>
          <span>${m.note}</span>
          <div class="bar"><i style="width:${Math.round(m[key] / max * 100)}%"></i></div>
        </div>
        <div class="v">${m[key]}<span>${board === "lead" ? "个意向" : "条片"}</span></div>
      </div>`).join("")}
    </div>
    <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
      排名和数字是组里公开的。点头像能看这个人具体做了什么 ——
      前提是他自己开了「动态公开」，关掉的只能看到名次。
    </div>`;

  const BODY = { notice: tabNotice, task: tabTask, feed: tabFeed, rank: tabRank };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">${T.name}<small>${T.members} 人 · 我是成员</small></div>
      <span class="act" data-go="E3" data-label="组信息">组信息</span>
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

      <div class="v31-tabs">
        ${TABS.map(([k, tx, badge]) => `<span class="${t === k ? "on" : ""}" data-set="A8.3.t=${k}">
          ${tx}${badge === "new" ? `<i class="dot"></i>` : (badge ? `<i class="n">${badge}</i>` : "")}
        </span>`).join("")}
      </div>

      ${BODY[t] || tabTask}
    </div>

    ${C.tab8("A8.3")}
  </div>`;
};
