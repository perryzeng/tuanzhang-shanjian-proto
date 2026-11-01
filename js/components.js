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

  C.tab = (active) => {
    const items = [["A1", "⌂", "首页"], ["E2", "▤", "素材"], ["F1", "⊞", "广场"], ["G1", "◎", "我的"]];
    return `<div class="tb">${items.map(([id, ic, tx]) =>
      `<b class="${active === id ? "on" : ""}" data-go="${id}" data-label="${tx} Tab"><span class="ic">${ic}</span>${tx}</b>`).join("")}</div>`;
  };

  C.estage = (o) => {
    const track = (o.track || []).map(([f, st]) => `<i class="${st || ""}" style="flex:${f}"></i>`).join("");
    const pip = o.preview.pip ? `<span class="n" style="position:absolute;right:5px;bottom:5px;background:#7C5CFF">珍</span>` : "";
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
    const tags = (p.tags || []).map(([c, t]) => `<span class="tag ${c}">${t}</span>`).join("");
    const sl = p.slot || {};
    const slot = `<div class="slot ${sl.miss ? "miss" : sl.empty ? "empty" : "fill"}"${sl.bg ? ` style="background:${sl.bg}"` : ""}${sl.go ? ` data-go="${sl.go}" data-label="${sl.label || "换画面"}"` : ""}>
        ${sl.empty || sl.miss ? `<span class="ic">＋</span>` : ""}
        <b>${sl.label || "选画面"}</b>
        ${sl.empty || sl.miss ? "" : `<i>替换</i>`}
      </div>`;

    let vo = "";
    if (p.editbox != null) {
      vo = `<div class="editbox">${p.editbox}</div>`;
      if (p.editOps) {
        vo += `<div class="editops">${p.editOps.map(([cls, tx, act]) => {
          const attr = !act ? "" : (/=/.test(act) ? ` data-set="${act}"` : ` data-go="${act}" data-label="${tx}"`);
          return `<span class="op ${cls}"${attr}>${tx}</span>`;
        }).join("")}</div>`;
      }
    } else if (p.vo) {
      vo = `<div class="vo"><span>${p.vo}</span>${p.edit === false ? "" :
        `<span class="edit"${p.editSet ? ` data-set="${p.editSet}"` : ""}>改</span>`}</div>`;
    } else if (p.pending) {
      vo = `<div class="vo"><span style="color:var(--text-4)">台词待生成</span></div>`;
    }
    const orig = p.orig ? `<div class="orig"><b>原文案</b><span>${p.orig}</span></div>` : "";
    const ops = (p.ops && p.ops.length)
      ? `<div class="ops">${p.ops.map((o) =>
          `<span class="op ${o.cls || ""}"${o.go ? ` data-go="${o.go}" data-label="${o.t}"` : ""}>${o.t}</span>`).join("")}</div>`
      : "";
    const meta = p.meta ? `<div class="pmeta">${p.meta}</div>` : "";
    const note = p.note ? `<div class="note">${p.note}</div>` : "";
    /* 预览中：一条按这段真实时长走完的进度条，播完就停，不循环 */
    const playing = p.playing
      ? `<div class="pvline"><span class="bar2"><i style="animation-duration:${p.playing}s"></i></span><span>预览中 · ${p.playing}s</span></div>`
      : "";
    const playBtn = p.play
      ? `<span class="pp${p.play.on ? " on" : ""}" data-set="${p.play.act}" title="预览这一段">${p.play.on ? "⏸" : "▶"}</span>`
      : "";

    return `<div class="part${p.on ? " on" : ""}${p.play && p.play.on ? " playing" : ""}">
      <div class="part-h"><span class="pn">${p.no}</span><span class="pt">${p.name}</span>${tags}<span class="pd">${p.dur}</span>${playBtn}</div>
      <div class="part-b">${slot}<div class="pvo">${orig}${vo}${playing}${ops}${note}${meta}</div></div>
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
      <div class="av">${o.av || "珍"}</div>
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
        `<div class="dk" data-go="${t.go}" data-label="${t.tx}">
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
        <b>${v.title}</b><span>${v.sub || ""}</span>
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

  window.C = C;
  window.G = G;
})();
