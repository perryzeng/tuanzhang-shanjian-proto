(function () {
  const P = window.PAGES, TREE = window.TREE, STATE = window.STATE, C = window.C;
  const phone = document.getElementById("phone");
  const treeEl = document.getElementById("tree");
  const panelEl = document.getElementById("panel");
  const stageEl = document.getElementById("stage");
  const countEl = document.getElementById("count");
  const deadEl = document.getElementById("deadtip");

  let LINKS = {}, REV = {}, ORDER = [];

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
        const to = el.dataset.go;
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
    if (q) new URLSearchParams(q).forEach((v, k) => { STATE[id] = STATE[id] || {}; STATE[id][k] = v; });
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
        : `<div class="empty">还没有入口，用户走不到这页</div>`}
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

  function renderAll() {
    renderPhone(); renderTree(); renderPanel(); renderTop();
    const i = ORDER.indexOf(cur());
    document.getElementById("pgnum").textContent = i >= 0 ? `${i + 1} / ${ORDER.length} · ${cur()}` : `${cur()} · 未迁`;
  }

  /* ---------- 交互 ---------- */
  function applySet(expr) {
    const [path, val] = expr.split("=");
    const [pid, key] = path.split(".");
    STATE[pid] = STATE[pid] || {};
    STATE[pid][key] = val;
    renderAll();
  }

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

  buildIndex();
  if (!location.hash) location.replace("#/A1");
  renderAll();
  fit();
  requestAnimationFrame(fit);
  setTimeout(fit, 120);
  setTimeout(fit, 400);
})();
