/* A8.1 素材库（V16.2 · 按叙事功能组织）
   上一版按"这是什么"分类（讲成分/给证据/产品/空镜/对比），还是站在素材的立场。
   这一版换成**叙事功能**——团长剪片时是按段落找料的：

   开场得先钩住人 → 中间要把东西讲清楚 → 还得证明可信 → 补点生活气 → 最后给个行动理由。

   这五个正好对应剪一条片子的五段。他打开素材页想的是"我缺一段讲清楚的"，
   不是"我要一条实体实物展示"。

   字段上做了减法：只露用户能懂的。
   露：画面摘要 / 景别 / 情绪 / 来源 / 星级 / 组内用过几次。
   不露：切片ID、源ID、OSS路径、运镜手法、画面实体语义 —— 那是给检索用的。 */

window.PAGES["A8.1"].prd = "PRD V16 §2 · 素材库（叙事功能 / 画面摘要 / 使用情况）";
window.PAGES["A8.1"].sysEntry = "底部 tab「素材」；对话里的素材卡也跳这里";

window.PAGES["A8.1"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const fn = ctx.f || "全部";
  const one = L.blocks.filter((x) => x.id === ctx.b)[0];

  const list = fn === "全部" ? L.blocks : L.blocks.filter((x) => x.fn === fn);

  const star = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  const tile = (b) => `<div class="v17-blk" data-set="A8.1.b=${b.id}" data-label="${b.cat}">
      <div class="v17-blk-th">
        <img src="${b.img}" alt="">
        <span class="v17-blk-dur">${b.dur}</span>
        <i class="v17-blk-kind">${b.shot}</i>
      </div>
      <p>${b.summary}</p>
      <div class="v17-blk-tags"><span>${b.cat}</span><span>${b.mood}</span></div>
      <div class="v17-blk-ft">
        <span class="v17-star">${star(b.star)}</span>
        <em class="${b.teamUsed >= 8 ? "warn" : ""}">组内用过 ${b.teamUsed} 次</em>
      </div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <div class="ttl">素材<small>${L.stats.clips} 个可用片段 · 按「剪哪一段」分</small></div>
      <span class="act" data-go="A8.1.1" data-label="原始素材">原始素材</span>
    </div>

    <div class="body">
      <div class="v16-search">
        <span>⌕</span>
        <input placeholder="找一段能用的：体检单 / 成分表 / 发货" />
      </div>

      <div class="v17-fns">
        <div class="v17-fn ${fn === "全部" ? "on" : ""}" data-set="A8.1.f=全部">
          <b>全部</b><span>${L.stats.clips}</span><em>不分段</em>
        </div>
        ${L.fnCats.map((c) => `<div class="v17-fn ${fn === c.k ? "on" : ""}" data-set="A8.1.f=${c.k}">
          <b>${c.k}</b><span>${c.n}</span><em>${c.note}</em>
        </div>`).join("")}
      </div>

      <div class="v17-grid">
        ${list.length ? list.map(tile).join("") : `<div class="xs" style="padding:30px 0;text-align:center;grid-column:1/-1">这一段还没料，去原始素材里拆一条</div>`}
      </div>

      <div class="v17-more" data-go="A8.1.1" data-label="原始素材">
        <div>
          <b>原始素材</b>
          <span>${L.stats.mine.n} 条原始料 · ${L.stats.pending} 条还在拆 · ${L.stats.issue} 条有问题</span>
        </div>
        <em>›</em>
      </div>

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        片段由U剪从原始素材里拆出来，已过合规检查。「组内用过」次数高的，建议换一段，别和其他人撞。
      </div>
    </div>

    ${C.tab8("A8.1")}

    ${one ? `<div class="v14-dw-mask" data-set="A8.1.b=">
      <div class="v14-dw" data-set="A8.1.b=">
        <div class="v17-pv">
          <img src="${one.img}" alt="">
          <span class="v17-pv-play">▶</span>
          <span class="v17-pv-dur">${one.dur}</span>
        </div>
        <div class="v17-pv-hd">
          <span class="tag b">${one.fn}</span>
          <span class="tag line">${one.shot}</span>
          <span class="tag line">${one.mood}</span>
          <em>${one.auth}</em>
        </div>
        <p class="v17-pv-tx">${one.summary}</p>
        <div class="v17-pv-meta">
          ${one.cat} · 质量 ${star(one.star)} · 组内用过 ${one.teamUsed} 次${one.teamUsed >= 8 ? "，建议换一段，别和其他人撞" : ""}
        </div>
        <div class="v14-dw-act">
          <div class="v14-dw-b1" data-go="A8?blk=${one.id}" data-label="用这条剪">用这条剪一条</div>
          <div class="v14-dw-b2" data-set="A8.1.b=">先放着</div>
        </div>
      </div>
    </div>` : ""}
  </div>`;
};
