window.PAGES["B1"].render = function () {
  const C = window.C, D = window.DERIVE, G = window.G;

  /* 三个发布器已合成一个（B2），这里只选"从哪开始"；
     卡片直接带 kind 进去，进去后还能在顶部来回切，不用退出来 */
  const card = (o) => `<div class="mode" style="background:${o.bg}" data-go="${o.go}" data-label="${o.name}">
      <div class="mt"><b>${o.name}</b><span class="tag" style="background:rgba(255,255,255,.22);color:#fff">${o.tag}</span></div>
      <div class="md">${o.desc}</div>
      <div class="mb">${o.links.map((l) => `<span data-go="${l.go}" data-label="${l.tx}" style="color:${o.ink}">${l.tx}</span>`).join("")}</div>
    </div>`;

  const s = D.draft("script"), r = D.draft("remix"), se = D.draft("series");

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "创作", t: "想怎么剪？", act: `<span class="btn-pill line">草稿 3</span>` })}

    <div class="body">
      ${card({
        name: "脚本混剪", tag: "最常用", bg: "var(--g-brand)", ink: "var(--brand-ink)",
        desc: "说一句口径，AI 出分段脚本，逐段配画面。",
        go: "B2?kind=script",
        links: [{ tx: "✦ AI 帮我写", go: "B2?kind=script" }, { tx: "↓ 导入脚本", go: "B2?kind=script" }]
      })}

      ${card({
        name: "剪同款 / 二创", tag: "涨粉最快", bg: "linear-gradient(135deg,#00A8E8,#00C2FF)", ink: "#0A6E96",
        desc: "导入别人的爆款，逐段换成你自己的话和画面。",
        go: "B2?kind=remix",
        links: [{ tx: "↓ 导入本地", go: "C1" }, { tx: "⧉ 粘贴链接", go: "C1" }]
      })}

      ${card({
        name: "SOP 系列", tag: "团队统一", bg: "var(--g-violet)", ink: "#5B3FD1",
        desc: "按总部节奏走，每天一个主题，素材口径都备好。",
        go: "B2?kind=series",
        links: [{ tx: "继续第 " + se.series.day + " 天", go: "B2?kind=series" }, { tx: "看本期任务", go: "D1" }]
      })}

      <div class="xs" style="text-align:center;margin:14px 0 2px">三个发布器已合成一个，进去后顶部随时切</div>

      ${C.sec("继续创作", "全部", "A1")}
      ${C.li({ bg: G("#7C5CFF", "#B08CFF"), title: s.title, m1: `${s.segCount} 段 · 已配 ${s.segCount - s.missSegs.length}/${s.segCount} 段画面`, btn: "继续", go: "B2?kind=script" })}
      ${C.li({ bg: G("#00A8E8", "#00C2FF"), title: r.title, m1: `已改 ${r.changed}/${r.segCount} 段 · 安全度 ${r.safety}`, btn: "继续", btnCls: "line", go: "B2?kind=remix" })}
    </div>

    ${C.tab("")}
  </div>`;
};
