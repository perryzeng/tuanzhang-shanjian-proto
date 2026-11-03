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
            ${way("⧉", "引用已有脚本", "B1.2", G("#2C5BFF", "#5B8CFF"))}
            ${way("▷", "视频文案抽取", "C1", G("#00A8E8", "#00C2FF"))}
          </div>
          <div class="cgo">
            <span class="hint">不用写完整，AI 会补成分段台词和画面</span>
            <div class="btn ai" data-go="B1.1" data-label="AI 写脚本">✦ 写脚本</div>
          </div>
        </div>
      </div>

      ${C.sec("我的东西", "全部 ›", "E2")}
      <div class="v14-mine">
        <div class="v14-mine-i" data-go="E2" data-label="我的素材库">
          <i>▤</i><b>素材库</b><span>脚本 · 素材 · 作品</span>
        </div>
        <div class="v14-mine-i" data-go="E2?open=work&tab=latest" data-label="我的作品">
          <i>▭</i><b>我的作品</b><span>做过的都在这</span>
        </div>
        <div class="v14-mine-i" data-go="B1.4" data-label="草稿箱">
          <i>✎</i><b>草稿 ${drafts.length}</b><span>卡在哪一段</span>
        </div>
      </div>

      ${C.sec("其他发布器")}
      <div class="pubs">
        <div class="pubrow" data-go="C1?for=remix" data-label="本地视频二创">
          <div class="pi" style="background:${G("#00A8E8", "#00C2FF")}">▷</div>
          <div class="pt">
            <b>本地视频二创</b>
            <span>上传本地视频，抽出文案和画面，改成你的再发</span>
          </div>
          <span class="pg">›</span>
        </div>
        <div class="pubrow" data-go="D1.3?from=B1" data-label="新建 SOP 主题系列">
          <div class="pi" style="background:${G("#7C5CFF", "#B08CFF")}">≡</div>
          <div class="pt">
            <b>SOP 主题系列</b>
            <span>写一个主题，分几条视频，AI 排好每条讲什么</span>
          </div>
          <span class="pg">›</span>
        </div>
      </div>

    </div>

    ${C.tab("")}
  </div>`;
};
