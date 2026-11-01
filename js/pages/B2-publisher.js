window.PAGES["B2"].states = [
  { k: "browse", n: "浏览态：整条脚本按 part 铺开，一个 part 一段话 + 一个画面槽" },
  { k: "edit", n: "编辑态：只当前 part 就地改台词，改完即时重配音" },
  { k: "fix", n: "修缺口：只留没配画面的 part，出路摊开" }
];
window.PAGES["B2"].prd = "PRD §6 · 结构化脚本框（全产品唯一的脚本编辑面）";

/* 结构化脚本框：不管脚本从哪来（AI 写 / 脚本库引 / 视频抽 / 二创），
   落到这一页都是同一个结构——**N 个 part，每个 part = 一段台词 + 一个画面槽**。

   这一版把顶部那条大预览去掉了，原因有两个：
   ① 它占掉近 1/5 屏，但只显示"当前这一段"，和下面那张 part 卡是同一件事；
   ② 有了它，用户会以为要在这里"播放整条片子"，而真正的检查方式是逐段看。
   改成每个 part 自带的 ▶：点哪段预览哪段，条形进度按这段的实际时长走。 */
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
  const playing = ctx.pv || "";

  /* 每个槽都带着"这一段 + 从哪来"，否则换完就掉回默认草稿 */
  const pickGo = (id) => "B2.1?seg=" + id + "&kind=" + kind + "&src=" + src
    + (ctx.doc ? "&doc=" + ctx.doc : "");

  /* 来源只说一句话，数字交给下面的小标题——两处都在说"5 段 46 秒"就是重复 */
  const srcLine = (function () {
    if (kind === "remix")
      return "二创自 " + d.source.who + "「" + d.source.title + "」· " + D.plays(d.source.plays) + " 播放";
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

  /* 一个 part = 一段台词 + 一个画面槽 + 一个 ▶。
     点 ▶ 只预览这一段：条形按这段的真实时长走完，不用看整条。 */
  function partHtml(s) {
    const isFocus = s.id === focus.id;
    const editable = s.lock !== "brand";
    const okShot = s.shots.filter((x) => !x.miss)[0];
    const badShot = s.shots.filter((x) => x.miss)[0];
    const on = playing === s.id;
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

    const p = {
      no: s.no, name: s.name, dur: s.dur + "s", tags, slot, on: isFocus && mode === "edit",
      play: { on: on, act: on ? "B2.pv=" : "B2.pv=" + s.id }
    };
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
    /* 缺口段的槽上已经写着缺什么，就不再多一行"画面还缺" */
    p.meta = badShot ? "" : D.slotMeta(s);
    if (on) p.playing = s.dur;
    if (mode === "edit" && isFocus && !editable) p.note = "品牌方锁定的必播口播，台词不可改，只能调顺序";

    if (s.missN) {
      p.ops = D.resolveFix(s).filter((o) => o.ok).slice(0, 3)
        .map((o) => ({ t: o.tx, go: o.go, cls: o.key === "aigen" ? "hot" : "" }));
    } else if (isFocus && mode !== "edit" && s.vo && !on) {
      p.ops = [{ t: "✦ AI 重写这段", cls: "hot" }, { t: "＋ 画中画", go: "B2.3" }];
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

  const head = `<div class="listhead"><b>脚本</b>${d.segCount} 个 part · 约 ${d.durTotal} 秒 ·
      ${kind === "remix"
        ? `<span style="color:var(--warn);font-weight:700">安全度 ${d.safety}</span>`
        : `<span style="color:var(--success);font-weight:700">合规 ✓</span>`}
      <span style="flex:1"></span>${d.missCount ? `<span class="tag r">缺 ${d.missCount} 段画面</span>` : `<span class="tag g">可以发</span>`}</div>`;

  /* 下一步不再是"直接生成"：先选模板和声音，再生成。
     模板决定节奏与字幕，声音决定谁在说——这两件事必须在生成前定，
     生成后再改就是重剪。 */
  const cfgQ = "?from=B2&kind=" + kind + (src ? "&src=" + src : "") + (ctx.doc ? "&doc=" + ctx.doc : "");
  const primary = (function () {
    if (mode === "fix" && miss) return { t: "✦ 补上第 " + (miss.idx + 1) + " 段", go: pickGo(miss.id) };
    if (kind === "remix") return { t: "下一步 · 查安全度", go: "C3" };
    /* 缺画面也照样往下走——下一步只是选模板，缺口留到生成前那一步再看，
       不要在这里用两个不同的按钮文案制造"现在不能走"的错觉 */
    return { t: "下一步 · 选模板与声音", go: "B2.4" + cfgQ, cls: "ai" };
  })();

  const bar = `<div class="actionbar">
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
      : srcLine;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backGo}" data-label="返回来路">‹</span>
      <div class="ttl">${d.title}<small>${sub}</small></div>
      <span class="act" data-set="B2.mode=${mode === "browse" ? "edit" : "browse"}&B2.vo=self">${mode === "browse" ? "编辑" : "完成"}</span>
    </div>

    ${blocker}
    ${head}

    ${mode === "browse" ? `<div class="fade" style="bottom:74px"></div>` : ""}
    <div class="body" style="padding:${mode === "browse" ? "0 16px 24px" : "10px 16px 24px"}">
      ${body}
    </div>

    ${bar}
  </div>`;
};
