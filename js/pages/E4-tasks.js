window.PAGES["E4"].prd = "PRD §6.11 · 发布任务（剪视频 / 贡献素材）+ 每个任务的完成情况";

/* 发布任务：团队长/管理员在这里派活。只做两类——
   ① 剪视频：今天要剪哪个视频（从团队脚本里挑一条）；
   ② 贡献素材：要成员拍/传什么素材（出镜 / 空镜 / 截图）。
   下面按任务统计每个成员的完成情况。 */
window.PAGES["E4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE, LIB = window.DATA.library;
  const TYPE = ctx.type === "asset" ? "asset" : "cut";
  const scripts = D.lib("team", "script").items;
  const target = scripts.some((s) => s.id === ctx.target) ? ctx.target : (scripts[0] || {}).id;
  const deadline = ctx.deadline || "今天 22:00";
  const count = ctx.count || "1";
  const mode = ctx.mode === "pick" ? "pick" : "all";
  const req = (ctx.req || "").replace(/"/g, "&quot;");
  const akind = ctx.akind || "出镜";
  const done = ctx.done === "1";
  const members = LIB.teamMembers || [];
  const tasks = LIB.teamTasks || [];
  const tgt = scripts.filter((s) => s.id === target)[0] || scripts[0] || {};

  const tgrp = `<div class="tgrp">
      <div class="topt${TYPE === "cut" ? " on" : ""}" data-set="E4.type=cut&E4.done=" data-label="剪视频任务">
        <b>剪视频</b><span>今天要剪哪个视频</span></div>
      <div class="topt${TYPE === "asset" ? " on" : ""}" data-set="E4.type=asset&E4.done=" data-label="贡献素材任务">
        <b>贡献素材</b><span>要成员拍 / 传素材</span></div>
    </div>`;

  const cutPick = `<div class="feedhd" style="margin-top:14px">今天要剪哪个视频<span>选一条</span></div>
    <div class="card" style="padding:2px 14px">
      ${scripts.map((s) => `<div class="prow" data-set="E4.target=${s.id}&E4.done=" data-label="${s.name}">
        <span class="prd${target === s.id ? " on" : ""}"></span>
        <div class="tx"><b>${s.name}</b><span>${s.sub} · ${s.by || "—"}</span></div>
      </div>`).join("") || `<div class="frempty">团队还没有脚本</div>`}
    </div>`;

  const assetForm = `<div class="card" style="padding:14px;margin-top:14px">
      <div class="s" style="margin-bottom:7px">要什么素材</div>
      <input data-bind="E4.req" data-live value="${req}" placeholder="例如：素颜出镜 9 秒，讲一句使用感受"
        style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
      <div class="s" style="margin:14px 0 8px">素材类型</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${["出镜", "空镜", "截图", "口播"].map((k) => `<span class="chip${akind === k ? " on" : ""}" data-set="E4.akind=${k}&E4.done=">${k}</span>`).join("")}
      </div>
    </div>`;

  const chips = (opts, cur, key) => opts.map(([v, tx]) =>
    `<span class="chip${String(cur) === String(v) ? " on" : ""}" data-set="E4.${key}=${v}&E4.done=">${tx}</span>`).join("");

  const taskCard = (t) => {
    const pct = Math.round(t.done / t.total * 100);
    const shown = Math.min(t.done, members.length);
    return `<div class="card" style="margin-bottom:10px">
      <div class="row"><span class="tag b">${t.t}</span><span class="xs" style="margin-left:auto">截止 ${t.due}</span></div>
      <div class="bar" style="margin:11px 0 8px"><i style="width:${pct}%;background:var(--g-brand)"></i></div>
      <div class="row"><span class="xs">${t.done}/${t.total} 人完成</span><span class="xs" style="margin-left:auto">${pct}%</span></div>
      <div class="pavs">
        ${members.map((m, i) => `<span class="pav${i < shown ? " done" : ""}" style="background:${m.bg}" title="${m.name}">${m.av}<i>${i < shown ? "✓" : ""}</i></span>`).join("")}
      </div>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "发布任务", sub: "团队 · 今天要剪什么", back: "E3.4", act: "任务记录" })}

    <div class="body">
      ${done ? `<div class="okbar">任务已发布，成员会在团队首页的任务里看到（演示）</div>` : ""}

      ${tgrp}
      ${TYPE === "cut" ? cutPick : assetForm}

      <div class="feedhd" style="margin-top:14px">指派</div>
      <div class="card" style="padding:12px 14px">
        <div style="display:flex;gap:8px">${chips([["all", "全员"], ["pick", "指定成员"]], mode, "mode")}</div>
        ${mode === "pick" ? `<div class="pavs" style="margin-top:10px">
          ${members.map((m) => `<span class="pav done" style="background:${m.bg}" title="${m.name}">${m.av}<i>✓</i></span>`).join("")}
        </div>` : `<div class="xs" style="margin-top:9px">全员 ${members.length} 人都会收到</div>`}
      </div>

      <div class="feedhd" style="margin-top:14px">截止与每人条数</div>
      <div class="card" style="padding:12px 14px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">${chips([["今天 18:00", "今天 18:00"], ["今天 22:00", "今天 22:00"], ["明天 12:00", "明天 12:00"]], deadline, "deadline")}</div>
        <div style="display:flex;gap:8px;margin-top:10px">${chips([["1", "每人 1 条"], ["2", "每人 2 条"], ["3", "每人 3 条"]], count, "count")}</div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">${TYPE === "cut"
          ? `将派发：剪「${tgt.name || "—"}」，${mode === "all" ? "全员" : "指定成员"}每人 ${count} 条，截止 ${deadline}。`
          : `将派发：贡献「${akind}」素材，${mode === "all" ? "全员" : "指定成员"}每人 ${count} 条，截止 ${deadline}。`}</div>
      </div>

      <div class="feedhd" style="margin-top:16px">任务完成情况<span>${tasks.length}</span></div>
      ${tasks.map(taskCard).join("") || `<div class="frempty">还没有任务</div>`}
    </div>

    <div class="actionbar">
      <div class="btn ai" data-set="E4.done=1" data-label="发布任务">发布任务</div>
    </div>
  </div>`;
};
