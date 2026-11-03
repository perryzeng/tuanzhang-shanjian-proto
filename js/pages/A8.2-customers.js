/* A8.2 客户（V16.4 · 取代原「看板」）
   客户不是数据，是一份份档案。

   这些人都是内容带来的：发到朋友圈、群聊，谁点进来了、看了多久、问了什么，
   全都能对上号。所以这一页的主语是「她」，不是「转化率」。

   列表只给三样：她怎么来的、她卡在哪、去聊。
   剩下的（轨迹、关心什么、怎么开口）点进去。 */

window.PAGES["A8.2"].prd = "PRD V16 §3 · 客户（档案列表 / 分层 / 来源）";
window.PAGES["A8.2"].sysEntry = "底部 tab「客户」；对话播报也跳这里";

window.PAGES["A8.2"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const f = ctx.f || "all";
  const all = L.customers;

  const grp = {
    hot: all.filter((x) => x.stage === "hot"),
    warm: all.filter((x) => x.stage === "warm"),
    cold: all.filter((x) => x.stage === "cold"),
    deal: all.filter((x) => x.stage === "deal")
  };
  const list = f === "all" ? all : (grp[f] || all);

  const card = (u) => `<div class="v20-c" data-go="A8.2.1?u=${u.id}" data-label="${u.name}">
      <div class="v20-c-hd">
        <i class="v20-c-av" style="background:${u.bg}">${u.av}</i>
        <div class="v20-c-tx">
          <b>${u.name}<em class="${u.score >= 80 ? "r" : ""}">${u.score}</em></b>
          <span>来自「${u.from.c}」· ${u.from.ch}</span>
        </div>
        <span class="v20-tag ${u.stage}">${u.tag}</span>
      </div>
      <div class="v20-c-stuck">${u.stuck}</div>
      <div class="v20-c-ft">
        <span>${u.bought}</span>
        <em>去聊 ›</em>
      </div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">客户<small>128 位 · 今天该跟 ${grp.hot.length} 位</small></div>
      <span class="act" data-go="G3.1" data-label="客户规则">规则</span>
    </div>

    <div class="body">
      <div class="v20-sum">
        <div><b>128</b><span>全部客户</span></div>
        <div class="on"><b>${grp.hot.length}</b><span>该跟了</span></div>
        <div><b>7</b><span>已成交</span></div>
      </div>

      <div class="chips" style="margin:14px 0 12px">
        ${[["all", "全部 128"], ["hot", "该跟 " + grp.hot.length], ["warm", "聊过 " + grp.warm.length], ["cold", "只看看 " + grp.cold.length], ["deal", "买过 " + grp.deal.length]]
          .map(([k, tx]) => `<span class="chip ${f === k ? "on" : ""}" data-set="A8.2.f=${k}">${tx}</span>`).join("")}
      </div>

      ${list.map(card).join("")}

      <div class="xs" style="margin:14px 2px 4px;line-height:1.7">
        客户全部来自你发出去的内容。分数只是排序用的，「卡在哪、怎么聊」才是重点。
      </div>
    </div>

    ${C.tab8("A8.2")}
  </div>`;
};
