/* A8.2 客户（V19 · 分出层次，也分出进度）
   两个维度都要有，缺一个这一页就没法用：

   ① 分层（tier）—— 这人值多少：重点跟进 / 潜在客户 / 一般客户 / 新客
      靠证据推出来（来过几次 / 最长停留 / 有没有互动），不是拍脑袋。
   ② 跟进（follow）—— 我做到哪了：待跟进 / 已跟进 / 先放着
      这个**不是算出来的，是团长自己点出来的**。

   只有分层：128 个人按价值排好了，你还是不知道今天从谁开始。
   只有跟进：你知道谁没跟，但不知道先跟谁。

   所以头部回答「今天的活干到哪了」，卡片回答「这人值多少、我做到哪了」，
   分层筛选放在 chip 行。三个层次互不打架。

   状态改动走 STATE（`A8.2.f_<id>`），点一下就地重渲染，顶部进度跟着走。 */

window.PAGES["A8.2"].prd = "PRD V19 §3 · 客户（分层 × 跟进状态）";
window.PAGES["A8.2"].sysEntry = "底部 tab「客户」；对话播报也跳这里";

window.PAGES["A8.2"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const f = ctx.f || "all";
  const all = L.customers;

  const TIER = { key: "重点跟进", pot: "潜在客户", gen: "一般客户", new: "新客" };
  const SHORT = { key: "重点", pot: "潜在", gen: "一般", new: "新客" };   // chip 用短名，卡上的标签才用全称
  const ORDER = ["key", "pot", "gen", "new"];
  const cnt = (k) => all.filter((x) => x.tier === k).length;

  /* 跟进状态：数据里给默认值，用户点过的以 STATE 为准 */
  const fs = (u) => ctx["f_" + u.id] || u.follow || "todo";
  const TODO = all.filter((u) => fs(u) === "todo");
  const DONE = all.filter((u) => fs(u) === "done");
  const WAIT = all.filter((u) => fs(u) === "wait");
  const inPlay = TODO.length + DONE.length;
  const pct = inPlay ? Math.round(DONE.length / inPlay * 100) : 0;

  /* 催谁：待跟进里最久没来的那个，没有就抓第一个 */
  const urge = TODO.slice().sort((a, b) => (a.last.indexOf("今天") >= 0 ? 1 : -1) - (b.last.indexOf("今天") >= 0 ? 1 : -1))[0];

  /* 排序：待跟进的永远在前，同状态按分层、再按分数 —— 名单要"最该动的在最上" */
  const rank = (u) => ({ todo: 0, done: 1, wait: 2 }[fs(u)]);
  const list = (f === "all" ? all.slice() : all.filter((x) => x.tier === f))
    .sort((a, b) => rank(a) - rank(b) || ORDER.indexOf(a.tier) - ORDER.indexOf(b.tier) || b.score - a.score);

  const BTN = {
    todo: { tx: "标记已跟进", cls: "todo" },
    done: { tx: "✓ 已跟进", cls: "done" },
    wait: { tx: "先放着", cls: "wait" }
  };

  const card = (u) => {
    const st = fs(u);
    const next = st === "done" ? "todo" : "done";
    const b = BTN[st];
    return `<div class="v28-c" data-go="A8.2.1?u=${u.id}" data-label="${u.name}">
    <div class="v28-hd">
      <i class="v28-av" style="background:${u.bg}">${u.av}</i>
      <div class="v28-tx">
        <b>${u.name}<em class="${u.score >= 80 ? "r" : ""}">${u.score}</em></b>
        <span class="v28-src">来自 ${u.from.ch} · 「${u.from.c}」</span>
      </div>
      <span class="v28-tier ${u.tier}">${TIER[u.tier]}</span>
    </div>

    <div class="v28-ev">
      ${u.ev.map(([v, k]) => `<div><b>${v}</b><span>${k}</span></div>`).join("")}
    </div>

    <div class="v28-judge">${u.stuck}</div>

    <div class="v28-ft">
      <span class="v28-last${u.last.indexOf("今天") >= 0 ? " on" : ""}">最近 ${u.last} · 共 ${u.visits} 次</span>
      <span class="v29-fb ${b.cls}" data-set="A8.2.f_${u.id}=${next}" data-label="${b.tx}">${b.tx}</span>
    </div>
  </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">客户<small>全库 128 位 · 今天要看的 ${all.length} 位</small></div>
      <span class="act" data-go="G3.1" data-label="客户规则">规则</span>
    </div>

    <div class="body">
      <div class="v29-top">
        <div class="v29-top-hd">
          <div>
            <b>今天要跟 ${TODO.length} 个</b>
            <span>${urge ? `${urge.name} 上次来是 ${urge.last}，今天不聊就凉了` : "都跟完了，可以早点收工"}</span>
          </div>
          <em>${DONE.length}<i>/${inPlay}</i></em>
        </div>
        <div class="v29-bar"><i style="width:${pct}%"></i></div>
        <div class="v29-st">
          <div class="todo"><b>${TODO.length}</b><span>待跟进</span></div>
          <div class="done"><b>${DONE.length}</b><span>已跟进</span></div>
          <div class="wait"><b>${WAIT.length}</b><span>先放着</span></div>
        </div>
      </div>

      <div class="chips wrap" style="margin:13px 0 2px">
        <span class="chip ${f === "all" ? "on" : ""}" data-set="A8.2.f=all">全部 ${all.length}</span>
        ${ORDER.map((k) => `<span class="chip ${f === k ? "on" : ""}" data-set="A8.2.f=${k}">${SHORT[k]} ${cnt(k)}</span>`).join("")}
      </div>

      ${list.map(card).join("")}

      <div class="xs" style="margin:14px 2px 4px;line-height:1.7">
        分层看证据：来过几次、最长停多久、有没有互动。<br>
        跟进状态是你自己的动作 —— 聊完了点「已跟进」，还没到时候点「先放着」。
      </div>
    </div>

    ${C.tab8("A8.2")}
  </div>`;
};
