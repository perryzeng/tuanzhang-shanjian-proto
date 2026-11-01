window.PAGES["B4.1"].render = function () {
  const C = window.C;
  const stat = (n, t, color) =>
    `<div class="ls"><b style="color:${color || "var(--text)"}">${n}</b><span>${t}</span></div>`;
  const v = (nm, av, bg, act, score) =>
    `<div class="vline" data-go="G3.1" data-label="跟进 ${nm}">
      <div class="av" style="background:${bg}">${av}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px;font-weight:600">${nm}</div>
        <div class="xs" style="margin-top:2px">${act}</div>
      </div>
      <span class="tag ${score >= 70 ? "r" : "b"}">意向 ${score}</span>
      <span style="font-size:11.5px;color:var(--brand);font-weight:600">跟进 ›</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B4" data-label="返回字幕封面">‹</span>
      <div class="ttl">成品 · 磷虾油今晚开团<small>已发布到视频号 · 2 小时前</small></div>
      <span class="act">分享</span>
    </div>

    <div class="body">
      <div class="card" style="padding:12px">
        <div style="display:grid;grid-template-columns:84px 1fr;gap:11px;align-items:start">
          <div style="width:84px;height:149px;border-radius:10px;overflow:hidden;position:relative;background:linear-gradient(160deg,#7C5CFF,#B08CFF 55%,#5B3FD1)">
            <div style="position:absolute;left:0;right:0;bottom:0;padding:6px 5px;background:linear-gradient(0deg,rgba(0,0,0,.6),transparent);color:#fff;font-size:8.5px;line-height:1.3">从原料、含量<br>到认准标志</div>
            <div style="position:absolute;right:5px;top:5px;background:rgba(0,0,0,.45);color:#fff;font-size:8px;border-radius:5px;padding:1px 4px">AI 标注</div>
          </div>
          <div style="flex:1;min-width:0;overflow:hidden">
            <div style="font-size:13.5px;font-weight:700;line-height:1.4;overflow:hidden">磷虾油今晚开团，3 步选对不踩坑</div>
            <div class="xs" style="margin-top:6px">阿珍 · 大健康选品 5 年</div>
            <div class="row" style="gap:5px;margin-top:9px">
              <span class="pill on" style="height:24px;font-size:10.5px">抖音</span>
              <span class="pill" style="height:24px;font-size:10.5px">视频号</span>
              <span class="pill" style="height:24px;font-size:10.5px">小红书</span>
            </div>
            <div class="xs" style="margin-top:9px">数据每小时更新 · 已连续 2 条过万</div>
          </div>
        </div>
      </div>

      <div class="lstat" style="margin-top:12px">
        ${stat("1.2万", "播放")}
        ${stat("386", "访客")}
        ${stat("42s", "平均停留", "var(--battle)")}
        ${stat("27", "潜在客户", "var(--danger)")}
      </div>

      <div class="sec-h"><span class="h2">看完的潜在客户</span><span class="more" data-go="G3.1" data-label="全部访客">27 人全部 ›</span></div>
      <div class="card" style="padding:2px 13px">
        ${v("阿梅", "梅", "#2C5BFF", "看了 3 次 · 停留 1 分 12 秒 · 点了购物车", 86)}
        ${v("阿强", "强", "#00A8E8", "看完 2 遍 · 评论区问价", 74)}
        ${v("微信用户 8***2", "匿", "#8C93A3", "停留 48 秒 · 未互动", 41)}
      </div>

      <div class="card" style="margin-top:12px;background:var(--bg-2);border-style:dashed">
        <div class="row" style="gap:9px">
          <span style="width:22px;height:22px;border-radius:7px;background:var(--ai-grad);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;flex:0 0 22px">✦</span>
          <div style="flex:1;font-size:12px;color:var(--text-2);line-height:1.5">
            <b style="color:var(--text)">这条跑得比团队均值好 2.3 倍</b><br>建议用同结构再发一条，换个开场钩子
          </div>
        </div>
        <div class="btn ghost sm" style="width:100%;margin-top:10px" data-go="B1" data-label="再剪一条">用同结构再剪一条</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="B4" data-label="改字幕封面"><span style="font-size:13px">▭</span><b>改封面</b></div>
      <div class="btn" data-go="B1" data-label="再剪一条">再剪一条</div>
    </div>
  </div>`;
};
