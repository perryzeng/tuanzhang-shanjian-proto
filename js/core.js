(function () {
  const P = window.PAGES, TREE = window.TREE, STATE = window.STATE, C = window.C;
  const phone = document.getElementById("phone");
  const treeEl = document.getElementById("tree");
  const panelEl = document.getElementById("panel");
  const stageEl = document.getElementById("stage");
  const countEl = document.getElementById("count");
  const deadEl = document.getElementById("deadtip");

  let LINKS = {}, REV = {}, ORDER = [];
  let bnPausedUntil = 0;            // 用户手动操作后暂停自动轮播
  let skipHashQuery = false;        // 同页改过状态后，跳过一次 hash 参数回填
  const BN_EVERY = 4200, BN_RESUME = 8000;

  const cur = () => {
    const raw = decodeURIComponent(location.hash.replace(/^#\/?/, "") || "A1");
    const id = raw.split("?")[0];
    return P[id] ? id : "A1";
  };
  const go = (id) => { location.hash = "#/" + id; };

  /* ---------- 左侧页面树 ---------- */
  function renderTree() {
    const id = cur();
    treeEl.innerHTML = TREE.map((g) =>
      `<div class="g">${g.group}</div>` +
      g.items.map((k) => {
        const p = P[k], ok = !!p.render;
        return `<div class="i ${k === id ? "on" : ""} ${ok ? "" : "ghost"}" data-nav="${k}">
          <span class="id">${k}</span><span class="nm">${p.title}</span></div>`;
      }).join("")).join("");
  }

  /* ---------- 链路索引（离屏渲染每页，收集 data-go） ---------- */
  function buildIndex() {
    LINKS = {}; REV = {}; ORDER = [];
    TREE.forEach((g) => g.items.forEach((id) => { if (P[id].render) ORDER.push(id); }));
    Object.keys(P).forEach((id) => {
      if (!P[id].render) return;
      const box = document.createElement("div");
      try { box.innerHTML = P[id].render(STATE[id] || {}); } catch (e) { console.warn("render fail", id, e); }
      const outs = [];
      box.querySelectorAll("[data-go]").forEach((el) => {
        /* 带查询串的（如 B2.1?seg=sg05）按页面 id 归并，面板里不重复列同一页 */
        const to = (el.dataset.go || "").split("?")[0];
        if (!to || to === "back") return;
        const label = (el.dataset.label || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 16);
        outs.push({ to, label });
      });
      LINKS[id] = outs;
      outs.forEach((o) => { (REV[o.to] = REV[o.to] || []).push({ from: id, label: o.label }); });
    });
  }

  const isDead = (to) => !P[to] || !P[to].render;

  /* ---------- 占位页 ---------- */
  const ghost = (id) => `<div class="app">
    ${C.sb()}
    ${C.ab({ title: id + " · " + (P[id] ? P[id].title : "未知页"), sub: "尚未迁入原型工程", back: "A1" })}
    <div class="body" style="display:flex;align-items:center;justify-content:center;text-align:center">
      <div>
        <div style="font-size:38px;color:#C9CEDA;line-height:1">◌</div>
        <div class="h2" style="margin-top:12px">这一页还没迁进来</div>
        <div class="s" style="margin-top:6px">在 <code>js/pages/</code> 新建 <code>${id}.js</code><br>写好后会自动出现在左侧树里</div>
        <div class="btn ghost" style="width:auto;padding:0 18px;margin:20px auto 0" data-go="A1" data-label="回首页">回首页</div>
      </div>
    </div>
  </div>`;

  /* ---------- 渲染手机 ---------- */
  function renderPhone() {
    const id = cur(), p = P[id];
    const q = (location.hash.split("?")[1] || "");
    if (q && !skipHashQuery) new URLSearchParams(q).forEach((v, k) => { STATE[id] = STATE[id] || {}; STATE[id][k] = v; });
    skipHashQuery = false;
    phone.innerHTML = p && p.render ? p.render(STATE[id] || {}) : ghost(id);
  }

  /* ---------- 右侧面板 ---------- */
  function renderPanel() {
    const id = cur(), p = P[id];
    const seen = {}, uniq = [];
    (LINKS[id] || []).forEach((o) => { if (!seen[o.to]) { seen[o.to] = 1; uniq.push(o); } });
    const dead = uniq.filter((o) => isDead(o.to));
    const revMap = {};
    (REV[id] || []).forEach((r) => { (revMap[r.from] = revMap[r.from] || []).push(r.label); });
    const rev = Object.keys(revMap).map((f) => ({ from: f, n: revMap[f].length, label: revMap[f][0] }));
    const states = p.states ? `<div class="box"><div class="bt">本页状态</div>
        ${p.states.map((s) => `<div class="lk" data-set="${id}.mode=${s.k}">
          <span class="to" style="color:${(STATE[id] || {}).mode === s.k ? "var(--brand)" : "var(--text-3)"}">${(STATE[id] || {}).mode === s.k ? "●" : "○"}</span>
          <span class="lb" style="color:var(--text-2)">${s.n}</span></div>`).join("")}
      </div>` : "";

    /* 业务逻辑与数据来源写在 PRD，这里只放一行指路，不重复口径 */
    const prdLine = p.prd
      ? `<div class="prdline">业务逻辑 / 数据来源 → <b>${p.prd}</b></div>`
      : "";

    panelEl.innerHTML = `
      <span class="tagline">${p.group}</span>
      <h4>${p.id} · ${p.title}</h4>
      <div class="sub">${p.desc}</div>
      ${prdLine}
      ${states}
      <div class="box">
        <div class="bt">本页出口 ${uniq.length}${dead.length ? ` · <span style="color:var(--danger)">断 ${dead.length}</span>` : ""}</div>
        ${uniq.length ? uniq.map((o) => `<div class="lk ${isDead(o.to) ? "dead" : ""}" data-nav="${o.to}">
            <span class="to">→ ${o.to}</span><span class="lb">${o.label}${isDead(o.to) ? "（未迁）" : ""}</span></div>`).join("")
        : `<div class="empty">这一页还没有可点出口</div>`}
      </div>
      <div class="box">
        <div class="bt">谁跳到这里 ${rev.length}</div>
        ${rev.length ? rev.map((r) => `<div class="lk" data-nav="${r.from}">
            <span class="to">${r.from}</span><span class="lb">${r.label}${r.n > 1 ? ` 等 ${r.n} 个入口` : ""}</span></div>`).join("")
        : (p.sysEntry ? `<div class="empty">系统入口：${p.sysEntry}</div>` : `<div class="empty">还没有入口，用户走不到这页</div>`)}
      </div>
      <div class="note">右侧由页面里的 <code>data-go</code> 自动算出，改完页面刷新即同步。断链会标红——那就是还没画或还没接的地方。</div>`;
  }

  /* ---------- 顶部计数 ---------- */
  function renderTop() {
    const done = ORDER.length, total = Object.keys(P).length;
    let deadCount = 0;
    Object.keys(LINKS).forEach((id) => {
      const s = {};
      LINKS[id].forEach((o) => { if (!s[o.to] && isDead(o.to)) { s[o.to] = 1; deadCount++; } });
    });
    countEl.textContent = `已迁 ${done} / ${total} 页 · 断链 ${deadCount} 处`;
    deadEl.textContent = deadCount ? "有入口指向未迁页面" : "";
  }

  /* 页面级"过一会自己走一步"的钩子。
     有些状态本来就是过程（抽取、生成），渲染只负责画当前这一帧，
     下一帧由页面的 after() 返回一条 data-set 表达式来推进。
     每次重渲染都先清掉上一个定时器，避免叠加出多条推进链。 */
  let afterTimer = null;
  function runAfter() {
    clearTimeout(afterTimer);
    const id = cur(), p = P[id];
    if (!p || !p.render || typeof p.after !== "function") return;
    afterTimer = setTimeout(() => {
      if (cur() !== id) return;
      const next = p.after(STATE[id] || {});
      if (next) applySet(next);
    }, 900);
  }

  function renderAll() {
    renderPhone(); renderTree(); renderPanel(); renderTop(); runAfter();
    const i = ORDER.indexOf(cur());
    document.getElementById("pgnum").textContent = i >= 0 ? `${i + 1} / ${ORDER.length} · ${cur()}` : `${cur()} · 未迁`;
    if (btnUser) btnUser.textContent = cur() === "A1.1" ? "看老用户版" : "看新用户版";
  }

  /* ---------- 交互 ---------- */
  function applySet(expr) {
    /* 支持一次设多个：B2.mode=edit&B2.seg=sg03；
       页面 id 本身带点（B2.1），所以要按最后一个点拆，不能直接 split(".") */
    expr.split("&").forEach((pair) => {
      const i = pair.indexOf("=");
      if (i < 0) return;
      const path = pair.slice(0, i), val = pair.slice(i + 1);
      const d = path.lastIndexOf(".");
      const pid = path.slice(0, d), key = path.slice(d + 1);
      if (!pid || !key) return;
      STATE[pid] = STATE[pid] || {};
      STATE[pid][key] = val;
    });
    /* 同页改过状态后，下一次渲染不许再用 hash 里的旧参数覆盖它，
       否则点了像没反应（B2 切来源、退出修缺口态都会踩到） */
    skipHashQuery = true;
    renderAll();
  }

  /* 输入框直接绑页面状态：只写 STATE 不重渲染，否则每敲一个字光标就丢
     用法：<textarea data-bind="B1.topic"> */
  document.addEventListener("input", (e) => {
    const el = e.target.closest && e.target.closest("[data-bind]");
    if (!el) return;
    const path = el.dataset.bind || "";
    const i = path.lastIndexOf(".");
    if (i < 0) return;
    const pid = path.slice(0, i), key = path.slice(i + 1);
    STATE[pid] = STATE[pid] || {};
    STATE[pid][key] = el.value;
    /* data-live：边打字边筛（搜索框用）。整页会重渲染，所以要把焦点和光标位置还回去，
       否则每敲一个字就跳出输入框——这是最容易踩的一个坑。 */
    if (el.hasAttribute("data-live")) {
      const caret = el.selectionStart;
      renderAll();
      const again = phone.querySelector('[data-bind="' + path + '"]');
      if (again) {
        again.focus();
        try { again.setSelectionRange(caret, caret); } catch (_) {}
      }
    }
  });

  /* 滑杆旁边的读数：range 一重渲染拖动就断了，所以只改旁边那个数字。
     用法：<input type="range" data-bind="X.y" data-range-out="#rd-x"> + <span id="rd-x"> */
  document.addEventListener("input", (e) => {
    const r = e.target.closest && e.target.closest('input[type="range"][data-range-out]');
    if (!r) return;
    const out = document.querySelector(r.dataset.rangeOut);
    if (out) out.textContent = (+r.value).toFixed(1) + "s";
  });

  document.addEventListener("click", (e) => {
    /* 轮播点：只滚容器，不重渲染（避免整页刷新丢滚动位置） */
    const dot = e.target.closest("[data-slide-to]");
    if (dot) {
      const wrap = dot.closest("[data-bn]");
      const box = wrap && wrap.querySelector(".carousel");
      if (box) {
        const i = +dot.dataset.slideTo;
        /* 直接改 scrollLeft：smooth 在部分环境（含截图工具）不生效，且和 scroll-snap 打架 */
        box.scrollLeft = i * (box.clientWidth + 10);
        wrap.querySelectorAll("[data-slide-to]").forEach((d, k) => d.classList.toggle("on", k === i));
        bnPausedUntil = Date.now() + BN_RESUME;   // 手动点过就先别自动走
      }
      return;
    }
    const s = e.target.closest("[data-set]");
    if (s) { applySet(s.dataset.set); return; }
    const n = e.target.closest("[data-nav]");
    if (n) { go(n.dataset.nav); return; }
    const g = e.target.closest("[data-go]");
    if (!g) return;
    const to = g.dataset.go;
    if (to === "back") { if (history.length > 1) history.back(); return; }
    go(to);
  });

  /* 手滑轮播时同步底部点 */
  phone.addEventListener("scroll", (e) => {
    const box = e.target.closest && e.target.closest(".carousel");
    if (!box || !box.parentElement) return;
    const i = Math.round(box.scrollLeft / (box.clientWidth + 10));
    box.parentElement.querySelectorAll("[data-slide-to]").forEach((d, k) => d.classList.toggle("on", k === i));
  }, true);

  /* 自动轮播：用户一旦上手就暂停 8 秒，避免"刚看清就跳走" */
  phone.addEventListener("pointerdown", (e) => {
    if (e.target.closest("[data-bn]")) bnPausedUntil = Date.now() + BN_RESUME;
  }, true);

  setInterval(() => {
    const wrap = phone.querySelector("[data-bn][data-auto]");
    if (!wrap) return;
    const box = wrap.querySelector(".carousel");
    if (!box || box.children.length < 2) return;
    if (Date.now() < bnPausedUntil) return;
    if (document.hidden) return;
    const i = (Math.round(box.scrollLeft / (box.clientWidth + 10)) + 1) % box.children.length;
    box.scrollLeft = i * (box.clientWidth + 10);
    wrap.querySelectorAll("[data-slide-to]").forEach((d, k) => d.classList.toggle("on", k === i));
  }, BN_EVERY);

  document.getElementById("prev").onclick = () => {
    const i = ORDER.indexOf(cur());
    go(ORDER[(i - 1 + ORDER.length) % ORDER.length]);
  };
  document.getElementById("next").onclick = () => {
    const i = ORDER.indexOf(cur());
    go(ORDER[(i + 1) % ORDER.length]);
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") document.getElementById("prev").click();
    if (e.key === "ArrowRight") document.getElementById("next").click();
  });

  /* ---------- 导出 ---------- */
  document.getElementById("btn-csv").onclick = () => {
    const rows = [["页面ID", "标题", "分组", "说明", "状态", "出口数", "出口目标"]];
    TREE.forEach((g) => g.items.forEach((id) => {
      const p = P[id], outs = [...new Set((LINKS[id] || []).map((o) => o.to))];
      rows.push([id, p.title, g.group, p.desc, p.render ? "已迁" : "未迁", outs.length, outs.join(" ")]);
    }));
    const csv = "\ufeff" + rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "团长闪剪-页面规格.csv";
    a.click();
  };

  document.getElementById("btn-copy").onclick = () => {
    const lines = ["# 团长闪剪 · 点击链路", ""];
    TREE.forEach((g) => {
      lines.push(`## ${g.group}`);
      g.items.forEach((id) => {
        const p = P[id];
        if (!p.render) { lines.push(`- ${id} ${p.title}（未迁）`); return; }
        const outs = [...new Set((LINKS[id] || []).map((o) => o.to))];
        lines.push(`- ${id} ${p.title} → ${outs.length ? outs.join(" / ") : "（无出口）"}`);
      });
      lines.push("");
    });
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      const b = document.getElementById("btn-copy");
      b.textContent = "已复制";
      setTimeout(() => (b.textContent = "复制链路清单"), 1400);
    });
  };

  /* ---------- 缩放 ---------- */
  function fit() {
    const frame = stageEl.querySelector(".frame");
    if (!frame) return;
    const narrow = window.innerWidth < 900;
    if (narrow) { frame.style.transform = "none"; frame.style.margin = "0"; return; }
    const availH = window.innerHeight - 52 - 56;
    const availW = (stageEl.clientWidth || window.innerWidth) - 140;
    const s = Math.min(1, availW / 397, availH / 834);
    frame.style.transform = `scale(${s})`;
    frame.style.margin = "0 auto";
  }

  /* ---------- 窄屏：页面树当抽屉 ---------- */
  const menuBtn = document.getElementById("btn-menu");
  const btnUser = document.getElementById("btn-user");
  if (btnUser) btnUser.onclick = () => go(cur() === "A1.1" ? "A1" : "A1.1");
  if (menuBtn) {
    menuBtn.onclick = () => {
      treeEl.classList.toggle("open");
      menuBtn.textContent = treeEl.classList.contains("open") ? "✕ 收起" : "☰ 页面";
    };
  }
  treeEl.addEventListener("click", (e) => {
    if (e.target.closest("[data-nav]") && window.innerWidth < 900) {
      treeEl.classList.remove("open");
      if (menuBtn) menuBtn.textContent = "☰ 页面";
    }
  });

  window.addEventListener("resize", fit);
  window.addEventListener("load", fit);
  if (window.ResizeObserver) new ResizeObserver(fit).observe(stageEl);
  window.addEventListener("hashchange", () => { renderAll(); fit(); });

  /* Banner 轮播：每 4.2s 把轨道推一格并同步圆点；顺手写回 STATE，
     这样之后任何一次重渲染都不会跳回第一张。 */
  setInterval(() => {
    if (document.hidden) return;
    const box = document.querySelector("[data-bnr-auto]");
    if (!box) return;
    const dots = box.querySelectorAll("[data-bnr-dot]");
    if (dots.length < 2) return;
    let i = -1;
    dots.forEach((d, j) => { if (d.classList.contains("on")) i = j; });
    const n = (i + 1) % dots.length;
    const track = box.querySelector(".tbnr-track");
    if (track) track.style.transform = "translateX(-" + (n * 100) + "%)";
    dots.forEach((d, j) => d.classList.toggle("on", j === n));
    const pid = box.getAttribute("data-bnr-pid");
    if (pid) { STATE[pid] = STATE[pid] || {}; STATE[pid].bn = String(n); }
  }, 4200);

  buildIndex();
  if (!location.hash) location.replace("#/A1");
  renderAll();
  fit();
  requestAnimationFrame(fit);
  setTimeout(fit, 120);
  setTimeout(fit, 400);
})();
