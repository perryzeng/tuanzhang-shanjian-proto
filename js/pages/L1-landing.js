/* L1 分享落地页（V16.8 · 三套平台皮肤）
   团长在 A8.4.2 里选的那个平台，决定了客户点开时看到的样子。
   皮肤实现在 js/skins.js —— 跟预览页是同一份代码，不会走偏。

   为什么不做成统一的自家页面：
   客户在微信里点开一条链接，如果长得不像视频号/抖音，第一反应是"这是啥"，然后退出。
   长得像，他才愿意往下滑。滑到底，才是我们加的商品信息和「问团长」。

   所以这一页 = 平台播放页（上半段，1:1 像）+ 我们的团购卡（下半段）+ 固定咨询按钮。
   所有行为照常回传 —— 这是自家页面，不是真的发在平台上。 */

window.PAGES["L1"].prd = "PRD V16 §5.3 · 分享落地页（按平台皮肤渲染 + 埋点）";
window.PAGES["L1"].sysEntry = "A8.4.2 底部「分享到朋友圈」；真实场景由微信链接打开";

window.PAGES["L1"].render = function (ctx) {
  const C = window.C, B = window.BIZ, L = window.LIB, S = window.SKIN;
  const P = B.landing;
  const w = L.works.filter((x) => x.id === ctx.c)[0] || L.works[0];
  const pf = ["wx", "dy", "xhs"].indexOf(ctx.pf) >= 0 ? ctx.pf : "dy";
  const p = L.plats[pf];

  /* 团长刚在 A8.4.2 调的四个数，客户这边看到的必须是同一组 —— 不然
     "预览"和"真发出去"两套数字，预览就白做了。 */
  const pre = (window.STATE && window.STATE["A8.4.2"]) || {};
  const pick = (k, d) => (pre[pf + "_" + k] != null && pre[pf + "_" + k] !== "" ? pre[pf + "_" + k] : d);
  const v = { like: pick("like", p.likes), cmt: pick("cmt", p.comments), share: pick("share", p.shares), star: pick("star", p.stars) };

  const wf = Object.assign({}, w, {
    who: "大 P",
    tags: "#心脑血管科普 #磷虾油",
    body: "今天把我妈的体检单翻出来了，吃了三个月的变化都在这张纸上。不说效果，你们自己看。"
  });

  return `<div class="app" style="background:#fff">
    ${C.sb()}

    <div class="v14-lpdemo">
      <span>演示 · 客户在微信里点开，看到的是${p.name}的样子</span>
      <span class="v14-lpdemo-back" data-go="A8.4.2?pf=${pf}&c=${w.id}" data-label="回到预览">‹ 回到预览</span>
    </div>

    <div class="body nopad">
      <div class="v25-scr lp">${S.render(pf, wf, v, { noSb: true })}</div>

      <div class="v14-lp-body">
        <div class="v14-lp-offer">${P.offer}</div>

        <div class="v14-lp-points">
          ${P.points.map((t, i) => `<div class="v14-lp-pt"><i>${i + 1}</i><span>${t}</span></div>`).join("")}
        </div>

        <div class="v14-lp-track">
          <div class="v14-lpt-hd">这些行为正在回到大 P 的首页</div>
          ${P.tracked.map(([k, val]) => `<div class="v14-lpt-r"><span>${k}</span><b>${val}</b></div>`).join("")}
        </div>

        <div class="xs" style="margin:14px 0 8px;line-height:1.7">
          本页由大 P 分享 · 仅用于本团咨询，不对外公开
        </div>
      </div>
    </div>

    <div class="v14-lp-fade"></div>
    <div class="v14-lp-cta">
      <span class="v14-lp-cta-i">聊</span>
      <b>${P.cta}</b>
    </div>
  </div>`;
};
