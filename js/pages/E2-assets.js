window.PAGES["E2"].prd = "PRD §6.21 · 素材库（我的 / 好友 / 团队 · 三空间同一骨架：动静 + 三个文件夹）";
window.PAGES["E2"].states = [
  { k: "", n: "我的：先看我的变动流水，再进三个文件夹" },
  { k: "side=friend", n: "好友：他们的更新 + 三个文件夹" },
  { k: "side=team", n: "团队：任务 → 通知 → 三个文件夹 → 最新作品 → 动态" },
  { k: "open=asset", n: "进了「视频素材」：三视图 + 内容" },
  { k: "open=asset&view=folder", n: "按文件夹看：每摞一块阵地" },
  { k: "team=0", n: "没加入团队：只有「我的」和「好友」" }
];

/* 素材库。第五版，结构终于收敛成一句话：
   **三个空间（我的 / 好友 / 团队），每个空间都是"一段动静 + 三个文件夹"。**

   为什么三个空间用同一套骨架：它们本质是同一个问题——"这里有什么动静，东西放在哪"。
   差别只在"动静"的来源：
     · 我的   —— 我自己在资料库里干的事（传了素材、用了脚本、建了文件夹）；
     · 好友   —— 他们更新了什么（没人给我派活，只有"他又发了什么"）；
     · 团队   —— 团长派的任务、总部的通知，然后才是大家攒的东西和动静。

   三个文件夹固定是 脚本 / 视频素材 / 作品——不再用一行 tab 去切，
   而是做成三张能看见数量的入口卡：卡片点进去才是那一类的内容。
   tab 看不出"里面有多少"，卡片看得出。 */
window.PAGES["E2"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;
  const LIB = window.DATA.library;

  const teams = LIB.teams || [];
  const teamOn = LIB.teamOn && ctx.team !== "0" && teams.length > 0;
  const friendOn = (LIB.friends || []).length > 0;

  const SIDES = [["mine", "我的"], ["friend", "好友"], ["team", "团队"]].filter(([k]) =>
    k === "mine" || (k === "friend" && friendOn) || (k === "team" && teamOn));
  const side = SIDES.some((s) => s[0] === ctx.side) ? ctx.side : "mine";

  const tid = teams.some((t) => t.id === ctx.tid) ? ctx.tid : (teams[0] || {}).id;
  const team = teams.filter((t) => t.id === tid)[0] || {};

  const KINDS = [["script", "脚本"], ["asset", "视频素材"], ["work", "作品"]];
  const open = KINDS.some((k) => k[0] === ctx.open) ? ctx.open : "";   // 进了哪个文件夹
  const kind = open || "script";
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

  const qs = (kv) => "E2.side=" + side + "&E2.tid=" + tid + "&E2.open=" + open
    + "&E2.kind=" + kind + "&E2.view=" + view
    + "&E2.q=" + q + "&E2.moved=" + movStr + "&E2.nfd=" + nfdStr + "&" + (kv || "");

  const FICON = { script: "文", asset: "图", work: "作" };
  const KBG = {
    script: "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
    asset: "linear-gradient(150deg,#00A8E8,#00C2FF)",
    work: "linear-gradient(150deg,#7C5CFF,#B08CFF)"
  };

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
      <div class="im" style="aspect-ratio:3/4;background:${x.bg || KBG[kind]}">
        ${sel ? `<span class="ck on-im${picked.indexOf(x.id) >= 0 ? " on" : ""}"></span>` : ""}
        ${x.pick ? `<span class="pickmark">精选</span>` : ""}
        <span class="cnt">${x.sub.split(" · ")[0]}</span>
      </div>
      <div class="cap"><b>${x.name}</b></div>
    </div>`;

  const listOf = (arr) => kind === "script"
    ? `<div class="card" style="padding:2px 14px;border-radius:14px">${arr.map(rowScript).join("")}</div>`
    : `<div class="g3">${arr.map(tile).join("")}</div>`;

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

  /* 动态的类型记号：脚本 / 作品 / 素材 / 公告 / 任务 / 成员。
     区分类型是这一版的重点——一眼看出"这是有人发了作品，还是有人改了脚本"。 */
  const TYPE = {
    notice: { ic: "!", bg: "var(--brand-weak)", fg: "var(--brand)" },
    task: { ic: "✓", bg: "var(--warm-weak)", fg: "#C2410C" },
    work: { ic: "▶", bg: "var(--violet-weak)", fg: "var(--violet)" },
    asset: { ic: "▦", bg: "var(--success-weak)", fg: "#0B8C68" },
    script: { ic: "≡", bg: "#EEF1F8", fg: "#5B6B8C" },
    member: { ic: "＋", bg: "var(--success-weak)", fg: "#0B8C68" },
    folder: { ic: "◫", bg: "#EEF1F8", fg: "#5B6B8C" }
  };

  const feedRow = (f) => {
    const t = TYPE[f.type] || TYPE.script;
    return `<div class="frow" ${f.go ? `data-go="${f.go}" data-label="${(f.extra || "").replace(/"/g, "")}"` : ""}>
      <span class="fi" style="background:${t.bg};color:${t.fg}">${t.ic}</span>
      <div class="tx"><b>${f.who ? f.who + (f.who === "我" ? "" : " ") : ""}${f.act}${f.pin ? `<i class="pin">置顶</i>` : ""}</b>
        <span>${f.extra}</span></div>
      <span class="tm">${f.t || ""}</span>
    </div>`;
  };

  /* 流水按天分组：今天 / 昨天 / 前天。没有分节的话，一屏十几条读不出节奏。 */
  const byDay = (arr) => {
    const days = [];
    arr.forEach((f) => {
      const d = f.d || "今天";
      const last = days[days.length - 1];
      if (last && last.d === d) last.items.push(f);
      else days.push({ d, items: [f] });
    });
    return days.map((g) => `<div class="dayhd">${g.d}</div>
      <div class="tfeed">${g.items.map(feedRow).join("")}</div>`).join("");
  };

  const mineLog = LIB.mineFeed.map((f) => ({ ...f, d: f.t, who: "我", t: "" }));
  const friendLog = LIB.friendFeed || [];
  const teamLog = (LIB.teamFeed && LIB.teamFeed[tid]) || [];

  /* 三个文件夹：入口卡。做成卡而不是 tab，是因为卡上能写"里面有多少个"，
     tab 只能写名字——用户点之前就想知道这一摞值不值得点。 */
  const kf3 = `<div class="kf3">
      ${KINDS.map(([k, tx]) =>
        `<b data-set="${qs()}&E2.open=${k}&E2.view=recent&E2.fd=&E2.pick=" data-label="${tx}">
          <i style="background:${KBG[k]}">${FICON[k]}</i>
          <span>${tx}</span><em>${(D.lib(side, k, {}).counts[k])}</em>
        </b>`).join("")}
    </div>`;

  /* 当前打开的那一摞：三视图 + 内容 */
  const openBody = `
    <div class="kfbar">
      <span class="bk" data-set="${qs()}&E2.open=&E2.fd=&E2.pick=">‹ 全部</span>
      <b>${KINDS.filter((k) => k[0] === open).map((k) => k[1])[0] || ""} · ${L.items.length} 个</b>
    </div>
    <div class="sortrow">
      ${VIEWS.map(([k, tx]) =>
        `<span class="s${view === k ? " on" : ""}" data-set="${qs()}&E2.view=${k}&E2.fd=">${tx}</span>`).join("")}
    </div>
    ${grouped
      ? (L.items.length === 0 ? empty : groups.filter((g) => g.list.length || g.fresh).map(fort).join(""))
      : (L.items.length === 0 ? empty : `
          ${curFd ? `<div class="fdfilter">只看「${curFd.name}」 · ${L.items.length} 个
            <b data-set="${qs()}&E2.fd=">取消</b></div>` : ""}
          <div style="margin-top:10px">${listOf(L.items)}</div>`)}`;

  const tasks = (LIB.teamTasks || []).filter((t) => t.state !== "done");
  const taskCard = (t) => `<div class="taskcard" data-go="${t.go}" data-label="${t.t}">
      <div class="th"><b>${t.t}</b><span class="tag o">进行中</span></div>
      <div class="meta">${t.by} 派给 ${t.to} · ${t.due} 截止</div>
      <div class="bar"><i style="width:${Math.round((t.done / t.total) * 100)}%"></i></div>
      <div class="ft"><span>已交 ${t.done}/${t.total}</span><b>去看看 ›</b></div>
    </div>`;

  const latestWorks = D.lib(side, "work", { view: "recent" }).items.slice(0, 4);
  const workStrip = `<div class="lrow">${latestWorks.map((x) => `<div class="lt"
      ${x.go ? `data-go="${x.go}"` : ""} data-label="${x.name}">
      <div class="im" style="background:${x.bg || KBG.work}">▶</div>
      <b>${x.name}</b><span>${x.sub.split(" · ")[0]}</span>
    </div>`).join("")}</div>`;

  /* ---- 三个空间的概览页 ---- */
  const mineView = `
    <div class="sec-h" style="margin:14px 2px 8px"><span class="h2">我的动态</span>
      <span class="more">资料库里的每次变动</span></div>
    ${byDay(mineLog)}
    <div class="sec-h" style="margin:16px 2px 8px"><span class="h2">我的资料</span></div>
    ${kf3}`;

  const friendView = `
    <div class="frrow">${(LIB.friends || []).map((f) => `<div class="frl" data-label="${f.name}">
      <span class="av" style="background:${f.bg}">${f.av}</span>
      <b>${f.name}</b><i>${f.note}</i>
    </div>`).join("")}</div>
    <div class="sec-h" style="margin:15px 2px 8px"><span class="h2">他们的更新</span></div>
    ${byDay(friendLog)}
    <div class="sec-h" style="margin:16px 2px 8px"><span class="h2">好友共享</span></div>
    ${kf3}`;

  const teamView = `
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

    <div class="sec-h" style="margin:15px 2px 8px"><span class="h2">团队任务</span>
      <span class="more" data-go="E4" data-label="全部任务">全部 ›</span></div>
    <div class="tasks">${tasks.map(taskCard).join("")}</div>

    <div class="sec-h" style="margin:16px 2px 8px"><span class="h2">团队通知</span>
      <span class="more" data-go="E5" data-label="全部通知">全部 ›</span></div>
    <div class="tfeed">${LIB.notices.map((n) => `<div class="frow" data-go="${n.go}" data-label="${n.t}">
      <span class="fi" style="background:var(--brand-weak);color:var(--brand)">!</span>
      <div class="tx"><b>${n.t}${n.unread ? `<i class="pin">未读 ${n.unread}</i>` : ""}</b><span>${n.sub}</span></div>
      <span class="tm">${n.at}</span></div>`).join("")}</div>

    <div class="sec-h" style="margin:16px 2px 8px"><span class="h2">团队资料</span>
      <span class="more">脚本 / 素材 / 作品</span></div>
    ${kf3}

    <div class="sec-h" style="margin:16px 2px 8px"><span class="h2">最新作品</span>
      <span class="more" data-set="${qs()}&E2.open=work">全部 ›</span></div>
    ${workStrip}

    <div class="sec-h" style="margin:16px 2px 8px"><span class="h2">团队动态</span>
      <span class="more" data-go="E1" data-label="全部动态">全部 ›</span></div>
    ${byDay(teamLog)}`;

  const overview = side === "team" ? teamView : side === "friend" ? friendView : mineView;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl" style="margin-left:2px">素材库
        <small>${side === "team" ? (team.name || "") + " · " + team.members + " 人"
          : side === "friend" ? "好友共享的 " + (D.lib("friend", "asset", {}).counts.asset + D.lib("friend", "script", {}).counts.script + D.lib("friend", "work", {}).counts.work) + " 份资料"
            : "我的东西 · " + (D.lib("mine", "asset", {}).counts.asset + D.lib("mine", "script", {}).counts.script + D.lib("mine", "work", {}).counts.work) + " 份资料"}</small></div>
      <span class="act" data-set="${sel ? "E2.sel=&E2.pick=&E2.mv=" : "E2.sel=1"}">${sel ? "完成" : "整理"}</span>
    </div>

    <div class="body" style="padding-bottom:120px">
      <div class="sidetabs">
        ${SIDES.map(([k, tx]) => `<b class="${side === k ? "on" : ""}"
          data-set="${qs()}&E2.side=${k}&E2.open=&E2.fd=&E2.pick=">${tx}</b>`).join("")}
      </div>

      <div class="gsearch" style="margin-top:11px;margin-bottom:0">
        <span class="mag">⌕</span>
        <input data-bind="E2.q" data-live value="${q.replace(/"/g, "&quot;")}"
               placeholder="${open ? "搜" + (KINDS.filter((k) => k[0] === open).map((k) => k[1])[0] || "资料") + "名称" : "搜名字，或者先在下面选一类"}" />
        ${q ? `<span class="clr" data-set="E2.q=">清空</span>` : ""}
      </div>

      ${toast ? `<div class="toast"><span>${toast}</span><b data-set="E2.toast=">×</b></div>` : ""}

      ${open ? openBody : overview}
    </div>

    ${sel && open ? `<div class="selbar">
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
