window.PAGES["B2.4"].prd = "PRD §6.14 · 生成设置（网感模板 + 声音）";

/* 生成前必须定两件事，它们决定成片长什么样：
   ① 模板——节奏多快、字幕什么样式、怎么转场。这是"网感"的来源，
      用户自己调不出来，只能选；所以内置六款，按真实投放效果排序。
   ② 声音——用我的原音，还是 AI 配音。选 AI 就要挑音色（人设不同选的也不同）。

   为什么不在脚本框里做：脚本框只该管"说什么"，这里管"怎么说"。
   两件事混在一页，用户会以为改台词就得重选模板。 */
window.PAGES["B2.4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const from = ctx.from === "D2" ? "D2" : "B2";
  const kind = ctx.kind === "remix" ? "remix" : "script";
  const tpl = ctx.tpl || "tp_fast";
  const vid = ctx.voice || "v_f1";
  const v = D.voice(vid);

  /* 两种来路，摘要不同 */
  const isSeries = from === "D2";
  const d = isSeries
    ? D.draft("series", { day: ctx.d || 5 })
    : D.draft(kind, { doc: ctx.doc, src: ctx.src, day: ctx.day });
  const plan = isSeries ? D.dayPlan(D.campaign(ctx.c), ctx.d || 5) : null;
  const summary = isSeries
    ? d.series.name + " · Day " + (ctx.d || 5) + " · " + (plan ? plan.topic : "")
    : d.title;
  const digits = d.segCount + " 个 part · " + d.durTotal + " 秒";

  const backGo = isSeries
    ? "D2?c=" + (ctx.c || "cp_1") + "&d=" + (ctx.d || 5)
    : "B2?kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : "");
  /* 把"从哪来"一路带下去：生成页要能原路返回到这一步，这一步再原路返回脚本框 */
  const genGo = "B3?from=" + from
    + (isSeries ? "&c=" + (ctx.c || "cp_1") + "&d=" + (ctx.d || 5)
      : "&kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : ""))
    + "&tpl=" + tpl + "&voice=" + vid;

  const tplCard = (t) => `<div class="tpl${t.id === tpl ? " sel" : ""}" style="background:linear-gradient(150deg,${t.c1},${t.c2})"
      data-set="B2.4.tpl=${t.id}">
      <span class="tg">${t.tag}</span>
      <span class="rt">${t.rate}</span>
      <b>${t.name}</b>
      <span>${t.desc}</span>
    </div>`;

  const voiceRow = (x) => `<div class="vrow${x.id === vid ? " on" : ""}" data-set="B2.4.voice=${x.id}">
      <span class="rd"></span>
      <span class="vw">
        <b>${x.name}${x.tag ? ` <span class="tag b" style="margin-left:4px">${x.tag}</span>` : ""}</b>
        <i>${x.sub}</i>
      </span>
      ${x.k === "ai" ? `<span class="vact">▶ 试听</span>` : `<span class="vact" style="color:var(--text-3)">要录</span>`}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "选模板与声音", sub: "第 2 步 · 定完就生成", back: backGo })}

    <div class="body">
      <div class="card" style="padding:12px 14px;display:flex;align-items:center;gap:11px">
        <div style="width:34px;height:56px;border-radius:8px;background:linear-gradient(150deg,${D.template(tpl).c1},${D.template(tpl).c2});flex:0 0 34px"></div>
        <div style="flex:1;min-width:0">
          <div class="h3" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${summary}</div>
          <div class="xs" style="margin-top:3px">${digits} · ${D.template(tpl).name} · ${v.name}</div>
        </div>
      </div>

      ${C.sec("选个模板", "内置 6 款")}
      <div class="g2" style="gap:9px">${D.templates().map(tplCard).join("")}</div>

      <div class="card plain" style="margin-top:11px">
        <div class="xs" style="line-height:1.7">
          模板决定<b style="color:var(--text)">节奏和字幕</b>：多久切一次、字多大、怎么转场。
          选完不用再调字幕——这就是"网感"的来源。
        </div>
      </div>

      ${C.sec("谁在说")}
      <div class="card" style="padding:2px 16px 6px">
        ${D.voices().map(voiceRow).join("")}
      </div>
      <div class="card plain" style="margin-top:10px">
        <div class="xs" style="line-height:1.7">
          ${v.k === "self"
            ? "用自己的声音，观众听到的是真人，信任最高；需要你按分段念一遍，大约 3 分钟。"
            : "AI 配音不用出声，改台词直接重配；但声音不是你本人，老客听得出差别。"}
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-go="${genGo}" data-label="生成">✦ 生成 · 约 40 秒</div>
    </div>
  </div>`;
};
