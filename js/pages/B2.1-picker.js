window.PAGES["B2.1"].prd = "PRD §6.7～6.9 · 素材选择与语义匹配";

/* 素材选择器：从"给哪一段配画面"进入，推荐顺序由素材标签与该段画面的语义重合度决定 */
window.PAGES["B2.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const kind = ctx.kind || "script";
  const d = D.draft(kind);
  const seg = d.segments.filter((s) => s.id === ctx.seg)[0] || d.missSegs[0] || d.cur;
  const tab = ctx.tab || "rec";
  const list = D.recommend(seg, tab);
  const sel = ctx.pick || (seg.shots[0] || {}).asset || (list[0] && list[0].id);
  const selItem = list.filter((a) => a.id === sel)[0] ||
    window.DATA.assets.filter((a) => a.id === sel)[0] || null;

  const TABS = [
    ["rec", "推荐 " + D.recommend(seg, "rec").length],
    ["team", "团队库 " + D.pool("team").length],
    ["my", "我的出镜 " + D.pool("my").length],
    ["stock", "图库 " + D.pool("stock").length]
  ];

  const meta = (a) => a.kind === "pip"
    ? a.srcTx + " · 画中画"
    : a.srcTx + " · " + a.dur + "s";

  const mat = (a) => {
    const on = a.id === sel;
    return `<div class="mat" data-set="B2.1.pick=${a.id}">
      <div style="aspect-ratio:3/4;border-radius:9px;background:${a.bg};display:flex;align-items:flex-end;padding:6px;color:#fff;font-size:9.5px;font-weight:700;position:relative;box-shadow:${on ? "0 0 0 2px var(--brand)" : "none"}">
        <span style="background:rgba(0,0,0,.38);border-radius:5px;padding:2px 5px">${meta(a)}</span>
        ${on ? `<span style="position:absolute;right:5px;top:5px;width:16px;height:16px;border-radius:50%;background:var(--brand);color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center">✓</span>` : ""}
      </div>
      <div class="cap">${a.label}</div>
    </div>`;
  };

  const empty = `<div style="padding:34px 10px;text-align:center;color:var(--text-3);font-size:12px;line-height:1.7">
      这一栏还没有素材<br><span style="font-size:11.5px">拍一段只要 3 秒，也可以在团队库里要</span></div>`;

  /* 上方段落列表：只露出进入点之前的段，让人知道自己在整条片子的哪儿 */
  const above = d.segments
    .filter((s) => s.idx <= seg.idx)
    .map((s) => C.seg({
      no: s.no, name: s.name, dur: s.dur + "s", tags: s.tags, vo: s.vo,
      clips: s.shots.map((x) => x.miss
        ? { add: true, need: true, label: "缺" + x.label }
        : { bg: x.bg, label: x.label, pip: x.pip })
    })).join("");

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B2" data-label="返回发布器">‹</span>
      <div class="ttl">发布器 · ${d.title}<small>给第 ${seg.idx + 1} 段配画面</small></div>
    </div>

    ${C.estage({
      preview: {
        bg: (seg.shots.filter((s) => !s.miss)[0] || {}).bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
        no: seg.idx + 1 + "/" + d.segCount,
        cap: seg.vo.slice(0, 12),
        pip: seg.shots.some((s) => s.pip)
      },
      code: seg.code,
      track: d.track.map(([f], i) => [f, i === seg.idx ? "cur" : (i < seg.idx ? "done" : "")]),
      now: `<b>第 ${seg.idx + 1} 段 · ${seg.name}</b><br>${seg.missN
        ? "还缺 " + seg.missN + " 段画面"
        : "已配 " + seg.shots.length + " 个画面 · 共 " + seg.shotTotal + "s"}`,
      paused: true
    })}

    <div class="body" style="padding-top:0;opacity:.16;pointer-events:none">
      ${above}
    </div>

    <div class="sheet">
      <div class="sheet-in">
        <div class="sheet-h">
          <div class="row">
            <div style="flex:1">
              <div class="t1">给「第 ${seg.idx + 1} 段 · ${seg.name}」配画面</div>
              <div class="t2">台词：${seg.vo}</div>
            </div>
            <span style="font-size:12px;font-weight:700;color:var(--brand);cursor:pointer" data-go="B2" data-label="关闭选择器">关闭</span>
          </div>
          <div style="margin-top:10px;background:var(--warm-weak);border-radius:9px;padding:8px 10px;font-size:11.5px;color:#D9541F;line-height:1.5">
            <b>画面建议：</b>${seg.hint}
          </div>
        </div>

        <div class="sheet-b">
          <div class="tabs2">
            ${TABS.map(([k, tx]) => `<b class="${tab === k ? "on" : ""}" data-set="B2.1.tab=${k}">${tx}</b>`).join("")}
          </div>
          ${list.length ? `<div class="mgrid">${list.map(mat).join("")}</div>` : empty}
          <div class="xs" style="margin-top:12px;text-align:center">找不到？可以直接拍一段，或粘链接抓取</div>
          <div class="row" style="gap:8px;margin-top:10px">
            <div class="btn line" style="height:38px;font-size:13px" data-go="B2.2" data-label="去随手拍">＋ 随手拍 3 秒</div>
            <div class="btn line" style="height:38px;font-size:13px" data-go="B2.3" data-label="画中画配置">▣ 画中画</div>
          </div>
        </div>

        <div class="sheet-f">
          <div class="btn" data-go="B2" data-label="用这个片段">${selItem
            ? "用「" + selItem.label + "」· 替换第 1 个画面"
            : "先选一个片段"}</div>
        </div>
      </div>
    </div>
  </div>`;
};
