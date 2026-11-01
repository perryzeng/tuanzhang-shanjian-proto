window.PAGES["E2"].prd = "PRD §6.21 · 素材库（我的 / 团队 × 脚本 / 视频素材 / 作品 × 文件夹分组）";
window.PAGES["E2"].states = [
  { k: "", n: "默认：我的 · 脚本 · 最新，按文件夹分组展开" },
  { k: "kind=asset&sort=pick", n: "视频素材 · 精选" },
  { k: "sel=1", n: "整理模式：每条前面出勾选圈，底部出「移动到 / 删除」" },
  { k: "side=team", n: "团队：四宫格（公告/动态/任务/成员）+ 三类素材" },
  { k: "team=0", n: "没加入团队：只有「我的」" }
];

/* 素材库。上一次做成了"三层 tab + 横滑文件夹"，用户说还不够——整理和查看都不顺手。
   这一版改三件事：

   ① **文件夹直接展开，不做横滑胶囊**。横滑条只能看到五六个名字，看不到里面装了什么；
      展开成"分组 + 组内前三个"，一眼就知道这摞是什么。类别仍是 tab（只有三个、永不变化，
      适合放顶部）；文件夹是会长的，不适合占 tab 位。
   ② **点脚本先进阅读页，不是直接进发布器**（E2.2）。看是看，用是用：
      先看清这份稿子写了什么，再决定要不要拿它去生成。列表里点一下就被拽进编辑器，
      是最让人不敢点的一次误触。
   ③ **整理模式**：右上角「整理」一按，每条前面出勾选圈，底部出「移动到 / 删除」。
      整理是这一页的另一半职责，不能只靠"点进去再改归属"。

   上传从页面右上角挪到右下角 ＋：它不是这一页的主动作，
   主动作是"找到并整理"，上传只是偶尔发生的一件事。 */
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
  const sel = ctx.sel === "1";
  const picked = (ctx.pick || "").split(",").filter(Boolean);
  const mvOpen = ctx.mv === "1";
  const toast = ctx.toast || "";
  const fabOpen = ctx.new === "1";

  /* 这一页自己改过的两样东西：移动到哪、新建了哪些文件夹。
     原型改不了后端，但整理必须当场看得见——移完还留在原处，等于没移。 */
  const movStr = ctx.moved || "";
  const moved = {};
  movStr.split(";").forEach((pair) => {
    const a = pair.split(">")[0], b = pair.split(">")[1];
    if (a && b) moved[a] = b;
  });
  const nfdStr = ctx.nfd || "";
  const extraFd = nfdStr.split(",").filter(Boolean).map((n, i) => ({ id: "nf" + i, name: n, n: 0, fresh: true }));

  const L = D.lib(side, kind, { sort, fd, q, moved });
  const folders = L.folders.concat(extraFd);
  const curFd = folders.filter((f) => f.on)[0];

  /* 每一串参数都从这里出，省得某个动作把 moved / nfd 弄丢 */
  const qs = (kv) => "E2.side=" + side + "&E2.kind=" + kind + "&E2.sort=" + sort
    + "&E2.q=" + q + "&E2.moved=" + movStr + "&E2.nfd=" + nfdStr + "&" + (kv || "");

  const FICON = { script: "文", asset: "图", work: "作" };

  /* 分组：有文件夹筛选或搜索时不分（那时用户只想看那几条） */
  const grouped = !fd && !q;
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

  const groupHead = (g) => `<div class="ghead" ${g.id ? `data-set="${qs()}&E2.fd=${fd === g.id ? "" : g.id}"` : ""}>
      <span class="fi">${g.id ? FICON[kind] : "·"}</span>
      <b>${g.name}</b><i>${g.list.length}</i>
      ${g.id && g.list.length > 3 ? `<span class="more">全部 ${g.list.length} 个 ›</span>` : ""}
    </div>`;

  const quad = (x) => `<div class="q" data-go="${x.go}" data-label="${x.tx}">
      <b>${x.n}</b><span>${x.tx}</span>
    </div>`;

  const empty = `<div class="emptybox">
      <span class="ei">${q ? "⌕" : "▦"}</span>
      <b>${q ? "没找到「" + q + "」" : "这一摞还是空的"}</b>
      <span>${q ? "换个词试试，或者清掉搜索看全部" : "上传素材、或者新建一个文件夹开始整理"}</span>
      ${q ? `<em data-set="E2.q=">清掉搜索</em>` : ""}
    </div>`;

  /* 空分组也要显示：刚建完的文件夹如果立刻消失，用户会以为没建成 */
  const block = (g) => `<div class="gblock">
      ${groupHead(g)}
      ${g.list.length
        ? listOf(g.list.slice(0, 3))
        : `<div class="gempty">这一摞还空着 · 用「整理 → 移动到」把东西挪进来</div>`}
      ${g.list.length > 3 ? `<div class="gmore" data-set="${qs()}&E2.fd=${g.id}">这一摞还有 ${g.list.length - 3} 个 ›</div>` : ""}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl" style="margin-left:2px">素材库
        <small>${side === "team" ? "团队共享" : "我的东西"} · ${L.counts[kind]} 个${kind === "script" ? "脚本" : kind === "asset" ? "素材" : "作品"}</small></div>
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

      ${side === "team" ? `
        <div class="quad">${window.DATA.library.teamQuad.map(quad).join("")}</div>
        ${window.DATA.library.notices.slice(0, 1).map((n) => `<div class="tcard" style="margin-top:9px" data-go="${n.go}" data-label="${n.t}">
          <span class="ti" style="background:var(--brand-weak);color:var(--brand)">📢</span>
          <div class="tx"><b>${n.t}${n.unread ? `<i class="dot">${n.unread}</i>` : ""}</b><span>${n.sub}</span></div>
          <span class="go">›</span>
        </div>`).join("")}` : ""}

      <div class="kindtabs">
        ${KINDS.map(([k, tx]) =>
          `<b class="${kind === k ? "on" : ""}" data-set="${qs()}&E2.kind=${k}&E2.fd=&E2.pick=">${tx}<i>${L.counts[k]}</i></b>`).join("")}
      </div>

      <div class="sortrow">
        ${SORTS.map(([k, tx]) =>
          `<span class="s${sort === k ? " on" : ""}" data-set="${qs()}&E2.sort=${k}">${tx}</span>`).join("")}
        <span class="add" style="color:var(--text-4);font-weight:500">${sel ? "勾选要整理的" : "共 " + L.items.length + " 个"}</span>
      </div>

      ${toast ? `<div class="toast"><span>${toast}</span><b data-set="E2.toast=">×</b></div>` : ""}

      ${grouped
        ? (L.items.length === 0 ? empty
          : groups.filter((g) => g.list.length || g.fresh).map(block).join(""))
        : (L.items.length === 0 ? empty : `
            ${curFd ? `<div class="fdfilter">只看「${curFd.name}」 · ${L.items.length} 个
              <b data-set="${qs()}&E2.fd=">取消</b></div>` : ""}
            ${q ? `<div class="xs" style="margin:11px 2px 0">搜到 ${L.items.length} 个</div>` : ""}
            <div style="margin-top:10px">${listOf(L.items)}</div>`)}
    </div>

    ${sel ? `<div class="selbar">
      <b>已选 ${picked.length} 个</b>
      <span class="sb${picked.length ? "" : " off"}" ${picked.length ? `data-set="E2.mv=1"` : ""}>移动到</span>
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

    <!-- 上传、新建脚本、新建文件夹都收到右下角这个 ＋ 里：
         它们都不是这一页的主动作，主动作是"找到并整理"。 -->
    <!-- 整理模式下不出 ＋：这会儿的动作是"选中然后移动"，再给一个新建入口只会挡路 -->
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
