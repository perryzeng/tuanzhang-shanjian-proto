window.PAGES["B2"].states = [
  { k: "browse", n: "浏览态：整段扫读，操作行只出现在当前段" },
  { k: "edit", n: "编辑态：台词就地改，不用改的段自动折叠" },
  { k: "fix", n: "修缺口：只留缺素材的段，出路摊开" }
];
window.PAGES["B2"].prd = "PRD §6 · 统一发布器（三个来源合并 / 段落模型）";

/* 统一发布器：脚本混剪 / 剪同款 / 系列 三种来源，共用一个预览 + 一套段落编辑器。
   切来源只换数据（DATA.draftRemix 等），不换页面、不换布局 —— 所见即所得。
   页面里不出现任何写死的段名、秒数、素材名。 */
window.PAGES["B2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const kind = ctx.kind || "script";
  const mode = ctx.mode || "browse";
  const voVer = ctx.vo || "self";
  const d = D.draft(kind);
  const miss = d.missSegs[0];
  const byId = (id) => d.segments.filter((s) => s.id === id)[0];
  const focus = byId(ctx.seg) || (mode === "fix" && miss ? miss : d.cur);

  /* 预览区第二行 */
  function shotLine(s) {
    const okShots = s.shots.filter((x) => !x.miss);
    const bad = s.shots.filter((x) => x.miss);
    if (bad.length) return "画面：缺 " + bad.length + " 段（" + bad.map((x) => x.label).join("、") + "）";
    return "画面：" + s.shotTotal + "s · " + okShots.map((x) => x.label).join(" + ");
  }

  /* 来源上下文：一行说清"这条从哪来" */
  const ctxLine = kind === "remix"
    ? "来源：" + d.source.who + "「" + d.source.title + "」· " + D.plays(d.source.plays) + " 播放 · 已改 " + d.changed + "/" + d.segCount + " 段"
    : kind === "series"
      ? d.series.name + " · Day " + d.series.day + "/" + d.series.total + " · 今天主题：" + d.series.topic
      : "商品：" + d.product + " · 素材库 " + window.DATA.assets.length + " 段 · 已配 " + (d.segCount - d.missSegs.length) + "/" + d.segCount + " 段";

  const dayBar = kind === "series"
    ? `<div class="dbar">${Array.from({ length: d.series.total }, (_, i) => {
        const n = i + 1;
        return `<i class="${n < d.series.day ? "done" : n === d.series.day ? "now" : ""}"></i>`;
      }).join("")}</div>`
    : "";

  const first = focus.shots.filter((s) => !s.miss)[0] || focus.shots[0] || {};
  const estage = C.estage({
    preview: {
      bg: first.bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
      no: focus.idx + 1 + "/" + d.segCount,
      cap: focus.vo.slice(0, 12),
      pip: focus.shots.some((s) => s.pip)
    },
    code: focus.code,
    track: d.track.map(([f], i) => [f, i === focus.idx ? "cur" : (i < focus.idx ? "done" : "")]),
    paused: mode !== "browse",
    now: mode === "edit"
      ? "<b>试听中 · 第 " + (focus.idx + 1) + " 段（AI 配音）</b> · 改完即时重配"
      : kind === "remix"
        ? "<b>第 " + (focus.idx + 1) + " 段 · " + focus.name + "</b><br>" +
          (focus.suggest ? "建议" + focus.suggest + "：这段带着原作者的痕迹" : shotLine(focus))
        : "<b>第 " + (focus.idx + 1) + " 段 · " + focus.name + "</b><br>" + shotLine(focus)
  });

  /* 哪些段展开：不同来源的"默认关注点"不一样 */
  const expand = (s) => {
    if (mode === "edit") return s.id === focus.id;
    if (mode === "fix") return s.missN > 0;
    if (kind === "remix") return !!s.suggest || s.id === focus.id || s.missN > 0;
    if (kind === "series") return s.id === focus.id;
    return true;
  };

  function segHtml(s) {
    const isFocus = s.id === focus.id;
    const editable = s.lock !== "brand";
    const p = { no: s.no, name: s.name, dur: s.dur + "s", tags: s.tags };
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
    if (mode === "edit" && isFocus && !editable) p.note = "品牌方锁定的必播口播，台词不可改，只能调顺序";

    p.clips = s.shots
      .map((x) => x.miss
        ? { add: true, need: true, label: "缺" + x.label, go: "B2.1?seg=" + s.id + "&kind=" + kind }
        : { bg: x.bg, label: x.label, pip: x.pip })
      .concat([{ add: true, label: "＋", go: "B2.1?seg=" + s.id + "&kind=" + kind }]);

    if (s.missN) {
      p.ops = D.resolveFix(s).filter((o) => o.ok).slice(0, 3)
        .map((o) => ({ t: o.tx, go: o.go, cls: o.key === "aigen" ? "hot" : "" }));
    } else if ((isFocus || (kind === "remix" && s.suggest)) && mode !== "edit") {
      p.ops = kind === "remix"
        ? [{ t: "✦ 按我的语气重写", cls: "hot" }, { t: "换片段", go: "B2.1?seg=" + s.id + "&kind=" + kind }]
        : [
            { t: "换片段", go: "B2.1?seg=" + s.id + "&kind=" + kind },
            { t: "＋ 随手拍", cls: "hot", go: "B2.2" },
            { t: "▶ 试听" }
          ];
    }

    p.state = s.missN ? "miss" : (isFocus && mode === "edit" ? "on" : "");
    return C.seg(p);
  }

  function foldHtml(s) {
    const tail = kind === "remix"
      ? (s.suggest ? "还要改" : "和原片一样，先不动")
      : kind === "series" ? "已备好" : (s.missN ? "缺 " + s.missN + " 段画面" : "已配好 " + s.shots.length + " 个画面");
    return C.fold({
      no: s.no,
      tag: s.lock === "brand" ? ["", "品牌锁定"] : (s.missN ? ["r", "缺素材"] : (s.suggest ? [s.suggest === "务必改" ? "r" : "o", s.suggest] : null)),
      text: s.name + " · " + s.dur + "s · " + tail,
      cover: (s.shots.filter((x) => !x.miss)[0] || {}).bg,
      set: "B2.mode=edit&B2.seg=" + s.id
    });
  }

  const body = d.segments.map((s) => (expand(s) ? segHtml(s) : foldHtml(s))).join("");

  const blocker = mode === "fix" && miss
    ? `<div class="blk"><span class="ic">!</span><span><b>发布卡在第 ${miss.idx + 1} 段</b> · 缺 ${miss.missN} 段画面，补齐才能发布；先出预览不受影响</span></div>`
    : "";

  const headLine = {
    script: `<b>分段</b>${d.segCount} 段 · 约 ${d.durTotal} 秒 · <span style="color:var(--success);font-weight:700">合规 ${d.compliance.ok ? "✓" : "!"}</span>`,
    remix: `<b>分段</b>${d.segCount} 段 · ${d.durTotal} 秒 · <span style="color:var(--warn);font-weight:700">安全度 ${d.safety}</span> · 建议改 ${d.needChange} 段`,
    series: `<b>今天这集</b>${d.segCount} 段 · ${d.durTotal} 秒 · 总部已备好素材`
  }[kind];
  const head = mode === "browse"
    ? `<div class="listhead">${headLine}<span style="flex:1"></span>${d.missCount ? `<span class="tag r">缺 ${d.missCount} 段</span>` : ""}</div>`
    : "";

  const hint = mode === "browse"
    ? `<div class="hintline"><span class="hic">✦</span><span>${kind === "remix"
        ? "<b>和原片不一样的段已自动展开</b>，其余先折叠，不用挨个看"
        : "<b>AI 已按段落语义配好画面</b>，出镜处用你的照片画中画"}</span><span class="r2">换一批</span></div>`
    : mode === "edit"
      ? `<div class="hintline"><span class="hic">✦</span><span><b>改台词不会动画面</b>，改完直接重新配音，不用重新生成</span><span class="r2">重配 3 秒</span></div>`
      : "";

  const primary = (function () {
    if (mode === "fix" && miss) return { t: "✦ 补上第 " + (miss.idx + 1) + " 段", go: "B2.1?seg=" + miss.id + "&kind=" + kind };
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

  const sub = mode === "edit"
    ? "正在改第 " + (focus.idx + 1) + " 段台词" + (voVer === "ai" ? " · AI 建议版" : "")
    : mode === "fix"
      ? "缺 " + d.missCount + " 段画面 · 补齐才能发布"
      : kind === "remix" ? "已改 " + d.changed + "/" + d.segCount + " 段 · 安全度 " + d.safety
      : kind === "series" ? "Day " + d.series.day + "/" + d.series.total + " · " + d.series.topic
      : "① 脚本 × 素材 同页改 · 改完直接生成";

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B1" data-label="返回创作中心">‹</span>
      <div class="ttl">发布器 · ${d.title}<small>${sub}</small></div>
      <span class="act" data-set="B2.mode=${mode === "browse" ? "edit" : "browse"}&B2.vo=self">${mode === "browse" ? "编辑" : "完成"}</span>
    </div>

    ${C.pseg(D.KINDS, kind)}
    <div class="ctxline">${ctxLine}${dayBar}</div>

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
