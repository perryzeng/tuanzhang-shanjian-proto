window.PAGES["D1"].prd = "PRD §6.13 · SOP 系列落地页（二级）；首页工具位「SOP 系列」的落点";
window.PAGES["D1"].sysEntry = "首页工具位「SOP 系列」/ 创作页「系列」/ 首页「今天必须做 · 全部」";

/* 系列不是「一次创作」，是「一段节奏」。
   所以系列的落点不是编辑器，而是这一页：先回答"今天该发哪一集"，再谈怎么做。
   这一页只做三件事：
     ① 把今天这一集推到最前面（大多数人只关心这个）
     ② 让我看到手上还有几场战役、各自跑到第几天
     ③ 给我一个自己排节奏的入口

   和 B2 的分工：B2 是"一条脚本改到能发"，D2 是"这一集在整季里的位置"，
   这一页则回答"我为什么要做这一集"。 */
window.PAGES["D1"].render = function () {
  const C = window.C, D = window.DERIVE, G = window.G;
  const run = D.campaigns("running")[0];
  const soon = D.campaigns("soon");
  const past = D.campaigns("done");
  const today = D.dayPlan(run, run.day);
  const days = D.campaignDays(run);
  const doneN = days.filter((d) => d.state === "done").length;
  const st = window.DATA.seriesStats;
  const me = window.DATA.me;

  /* 一场战役 → 一张卡。状态不同，能做的事不同：
     进行中 → 看日程；即将开始 → 加入（加入即看日程）；已结束 → 复用这一轮 */
  const campCard = (c) => {
    const ds = D.campaignDays(c);
    const doneCnt = ds.filter((d) => d.state === "done").length;
    const tag = c.status === "running" ? ["进行中", "b"] : c.status === "soon" ? ["即将开始", "o"] : ["已结束", "line"];
    const action = c.status === "running" ? "看日程"
      : c.status === "soon" ? "加入" : "复用这一轮";
    const sub = c.status === "running"
      ? "已发 " + doneCnt + "/" + c.total + " 集 · 今天 Day " + c.day
      : c.status === "soon"
        ? c.startAt + " 开始 · 每天一集 · " + c.total + " 天"
        : "跑完 " + doneCnt + "/" + c.total + " 集 · " + c.startAt + " 起";
    return `<div class="card" style="margin-bottom:10px${c.status === "done" ? ";opacity:.78" : ""}" data-go="D1.1?c=${c.id}" data-label="${c.name}">
      <div class="row">
        <div class="h3" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.name}</div>
        <span class="tag ${tag[1]}">${tag[0]}</span>
      </div>
      <div class="xs" style="margin-top:5px">${c.owner} · ${c.product} · ${sub}</div>
      <div class="row" style="margin-top:9px">
        <div class="dbar" style="flex:1;margin-top:0">
          ${ds.map((d) => `<i class="${d.state === "done" ? "done" : d.state === "today" ? "now" : ""}"></i>`).join("")}
        </div>
        <span style="font-size:11px;font-weight:700;color:var(--brand);flex:0 0 auto">${action} ›</span>
      </div>
    </div>`;
  };

  const stat = (n, unit, tx) =>
    `<div style="flex:1;text-align:center">
      <div style="font-size:19px;font-weight:700;letter-spacing:-.5px;line-height:1.1">${n}<span style="font-size:10.5px;font-weight:500;color:var(--text-3);margin-left:1px">${unit}</span></div>
      <div class="xs" style="margin-top:4px">${tx}</div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "系列", t: "SOP 主题系列", act: `<span class="btn-pill line">怎么玩</span>` })}

    <div class="body">
      <div class="card" style="background:var(--g-deep);color:#fff;box-shadow:0 12px 26px rgba(20,40,110,.24)"
           data-go="D1.2?c=${run.id}&d=${run.day}" data-label="今天这一集">
        <div class="row" style="opacity:.82">
          <span style="font-size:11.5px">今天该发 · Day ${run.day}/${run.total}</span>
          <span style="margin-left:auto;font-size:10.5px;background:rgba(255,255,255,.18);border-radius:999px;padding:3px 10px">${run.name}</span>
        </div>
        <div style="font-size:21px;font-weight:700;margin-top:9px;letter-spacing:-.4px">${today.topic}</div>
        <div style="font-size:11.5px;opacity:.76;line-height:1.6;margin-top:7px">${today.brief}</div>
        <div class="dbar" style="margin-top:12px">
          ${days.map((d) => `<i style="${d.state === "done" ? "background:rgba(255,255,255,.5)" : d.state === "today" ? "background:#fff" : "background:rgba(255,255,255,.18)"}"></i>`).join("")}
        </div>
        <div class="row" style="margin-top:13px;gap:8px">
          <span style="height:32px;padding:0 14px;border-radius:999px;background:#fff;color:var(--brand-ink);font-size:12.5px;font-weight:700;display:flex;align-items:center">看这天的要点 ›</span>
          <span style="font-size:10.5px;opacity:.7">已发 ${doneN}/${run.total} 集 · ${run.joined} 人参与</span>
        </div>
      </div>

      <div class="card" style="margin-top:11px;padding:14px 8px">
        <div class="row" style="gap:0">
          ${stat(st.published, "集", "本月已发")}
          <div style="width:1px;height:26px;background:var(--line-2)"></div>
          ${stat(st.avgCompletion, "%", "平均完播")}
          <div style="width:1px;height:26px;background:var(--line-2)"></div>
          ${stat(me.streakDays, "天", "连续发布")}
        </div>
        <div class="xs" style="margin-top:11px;text-align:center">再发 1 条就解锁「稳定输出」勋章 · 本月目标 ${st.monthTarget} 集</div>
      </div>

      ${C.sec("进行中", "共 " + D.campaigns("running").length + " 个")}
      ${D.campaigns("running").map(campCard).join("")}

      ${soon.length ? C.sec("即将开始", soon.length + " 个") + soon.map(campCard).join("") : ""}

      ${past.length ? C.sec("已结束", past.length + " 个 · 可复用") + past.map(campCard).join("") : ""}

      <div class="card plain" style="margin-top:2px">
        <div class="xs" style="line-height:1.75">
          <b style="color:var(--text)">系列是什么：</b>总部（或你自己）定一个一周到两周的节奏，
          一天一个主题，每天一集。开头立信任、结尾 CTA 每天固定，只有中间两三段按当天主题换——
          所以越往后拍越快，观众也记得住你。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 118px" data-go="D1.3" data-label="新建主题">＋ 新建</div>
      <div class="btn" data-go="D2?c=${run.id}&d=${run.day}" data-label="开始做今天这条">开始做今天这条 · Day ${run.day}</div>
    </div>
  </div>`;
};
