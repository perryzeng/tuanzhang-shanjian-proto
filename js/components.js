/* 通用组件：返回 HTML 字符串，页面里直接拼 */
(function () {
  const C = {};
  const G = (a, b) => `linear-gradient(135deg,${a},${b})`;

  C.sb = (light) =>
    `<div class="sb"${light ? ' style="color:#fff"' : ""}><span>9:41</span>` +
    `<span class="r">5G <span style="letter-spacing:-1px">▮▮▮</span> 100%</span></div>`;

  C.ab = (o) => {
    o = o || {};
    const back = o.back === false ? ""
      : `<span class="back" data-go="${o.back || "back"}" data-label="返回">‹</span>`;
    const act = o.act ? `<span class="act"${o.actGo ? ` data-go="${o.actGo}" data-label="${o.act}"` : ""}>${o.act}</span>` : "";
    const sub = o.sub ? `<small>${o.sub}</small>` : "";
    return `<div class="ab">${back}<div class="ttl">${o.title}${sub}</div>${act}</div>`;
  };

  /* 页头：小字 kicker + 大标题 + 右侧头像/动作 */
  C.ph = (o) =>
    `<div class="ph">
      <div style="flex:1;min-width:0">
        ${o.k ? `<div class="k">${o.k}</div>` : ""}
        <div class="t">${o.t}</div>
      </div>
      <div class="r">${o.av ? `<div class="av">${o.av}</div>` : (o.act || "")}</div>
    </div>`;

  /* 深色数据卡 */
  C.hero = (o) =>
    `<div class="hero">
      <div class="row"><span class="lb">${o.lb}</span>
        ${o.right ? `<span style="margin-left:auto;font-size:11.5px;color:rgba(255,255,255,.7);background:rgba(255,255,255,.14);border-radius:999px;padding:4px 11px">${o.right}</span>` : ""}
      </div>
      <div class="num">${o.num}${o.unit ? `<small>${o.unit}</small>` : ""}</div>
      <div class="sub">${o.sub || ""}</div>
      ${o.extra || ""}
    </div>`;

  /* 4 图标行 */
  C.icons = (list) =>
    `<div class="iconrow">${list.map((x) =>
      `<div class="ic" ${x.go ? `data-go="${x.go}" data-label="${x.tx}"` : ""}>
        <div class="ib"${x.bg ? ` style="background:${x.bg};color:${x.fg || "var(--brand)"}"` : ""}>${x.ic}</div>
        <span>${x.tx}</span>
      </div>`).join("")}</div>`;

  /* 列表项 */
  C.li = (o) =>
    `<div class="li${o.dim ? " dim" : ""}" ${o.go ? `data-go="${o.go}" data-label="${o.title}"` : ""}>
      <div class="im" style="background:${o.bg || G("#2C5BFF", "#5B8CFF")}">${o.im || ""}</div>
      <div class="tx">
        <b>${o.title}</b>
        ${o.m1 ? `<span class="${o.m1cls || ""}">${o.m1}</span>` : ""}
        ${o.m2 ? `<span>${o.m2}</span>` : ""}
        ${o.price ? `<div class="pr">${o.price}</div>` : ""}
      </div>
      ${o.btn ? `<span class="btn-pill ${o.btnCls || ""}">${o.btn}</span>` : (o.tag ? `<span class="tag ${o.tagCls || ""}">${o.tag}</span>` : "")}
    </div>`;

  /* chips 行 */
  C.chips = (list) =>
    `<div class="chips">${list.map((x) =>
      typeof x === "string"
        ? `<span class="chip">${x}</span>`
        : `<span class="chip ${x.on ? "on" : ""}"${x.go ? ` data-go="${x.go}" data-label="${x.tx}"` : ""}>${x.tx}</span>`).join("")}</div>`;

  /* 小标题 + 更多 */
  C.sec = (title, more, moreGo) =>
    `<div class="sec-h"><span class="h2">${title}</span>${more ? `<span class="more"${moreGo ? ` data-go="${moreGo}" data-label="${more}"` : ""}>${more}</span>` : ""}</div>`;

  const TABICON = {
    home: `<svg viewBox="0 0 24 24"><path d="M4 10.6 12 4l8 6.6V20a1 1 0 0 1-1 1h-4.6v-5.6H9.6V21H5a1 1 0 0 1-1-1z"/></svg>`,
    layers: `<svg viewBox="0 0 24 24"><path d="M12 3.4 3.4 8 12 12.6 20.6 8z"/><path d="m3.4 12 8.6 4.6L20.6 12"/><path d="m3.4 16 8.6 4.6L20.6 16"/></svg>`,
    users: `<svg viewBox="0 0 24 24"><circle cx="9.2" cy="8" r="3.2"/><path d="M3.4 20c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8"/><circle cx="17.2" cy="9" r="2.2"/><path d="M15.8 14.4c2.5.5 4.3 2.6 4.3 5.2"/></svg>`,
    spark: `<svg viewBox="0 0 24 24"><path d="M12 3.6 13.6 9l5.4 1.6-5.4 1.6L12 17.6 10.4 12.2 5 10.6 10.4 9z"/><path d="M18.6 4.2v3M17.1 5.7h3"/></svg>`,
    user: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8.2" r="3.6"/><path d="M4.8 20.4c0-4 3.2-7.2 7.2-7.2s7.2 3.2 7.2 7.2"/></svg>`,
    cut: `<svg viewBox="0 0 24 24"><circle cx="6.2" cy="17.8" r="2.6"/><circle cx="17.8" cy="17.8" r="2.6"/><path d="M7.8 15.8 17.4 4.4M16.2 15.8 6.6 4.4"/></svg>`,
    flag: `<svg viewBox="0 0 24 24"><path d="M6.4 21V4.2"/><path d="M6.4 4.6h10.8l-2.1 3.6 2.1 3.6H6.4"/></svg>`
  };

  /* 底部一级导航（V14）。
     改的是结构，不是样式：原来「素材」「剪同款」各占一个位，
     两个都是生产侧工具；而分发和客户是 0 个位。
     现在按团长真实动作排：首页（看今天）→ 剪（做）→ 客（跟）→ 团队（协同）→ 我的。

     归一化是为了不重渲染 40 多个老页面：
     凡是还写着 C.tab("A1") 的老页面，高亮落在首页；
     素材（E2）和剪同款（F1）归到「剪」，它们本来就是剪的下一步。 */
  C.tab = (active) => {
    const HOME = "A1.2";
    const items = [[HOME, "首页", "home"], ["B1", "剪", "cut"], ["G3.1", "客", "users"], ["E3", "团队", "flag"], ["G1", "我的", "user"]];
    const norm = (x) => {
      if (x === "A1" || x === "A1.1" || x === "A1.2" || x === "A1.3" || x === "A2") return HOME;
      if (x === "E2" || x === "F1" || x === "B2" || x === "B4") return "B1";
      return x;
    };
    const cur = norm(active);
    return `<div class="tb">${items.map(([id, tx, ic]) =>
      `<b class="${cur === id ? "on" : ""}" data-go="${id}" data-label="${tx} Tab"><span class="ic">${TABICON[ic]}</span>${tx}</b>`).join("")}</div>`;
  };

  /* V16 的四项导航：小剪 / 素材 / 看板 / 团队。
     和 V14 五项的区别：素材取代了「剪同款」，看板把「客户」并进去了
     （数据是聚合视图，客户是个体视图，本来就该在一页里上下看）。 */
  C.tab8 = (active) => {
    const ic = {
      chat: `<svg viewBox="0 0 24 24"><path d="M4 6.4h16v9.4H9.6L4 20z"/></svg>`,
      box: `<svg viewBox="0 0 24 24"><rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.4"/><path d="M10.2 9.4 15.2 12l-5 2.6z"/></svg>`,
      chart: `<svg viewBox="0 0 24 24"><path d="M4 20V11M9.3 20V4.6M14.7 20v-5.6M20 20V8"/></svg>`,
      users: `<svg viewBox="0 0 24 24"><circle cx="9.2" cy="8" r="3.2"/><path d="M3.4 20c0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8"/><circle cx="17.2" cy="9" r="2.2"/><path d="M15.8 14.4c2.5.5 4.3 2.6 4.3 5.2"/></svg>`,
      person: `<svg viewBox="0 0 24 24"><circle cx="12" cy="8.2" r="3.6"/><path d="M4.8 20.4c0-4 3.2-7.2 7.2-7.2s7.2 3.2 7.2 7.2"/></svg>`
    };
    const items = [["A8", "小剪", "chat"], ["A8.4", "作品", "box"], ["A8.2", "客户", "person"], ["A8.3", "小组", "users"]];
    return `<div class="tb">${items.map(([id, tx, k]) =>
      `<b class="${active === id ? "on" : ""}" data-go="${id}" data-label="${tx} Tab"><span class="ic">${ic[k]}</span>${tx}</b>`).join("")}</div>`;
  };

  C.estage = (o) => {
    const track = (o.track || []).map(([f, st]) => `<i class="${st || ""}" style="flex:${f}"></i>`).join("");
    const pip = o.preview.pip ? `<span class="n" style="position:absolute;right:5px;bottom:5px;background:#7C5CFF">暴</span>` : "";
    return `<div class="estage">
      <div class="epv" style="background:${o.preview.bg}">
        ${o.preview.no ? `<span class="n">${o.preview.no}</span>` : "<span></span>"}
        <span class="cap2">${o.preview.cap || ""}</span>
        ${pip}
      </div>
      <div class="ectl">
        <div class="trow"><span class="tcode">${o.code}</span>
          <span class="pctl"><i>${o.paused ? "⏸" : "▶"}</i><i>⛶</i></span>
        </div>
        <div class="etrack">${track}</div>
        <div class="nowseg">${o.now}</div>
      </div>
    </div>`;
  };

  C.seg = (s) => {
    const tags = (s.tags || []).map(([cls, tx]) => `<span class="tag ${cls}">${tx}</span>`).join("");
    const dur = s.dur ? `<span class="seg-dur">${s.dur}</span>` : "";
    let vo = "";
    if (s.editbox) {
      vo = `<div class="editbox">${s.editbox}</div>`;
      if (s.editOps) {
        /* 第三位是动作：带 = 的是同页状态，其余是跳转 */
        vo += `<div class="editops">${s.editOps.map(([cls, tx, act]) => {
          const attr = !act ? "" : (/=/.test(act) ? ` data-set="${act}"` : ` data-go="${act}" data-label="${tx}"`);
          return `<span class="op ${cls}"${attr}>${tx}</span>`;
        }).join("")}</div>`;
      }
    } else if (s.vo) {
      vo = `<div class="vo"><span>${s.vo}</span>${s.edit === false ? "" :
        `<span class="edit"${s.editGo ? ` data-go="${s.editGo}" data-label="改台词"` : (s.editSet ? ` data-set="${s.editSet}"` : "")}>改</span>`}</div>`;
    }
    let clips = "";
    if (s.clips && s.clips.length) {
      clips = `<div class="clips">${s.clips.map((c) =>
        c.add
          ? `<div class="addclip ${c.need ? "need" : ""}"${c.go ? ` data-go="${c.go}" data-label="${c.label || "加画面"}"` : ""}>${c.label || "＋"}</div>`
          : `<div class="clip ${c.pip ? "pip" : ""}" style="background:${c.bg}">${c.label || ""}</div>`).join("")}</div>`;
    }
    let ops = "";
    if (s.ops && s.ops.length) {
      ops = `<div class="ops">${s.ops.map((o) =>
        `<span class="op ${o.cls || ""}"${o.go ? ` data-go="${o.go}" data-label="${o.t}"` : ""}>${o.t}</span>`).join("")}</div>`;
    }
    const note = s.note ? `<div class="note">${s.note}</div>` : "";
    /* 剪同款：先给原文案做对照，再给可编辑的我方台词 */
    const orig = s.orig ? `<div class="orig"><b>原文案</b><span>${s.orig}</span></div>` : "";
    return `<div class="seg ${s.state || ""}">
      <div class="seg-h"><span class="seg-no">${s.no}</span><span class="seg-name">${s.name}</span>${tags}${dur}</div>
      ${orig}${vo}${clips}${ops}${note}
    </div>`;
  };

  /* 结构化脚本框里的一个 part：左边一个画面槽，右边一段台词。
     这是全产品唯一的「脚本长什么样」——AI 写的、导入的、视频抽的、系列的，
     落到这里都是同一个样子：一段话 + 一个槽。所以发布链路能统一。 */
  C.part = (p) => {
    const tags = (p.tags || []).map(([c, t, go]) =>
      `<span class="tag ${c}"${go ? ` data-go="${go}" data-label="${t}"` : ""}${go ? ' style="cursor:pointer"' : ""}>${t}</span>`).join("");
    const sl = p.slot || {};

    /* 画面槽：有素材时槽上直接给一个大 ▶（预览这一段），角上一个"换"；
       没素材时整块就是"添加素材"，点开选择器。
       进了编辑态，右上角那个"换"要让位给槽下的「修改 / 替换」——
       两个入口做同一件事，图上就重复了。 */
    const slot = sl.empty || sl.miss
      ? `<div class="slot ${sl.miss ? "miss" : "empty"}"${sl.go ? ` data-go="${sl.go}" data-label="${sl.label}"` : ""}>
          <span class="ic">＋</span><b>${sl.label}</b>
        </div>`
      : `<div class="slot fill" style="background:${sl.bg || ""}">
          ${sl.img ? `<img src="${sl.img}" alt="">` : ""}
          <b>${sl.label}</b>
          <span class="pvbtn" data-set="${sl.pvAct || ""}" title="预览这一段">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>
          </span>
          ${sl.swGo && !p.slotOps ? `<span class="swbtn" data-go="${sl.swGo}" data-label="换素材">换</span>` : ""}
        </div>`;

    /* 画面这一列：槽 + 槽下面的动作（现在只有一个「换一段」） */
    const slotOps = p.slotOps
      ? `<div class="slotops">${p.slotOps.map((o) =>
          `<span data-go="${o.go}" data-label="${o.tx}">${o.tx}</span>`).join("")}</div>`
      : "";

    let vo = "";
    /* 编辑态把「素材 3s · 台词 14s」放在文案框下面、AI 按钮上面：
       先看词看完多长，再决定要不要换个说法——顺序和用户的判断顺序一致。
       非编辑态它仍在整块的最后，当补充说明。 */
    let metaDone = false;
    if (p.editbox != null) {
      /* 直接就是输入框：点「改」当场就能打字，不用再点一次进某个编辑态。
         用 data-bind 只写状态、不重渲染，否则每敲一个字光标就跳走。 */
      /* AI 按钮**长在输入框里面**（框底右下角），不属于框外——
         它改的就是框里这段字，放在框外就成了另一个独立动作。
         放在框内还能省掉一行高度。 */
      vo = `<div class="editbox">
        <textarea data-bind="${p.bindKey || ""}" rows="3"
          placeholder="写下这一段要说的第一句话…">${p.editbox}</textarea>
        ${p.editOps ? `<div class="editops in">${p.editOps.map(([cls, tx, act]) => {
          const attr = !act ? "" : (/=/.test(act) ? ` data-set="${act}"` : ` data-go="${act}" data-label="${tx}"`);
          return `<span class="op ${cls}"${attr}>${tx}</span>`;
        }).join("")}</div>` : ""}
      </div>`;
      if (p.meta) { vo += `<div class="pmeta" style="margin-top:8px">${p.meta}</div>`; metaDone = true; }
    } else if (p.vo) {
      vo = `<div class="vo"><span>${p.vo}</span><span class="edit"${p.voEditAct ? ` data-set="${p.voEditAct}"` : ""}>改</span></div>`;
    } else if (p.pending) {
      vo = `<div class="vo"><span style="color:var(--text-4)">台词待生成</span></div>`;
    }
    const orig = p.orig ? `<div class="orig"><b>原文案</b><span>${p.orig}</span></div>` : "";
    const meta = (p.meta && !metaDone) ? `<div class="pmeta">${p.meta}</div>` : "";
    const note = p.note ? `<div class="note">${p.note}</div>` : "";
    /* 编辑态的最后一步：一次确认这一段的词和画都定了。
       分段确认而不是整条确认——用户改的永远是某一段。 */
    const confirm = p.confirm
      ? `<div class="pconfirm" data-set="${p.confirm.act}">${p.confirm.tx}</div>`
      : "";

    return `<div class="part${p.on ? " on" : ""}">
      <div class="part-h"><span class="pn">${p.no}</span><span class="pt">${p.name}</span>${tags}<span class="pd">${p.dur}</span></div>
      <div class="part-b"><div class="pcol">${slot}${slotOps}</div><div class="pvo">${orig}${vo}${note}${meta}</div></div>
      ${confirm}
    </div>`;
  };

  /* 分片播放器：点某段的 ▶ 打开，只播这一段——大竖屏画面 + 这一段的台词。
     为什么要占满整屏而不是角落里的小窗：团长判断的是"这段词配这个画面对不对"，
     小窗里既看不清画面，也感受不到口播的节奏。放大了才判断得了。
     播放器只管"看"，不管"改"——想改就关掉，回脚本框里那一句上直接改。 */
  C.player = (o) => {
    const dur = Math.max(1, Math.round(+o.dur || 3));
    const mm = (s) => "0:" + String(s).padStart(2, "0");
    return `<div class="pl">
      <div class="pl-hd">
        <span>第 ${o.no} 段 · ${o.name}</span>
        <span class="plx" data-set="${o.closeAct}">✕</span>
      </div>
      <div class="pl-mid">
        <div class="pl-screen" style="background:${o.bg}">
          <span class="pl-lab">${o.label || "待补画面"}</span>
          ${o.pip ? `<span class="pl-pip">${o.pip}</span>` : ""}
          <div class="pl-cap">${o.cap || "（这一段还没有台词）"}</div>
          <div class="pl-bar"><i style="animation-duration:${dur}s;animation-play-state:${o.paused ? "paused" : "running"}"></i></div>
          <div class="pl-tc"><span>${o.paused ? "已暂停" : mm(0)}</span><span>${dur}"</span></div>
        </div>
      </div>
      <div class="pl-ft">
        <span class="pl-btn"${o.pauseAct ? ` data-set="${o.pauseAct}"` : ""}>${o.paused ? "▶" : "❙❙"}</span>
        <span class="pl-tip">只播这一段 · 共 ${dur} 秒<br>关掉回脚本框，点那句词上的「改」就能改</span>
      </div>
    </div>`;
  };

  C.fold = (o) =>
    `<div class="fold"${o.set ? ` data-set="${o.set}"` : (o.go ? ` data-go="${o.go}" data-label="${o.name || "展开"}"` : "")}>
      <span class="seg-no">${o.no}</span>
      ${o.tag ? `<span class="tag ${o.tag[0]}">${o.tag[1]}</span>` : ""}
      <span class="fx">${o.text}</span>
      ${o.cover ? `<span class="fc" style="background:${o.cover}"></span>` : ""}
    </div>`;

  C.actionbar = (o) =>
    `<div class="actionbar">
      <div class="etools">${(o.tools || []).map(([ic, tx]) =>
        `<div class="eto"${o.toolGo ? ` data-go="${o.toolGo}" data-label="${tx}"` : ""}><span>${ic}</span><b>${tx}</b></div>`).join("")}</div>
      <div class="btn ${o.primary.cls || ""}"${o.primary.go ? ` data-go="${o.primary.go}" data-label="${o.primary.t}"` : ""}>${o.primary.t}</div>
    </div>`;

  /* ---------- 首页 A1 专用 ---------- */

  /* 轻头部：头像 + 问候 + 通知 */
  C.hrow = (o) =>
    `<div class="hrow">
      <div class="av">${o.av || "暴"}</div>
      <div style="flex:1;min-width:0">
        <div class="hi">${o.hi}</div>
        <div class="hs">${o.hs || ""}</div>
      </div>
      <div class="bell" data-go="${o.bellGo || "E5"}" data-label="通知中心">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8.6a6 6 0 1 0-12 0c0 6.4-2.4 8.4-2.4 8.4h16.8S18 15 18 8.6"/><path d="M13.7 20.5a2 2 0 0 1-3.4 0"/>
        </svg>
        ${o.unread ? `<b>${o.unread}</b>` : ""}
      </div>
    </div>`;

  /* 图片 Banner 轮播：自动播放；每张可带落地页，也可以是不带链接的纯图片位 */
  C.banner = (o) => {
    const slides = o.items.map((b) => {
      const linked = !!b.go;
      return `<div class="bn${b.poster || !linked ? " poster" : ""}"${linked ? ` data-go="${b.go}" data-label="Banner·${b.title}"` : ""}>
        <img src="${b.img}" alt="" style="object-position:${b.pos || "center"}">
        <div class="scrim"></div>
        ${b.badge ? `<span class="bdg">${b.badge}</span>` : ""}
        <div class="tx"><b>${b.title}</b>${b.sub ? `<span>${b.sub}</span>` : ""}</div>
        ${linked ? `<span class="go">${b.btn || "去看看"} ›</span>` : ""}
      </div>`;
    }).join("");
    const dots = o.items.length > 1
      ? `<div class="dots">${o.items.map((b, i) => `<i class="${i === 0 ? "on" : ""}" data-slide-to="${i}"></i>`).join("")}</div>`
      : "";
    const auto = o.items.length > 1 ? " data-auto" : "";
    return `<div class="bnwrap" data-bn${auto}><div class="carousel">${slides}</div>${dots}</div>`;
  };

  /* 发布器 Dock：左侧一个大发布器 + 右侧四个小工具 */
  C.dock = (o) =>
    `<div class="dock">
      <div class="dk-main" data-go="${o.main.go}" data-label="${o.main.title}">
        <div class="dt">${o.main.title}</div>
        <div class="dd">${o.main.sub}</div>
        <div class="db">${o.main.btn || "开始剪"} <span style="font-size:11px">›</span></div>
      </div>
      <div class="dk-side">${o.tools.map((t) =>
        `<div class="dk" data-go="${t.go}" data-label="${t.label || t.tx.replace(/<[^>]+>/g, "")}">
          <div class="i" style="background:${t.bg}">${t.ic}</div><span>${t.tx}</span>
        </div>`).join("")}</div>
    </div>`;

  /* 今天必须做：横滑任务卡（最多 3 张） */
  C.tasks = (list) =>
    `<div class="trail">${list.map((t) =>
      `<div class="tk ${t.cls || ""}" data-go="${t.go}" data-label="${t.title}">
        <div class="hd"><span class="bdg">${t.badge}</span><span class="tm">${t.time || ""}</span></div>
        <div class="tt">${t.title}</div>
        <div class="ms">${t.meta || ""}</div>
        <div class="ft"><span class="from">${t.from || ""}</span><span class="go">${t.btn || "去做"} ›</span></div>
      </div>`).join("")}</div>`;

  /* 视频横滑卡 */
  C.vrail = (list) =>
    `<div class="vrail">${list.map((v) =>
      `<div class="vc" data-go="${v.go}" data-label="${v.title}">
        <div class="im">${v.img ? `<img src="${v.img}" alt="" style="object-position:${v.pos || "center"}">` : `<div class="g" style="background:${v.bg}"></div>`}
          ${v.who ? `<span class="wh" style="background:${v.whoBg || "rgba(124,92,255,.9)"}">${v.who}</span>` : ""}
          ${v.plays ? `<span class="pl">▶ ${v.plays}</span>` : ""}
        </div>
      </div>`).join("")}</div>`;

  /* 平台专题大卡 */
  C.themes = (list) =>
    `<div class="g2">${list.map((t) =>
      `<div class="thm" data-go="${t.go}" data-label="${t.title}">
        <img src="${t.img}" alt="" style="object-position:${t.pos || "center"}">
        <div class="ov"></div>
        <div class="tx"><b>${t.title}</b><span>${t.sub || ""}</span></div>
      </div>`).join("")}</div>`;

  /* 新用户：主引导卡 */
  C.onb = (o) =>
    `<div class="onb" data-go="${o.go}" data-label="${o.t}">
      <div class="k">${o.k}</div>
      <div class="t">${o.t}</div>
      <div class="d">${o.d}</div>
      <div class="b">${o.btn || "开始"} <span style="font-size:11px">›</span></div>
      ${o.steps ? `<div class="three">${[1, 2, 3].map((i) => `<i class="${i <= o.steps ? "on" : ""}"></i>`).join("")}</div>` : ""}
    </div>`;

  /* 新用户：人设卡 */
  C.persona = (o) =>
    `<div class="persona" data-go="${o.go}" data-label="${o.title}">
      <div class="hd">
        <div class="ic2">人</div>
        <b>${o.title}</b>
        <span class="n">${o.note || ""}</span>
      </div>
      <div class="d">${o.desc}</div>
      <div class="tags3">${o.tags.map((t) =>
        `<span class="${t.done ? "done" : ""}">${t.done ? "✓" : "○"} ${t.tx}</span>`).join("")}</div>
    </div>`;

  /* 新手清单 */
  C.checklist = (list) =>
    `<div class="card" style="padding:6px 14px">${list.map((c) =>
      `<div class="chk ${c.done ? "done" : ""}">
        <span class="bx">${c.done ? "✓" : ""}</span><span>${c.tx}</span>
        ${c.done ? "" : `<span class="go2" data-go="${c.go}" data-label="${c.tx}">去完成 ›</span>`}
      </div>`).join("")}</div>`;

  /* ---------- 封面编辑器：底图 × 版式 ----------
     生成前那一页（B2.4）和"单独做一张封面"（B4）用的是同一套东西，
     所以抽成组件——两处各写一遍迟早会长得不一样。

     pid 决定状态写回哪一页：所有点选都走 data-set，不跳页、不丢其它已选项。
     compact=1 时预览缩到 92px、版式缩略缩到 58px，好塞进 B2.4 的分段里。 */
  C.coverKit = (o) => {
    const D = window.DERIVE, pid = o.pid, ctx = o.ctx || {}, compact = !!o.compact;

    /* 底图：视频首帧，或者相册里挑的那张 */
    let base = D.coverBase(ctx.base);
    if (base.k === "photo" && ctx.ph) {
      const ph = D.myPhotos().filter((x) => x.id === ctx.ph)[0];
      if (ph) base = { ...base, bg: ph.bg, name: ph.label, from: "相册 · 竖版" };
    }
    /* 文案默认取自**这条片子要讲的事**，不是版式里那几句示例——
       版式只决定字压在哪，不该替他决定说什么。改过就以他改的为准。
       没传 topic（B4 独立进来）就退回到创作首页那个输入框里的话。 */
    if (!base.img && window.IMG) base.img = window.IMG.text;
    const topic = ctx.topic || ((window.STATE || {}).B1 || {}).topic || "";
    const auto = D.coverFromTopic(topic);
    const bigTx = (ctx.big != null && ctx.big !== "") ? ctx.big : auto.big;
    const smallTx = (ctx.small != null && ctx.small !== "") ? ctx.small : auto.small;
    const style = D.cover(ctx.cv);
    const lay = (t) => (t.k === "split"
      ? `<span class="ss">${t.small}</span><div class="bb"><b>${brk(t.big)}</b></div>`
      : t.k === "bar"
        ? `<div class="bb"><b>${brk(t.big)}</b><i>${t.small}</i></div>`
        : `<b>${brk(t.big)}</b><i>${t.small}</i>`);
    const shot = (t, b, fs) => `<div class="cv" style="font-size:${fs}px">
        <div class="src" style="background:${b.bg}">${b.img ? `<img src="${b.img}" alt="">` : ""}</div>
        <div class="lay ${t.k}${String(t.big).indexOf("|") >= 0 ? " brk" : ""}">${lay(t)}</div>
      </div>`;
    const cur = { ...style, big: bigTx, small: smallTx };

    /* 六张缩略卡共用**同一张底图、同一句话**，只有排法不同——
       否则用户看到的是"六个封面"，而不是"我这张封面，六种排法"。 */
    const tile = (t) => `<div class="cvt${t.k === style.k ? " sel" : ""}" data-set="${pid}.cv=${t.k}">
        ${shot({ ...t, big: bigTx, small: smallTx }, base, compact ? 4.6 : 5.4)}
        <span class="nm">${t.name}</span>
        ${t.k === style.k ? `<span class="ck">✓</span>` : ""}
      </div>`;

    const hasPh = base.k === "photo" && ctx.ph;
    const baseTile = (b, canPick) => `<div class="bset${b.k === base.k ? " sel" : ""}"
        ${canPick ? `data-set="${pid}.base=${b.k}"` : `data-go="B4.2?from=${pid}" data-label="选择封面"`}>
        <div class="th${canPick ? "" : " add"}"${canPick ? ` style="background:${b.bg}"` : ""}>${canPick ? "" : "＋"}</div>
        <div class="tx"><b>${canPick ? b.name : "选择封面"}</b>
          <span>${canPick ? b.from : "从相册选一张"}</span></div>
        ${canPick && b.k === base.k ? `<span class="tick">✓</span>` : ""}
      </div>`;

    return `<div class="ckit${compact ? " sm" : ""}">
      <div class="ck-head">
        <div class="ck-pv">${shot(cur, base, compact ? 9 : 12)}
          <div class="cap">${base.name}${base.at ? " · " + base.at : ""}</div>
        </div>
        <div class="ck-fields">
          <div class="fd2">
            <label class="fd"><span class="fl">主标题 <em>打 | 可换行</em></span>
              <input data-bind="${pid}.big" data-live value="${String(bigTx).replace(/"/g, "&quot;")}"
                     placeholder="封面主打那句" /></label>
            <label class="fd"><span class="fl">副标题</span>
              <input data-bind="${pid}.small" data-live value="${String(smallTx).replace(/"/g, "&quot;")}"
                     placeholder="价格 / 时间" /></label>
          </div>
        </div>
      </div>

      <div class="bsets" style="margin-top:9px">
        ${baseTile(D.coverBase("frame"), true)}
        ${hasPh ? baseTile(base, true) : baseTile({ k: "photo" }, false)}
      </div>

      <div class="ctray" style="margin-top:8px">${D.covers().map(tile).join("")}</div>
    </div>`;
  };

  /* 主标题里允许用 | 手动断行：中文自动折行常断在词中间（"一天不 / 到 3 块"），
     手动断比自动断靠谱。 */
  const brk = (x) => String(x).replace(/\|/g, "<br>");

  window.C = C;
  window.G = G;
})();
