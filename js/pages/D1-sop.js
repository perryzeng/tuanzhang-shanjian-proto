window.PAGES["D1"].render = function () {
  const C = window.C;

  const task = (no, t, sub, done, go) =>
    `<div class="card" style="margin-bottom:10px;padding:13px 14px;display:flex;align-items:center;gap:12px;${done ? "opacity:.62" : ""}" data-go="${go}" data-label="${t}">
      <div style="width:24px;height:24px;border-radius:50%;flex:0 0 24px;display:flex;align-items:center;justify-content:center;font-size:11px;${done ? "background:var(--success);color:#fff" : "box-shadow:inset 0 0 0 1.5px var(--line);color:var(--text-4)"}">${done ? "✓" : no}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13.5px;font-weight:600;${done ? "text-decoration:line-through;color:var(--text-3)" : ""}">${t}</div>
        <div class="xs" style="margin-top:3px">${sub}</div>
      </div>
      ${done ? "" : `<span class="btn-pill">去完成</span>`}
    </div>`;

  const day = (d, on, done) =>
    `<div style="flex:1;text-align:center">
      <div style="height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;
        ${done ? "background:var(--brand-weak);color:var(--brand-ink)" : on ? "background:var(--g-brand);color:#fff" : "background:#F3F5FA;color:var(--text-4)"}">${d}</div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "磷虾油战役", sub: "总部统一节奏 · 第 5 天", back: "B1", act: "规则" })}

    <div class="body">
      <div class="hero">
        <div class="row"><span class="lb">本期进度</span>
          <span style="margin-left:auto;font-size:11.5px;background:rgba(255,255,255,.16);border-radius:999px;padding:4px 11px">Day 5 / 10</span>
        </div>
        <div class="num">50<small>%</small></div>
        <div class="sub">已完成 12 条 · 团队 86 人参与</div>
        <div class="bar" style="margin-top:14px;background:rgba(255,255,255,.16)"><i style="width:50%;background:linear-gradient(90deg,#8FE3FF,#fff)"></i></div>
      </div>

      <div class="card" style="margin-top:14px;background:var(--brand-weak);box-shadow:none">
        <div class="row"><span class="tag b">今日主题</span><span class="xs" style="margin-left:auto">建议 1 条</span></div>
        <div class="h2" style="margin-top:9px">信任背书 · 你凭什么让人买</div>
        <div class="s" style="margin-top:6px;color:#3A5BA8">讲你自己吃多久、家里人吃不吃、敢不敢晒单。观众信的是人，不是参数。</div>
      </div>

      ${C.sec("今日任务", "全部 3 条")}
      ${task("1", "发 1 条信任背书口播", "脚本已生成 · 补 3 秒手部特写", false, "B1")}
      ${task("2", "剪 2 条团队爆款同款", "本周 Top1 已跑 8.6 万", false, "C1")}
      ${task("3", "上传 2 条产品空镜", "昨天已完成", true, "E2")}

      ${C.sec("连续打卡")}
      <div class="card" style="padding:14px">
        <div class="row" style="gap:6px">
          ${day("D1", false, true)}${day("D2", false, true)}${day("D3", false, true)}${day("D4", false, true)}${day("D5", true, false)}${day("D6", false, false)}${day("D7", false, false)}
        </div>
        <div class="xs" style="margin-top:11px">已连续 4 天，再发 1 条就解锁「稳定输出」勋章</div>
      </div>

      <div class="card" style="margin-top:12px;display:flex;align-items:center;gap:11px" data-go="E1" data-label="看团队进度">
        <div style="width:38px;height:38px;border-radius:12px;background:var(--violet-weak);color:var(--violet);display:flex;align-items:center;justify-content:center;font-size:16px;flex:0 0 38px">◍</div>
        <div style="flex:1">
          <div class="h3">团队 86 人已完成 12 条</div>
          <div class="xs" style="margin-top:3px">你在团队排第 7，阿玲排第 1</div>
        </div>
        <span style="font-size:12px;font-weight:700;color:var(--brand)">去看</span>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="T1" data-label="定时任务"><span style="font-size:13px">⏱</span><b>定时</b></div>
      <div class="btn" data-go="B1" data-label="开始今天的任务">开始今天的任务</div>
    </div>
  </div>`;
};
