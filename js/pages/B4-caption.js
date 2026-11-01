window.PAGES["B4"].render = function () {
  const C = window.C;
  const chip = (tx, on) => `<span class="pill ${on ? "on" : ""}" style="flex:0 0 auto">${tx}</span>`;
  const cv = (bg, ttl, sel) =>
    `<div class="cv ${sel ? "sel" : ""}">
      <div class="im" style="background:${bg};aspect-ratio:3/4">
        <span class="ttl2">${ttl}</span>
      </div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B3" data-label="返回生成中">‹</span>
      <div class="ttl">字幕与封面<small>第 3 步 · 最后一步</small></div>
      <span class="act" data-go="B4.1" data-label="下一步">下一步</span>
    </div>

    <div class="body">
      <div style="display:flex;justify-content:center">
        <div style="width:150px">
          <div class="pvwrap">
            <div class="pv" style="background:linear-gradient(160deg,#7C5CFF,#B08CFF 55%,#5B3FD1)">
              <div style="position:absolute;left:10px;top:10px;background:rgba(0,0,0,.4);color:#fff;font-size:9.5px;font-weight:700;border-radius:6px;padding:2px 6px">00:12 / 00:40</div>
              <div class="subline" style="font-size:13px;bottom:44px">从原料、含量到认准标志</div>
              <div style="position:absolute;left:0;right:0;bottom:0;height:60px;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent)"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="sec-h" style="margin:10px 0 8px"><span class="h2">字幕样式</span><span class="more">全 12 款 ›</span></div>
      <div style="display:flex;gap:7px;overflow-x:auto;padding-bottom:2px">
        ${chip("大字吸睛", true)}${chip("黄底黑字")}${chip("描边白字")}${chip("逐字跳出")}
      </div>

      <div class="row" style="margin-top:10px;gap:10px">
        <span style="font-size:12.5px;color:var(--text-2)">字号</span>
        <input type="range" min="0" max="100" value="72" style="flex:1;accent-color:var(--brand)">
        <span style="font-size:12px;font-weight:600;color:var(--text)">大</span>
      </div>

      <div class="sec-h" style="margin:14px 0 8px"><span class="h2">封面</span><span class="more">从视频帧选 ›</span></div>
      <div class="cover-grid">
        ${cv("linear-gradient(150deg,#7C5CFF,#B08CFF)", "磷虾油今晚开团", true)}
        ${cv("linear-gradient(150deg,#00A8E8,#00C2FF)", "3 步选对磷虾油")}
        ${cv("linear-gradient(150deg,#2C5BFF,#5B8CFF)", "500 单限量")}
      </div>

      <div class="card" style="margin-top:12px;display:flex;align-items:center;gap:10px;background:var(--battle-weak);border-color:transparent">
        <span style="width:20px;height:20px;border-radius:50%;background:var(--battle);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;flex:0 0 20px">✓</span>
        <div style="flex:1">
          <div style="font-size:12.5px;font-weight:600;color:var(--battle)">合规检测通过</div>
          <div class="xs" style="margin-top:2px;color:#3F6D5E">已自动标注「AI 生成画面」，功效表述无违规词</div>
        </div>
        <span style="font-size:11.5px;color:var(--battle);font-weight:600">详情 ›</span>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px"><span style="font-size:13px">▭</span><b>预览</b></div>
      <div class="btn" data-go="B4.1" data-label="下一步：成品">下一步 · 看成品</div>
    </div>
  </div>`;
};
