window.PAGES["E4"].prd = "PRD §6.11 · 发布任务（剪视频：主题/脚本/剪同款；系列主题）";

/* 发布任务：只做两类——
   ① 剪视频：给主题（自己写）/ 给脚本（选已生成脚本）/ 剪同款（选一条作品）；
   ② 系列主题：选一个系列（脚本或视频都已批量生成），成员照着逐条剪。
   默认全员、每人 1 条；只设截止时间。已发布任务不放在这里，去「任务列表」。 */
window.PAGES["E4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const TYPE = ctx.type === "series" ? "series" : "cut";
  const SRC = ["theme", "script", "work"].indexOf(ctx.src) >= 0 ? ctx.src : "theme";

  const scripts = D.lib("team", "script").items;
  const works = D.lib("team", "work").items;
  const SERIES = [
    { id: "sr1", name: "21 天滋补打卡", kind: "脚本", items: 21 },
    { id: "sr2", name: "开团周 · 7 天连剪", kind: "视频", items: 7 },
    { id: "sr3", name: "素颜出镜 30 天", kind: "视频", items: 30 }
  ];

  const themeText = (ctx.theme || "").replace(/"/g, "&quot;");
  const target = scripts.some((s) => s.id === ctx.target) ? ctx.target : (scripts[0] || {}).id;
  const wt = works.some((w) => w.id === ctx.wt) ? ctx.wt : (works[0] || {}).id;
  const series = SERIES.filter((s) => s.id === ctx.series)[0] || SERIES[0];
  const deadline = ctx.deadline || "今天 22:00";
  const done = ctx.done === "1";

  const tshift = scripts.filter((s) => s.id === target)[0] || {};
  const wshift = works.filter((w) => w.id === wt)[0] || {};

  const pickRow = (id, name, sub, key, cur) => `<div class="prow" data-set="E4.${key}=${id}&E4.done=" data-label="${name}">
      <span class="prd${cur === id ? " on" : ""}"></span>
      <div class="tx"><b>${name}</b><span>${sub}</span></div>
    </div>`;

  const tgrp = `<div class="tgrp">
      <div class="topt${TYPE === "cut" ? " on" : ""}" data-set="E4.type=cut&E4.done=" data-label="剪视频任务">
        <b>剪视频</b><span>给主题 / 脚本 / 剪同款</span></div>
      <div class="topt${TYPE === "series" ? " on" : ""}" data-set="E4.type=series&E4.done=" data-label="系列主题任务">
        <b>系列主题</b><span>系列脚本 / 视频已生成</span></div>
    </div>`;

  const cutBody = `
    <div class="feedhd" style="margin-top:14px">任务来源<span>选一种</span></div>
    <div class="card" style="padding:12px 14px"><div style="display:flex;gap:8px">
      ${[["theme", "给主题"], ["script", "给脚本"], ["work", "剪同款"]].map(([k, tx]) =>
        `<span class="chip${SRC === k ? " on" : ""}" data-set="E4.src=${k}&E4.done=" style="flex:1;text-align:center;justify-content:center">${tx}</span>`).join("")}
    </div></div>

    ${SRC === "theme" ? `<div class="card" style="padding:14px;margin-top:12px">
      <div class="s" style="margin-bottom:7px">写主题</div>
      <input data-bind="E4.theme" data-live value="${themeText}" placeholder="例如：磷虾油开团周 / 秋季滋补"
        style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
      <div class="xs" style="margin-top:8px">成员按这个主题自己找角度剪，不限定脚本。</div>
    </div>` : ""}

    ${SRC === "script" ? `<div class="feedhd" style="margin-top:12px">选脚本<span>已生成好的</span></div>
      <div class="card" style="padding:2px 14px">
        ${scripts.map((s) => pickRow(s.id, s.name, `${s.sub} · ${s.by || "—"}`, "target", target)).join("") || `<div class="frempty">团队还没有脚本</div>`}
      </div>` : ""}

    ${SRC === "work" ? `<div class="feedhd" style="margin-top:12px">选一条作品<span>让成员剪同款</span></div>
      <div class="card" style="padding:2px 14px">
        ${works.map((w) => pickRow(w.id, w.name, `${w.sub} · ${w.by || "—"}`, "wt", wt)).join("") || `<div class="frempty">团队还没有作品</div>`}
      </div>` : ""}
  `;

  const seriesBody = `
    <div class="feedhd" style="margin-top:14px">选系列<span>脚本 / 视频已批量生成</span></div>
    <div class="card" style="padding:2px 14px">
      ${SERIES.map((s) => `<div class="prow" data-set="E4.series=${s.id}&E4.done=" data-label="${s.name}">
        <span class="prd${series.id === s.id ? " on" : ""}"></span>
        <div class="tx"><b>${s.name}</b><span>${s.items} 条${s.kind}已生成 · 成员照着逐条剪</span></div>
        <span class="tag">${s.kind}</span>
      </div>`).join("")}
    </div>
    <div class="note" style="margin:10px 2px 0;line-height:1.7">系列会按天推到全员的任务里，每天一条，成员不必自己找素材。</div>
  `;

  const srcLabel = SRC === "theme"
    ? `主题 · ${ctx.theme || "（未填主题）"}`
    : SRC === "script" ? `脚本 · ${tshift.name || "—"}` : `剪同款 · ${wshift.name || "—"}`;
  const summary = TYPE === "cut"
    ? `将派发：全员照「${srcLabel}」剪，每人 1 条，截止 ${deadline}。`
    : `将派发系列：全员「${series.name}」（${series.items} 条${series.kind}），每人每天 1 条，截止 ${deadline}。`;

  const deadlineChips = ["今天 18:00", "今天 22:00", "明天 12:00"].map((v) =>
    `<span class="chip${deadline === v ? " on" : ""}" data-set="E4.deadline=${v}&E4.done=">${v}</span>`).join("");

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "发布任务", sub: "发给全员 · 每人 1 条", back: "E3.4" })}

    <div class="body">
      ${done ? `<div class="okbar">任务已发布给全员，每人 1 条；成员会在任务列表里看到（演示）</div>` : ""}

      ${tgrp}
      ${TYPE === "cut" ? cutBody : seriesBody}

      <div class="feedhd" style="margin-top:14px">截止时间</div>
      <div class="card" style="padding:12px 14px"><div style="display:flex;gap:8px;flex-wrap:wrap">${deadlineChips}</div></div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">${summary}</div>
      </div>

      <div class="note" style="margin:12px 2px 0;line-height:1.7">已发布的任务不在发布器里查看，去「团队管理 → 任务列表」看每条任务的完成情况。</div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-set="E4.done=1" data-label="发布任务">发布任务</div>
    </div>
  </div>`;
};

/* 任务列表：已发布任务在外面单独看，点进去看每个任务的完成情况 */
window.PAGES["E4.2"].prd = "PRD §6.11.2 · 任务列表（已发布任务 + 完成率）";
window.PAGES["E4.2"].render = function (ctx) {
  const C = window.C, LIB = window.DATA.library;
  const tasks = LIB.teamTasks || [];
  const f = ctx.f === "doing" || ctx.f === "done" ? ctx.f : "all";
  const list = f === "all" ? tasks : tasks.filter((t) => (f === "done" ? t.state === "done" : t.state !== "done"));

  const chips = [["all", "全部"], ["doing", "进行中"], ["done", "已完成"]].map(([k, tx]) =>
    `<span class="chip${f === k ? " on" : ""}" data-set="E4.2.f=${k}">${tx}</span>`).join("");

  const row = (t) => `<div class="li" style="box-shadow:none;margin:0;border-radius:0;padding:13px 0" data-go="${t.go}" data-label="${t.t}">
      <div style="width:36px;height:36px;border-radius:11px;background:${t.kind === "series" ? "linear-gradient(150deg,#FF8FB1,#FF5C8A)" : "linear-gradient(150deg,#7C6CFF,#A78BFA)"};
        color:#fff;display:flex;align-items:center;justify-content:center;font-size:13px;flex:0 0 36px">${t.kind === "series" ? "系" : "剪"}</div>
      <div class="tx"><b style="margin-bottom:2px">${t.t}</b><span>${t.src || ""} · 截止 ${t.due}</span></div>
      <div style="text-align:right;flex:0 0 auto">
        <div style="font-size:12px;font-weight:700;color:${t.done >= t.total ? "#12B886" : "var(--brand)"}">${t.done}/${t.total}</div>
        <div class="xs" style="margin-top:2px">${Math.round(t.done / t.total * 100)}%</div>
      </div>
      <span style="color:var(--text-4);font-size:16px">›</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "任务列表", sub: `${tasks.length} 个已发布任务`, back: "E3.4", act: "发布" })}

    <div class="body">
      <div style="display:flex;gap:8px;margin-top:4px">${chips}</div>
      <div class="card" style="padding:0 16px;margin-top:12px">${list.map(row).join("") || `<div class="frempty">这个筛选下没有任务</div>`}</div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-go="E4" data-label="发布新任务">＋ 发布新任务</div>
    </div>
  </div>`;
};

/* 任务详情：某个任务的全员完成情况 */
window.PAGES["E4.1"].prd = "PRD §6.11.1 · 任务详情（每个成员的完成情况）";
window.PAGES["E4.1"].render = function (ctx) {
  const C = window.C, LIB = window.DATA.library;
  const tasks = LIB.teamTasks || [];
  const t = tasks.filter((x) => x.id === ctx.id)[0] || tasks[0] || {};
  const members = LIB.teamMembers || [];
  const pct = Math.round((t.done || 0) / (t.total || 1) * 100);
  const doneN = Math.min(t.done || 0, members.length);
  const leftN = Math.max(0, (t.total || 0) - (t.done || 0));
  const outsideN = Math.max(0, (t.total || 0) - members.length);
  const outsideDone = Math.max(0, (t.done || 0) - members.length);

  const row = (m, i) => {
    const ok = i < doneN;
    return `<div class="tmr">
      <span class="tav" style="background:${m.bg}">${m.av}</span>
      <div class="tmt"><b>${m.name}</b><span>${m.joined}加入 · 本月 ${m.posts} 条</span></div>
      ${ok ? `<span class="tag g">已完成</span>` : `<span class="mact" data-label="催办 ${m.name}">催办</span>`}
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: t.t, sub: `${t.kind === "series" ? "系列主题" : "剪视频"} · 截止 ${t.due}`, back: "E4.2" })}

    <div class="body">
      <div class="card" style="margin-top:12px">
        <div class="row"><span class="tag b">${t.kind === "series" ? "系列主题" : "剪视频"}</span>
          <span class="xs" style="margin-left:auto">${t.to || "全员"}</span></div>
        <div class="bar" style="margin:12px 0 8px"><i style="width:${pct}%;background:var(--g-brand)"></i></div>
        <div class="row"><span class="xs">${t.done}/${t.total} 人完成</span><span class="xs" style="margin-left:auto">${pct}%</span></div>
      </div>

      <div class="note" style="margin:12px 2px 0;line-height:1.7">${t.src || ""} · 派发人 ${t.by || "—"} · 截止 ${t.due}。</div>

      <div class="feedhd">成员完成情况<span>${members.length}</span></div>
      <div class="card" style="padding:2px 14px;border-radius:16px">${members.map(row).join("")}
        ${outsideN ? `<div class="tmr"><span class="tav" style="background:var(--bg-2);color:var(--text-3)">+${outsideN}</span>
          <div class="tmt"><b>还有 ${outsideN} 位成员</b><span>${outsideDone}/${outsideN} 已完成</span></div>
          ${outsideDone >= outsideN ? `<span class="tag g">全部完成</span>` : `<span class="mact" data-label="催办">催办</span>`}</div>` : ""}
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="E5" data-label="通知中心"><span style="font-size:13px">◔</span><b>通知</b></div>
      <div class="btn ai" data-label="一键催办">一键催办 ${leftN} 人</div>
    </div>
  </div>`;
};
