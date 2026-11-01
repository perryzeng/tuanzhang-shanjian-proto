window.PAGES["B1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE, G = window.G;
  const topic = ctx.topic || "";
  const drafts = D.drafts();

  /* 三种"得到一份脚本"的方式全部长在这一个输入框上，不再单开一区：
     写一句 → AI 写；导入脚本 → 从库引；导入视频 → 抽口播。
     因为用户脑子里只有一个动作："我要开始做一条视频"，不该先选"用哪种方式"。
     另外两种发布方式（二创 / 系列）在下面，那是"换一种做法"，不是同一条路。 */
  const quick = ["磷虾油今晚开团", "换季免疫力怎么讲", "老客复购怎么说"];

  const way = (ic, tx, go, bg) =>
    `<div class="way" data-go="${go}" data-label="${tx}">
      <span class="wi" style="background:${bg}">${ic}</span><b>${tx}</b>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({
      k: "创作",
      t: "今天想讲什么？",
      act: `<span class="btn-pill line" data-go="B1.4" data-label="草稿箱">草稿 ${drafts.length} ›</span>`
    })}

    <div class="body">
      <div class="composer">
        <textarea id="btopic" data-bind="B1.topic" placeholder="一句话写下主题。比如：磷虾油今晚 8 点开团，讲清成分、含量和怎么买">${topic}</textarea>
        <div class="quick">${quick.map((t) => `<span class="chip" data-set="B1.topic=${t}">${t}</span>`).join("")}</div>
        <div class="cbot">
          <div class="ways">
            <span class="wtip">手上已经有内容</span>
            ${way("⧉", "导入脚本", "B1.2", G("#2C5BFF", "#5B8CFF"))}
            ${way("▷", "导入视频", "C1", G("#00A8E8", "#00C2FF"))}
          </div>
          <div class="cgo">
            <span class="hint">不用写完整，AI 会补成分段台词和画面</span>
            <div class="btn ai" data-go="B1.1" data-label="AI 写脚本">✦ 写脚本</div>
          </div>
        </div>
      </div>

      ${C.sec("其他发布器")}
      <div class="g2">
        <div class="pubcard" data-go="C1?for=remix" data-label="视频二创">
          <div class="pi" style="background:${G("#00A8E8", "#00C2FF")}">▷</div>
          <b>视频二创</b>
          <span>导入本地视频，连画面一起还原，发前过安全度</span>
        </div>
        <div class="pubcard" data-go="D1" data-label="主题系列">
          <div class="pi" style="background:${G("#7C5CFF", "#B08CFF")}">≡</div>
          <b>主题系列</b>
          <span>定几天几趴，AI 排好每天主题，一天发一条</span>
        </div>
      </div>

      <div class="card plain" style="margin-top:14px;display:flex;align-items:center;gap:10px"
           data-go="B1.4" data-label="草稿箱">
        <div style="flex:1;min-width:0">
          <div class="xs" style="color:var(--text-2)"><b style="color:var(--text)">${drafts.length} 条草稿没收尾</b> · 最新一条改于 ${drafts[0].at}</div>
        </div>
        <span style="font-size:11.5px;font-weight:600;color:var(--brand)">去接着做 ›</span>
      </div>
    </div>

    ${C.tab("")}
  </div>`;
};
