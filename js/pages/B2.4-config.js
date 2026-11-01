window.PAGES["B2.4"].prd = "PRD §6.14 · 选模板与声音（模板货架 + 音色）";

/* 模板选择做成了"货架"：横向滑的大卡，一张卡就是这条片子出来长什么样。
   为什么不做成 6 个文字卡：团长选模板靠"看着像不像我要的效果"，
   不是读"每 1.5 秒切一次"这种描述。卡上直接排大标题 + 小字，眼睛一扫就知道什么味儿。

   声音放在下面——先定"长什么样"，再定"谁在说"。顺序不能反：
   模板决定节奏，节奏决定配音该多快。 */
window.PAGES["B2.4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const from = ctx.from === "D2" ? "D2" : "B2";
  const kind = ctx.kind === "remix" ? "remix" : "script";
  const tplId = ctx.tpl || "tp_fast";
  const vid = ctx.voice || "v_f1";
  const tab = ctx.tab || "hot";
  const v = D.voice(vid);
  const list = D.templates().filter((t) => t.cat === tab);
  const tpl = D.template(tplId);

  const isSeries = from === "D2";
  const d = isSeries
    ? D.draft("series", { day: ctx.d || 5 })
    : D.draft(kind, { doc: ctx.doc, src: ctx.src, day: ctx.day });
  const plan = isSeries ? D.dayPlan(D.campaign(ctx.c), ctx.d || 5) : null;
  const summary = isSeries
    ? d.series.name + " · Day " + (ctx.d || 5) + " · " + (plan ? plan.topic : "")
    : d.title;

  /* "我的"排第一：收藏过的模板是复用率最高的，空着也要给个位置 */
  const TABS = [["mine", "我的"], ["hot", "热门"], ["bi", "双语"], ["new", "最新"], ["sale", "双 11"], ["diary", "视频日记"]];

  const backGo = isSeries
    ? "D2?c=" + (ctx.c || "cp_1") + "&d=" + (ctx.d || 5)
    : "B2?kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : "");
  const genGo = "B3?from=" + from
    + (isSeries ? "&c=" + (ctx.c || "cp_1") + "&d=" + (ctx.d || 5)
      : "&kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : ""))
    + "&tpl=" + tplId + "&voice=" + vid;

  /* 一张模板卡 = 这条片子出来长什么样 */
  const card = (t) => `<div class="tcard${t.id === tplId ? " sel" : ""}" data-set="B2.4.tpl=${t.id}">
      <div class="tc" style="background:linear-gradient(150deg,${t.c1},${t.c2})">
        <span class="tt">${t.tag}</span>
        <div class="tx"><b>${t.big}</b><span>${t.sub}</span></div>
        ${t.id === tplId ? `<span class="tk">✓</span>` : ""}
      </div>
      <div class="tn">${t.name}</div>
      <div class="tr">${t.rate}</div>
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

    <div class="body" style="padding:0 0 26px">
      <div style="padding:0 16px">
        <div class="card" style="padding:11px 13px;display:flex;align-items:center;gap:10px">
          <div style="width:26px;height:44px;border-radius:6px;flex:0 0 26px;background:linear-gradient(150deg,${tpl.c1},${tpl.c2})"></div>
          <div style="flex:1;min-width:0">
            <div class="h3" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${summary}</div>
            <div class="xs" style="margin-top:2px">${d.segCount} 个 part · ${d.durTotal} 秒 · ${tpl.name} · ${v.name}</div>
          </div>
        </div>
      </div>

      <div class="tshelf">
        <div class="ttabs">
          ${TABS.map(([k, tx]) => `<span class="t1${tab === k ? " on" : ""}" data-set="B2.4.tab=${k}">${tx}</span>`).join("")}
        </div>
        <div class="trow">
          ${list.length ? list.map(card).join("") : `<div class="xs" style="padding:18px 4px;line-height:1.7">${tab === "mine" ? "还没有收藏的模板<br>用着顺手的点一下右上角收藏，下次就在这里" : "这个分类还没有模板"}</div>`}
        </div>
      </div>

      <div style="padding:0 16px">
        <div class="card plain" style="margin-top:2px">
          <div class="xs" style="line-height:1.7">
            <b style="color:var(--text)">${tpl.name}</b> · ${tpl.desc}<br>
            ${tpl.bits.join(" · ")}
          </div>
        </div>

        ${C.sec("谁在说")}
        <div class="card" style="padding:2px 16px 6px">
          ${D.voices().map(voiceRow).join("")}
        </div>
        <div class="card plain" style="margin-top:10px">
          <div class="xs" style="line-height:1.7">${v.k === "self"
            ? "用自己的声音，观众听到的是真人，信任最高；需要你按分段念一遍，大约 3 分钟。"
            : "AI 配音不用出声，改台词直接重配；但声音不是你本人，老客听得出差别。"}</div>
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-go="${genGo}" data-label="生成">✦ 生成 · ${tpl.name}</div>
    </div>
  </div>`;
};
