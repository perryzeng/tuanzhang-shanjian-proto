window.PAGES["D1.1"].prd = "PRD §6.13 · 战役日程（一天一个主题）";

/* 日程页回答「这 10 天到底讲什么」。
   每一格就是一天的选题，状态只有三档：已发 / 今天 / 还没到。
   点任意一天进单日详情——未来的天也能点，让人提前准备，但不能装作已经发过。 */
window.PAGES["D1.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const base = D.campaign(ctx.c);
  /* 从「新建主题系列」带过来的条数：日程要跟着用户选的那个数走，
     否则选 14 条进来还是 10 天，等于刚才那个选择没生效。
     条数变了，名字里的"10 天"和"今天第几天"也得跟着挪。 */
  const nd = +(ctx.days || 0) || base.total;
  const c = nd === base.total ? base : {
    ...base,
    total: nd,
    day: Math.min(base.day, nd),
    name: base.name.replace(/\d+\s*天/, nd + " 天"),
    topics: D.planTopics(base.product, nd)
  };
  const days = D.campaignDays(c);
  const doneN = days.filter((d) => d.state === "done").length;
  const cur = days.filter((d) => d.state === "today")[0] || days[0];

  const cell = (d, i) => {
    const tx = d.state === "done" ? "已发" : d.state === "today" ? "今天" : "未到";
    const cls = d.state === "done" ? "g" : d.state === "today" ? "b" : "line";
    return `<div class="dcell ${d.state}" data-go="D1.2?c=${c.id}&d=${d.n}" data-label="Day ${d.n} ${d.topic}">
      <div class="dn">${d.state === "done" ? "✓" : d.n}</div>
      <div class="ml">
        <b>${d.topic}</b>
        <span>Day ${d.n} / ${c.total}${d.state === "done" ? " · 已发布" : d.state === "today" ? " · 今天该发" : " · 还没到"}</span>
      </div>
      <span class="tag ${cls}">${tx}</span>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    ${C.ab({
      title: c.name,
      sub: c.owner + " · " + c.total + " 天一个循环",
      back: "D1",
      act: "改主题"
    })}

    <div class="body">
      <div class="card">
        <div class="row">
          <div style="flex:1">
            <div class="xs">进度</div>
            <div style="font-size:22px;font-weight:700;letter-spacing:-.5px;margin-top:3px">${doneN}<span style="font-size:13px;color:var(--text-3);font-weight:500"> / ${c.total} 天</span></div>
          </div>
          <div style="text-align:right">
            <div class="xs">今天</div>
            <div class="h3" style="margin-top:4px">Day ${c.day}</div>
          </div>
        </div>
        <div class="dbar" style="margin-top:11px">
          ${days.map((d) => `<i class="${d.state === "done" ? "done" : d.state === "today" ? "now" : ""}"></i>`).join("")}
        </div>
        <div class="xs" style="margin-top:9px">${c.status === "soon"
          ? c.startAt + " 开始，现在可以把选题先过一遍"
          : c.status === "done" ? "这一轮已经跑完，可以复用到下一轮" : "每天一集，脚本结构不变，只换观点"}</div>
      </div>

      ${C.sec("每天讲什么", days.length + " 天")}
      ${days.map(cell).join("")}

      <div class="card plain" style="margin-top:6px">
        <div class="xs" style="line-height:1.7">
          为什么按天排：观众要的是「这个人一直在讲同一件事」，不是一条爆款。
          连续 5 天出现，第 6 天开始有人主动问在哪买。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:56px" data-go="T1" data-label="定时推送"><span style="font-size:13px">⏱</span><b>定时</b></div>
      <div class="btn" data-go="D1.2?c=${c.id}&d=${cur.n}" data-label="看今天这集">${c.status === "soon" ? "先看 Day 1 怎么准备" : "看今天这集 · " + cur.topic}</div>
    </div>
  </div>`;
};
