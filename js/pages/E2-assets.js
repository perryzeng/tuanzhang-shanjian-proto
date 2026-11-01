window.PAGES["E2"].prd = "PRD §6.21 · 素材库（我的 · 数据 + 模块卡 + 动态/最新/精选/目录）";
window.PAGES["E2"].states = [
  { k: "", n: "我的素材：数据（只数字）+ 作品/素材/脚本模块卡 + 我的好友" },
  { k: "open=script", n: "钻取：tab 动态/最新/精选/目录（目录可建/移/删）" },
  { k: "open=asset", n: "钻取素材：同 4 个 tab" },
  { k: "open=work", n: "钻取作品：同 4 个 tab" }
];

/* 素材库（E2 = 我的；E3 团队复用同一套渲染，ctx.__side 强制 team、ctx.__pid 决定写哪个页面的状态）。
   - 顶部只留数字（脚本 / 素材 / 作品 / 今日更新）；
   - 三张模块卡（作品 / 素材 / 脚本）；「我的」底部是「我的好友」；
   - 点任意一类：tab = 动态（变更记录）/ 最新 / 精选 / 目录；目录可建文件夹、移动、删除。 */
window.PAGES["E2"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;
  const LIB = window.DATA.library;

  const pid = ctx.__pid || "E2";          // 状态写到哪个页面（E2 / E3 / E2.4）
  const forcedSide = ctx.__side || "";    // E3 传 team、E2.4 传 friend
  const side = forcedSide || "mine";
  const tview = side === "team" ? (["owner", "admin", "member"].indexOf(ctx.view) >= 0 ? ctx.view : "owner") : "";
  const mng = ctx.mng === "1";
  const isSelf = side === "mine";
  const friendName = ctx.__friend || "";
  const friend = (LIB.friends || []).filter((f) => f.name === friendName)[0] || {};

  const teams = LIB.teams || [];
  const tid = teams.some((t) => t.id === ctx.tid) ? ctx.tid : (teams[0] || {}).id;
  const team = teams.filter((t) => t.id === tid)[0] || {};

  const KINDS = [["script", "脚本"], ["asset", "视频素材"], ["work", "作品"]];
  const KINDNAME = { script: "脚本", asset: "素材", work: "作品" };
  const open = KINDS.some((k) => k[0] === ctx.open) ? ctx.open : "";
  const kind = open || "script";
  const q = ctx.q || "";
  const sel = ctx.sel === "1";
  const picked = (ctx.pick || "").split(",").filter(Boolean);
  const mvOpen = ctx.mv === "1";
  const tsw = ctx.tsw === "1";

  const movStr = ctx.moved || "";
  const moved = {};
  movStr.split(";").forEach((pair) => { const a = pair.split(">")[0], b = pair.split(">")[1]; if (a && b) moved[a] = b; });
  const delStr = ctx.del || "";
  const delSet = {};
  delStr.split(",").filter(Boolean).forEach((id) => { delSet[id] = 1; });
  const nfdStr = ctx.nfd || "";
  const extraFd = nfdStr.split(",").filter(Boolean).map((n, i) => ({ id: "nf" + i, name: n, n: 0, fresh: true }));

  const qs = (kv) => pid + ".side=" + side + "&" + pid + ".tid=" + tid + "&" + pid + ".open=" + open
    + "&" + pid + ".tab=" + (ctx.tab || (isSelf ? "latest" : "log")) + "&" + pid + ".q=" + q + "&" + pid + ".moved=" + movStr
    + "&" + pid + ".del=" + delStr + "&" + pid + ".nfd=" + nfdStr + "&" + pid + ".tsw=" + tsw
    + "&" + pid + ".mng=" + (mng ? "1" : "") + "&" + pid + ".pick=" + picked.join(",") + "&" + (kv || "");

  const FICON = { script: "文", asset: "图", work: "作" };
  const KBG = {
    script: "linear-gradient(150deg,#7C6CFF,#A78BFA)",
    asset: "linear-gradient(150deg,#5AC8FA,#8B9CFF)",
    work: "linear-gradient(150deg,#B18CFF,#FF9AC4)"
  };
  const TITLE = {
    work: side === "team" ? "作品专题" : side === "friend" ? `${friendName}的作品` : "我的作品",
    asset: side === "team" ? "团队素材" : side === "friend" ? `${friendName}的素材` : "我的素材",
    script: side === "team" ? "共享脚本" : side === "friend" ? `${friendName}的脚本` : "我的脚本"
  };

  const TYPE = {
    notice: { ic: "!", fg: "#C2410C", bg: "#FFE3C2", word: "公告" },
    task: { ic: "✓", fg: "#C2410C", bg: "#FFE3C2", word: "任务" },
    work: { ic: "▶", fg: "var(--violet)", bg: "#EFE9FF", word: "作品" },
    asset: { ic: "▦", fg: "#0B8C68", bg: "#E2F7F0", word: "素材" },
    script: { ic: "≡", fg: "#2C5BFF", bg: "#E6EDFF", word: "脚本" },
    member: { ic: "＋", fg: "#0B8C68", bg: "#E2F7F0", word: "成员" },
    folder: { ic: "◫", fg: "#5B6B8C", bg: "#EEF1F8", word: "整理" }
  };

  const AV = {};
  (LIB.friends || []).forEach((f) => { AV[f.name] = { av: f.av, bg: f.bg }; });
  (LIB.teamFeed ? Object.values(LIB.teamFeed).flat() : []).forEach((f) => {
    if (f.who && !AV[f.who]) AV[f.who] = { av: f.who.slice(0, 1), bg: "#2C5BFF" };
  });

  /* 一条动态 → 统一成"人 + 动作 + 可点目标" */
  const decorate = (f, who) => {
    const t = TYPE[f.type] || TYPE.script;
    const av = AV[who];
    const item = f.item ? D.libItem(f.item) : null;
    let go = "";
    if (f.type === "script") go = item ? "E2.2?id=" + item.id : pid + "?open=script&tab=log";
    else if (f.type === "asset") go = item ? "E2.3?id=" + item.id : pid + "?open=asset&tab=log";
    else if (f.type === "work") go = item ? (item.go || "B4.1?id=" + item.id) : (f.go || pid + "?open=work&tab=log");
    return {
      ...f, t, go, item,
      av: av ? av.av : (who === "我" ? "暴" : (who || "?").slice(0, 1)),
      avBg: av ? av.bg : (who === "我" ? "linear-gradient(135deg,#7C5CFF,#2C5BFF)" : "#2C5BFF"),
      title: (f.extra || "").split(" · ")[0],
      meta: (f.extra || "").split(" · ").slice(1).join(" · "),
      when: f.t || f.d || ""
    };
  };

  const thread = (f) => `<div class="thr${f.go ? " tap" : ""}" ${f.go ? `data-go="${f.go}"` : ""} data-label="${f.title || f.act}">
      <div class="ta"><span class="av" style="background:${f.avBg}">${f.av}</span>
        <b>${f.who}</b><i>${f.act}</i><span class="tm">${f.when}</span>
        ${f.go ? `<span class="go">›</span>` : ""}</div>
      ${f.title ? `<div class="tt"><span class="ttag" style="background:${f.t.bg};color:${f.t.fg}">${f.t.word}</span><b>${f.title}</b></div>` : ""}
      ${f.meta ? `<div class="tn">${f.meta}</div>` : ""}
    </div>`;

  const flow = side === "friend"
    ? (LIB.friendFeed || []).filter((x) => x.who === friendName).map((f) => decorate(f, f.who))
    : side === "mine"
      ? LIB.mineFeed.map((f) => decorate(f, "我"))
      : ((LIB.teamFeed && LIB.teamFeed[tid]) || []).filter((x) => x.type !== "notice" && x.type !== "task").map((f) => decorate(f, f.who));

  /* ---------- 顶部：只留数字（团队那侧保留团队名，点名字进团队信息/通讯录） ---------- */
  const cntOf = (k) => D.lib(side, k, {}).items.filter((x) => !delSet[x.id]).length;
  const CNT = { script: cntOf("script"), asset: cntOf("asset"), work: cntOf("work") };
  const recentN = KINDS.reduce((s, [k]) => s + D.lib(side, k, {}).items.filter((x) => x.at === 1 && !delSet[x.id]).length, 0);

  const pstats = `<div class="pstats">
      <div data-set="${qs()}&${pid}.open=script&${pid}.tab=log&${pid}.q="><b>${CNT.script}</b><span>脚本</span></div>
      <div data-set="${qs()}&${pid}.open=asset&${pid}.tab=log&${pid}.q="><b>${CNT.asset}</b><span>素材</span></div>
      <div data-set="${qs()}&${pid}.open=work&${pid}.tab=log&${pid}.q="><b>${CNT.work}</b><span>作品</span></div>
      <div class="rc"><b>${recentN}</b><span>今日更新</span></div>
    </div>`;

  /* 团队 Banner 轮播（只团队页有）：Banner 卡里同时放四个数，portal 一点 */
  const banners = LIB.teamBanners || [];
  const bn = Math.max(0, Math.min(banners.length - 1, parseInt(ctx.bn || "0", 10) || 0));
  const bannerCard = side === "team" && banners.length
    ? `<div class="tbnr-card">
        <div class="tbnr" data-bnr-auto data-bnr-pid="${pid}">
          <div class="tbnr-track" style="transform:translateX(-${bn * 100}%)">
            ${banners.map((b) => `<div class="tbnr-slide" style="background:${b.bg}" data-go="${b.go}" data-label="${b.t}">
              ${b.tag ? `<span class="tbnr-tag">${b.tag}</span>` : ""}
              <div class="tbnr-tx"><b>${b.t}</b><span>${b.sub}</span></div>
              <span class="tbnr-go">去看看 ›</span>
            </div>`).join("")}
          </div>
          <div class="tbnr-dots">${banners.map((b, i) => `<i class="${i === bn ? "on" : ""}" data-bnr-dot data-set="${pid}.bn=${i}"></i>`).join("")}</div>
        </div>
        ${pstats}
      </div>`
    : "";

  const teamSw = tsw && teams.length > 1 && side === "team" ? `<div class="teamsw">
      ${teams.map((t) => `<b class="${t.id === tid ? "on" : ""}" data-set="${qs()}&${pid}.tid=${t.id}&${pid}.tsw=&${pid}.tab=log">
        <i>${t.name.slice(0, 1)}</i>${t.name}<em>${t.members} 人</em>${t.id === tid ? "✓" : ""}</b>`).join("")}
    </div>` : "";

  /* ---------- 团队：公告（紧凑） + 任务（一条条，收在一张卡里） ---------- */
  const notices = LIB.notices || [];
  const noticeCard = notices.length ? `<div class="ncard">
      <div class="nh"><span class="ni">!</span>公告<span class="cnt">${notices.length}</span></div>
      ${notices.map((n) => `<div class="nr" data-go="${n.go || "E5"}" data-label="${n.t}">
        <div class="nl"><b>${n.t}</b><span class="tm">${n.at}</span></div>
        ${n.sub ? `<i>${n.sub}</i>` : ""}<span class="go">›</span></div>`).join("")}
    </div>` : "";

  const tasks = LIB.teamTasks || [];
  const taskList = tasks.length ? `<div class="tlist">
      <div class="tlh">团队任务<span class="cnt">${tasks.filter((t) => t.state !== "done").length} 进行中</span></div>
      ${tasks.map((t) => {
        const pct = Math.round(t.done / t.total * 100);
        return `<div class="tlr${t.state === "done" ? " done" : ""}" data-go="${t.go}" data-label="${t.t}">
          <div class="tlt"><b>${t.t}</b><em>${t.state === "done" ? "已完成" : "进行中"}</em></div>
          <div class="tls">${t.by} · 派给 ${t.to} · 截止 ${t.due}</div>
          <div class="bar"><i style="width:${pct}%"></i></div>
          <div class="tlf"><span>已交 ${t.done}/${t.total}</span><span class="tgo3">去处理 ›</span></div>
        </div>`;
      }).join("")}
    </div>` : "";

  /* ---------- 模块卡：作品专题（通栏）+ 素材 / 脚本（半栏） ---------- */
  const modCard = (k, hero) => {
    const its = D.lib(side, k, {}).items.filter((x) => !delSet[x.id]);
    const show = its.slice(0, hero ? 3 : 2);
    const body = k === "script"
      ? `<div class="modb col">${show.map((x) => `<span class="mrow"><i class="d"></i>${x.name}</span>`).join("") || `<span class="mem">暂无脚本</span>`}</div>`
      : `<div class="modb">${show.map((x) => `<span class="mth" style="background:${x.bg || KBG[k]}">${x.img ? `<img src="${x.img}" alt="">` : ""}${x.pick ? `<span>精选</span>` : ""}</span>`).join("") || `<span class="mem">暂无</span>`}</div>`;
    const cap = hero && show[0] ? `<div class="modcap">最新 · ${show[0].name}</div>` : "";
    return `<div class="mod${hero ? " hero" : ""}" data-set="${qs()}&${pid}.open=${k}&${pid}.tab=log&${pid}.q=" data-label="${TITLE[k]}">
      <div class="modh"><span class="mi" style="background:${KBG[k]}">${FICON[k]}</span>
        <b>${TITLE[k]}</b><em>${its.length}</em><span class="go">›</span></div>
      ${body}${cap}</div>`;
  };
  const mods = `<div class="mods">${modCard("work", true)}${modCard("asset", false)}${modCard("script", false)}</div>`;

  /* ---------- 「我的」底部：好友动态（每个好友一张卡；名右边是库总量，条目右边是时间） ---------- */
  const friendTotal = KINDS.reduce((s, [k]) => s + D.lib("friend", k, {}).counts[k], 0);
  const friendSection = (function () {
    const friends = LIB.friends || [];
    if (!friends.length) return "";
    const cards = friends.map((fr) => {
      const changes = (LIB.friendFeed || []).filter((x) => x.who === fr.name).slice(0, 3).map((x) => decorate(x, x.who));
      const rows = changes.map((c) => {
        const time = ((c.d || "") + (c.d && c.when ? " " : "") + (c.when || "")).trim();
        return `<div class="fcr${c.go ? " tap" : ""}" ${c.go ? `data-go="${c.go}"` : ""} data-label="${c.title || c.act}">
          <span class="ftag" style="background:${c.t.bg};color:${c.t.fg}">${c.t.word}</span>
          <b>${c.title || c.act}</b>${time ? `<span class="frtime">${time}</span>` : ""}</div>`;
      }).join("");
      return `<div class="frc">
          <div class="frh tap" data-go="E2.4?f=${encodeURIComponent(fr.name)}" data-label="看 ${fr.name} 的素材库">
            <span class="fav" style="background:${fr.bg}">${fr.av}</span>
            <b>${fr.name}</b><span class="frt">${fr.n || friendTotal} 份资料 ›</span></div>
          ${rows || `<div class="frempty">最近没有更新</div>`}
        </div>`;
    }).join("");
    return `<div class="feedhd">好友动态<span>${friends.length}</span></div>${cards}`;
  })();

  /* 全局搜索入口（我的 / 好友）：点开进 E2.5，跨 脚本·素材·作品 搜 */
  const searchEntry = side === "team" ? ""
    : `<div class="gsearch" style="cursor:pointer" data-go="E2.5${side === "friend" ? "?f=" + encodeURIComponent(friendName) : ""}" data-label="搜索素材">
        <span class="mag">⌕</span><span>搜脚本、素材、作品</span></div>`;

  /* ---------- 钻取：动态 / 最新 / 精选 / 目录 ---------- */
  const ALL = D.lib(side, kind, { moved });
  const allItems = ALL.items.filter((x) => !delSet[x.id]);
  const folders = ALL.folders.concat(extraFd);
  const loose = allItems.filter((x) => !folders.some((f) => f.id === x.fd));
  const pickCount = allItems.filter((x) => x.pick).length;
  const kindFlow = flow.filter((f) => f.type === kind);

  /* 自己的库不需要「动态」：默认就是最新；好友/团队才看动态 */
  const TABS = isSelf
    ? [["latest", "最新", allItems.length], ["pick", "精选", pickCount], ["dir", "目录", folders.length]]
    : [["log", "动态", kindFlow.length], ["latest", "最新", allItems.length], ["pick", "精选", pickCount], ["dir", "目录", folders.length]];
  const curTab = TABS.some((t) => t[0] === ctx.tab) ? ctx.tab : (isSelf ? "latest" : "log");
  const canOrganize = open && curTab !== "log";

  const toggle = (id) => pid + ".pick=" + (picked.indexOf(id) >= 0 ? picked.filter((x) => x !== id) : picked.concat(id)).join(",");

  const rowScript = (x) => `<div class="srow" ${sel
      ? `data-set="${qs(toggle(x.id))}"`
      : `data-go="E2.2?id=${x.id}${mng ? "&mng=1" : ""}" data-label="${x.name}"`}>
      ${sel ? `<span class="ck${picked.indexOf(x.id) >= 0 ? " on" : ""}"></span>` : ""}
      <span class="ic">≡</span>
      <div class="tx"><b>${x.name}</b>
        <span>${x.by || "—"} · ${x.sub} · ${x.at === 1 ? "今天" : x.at + " 天前"}</span>
        <span style="display:block;font-size:9px;color:var(--text-3);margin-top:2px">使用 ${D.plays(x.uses)} · ♥ ${D.plays(x.likes)}</span></div>
      ${sel ? "" : `<span class="go">›</span>`}
    </div>`;

  const tile = (x) => `<div class="tile" ${sel
      ? `data-set="${qs(toggle(x.id))}"`
      : x.go ? `data-go="${x.go}" data-label="${x.name}"` : `data-label="${x.name}"`}>
      <div class="im" style="aspect-ratio:3/4;background:${x.bg || KBG[kind]}">
        ${x.img ? `<img src="${x.img}" alt="">` : ""}
        ${sel ? `<span class="ck on-im${picked.indexOf(x.id) >= 0 ? " on" : ""}"></span>` : ""}
        ${x.pick ? `<span class="pickmark">精选</span>` : ""}
        <span class="cnt">${x.sub.split(" · ")[0]}</span>
      </div>
      ${kind === "work" ? "" : `<div class="cap"><b>${x.name}</b><span class="by">${x.by || ""}</span><span style="display:block;font-size:8.5px;color:var(--text-4);margin-top:1px">用 ${D.plays(x.uses)} · ♥ ${D.plays(x.likes)}</span></div>`}
    </div>`;

  const tileGo = (x) => (kind === "asset" ? "E2.3?id=" + x.id + (mng ? "&mng=1" : "") : (x.go || "B4.1?id=" + x.id));
  const arrOf = (arr, flat) => kind === "script"
    ? (flat ? arr.map(rowScript).join("")
      : `<div class="card" style="padding:2px 14px;border-radius:14px;margin-top:10px">${arr.map(rowScript).join("")}</div>`)
    : `<div class="g3" style="margin-top:10px">${arr.map((x) => tile({ ...x, go: tileGo(x) })).join("")}</div>`;

  const empty = `<div class="emptybox"><span class="ei">${q ? "⌕" : "▦"}</span>
      <b>${q ? "没找到「" + q + "」" : "这里还是空的"}</b>
      <span>${q ? "换个词试试，或者清掉搜索" : "上传素材、或者新建一个文件夹开始整理"}</span>
      ${q ? `<em data-set="${pid}.q=">清掉搜索</em>` : ""}</div>`;
  const emptyLog = `<div class="emptybox"><span class="ei">≡</span><b>这类还没有变更记录</b>
      <span>上传或更新${KINDNAME[kind]}后，这里会按时间记下流水</span></div>`;

  /* 新建文件夹：点开原地变成输入框，起名再确定 */
  const nfNew = ctx.nfnew === "1";
  const nfNameRaw = (ctx.nfname || "").trim().replace(/[&=><"]/g, "");
  const nfInputVal = (ctx.nfname || "").replace(/"/g, "&quot;");
  const dirNew = nfNew
    ? `<div class="dirnew editing">
        <input data-bind="${pid}.nfname" data-live value="${nfInputVal}" placeholder="给文件夹起个名字" />
        <b class="ok${nfNameRaw ? "" : " off"}" ${nfNameRaw ? `data-set="${qs(pid + ".nfd=" + (nfdStr ? nfdStr + "," : "") + nfNameRaw + "&" + pid + ".nfnew=&" + pid + ".nfname=")}&${pid}.toast=已新建「${nfNameRaw}」"` : ""}>确定</b>
        <span class="cnl" data-set="${pid}.nfnew=&${pid}.nfname=">取消</span>
      </div>`
    : `<div class="dirnew" data-set="${pid}.nfnew=1">＋ 新建文件夹</div>`;

  const dirBody = `
    ${dirNew}
    ${folders.map((f) => {
      const list = allItems.filter((x) => x.fd === f.id);
      return `<div class="dirgrp">
        <div class="dirgh"><span class="fi">${FICON[kind]}</span><b>${f.name}</b><i>${list.length}</i></div>
        <div class="dirgb">${list.length ? arrOf(list, true) : `<div class="gempty">这个文件夹还空着 · 用「整理 → 移动到」把东西挪进来</div>`}</div>
      </div>`;
    }).join("")}
    ${loose.length ? `<div class="dirgrp"><div class="dirgh"><span class="fi">·</span><b>未分类</b><i>${loose.length}</i></div>
      <div class="dirgb">${arrOf(loose, true)}</div></div>` : ""}`;

  let tabBody;
  if (curTab === "log") {
    let log = kindFlow;
    if (q) log = log.filter((f) => ((f.who || "") + (f.act || "") + (f.title || "") + (f.meta || "")).indexOf(q) >= 0);
    tabBody = log.length ? `<div class="dyn"><div class="dynh">变更日志<span>${log.length}</span></div>${log.map(thread).join("")}</div>` : emptyLog;
  } else if (curTab === "dir") {
    tabBody = dirBody;
  } else {
    let items = curTab === "pick" ? allItems.filter((x) => x.pick) : allItems;
    if (q) items = items.filter((x) => (x.name + " " + x.sub).indexOf(q) >= 0);
    tabBody = items.length ? arrOf(items) : empty;
  }

  const otabs = `<div class="otabs">
      ${TABS.map(([k, tx, n]) => `<b class="${curTab === k ? "on" : ""}" data-set="${qs()}&${pid}.tab=${k}&${pid}.q=&${pid}.pick=&${pid}.sel=">${tx}<em>${n}</em></b>`).join("")}
    </div>`;

  const searchBar = `<div class="gsearch compact" style="margin-top:10px">
      <span class="mag">⌕</span>
      <input data-bind="${pid}.q" data-live value="${q.replace(/"/g, "&quot;")}"
             placeholder="${curTab === "log" ? "搜变更记录" : "搜" + KINDNAME[kind] + "名称"}" />
      ${q ? `<span class="clr" data-set="${pid}.q=">清空</span>` : ""}
    </div>`;

  const openBody = `
    <div class="kfbar">
      <span class="bk" data-set="${qs()}&${pid}.open=&${pid}.tab=log&${pid}.pick=&${pid}.sel=">‹ 全部</span>
      <b>${KINDNAME[kind]} · ${allItems.length} 个</b>
    </div>
    ${otabs}
    ${mng ? `<div class="note" style="margin:10px 2px 0;line-height:1.6">整理模式 · 点开任意一条，可直接改名、换文件夹、设精选、删除</div>` : ""}
    ${curTab === "log" ? "" : searchBar}
    ${tabBody}`;

  /* 团队三种视角：团队长(超管) / 管理员 / 成员 */
  const TVIEWS = [["owner", "团队长"], ["admin", "管理员"], ["member", "成员"]];
  const tviewBar = side === "team" ? `<div class="vsw">
      ${TVIEWS.map(([k, tx]) => `<b class="${tview === k ? "on" : ""}" data-set="${pid}.view=${k}">${tx}</b>`).join("")}
      <span class="vlab">${tview === "owner" ? "超管" : tview === "admin" ? "管理员" : "只读"}</span>
    </div>` : "";

  return `<div class="app">
    ${C.sb()}
    ${side === "friend"
      ? C.ab({ title: friendName, sub: `好友 · ${friend.n || (CNT.script + CNT.asset + CNT.work)} 份资料`, back: "E2" })
      : `<div class="ab">
      <div class="ttl" style="margin-left:2px"${side === "team" ? ` data-go="E3.1?view=${tview}" data-label="团队信息"` : ""}>${side === "team" ? team.name : "素材库"}
        <small>${side === "team" ? `${team.members} 人 · ${team.day} · ${team.role === "团长" ? "我是团长" : "我是团员"} · 通讯录 ›` : "我的"}</small></div>
      ${canOrganize
        ? `<span class="act" data-set="${sel ? pid + ".sel=&" + pid + ".pick=&" + pid + ".mv=" : pid + ".sel=1"}">${sel ? "完成" : "整理"}</span>`
        : (side === "team"
          ? `${(tview === "owner" || tview === "admin") ? `<span class="act" data-go="E3.4?view=${tview}" data-label="团队管理">管理</span>` : ""}${teams.length > 1 ? `<span class="act" style="background:var(--bg-2);color:var(--text-2);box-shadow:none" data-set="${qs()}&${pid}.tsw=${tsw ? "" : "1"}">切换 ▾</span>` : ""}`
          : "")}
    </div>`}

    <div class="body" style="padding-bottom:110px">
      ${open ? openBody : (side === "team"
        ? `${tviewBar}${teamSw}${bannerCard}${noticeCard}${taskList}${mods}
           <div class="feedhd">整个团队的动态<span>${flow.length}</span></div>${flow.length ? flow.map(thread).join("") : empty}`
        : side === "friend"
          ? `${searchEntry}${mods}<div class="feedhd">${friendName}的动态<span>${flow.length}</span></div>${flow.length ? flow.map(thread).join("") : empty}`
          : `${searchEntry}${mods}${friendSection}`)}
    </div>

    ${sel && canOrganize ? `<div class="selbar">
      <b>已选<i>${picked.length}</i>个</b>
      <span class="sb${picked.length ? "" : " off"}" ${picked.length ? `data-set="${pid}.mv=1"` : ""}>移动到</span>
      <span class="sb${picked.length ? "" : " off"}" ${picked.length ? `data-set="${qs(pid + ".pick=&" + pid + ".sel=")}&${pid}.toast=已设为精选"` : ""}>设为精选</span>
      <span class="sb warn${picked.length ? "" : " off"}" ${picked.length ? `data-set="${qs(pid + ".del=" + (delStr ? delStr + "," : "") + picked.join(",") + "&" + pid + ".pick=&" + pid + ".sel=")}&${pid}.toast=已删除 ${picked.length} 项"` : ""}>删除</span>
    </div>
    ${mvOpen && picked.length ? `<div class="mvpanel">
      <div class="mh">移动到哪个文件夹</div>
      <div class="mlist">
        ${folders.map((f) => `<b data-set="${qs(pid + ".moved=" + movStr + (movStr ? ";" : "")
          + picked.map((id) => id + ">" + f.id).join(";") + "&" + pid + ".pick=&" + pid + ".mv=")}&${pid}.toast=已移到「${f.name}」">${f.name}</b>`).join("")}
        <b class="nf" data-set="${qs(pid + ".nfd=" + (nfdStr ? nfdStr + "," : "") + "新建文件夹" + (extraFd.length + 1) + "&" + pid + ".pick=&" + pid + ".mv=")}&${pid}.toast=已新建文件夹">＋ 新建文件夹</b>
      </div>
    </div>` : ""}` : ""}

    ${C.tab(side === "friend" ? "E2" : pid)}
  </div>`;
};

/* 好友视图：结构与「我的」一致（作品/素材/脚本模块卡 + 本人动态），
   只是数据换成这个好友的库（side=friend），状态写到 E2.4。 */
window.PAGES["E2.4"].prd = "PRD §6.21.3 · 好友视图（某个好友的素材库 + 本人动态）";
window.PAGES["E2.4"].render = function (ctx) {
  return window.PAGES["E2"].render(Object.assign({}, ctx, { __pid: "E2.4", __side: "friend", __friend: ctx.f || "" }));
};

/* 全局搜索（我的 / 好友）：跨 脚本·素材·作品 搜，结果按类型分组。
   入口在素材页/好友视图的搜索条；range 由 ?f= 决定（不带 f = 我的）。 */
window.PAGES["E2.5"].prd = "PRD §6.21.5 · 搜索（我的 / 好友 的全局搜索）";
window.PAGES["E2.5"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const friendName = ctx.f || "";
  const domain = friendName ? "friend" : "mine";
  const q = (ctx.q || "").trim();
  const back = friendName ? "E2.4?f=" + encodeURIComponent(friendName) : "E2";
  const scope = friendName ? friendName + "的素材库" : "我的素材库";

  const KINDS = [["script", "脚本"], ["asset", "素材"], ["work", "作品"]];
  const qq = q.toLowerCase();
  const hitsOf = (k) => q ? D.lib(domain, k, {}).items.filter((x) =>
    ((x.name || "") + " " + (x.sub || "") + " " + (x.by || "")).toLowerCase().indexOf(qq) >= 0) : [];
  const total = KINDS.reduce((s, [k]) => s + hitsOf(k).length, 0);

  const HOT = ["磷虾油", "开团话术", "素颜出镜", "成分", "复购", "信任背书"];
  const hot = `<div class="card" style="padding:15px 14px">
      <div class="s" style="margin-bottom:11px">搜索范围 · ${scope}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${HOT.map((h) => `<span class="chip" data-set="E2.5.q=${h}">${h}</span>`).join("")}
      </div>
      <div class="s" style="margin-top:14px;line-height:1.7">试试搜「开团」「成分」「素颜」，脚本、素材、作品会一起找出来。</div>
    </div>`;

  const srow = (x) => `<div class="srow" data-go="E2.2?id=${x.id}" data-label="${x.name}">
      <span class="ic">≡</span>
      <div class="tx"><b>${x.name}</b><span>${x.by || "—"} · ${x.sub}</span>
        <span style="display:block;font-size:9px;color:var(--text-3);margin-top:2px">使用 ${D.plays(x.uses)} · ♥ ${D.plays(x.likes)}</span></div>
      <span class="go">›</span></div>`;

  const tile = (x, k) => {
    const go = k === "asset" ? "E2.3?id=" + x.id : (x.go || "B4.1?id=" + x.id);
    return `<div class="tile" data-go="${go}" data-label="${x.name}">
      <div class="im" style="aspect-ratio:3/4;background:${x.bg || "linear-gradient(150deg,#2C5BFF,#5B8CFF)"}">
        ${x.pick ? `<span class="pickmark">精选</span>` : ""}<span class="cnt">${x.sub.split(" · ")[0]}</span>
      </div>
      <div class="cap"><b>${x.name}</b><span class="by">${x.by || ""}</span>
        <span style="display:block;font-size:8.5px;color:var(--text-4);margin-top:1px">用 ${D.plays(x.uses)} · ♥ ${D.plays(x.likes)}</span></div>
    </div>`;
  };

  const groups = KINDS.map(([k, tx]) => {
    const arr = hitsOf(k);
    if (!arr.length) return "";
    const body = k === "script"
      ? `<div class="card" style="padding:2px 14px;border-radius:14px">${arr.map(srow).join("")}</div>`
      : `<div class="g3">${arr.map((x) => tile(x, k)).join("")}</div>`;
    return `<div class="feedhd" style="margin-top:14px">${tx}<span>${arr.length}</span></div>${body}`;
  }).join("");

  const empty = `<div class="emptybox"><span class="ei">⌕</span><b>没找到「${q}」</b>
      <span>换个词试试：磷虾油 / 开团 / 素颜 / 成分</span></div>`;

  const results = q
    ? `<div class="s" style="margin:12px 2px 2px">「${q}」找到 ${total} 条</div>${total ? groups : empty}`
    : hot;

  return `<div class="app">
    ${C.sb()}
    <div class="ab" style="gap:8px;align-items:center">
      <span class="act" data-go="${back}" data-label="返回" style="margin-left:2px">‹</span>
      <div class="gsearch" style="flex:1;margin:0;height:38px">
        <span class="mag">⌕</span>
        <input data-bind="E2.5.q" data-live value="${q.replace(/"/g, "&quot;")}" placeholder="搜脚本、素材、作品" />
        ${q ? `<span class="clr" data-set="E2.5.q=">✕</span>` : ""}
      </div>
    </div>
    <div class="body" style="padding-bottom:90px">
      ${results}
    </div>
  </div>`;
};
