/* A8.3 小组（V16.6 · 公告 / 任务 / 动态）
   原来是「团队」，混了数据、口径、任务、排行、素材入口，像个管理后台。
   现在只留三块，都是成员一天里真的会看的：

   ① 公告 —— 组长说的。口径变了没、什么时候开会，错过会讲错话。
   ② 任务 —— 我要交的。带进度和截止。
   ③ 动态 —— 组里刚发生什么。谁交了、谁被夸、谁掉队了。

   删掉的是：全组数据大卡（在作品/客户里）、成员排行（压力不是动力）、
   素材入口（在「我的」里）。 */

window.PAGES["A8.3"].prd = "PRD V16 §4 · 小组（公告 / 任务 / 动态）";
window.PAGES["A8.3"].sysEntry = "底部 tab「小组」";

window.PAGES["A8.3"].render = function () {
  const C = window.C, T = window.LIB.team;
  const mine = T.tasks.filter((t) => t.me);
  const top = T.notices.filter((n) => n.top)[0];
  const rest = T.notices.filter((n) => !n.top);

  const KIND = {
    done: { ic: "交", cls: "" },
    praise: { ic: "赞", cls: "praise" },
    post: { ic: "发", cls: "" },
    warn: { ic: "催", cls: "warn" },
    join: { ic: "新", cls: "" }
  };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">${T.name}<small>${T.members} 人 · 我是成员</small></div>
      <span class="act" data-go="E3" data-label="组信息">组信息</span>
    </div>

    <div class="body">

      ${top ? `<div class="v22-nt">
        <div class="v22-nt-hd">
          <span class="v22-nt-k">置顶公告</span>
          <em>${top.from} · ${top.at}</em>
        </div>
        <b>${top.t}</b>
        <p>${top.body}</p>
      </div>` : ""}

      ${rest.length ? `<div class="v22-nt-sub" data-go="E5" data-label="全部公告">
        <span>${rest[0].t}</span>
        <em>还有 ${rest.length} 条 ›</em>
      </div>` : ""}

      ${C.sec("派给我的活", mine.length + " 条", "E4.2")}
      ${mine.map((t) => `<div class="v16-task2 ${t.due.indexOf("今天") >= 0 ? "on" : ""}" data-go="A8" data-label="${t.t}">
        <div class="v16-task2-hd">
          <b>${t.t}</b>
          <span class="${t.due.indexOf("今天") >= 0 ? "hot" : ""}">${t.due}</span>
        </div>
        <div class="v16-task2-bar"><i style="width:${Math.round(t.done / t.total * 100)}%"></i></div>
        <div class="v16-task2-ft">
          <span>${t.done} / ${t.total} 人已交</span>
          <span class="v16-task2-go">去交 ›</span>
        </div>
      </div>`).join("")}

      ${C.sec("组里动态", "看全部 ›", "E1")}
      <div class="v22-fd">
        ${T.feed.map((f) => {
          const k = KIND[f.k] || KIND.post;
          return `<div class="v22-fd-i ${k.cls}">
            <i class="v22-fd-ic">${k.ic}</i>
            <div class="v22-fd-tx">
              <p><b>${f.who}</b> ${f.act}</p>
              <span>${f.at}</span>
            </div>
          </div>`;
        }).join("")}
      </div>

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        动态只显示和你有关的：任务、表扬、组里的新片。不推送成员的私聊和客户。
      </div>
    </div>

    ${C.tab8("A8.3")}
  </div>`;
};
