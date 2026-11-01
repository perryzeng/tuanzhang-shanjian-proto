window.PAGES["D1"].prd = "PRD §6.2 / §6.13 · SOP 系列（战役中心）";

/* 系列不是「一次创作」，是「一段节奏」。
   所以系列这条路的第一页不是编辑器，而是战役中心：今天该发哪一集、后面还有几集。
   顶部只回答一个问题：今天讲什么。下面是所有战役的进度，点进去看日程。 */
window.PAGES["D1"].render = function () {
  const C = window.C, D = window.DERIVE, G = window.G;
  const run = D.campaigns("running")[0];
  const rest = D.campaigns("all").filter((c) => c.id !== run.id);
  const today = D.dayPlan(run, run.day);

  const campRow = (c) => {
    const days = D.campaignDays(c);
    const doneN = days.filter((d) => d.state === "done").length;
    const stTx = c.status === "running" ? "进行中" : c.status === "soon" ? "即将开始" : "已结束";
    const stCls = c.status === "running" ? "b" : c.status === "soon" ? "o" : "line";
    return `<div class="card" style="margin-bottom:10px" data-go="D1.1?c=${c.id}" data-label="${c.name}">
      <div class="row">
        <div class="h3" style="flex:1;min-width:0">${c.name}</div>
        <span class="tag ${stCls}">${stTx}</span>
      </div>
      <div class="xs" style="margin-top:5px">${c.owner} · ${c.total} 天
        ${c.status === "soon" ? " · " + c.startAt + " 开始" : " · 已发 " + doneN + "/" + c.total}</div>
      <div class="dbar" style="margin-top:9px">
        ${days.map((d) => `<i class="${d.state === "done" ? "done" : d.state === "today" ? "now" : ""}"></i>`).join("")}
      </div>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "系列", t: "SOP 战役", act: `<span class="btn-pill line">规则</span>` })}

    <div class="body">
      <div class="card" style="background:var(--g-deep);color:#fff;box-shadow:0 12px 26px rgba(20,40,110,.24)"
           data-go="D1.2?c=${run.id}&d=${run.day}" data-label="今天这一集">
        <div class="row" style="opacity:.8">
          <span style="font-size:11.5px">今天该发 · Day ${run.day}/${run.total}</span>
          <span style="margin-left:auto;font-size:11px;background:rgba(255,255,255,.18);border-radius:999px;padding:3px 10px">${run.name}</span>
        </div>
        <div style="font-size:20px;font-weight:700;margin-top:9px;letter-spacing:-.3px">${today.topic}</div>
        <div style="font-size:11.5px;opacity:.78;line-height:1.6;margin-top:7px">
          ${today.points[0]}
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:13px">
          <span style="height:32px;padding:0 14px;border-radius:999px;background:#fff;color:var(--brand-ink);font-size:12.5px;font-weight:700;display:flex;align-items:center">去看这天的要点 ›</span>
          <span style="font-size:10.5px;opacity:.7">${run.joined} 人已参与</span>
        </div>
      </div>

      ${C.sec("我的战役", "新建", "D1.3")}
      ${campRow(run)}
      ${rest.map(campRow).join("")}

      ${C.sec("连续打卡")}
      <div class="card" style="padding:14px">
        <div class="row" style="gap:6px">
          ${[1, 2, 3, 4, 5, 6, 7].map((n) => {
            const on = n === 5, done = n < 5;
            return `<div style="flex:1;text-align:center">
              <div style="height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;
                ${done ? "background:var(--brand-weak);color:var(--brand-ink)" : on ? "background:var(--g-brand);color:#fff" : "background:#F3F5FA;color:var(--text-4)"}">D${n}</div>
            </div>`;
          }).join("")}
        </div>
        <div class="xs" style="margin-top:11px">已连续 4 天，再发 1 条就解锁「稳定输出」勋章</div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">
          系列的逻辑是<b style="color:var(--text)">一天一个主题</b>：前期铺垫、中期立信任、最后收单。
          每天的脚本结构一样，只换这一天的观点，所以拍起来越来越快。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:56px" data-go="T1" data-label="定时推送"><span style="font-size:13px">⏱</span><b>定时</b></div>
      <div class="btn" data-go="B2?kind=series&day=${run.day}" data-label="开始做今天这条">开始做今天这条 · Day ${run.day}</div>
    </div>
  </div>`;
};
