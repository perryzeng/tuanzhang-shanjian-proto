window.PAGES["G3.1"].render = function () {
  const C = window.C, G = window.G;

  const p = (nm, av, bg, act, score, tag) =>
    `<div class="li" style="align-items:flex-start" data-go="B4.1" data-label="跟进 ${nm}">
      <div class="im" style="width:42px;height:42px;border-radius:50%;flex:0 0 42px;background:${bg};align-items:center;justify-content:center;font-size:14px">${av}</div>
      <div class="tx">
        <div class="row" style="gap:6px"><b style="margin:0">${nm}</b><span class="tag ${score >= 80 ? "r" : score >= 60 ? "b" : ""}">意向 ${score}</span></div>
        <span style="margin-top:6px">${act}</span>
        ${tag ? `<div class="xs" style="margin-top:6px;color:var(--brand)">${tag}</div>` : ""}
      </div>
      <span class="btn-pill ${score >= 80 ? "" : "ghost"}">跟进</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "高潜客户", sub: "看完视频还没下单的人", back: "B4.1", act: "规则" })}

    <div class="body">
      <div class="hero">
        <div class="lb">今天值得跟进的</div>
        <div class="num">9<small>人</small></div>
        <div class="sub">共 27 个潜在客户 · 昨天新增 6 个</div>
      </div>

      <div class="chips" style="margin:14px 0 12px">
        <span class="chip on">全部 27</span><span class="chip">看了 2 次以上 9</span>
        <span class="chip">问过价 4</span><span class="chip">点过购物车 6</span>
      </div>

      ${p("阿梅", "梅", G("#2C5BFF", "#5B8CFF"), "看了 3 次 · 停留 1 分 12 秒 · 点了购物车", 86, "最可能成交 · 建议发一条私信")}
      ${p("阿强", "强", G("#7C5CFF", "#B08CFF"), "看完 2 遍 · 评论区问价「多少钱一盒」", 74, "已问价，直接报团购价")}
      ${p("阿华", "华", G("#00A8E8", "#00C2FF"), "看完 1 遍 · 收藏了视频", 58, "")}
      ${p("微信用户 8**2", "匿", "#9AA5BD", "停留 48 秒 · 未互动", 41, "")}

      ${C.sec("怎么算的")}
      <div class="card" style="padding:14px">
        <div class="kv" style="padding-top:0"><span class="k">看了几次</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 30%</span></div>
        <div class="kv"><span class="k">停留时长</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 30%</span></div>
        <div class="kv"><span class="k">是否看完</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 20%</span></div>
        <div class="kv" style="padding-bottom:0"><span class="k">互动（赞/评/点购物车）</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 20%</span></div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">只有看满 15 秒的人才算「访客」。数据来自抖音和视频号的公开播放数据，不含隐私信息。</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="B4.1" data-label="回成品"><span style="font-size:13px">▭</span><b>成品</b></div>
      <div class="btn" data-go="E1" data-label="交给团队跟进">交给团队跟进</div>
    </div>
  </div>`;
};
