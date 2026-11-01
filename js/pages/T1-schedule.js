window.PAGES["T1"].render = function () {
  const C = window.C;

  const row = (t, sub, on, right) =>
    `<div class="kv" style="align-items:center">
      <span class="k"><span style="display:block;color:var(--text);font-weight:600">${t}</span>
        ${sub ? `<small style="display:block;color:var(--text-3);font-size:11px;margin-top:3px">${sub}</small>` : ""}</span>
      ${right || `<span class="switch ${on ? "on" : ""}"><i></i></span>`}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "AI 定时任务", sub: "每天自动备好，你只管发", back: "B1", act: "保存" })}

    <div class="body">
      <div class="hero" style="padding:18px">
        <div class="lb">每天 06:00 自动生成</div>
        <div class="num" style="font-size:26px;letter-spacing:-.5px">3 条候选 · 你挑 1 条</div>
        <div class="sub">生成好推送到首页，点一下就能发</div>
      </div>

      <div class="card" style="margin-top:14px;padding:4px 16px 8px">
        ${row("开启定时任务", "关闭后不再自动生成", true)}
        ${row("推送时间", "每天 06:00", null, `<span class="pill on" data-set="T1.t=1">06:00</span>`)}
        ${row("每次生成条数", "3 条，占用 6 积分/天", null, `<span class="pill">3 条 ›</span>`)}
      </div>

      ${C.sec("内容从哪来")}
      <div class="card" style="padding:14px">
        <div class="chips" style="margin-bottom:12px">
          <span class="chip on">跟当前系列</span>
          <span class="chip">自选模板</span>
          <span class="chip">我的历史爆款</span>
        </div>
        <div class="li" style="margin:0;box-shadow:none;background:var(--brand-weak-2)" data-go="D1" data-label="当前系列">
          <div class="im" style="background:var(--g-brand)">系列</div>
          <div class="tx"><b>磷虾油系列 · Day 5/10</b><span>今天主题：信任背书</span></div>
          <span class="tag b">已选</span>
        </div>
      </div>

      ${C.sec("生成后用我的")}
      <div class="card" style="padding:4px 16px 8px">
        ${row("声音", "温柔女声 · 暴富者克隆音", true)}
        ${row("字幕样式", "大字吸睛", true)}
        ${row("出镜方式", "照片画中画（不真人录制）", true)}
        ${row("自动过合规", "生成时就做违规词检测", true)}
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">每天 6 点生成好后，首页会多一张「今日候选」卡。你不点头不会自动发。</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="T2" data-label="看今天生成结果"><span style="font-size:13px">▤</span><b>今日</b></div>
      <div class="btn" data-go="A1" data-label="保存并回到首页">保存</div>
    </div>
  </div>`;
};
