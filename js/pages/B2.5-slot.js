window.PAGES["B2.5"].prd = "PRD §6.17 · 调整单段画面（铺满方式 / 入点 / 原声）";
window.PAGES["B2.5"].states = [
  { k: "", n: "默认：这一段素材怎么铺满台词、从哪开始、要不要原声" }
];

/* 「修改」和「替换」是两件事，所以分成两页：
   替换 = 换一条素材（B2.1）；修改 = 就用这一条，把它调顺（本页）。

   这一页存在的真正理由，是素材时长和台词时长对不上：
   台词 14 秒、素材 3 秒，中间差的那 11 秒怎么办？只有三种办法——
   循环、放慢、或者定格在最后一帧。默认循环，但不是所有素材都适合循环
   （有人物出镜的循环会"跳"），所以必须给用户选。 */
window.PAGES["B2.5"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const kind = ctx.kind || "script";
  const segId = ctx.seg || "";
  /* 从 B2 进来时，那段可能刚被「一键配齐」补过画面，也可能本来就是 AI 稿的
     空槽——所以先按原样取，取不到再按"配齐后"取一次。否则这一页会把素材
     当成 0 秒，铺满算法整段算错。 */
  const base = D.draft(kind, { doc: ctx.doc, src: ctx.src, day: ctx.day });
  let s = base.segments.filter((x) => x.id === segId)[0] || base.cur;
  if (!s.shots.some((x) => !x.miss)) {
    const filled = D.draft(kind, { doc: ctx.doc, src: ctx.src, day: ctx.day, autoFill: true });
    s = filled.segments.filter((x) => x.id === s.id)[0] || s;
  }
  const shot = s.shots.filter((x) => !x.miss)[0] || {};

  const fill = ctx.fill || "loop";
  const snd = ctx.snd || "mute";
  const start = +(ctx.start || 0);

  /* 铺满方式算出来给用户看——"循环 5 次"比"循环"具体得多 */
  const ratio = shot.dur && s.dur ? s.dur / shot.dur : 1;
  const loopN = Math.max(1, Math.round(ratio));
  const FIT = [
    ["loop", "循环 " + loopN + " 次", "画面会从头再来；只适合空镜、产品、动画"],
    ["slow", "放慢铺满", "把 " + (shot.dur || 0) + " 秒拉成 " + s.dur + " 秒；动作片会变卡"],
    ["hold", "定格到结尾", "播完停在最后一帧；适合字幕卡、价格页"]
  ];
  const fit = FIT.filter((x) => x[0] === fill)[0] || FIT[0];

  const SND = [
    ["mute", "不要原声", "素材的环境音和台词打架，默认关掉"],
    ["low", "留一点环境音", "做背景声，音量压到 20%"],
    ["keep", "保留原声", "素材本身有话要讲时才用"]
  ];

  const backQ = kind === "series"
    ? "D2?c=" + (ctx.c || "cp_1") + "&d=" + (ctx.day || 5)
    : "B2?kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : "");
  const applyQ = kind === "series"
    ? backQ + "&seg=" + s.id + "&fit=" + fill
    : backQ + "&seg=" + s.id;

  const card = (o) =>
    `<span class="optb ${o.on ? "on" : ""}" data-set="B2.5.${o.k}=${o.id}">${o.tx}</span>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backQ}" data-label="返回脚本框">‹</span>
      <div class="ttl">调整这段画面<small>第 ${s.idx + 1} 段 · ${s.name}</small></div>
    </div>

    <div class="body">
      <div style="display:flex;justify-content:center">
        <div style="flex:0 0 auto;width:124px;height:220px;position:relative;border-radius:14px;
          overflow:hidden;background:${shot.bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)"}">
          <div style="position:absolute;left:7px;top:8px;font-size:9px;color:rgba(255,255,255,.85)">${shot.label || "待补画面"}</div>
          <div style="position:absolute;left:0;right:0;bottom:0;padding:7px 8px;
            background:linear-gradient(0deg,rgba(0,0,0,.58),transparent);color:#fff;font-size:9px;line-height:1.5">
            ${s.vo || "（这段台词还没生成）"}</div>
        </div>
      </div>

      <div class="card plain" style="margin-top:12px;border:1.5px dashed #C9D2E6;background:#F7F9FD">
        <div class="xs" style="line-height:1.65;color:var(--text-2)">
          <b style="color:var(--text)">这段画面 ${shot.dur || 0} 秒，台词 ${s.dur} 秒。</b>
          差 ${Math.max(0, s.dur - (shot.dur || 0))} 秒，得决定这 ${Math.max(0, s.dur - (shot.dur || 0))} 秒怎么办。
        </div>
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">怎么铺满</span></div>
      <div class="optr" style="margin:0 2px">${FIT.map(([k, tx]) =>
        card({ k: "fill", id: k, tx, on: fill === k })).join("")}</div>
      <div class="note" style="margin:8px 2px 0">${fit[2]}</div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">从哪开始</span>
        <span class="more" style="font-variant-numeric:tabular-nums"><b id="rd-start">${start.toFixed(1)}s</b> / ${shot.dur || 0}s</span></div>
      <div class="card" style="padding:14px">
        <input type="range" min="0" max="${shot.dur || 3}" step="0.5" value="${start}"
               data-bind="B2.5.start" data-range-out="#rd-start"
               style="width:100%;accent-color:var(--brand)">
        <div class="row" style="margin-top:4px;font-size:10px;color:var(--text-4)">
          <span>开头</span><span style="margin-left:auto">结尾</span>
        </div>
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">要不要原声</span></div>
      <div class="optr" style="margin:0 2px">${SND.map(([k, tx]) =>
        card({ k: "snd", id: k, tx, on: snd === k })).join("")}</div>

      <div class="xs" style="margin:14px 2px 0;line-height:1.65;color:var(--text-3)">
        只想换一条素材就不用调这些——回脚本框点「替换」，那儿是另一个动作。
      </div>
    </div>

    <div class="actionbar">
      <div class="btn" data-go="${applyQ}" data-label="应用到这一段">应用到第 ${s.idx + 1} 段</div>
    </div>
  </div>`;
};
