/* L1 分享落地页（V16.7 · 三套平台皮肤）
   团长在 A8.4.2 里选的那个平台，决定了客户点开时看到的样子。

   为什么不做成统一的自家页面：
   客户在微信里点开一条链接，如果长得不像视频号/抖音，第一反应是"这是啥"，然后退出。
   长得像，他才愿意往下滑。滑到底，才是我们加的商品信息和「问团长」。

   所以这一页 = 平台皮肤（上半段，1:1 像）+ 我们的商品卡（下半段）+ 固定咨询按钮。
   所有行为照常回传 —— 这是自家页面，不是真的发在平台上。 */

window.PAGES["L1"].prd = "PRD V16 §5.3 · 分享落地页（按平台皮肤渲染 + 埋点）";
window.PAGES["L1"].sysEntry = "A8.4.2 底部「分享到朋友圈」；真实场景由微信链接打开";

window.PAGES["L1"].render = function (ctx) {
  const C = window.C, B = window.BIZ, L = window.LIB;
  const P = B.landing;
  const w = L.works.filter((x) => x.id === ctx.c)[0] || L.works[0];
  const pf = ["wx", "dy", "xhs"].indexOf(ctx.pf) >= 0 ? ctx.pf : "wx";
  const p = L.plats[pf];
  const dark = pf === "dy";

  const skinTop = pf === "wx" ? `<div class="v24-wx-top">
      <span class="v24-wx-av">P</span>
      <div><b>大 P</b><span>昨天 20:14</span></div>
      <em>···</em>
    </div>` : pf === "dy" ? `<div class="v24-lp-dytop"><span class="sp"></span><div><span>关注</span><span class="on">推荐</span></div><em>⌕</em></div>` : `<div class="v24-xhs-top">
      <span class="v24-xhs-back">‹</span>
      <span class="v24-xhs-av">P</span>
      <span class="v24-xhs-nm">大 P</span>
      <em>关注</em>
    </div>`;

  const ops = pf === "wx" ? `<div class="v24-wx-ops">
      <span><i>♥</i>${p.likes}</span><span><i>✎</i>${p.comments}</span><span><i>↗</i>${p.shares}</span>
    </div>` : pf === "xhs" ? `<div class="v24-xhs-ops">
      <span>♥ ${p.likes}</span><span>☆ 收藏</span><span>✎ 评论</span>
    </div>` : "";

  return `<div class="app" style="background:${dark ? "#000" : "#fff"}">
    ${C.sb()}

    <div class="v14-lpdemo">
      <span>演示 · 客户在微信里点开，看到的是${p.name}的样子</span>
      <span class="v14-lpdemo-back" data-go="A8.4.2?pf=${pf}&c=${w.id}" data-label="回到预览">‹ 回到预览</span>
    </div>

    <div class="body nopad" style="background:${dark ? "#000" : "#fff"}">
      ${skinTop}

      <div class="v24-lp-vd" style="${pf === "xhs" ? "aspect-ratio:3/4" : ""}">
        <img src="${w.img}" alt="">
        <span class="v24-lp-play">▶</span>
        <span class="v24-lp-dur">${w.dur}</span>
      </div>

      <div class="v24-lp-tx" style="${dark ? "color:#fff" : ""}">
        <b>${w.title}</b>
        ${dark ? `<p style="color:rgba(255,255,255,.78)">#心脑血管 #磷虾油科普</p><span style="color:rgba(255,255,255,.5)">♫ 原声 · 大 P</span>`
               : `<p>#心脑血管科普 #磷虾油</p>`}
      </div>

      ${ops}

      <div class="v24-lp-gap" style="background:${dark ? "#141414" : "#F7F6FA"}"></div>

      <div class="v14-lp-body">
        <div class="v14-lp-offer">${P.offer}</div>

        <div class="v14-lp-points">
          ${P.points.map((t, i) => `<div class="v14-lp-pt"><i>${i + 1}</i><span>${t}</span></div>`).join("")}
        </div>

        <div class="v14-lp-track">
          <div class="v14-lpt-hd">这些行为正在回到大 P 的首页</div>
          ${P.tracked.map(([k, val]) => `<div class="v14-lpt-r"><span>${k}</span><b>${val}</b></div>`).join("")}
        </div>

        <div class="xs" style="margin:14px 0 20px;line-height:1.7">
          本页由大 P 分享 · 仅用于本团咨询，不对外公开
        </div>
      </div>
    </div>

    <div class="v14-lp-cta">
      <span class="v14-lp-cta-i">聊</span>
      <b>${P.cta}</b>
    </div>
  </div>`;
};
