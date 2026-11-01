window.PAGES["B3"].render = function (ctx) {
  const C = window.C;
  /* 从系列进来回系列，其余回"选模板与声音"那一步（不是脚本框——
     用户刚在这里点了生成，返回应该是改模板，不是回到逐段改词） */
  const backGo = ctx.from === "D2"
    ? "D2?c=" + (ctx.c || "cp_1") + "&d=" + (ctx.d || 5)
    : "B2.4?from=B2&kind=" + (ctx.kind || "script") + "&src=" + (ctx.src || "")
      + (ctx.doc ? "&doc=" + ctx.doc : "") + (ctx.tpl ? "&tpl=" + ctx.tpl : "") + (ctx.voice ? "&voice=" + ctx.voice : "");
  const step = (cls, ic, tx, side) =>
    `<div class="gstep ${cls}"><span class="dot">${ic}</span><span style="flex:1">${tx}</span><span>${side || ""}</span></div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backGo}" data-label="返回发布器">‹</span>
      <div class="ttl">生成中<small>可以退出去做别的，好了会通知你</small></div>
    </div>

    <div class="gen">
      <div class="ring"><i>62%</i></div>
      <div class="h1" style="font-size:18px">正在合成视频</div>
      <div class="s" style="margin-top:6px">还剩约 40 秒 · 5 段 · 预计 40 秒成片</div>

      <div class="gsteps">
        ${step("done", "✓", "解析脚本分段", "5 段")}
        ${step("done", "✓", "匹配素材画面", "9/10")}
        ${step("now", "●", "合成画面与画中画", "进行中")}
        ${step("", "○", "生成配音与字幕", "待开始")}
      </div>

      <div style="margin-top:22px;width:100%;display:flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:11px 12px;text-align:left">
        <div style="width:34px;height:48px;border-radius:7px;background:linear-gradient(150deg,#00C2FF,#00A8E8);flex:0 0 34px"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12.5px;font-weight:600">正在合成 · 第 3 段 血管知识示意</div>
          <div class="xs" style="margin-top:3px">AI 生成的示意画面 + 你的画中画</div>
        </div>
      </div>
    </div>

    <div style="padding:0 16px 26px;display:flex;flex-direction:column;gap:9px">
      <div class="btn" data-go="B4" data-label="生成完成 · 选封面">生成完成 · 选封面</div>
      <div class="btn gray" data-go="A1" data-label="先去忙">先去忙，好了推送到首页</div>
    </div>
  </div>`;
};
