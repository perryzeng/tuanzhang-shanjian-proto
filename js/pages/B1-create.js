window.PAGES["B1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE, G = window.G;
  const s = D.draft("script"), r = D.draft("remix");
  const run = D.campaigns("running")[0];
  const topic = ctx.topic || "";

  /* 四种脚本来源，全是一条路：先有脚本，再进同一个发布器
     ① 写主题 → B1.1 开工确认 → B2   ② 导入脚本 → B1.2 脚本库 → B1.3 详情 → B2
     ③ 导入视频 → C1 → C1.1 抽取 → C1.2 结果 → B2   ④ 系列 → D1 → D1.1 日程 → D1.2 → B2 */
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
        <textarea id="btopic" data-bind="B1.topic" placeholder="一句话写下主题。比如：磷虾油今晚 8 点开团，讲清成分、含量和怎么买">${topic}</textarea>
        <div class="quick">${quick.map((t) => `<span class="chip" data-set="B1.topic=${t}">${t}</span>`).join("")}</div>
        <div class="cbot">
          <span class="hint">不用写完整，AI 会补成分段台词和画面</span>
          <div class="btn ai" data-go="B1.1" data-label="AI 写脚本">✦ 写脚本</div>
        </div>
      </div>

      ${C.sec("手上已经有内容")}
      <div class="src3">
        ${src({ name: "导入脚本", sub: "从我的 / 团队库<br>选一份", ic: "⧉", bg: G("#2C5BFF", "#5B8CFF"), go: "B1.2" })}
        ${src({ name: "导入视频", sub: "本地或链接<br>抽出口播", ic: "▷", bg: G("#00A8E8", "#00C2FF"), go: "C1" })}
        ${src({ name: "系列", sub: "总部战役<br>Day " + run.day + " 待发", ic: "≡", bg: G("#7C5CFF", "#B08CFF"), go: "D1", dot: true })}
      </div>

      ${C.sec("继续创作", "全部", "A1")}
      ${C.li({ bg: G("#7C5CFF", "#B08CFF"), title: s.title, m1: `${s.segCount} 段 · 已配 ${s.segCount - s.missSegs.length}/${s.segCount} 段画面`, btn: "继续", go: "B2?kind=script" })}
      ${C.li({ bg: G("#00A8E8", "#00C2FF"), title: r.title, m1: `已改 ${r.changed}/${r.segCount} 段 · 安全度 ${r.safety}`, btn: "继续", btnCls: "line", go: "B2?kind=remix" })}
    </div>

    ${C.tab("")}
  </div>`;
};
