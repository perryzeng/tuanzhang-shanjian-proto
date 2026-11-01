window.PAGES["E2"].prd = "PRD §6.21 · 素材库（我的 / 团队 × 脚本 / 视频素材 / 作品 × 文件夹）";
window.PAGES["E2"].states = [
  { k: "", n: "默认：我的 · 脚本 · 最新" },
  { k: "kind=asset&sort=pick", n: "视频素材 · 精选" },
  { k: "kind=asset&fd=fd_a1", n: "视频素材 · 筛到「产品素材」这个文件夹" },
  { k: "side=team", n: "团队：先看到公告和任务，下面才是三类素材" },
  { k: "team=0", n: "没加入团队：页面上只有「我的」" }
];

/* 素材库。这一页要同时干好三件事，而它们互相拉扯：
   **找得到**（搜索 + 分类）、**摆得清**（文件夹）、**看得快**（网格 + 排序）。

   结构定成三层，每层只回答一个问题：
   ① **哪一摊**：我的 / 团队。团队版才有"团队"，没加入的人只看到"我的"——
      这里刻意不做置灰的入口，没加入团队的人看见一个点不动的 tab，只会以为坏了。
   ② **什么东西**：脚本 / 视频素材 / 作品。只分三类，因为它们对应三种不同的"下一步"：
      脚本拿去生成、素材拿去配画面、作品拿去抄结构或直接发。
   ③ **哪一摞**：用户自己建的文件夹。视频素材下天然会分出产品素材 / 平台介绍 / 素颜视频——
      这不是我们设计的分类，是他自己整理出来的习惯。

   排序（最新 / 最热 / 精选）放在第三层的右侧，不单独占一行：
   它是"这三摞怎么摆"，不是"我要看哪一类"，层级比类别低。

   文件夹不跳页，点一下就地筛选（再点取消）。跳页会把人带离"我在逛我的库"这个上下文，
   回来还得重新选类别和排序。 */
window.PAGES["E2"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;

  const teamOn = window.DATA.library.teamOn && ctx.team !== "0";
  const side = (ctx.side === "team" && teamOn) ? "team" : "mine";
  const KINDS = [["script", "脚本"], ["asset", "视频素材"], ["work", "作品"]];
  const kind = KINDS.some((k) => k[0] === ctx.kind) ? ctx.kind : "script";
  const SORTS = [["new", "最新"], ["hot", "最热"], ["pick", "精选"]];
  const sort = SORTS.some((s) => s[0] === ctx.sort) ? ctx.sort : "new";
  const fd = ctx.fd || "";
  const q = ctx.q || "";

  const L = D.lib(side, kind, { sort, fd, q });
  const curFd = L.folders.filter((f) => f.on)[0];

  /* 换摊 / 换类就清掉文件夹筛选：上一类的文件夹在下一类里不存在，
     留着那个 id 会让列表空着，看着像没数据。 */
  const keep = (extra) => "E2.side=" + side + "&E2.kind=" + kind + "&E2.sort=" + sort + (extra || "") + "&E2.fd=";

  const kindTab = (k, tx) =>
    `<b class="${kind === k ? "on" : ""}" data-set="E2.kind=${k}&E2.fd=">${tx}<i>${L.counts[k]}</i></b>`;

  const sortTab = (k, tx) =>
    `<span class="s${sort === k ? " on" : ""}" data-set="${keep()}&E2.fd=${fd}&E2.sort=${k}">${tx}</span>`;

  /* 文件夹用一个单字（文 / 图 / 作），不用同一套符号——
     跟下面列表行的图标撞了的话，看着像同一类东西叠了两层。 */
  const FICON = { script: "文", asset: "图", work: "作" };
  const folder = (f) => `<div class="fd${f.on ? " on" : ""}"
      data-set="${keep()}&E2.fd=${f.on ? "" : f.id}">
      <span class="fi">${FICON[kind]}</span>
      <div class="ft"><b>${f.name}</b><i>${f.n}</i></div>
    </div>`;

  /* 脚本用列表、素材和作品用网格：
     脚本是一段文字，缩略图对它没有意义；视频和作品本来就是用眼睛挑的。 */
  const scriptRow = (x) => `<div class="srow" data-go="B2?kind=script&src=import" data-label="${x.name}">
      <span class="ic">≡</span>
      <div class="tx"><b>${x.name}</b><span>${x.sub} · ${x.at === 1 ? "今天" : x.at + " 天前"}</span></div>
      <span class="go">›</span>
    </div>`;

  const tile = (x) => `<div class="tile" ${x.go ? `data-go="${x.go}" data-label="${x.name}"` : `data-label="${x.name}"`}>
      <div class="im" style="aspect-ratio:3/4;background:${x.bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)"}">
        ${x.pick ? `<span class="pickmark">精选</span>` : ""}
        <span class="cnt">${x.sub.split(" · ")[0]}</span>
      </div>
      <div class="cap"><b>${x.name}</b></div>
    </div>`;

  const empty = `<div class="emptybox">
      <span class="ei">${q ? "⌕" : "▦"}</span>
      <b>${q ? "没找到「" + q + "」" : "这一摞还是空的"}</b>
      <span>${q ? "换个词试试，或者清掉筛选看全部" : "上传素材、或者新建一个文件夹开始整理"}</span>
      ${q ? `<em data-set="E2.q=">清掉搜索</em>` : ""}
    </div>`;

  const notice = (n) => `<div class="tcard" data-go="${n.go}" data-label="${n.t}">
      <span class="ti" style="background:var(--brand-weak);color:var(--brand)">📢</span>
      <div class="tx"><b>${n.t}${n.unread ? `<i class="dot">${n.unread}</i>` : ""}</b><span>${n.sub}</span></div>
      <span class="go">›</span>
    </div>`;

  const ttask = (t) => `<div class="tcard" data-go="${t.go}" data-label="${t.t}">
      <span class="ti" style="background:var(--warm-weak);color:#C2410C">✓</span>
      <div class="tx"><b>${t.t}</b><span>${t.sub} · ${t.at}</span></div>
      <span class="go">›</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "素材", t: "素材库", act: `<span class="btn-pill">↑ 上传</span>` })}

    <div class="body">
      <!-- 第一层：哪一摊。团队版才有第二个 tab -->
      <div class="sidetabs">
        <b class="${side === "mine" ? "on" : ""}" data-set="E2.side=mine&E2.kind=${kind}&E2.fd=">我的</b>
        ${teamOn ? `<b class="${side === "team" ? "on" : ""}" data-set="E2.side=team&E2.kind=${kind}&E2.fd=">团队</b>` : ""}
      </div>

      <div class="gsearch" style="margin-top:11px">
        <span class="mag">⌕</span>
        <input data-bind="E2.q" data-live value="${q.replace(/"/g, "&quot;")}"
               placeholder="搜脚本、素材、作品" />
        ${q ? `<span class="clr" data-set="E2.q=">清空</span>` : ""}
      </div>

      <!-- 团队 tab 顶上的公告和任务：**只放一条最新的公告 + 一条任务**。
           上一版三条全铺开，一进来半屏都是公告，素材被挤到看不见——
           素材库的主体是素材，公告点到为止，"还有几条"给个入口就行。 -->
      ${side === "team" ? `<div class="tcards">
        ${window.DATA.library.notices.slice(0, 1).map(notice).join("")}
        ${window.DATA.library.notices.length > 1
          ? `<div class="tmore" data-go="E5" data-label="全部公告">还有 ${window.DATA.library.notices.length - 1} 条公告</div>` : ""}
        ${window.DATA.library.teamTasks.map(ttask).join("")}
      </div>` : ""}

      <!-- 第二层：什么东西 -->
      <div class="kindtabs">${KINDS.map((k) => kindTab(k[0], k[1])).join("")}</div>

      <!-- 第三层：怎么摆 + 怎么整理 -->
      <div class="sortrow">
        ${SORTS.map((s) => sortTab(s[0], s[1])).join("")}
        <span class="add" data-label="新建文件夹">＋ 新建文件夹</span>
      </div>

      ${L.folders.length ? `<div class="fdrow">${L.folders.map(folder).join("")}</div>` : ""}

      ${curFd ? `<div class="fdfilter">只看「${curFd.name}」 · ${L.items.length} 个
        <b data-set="${keep()}&E2.fd=">取消</b></div>` : ""}

      ${L.items.length === 0 ? empty
        : kind === "script"
          ? `<div class="card" style="padding:2px 14px;margin-top:10px;border-radius:14px">${L.items.map(scriptRow).join("")}</div>`
          : `<div class="g3" style="margin-top:10px">${L.items.map(tile).join("")}</div>`}
    </div>

    ${C.tab("E2")}
  </div>`;
};
