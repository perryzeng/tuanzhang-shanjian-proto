/* A8.2 客户（V18 · 四档分层）
   客户不是数据，是一份份档案。但档案要先能**排得清**，否则 128 个人没法管。

   四档不是"感觉"，是证据推出来的：
     重点跟进  问过价 / 买过，而且来过不止一次
     潜在客户  有互动（收藏、点赞、评论），但还没问价
     一般客户  打开过，但一次互动都没有
     新客      刚到，只打开过一次

   所以每张卡都要能回答"凭什么是这档"——靠三个数（打开次数 / 最长停留 / 互动）。
   没有这三个数，"重点跟进"就是拍脑袋。

   顶部不做成三个大数字：
   「128 全部 / 2 该跟 / 7 成交」只告诉你总量，不告诉你形状。
   换成一条**盘子分布条** + 一次行动召唤：你的客户里有多少是冷的、多少是热的，
   今天该动谁。这才是打开这一页该知道的事。 */

window.PAGES["A8.2"].prd = "PRD V18 §3 · 客户（四档分层 / 来源 / 最近访问 / 分档依据）";
window.PAGES["A8.2"].sysEntry = "底部 tab「客户」；对话播报也跳这里";

window.PAGES["A8.2"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const f = ctx.f || "all";
  const all = L.customers;

  const TIER = {
    key: { n: "重点跟进", short: "重点" },
    pot: { n: "潜在客户", short: "潜在" },
    gen: { n: "一般客户", short: "一般" },
    new: { n: "新客", short: "新客" }
  };
  const ORDER = ["key", "pot", "gen", "new"];
  const cnt = (k) => all.filter((x) => x.tier === k).length;
  /* 色点用行内色值，不用类名 —— 「.gen」这种两三个字母的类名全局早有人占了（就是上面那个空态组件），
     撞上之后一个 5px 的点被撑成 57px，整行图例全乱。 */
  const DOT = { key: "#5B4BE0", pot: "#8E7DFF", gen: "#C3BCF2", new: "#D9DAE4" };

  /* 排序：重点在前；同档按分数降序 —— 名单要"最该看的在最上" */
  const list = (f === "all" ? all.slice() : all.filter((x) => x.tier === f))
    .sort((a, b) => ORDER.indexOf(a.tier) - ORDER.indexOf(b.tier) || b.score - a.score);

  const hot = all.filter((x) => x.tier === "key");
  /* 挑一个最该催的：重点档里最久没来的 */
  const cool = hot.slice().sort((a, b) => (a.last.indexOf("今天") >= 0 ? 1 : -1) - (b.last.indexOf("今天") >= 0 ? 1 : -1))[0];

  const card = (u) => `<div class="v28-c" data-go="A8.2.1?u=${u.id}" data-label="${u.name}">
    <div class="v28-hd">
      <i class="v28-av" style="background:${u.bg}">${u.av}</i>
      <div class="v28-tx">
        <b>${u.name}<em class="${u.score >= 80 ? "r" : ""}">${u.score}</em></b>
        <span class="v28-src">来自 ${u.from.ch} · 「${u.from.c}」</span>
      </div>
      <span class="v28-tier ${u.tier}">${TIER[u.tier].n}</span>
    </div>

    <div class="v28-ev">
      ${u.ev.map(([v, k]) => `<div><b>${v}</b><span>${k}</span></div>`).join("")}
    </div>

    <div class="v28-judge">${u.stuck}</div>
    <div class="v28-ft">
      <span class="v28-last${u.last.indexOf("今天") >= 0 ? " on" : ""}">最近 ${u.last} · 共 ${u.visits} 次</span>
      <em>去聊 ›</em>
    </div>
  </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">客户<small>全库 128 位 · 今天要看的 ${all.length} 位</small></div>
      <span class="act" data-go="G3.1" data-label="客户规则">规则</span>
    </div>

    <div class="body">
      <div class="v28-top">
        <div class="v28-top-hd">
          <b>客户盘子</b>
          <em>冷热一眼看清</em>
        </div>
        <div class="v28-bar">
          ${ORDER.map((k) => `<i class="${k}" style="flex:${Math.max(1, cnt(k))}"></i>`).join("")}
        </div>
        <div class="v28-lg">
          <span class="${f === "all" ? "on" : ""}" data-set="A8.2.f=all">全部 <b>${all.length}</b></span>
          ${ORDER.map((k) => `<span class="lg-${k} ${f === k ? "on" : ""}" data-set="A8.2.f=${k}"><i class="u28d" style="background:${DOT[k]}"></i>${TIER[k].short} <b>${cnt(k)}</b></span>`).join("")}
        </div>
      </div>

      ${hot.length && f === "all" ? `<div class="v28-todo" data-set="A8.2.f=key">
        <div>
          <b>今天该跟 ${hot.length} 个</b>
          <span>${cool ? `${cool.name} ${cool.last.indexOf("今天") >= 0 ? "刚来过，趁热聊" : "已经两天没动静了，再放就凉"}` : ""}</span>
        </div>
        <em>›</em>
      </div>` : ""}

      ${list.map(card).join("")}

      <div class="xs" style="margin:14px 2px 4px;line-height:1.7">
        分档不看感觉，看三个数：来过几次、最长停多久、有没有互动。<br>
        点开一个人能看到她的完整轨迹和三条现成话术。
      </div>
    </div>

    ${C.tab8("A8.2")}
  </div>`;
};
