window.PAGES["B2"].states = [
  { k: "browse", n: "默认：整条脚本按 part 铺开，每段自己带预览键与编辑入口" },
  { k: "fix", n: "修缺口：只留没配好画面的 part" }
];
window.PAGES["B2"].prd = "PRD §6 · 结构化脚本框（全产品唯一的脚本编辑面）";

/* 结构化脚本框：不管脚本从哪来，落到这一页都是同一个结构——
   **N 个 part，每个 part = 一个画面槽 + 一段台词**。

   这一版的三条改动：
   ① 不再有全局"编辑"开关。每段自己带「改」和「▶」——想改哪段改哪段，
      想预览哪段预览哪段，不用先进入一个模式。
   ② 画面槽放大到 78×106，正中一个白色 ▶。预览不再是标题行那个小三角，
      而是槽上最显眼的按钮；点了弹出竖屏播放器，看这一段的词和画。
   ③ AI 写完的脚本**画面是空的**，每段一个大 ＋「添加素材」；
      顶上给一条"一键配齐"，AI 按台词语义一次铺满，不想逐个挑就用它。 */
window.PAGES["B2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const kind = ctx.kind === "remix" ? "remix" : "script";
  const mode = ctx.mode === "fix" ? "fix" : "browse";
  const src = ctx.src || "";
  const editId = ctx.edit || "";
  const d = D.draft(kind, {
    doc: ctx.doc, day: ctx.day, src: src,
    fill: ctx.only ? false : true,
    autoFill: ctx.auto === "1",
    pick: (ctx.seg && ctx.asset) ? { seg: ctx.seg, asset: ctx.asset } : null
  });
  const miss = d.missSegs[0];
  const byId = (id) => d.segments.filter((s) => s.id === id)[0];
  const focus = byId(ctx.seg) || (mode === "fix" && miss ? miss : d.cur);
  const playing = ctx.pv || "";
  const paused = ctx.pause === "1";
  const pvSeg = playing ? byId(playing) : null;

  /* 每个槽都带着"这一段 + 从哪来"，否则换完就掉回默认草稿 */
  const pickGo = (id) => "B2.1?seg=" + id + "&kind=" + kind + (src ? "&src=" + src : "")
    + (ctx.doc ? "&doc=" + ctx.doc : "");
  const cfgQ = "?from=B2&kind=" + kind + (src ? "&src=" + src : "") + (ctx.doc ? "&doc=" + ctx.doc : "");

  /* 来源只说一句话，数字交给下面的小标题 */
  const srcLine = (function () {
    if (kind === "remix")
      return ctx.local
        ? "本地视频「IMG_2043.MOV」· 52 秒 · " + (+ctx.sec > 0 ? "每 " + ctx.sec + " 秒切一段" : "AI 自动分段")
        : "二创自 " + d.source.who + "「" + d.source.title + "」· " + D.plays(d.source.plays) + " 播放";
    if (src === "import" && ctx.doc) {
      const sc = D.script(ctx.doc);
      return "来自脚本库 ·「" + sc.title + "」· " + sc.who;
    }
    if (src === "import") return "已粘贴脚本 · 画面待确认";
    if (src === "struct") return "只借了结构 · 台词按你的话重写";
    if (src === "extract") return "来自抽取的视频文案 · 已清 " + D.extract().cleanedN + " 处原作者痕迹";
    if (src === "ai") return "AI 刚写完 · " + d.product + " · 台词可逐段改";
    return d.product + " · 素材库 " + window.DATA.assets.length + " 段";
  })();

  function partHtml(s) {
    const isFocus = s.id === focus.id;
    const editable = s.lock !== "brand";
    const okShot = s.shots.filter((x) => !x.miss)[0];
    const badShot = s.shots.filter((x) => x.miss)[0];
    const hasPip = s.shots.some((x) => x.pip) || ctx.pip === s.id;
    /* 用户改了哪一段就存在哪一段上；没改过就用草稿里的原文 */
    const typed = ctx["vo_" + s.id];
    const voText = typed != null ? typed : s.vo;

    const slot = badShot
      ? { miss: true, label: "缺" + badShot.label, go: pickGo(s.id) }
      : okShot
        ? { label: okShot.label, bg: okShot.bg, pvAct: "B2.pv=" + s.id + "&B2.pause=", swGo: pickGo(s.id) }
        : { empty: true, label: "添加素材", go: pickGo(s.id) };

    const tags = [].concat(
      s.fixed ? [["", "固定"]] : [],
      s.lock === "brand" ? [["", "品牌锁定"]] : [],
      s.suggest ? [[s.suggest === "务必改" ? "r" : "o", s.suggest]] : [],
      /* 「画中画」是剪辑软件的叫法，团长听不懂。说人话：这段画面上还压着一个小窗。 */
      hasPip ? [["p", "▣ 带小窗", "B2.3"]] : []
    );

    const p = { no: s.no, name: s.name, dur: s.dur + "s", tags, slot, on: isFocus && editId === s.id };
    if (s.orig) p.orig = s.orig;

    if (editId === s.id && editable) {
      p.bindKey = "B2.vo_" + s.id;
      p.editbox = ctx.vo === "ai" && s.voAlt ? s.voAlt : voText;
      p.editOps = [
        ["hot", "✦ 换个说法", "B2.vo=ai&B2.edit=" + s.id],
        ["go", "✓ 用这版", "B2.vo=self&B2.edit="]
      ];
    } else if (voText) {
      p.vo = voText;
      p.voEditAct = editable ? "B2.edit=" + s.id + "&B2.vo=self" : "";
    } else {
      p.pending = true;
    }
    /* 槽是空的时候不再补一句"还没配画面"——槽上已经写着"＋ 添加素材"了，
       五段各来一句只会变成噪声。 */
    p.meta = (badShot || !okShot) ? "" : D.slotMeta(s);
    if (editId === s.id && !editable) p.note = "品牌方锁定的必播口播，台词不可改，只能调顺序";
    return C.part(p);
  }

  const body = d.segments
    .filter((s) => (mode === "fix" ? (s.missN > 0 || !s.shots.length) : true))
    .map(partHtml).join("");

  const blocker = mode === "fix" && miss
    ? `<div class="blk"><span class="ic">!</span><span><b>发布卡在第 ${miss.idx + 1} 段</b> · 缺 ${miss.missN} 段画面，补齐才能发布；先出预览不受影响</span></div>`
    : "";

  /* 没配画面的辅助条：一句话说清"AI 能帮你配"，一个按钮点完。
     这是"怎么帮用户把内容填进去"的答案——不是逐段找素材，而是给他一次搞定。 */
  const assist = (mode !== "fix" && d.emptyCount > 0)
    ? `<div class="assist">
        <div class="at"><b>${d.emptyCount} 个 part 还没配画面</b>
          <span>可以每段自己挑，也可以让 AI 按台词一次配齐，再逐段换</span></div>
        <span class="abtn" data-set="B2.auto=1">✦ 一键配齐</span>
      </div>`
    : "";

  const head = `<div class="listhead"><b>脚本</b>${d.segCount} 个 part · 约 ${d.durTotal} 秒 ·
      ${kind === "remix"
        ? `<span style="color:var(--warn);font-weight:700">安全度 ${d.safety}</span>`
        : `<span style="color:var(--success);font-weight:700">合规 ✓</span>`}
      <span style="flex:1"></span>${d.missCount
        ? `<span class="tag r">缺 ${d.missCount} 段</span>`
        : d.emptyCount ? `<span class="tag o">${d.emptyCount} 段没配</span>`
        : `<span class="tag g">可以发</span>`}</div>`;

  const primary = (function () {
    if (mode === "fix" && miss) return { t: "✦ 补上第 " + (miss.idx + 1) + " 段", go: pickGo(miss.id) };
    if (kind === "remix") return { t: "下一步 · 查安全度", go: "C3" };
    return { t: "下一步 · 选模板与声音", go: "B2.4" + cfgQ, cls: "ai" };
  })();

  const backGo = kind === "remix" ? (ctx.local ? "C1?for=remix" : "C1.2")
    : src === "import" || src === "struct" ? "B1.2"
    : src === "extract" ? "C1.2"
    : "B1";

  const pvShot = pvSeg ? (pvSeg.shots.filter((x) => !x.miss)[0] || {}) : {};
  const player = pvSeg ? C.player({
    no: pvSeg.idx + 1, name: pvSeg.name, dur: pvSeg.dur,
    bg: pvShot.bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
    label: pvShot.label || "待补画面",
    pip: (pvSeg.shots.some((x) => x.pip) || ctx.pip === pvSeg.id) ? "小窗" : "",
    cap: ctx["vo_" + pvSeg.id] != null ? ctx["vo_" + pvSeg.id] : pvSeg.vo,
    closeAct: "B2.pv=&B2.pause=",
    pauseAct: paused ? "B2.pause=" : "B2.pause=1",
    paused: paused
  }) : "";

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backGo}" data-label="返回来路">‹</span>
      <div class="ttl">${kind === "remix" && ctx.local ? "本地视频 · 二创" : d.title}
        <small>${mode === "fix" ? "缺 " + d.needCount + " 段画面 · 补齐才能发布" : srcLine}</small></div>
    </div>

    ${blocker}
    ${head}
    ${assist}

    <div class="body" style="padding:12px 16px 24px">
      ${body}
    </div>

    <div class="actionbar">
      <div class="btn ${primary.cls || ""}" data-go="${primary.go}" data-label="${primary.t}">${primary.t}</div>
    </div>

    ${player}
  </div>`;
};
