window.PAGES["B1.3"].prd = "PRD §6.2 / §6.9 · 脚本详情（引入方式：全量 or 只借结构）";

/* 引入一份脚本前，得让人先看清里面到底怎么写。
   两种引入方式对应两种真实动机：
   · 整份引入 —— 台词我认，只是画面要换成我自己的
   · 只借结构 —— 结构好，话我自己说（那就等于让 AI 按这个骨架重写） */
window.PAGES["B1.3"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const s = D.script(ctx.doc);
  const total = s.lines.reduce((n, l) => n + l.dur, 0);

  const lines = s.lines.map((l, i) => C.seg({
    no: (i + 1 < 10 ? "0" : "") + (i + 1),
    name: l.name,
    dur: l.dur + "s",
    tags: l.lock === "brand" ? [["", "品牌锁定"]] : [],
    vo: l.vo,
    edit: false
  })).join("");

  return `<div class="app">
    ${C.sb()}
    ${C.ab({
      title: s.title,
      sub: s.who + " · " + s.product + " · " + (s.locked ? "总部锁定口径" : "可自由改"),
      back: "B1.2",
      act: "收藏"
    })}

    <div class="body">
      <div class="card" style="padding:4px 16px 8px;margin-bottom:12px">
        <div class="kv"><span class="k">分段</span><span class="v">${s.segs} 段 · ${total} 秒</span></div>
        <div class="kv"><span class="k">被引入过</span><span class="v">${s.used} 次</span></div>
        <div class="kv"><span class="k">合规</span><span class="v" style="color:var(--success)">✓ 上次检查 ${s.at} 通过</span></div>
      </div>

      <div class="card plain" style="margin-bottom:14px">
        <div class="xs" style="line-height:1.7">${s.note}</div>
      </div>

      ${C.sec("全文分段")}
      ${lines}

      <div class="card plain">
        <div class="xs" style="line-height:1.75">
          <b style="color:var(--text)">两种引入方式</b><br>
          · <b style="color:var(--text)">只导入文案</b>：台词照搬，画面全部留空，进去自己配（想用自己的素材时选这个）<br>
          · <b style="color:var(--text)">文案 + 素材</b>：画面也按每段语义配好，进去就能直接生成
          ${s.scope === "team" ? "<br>别人的自称会自动换成你的。" : ""}
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 118px" data-go="B2?kind=script&src=import&doc=${s.id}&only=1" data-label="只导入文案">只导入文案</div>
      <div class="btn" data-go="B2?kind=script&src=import&doc=${s.id}" data-label="文案加素材">文案 + 素材</div>
    </div>
  </div>`;
};
