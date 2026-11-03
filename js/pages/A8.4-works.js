/* A8.4 作品（V16.13 · 一条时间轴）
   团长回忆作品是按"哪天弄的"来的 ——"上礼拜三那条效果特别好"、"今天剪的还没发"。
   所以这一页就是一条轴，**全部作品按真实时间倒序**，最新的在最上面。

   上一版按状态分组（已发 / 没发 / 草稿各一段），结果是"今天剪的"排在
   "10 月 25 日的"后面 —— 时间轴读起来是断的。现在不管状态，只按时间。

   筛选用意图强弱分：有潜客 → 有互动 → 有浏览 → 0浏览。
   这四档正好是"这条内容有没有把人带过来"的四层。 */

window.PAGES["A8.4"].prd = "PRD V16 §5 · 作品（时间轴 / 按意图筛）";
window.PAGES["A8.4"].sysEntry = "底部 tab「作品」；对话里说「看我的作品」也跳这里";

window.PAGES["A8.4"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const f = ctx.f || "all";
  const TODAY = L.today || 20261103;

  /* 只排一次，后面全用它。slice() 是为了不动原数组的顺序 */
  const all = L.works.slice().sort((a, b) => b.ts - a.ts);
  const sent = all.filter((x) => x.status === "sent");

  /* 意图四层：有潜客 ⊂ 有互动 ⊂ 有浏览，0浏览是另一头 */
  const hasLead = (w) => w.leads > 0;
  const hasInter = (w) => w.inter > 0;
  const hasView = (w) => w.open > 0;

  const FILTERS = [
    ["all", "全部", () => true],
    ["lead", "有潜客", hasLead],
    ["inter", "有互动", hasInter],
    ["view", "有浏览", hasView],
    ["none", "0浏览", (w) => !hasView(w)]
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
          <i><b>${w.opens}</b> 次打开</i>
          <i><b>${w.inter}</b> 互动</i>
          <i><b>${w.leads}</b> 潜客</i>
        </div>
      </div>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">作品<small>${all.length} 条 · ${sent.length} 条已发</small></div>
      <span class="act" data-go="A8" data-label="问U剪">问U剪</span>
    </div>

    <div class="body">
      <div class="v21-sum">
        <div><b>${sent.length}</b><span>已发</span></div>
        <div><b>${sum.opens}</b><span>次打开</span></div>
        <div><b>${sum.inter}</b><span>互动</span></div>
        <div class="on"><b>${sum.leads}</b><span>潜客</span></div>
      </div>

      ${best ? `<div class="v21-best" data-go="A8.4.1?c=${best.id}" data-label="${best.title}">
        <span class="v21-best-k">最带人</span>
        <div>
          <b>${best.title}</b>
          <span>${best.opens} 次打开 · ${best.inter} 次互动 · 带来 ${best.leads} 个潜客</span>
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
        按时间倒序，最新在最上面，没发的也排在它该在的那天。<br>
        打开 = 落地页被打开；互动 = 点赞 + 评论 + 分享 + 收藏；潜客 = 看了 2 次以上或点过问团长。
      </div>
    </div>

    ${C.tab8("A8.4")}
  </div>`;
};
