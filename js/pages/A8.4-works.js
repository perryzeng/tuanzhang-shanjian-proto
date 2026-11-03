/* A8.4 作品（V18 · 一条时间轴）
   团长回忆作品是按"哪天弄的"来的 ——"上礼拜三那条效果特别好"、"今天出的还没发"。
   所以这一页就是一条轴，**全部作品按真实时间倒序**，最新的在最上面。

   V18 起这里只剩两种东西：**出好的片（待发）** 和 **发出去的片**。
   没有草稿、没有半成品 —— 剪是全自动的，剪不出来 U剪 会在对话里问，
   不会在作品列表里留一条"卡住"的东西让人惦记。

   筛选用意图强弱分：潜客 → 互动 → 浏览 → 零浏览。
   这四档正好是"这条内容有没有把人带过来"的四层。 */

window.PAGES["A8.4"].prd = "PRD V18 §5 · 作品（时间轴 / 按意图筛）";
window.PAGES["A8.4"].sysEntry = "底部 tab「作品」；对话里说「看我的作品」也跳这里";

window.PAGES["A8.4"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const f = ctx.f || "all";
  const TODAY = L.today || 20261103;

  /* 只排一次，后面全用它。slice() 是为了不动原数组的顺序 */
  const all = L.works.slice().sort((a, b) => b.ts - a.ts);
  const sent = all.filter((x) => x.status === "sent");
  const ready = all.filter((x) => x.status !== "sent");   // 出好了还没发

  /* 意图四层：潜客 ⊂ 互动 ⊂ 浏览，零浏览是另一头 */
  const hasLead = (w) => w.leads > 0;
  const hasInter = (w) => w.inter > 0;
  const hasView = (w) => w.open > 0;

  const FILTERS = [
    ["all", "全部", () => true],
    ["lead", "潜客", hasLead],
    ["inter", "互动", hasInter],
    ["view", "浏览", hasView],
    ["none", "零浏览", (w) => !hasView(w)]
  ];
  const pick = (FILTERS.filter((x) => x[0] === f)[0] || FILTERS[0])[2];
  const list = all.filter(pick);

  /* 概要只算已发的：没发的没有数据，混进去会把平均拉低 */
  const sum = sent.reduce((a, x) => ({
    opens: a.opens + x.opens, inter: a.inter + x.inter, leads: a.leads + x.leads
  }), { opens: 0, inter: 0, leads: 0 });

  /* 冠军按"带来多少人"排，不按成交 —— 成交是客户页的事，
     作品页能负责的是"把人带过来"这一步。 */
  const best = sent.slice().sort((a, b) => b.leads - a.leads || b.inter - a.inter)[0];

  /* 日期标签直接用 ts，不再从 "今天 09:20 剪好" 这种串里猜 */
  const DAY = (ts) => {
    const d = ts % 100, m = Math.floor(ts / 100) % 100;
    if (ts === TODAY) return "今天";
    if (ts === TODAY - 1) return "昨天";
    return `${m} 月 ${d} 日`;
  };

  /* 已经是倒序了，顺着扫就能把同一批日子聚在一起 */
  const groups = [];
  list.forEach((w) => {
    const d = DAY(w.ts);
    let g = groups.filter((x) => x.day === d)[0];
    if (!g) groups.push((g = { day: d, items: [] }));
    g.items.push(w);
  });

  const card = (w) => {
    /* 出好了还没发的：没有数据，只给「去发」。
       它不是半成品 —— 片是完整的，只是还没发出去。 */
    if (w.status !== "sent") {
      return `<div class="v19-w v19-w-off" data-go="A8.4.2?pf=dy&c=${w.id}" data-label="${w.title}">
        <div class="v19-w-th"><img src="${w.img}" alt=""><span>${w.dur}</span></div>
        <div class="v19-w-tx">
          <div class="v19-w-b"><b>${w.title}</b><em class="v19-tag">待发</em></div>
          <span>${w.at} · ${w.ch}</span>
          <div class="v19-w-hint">挑个平台，对一下评论就能发</div>
        </div>
        <div class="v19-w-act">去发</div>
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
          <i><b>${w.opens}</b> 浏览</i>
          <i><b>${w.cmt}</b> 评论</i>
          <i><b>${w.likes}</b> 点赞</i>
          <i><b>${w.leads}</b> 意向</i>
        </div>
      </div>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">作品<small>${all.length} 条 · ${sent.length} 条已发${ready.length ? ` · ${ready.length} 条待发` : ""}</small></div>
      <span class="act" data-go="A8" data-label="问U剪">问U剪</span>
    </div>

    <div class="body">
      <div class="v21-sum">
        <div><b>${sent.length}</b><span>已发</span></div>
        <div><b>${sum.opens}</b><span>次浏览</span></div>
        <div><b>${sum.inter}</b><span>互动</span></div>
        <div class="on"><b>${sum.leads}</b><span>意向客户</span></div>
      </div>

      ${best ? `<div class="v21-best" data-go="A8.4.1?c=${best.id}" data-label="${best.title}">
        <span class="v21-best-k">最带人</span>
        <div>
          <b>${best.title}</b>
          <span>${best.opens} 次浏览 · ${best.inter} 次互动 · 带来 ${best.leads} 个意向客户</span>
        </div>
        <em>›</em>
      </div>` : ""}

      <div class="chips wrap" style="margin:14px 0 4px">
        ${FILTERS.map(([k, tx, fn]) => {
          const n = k === "all" ? all.length : all.filter(fn).length;
          return `<span class="chip ${f === k ? "on" : ""}" data-set="A8.4.f=${k}">${tx} ${n}</span>`;
        }).join("")}
      </div>

      <div class="v21-tl">
        ${groups.length ? groups.map((g) => `<div class="v21-day"><i></i><span>${g.day}</span></div>
          ${g.items.map((w) => `<div class="v21-i"><i class="v21-dot ${w.status !== "sent" ? "off" : ""}"></i>${card(w)}</div>`).join("")}
        `).join("") : `<div class="xs" style="text-align:center;padding:34px 0">这一类还没有作品</div>`}
      </div>

      <div class="xs" style="margin:10px 2px 4px;line-height:1.7">
        按时间倒序，最新在最上面。出好了没发的也排在它该在的那天。<br>
        浏览 = 落地页被打开的次数；互动 = 点赞 + 评论 + 分享 + 收藏；
        意向客户 = 看过 2 次以上，或点过「问团长」。
      </div>
    </div>

    ${C.tab8("A8.4")}
  </div>`;
};
