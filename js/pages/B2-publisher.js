window.PAGES["B2"].states = [
  { k: "browse", n: "浏览态：整段扫读，操作行只出现在当前段" },
  { k: "edit", n: "编辑态：台词就地改，不用改的段自动折叠" },
  { k: "fix", n: "修缺口：只留缺素材的段，出路摊开" }
];
window.PAGES["B2"].prd = "PRD §6 · 统一发布器（三个来源合并 / 段落模型）";

/* 统一发布器：脚本混剪 / 剪同款 / 系列 三种来源，共用一个预览 + 一套段落编辑器。
   切来源只换数据（DATA.draftRemix 等），不换页面、不换布局 —— 所见即所得。
   而「从哪来」的差别只体现在一行上下文里：AI 写的 / 脚本库引的 / 视频抽的 / 系列第几天。
   页面里不出现任何写死的段名、秒数、素材名。 */
window.PAGES["B2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const kind = ctx.kind || "script";
  const mode = ctx.mode || "browse";
  const voVer = ctx.vo || "self";
  const src = ctx.src || "";
  const docQ = (src === "import" && ctx.doc) ? "&doc=" + ctx.doc : "";
  const d = D.draft(kind, { doc: ctx.doc, day: ctx.day, src: src });
  const miss = d.missSegs[0];
  const byId = (id) => d.segments.filter((s) => s.id === id)[0];
  const focus = byId(ctx.seg) || (mode === "fix" && miss ? miss : d.cur);

  /* 系列：进来看的是第几天的那一集。今天这集有现成台词，其余的只定了主题 */
  const dayN = kind === "series" ? (+ctx.day || d.series.day) : null;
  const dayDone = !!(kind === "series" && !d.pendDay);
  const dayTopic = kind === "series"
    ? (d.pendDay ? d.pendTopic : (D.seriesDay(dayN) || {}).topic || d.series.topic)
    : "";

  /* 预览区第二行 */
  function shotLine(s) {
    const okShots = s.shots.filter((x) => !x.miss);
    const bad = s.shots.filter((x) => x.miss);
    if (bad.length) return "画面：缺 " + bad.length + " 段（" + bad.map((x) => x.label).join("、") + "）";
    if (!okShots.length) return "画面：还没配";
    return "画面：" + s.shotTotal + "s · " + okShots.map((x) => x.label).join(" + ");
  }

  /* 来源上下文：一行说清"这条从哪来"
     四种来路各有一句，谁进来都能立刻对上自己刚才那步操作 */
  const ctxLine = (function () {
    if (kind === "remix")
      return "来源：" + d.source.who + "「" + d.source.title + "」· " + D.plays(d.source.plays) + " 播放 · 已改 " + d.changed + "/" + d.segCount + " 段";
    if (kind === "series")
      return d.series.name + " · Day " + dayN + "/" + d.series.total + " · " +
        (dayDone ? "今天主题：" + dayTopic : "主题：" + dayTopic + " · 台词待生成");
    if (src === "import" && ctx.doc) {
      const sc = D.script(ctx.doc);
      return "来自脚本库 ·「" + sc.title + "」· " + sc.who + " · " + sc.segs + " 段" +
        (sc.scope === "team" ? " · 自称已换成你的" : sc.scope === "brand" ? " · 含锁定段" : "");
    }
    if (src === "import") return "已粘贴脚本 · 自动拆成 " + d.segCount + " 段 · 画面待确认";
    if (src === "struct") return "只借了结构 · 台词按你的话重写 · 画面重新配";
    if (src === "extract") {
      const x = D.extract();
      return "来自抽取的视频文案 · 已清掉 " + x.cleanedN + " 处原作者痕迹 · 画面全新配";
    }
    if (src === "ai") return "AI 刚写完 · 商品：" + d.product + " · 5 段 46 秒 · 台词可逐段改";
    return "商品：" + d.product + " · 素材库 " + window.DATA.assets.length + " 段 · 已配 " + (d.segCount - d.missSegs.length) + "/" + d.segCount + " 段";
  })();

  const dayBar = kind === "series"
    ? `<div class="dbar">${Array.from({ length: d.series.total }, (_, i) => {
        const n = i + 1;
        return `<i class="${n < dayN ? "done" : n === dayN ? "now" : ""}"></i>`;
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
    /* 还没生成的那一集，整条结构都摊开——这时候要看的恰恰是"都要写什么" */
    if (kind === "series") return d.pendDay ? true : s.id === focus.id;
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
    /* 系列里还没轮到的那一天：结构在，台词还没写 */
    if (!s.vo && !p.editbox && isFocus) p.note = "这段台词还没生成 · 点下面按钮，AI 会按「" + dayTopic + "」写这一段";

    p.clips = s.shots
      .map((x) => x.miss
        ? { add: true, need: true, label: "缺" + x.label, go: "B2.1?seg=" + s.id + "&kind=" + kind + docQ }
        : { bg: x.bg, label: x.label, pip: x.pip })
      .concat([{ add: true, label: "＋", go: "B2.1?seg=" + s.id + "&kind=" + kind + docQ }]);

    if (s.missN) {
      p.ops = D.resolveFix(s).filter((o) => o.ok).slice(0, 3)
        .map((o) => ({ t: o.tx, go: o.go, cls: o.key === "aigen" ? "hot" : "" }));
    } else if ((isFocus || (kind === "remix" && s.suggest)) && mode !== "edit") {
      p.ops = kind === "remix"
        ? [{ t: "✦ 按我的语气重写", cls: "hot" }, { t: "换片段", go: "B2.1?seg=" + s.id + "&kind=" + kind + docQ }]
        : [
            { t: "换片段", go: "B2.1?seg=" + s.id + "&kind=" + kind + docQ },
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
      : kind === "series" ? (d.pendDay ? "结构已定，台词待生成" : "已备好")
      : (s.missN ? "缺 " + s.missN + " 段画面" : "已配好 " + s.shots.length + " 个画面");
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
    series: dayDone
      ? `<b>今天这集</b>${d.segCount} 段 · ${d.durTotal} 秒 · 总部已备好素材`
      : `<b>预排结构</b>${d.segCount} 段 · ${dayTopic} · 台词还没写`
  }[kind];
  const head = mode === "browse"
    ? `<div class="listhead">${headLine}<span style="flex:1"></span>${d.missCount ? `<span class="tag r">缺 ${d.missCount} 段</span>` : ""}</div>`
    : "";

  const hint = mode === "browse"
    ? `<div class="hintline"><span class="hic">✦</span><span>${kind === "remix"
        ? "<b>和原片不一样的段已自动展开</b>，其余先折叠，不用挨个看"
        : kind === "series" && d.pendDay
          ? "<b>这一集还没生成</b>：结构是总部定的，台词由 AI 按「" + dayTopic + "」写"
          : "<b>AI 已按段落语义配好画面</b>，出镜处用你的照片画中画"}</span><span class="r2">${kind === "series" && d.pendDay ? "扣 1 次" : "换一批"}</span></div>`
    : mode === "edit"
      ? `<div class="hintline"><span class="hic">✦</span><span><b>改台词不会动画面</b>，改完直接重新配音，不用重新生成</span><span class="r2">重配 3 秒</span></div>`
      : "";

  const primary = (function () {
    if (mode === "fix" && miss) return { t: "✦ 补上第 " + (miss.idx + 1) + " 段", go: "B2.1?seg=" + miss.id + "&kind=" + kind + docQ };
    if (kind === "remix") return { t: "下一步 · 查安全度", go: "C3" };
    if (kind === "series" && !dayDone) return { t: "✦ 生成这天的话术", go: "B3", cls: "ai" };
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
      : kind === "series" ? "Day " + dayN + "/" + d.series.total + " · " + dayTopic
      : src === "import" || src === "extract" || src === "struct" || src === "ai"
        ? "① 台词 × 画面 同页改 · 改完直接生成"
        : "① 脚本 × 素材 同页改 · 改完直接生成";

  /* 返回要回到「你从哪来」，不然切来源之后按返回会回错地方 */
  const backGo = kind === "remix" ? "C1.2"
    : kind === "series" ? "D1.2?c=" + D.campaigns("running")[0].id + "&d=" + dayN
    : src === "import" || src === "struct" ? "B1.2"
    : "B1";

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backGo}" data-label="返回来路">‹</span>
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
