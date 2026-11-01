window.PAGES["B1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE, G = window.G;
  const s = D.draft("script"), r = D.draft("remix"), se = D.draft("series");
  const topic = ctx.topic || "";

  /* 四种脚本来源，全是一条路：先有脚本，再进同一个发布器
     ① 写主题 → AI 写（本页主路径） ② 导入脚本 ③ 视频抽文案 ④ 系列预置 */
  const quick = ["磷虾油今晚开团", "换季免疫力怎么讲", "老客复购怎么说"];

  const src = (o) => `<div class="srcitem" data-go="${o.go}" data-label="${o.name}">
      <div class="ic" style="background:${o.bg}">${o.ic}${o.dot ? '<i class="dot"></i>' : ""}</div>
      <b>${o.name}</b><span>${o.sub}</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "创作", t: "今天想讲什么？", act: `<span class="btn-pill line">草稿 3</span>` })}

    <div class="body">
      <div class="composer">
        <textarea id="btopic" placeholder="一句话写下主题。比如：磷虾油今晚 8 点开团，讲清成分、含量和怎么买">${topic}</textarea>
        <div class="quick">${quick.map((t) => `<span class="chip" data-set="B1.topic=${t}">${t}</span>`).join("")}</div>
        <div class="cbot">
          <span class="hint">不用写完整，AI 会补成分段台词和画面</span>
          <div class="btn ai" data-go="B2?kind=script" data-label="AI 写脚本">✦ 写脚本</div>
        </div>
      </div>

      ${C.sec("手上已经有内容")}
      <div class="src3">
        ${src({ name: "导入脚本", sub: "粘贴或上传<br>doc / txt", ic: "⧉", bg: G("#2C5BFF", "#5B8CFF"), go: "B2?kind=script&src=import" })}
        ${src({ name: "导入视频", sub: "抽出口播<br>变成你的", ic: "▷", bg: G("#00A8E8", "#00C2FF"), go: "C1" })}
        ${src({ name: "系列", sub: "总部写好<br>Day " + se.series.day + " 待发", ic: "▤", bg: G("#7C5CFF", "#B08CFF"), go: "B2?kind=series", dot: true })}
      </div>

      ${C.sec("继续创作", "全部", "A1")}
      ${C.li({ bg: G("#7C5CFF", "#B08CFF"), title: s.title, m1: `${s.segCount} 段 · 已配 ${s.segCount - s.missSegs.length}/${s.segCount} 段画面`, btn: "继续", go: "B2?kind=script" })}
      ${C.li({ bg: G("#00A8E8", "#00C2FF"), title: r.title, m1: `已改 ${r.changed}/${r.segCount} 段 · 安全度 ${r.safety}`, btn: "继续", btnCls: "line", go: "B2?kind=remix" })}
    </div>

    ${C.tab("")}
  </div>`;
};
