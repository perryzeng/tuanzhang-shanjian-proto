/* A8.1.1 原始素材（V16.1）
   用户"丢进来"的东西，安静地放在积木架后面。
   进来的人只有两种目的：看看我丢过什么、看看哪条还没拆好。

   所以这一页不抢戏：三个状态（能用 / 待处理 / 有问题）打头，
   点任意一条才展开它被拆成了哪些片段。 */

window.PAGES["A8.1.1"].prd = "PRD V16 §2.1 · 原始素材（拆解结果）";
window.PAGES["A8.1.1"].sysEntry = "素材页右上角「我丢的」；也用于查看处理失败的素材";

window.PAGES["A8.1.1"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const src = ctx.s || "all";   /* 按处理状态筛，不按来源：这一页装的是"我丢的"，来源只是出处 */
  const one = L.items.filter((x) => x.id === ctx.a)[0];

  /* ---------- 一条原始料被拆成了什么 ---------- */
  if (one) {
    return `<div class="app">
      ${C.sb()}
      ${C.ab({ title: "这条拆出了什么", sub: one.from + " · " + one.source, back: "A8.1.1", act: "删" })}

      <div class="body">
        <div class="v16-hero">
          <img src="${one.img}" alt="">
          <div class="v16-hero-tx">
            <b>${one.title}</b>
            <span>拆出 ${one.clips} 个片段 · ${one.usable} 个能用 · 质量分 ${one.score}</span>
          </div>
        </div>

        ${one.status === "issue" ? `<div class="v16-warn">⚠ ${one.issue}</div>` : ""}

        ${C.sec("拆出来的片段 " + one.clips + " 个", "按可用度排")}
        ${L.clips.map((c) => `<div class="v16-clip ${c.use ? "" : "off"}">
          <div class="v16-clip-hd"><span class="v16-clip-t">${c.t}</span><i>${c.tag}</i></div>
          <p>${c.txt}</p>
          <div class="v16-clip-ft">
            <span class="${c.use ? "ok" : "no"}">${c.use ? "✓ 已进积木架" : "✕ 没进积木架"}</span>
            <span class="v16-clip-go">单独看 ›</span>
          </div>
        </div>`).join("")}

        <div class="card plain" style="margin-top:12px;padding:13px">
          <div class="xs" style="line-height:1.85">
            能用的片段已经自动进了积木架，按用途分好了类。<br>
            没进的那些要么引战、要么有水印、要么没讲清楚 —— 你要用可以手动放进去。
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ---------- 原始料列表 ---------- */
  const list = src === "all" ? L.items
    : src === "wait" ? L.items.filter((x) => x.status === "processing")
    : src === "bad" ? L.items.filter((x) => x.status === "issue")
    : L.items.filter((x) => x.status === "ready");

  const row = (x) => `<div class="v16-as" data-set="A8.1.1.a=${x.id}">
      <div class="v16-as-th">
        <img src="${x.img}" alt="">
        <span>${x.dur}</span>
      </div>
      <div class="v16-as-tx">
        <b>${x.title}</b>
        <span>${x.from} · 拆出 ${x.clips} 片段 · ${x.usable} 可用</span>
        <div class="v16-as-tags">${x.tags.slice(0, 3).map((t) => `<i>${t}</i>`).join("")}</div>
      </div>
      <div class="v16-as-sc ${x.status === "issue" ? "bad" : x.status === "processing" ? "wait" : ""}">
        ${x.status === "processing" ? "拆解中" : x.status === "issue" ? "有问题" : x.score}
      </div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "原始素材", sub: "U剪会自动拆成片段，拆完进素材库", back: "A8.1", act: "＋ 添加" })}

    <div class="body">
      <div class="v16-libstats">
        <div><b>${L.stats.clips}</b><span>已拆成积木</span></div>
        <div><b>${L.stats.pending}</b><span>还在拆</span></div>
        <div class="bad"><b>${L.stats.issue}</b><span>有问题</span></div>
      </div>

      <div class="chips" style="margin:14px 0 12px">
        ${[["all", "全部 " + L.stats.mine.n], ["ready", "拆好了"], ["wait", "还在拆 " + L.stats.pending], ["bad", "有问题 " + L.stats.issue]]
          .map(([k, tx]) => `<span class="chip ${src === k ? "on" : ""}" data-set="A8.1.1.s=${k}">${tx}</span>`).join("")}
      </div>

      ${list.map(row).join("")}

      ${C.sec("添加什么最有用")}
      <div class="card plain" style="padding:13px">
        <div class="xs" style="line-height:1.85">
          · 传一条链接 → 抓正文、拆要点、标出处<br>
          · 传一段视频 → 按时间切片，逐段打分<br>
          · 传一张图 → 认场景，标能不能当封面<br>
          · 同一件事的多个来源 → 合并成一条，出处都留着
        </div>
      </div>
    </div>
  </div>`;
};
