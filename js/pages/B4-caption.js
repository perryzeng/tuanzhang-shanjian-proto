window.PAGES["B4"].prd = "PRD §6.15 · 选封面（AI 网感封面，6 选 1）";

/* 生成完只剩一件事：选封面。
   为什么单独一页、为什么是 AI 生成而不是从视频帧里截：
   竖屏信息流里用户只看到一张图，这张图决定点不点开。截帧永远是糊的、字也压不住，
   真正能打的封面是投手做出来的——所以这里给 6 张风格不同的，选一张就走。 */
window.PAGES["B4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const covers = D.covers();
  const sel = ctx.cv || covers[0].k;
  const selItem = covers.filter((c) => c.k === sel)[0] || covers[0];

  const cv = (c) => `<div class="cv2${c.k === sel ? " sel" : ""}" data-set="B4.cv=${c.k}">
      <div class="bg" style="background:linear-gradient(155deg,${c.c1},${c.c2})"></div>
      <span class="bd">${c.name}</span>
      <div class="bt"><b>${c.big}</b><span>${c.small}</span></div>
      ${c.k === sel ? `<span class="ck2">✓</span>` : ""}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "选封面", sub: "AI 按这条的台词出了 6 张", back: "B3", act: "换一批" })}

    <div class="body">
      <div class="cgrid">${covers.map(cv).join("")}</div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">
          <b style="color:var(--text)">为什么是这 6 种：</b>大字价格、疑问钩子、左右对比、真人大字、成分特写、晒单背书——
          竖屏带货最吃得开的六个方向。同一句话换个封面，点击能差两三倍。
        </div>
      </div>

      <div class="card" style="margin-top:11px;display:flex;align-items:center;gap:10px;background:var(--success-weak);box-shadow:none">
        <span style="width:20px;height:20px;border-radius:50%;background:var(--success);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;flex:0 0 20px">✓</span>
        <div style="flex:1">
          <div style="font-size:12.5px;font-weight:600;color:#0B8C68">封面已过合规</div>
          <div class="xs" style="margin-top:2px;color:#2F7F68">「${selItem.big}」无「最 / 第一 / 治疗」等禁用表述；AI 生成图已自动标注</div>
        </div>
      </div>

      <div class="card plain" style="margin-top:11px">
        <div class="xs" style="line-height:1.7">
          封面上的价格和开团时间必须与本期团价一致，改了团价记得换封面——这是最常被判「虚假宣传」的一处。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 108px" data-go="B4.1" data-label="用视频首帧">用首帧</div>
      <div class="btn" data-go="B4.1" data-label="用这张发布">✓ 用「${selItem.name}」发布</div>
    </div>
  </div>`;
};
