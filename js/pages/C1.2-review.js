window.PAGES["C1.2"].prd = "PRD §6.2 / §6.4 · 抽取结果与两条去向";

/* 抽取结果这一页是整条路上最关键的一个岔口：
   · 要文案 → 当脚本用（kind=script，画面全新配）
   · 连画面一起还原 → 走二创（kind=remix，要过安全度检查）
   两条去向的差别不是「编辑方式」，是「有没有用别人的画面」，所以必须在这里分。 */
window.PAGES["C1.2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const x = D.extract();

  const lines = x.lines.map((l, i) => C.seg({
    no: l.no, name: l.name, dur: l.dur + "s",
    tags: i === 2 ? [["o", "带原作者痕迹"]] : [],
    vo: l.vo,
    edit: false
  })).join("");

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "抽取结果", sub: x.who + " · " + x.title, back: "C1", act: "重新导" })}

    <div class="body">
      <div class="hero" style="padding:16px 18px">
        <div class="row"><span class="lb">识别完成</span>
          <span style="margin-left:auto;font-size:11px;background:rgba(255,255,255,.16);border-radius:999px;padding:4px 10px">${x.from}</span>
        </div>
        <div class="num" style="font-size:26px">${x.chars}<small>字</small> · ${x.segs}<small>段</small> · ${x.dur}<small>秒</small></div>
        <div class="sub">已把「谁说的」清掉，留下「说什么」</div>
      </div>

      ${C.sec("清掉了什么")}
      <div class="card" style="padding:4px 16px 8px">
        ${x.cleaned.map((c) => `<div class="kv">
          <span class="k">${c.k}</span><span class="v" style="font-size:12px;color:var(--text-2)">${c.n} 处 · 已清除</span></div>`).join("")}
      </div>
      <div class="card plain" style="margin-top:10px">
        <div class="xs" style="line-height:1.7">只清文字不会让内容变成你的：<b style="color:var(--text)">画面如果还是原片，仍然算搬运</b>。所以下面两条路要选一条。</div>
      </div>

      ${C.sec("文案分段", "进去后可逐段改")}
      ${lines}
    </div>

    <div class="actionbar" style="flex-wrap:wrap">
      <div class="btn line" style="flex:1;min-width:0;font-size:13.5px" data-go="B2?kind=remix" data-label="连画面一起还原">连画面还原 · 二创</div>
      <div class="btn" style="flex:1.2;min-width:0;font-size:13.5px" data-go="B2?kind=script&src=extract" data-label="要文案，配我的画面">要文案 · 配我的画面</div>
      <div style="width:100%;display:flex;justify-content:center;margin-top:2px">
        <span class="xs" style="color:var(--brand);font-weight:600" data-go="B1.2?scope=my" data-label="存进脚本库">存进我的脚本库，以后直接用 ›</span>
      </div>
    </div>
  </div>`;
};
