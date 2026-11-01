window.PAGES["C1.1"].prd = "PRD §6.2 · 抽取中（四步，可后台）";

/* 抽取是个几十秒的过程，得让人知道「现在在干什么」而不是干等。
   真实耗时主要集中在识别口播；断句分段是本地算法，很快。
   抽完不停在这一页，自动进 C1.2 让人决定去向。 */
window.PAGES["C1.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const x = D.extract();
  const from = ctx.src === "local" ? "本地相册" : "链接 · 抖音";
  /* 这里要的是"整段查询串"，不是 & 片段——拼错了会变成 #/C1.2&for=remix 这种坏路由 */
  const fq = ctx.for === "remix" ? "?for=remix" : "";

  const step = (cls, ic, tx, side) =>
    `<div class="gstep ${cls}"><span class="dot">${ic}</span><span style="flex:1">${tx}</span><span>${side || ""}</span></div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="C1${fq}" data-label="返回导入视频">‹</span>
      <div class="ttl">正在抽取文案<small>${from} · 可以退出去做别的</small></div>
    </div>

    <div class="gen">
      <div class="ring"><i>74%</i></div>
      <div class="h1" style="font-size:18px">正在识别口播</div>
      <div class="s" style="margin-top:6px">已识别 ${x.chars} 字 · 约 ${x.segs} 段 · 还剩 15 秒</div>

      <div class="gsteps">
        ${step("done", "✓", "拿到视频", from === "本地相册" ? "本机读取" : "12.4 MB")}
        ${step("done", "✓", "分离音轨", "32 秒音频")}
        ${step("now", "●", "识别口播", "进行中")}
        ${step("", "○", "断句并分段", "待开始")}
      </div>

      <div style="margin-top:22px;width:100%;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:12px 13px;text-align:left">
        <div class="xs" style="font-weight:700;color:var(--text-3);letter-spacing:.2px">刚识别到</div>
        <div class="t" style="margin-top:6px;line-height:1.6">${x.lines[2].vo}</div>
        <div class="xs" style="margin-top:7px">… 后面还有 ${x.segs - 3} 段</div>
      </div>
    </div>

    <div style="padding:0 16px 26px;display:flex;flex-direction:column;gap:9px">
      <div class="btn" data-go="C1.2${fq}" data-label="好了，看结果">好了，看结果</div>
      <div class="btn gray" data-go="B1" data-label="先去忙">先去忙，好了通知我</div>
    </div>
  </div>`;
};
