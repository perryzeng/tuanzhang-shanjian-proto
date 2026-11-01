window.PAGES["B2.1"].prd = "PRD §6.7～6.9 · 素材选择（语义推荐 + 搜索）";

/* 素材选择器：从"给哪一段配画面"进入。顶部是搜索——
   团长常常已经知道自己要什么（"仓库发货那条"），直接搜比在推荐里翻快得多。
   打了字就跨全库搜（不受来源 tab 限制），没打字才走推荐。 */
window.PAGES["B2.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const kind = ctx.kind || "script";
  const isSeries = kind === "series";
  const day = ctx.day || 5;
  const cid = ctx.c || "cp_1";
  const d = D.draft(kind, { doc: ctx.doc, day: day, src: ctx.src, struct: ctx.struct });
  const seg = d.segments.filter((s) => s.id === ctx.seg)[0] || d.missSegs[0] || d.cur;
  const tab = ctx.tab || "rec";
  const q = ctx.q || "";
  const SRC_TX = { my: "我的", team: "团队", brand: "品牌", stock: "图库", ai: "AI" };

  const list = q
    ? D.search(window.DATA.assets, q, ["label", "tags"]).map((a) => ({ ...a, srcTx: SRC_TX[a.from] || "" }))
    : D.recommend(seg, tab);

  const sel = ctx.pick || (seg.shots[0] || {}).asset || (list[0] && list[0].id);
  const selItem = list.filter((a) => a.id === sel)[0] ||
    window.DATA.assets.filter((a) => a.id === sel)[0] || null;

  /* 回哪去要说准：系列的槽属于 D2，其余都属于结构化脚本框 B2 */
  const backQ = isSeries
    ? "D2?c=" + cid + "&d=" + day
    : "B2?kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : "")
      + (ctx.struct ? "&struct=" + ctx.struct : "");
  const useQ = backQ + "&seg=" + seg.id + "&asset=" + sel;

  const TABS = [
    ["rec", "推荐 " + D.recommend(seg, "rec").length],
    ["team", "团队库 " + D.pool("team").length],
    ["my", "我的出镜 " + D.pool("my").length],
    ["stock", "图库 " + D.pool("stock").length]
  ];

  /* 库里没有合适的，就把手机上的一段传上来当素材。
     它排在网格第一格，因为这是"找不到"时唯一的出路，不能藏在页面底部。 */
  const upSel = sel === "up";
  const upTile = `<div class="mat up${upSel ? " on" : ""}" data-set="B2.1.pick=up">
      <div class="upbox">
        ${upSel
          ? `<span class="fname">IMG_2043.MOV</span><span class="fmeta">竖屏 · 52 秒</span>`
          : `<span class="pl">＋</span><span class="lb">上传本地</span><span class="fmeta2">视频或图片</span>`}
      </div>
      <div class="cap">${upSel ? "已选这条" : "从手机选"}</div>
    </div>`;

  const meta = (a) => a.kind === "pip" ? a.srcTx + " · 画中画" : a.srcTx + " · " + a.dur + "s";

  const mat = (a) => {
    const on = a.id === sel;
    return `<div class="mat" data-set="B2.1.pick=${a.id}">
      <div style="aspect-ratio:3/4;border-radius:9px;background:${a.bg};display:flex;align-items:flex-end;padding:6px;color:#fff;font-size:9.5px;font-weight:700;position:relative;overflow:hidden;box-shadow:${on ? "0 0 0 2px var(--brand)" : "none"}">
        ${a.img ? `<img src="${a.img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">` : ""}
        <span style="position:relative;z-index:2;background:rgba(0,0,0,.38);border-radius:5px;padding:2px 5px">${meta(a)}</span>
        ${on ? `<span style="position:absolute;right:5px;top:5px;width:16px;height:16px;border-radius:50%;background:var(--brand);color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center">✓</span>` : ""}
      </div>
      <div class="cap">${a.label}<span style="display:block;font-size:9px;color:var(--text-4);margin-top:2px">用 ${D.plays(a.uses)} · ♥ ${D.plays(a.likes)}</span></div>
    </div>`;
  };

  const empty = `<div style="padding:28px 10px;text-align:center;color:var(--text-3);font-size:12px;line-height:1.7">
      ${q ? "没搜到「" + q + "」<br><span style=\"font-size:11.5px\">试试「产品」「仓库」「截图」这种词</span>"
        : "这一栏还没有素材<br><span style=\"font-size:11.5px\">拍一段只要 3 秒，也可以在团队库里要</span>"}</div>`;

  /* 背后那层只做"我在整条脚本的哪儿"的定位，用和脚本框一样的 part 卡片（压暗） */
  const above = d.segments
    .filter((s) => s.idx <= seg.idx)
    .map((s) => {
      const sh = s.shots.filter((x) => !x.miss)[0];
      return C.part({
        no: s.no, name: s.name, dur: s.dur + "s", tags: s.tags, vo: s.vo, edit: false,
        slot: sh ? { label: sh.label, bg: sh.bg } : { empty: true, label: "加画面" },
        meta: D.slotMeta(s)
      });
    }).join("");

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backQ}" data-label="返回脚本框">‹</span>
      <div class="ttl">${d.title}<small>给第 ${seg.idx + 1} 段配画面</small></div>
    </div>

    <div class="body" style="padding-top:0;opacity:.14;pointer-events:none">
      ${above}
    </div>

    <div class="sheet">
      <div class="sheet-in">
        <div class="sheet-h">
          <div class="row">
            <div style="flex:1">
              <div class="t1">给「第 ${seg.idx + 1} 段 · ${seg.name}」配画面</div>
              <div class="t2">台词：${seg.vo || "（待生成）"}</div>
            </div>
            <span style="font-size:12px;font-weight:700;color:var(--brand);cursor:pointer" data-go="${backQ}" data-label="关闭选择器">关闭</span>
          </div>
          <div style="margin-top:10px;background:var(--warm-weak);border-radius:9px;padding:8px 10px;font-size:11.5px;color:#D9541F;line-height:1.5">
            <b>画面建议：</b>${seg.hint || "按台词语义挑一段，能盖住这段时长最好"}
          </div>
          <div class="xs" style="margin-top:8px;display:flex;align-items:center;gap:6px">
            <span>不想找素材？</span>
            <span style="color:var(--brand);font-weight:700;cursor:pointer"
              data-go="B2.3?seg=${seg.id}&kind=${kind}${ctx.src ? "&src=" + ctx.src : ""}${ctx.doc ? "&doc=" + ctx.doc : ""}${isSeries ? "&c=" + cid + "&day=" + day : ""}"
              data-label="让我的照片出镜">加一层小窗，用我的照片出镜 ›</span>
          </div>
        </div>

        <div class="sheet-b">
          <div class="gsearch" style="margin-bottom:10px">
            <span class="mag">⌕</span>
            <input data-bind="B2.1.q" data-live value="${q}" placeholder="搜素材：产品、仓库、截图…" />
            ${q ? `<span class="xs" style="color:var(--brand);font-weight:600" data-set="B2.1.q=">清空</span>` : ""}
          </div>

          ${q ? `<div class="xs" style="margin:-2px 2px 10px">全库搜到 ${list.length} 段</div>` : `<div class="tabs2">
            ${TABS.map(([k, tx]) => `<b class="${tab === k ? "on" : ""}" data-set="B2.1.tab=${k}">${tx}</b>`).join("")}
          </div>`}

          ${list.length ? `<div class="mgrid">${upTile}${list.map(mat).join("")}</div>`
            : `<div class="mgrid">${upTile}</div>${empty}`}
          <div class="xs" style="margin-top:12px;text-align:center">这一页只负责选素材 · 库里没有再自己拍</div>
        </div>

        <div class="sheet-f">
          <div class="btn" data-go="${useQ}" data-label="用这个片段">${upSel
            ? "用我上传的这段换掉画面"
            : selItem ? "用「" + selItem.label + "」换掉这段画面" : "先选一个片段"}</div>
        </div>
      </div>
    </div>
  </div>`;
};
