window.PAGES["B2"].states = [
  { k: "browse", n: "浏览态：整条脚本按 part 铺开，一个 part 一段话 + 一个画面槽" },
  { k: "edit", n: "编辑态：只当前 part 就地改台词，改完即时重配音" },
  { k: "fix", n: "修缺口：只留没配画面的 part，出路摊开" }
];
window.PAGES["B2"].prd = "PRD §6 · 结构化脚本框（全产品唯一的脚本编辑面）";

/* 结构化脚本框：不管脚本从哪来（AI 写 / 脚本库引 / 视频抽 / 二创），
   落到这一页都是同一个结构——**N 个 part，每个 part = 一段台词 + 一个画面槽**。
   所以页面里没有"来源切换器"：来源只影响顶部那一行说明，不影响结构。
   系列不走这里，它有自己的 D2（结构是「按天 + 模板」，不是单条）。 */
window.PAGES["B2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const kind = ctx.kind === "remix" ? "remix" : "script";
  const mode = ctx.mode || "browse";
  const voVer = ctx.vo || "self";
  const src = ctx.src || "";
  const d = D.draft(kind, {
    doc: ctx.doc, day: ctx.day, src: src,
    pick: (ctx.seg && ctx.asset) ? { seg: ctx.seg, asset: ctx.asset } : null
  });
  const miss = d.missSegs[0];
  const byId = (id) => d.segments.filter((s) => s.id === id)[0];
  const focus = byId(ctx.seg) || (mode === "fix" && miss ? miss : d.cur);

  /* 每个槽都带着"这一段 + 从哪来"，否则换完就掉回默认草稿 */
  const pickGo = (id) => "B2.1?seg=" + id + "&kind=" + kind + "&src=" + src
    + (ctx.doc ? "&doc=" + ctx.doc : "");

  /* 来源上下文：一行说清"这条从哪来"。六种来路各有各的一句。 */
  const ctxLine = (function () {
    if (kind === "remix")
      return "来源：" + d.source.who + "「" + d.source.title + "」· " + D.plays(d.source.plays) + " 播放 · 建议改 " + d.needChange + " 段";
    if (src === "import" && ctx.doc) {
      const sc = D.script(ctx.doc);
      return "来自脚本库 ·「" + sc.title + "」· " + sc.who + " · " + sc.segs + " 段 · 画面已按语义配好";
    }
    if (src === "import") return "已粘贴脚本 · 自动拆成 " + d.segCount + " 段 · 画面待确认";
    if (src === "struct") return "只借了结构 · 台词按你的话重写 · 画面重新配";
    if (src === "extract") {
      const x = D.extract();
      return "来自抽取的视频文案 · 已清掉 " + x.cleanedN + " 处原作者痕迹 · 画面全新配";
    }
    if (src === "ai") return "AI 刚写完 · " + d.product + " · " + d.segCount + " 段 " + d.durTotal + " 秒 · 台词可逐段改";
    return "商品：" + d.product + " · 素材库 " + window.DATA.assets.length + " 段 · 已配 " + (d.segCount - d.missSegs.length) + "/" + d.segCount + " 段";
  })();

  /* 预览条纹：只给"当前在哪一段、一共多长"，真正的编辑在下面的 part 里 */
  const first = focus.shots.filter((s) => !s.miss)[0] || focus.shots[0] || {};
  const estage = C.estage({
    preview: {
      bg: first.bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
      no: focus.idx + 1 + "/" + d.segCount,
      cap: (focus.vo || focus.name).slice(0, 12),
      pip: focus.shots.some((s) => s.pip)
    },
    code: focus.code,
    track: d.track.map(([f], i) => [f, i === focus.idx ? "cur" : (i < focus.idx ? "done" : "")]),
    paused: mode !== "browse",
    now: mode === "edit"
      ? "<b>试听中 · 第 " + (focus.idx + 1) + " 段（AI 配音）</b> · 改完即时重配"
      : "<b>第 " + (focus.idx + 1) + " 段 · " + focus.name + "</b><br>" +
        (kind === "remix" && focus.suggest ? "建议" + focus.suggest + "：这段带着原作者的痕迹" : D.slotMeta(focus))
  });

  /* 一个 part = 一段台词 + 一个画面槽。点槽就开素材选择器。 */
  function partHtml(s) {
    const isFocus = s.id === focus.id;
    const editable = s.lock !== "brand";
    const okShot = s.shots.filter((x) => !x.miss)[0];
    const badShot = s.shots.filter((x) => x.miss)[0];
    const slot = badShot
      ? { miss: true, label: badShot.label || "缺画面", go: pickGo(s.id) }
      : okShot
        ? { label: okShot.label, bg: okShot.bg, go: pickGo(s.id) }
        : { empty: true, label: "加画面", go: pickGo(s.id) };

    const tags = [].concat(
      s.fixed ? [["", "固定"]] : [],
      s.lock === "brand" ? [["", "品牌锁定"]] : [],
      s.suggest ? [[s.suggest === "务必改" ? "r" : "o", s.suggest]] : [],
      s.shots.some((x) => x.pip) ? [["p", "画中画"]] : []
    );

    const p = { no: s.no, name: s.name, dur: s.dur + "s", tags, slot, on: isFocus && mode === "edit" };
    if (s.orig) p.orig = s.orig;

    if (mode === "edit" && isFocus && editable) {
      p.editbox = voVer === "ai" && s.voAlt ? s.voAlt : s.vo;
      p.editOps = voVer === "ai"
        ? [["", "用回原话", "B2.vo=self"], ["go", "✓ 用这版", "B2.mode=browse"]]
        : [["hot", "✦ AI 帮我写", "B2.vo=ai"], ["go", "完成", "B2.mode=browse"]];
    } else if (s.vo) {
      p.vo = s.vo;
      p.edit = editable;
      if (editable) p.editSet = "B2.mode=edit&B2.seg=" + s.id;
    }
    p.meta = D.slotMeta(s);
    if (mode === "edit" && isFocus && !editable) p.note = "品牌方锁定的必播口播，台词不可改，只能调顺序";

    if (s.missN) {
      p.ops = D.resolveFix(s).filter((o) => o.ok).slice(0, 3)
        .map((o) => ({ t: o.tx, go: o.go, cls: o.key === "aigen" ? "hot" : "" }));
    } else if (isFocus && mode !== "edit" && s.vo) {
      p.ops = [{ t: "✦ AI 重写这段", cls: "hot" }, { t: "▶ 试听" }, { t: "＋ 画中画", go: "B2.3" }];
    }
    return C.part(p);
  }

  /* 编辑态下不动的 part 折成一行：一次只改一段，其余别挡路 */
  const body = d.segments
    .filter((s) => (mode === "fix" ? s.missN > 0 : true))
    .map((s) => (mode === "edit" && s.id !== focus.id
      ? C.fold({
          no: s.no,
          tag: s.fixed ? ["", "固定"] : (s.lock === "brand" ? ["", "品牌锁定"] : null),
          text: s.name + " · " + s.dur + "s · " + (s.vo ? "台词已就绪" : "台词待生成"),
          cover: (s.shots.filter((x) => !x.miss)[0] || {}).bg,
          set: "B2.mode=edit&B2.seg=" + s.id
        })
      : partHtml(s))).join("");

  const blocker = mode === "fix" && miss
    ? `<div class="blk"><span class="ic">!</span><span><b>发布卡在第 ${miss.idx + 1} 段</b> · 缺 ${miss.missN} 段画面，补齐才能发布；先出预览不受影响</span></div>`
    : "";

  const head = `<div class="listhead"><b>脚本</b>${d.segCount} 个 part · 约 ${d.durTotal} 秒
      ${kind === "remix" ? `· <span style="color:var(--warn);font-weight:700">安全度 ${d.safety}</span>` : `· <span style="color:var(--success);font-weight:700">合规 ${d.compliance.ok ? "✓" : "!"}</span>`}
      <span style="flex:1"></span>${d.missCount ? `<span class="tag r">缺 ${d.missCount} 段画面</span>` : ""}</div>`;

  const hint = mode === "browse"
    ? `<div class="hintline"><span class="hic">✦</span><span>${
        kind === "remix"
          ? "<b>和原片不一样的段已标出来</b>，其余可以直接照用"
          : "<b>每个 part 一个画面槽</b>，点槽换素材，AI 已按台词语义铺好"}</span><span class="r2">全部重配</span></div>`
    : mode === "edit"
      ? `<div class="hintline"><span class="hic">✦</span><span><b>改台词不会动画面</b>，改完直接重新配音，不用重新生成</span><span class="r2">重配 3 秒</span></div>`
      : "";

  const primary = (function () {
    if (mode === "fix" && miss) return { t: "✦ 补上第 " + (miss.idx + 1) + " 段", go: pickGo(miss.id) };
    if (kind === "remix") return { t: "下一步 · 查安全度", go: "C3" };
    return { t: d.canPublish ? "① 生成 · 混剪" : "① 生成 · 先看预览", go: "B3", cls: "ai" };
  })();

  const bar = `<div class="actionbar">
    <div class="etools">
      <div class="eto" data-set="B2.mode=edit&B2.seg=${focus.id}"><span style="font-size:13px">♪</span><b>声音</b></div>
      <div class="eto" data-set="B2.mode=edit&B2.seg=${focus.id}"><span style="font-size:13px">♫</span><b>音乐</b></div>
      <div class="eto" data-set="B2.mode=edit&B2.seg=${focus.id}"><span style="font-size:13px">▭</span><b>字幕</b></div>
    </div>
    <div class="btn ${primary.cls || ""}" data-go="${primary.go}" data-label="${primary.t}">${primary.t}</div>
  </div>`;

  /* 返回回到来路：走哪条路来的就回哪，不能回错地方 */
  const backGo = kind === "remix" ? "C1.2"
    : src === "import" || src === "struct" ? "B1.2"
    : src === "extract" ? "C1.2"
    : "B1";

  const sub = mode === "edit"
    ? "正在改第 " + (focus.idx + 1) + " 段台词" + (voVer === "ai" ? " · AI 建议版" : "")
    : mode === "fix"
      ? "缺 " + d.missCount + " 段画面 · 补齐才能发布"
      : kind === "remix" ? "已改 " + d.changed + "/" + d.segCount + " 段 · 安全度 " + d.safety
      : d.segCount + " 个 part · " + d.durTotal + " 秒 · 每个 part 一个画面槽";

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backGo}" data-label="返回来路">‹</span>
      <div class="ttl">${d.title}<small>${sub}</small></div>
      <span class="act" data-set="B2.mode=${mode === "browse" ? "edit" : "browse"}&B2.vo=self">${mode === "browse" ? "编辑" : "完成"}</span>
    </div>

    <div class="ctxline">${ctxLine}</div>

    ${estage}
    ${blocker}
    ${hint}
    ${head}

    ${mode === "browse" ? `<div class="fade" style="bottom:74px"></div>` : ""}
    <div class="body" style="padding:${mode === "browse" ? "0 16px 24px" : "10px 16px 24px"}">
      ${body}
    </div>

    ${bar}
  </div>`;
};
