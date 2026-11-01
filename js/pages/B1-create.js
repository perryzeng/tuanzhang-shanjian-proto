window.PAGES["B1"].render = function () {
  const C = window.C, G = window.G;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "创作", t: "想怎么剪？", act: `<span class="btn-pill line">草稿 6</span>` })}

    <div class="body">
      <div class="mode" style="background:var(--g-brand)" data-go="B2" data-label="脚本混剪">
        <div class="mt"><b>脚本混剪</b><span class="tag" style="background:rgba(255,255,255,.22);color:#fff">最常用</span></div>
        <div class="md">脚本和素材在同一页改，混剪、字幕、封面一次做完。<br>改文案点台词，换素材点画面。</div>
        <div class="mb">
          <span data-go="B2" data-label="AI 帮我写脚本" style="color:var(--brand-ink)">✦ AI 帮我写</span>
          <span data-go="B2" data-label="导入脚本" style="color:var(--brand-ink)">↓ 导入脚本</span>
        </div>
      </div>

      <div class="mode" style="background:linear-gradient(135deg,#00A8E8,#00C2FF)" data-go="C1" data-label="剪同款">
        <div class="mt"><b>剪同款 / 二创</b><span class="tag" style="background:rgba(255,255,255,.22);color:#fff">涨粉最快</span></div>
        <div class="md">导入视频或粘贴链接 → AI 拆解 → 同一个发布器逐段改。<br>原文案对照 · 建议换标 · 不用改的段自动折叠。</div>
        <div class="mb">
          <span data-go="C1" data-label="导入本地" style="color:#0A6E96">↓ 导入本地</span>
          <span data-go="C1" data-label="粘贴链接" style="color:#0A6E96">⧉ 粘贴链接</span>
        </div>
      </div>

      <div class="mode" style="background:var(--g-violet)" data-go="D1" data-label="SOP 系列">
        <div class="mt"><b>SOP 系列</b><span class="tag" style="background:rgba(255,255,255,.22);color:#fff">团队统一</span></div>
        <div class="md">按总部节奏走：磷虾油战役 Day 5/10「信任背书」。<br>每天一个主题，素材、口径、话术都备好。</div>
        <div class="mb">
          <span data-go="D1" data-label="继续第 5 天" style="color:#5B3FD1">继续第 5 天</span>
          <span data-go="D1" data-label="看本期任务" style="color:#5B3FD1">看本期任务</span>
        </div>
      </div>

      <div class="card" style="margin-top:14px;display:flex;align-items:center;gap:12px;background:var(--bg-2);box-shadow:inset 0 0 0 1px var(--line)" data-go="T1" data-label="AI 定时任务">
        <div style="width:40px;height:40px;border-radius:13px;background:var(--g-tech);color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;flex:0 0 40px">⏱</div>
        <div style="flex:1;min-width:0">
          <div class="h3">AI 定时任务 · 每天 6:00 自动备好</div>
          <div class="xs" style="margin-top:3px">口径设一次，之后自动出片进队列</div>
        </div>
        <span style="font-size:12px;font-weight:700;color:var(--brand)">配置</span>
      </div>

      ${C.sec("继续创作", "全部", "A1")}
      ${C.li({ bg: G("#7C5CFF", "#B08CFF"), title: "磷虾油今晚开团", m1: "第 2 步 · 已配 3/5 段画面", btn: "继续", go: "B2" })}
      ${C.li({ bg: G("#00A8E8", "#00C2FF"), title: "阿玲爆款 · 二创版", m1: "已改 2 段 · 安全度 62", btn: "继续", btnCls: "line", go: "C2" })}
    </div>

    ${C.tab("")}
  </div>`;
};
