window.PAGES["T2"].render = function () {
  const C = window.C, G = window.G;

  const item = (bg, t, sub, tag, tagCls, go) =>
    `<div class="li" data-go="${go}" data-label="${t}">
      <div class="im" style="background:${bg}"></div>
      <div class="tx"><b>${t}</b><span>${sub}</span></div>
      <span class="tag ${tagCls}">${tag}</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "今日候选", sub: "06:00 自动生成 · 5 条", back: "A1", act: "全选" })}

    <div class="body">
      <div class="card" style="background:var(--brand-weak);box-shadow:none;display:flex;align-items:center;gap:11px">
        <div style="width:36px;height:36px;border-radius:12px;background:var(--g-tech);color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;flex:0 0 36px">✦</div>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600;color:var(--brand-ink)">今天按系列主题生成了 5 条</div>
          <div class="xs" style="margin-top:3px;color:#3A5BA8">主题：信任背书 · 都用你的声音和照片画中画</div>
        </div>
      </div>

      ${C.sec("待发 3 条")}
      ${item(G("#2C5BFF", "#5B8CFF"), "我为什么敢推荐这个磷虾油", "40 秒 · 4 段 · 已过合规", "可发", "g", "B4.1")}
      ${item(G("#7C5CFF", "#B08CFF"), "我妈吃了两个月的变化", "36 秒 · 4 段 · 已过合规", "可发", "g", "B4.1")}
      ${item(G("#00A8E8", "#00C2FF"), "3 步挑对磷虾油不踩坑", "52 秒 · 6 段 · 缺 1 段素材", "待补", "o", "B2")}

      ${C.sec("还没生成好 2 条")}
      ${item(G("#5B8CFF", "#8FB0FF"), "开团倒计时 · 500 单", "生成中 · 约 2 分钟", "排队", "line", "B3")}
      ${item(G("#00C2FF", "#8FE3FF"), "为什么只卖 500 单", "生成中 · 约 4 分钟", "排队", "line", "B3")}

      <div class="card plain" style="margin-top:14px">
        <div class="xs" style="line-height:1.7">不想发也没关系，24 小时后自动清掉，不占积分。想长期不生成就去关掉定时任务。</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="T1" data-label="去改定时设置"><span style="font-size:13px">⏱</span><b>设置</b></div>
      <div class="btn" data-go="B4.1" data-label="发布这 3 条">发布这 3 条</div>
    </div>
  </div>`;
};
