window.PAGES["B1.4"].prd = "PRD §6.1 · 草稿箱（首页右上角「草稿 N」的落点）";

/* 草稿箱只回答一个问题：**哪条卡住了、卡在哪一段**。
   所以每行都给"配了几段 / 缺几段"，而不是只给标题和时间——
   打开草稿箱的人不是来欣赏作品的，是来接着干的。 */
window.PAGES["B1.4"].render = function () {
  const C = window.C, D = window.DERIVE, G = window.G;
  const list = D.drafts();
  const bgOf = { script: G("#2C5BFF", "#5B8CFF"), remix: G("#00A8E8", "#00C2FF"), series: G("#7C5CFF", "#B08CFF") };

  const row = (x) => `<div class="li" data-go="${x.go}" data-label="${x.title}">
      <div class="im" style="background:${bgOf[x.kind] || bgOf.script}">${x.tag}</div>
      <div class="tx">
        <b>${x.title}</b>
        <span>${x.meta}</span>
        <span style="color:${x.warn ? "var(--warn)" : "var(--text-4)"}">${x.warn ? "还差点东西，点进去接着做" : "可以生成"} · ${x.at}</span>
      </div>
      <span class="btn-pill ${x.warn ? "" : "line"}">继续</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "草稿", sub: list.length + " 条没做完的", back: "B1" })}

    <div class="body">
      ${list.length ? list.map(row).join("") : `<div class="card plain" style="text-align:center;padding:34px 16px">
        <div class="xs">还没有草稿<br>回创作页写一句话就开始了</div>
      </div>`}

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">
          草稿不会过期，也不会占额度。只有点「生成」才会扣——所以可以放心写了放着。
        </div>
      </div>
    </div>
  </div>`;
};
