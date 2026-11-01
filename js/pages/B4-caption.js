window.PAGES["B4"].prd = "PRD §6.15 · 选封面（底图 + 版式配一张）";
window.PAGES["B4"].states = [
  { k: "", n: "默认：先用视频首帧当底图，选版式看效果；也可以换成自己上传的照片" }
];

/* 生成完只剩一件事：选封面。

   这一页的结构是 **底图 × 版式**，不是"AI 画 6 张给你挑"：
   · 底图 —— 视频首帧，或团长自己上传的一张照片；
   · 版式 —— 决定字压在哪儿（压底 / 顶部 / 居中 / 分栏 / 色条 / 左侧）。

   为什么不让 AI 整张画：团长认的是自己那张脸、那盘货。换成本人画面的封面
   点击率本来就更高，AI 只该负责排字，不该负责编画面——编出来的图他一眼就知道"这不是我"。
   所以 6 张缩略卡必须**共用同一张底图**，否则用户看不出"变的是版式、不变的是画面"。

   竖屏信息流里用户只看到一张图，这张图决定点不点开，所以这一页值得单独占一屏。 */
window.PAGES["B4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const tpls = D.covers();
  let base = D.coverBase(ctx.base);
  /* 从相册挑过照片的话，底图要用那一张的样子，不能还停在默认那张——
     否则用户从相册回来会觉得"我选的那张没生效"。 */
  if (base.k === "photo" && ctx.ph) {
    const ph = D.myPhotos().filter((x) => x.id === ctx.ph)[0];
    if (ph) base = { ...base, bg: ph.bg, from: ph.label + " · " + ph.at };
  }
  const tpl0 = D.cover(ctx.tpl || ctx.cv);
  /* 默认文案取自**主题**（这次要讲的那句话），不是模板里那几句示例——
     模板只决定字压在哪，不该替他决定说什么。
     用户改过就以他改的为准；切版式时保留，因为他改的是这句话，不是这个版式。 */
  const topic = ctx.topic || ((window.STATE || {}).B1 || {}).topic || "";
  const auto = D.coverFromTopic(topic);
  const bigTx = (ctx.big != null && ctx.big !== "") ? ctx.big : auto.big;
  const smallTx = (ctx.small != null && ctx.small !== "") ? ctx.small : auto.small;
  const tpl = { ...tpl0, big: bigTx, small: smallTx };
  /* 从相册选过就只留两张卡：视频首帧 / 我选的那张。没选过时第二张是「＋ 选择封面」，
     点了进相册——不再单列一张「上传本地图片」，那等于把同一件事说两遍。 */
  const fromAlbum = !!ctx.ph;
  const album = fromAlbum
    ? (D.myPhotos().filter((x) => x.id === ctx.ph)[0] || { label: "我选的那张", bg: base.bg })
    : null;

  /* 一个封面 = 底图 + 一层字。字号用 em，外面改 font-size 就能整块缩放——
     大预览和缩略卡因此共用同一套版式 CSS，不会出现"小图和大图长得不一样"。 */
  const brk = (x) => String(x).replace(/\|/g, "<br>");
  const cover = (t, b, fs, cls) => {
    const inner = t.k === "split"
      ? `<span class="ss">${t.small}</span><div class="bb"><b>${brk(t.big)}</b></div>`
      : t.k === "bar"
        ? `<div class="bb"><b>${brk(t.big)}</b><i>${t.small}</i></div>`
        : `<b>${brk(t.big)}</b><i>${t.small}</i>`;
    return `<div class="cv ${cls || ""}" style="font-size:${fs}px">
      <div class="src" style="background:${b.bg}"></div>
      <div class="lay ${t.k}">${inner}</div>
    </div>`;
  };

  /* 六张缩略卡用的是**同一句话**，只有排法不同——否则用户看到的还是"六个不同的封面"，
     而不是"我的这张封面，六种排法"。文案统一取自上面那两个框。 */
  const sameTx = (t) => ({ ...t, big: bigTx, small: smallTx });
  const tile = (t) => `<div class="cvt${t.k === tpl.k ? " sel" : ""}" data-set="B4.tpl=${t.k}">
      ${cover(sameTx(t), base, 5.4)}
      <span class="nm">${t.name}</span>
      ${t.k === tpl.k ? `<span class="ck">✓</span>` : ""}
    </div>`;

  const baseCard = (b) => `<div class="bset${b.k === base.k ? " sel" : ""}" data-set="B4.base=${b.k}">
      <div class="th" style="background:${b.bg}"></div>
      <div class="tx"><b>${b.name}</b><span>${b.from}</span></div>
      ${b.k === base.k ? `<span class="tick">✓</span>` : ""}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "选封面", sub: "挑张底图，再挑个字压在哪儿", back: "B3" })}

    <div class="body">
      <div class="cvhead">
        <div class="cvpreview">${cover(tpl, base, 12, "big")}
          <div class="cap">${base.name}${base.at ? " · " + base.at : ""} · ${tpl.name}</div>
        </div>
        <div class="cvtext">
          <div class="fd">
            <span class="fl">主标题</span>
            <input data-bind="B4.big" data-live value="${String(bigTx).replace(/"/g, "&quot;")}"
                   placeholder="封面主打的那句话" />
          </div>
          <div class="fd">
            <span class="fl">副标题</span>
            <input data-bind="B4.small" data-live value="${String(smallTx).replace(/"/g, "&quot;")}"
                   placeholder="价格 / 时间 / 补充" />
          </div>
          <div class="hint">主标题里打 <b>|</b> 可以手动换行</div>
          <div class="hint" style="margin-top:6px">改完立刻看左边，不用保存</div>
        </div>
      </div>

      <div class="sec-h" style="margin:14px 2px 9px"><span class="h2">封面</span>
        <span class="more">用哪张画面当底</span></div>
      <div class="bsets">
        ${baseCard(D.coverBase("frame"))}
        ${fromAlbum ? `
          <div class="bset${base.k === "photo" ? " sel" : ""}" data-set="B4.base=photo">
            <div class="th" style="background:${album.bg}"></div>
            <div class="tx"><b>${album.label}</b><span>相册 · 竖版</span></div>
            ${base.k === "photo" ? `<span class="tick">✓</span>` : ""}
          </div>`
        : `<div class="bset add" data-go="B4.2" data-label="选择封面">
            <div class="th add">＋</div>
            <div class="tx"><b>选择封面</b><span>从相册选一张</span></div>
          </div>`}
      </div>

      <div class="sec-h" style="margin:14px 2px 9px"><span class="h2">爆款封面</span>
        <span class="more">同一张底图，六种爆款排法</span></div>
      <div class="ctray">${tpls.map(tile).join("")}</div>
      <div class="note" style="margin:8px 2px 0">${tpl.note}</div>

      <div class="card" style="margin-top:12px;display:flex;align-items:center;gap:10px;background:var(--success-weak);box-shadow:none">
        <span style="width:20px;height:20px;border-radius:50%;background:var(--success);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;flex:0 0 20px">✓</span>
        <div style="flex:1">
          <div style="font-size:12.5px;font-weight:600;color:#0B8C68">封面字已过合规</div>
          <div class="xs" style="margin-top:2px;color:#2F7F68">「${tpl.big.replace("|", " ")}」无「最 / 第一 / 治疗」等禁用表述</div>
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn" data-go="B4.1" data-label="用这张封面发布">✓ 用「${tpl.name}」发布</div>
    </div>
  </div>`;
};
