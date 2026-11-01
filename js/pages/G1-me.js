window.PAGES["G1"].render = function () {
  const C = window.C, G = window.G;

  const row = (ic, bg, fg, t, sub, go) =>
    `<div class="li" style="box-shadow:none;margin-bottom:0;border-radius:0;padding:14px 0" data-go="${go}" data-label="${t}">
      <div style="width:36px;height:36px;border-radius:12px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;font-size:15px;flex:0 0 36px">${ic}</div>
      <div class="tx"><b style="margin-bottom:2px">${t}</b><span>${sub}</span></div>
      <span style="color:var(--text-4);font-size:16px">›</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "我的", t: "暴富者", av: "暴" })}

    <div class="body">
      <div class="hero">
        <div class="row">
          <div style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex:0 0 44px">暴</div>
          <div style="flex:1;margin-left:12px">
            <div style="font-size:15px;font-weight:700">暴富者</div>
            <div class="sub" style="margin-top:4px">大健康选品 5 年 · 团队第 7</div>
          </div>
          <span style="font-size:11.5px;background:rgba(255,255,255,.16);border-radius:999px;padding:5px 12px">编辑</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;margin-top:18px;text-align:center">
          <div><div style="font-size:19px;font-weight:700">128</div><div class="sub" style="margin-top:3px">累计视频</div></div>
          <div style="border-left:1px solid rgba(255,255,255,.14);border-right:1px solid rgba(255,255,255,.14)"><div style="font-size:19px;font-weight:700">12.8万</div><div class="sub" style="margin-top:3px">总播放</div></div>
          <div><div style="font-size:19px;font-weight:700">1,286</div><div class="sub" style="margin-top:3px">出单</div></div>
        </div>
      </div>

      <div class="card" style="margin-top:14px;display:flex;align-items:center;gap:11px" data-go="G3.1" data-label="高潜客户">
        <div style="width:38px;height:38px;border-radius:13px;background:var(--warm-weak);color:var(--warm);display:flex;align-items:center;justify-content:center;font-size:16px;flex:0 0 38px">◎</div>
        <div style="flex:1">
          <div class="h3">27 个高潜客户等你跟进</div>
          <div class="xs" style="margin-top:3px">昨天有 6 个看了 2 次以上</div>
        </div>
        <span class="btn-pill">去看</span>
      </div>

      ${C.sec("我的资产")}
      <div class="card" style="padding:0 16px">
        ${row("▤", "var(--brand-weak)", "var(--brand)", "我的出镜", "12 张照片 · 3 段小视频", "E2.1")}
        ${row("⏱", "var(--brand-weak)", "var(--brand)", "AI 定时任务", "每天 06:00 自动生成 3 条", "T1")}
        ${row("☆", "var(--violet-weak)", "var(--violet)", "我的收藏", "18 个模板 · 6 个脚本", "F1")}
      </div>

      ${C.sec("设置")}
      <div class="card" style="padding:0 16px">
        ${row("≡", "#F1F3F9", "var(--text-2)", "声音与形象", "温柔女声 · 克隆音已就绪", "B2.3")}
        ${row("◔", "#F1F3F9", "var(--text-2)", "通知设置", "任务 / 团队 / 数据 三类", "E5")}
        ${row("?", "#F1F3F9", "var(--text-2)", "帮助与反馈", "怎么过审 · 怎么算安全度", "A1")}
      </div>

      <div class="xs" style="text-align:center;margin-top:18px">团长闪剪 v1.0 · 粤 ICP 备 2026xxxx</div>
    </div>

    ${C.tab("G1")}
  </div>`;
};
