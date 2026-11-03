/* A8.4 作品（V16.5 · 时间轴）
   上一版是平铺卡片，看起来像一堆文件。
   改成时间轴更贴合真实心智：**团长回忆作品，是按"哪天发的"来的**
   ——"上礼拜三那条效果特别好"、"今天剪的还没发"。

   结构：
   ① 顶部概要（这 7 天：几条已发、多少人次点开、多少潜客、成交几单）
   ② 一句"最有效的是哪条"（概要光有数字没用，得点出冠军）
   ③ 时间轴：按天分组，左边日期、中间轴、右边作品

   没发和草稿也挂在轴上（今天/昨天），因为它们同样是"某天做的东西"。 */

window.PAGES["A8.4"].prd = "PRD V16 §5 · 作品（时间轴）";
window.PAGES["A8.4"].sysEntry = "底部 tab「作品」；对话里说「看我的作品」也跳这里";

window.PAGES["A8.4"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const f = ctx.f || "all";
  const all = L.works;

  const sent = all.filter((x) => x.status === "sent");
  const pend = all.filter((x) => x.status === "pending");
  const draft = all.filter((x) => x.status === "draft");

  /* 概要只用已发的算：没发的没有数据，混进去会把平均值拉低，
     团长看到的"这周怎么样"应该是真实跑出来的那部分。 */
  const sum = sent.reduce((a, x) => ({
    open: a.open + x.open, leads: a.leads + x.leads, deal: a.deal + x.deal, cmt: a.cmt + x.cmt
  }), { open: 0, leads: 0, deal: 0, cmt: 0 });

  const best = sent.slice().sort((a, b) => b.deal - a.deal || b.open - a.open)[0];

  const list = f === "sent" ? sent : f === "pending" ? pend : f === "draft" ? draft : all;

  /* 按天分组。数据里 at 是"今天 09:20 剪好"这种，取前半段当归组键。 */
  const dayOf = (w) => {
    if (w.at.indexOf("今天") >= 0) return "今天";
    if (w.at.indexOf("昨天") >= 0) return "昨天";
    return w.at;
  };
  const groups = [];
  list.forEach((w) => {
    const d = dayOf(w);
    let g = groups.filter((x) => x.day === d)[0];
    if (!g) groups.push((g = { day: d, items: [] }));
    g.items.push(w);
  });

  const card = (w) => {
    if (w.status !== "sent") {
      const to = w.status === "pending" ? "S1?v=v_pending_1" : "B1.4";
      return `<div class="v19-w v19-w-off" data-go="${to}" data-label="${w.title}">
        <div class="v19-w-th"><img src="${w.img}" alt=""><span>${w.dur}</span></div>
        <div class="v19-w-tx">
          <div class="v19-w-b"><b>${w.title}</b></div>
          <span>${w.at} · ${w.ch}</span>
          <div class="v19-w-hint">${w.insight}</div>
        </div>
        <div class="v19-w-act">${w.status === "pending" ? "去发" : "接着剪"}</div>
      </div>`;
    }
    return `<div class="v19-w" data-go="A8.4.1?c=${w.id}" data-label="${w.title}">
      <div class="v19-w-th"><img src="${w.img}" alt=""><span>${w.dur}</span></div>
      <div class="v19-w-tx">
        <div class="v19-w-b">
          <b>${w.title}</b>
          ${w.tag ? `<em class="v19-tag ${w.tag === "效果最差" ? "bad" : ""}">${w.tag}</em>` : ""}
        </div>
        <span>${w.ch}</span>
        <div class="v19-w-num">
          <i><b>${w.open}</b> 点开</i>
          <i><b>${w.leads}</b> 潜客</i>
          <i><b>${w.cmt}</b> 评论</i>
        </div>
      </div>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">作品<small>${all.length} 条 · ${sent.length} 条已发</small></div>
      <span class="act" data-go="A8" data-label="问小剪">问小剪</span>
    </div>

    <div class="body">
      <div class="v21-sum">
        <div><b>${sent.length}</b><span>这周已发</span></div>
        <div><b>${sum.open}</b><span>人次点开</span></div>
        <div><b>${sum.leads}</b><span>带来潜客</span></div>
        <div class="on"><b>${sum.deal}</b><span>成交</span></div>
      </div>

      ${best ? `<div class="v21-best" data-go="A8.4.1?c=${best.id}" data-label="${best.title}">
        <span class="v21-best-k">最有效</span>
        <div>
          <b>${best.title}</b>
          <span>${best.open} 人次点开 · 带来 ${best.leads} 个潜客 · ${best.deal} 单成交</span>
        </div>
        <em>›</em>
      </div>` : ""}

      <div class="chips" style="margin:14px 0 4px">
        ${[["all", "全部 " + all.length], ["sent", "已发 " + sent.length], ["pending", "没发 " + pend.length], ["draft", "草稿 " + draft.length]]
          .map(([k, tx]) => `<span class="chip ${f === k ? "on" : ""}" data-set="A8.4.f=${k}">${tx}</span>`).join("")}
      </div>

      <div class="v21-tl">
        ${groups.map((g) => `<div class="v21-day"><i></i><span>${g.day}</span></div>
          ${g.items.map((w) => `<div class="v21-i"><i class="v21-dot ${w.status !== "sent" ? "off" : ""}"></i>${card(w)}</div>`).join("")}
        `).join("")}
      </div>

      <div class="xs" style="margin:10px 2px 4px;line-height:1.7">
        点开 = 落地页被打开；潜客 = 看了 2 次以上或点过问团长。没发的作品不计入上面的概数。
      </div>
    </div>

    ${C.tab8("A8.4")}
  </div>`;
};
