window.PAGES["B1.2"].prd = "PRD §6.2 · 导入脚本（从脚本库引入，不走上传）";

/* 导入脚本 ≠ 上传文件。
   团长手上真正有的是「我以前发过、跑过单的那条」，所以第一版就做成脚本库：
   我的 / 团队 / 总部口径，选一份直接引入，台词原样带过来，画面重新配。
   脚本库与素材库是两套东西：脚本存货是分好段的台词，素材库存画面。 */
window.PAGES["B1.2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE, G = window.G;
  const scope = ctx.scope || "my";
  const q = ctx.q || "";
  /* 搜索跨库：一旦打了字，就不该被"我 / 团队 / 总部"三个 tab 挡着——
     我记得的是"那条讲成分的稿子"，不是"它在哪个库里" */
  const base = q ? D.scripts("all") : D.scripts(scope);
  const list = D.search(base, q, ["title", "product", "who", "tags", "note"]);
  const bgOf = { my: G("#2C5BFF", "#5B8CFF"), team: G("#00A8E8", "#00C2FF"), brand: G("#7C5CFF", "#B08CFF") };

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "导入脚本", sub: "选一份现成的，直接配画面", back: "B1" })}

    <div class="body">
      <div class="gsearch">
        <span class="mag">⌕</span>
        <input data-bind="B1.2.q" data-live value="${q}" placeholder="搜脚本：商品、标题、谁写的" />
        ${q ? `<span class="xs" style="color:var(--brand);font-weight:600" data-set="B1.2.q=">清空</span>` : ""}
      </div>

      ${q ? "" : `<div class="tabs2">
        ${D.scriptTabs().map((t) => `<b class="${scope === t.k ? "on" : ""}" data-set="B1.2.scope=${t.k}">${t.tx} ${t.n}</b>`).join("")}
      </div>`}

      ${q ? `<div class="xs" style="margin:-4px 2px 10px">跨三个库搜到 ${list.length} 份</div>` : ""}

      ${list.map((s) => C.li({
        bg: bgOf[s.scope],
        im: s.scope === "my" ? "我" : (s.scope === "brand" ? "总" : s.who.slice(0, 1)),
        title: s.title,
        m1: s.product + " · " + s.segs + " 段 · " + s.dur + " 秒 · 用过 " + s.used + " 次",
        m2: s.note,
        tag: s.locked ? "锁定" : (s.scope === "my" ? "我的" : s.who),
        tagCls: s.locked ? "p" : (s.scope === "my" ? "b" : "line"),
        go: "B1.3?doc=" + s.id
      })).join("")}

      ${!list.length ? `<div class="card plain" style="text-align:center;padding:26px 16px"><div class="xs">没搜到「${q}」<br>换个词，或粘贴一份新的</div></div>` : ""}

      <div class="card plain" style="margin-top:6px">
        <div class="xs" style="line-height:1.7">
          ${scope === "my" ? "这些是你自己存过的稿子，跑过单的优先排在前面。引入后台词原样保留，画面重新配。"
            : scope === "team" ? "团队共享脚本：别人跑出来的结构，你直接拿去用。引入后会自动把「我」换成你的称呼。"
            : "总部统一口径，第 2 段台词不可改（合规要求），其余可以换成你的说法。"}
        </div>
      </div>

      ${C.sec("手里有现成的稿子")}
      <div class="card" style="display:flex;align-items:center;gap:12px">
        <div style="width:42px;height:42px;border-radius:14px;background:var(--brand-weak);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:17px;flex:0 0 42px">⧉</div>
        <div style="flex:1;min-width:0">
          <div class="h3">粘贴或上传</div>
          <div class="xs" style="margin-top:3px">doc / txt / 公众号链接，粘进去自动拆段</div>
        </div>
        <span class="btn-pill" data-go="B2?kind=script&src=import&doc=sc_318" data-label="粘贴后直接拆段">粘贴</span>
      </div>
    </div>
  </div>`;
};
