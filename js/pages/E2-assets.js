window.PAGES["E2"].prd = "PRD §6.21 · 素材库（我的 / 团队 · 首页动态 + 三类 + 三视图 + 文件夹阵地）";
window.PAGES["E2"].states = [
  { k: "", n: "我的：头条是我的最近动态，下面才是三类" },
  { k: "view=folder", n: "按文件夹看：每摞一块阵地" },
  { k: "side=team", n: "团队首页：公告 / 任务 / 动态混排成一条流" },
  { k: "side=team&tsw=1", n: "加入多个团时，顶部可以切团" },
  { k: "sel=1", n: "整理模式：勾选后批量移动" },
  { k: "team=0", n: "没加入团队：只有「我的」" }
];

/* 素材库。第三版，用户提了三个新要求，每个都把这一页往上抬了一层：

   ① **"我的"也要有 Portal 感**：进来第一眼不是"共 12 个素材"，而是"我最近干了什么"——
      昨天传了三条素颜视频、今天用了开团话术。这比一个总数更能帮人找回上下文。
   ② **每个类下面换成三个视图**：`最近用的 / 我精选的 / 文件夹`。
      它们不是排序（上一版是"最新/最热/精选"），而是三种"我想怎么找"：
      找刚才用过的那条、找我挑出来的那几条、找我整理进某个夹子的那几条。
   ③ **团队要像个首页，不像个文件夹**：公告、任务、动态**混排成一条时间流**（论坛感），
      而不是三个区块各摆一摞——分区块看着整齐，但没人会挨个区块看完。
      团队的素材文件夹做成"阵地"（整块卡 + 彩色头），不是一个行内小标题。

   一个人可以加入多个团：多团时顶部给切换器，只有一个团就不显示切换器，直接是它的首页。 */
window.PAGES["E2"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;
  const LIB = window.DATA.library;

  const teams = LIB.teams || [];
  const teamOn = LIB.teamOn && ctx.team !== "0" && teams.length > 0;
  const side = (ctx.side === "team" && teamOn) ? "team" : "mine";
  const tid = teams.some((t) => t.id === ctx.tid) ? ctx.tid : (teams[0] || {}).id;
  const team = teams.filter((t) => t.id === tid)[0] || {};

  const KINDS = [["script", "脚本"], ["asset", "视频素材"], ["work", "作品"]];
  const kind = KINDS.some((k) => k[0] === ctx.kind) ? ctx.kind : "script";
  const VIEWS = [["recent", "最近用的"], ["pick", "我精选的"], ["folder", "文件夹"]];
  const view = VIEWS.some((v) => v[0] === ctx.view) ? ctx.view : "recent";
  const fd = ctx.fd || "";
  const q = ctx.q || "";
  const sel = ctx.sel === "1";
  const picked = (ctx.pick || "").split(",").filter(Boolean);
  const mvOpen = ctx.mv === "1";
  const toast = ctx.toast || "";
  const fabOpen = ctx.new === "1";
  const tsw = ctx.tsw === "1";

  const movStr = ctx.moved || "";
  const moved = {};
  movStr.split(";").forEach((pair) => {
    const a = pair.split(">")[0], b = pair.split(">")[1];
    if (a && b) moved[a] = b;
  });
  const nfdStr = ctx.nfd || "";
  const extraFd = nfdStr.split(",").filter(Boolean).map((n, i) => ({ id: "nf" + i, name: n, n: 0, fresh: true }));

  const L = D.lib(side, kind, { view, fd, q, moved });
  const folders = L.folders.concat(extraFd);
  const curFd = folders.filter((f) => f.on)[0];

  const qs = (kv) => "E2.side=" + side + "&E2.tid=" + tid + "&E2.kind=" + kind + "&E2.view=" + view
    + "&E2.q=" + q + "&E2.moved=" + movStr + "&E2.nfd=" + nfdStr + "&" + (kv || "");

  const FICON = { script: "文", asset: "图", work: "作" };

  /* 点了某个阵地的"全部"就退出分组、只显示这一摞——否则还是分组视图，看着像没反应 */
  const grouped = view === "folder" && !fd && !q;
  const groups = folders.map((f) => ({ ...f, list: L.items.filter((x) => x.fd === f.id) }));
  const loose = L.items.filter((x) => !folders.some((f) => f.id === x.fd));
  if (loose.length) groups.push({ id: "", name: "未分类", n: loose.length, list: loose });

  const toggle = (id) => "E2.pick=" + (picked.indexOf(id) >= 0
    ? picked.filter((x) => x !== id) : picked.concat(id)).join(",");

  const rowScript = (x) => `<div class="srow" ${sel
      ? `data-set="${qs(toggle(x.id))}"`
      : `data-go="E2.2?id=${x.id}" data-label="${x.name}"`}>
      ${sel ? `<span class="ck${picked.indexOf(x.id) >= 0 ? " on" : ""}"></span>` : ""}
      <span class="ic">≡</span>
      <div class="tx"><b>${x.name}</b><span>${x.sub} · ${x.at === 1 ? "今天" : x.at + " 天前"}</span></div>
      ${sel ? "" : `<span class="go">›</span>`}
    </div>`;

  const tile = (x) => `<div class="tile" ${sel
      ? `data-set="${qs(toggle(x.id))}"`
      : x.go ? `data-go="${x.go}" data-label="${x.name}"` : `data-label="${x.name}"`}>
      <div class="im" style="aspect-ratio:3/4;background:${x.bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)"}">
        ${sel ? `<span class="ck on-im${picked.indexOf(x.id) >= 0 ? " on" : ""}"></span>` : ""}
        ${x.pick ? `<span class="pickmark">精选</span>` : ""}
        <span class="cnt">${x.sub.split(" · ")[0]}</span>
      </div>
      <div class="cap"><b>${x.name}</b></div>
    </div>`;

  const listOf = (arr) => kind === "script"
    ? `<div class="card" style="padding:2px 14px;border-radius:14px">${arr.map(rowScript).join("")}</div>`
    : `<div class="g3">${arr.map(tile).join("")}</div>`;

  /* 阵地：整块卡 + 彩色头，不是一个行内小标题。
     团队的文件夹要有"这是我的一块地盘"的感觉，才愿意往里放东西。 */
  const fort = (g) => `<div class="fdz${side === "team" ? " tm" : ""}">
      <div class="fdh" ${g.id ? `data-set="${qs()}&E2.fd=${fd === g.id ? "" : g.id}"` : ""}>
        <span class="fi">${g.id ? FICON[kind] : "·"}</span>
        <b>${g.name}</b><i>${g.list.length}</i>
        ${g.id ? `<span class="more">${fd === g.id ? "收起" : "全部"} ›</span>` : ""}
      </div>
      <div class="fdb">
        ${g.list.length ? listOf(g.list.slice(0, 3))
          : `<div class="gempty">这一摞还空着 · 用「整理 → 移动到」把东西挪进来</div>`}
        ${g.list.length > 3 ? `<div class="gmore" data-set="${qs()}&E2.fd=${g.id}">这一摞还有 ${g.list.length - 3} 个 ›</div>` : ""}
      </div>
    </div>`;

  const empty = `<div class="emptybox">
      <span class="ei">${q ? "⌕" : "▦"}</span>
      <b>${q ? "没找到「" + q + "」" : view === "pick" ? "还没挑过精选" : "这一摞还是空的"}</b>
      <span>${q ? "换个词试试，或者清掉搜索看全部"
        : view === "pick" ? "看到好用的，在整理模式里点「设为精选」" : "上传素材、或者新建一个文件夹开始整理"}</span>
      ${q ? `<em data-set="E2.q=">清掉搜索</em>` : ""}
    </div>`;

  /* 我的动态：横着排的几张卡，不占竖空间。
     这是"Portal 感"的来源——进来先看到自己最近在忙什么。 */
  const mineCard = (f) => `<div class="mf" ${f.go ? `data-go="${f.go}" data-label="${f.act}"` : ""}>
      <span class="mt">${f.t}</span>
      <b>${f.act}</b>
      <span class="me">${f.extra}</span>
    </div>`;

  const TYPE = {
    notice: { ic: "📢", bg: "var(--brand-weak)", fg: "var(--brand)" },
    task: { ic: "✓", bg: "var(--warm-weak)", fg: "#C2410C" },
    work: { ic: "▶", bg: "var(--violet-weak)", fg: "var(--violet)" },
    asset: { ic: "▦", bg: "var(--success-weak)", fg: "#0B8C68" },
    script: { ic: "≡", bg: "#EEF1F8", fg: "#5B6B8C" }
  };

  const feedRow = (f) => {
    const t = TYPE[f.type] || TYPE.script;
    return `<div class="frow" ${f.go ? `data-go="${f.go}" data-label="${f.extra.replace(/"/g, "")}"` : ""}>
      <span class="fi" style="background:${t.bg};color:${t.fg}">${t.ic}</span>
      <div class="tx"><b>${f.who} ${f.act}${f.pin ? `<i class="pin">置顶</i>` : ""}</b><span>${f.extra}</span></div>
      <span class="tm">${f.t.replace("今天 ", "").replace("昨天 ", "昨 ").replace("前天 ", "前 ")}</span>
    </div>`;
  };

  const feed = (LIB.teamFeed && LIB.teamFeed[tid]) || [];

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl" style="margin-left:2px">素材库
        <small>${side === "team" ? (team.name || "") + " · " + team.members + " 人"
          : "我的东西 · " + L.counts[kind] + " 个" + (kind === "script" ? "脚本" : kind === "asset" ? "素材" : "作品")}</small></div>
      <span class="act" data-set="${sel ? "E2.sel=&E2.pick=&E2.mv=" : "E2.sel=1"}">${sel ? "完成" : "整理"}</span>
    </div>

    <div class="body" style="padding-bottom:92px">
      <div class="sidetabs">
        <b class="${side === "mine" ? "on" : ""}" data-set="${qs()}&E2.side=mine&E2.fd=&E2.pick=">我的</b>
        ${teamOn ? `<b class="${side === "team" ? "on" : ""}" data-set="${qs()}&E2.side=team&E2.fd=&E2.pick=">团队</b>` : ""}
      </div>

      <div class="gsearch" style="margin-top:11px;margin-bottom:0">
        <span class="mag">⌕</span>
        <input data-bind="E2.q" data-live value="${q.replace(/"/g, "&quot;")}"
               placeholder="搜${kind === "script" ? "脚本" : kind === "asset" ? "素材" : "作品"}名称" />
        ${q ? `<span class="clr" data-set="E2.q=">清空</span>` : ""}
      </div>

      ${side === "mine" ? `
        <div class="sec-h" style="margin:14px 2px 8px"><span class="h2">我最近</span></div>
        <div class="mfeed">${LIB.mineFeed.map(mineCard).join("")}</div>
      ` : `
        <!-- 多个团才出切换器；只有一个团时它就是个纯标题，不该给"切换"的假入口 -->
        <div class="teamsw">
          <span class="ava">${(team.name || "团").slice(0, 1)}</span>
          <div class="tx"><b>${team.name || ""}</b>
            <span>${team.role} · ${team.members} 人 · ${team.day}</span></div>
          ${teams.length > 1 ? `<span class="chg" data-set="${qs()}&E2.tsw=${tsw ? "" : "1"}">切换 ${tsw ? "▴" : "▾"}</span>` : ""}
        </div>
        ${tsw && teams.length > 1 ? `<div class="teamlist">
          ${teams.map((t) => `<b class="${t.id === tid ? "on" : ""}" data-set="${qs()}&E2.tid=${t.id}&E2.tsw=&E2.fd=">
            <i>${t.name.slice(0, 1)}</i>${t.name}<em>${t.members} 人</em>${t.id === tid ? "✓" : ""}</b>`).join("")}
        </div>` : ""}
        <div class="sec-h" style="margin:14px 2px 8px"><span class="h2">团队动态</span>
          <span class="more" data-go="E1" data-label="全部动态">全部 ›</span></div>
        <div class="tfeed">${feed.map(feedRow).join("")}</div>
      `}

      <div class="kindtabs">
        ${KINDS.map(([k, tx]) =>
          `<b class="${kind === k ? "on" : ""}" data-set="${qs()}&E2.kind=${k}&E2.view=recent&E2.fd=&E2.pick=">${tx}<i>${L.counts[k]}</i></b>`).join("")}
      </div>

      <div class="sortrow">
        ${VIEWS.map(([k, tx]) =>
          `<span class="s${view === k ? " on" : ""}" data-set="${qs()}&E2.view=${k}&E2.fd=">${tx}</span>`).join("")}
        <span class="add" style="color:var(--text-4);font-weight:500">${sel ? "勾选要整理的" : "共 " + L.items.length + " 个"}</span>
      </div>

      ${toast ? `<div class="toast"><span>${toast}</span><b data-set="E2.toast=">×</b></div>` : ""}

      ${grouped
        ? (L.items.length === 0 ? empty : groups.filter((g) => g.list.length || g.fresh).map(fort).join(""))
        : (L.items.length === 0 ? empty : `
            ${curFd ? `<div class="fdfilter">只看「${curFd.name}」 · ${L.items.length} 个
              <b data-set="${qs()}&E2.fd=">取消</b></div>` : ""}
            ${q ? `<div class="xs" style="margin:11px 2px 0">搜到 ${L.items.length} 个</div>` : ""}
            <div style="margin-top:10px">${listOf(L.items)}</div>`)}
    </div>

    ${sel ? `<div class="selbar">
      <b>已选 ${picked.length} 个</b>
      <span class="sb${picked.length ? "" : " off"}" ${picked.length ? `data-set="E2.mv=1"` : ""}>移动到</span>
      <span class="sb${picked.length ? "" : " off"}" ${picked.length ? `data-label="设为精选"` : ""}>设为精选</span>
      <span class="sb${picked.length ? "" : " off"}" ${picked.length ? `data-label="删除"` : ""}>删除</span>
    </div>
    ${mvOpen && picked.length ? `<div class="mvpanel">
      <div class="mh">移动到哪个文件夹</div>
      <div class="mlist">
        ${folders.map((f) => `<b data-set="${qs("E2.moved=" + movStr + (movStr ? ";" : "")
          + picked.map((id) => id + ">" + f.id).join(";") + "&E2.pick=&E2.mv=")}&E2.toast=已移到「${f.name}」">${f.name}</b>`).join("")}
        <b class="nf" data-set="${qs("E2.nfd=" + (nfdStr ? nfdStr + "," : "") + "新建文件夹" + (extraFd.length + 1) + "&E2.pick=&E2.mv=")}&E2.toast=已新建文件夹">＋ 新建文件夹</b>
      </div>
    </div>` : ""}` : ""}

    ${sel ? "" : `${fabOpen ? `<div class="fabmask" data-set="E2.new="></div>
      <div class="fabmenu">
        <b data-set="E2.new=&E2.toast=已打开相册，选好就上传">↑ 上传素材</b>
        <b data-go="B1" data-label="新建脚本">✎ 新建脚本</b>
        <b data-set="E2.new=&E2.nfd=${nfdStr ? nfdStr + "," : ""}新建文件夹${extraFd.length + 1}&E2.toast=已新建文件夹">▦ 新建文件夹</b>
      </div>` : ""}
    <div class="fab${fabOpen ? " open" : ""}" data-set="E2.new=${fabOpen ? "" : "1"}">＋</div>`}

    ${C.tab("E2")}
  </div>`;
};
