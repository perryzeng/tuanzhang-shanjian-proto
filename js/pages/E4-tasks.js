window.PAGES["E4"].prd = "PRD §6.11 · 发布任务（剪视频 / 系列主题）+ 已发布任务列表";

/* 发布任务：只做两类——
   ① 剪视频：给主题 / 形式 / 脚本 / 剪同款作品，让成员照着剪；
   ② 系列主题：一个连续主题（21 天打卡这类），每人每天一条。
   默认发给全员，不做指派；设截止时间；下面列已发布任务，点进去看每个任务的完成情况。 */
window.PAGES["E4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE, LIB = window.DATA.library;
  const TYPE = ctx.type === "series" ? "series" : "cut";
  const SRC = ["theme", "form", "script", "work"].indexOf(ctx.src) >= 0 ? ctx.src : "theme";

  const THEMES = ["磷虾油开团周", "秋季滋补专题", "复购冲刺周"];
  const FORMS = ["口播讲解", "开箱实拍", "对比测评"];
  const SERIES = ["21 天滋补打卡", "开团周 · 7 天连剪", "素颜出镜 30 天"];
  const scripts = D.lib("team", "script").items;
  const works = D.lib("team", "work").items;

  const theme = THEMES.indexOf(ctx.theme) >= 0 ? ctx.theme : THEMES[0];
  const form = FORMS.indexOf(ctx.form) >= 0 ? ctx.form : FORMS[0];
  const series = SERIES.indexOf(ctx.series) >= 0 ? ctx.series : SERIES[0];
  const target = scripts.some((s) => s.id === ctx.target) ? ctx.target : (scripts[0] || {}).id;
  const wt = works.some((w) => w.id === ctx.wt) ? ctx.wt : (works[0] || {}).id;
  const deadline = ctx.deadline || "今天 22:00";
  const count = ctx.count || "1";
  const done = ctx.done === "1";
  const tasks = LIB.teamTasks || [];

  const tshift = scripts.filter((s) => s.id === target)[0] || {};
  const wshift = works.filter((w) => w.id === wt)[0] || {};

  const chips = (opts, cur, key) => opts.map((v) =>
    `<span class="chip${cur === v ? " on" : ""}" data-set="E4.${key}=${v}&E4.done=">${v}</span>`).join("");

  const pickRow = (id, name, sub, key, cur) => `<div class="prow" data-set="E4.${key}=${id}&E4.done=" data-label="${name}">
      <span class="prd${cur === id ? " on" : ""}"></span>
      <div class="tx"><b>${name}</b><span>${sub}</span></div>
    </div>`;

  const tgrp = `<div class="tgrp">
      <div class="topt${TYPE === "cut" ? " on" : ""}" data-set="E4.type=cut&E4.done=" data-label="剪视频任务">
        <b>剪视频</b><span>给主题 / 形式 / 脚本 / 剪同款</span></div>
      <div class="topt${TYPE === "series" ? " on" : ""}" data-set="E4.type=series&E4.done=" data-label="系列主题任务">
        <b>系列主题</b><span>连续多天，每天一条</span></div>
    </div>`;

  const cutBody = `
    <div class="feedhd" style="margin-top:14px">任务来源<span>选一种</span></div>
    <div class="card" style="padding:12px 14px"><div style="display:flex;flex-wrap:wrap;gap:8px">
      ${[["theme", "给主题"], ["form", "给形式"], ["script", "给脚本"], ["work", "剪同款作品"]].map(([k, tx]) =>
        `<span class="chip${SRC === k ? " on" : ""}" data-set="E4.src=${k}&E4.done=">${tx}</span>`).join("")}
    </div></div>

    ${SRC === "theme" ? `<div class="feedhd" style="margin-top:12px">选主题</div>
      <div class="card" style="padding:12px 14px"><div style="display:flex;flex-wrap:wrap;gap:8px">${chips(THEMES, theme, "theme")}</div></div>` : ""}

    ${SRC === "form" ? `<div class="feedhd" style="margin-top:12px">选形式</div>
      <div class="card" style="padding:12px 14px"><div style="display:flex;flex-wrap:wrap;gap:8px">${chips(FORMS, form, "form")}</div></div>` : ""}

    ${SRC === "script" ? `<div class="feedhd" style="margin-top:12px">选脚本</div>
      <div class="card" style="padding:2px 14px">
        ${scripts.map((s) => pickRow(s.id, s.name, `${s.sub} · ${s.by || "—"}`, "target", target)).join("") || `<div class="frempty">团队还没有脚本</div>`}
      </div>` : ""}

    ${SRC === "work" ? `<div class="feedhd" style="margin-top:12px">选一条作品，让成员剪同款</div>
      <div class="card" style="padding:2px 14px">
        ${works.map((w) => pickRow(w.id, w.name, `${w.sub} · ${w.by || "—"}`, "wt", wt)).join("") || `<div class="frempty">团队还没有作品</div>`}
      </div>` : ""}
  `;

  const seriesBody = `
    <div class="feedhd" style="margin-top:14px">选系列主题<span>连续任务</span></div>
    <div class="card" style="padding:12px 14px"><div style="display:flex;flex-wrap:wrap;gap:8px">${chips(SERIES, series, "series")}</div></div>
    <div class="note" style="margin:10px 2px 0;line-height:1.7">系列任务会按天生成给全员，成员每天在任务里领当天那条，连续打卡。</div>
  `;

  const summary = TYPE === "cut"
    ? `将派发：全员照「${SRC === "theme" ? "主题 · " + theme : SRC === "form" ? "形式 · " + form : SRC === "script" ? "脚本 · " + (tshift.name || "—") : "剪同款 · " + (wshift.name || "—")}」剪，每人 ${count} 条，截止 ${deadline}。`
    : `将派发系列：全员「${series}」，每人每天 ${count} 条，截止 ${deadline}。`;

  const countChips = [["1", "每人 1 条"], ["2", "每人 2 条"], ["3", "每人 3 条"]].map(([v, tx]) =>
    `<span class="chip${count === v ? " on" : ""}" data-set="E4.count=${v}&E4.done=">${tx}</span>`).join("");

  const taskRow = (t) => `<div class="li" style="box-shadow:none;margin:0;border-radius:0;padding:13px 0" data-go="${t.go}" data-label="${t.t}">
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
    ${C.ab({ title: "发布任务", sub: "发给全员 · 设截止时间", back: "E3.4" })}

    <div class="body">
      ${done ? `<div class="okbar">任务已发布给全员，成员会在「团队 → 任务」里看到（演示）</div>` : ""}

      ${tgrp}
      ${TYPE === "cut" ? cutBody : seriesBody}

      <div class="feedhd" style="margin-top:14px">截止与每人条数</div>
      <div class="card" style="padding:12px 14px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${chips(["今天 18:00", "今天 22:00", "明天 12:00"], deadline, "deadline")}</div>
        <div style="display:flex;gap:8px;margin-top:10px">${countChips}</div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">${summary}</div>
      </div>

      <div class="feedhd" style="margin-top:16px">已发布任务<span>${tasks.length}</span></div>
      <div class="card" style="padding:0 16px">${tasks.map(taskRow).join("") || `<div class="frempty">还没有任务</div>`}</div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-set="E4.done=1" data-label="发布任务">发布任务</div>
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
    ${C.ab({ title: t.t, sub: `${t.kind === "series" ? "系列主题" : "剪视频"} · 截止 ${t.due}`, back: "E4" })}

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
