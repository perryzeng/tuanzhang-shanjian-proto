window.PAGES["E2"].prd = "PRD §6.21 · 素材库（我的 / 团队 · 团队首页三个方案 + 三类资料 + 三视图）";
window.PAGES["E2"].states = [
  { k: "", n: "我的：头条是我的最近动态，下面才是三类" },
  { k: "view=folder", n: "按文件夹看：每摞一块阵地" },
  { k: "side=team", n: "团队 · 方案 A：四个 tab（动态 / 任务 / 公告 / 资料）" },
  { k: "side=team&v=b", n: "团队 · 方案 B：动态流水为主，最新资料露出一截" },
  { k: "side=team&v=c", n: "团队 · 方案 C：四宫格入口 + 最近更新" },
  { k: "side=team&ttab=lib", n: "团队 · 方案 A 的资料 tab（脚本 / 素材 / 作品）" }
];

/* 素材库。"我的"和"团队"是两件不同的事，所以分两套渲染：

   **我的** = 仓库 + 我最近的动静。
   **团队** = 一个工作现场：谁干了什么（动态）、团长派了什么活（任务）、
   总部说了什么（公告）、大家攒下了什么（资料库）。

   团队首页做了三个方案，用顶部的小胶囊切，方便对比：
   A · 四个 tab    —— 最直白，一个 tab 一类，不多不少；
   B · 动态为主    —— 打开先看"今天发生了什么"，任务/公告/资料做成三个入口条；
   C · 四宫格      —— 四张入口卡各带一条预览，再往下是"最近进库"。
   三套共用同一批数据，只换摆法。 */
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

  /* 团队首页的三种摆法 + 方案 A 里的四个 tab */
  const tv = ["a", "b", "c"].indexOf(ctx.v) >= 0 ? ctx.v : "a";
  const ttab = ["log", "task", "notice", "lib"].indexOf(ctx.ttab) >= 0 ? ctx.ttab : "log";

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

  const qs = (kv) => "E2.side=" + side + "&E2.tid=" + tid + "&E2.v=" + tv + "&E2.ttab=" + ttab
    + "&E2.kind=" + kind + "&E2.view=" + view
    + "&E2.q=" + q + "&E2.moved=" + movStr + "&E2.nfd=" + nfdStr + "&" + (kv || "");

  const FICON = { script: "文", asset: "图", work: "作" };

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

  const mineCard = (f) => `<div class="mf" ${f.go ? `data-go="${f.go}" data-label="${f.act}"` : ""}>
      <span class="mt">${f.t}</span>
      <b>${f.act}</b>
      <span class="me">${f.extra}</span>
    </div>`;

  const TYPE = {
    notice: { ic: "!", bg: "var(--brand-weak)", fg: "var(--brand)" },
    task: { ic: "✓", bg: "var(--warm-weak)", fg: "#C2410C" },
    work: { ic: "▶", bg: "var(--violet-weak)", fg: "var(--violet)" },
    asset: { ic: "▦", bg: "var(--success-weak)", fg: "#0B8C68" },
    script: { ic: "≡", bg: "#EEF1F8", fg: "#5B6B8C" }
  };

  /* 动态 = 流水账。谁干了什么，按天分组往下排，不合并、不总结。 */
  const feedRow = (f) => {
    const t = TYPE[f.type] || TYPE.script;
    return `<div class="frow" ${f.go ? `data-go="${f.go}" data-label="${f.extra.replace(/"/g, "")}"` : ""}>
      <span class="fi" style="background:${t.bg};color:${t.fg}">${t.ic}</span>
      <div class="tx"><b>${f.who} ${f.act}${f.pin ? `<i class="pin">置顶</i>` : ""}</b><span>${f.extra}</span></div>
      <span class="tm">${f.t}</span>
    </div>`;
  };
  const feed = (LIB.teamFeed && LIB.teamFeed[tid]) || [];
  const days = [];
  feed.forEach((f) => {
    const last = days[days.length - 1];
    if (last && last.d === f.d) last.items.push(f);
    else days.push({ d: f.d, items: [f] });
  });
  const logBody = days.map((g) => `<div class="dayhd">${g.d}</div>
    <div class="tfeed">${g.items.map(feedRow).join("")}</div>`).join("");

  /* 任务 = 团长派给全员的剪辑任务。带进度：还差几个人交。 */
  const tasks = LIB.teamTasks || [];
  const doingTasks = tasks.filter((t) => t.state !== "done");
  const taskCard = (t) => {
    const pct = Math.round((t.done / t.total) * 100);
    return `<div class="taskcard" data-go="${t.go}" data-label="${t.t}">
      <div class="th"><b>${t.t}</b>
        <span class="tag ${t.state === "done" ? "g" : "o"}">${t.state === "done" ? "已结束" : "进行中"}</span></div>
      <div class="meta">${t.by} 派给 ${t.to} · ${t.due}${t.state === "done" ? "" : " 截止"}</div>
      <div class="bar"><i style="width:${pct}%"></i></div>
      <div class="ft"><span>已交 ${t.done}/${t.total}</span>
        <b>${t.state === "done" ? "看结果" : "去看"}</b></div>
    </div>`;
  };

  const noticeRow = (n) => `<div class="frow" data-go="${n.go}" data-label="${n.t}">
      <span class="fi" style="background:var(--brand-weak);color:var(--brand)">!</span>
      <div class="tx"><b>${n.t}${n.unread ? `<i class="pin">未读 ${n.unread}</i>` : ""}</b><span>${n.sub}</span></div>
      <span class="tm">${n.at}</span>
    </div>`;

  /* 最新进库：三类各取最新两条，混在一起按时间排。
     团队的首页得让人"扫一眼就知道这两天进了什么"，再点进对应类看全部。 */
  const latest = ["asset", "work", "script"].flatMap((k) =>
    D.lib(side, k, { view: "recent" }).items.slice(0, 2).map((x) => ({ ...x, _k: k })))
    .sort((a, b) => a.at - b.at).slice(0, 4);

  /* 三类各一个底色：三张卡并排时，颜色是唯一能瞬间区分"这是脚本还是作品"的线索 */
  const KBG = {
    script: "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
    asset: "linear-gradient(150deg,#00A8E8,#00C2FF)",
    work: "linear-gradient(150deg,#7C5CFF,#B08CFF)"
  };
  const latestRow = `<div class="lrow">${latest.map((x) => `<div class="lt" data-go="${x.go || ""}"
      data-label="${x.name}">
      <div class="im" style="background:${x.bg || KBG[x._k] || KBG.script}">${FICON[x._k] || "文"}</div>
      <b>${x.name}</b><span>${x.at === 1 ? "今天" : x.at + " 天前"}</span>
    </div>`).join("")}</div>`;

  const teamCard = `<div class="teamsw">
      <span class="ava">${(team.name || "团").slice(0, 1)}</span>
      <div class="tx"><b>${team.name || ""}</b>
        <span>${team.role} · ${team.members} 人 · ${team.day}</span></div>
      ${teams.length > 1 ? `<span class="chg" data-set="${qs()}&E2.tsw=${tsw ? "" : "1"}">切换 ${tsw ? "▴" : "▾"}</span>` : ""}
    </div>
    ${tsw && teams.length > 1 ? `<div class="teamlist">
      ${teams.map((t) => `<b class="${t.id === tid ? "on" : ""}" data-set="${qs()}&E2.tid=${t.id}&E2.tsw=&E2.fd=">
        <i>${t.name.slice(0, 1)}</i>${t.name}<em>${t.members} 人</em>${t.id === tid ? "✓" : ""}</b>`).join("")}
    </div>` : ""}`;

  /* 方案切换器：三个都摆在明面上，方便对比，定下来之后这块会删掉 */
  const vswitch = `<div class="vswitch">
      ${[["a", "A · 四个 tab"], ["b", "B · 动态为主"], ["c", "C · 四宫格"]].map(([k, tx]) =>
        `<b class="${tv === k ? "on" : ""}" data-set="${qs()}&E2.v=${k}">${tx}</b>`).join("")}
    </div>`;

  const libBlock = `${grouped
    ? (L.items.length === 0 ? empty : groups.filter((g) => g.list.length || g.fresh).map(fort).join(""))
    : (L.items.length === 0 ? empty : `
        ${curFd ? `<div class="fdfilter">只看「${curFd.name}」 · ${L.items.length} 个
          <b data-set="${qs()}&E2.fd=">取消</b></div>` : ""}
        ${q ? `<div class="xs" style="margin:11px 2px 0">搜到 ${L.items.length} 个</div>` : ""}
        <div style="margin-top:10px">${listOf(L.items)}</div>`)}`;

  const kindTabs = `<div class="kindtabs">
      ${KINDS.map(([k, tx]) =>
        `<b class="${kind === k ? "on" : ""}" data-set="${qs()}&E2.kind=${k}&E2.view=recent&E2.fd=&E2.pick=">${tx}<i>${L.counts[k]}</i></b>`).join("")}
    </div>
    <div class="sortrow">
      ${VIEWS.map(([k, tx]) =>
        `<span class="s${view === k ? " on" : ""}" data-set="${qs()}&E2.view=${k}&E2.fd=">${tx}</span>`).join("")}
      <span class="add" style="color:var(--text-4);font-weight:500">${sel ? "勾选要整理的" : "共 " + L.items.length + " 个"}</span>
    </div>`;

  /* ---------- 团队首页：三个方案 ---------- */
  let teamBody = "";

  if (tv === "a") {
    const TTABS = [["log", "动态"], ["task", "任务"], ["notice", "公告"], ["lib", "资料"]];
    teamBody = `${teamCard}
      <div class="vtabs">
        ${TTABS.map(([k, tx]) =>
          `<b class="${ttab === k ? "on" : ""}" data-set="${qs()}&E2.ttab=${k}">
            ${tx}${k === "task" ? `<i>${doingTasks.length}</i>` : k === "notice" ? `<i>${LIB.notices.filter((n) => n.unread).length}</i>` : ""}</b>`).join("")}
      </div>
      ${ttab === "log" ? logBody
        : ttab === "task" ? `<div class="tasks">${tasks.map(taskCard).join("")}</div>`
          : ttab === "notice" ? `<div class="tfeed" style="margin-top:11px">${LIB.notices.map(noticeRow).join("")}</div>`
            : `${kindTabs}${libBlock}`}`;
  } else if (tv === "b") {
    teamBody = `${teamCard}
      <div class="quick3">
        <b data-set="${qs()}&E2.v=a&E2.ttab=task"><em>${doingTasks.length}</em>任务待交</b>
        <b data-set="${qs()}&E2.v=a&E2.ttab=notice"><em>${LIB.notices.filter((n) => n.unread).length}</em>公告未读</b>
        <b data-set="${qs()}&E2.v=a&E2.ttab=lib"><em>${L.counts.script + L.counts.asset + L.counts.work}</em>份资料</b>
      </div>
      <div class="sec-h" style="margin:15px 2px 8px"><span class="h2">最近进库</span>
        <span class="more" data-set="${qs()}&E2.v=a&E2.ttab=lib">全部资料 ›</span></div>
      ${latestRow}
      <div class="sec-h" style="margin:15px 2px 8px"><span class="h2">团队动态</span>
        <span class="more" data-go="E1" data-label="全部动态">全部 ›</span></div>
      ${logBody}`;
  } else {
    const g = (ic, bg, fg, title, sub, go, set) => `<div class="qcard" ${set ? `data-set="${set}"` : `data-go="${go}"`}
        data-label="${title}">
        <span class="qi" style="background:${bg};color:${fg}">${ic}</span>
        <b>${title}</b><span class="qs">${sub}</span>
      </div>`;
    teamBody = `${teamCard}
      <div class="qgrid">
        ${g("◉", "var(--brand-weak)", "var(--brand)", "动态",
          feed[0] ? feed[0].who + " " + feed[0].act : "还没有动静",
          "E1", `E2.v=a&E2.ttab=log`)}
        ${g("✓", "var(--warm-weak)", "#C2410C", "任务 " + doingTasks.length, "还有没交的", "E4", `E2.v=a&E2.ttab=task`)}
        ${g("!", "var(--brand-weak)", "var(--brand)", "公告 " + LIB.notices.length,
          LIB.notices[0] ? LIB.notices[0].t : "", "E5", `E2.v=a&E2.ttab=notice`)}
        ${g("▦", "var(--success-weak)", "#0B8C68", "资料库",
          L.counts.script + L.counts.asset + L.counts.work + " 份", "", `E2.v=a&E2.ttab=lib`)}
      </div>
      <div class="sec-h" style="margin:15px 2px 8px"><span class="h2">最近进库</span>
        <span class="more" data-set="${qs()}&E2.v=a&E2.ttab=lib">全部资料 ›</span></div>
      ${latestRow}`;
  }

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

      ${side === "mine" ? `
        <div class="gsearch" style="margin-top:11px;margin-bottom:0">
          <span class="mag">⌕</span>
          <input data-bind="E2.q" data-live value="${q.replace(/"/g, "&quot;")}"
                 placeholder="搜${kind === "script" ? "脚本" : kind === "asset" ? "素材" : "作品"}名称" />
          ${q ? `<span class="clr" data-set="E2.q=">清空</span>` : ""}
        </div>
        <div class="sec-h" style="margin:14px 2px 8px"><span class="h2">我最近</span></div>
        <div class="mfeed">${LIB.mineFeed.map(mineCard).join("")}</div>
        ${kindTabs}
        ${toast ? `<div class="toast"><span>${toast}</span><b data-set="E2.toast=">×</b></div>` : ""}
        ${libBlock}
      ` : `
        ${vswitch}
        ${teamBody}
        ${ttab === "lib" && tv === "a" && toast ? `<div class="toast"><span>${toast}</span><b data-set="E2.toast=">×</b></div>` : ""}
      `}
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
