window.PAGES["D1.2"].prd = "PRD §6.13 · 单日任务（为什么讲这个 + 三个要点）";

/* 单日详情只做一件事：把「今天讲什么」翻译成「这条怎么讲」。
   要点给三条就够——给多了等于没给，团长不会读第四行。
   未来的天也能进来看，但明确标「还没到」，不虚构素材和数据的说法。 */
window.PAGES["D1.2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const c = D.campaign(ctx.c);
  const p = D.dayPlan(c, ctx.d || c.day);
  const stTx = p.state === "done" ? "已发布" : p.state === "today" ? "今天该发" : "还没到";
  const stCls = p.state === "done" ? "g" : p.state === "today" ? "b" : "line";

  const point = (n, t) =>
    `<div style="display:flex;gap:10px;padding:9px 0">
      <div style="width:20px;height:20px;border-radius:7px;background:var(--brand-weak);color:var(--brand-ink);font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center;flex:0 0 20px">${n}</div>
      <div class="t" style="flex:1;min-width:0;line-height:1.6">${t}</div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({
      title: "Day " + p.n + " · " + p.topic,
      sub: p.cname + " · " + p.owner,
      back: "D1.1",
      act: "改主题"
    })}

    <div class="body">
      <div class="row" style="gap:6px;margin-bottom:11px">
        <span class="tag ${stCls}">${stTx}</span>
        <span class="tag line">第 ${p.n} / ${p.total} 天</span>
        <span class="tag line">${p.product}</span>
      </div>

      <div class="card" style="background:var(--brand-weak);box-shadow:none">
        <div class="xs" style="color:#3A5BA8;font-weight:700">为什么讲这个</div>
        <div class="t" style="margin-top:7px;line-height:1.68;color:var(--brand-ink)">${p.why}</div>
      </div>

      ${C.sec("三个要点")}
      <div class="card" style="padding:6px 16px 10px">
        ${p.points.map((t, i) => point(i + 1, t)).join("")}
      </div>

      ${C.sec("素材与参考")}
      <div class="card" style="padding:4px 16px 8px">
        <div class="kv"><span class="k">素材</span><span class="v" style="font-size:12px;max-width:62%;text-align:right;line-height:1.5;font-weight:500">${p.material}</span></div>
        <div class="kv"><span class="k">参考</span><span class="v" style="font-size:12px;max-width:62%;text-align:right;line-height:1.5;font-weight:500">${p.ref}</span></div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">
          进去之后脚本结构是现成的：开头立信任 → 报天数 → 讲今天这点 → 接 CTA。
          你只需要把中间那段换成自己的话。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:56px" data-go="D1.1?c=${c.id}" data-label="看日程"><span style="font-size:13px">▤</span><b>日程</b></div>
      ${p.state === "done"
        ? `<div class="btn line" data-go="B4.1" data-label="看这条的数据">已发布 · 看数据</div>`
        : `<div class="btn" data-go="B2?kind=series&day=${p.n}" data-label="去创作这条">去创作这条 · Day ${p.n}</div>`}
    </div>
  </div>`;
};
