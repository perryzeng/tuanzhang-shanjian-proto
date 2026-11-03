/* A8.4.2 按平台预览（V16.8）
   一条作品发到三个地方，长相完全不同，团长要**先看见它长什么样**再决定发哪儿。
   三套皮肤的实现在 js/skins.js —— 落地页 L1 用的是同一份，改一处两边一起改。

   这一页做三件事：
   ① 整屏还原三个平台的播放页（切 tab 就换，不是小卡片，是整屏）
   ② 互动数可改，改了屏幕上那个数立刻跟着跳（data-out，不整页重渲染）
   ③ 贴真实链接 → 确定 → 回填平台真实数据

   底部「分享到朋友圈」出去的是我们自己的落地页，客户打开时看到的仍是这套皮肤。 */

window.PAGES["A8.4.2"].prd = "PRD V16 §5.2 · 平台预览（三套皮肤 / 模拟数据 / 真实链接）";
window.PAGES["A8.4.2"].sysEntry = "作品详情里的三个平台入口";

window.PAGES["A8.4.2"].render = function (ctx) {
  const C = window.C, L = window.LIB, S = window.SKIN;
  const w = L.works.filter((x) => x.id === ctx.c)[0] || L.works[0];
  const pf = ["wx", "dy", "xhs"].indexOf(ctx.pf) >= 0 ? ctx.pf : "dy";
  const p = L.plats[pf];

  /* 手填优先于默认值：input 用 data-bind 写进 STATE（不重渲染，光标不跳），
     切平台回来还能读到自己填的数。 */
  const val = (k, d) => (ctx[pf + "_" + k] != null && ctx[pf + "_" + k] !== "") ? ctx[pf + "_" + k] : d;

  const v = { like: val("like", p.likes), cmt: val("cmt", p.comments), share: val("share", p.shares), star: val("star", p.stars) };

  /* 三条作品共用一份文案骨架，但平台的排版习惯不同，所以文案分开给 */
  const wf = Object.assign({}, w, {
    who: "大 P",
    tags: "#心脑血管科普 #磷虾油",
    card: "大 P · 每天一条中老年营养",
    body: "今天把我妈的体检单翻出来了，吃了三个月的变化都在这张纸上。不说效果，你们自己看。"
  });

  const pulled = ctx.pull === pf;

  return `<div class="app v25-app">
    ${C.sb(true)}

    <div class="v25-bar">
      <span class="bk" data-go="A8.4.1?c=${w.id}" data-label="回作品">${S.icon.chev}</span>
      <div class="seg">
        ${["wx", "dy", "xhs"].map((k) => `<span class="${pf === k ? "on" : ""}" data-set="A8.4.2.pf=${k}">${L.plats[k].name}</span>`).join("")}
      </div>
      <span class="ghost">分享效果</span>
    </div>

    <div class="v25-scr">${S.render(pf, wf, v, { noSb: true })}</div>

    <div class="body" style="padding:0">
      <div class="v25-panel">
        <div class="hd">模拟互动数据<em>改了上面立刻变</em></div>
        <div class="v25-grid">
          <label><span>点赞</span><input data-bind="A8.4.2.${pf}_like" data-out=".v25-n-like" value="${v.like}"></label>
          <label><span>评论</span><input data-bind="A8.4.2.${pf}_cmt" data-out=".v25-n-cmt" value="${v.cmt}"></label>
          <label><span>分享</span><input data-bind="A8.4.2.${pf}_share" data-out=".v25-n-share" value="${v.share}"></label>
          <label><span>收藏</span><input data-bind="A8.4.2.${pf}_star" data-out=".v25-n-star" value="${v.star}"></label>
        </div>

        <div class="v25-link">
          <div class="hd2">贴真实链接抓平台数据<em>${p.name}</em></div>
          <div class="row">
            <span class="inbox"><input placeholder="粘贴${p.name}的作品链接…" ${pulled ? `value="https://${pf === "wx" ? "channels.weixin.qq.com" : pf === "dy" ? "v.douyin.com" : "xhslink.com"}/iRk3fA2"` : ""}></span>
            ${pulled
              ? `<span class="done">✓ 已锁定</span>`
              : `<span class="ok" data-set="A8.4.2.pull=${pf}&A8.4.2.${pf}_like=${p.likes + 622}&A8.4.2.${pf}_cmt=${p.comments + 33}&A8.4.2.${pf}_share=${p.shares + 36}&A8.4.2.${pf}_star=${p.stars + 48}">确定</span>`}
          </div>
          ${pulled
            ? `<div class="got">✓ 2 分钟前抓到 · 赞 ${S.nf(p.likes + 622)} / 评 ${S.nf(p.comments + 33)} / 转 ${S.nf(p.shares + 36)} / 藏 ${S.nf(p.stars + 48)}</div>`
            : `<div class="tip">抓得到就用真实数，抓不到上面四个数可以手填。只影响「发出去长什么样」，不回写作品真实数据。</div>`}
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" data-go="A8.4.1?c=${w.id}" data-label="回作品"><span>‹</span><b>作品</b></div>
      <div class="btn" data-go="L1?pf=${pf}&c=${w.id}" data-label="分享到朋友圈">分享到朋友圈</div>
    </div>
  </div>`;
};
