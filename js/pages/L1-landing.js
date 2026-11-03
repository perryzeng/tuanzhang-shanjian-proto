/* L1 分享落地页（V14 新增）—— 客户视角
   这一页是整个闭环的承载物。没有它，"谁看了、看多久、点了什么"全部拿不到，
   首页上所有"感知"都会变成假的。

   原型里它是给团长看的：让团长第一次看见「我发出去的东西，客户点开长什么样」。
   所以顶部有一条灰色演示条，实际产品里没有这一条。

   页面里的行为都会被记录：进入、停留、滚动到第几个卖点、点了购物车、点了咨询。 */

window.PAGES["L1"].prd = "PRD V14 §4 · 分享落地页（客户视角 + 埋点）";
window.PAGES["L1"].sysEntry = "从 S1 分发器的「客户点开会看到什么」进入；真实场景由微信链接打开";

window.PAGES["L1"].render = function (ctx) {
  const C = window.C, B = window.BIZ, P = B.landing;
  const v = B.pending.filter((x) => x.id === ctx.v)[0] || B.pending[0];

  return `<div class="app" style="background:#fff">
    ${C.sb()}

    <div class="v14-lpdemo">
      <span>演示 · 客户在微信里点开的这一页</span>
      <span class="v14-lpdemo-back" data-go="S1" data-label="回到分发">‹ 回到分发</span>
    </div>

    <div class="body nopad" style="background:#fff">
      <div class="v14-lp-top">
        <div class="v14-lp-av">${P.seller.av}</div>
        <div class="v14-lp-tt">
          <b>${P.seller.name}</b>
          <span>${P.seller.note}</span>
        </div>
        <div class="v14-lp-follow">关注</div>
      </div>

      <div class="v14-lp-video">
        <img src="${v.img}" alt="">
        <span class="v14-lp-play">▶</span>
        <span class="v14-lp-dur">${v.dur}</span>
      </div>

      <div class="v14-lp-body">
        <h3>${v.title}</h3>

        <div class="v14-lp-offer">${P.offer}</div>

        <div class="v14-lp-points">
          ${P.points.map((t, i) => `<div class="v14-lp-pt"><i>${i + 1}</i><span>${t}</span></div>`).join("")}
        </div>

        <div class="v14-lp-track">
          <div class="v14-lpt-hd">这些行为正在回到阿珍的首页</div>
          ${P.tracked.map(([k, val]) => `<div class="v14-lpt-r"><span>${k}</span><b>${val}</b></div>`).join("")}
        </div>

        <div class="xs" style="margin:14px 0 20px;line-height:1.7">
          本页由阿珍分享 · 仅用于本团咨询，不对外公开
        </div>
      </div>
    </div>

    <div class="v14-lp-cta">
      <span class="v14-v14-lp-cta-i">聊</span>
      <b>${P.cta}</b>
    </div>
  </div>`;
};
