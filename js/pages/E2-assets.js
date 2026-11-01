window.PAGES["E2"].prd = "PRD §6.21 · 素材库（我的 / 好友 / 团队 · 社区化信息流，三个版本对比）";
window.PAGES["E2"].states = [
  { k: "", n: "方案 A：卡片流（大卡 + 封面 + 互动），社区感最强" },
  { k: "v=b", n: "方案 B：双列瀑布，一屏看六到八个" },
  { k: "v=c", n: "方案 C：紧凑时间线，一行一条，密度最高" },
  { k: "side=team", n: "团队：任务/通知压成一条，下面是流" },
  { k: "open=asset", n: "进了「视频素材」：三视图 + 内容" },
  { k: "team=0", n: "没加入团队：只有「我的」和「好友」" }
];

/* 素材库。第六版，用户说要**社区化 + 信息紧凑**，并想多看几个版本对比。

   上一版是"管理后台"的样子：一摞区块标题 + 一摞卡片，每块都占一屏的一小半，
   打开只看得见两块内容。社区产品的做法恰好相反——**把人当主角、把内容挂在他身上、
   一块块往下刷**，而且每一条都要小到"一屏能看五六条"。

   所以这一版把外层全压扁（团队/我的信息条一行、三个文件夹一行胶囊），
   省下来的空间全给流；流本身出三个版本：
     A 卡片流 —— 大封面 + 头像 + 互动数，社区感最强，一屏两条；
     B 双列瀑布 —— 像发现页，一屏六到八个；
     C 紧凑时间线 —— 一行一条，一屏六到八条，密度最高。 */
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
  const open = KINDS.some((k) => k[0] === ctx.open) ? ctx.open : "";
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

  /* 三个版本的开关（定下来之后删掉） */
  const tv = ["a", "b", "c"].indexOf(ctx.v) >= 0 ? ctx.v : "a";

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

  const qs = (kv) => "E2.side=" + side + "&E2.tid=" + tid + "&E2.v=" + tv + "&E2.open=" + open
    + "&E2.kind=" + kind + "&E2.view=" + view
    + "&E2.q=" + q + "&E2.moved=" + movStr + "&E2.nfd=" + nfdStr + "&" + (kv || "");

  const FICON = { script: "文", asset: "图", work: "作" };
  const KBG = {
    script: "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
    asset: "linear-gradient(150deg,#00A8E8,#00C2FF)",
    work: "linear-gradient(150deg,#7C5CFF,#B08CFF)"
  };

  /* 每类有多少：三个胶囊上要写数字，得先算出来 */
  const CNT = { script: D.lib(side, "script", {}).counts.script, asset: D.lib(side, "asset", {}).counts.asset, work: D.lib(side, "work", {}).counts.work };

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
      <span>${q ? "换个词试试，或者清掉搜索看全部" : "上传素材、或者新建一个文件夹开始整理"}</span>
      ${q ? `<em data-set="E2.q=">清掉搜索</em>` : ""}
    </div>`;

  /* 流里的六类记号：脚本 / 作品 / 素材 / 公告 / 任务 / 新成员 */
  const TYPE = {
    notice: { ic: "!", fg: "var(--brand)", bg: "var(--brand-weak)", grad: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", word: "公告" },
    task: { ic: "✓", fg: "#C2410C", bg: "var(--warm-weak)", grad: "linear-gradient(150deg,#FF7A45,#FFC85B)", word: "任务" },
    work: { ic: "▶", fg: "var(--violet)", bg: "var(--violet-weak)", grad: "linear-gradient(150deg,#7C5CFF,#B08CFF)", word: "作品" },
    asset: { ic: "▦", fg: "#0B8C68", bg: "var(--success-weak)", grad: "linear-gradient(150deg,#00A8E8,#00C2FF)", word: "素材" },
    script: { ic: "≡", fg: "#5B6B8C", bg: "#EEF1F8", grad: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", word: "脚本" },
    member: { ic: "＋", fg: "#0B8C68", bg: "var(--success-weak)", grad: "linear-gradient(150deg,#00B389,#00C2FF)", word: "成员" },
    folder: { ic: "◫", fg: "#5B6B8C", bg: "#EEF1F8", grad: "linear-gradient(150deg,#5B8CFF,#8FB0FF)", word: "整理" }
  };

  /* 头像：团队/好友流是别人的名字首字；"我的"流是我自己 */
  const AV = {};
  (LIB.friends || []).forEach((f) => { AV[f.name] = f; });
  (LIB.teamFeed ? Object.values(LIB.teamFeed).flat() : []).forEach((f) => {
    if (f.who && !AV[f.who]) AV[f.who] = { av: f.who.slice(0, 1), bg: "#2C5BFF" };
  });

  const rawFlow = side === "mine" ? LIB.mineFeed.map((f) => ({ ...f, d: f.t, who: "我", t: "" }))
    : side === "friend" ? (LIB.friendFeed || [])
      : ((LIB.teamFeed && LIB.teamFeed[tid]) || []);

  /* 每条动态都挂一个"内容预览"：有封面的显示封面，没有的显示类型字。
     社区流里，一条没有东西可看的动态等于废话。 */
  const flow = rawFlow.map((f) => {
    const t = TYPE[f.type] || TYPE.script;
    const who = f.who || "";
    const av = AV[who];
    return {
      ...f, t: t,
      av: av ? av.av : (who === "我" ? "珍" : who.slice(0, 1)),
      avBg: av ? av.bg : (who === "我" ? "linear-gradient(135deg,#7C5CFF,#2C5BFF)" : "#2C5BFF"),
      title: (f.extra || "").split(" · ")[0],
      meta: (f.extra || "").split(" · ").slice(1).join(" · "),
      when: f.t || f.d || ""
    };
  });

  /* ---------- 三种流 ---------- */
  const cardA = (f) => `<div class="fcard" ${f.go ? `data-go="${f.go}"` : ""} data-label="${f.title}">
      <div class="fh">
        <span class="av" style="background:${f.avBg}">${f.av}</span>
        <div class="hn"><b>${f.who}</b><i>${f.act}${f.pin ? " · 置顶" : ""}</i></div>
        <span class="tm">${f.when}</span>
      </div>
      <div class="fim" style="background:${f.t.grad}">${f.t.ic}<em>${f.t.word}</em></div>
      <div class="fb"><b>${f.title}</b>${f.meta ? `<span>${f.meta}</span>` : ""}</div>
      <div class="fi"><span>♥ ${12 + (f.title.length * 3) % 40}</span><span>💬 ${2 + f.title.length % 9}</span><span>↗ ${1 + f.title.length % 6}</span></div>
    </div>`;

  const cardB = (f) => `<div class="bcard" ${f.go ? `data-go="${f.go}"` : ""} data-label="${f.title}">
      <div class="th" style="background:${f.t.grad}">${f.t.ic}</div>
      <b>${f.title}</b>
      <div class="by"><span class="av" style="background:${f.avBg}">${f.av}</span>${f.who}</div>
    </div>`;

  const cardC = (f) => `<div class="crow" ${f.go ? `data-go="${f.go}"` : ""} data-label="${f.title}">
      <div class="th" style="background:${f.t.grad}">${f.t.ic}</div>
      <div class="tx">
        <b><span class="av" style="background:${f.avBg}">${f.av}</span>${f.who}${f.who === "我" ? "" : " "}${f.act}${f.pin ? `<i class="pin">置顶</i>` : ""}</b>
        <span>${f.title}${f.meta ? " · " + f.meta : ""}</span>
      </div>
      <span class="tm">${f.when}</span>
    </div>`;

  const flowHTML = tv === "b"
    ? `<div class="bgrid">${flow.map(cardB).join("")}</div>`
    : tv === "c"
      ? `<div class="clist">${flow.map(cardC).join("")}</div>`
      : `<div class="flist">${flow.map(cardA).join("")}</div>`;

  /* 顶部压缩条：空间信息一行搞定，剩下的空间全给流 */
  const headLine = side === "team" ? `<div class="tline">
      <span class="av" style="background:var(--g-brand)">${(team.name || "团").slice(0, 1)}</span>
      <b>${team.name || ""}</b>
      <span>${team.members} 人 · 2 个任务待交</span>
      ${teams.length > 1 ? `<span class="chg" data-set="${qs()}&E2.tsw=${tsw ? "" : "1"}">${tsw ? "▴" : "切换 ▾"}</span>` : ""}
    </div>
    ${tsw && teams.length > 1 ? `<div class="teamlist">
      ${teams.map((t) => `<b class="${t.id === tid ? "on" : ""}" data-set="${qs()}&E2.tid=${t.id}&E2.tsw=&E2.fd=">
        <i>${t.name.slice(0, 1)}</i>${t.name}<em>${t.members} 人</em>${t.id === tid ? "✓" : ""}</b>`).join("")}
    </div>` : ""}`
    : side === "friend" ? `<div class="frrow">${(LIB.friends || []).map((f) => `<div class="frl">
        <span class="av" style="background:${f.bg}">${f.av}</span><b>${f.name}</b></div>`).join("")}</div>`
      : "";

  /* 三个文件夹压成一行胶囊：上一版是三张 90px 高的卡，一屏直接被它吃掉八分之一 */
  const kPill = `<div class="kpill">
      ${KINDS.map(([k, tx]) => `<b data-set="${qs()}&E2.open=${k}&E2.view=recent&E2.fd="
        data-label="${tx}"><i style="background:${KBG[k]}">${FICON[k]}</i>${tx}<em>${CNT[k]}</em></b>`).join("")}
    </div>`;

  /* 团队的任务和通知压成一条：它们要"看得见"，但不该"占掉第一屏" */
  const taskLine = side === "team" ? (function () {
    const doing = (LIB.teamTasks || []).filter((t) => t.state !== "done");
    const unread = LIB.notices.filter((n) => n.unread).length;
    return `<div class="prompt">
      <span class="pi" style="background:var(--warm-weak);color:#C2410C">✓</span>
      <div class="tx"><b>${doing.length} 个任务待交</b>
        <span>${doing[0] ? doing[0].t + " · " + doing[0].due + " 截止" : ""}</span></div>
      <span class="go" data-go="E4" data-label="全部任务">去处理 ›</span>
    </div>
    <div class="prompt">
      <span class="pi" style="background:var(--brand-weak);color:var(--brand)">!</span>
      <div class="tx"><b>${LIB.notices.length} 条通知${unread ? ` · ${unread} 未读` : ""}</b>
        <span>${LIB.notices[0].t}</span></div>
      <span class="go" data-go="E5" data-label="全部通知">去看看 ›</span>
    </div>`;
  })() : "";

  const vswitch = `<div class="vswitch">
      ${[["a", "A 卡片流"], ["b", "B 双列"], ["c", "C 紧凑"]].map(([k, tx]) =>
        `<b class="${tv === k ? "on" : ""}" data-set="${qs()}&E2.v=${k}">${tx}</b>`).join("")}
    </div>`;

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

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl" style="margin-left:2px">素材库
        <small>${side === "team" ? (team.name || "") + " · " + team.members + " 人"
          : side === "friend" ? "好友共享 · " + (CNT.script + CNT.asset + CNT.work) + " 份"
            : "我的 · " + (CNT.script + CNT.asset + CNT.work) + " 份"}</small></div>
      <span class="act" data-set="${sel ? "E2.sel=&E2.pick=&E2.mv=" : "E2.sel=1"}">${sel ? "完成" : "整理"}</span>
    </div>

    <div class="body" style="padding-bottom:110px">
      <div class="sidetabs">
        ${SIDES.map(([k, tx]) => `<b class="${side === k ? "on" : ""}"
          data-set="${qs()}&E2.side=${k}&E2.open=&E2.fd=&E2.pick=">${tx}</b>`).join("")}
      </div>

      ${headLine}
      ${taskLine}

      <div class="gsearch compact" style="margin-top:11px;margin-bottom:0">
        <span class="mag">⌕</span>
        <input data-bind="E2.q" data-live value="${q.replace(/"/g, "&quot;")}"
               placeholder="${open ? "搜" + (KINDS.filter((k) => k[0] === open).map((k) => k[1])[0] || "资料") + "名称" : "搜名字"}" />
        ${q ? `<span class="clr" data-set="E2.q=">清空</span>` : ""}
      </div>

      ${kPill}
      ${toast ? `<div class="toast"><span>${toast}</span><b data-set="E2.toast=">×</b></div>` : ""}

      ${open ? openBody : `
        ${vswitch}
        ${flowHTML}
      `}
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
