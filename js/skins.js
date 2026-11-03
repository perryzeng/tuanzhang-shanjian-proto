/* 三平台播放页皮肤（V16.8）
   ---------------------------------------------------------------
   为什么单独抽一个文件：
   作品预览页（A8.4.2）和客户点开的落地页（L1）必须长得**完全一样** ——
   团长在这儿看到的，就是客户在微信里看到的那一屏。两份代码迟早会走偏，
   所以只留一份实现。

   为什么是"播放页"而不是 feed 卡片：
   团长要对比的是"点开某一条之后的那一屏"。feed 卡片流是刷到的场景，
   点开才是转化的场景，也是客户真正会截图问"这是你们发的？"的那一屏。

   三套皮肤的数据位是统一的四个：点赞 like / 评论 cmt / 分享 share / 收藏 star。
   平台叫法不同（视频号叫转发、小红书叫收藏），但用户只填四个数。
   数字外面套 .v25-n-like 这类类名，配合 core.js 的 data-out 就地改，不整页重渲染。 */

(function () {
  /* ---------- 图标：全部手写 SVG，不用 emoji ----------
     emoji 在三个平台上会渲染成三种字形，一眼就出戏。 */
  const S = (d, extra) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"${extra || ""}>${d}</svg>`;

  const I = {
    chev: S('<path d="M15 4.6 8.2 12 15 19.4" stroke-width="2"/>'),
    frames: S('<rect x="3.6" y="7.2" width="11.6" height="11.6" rx="2.6"/><path d="M8 3.6h9.4A3 3 0 0 1 20.4 6.6V16"/>'),
    search: S('<circle cx="10.7" cy="10.7" r="6.1"/><path d="M15.3 15.3 20 20"/>'),
    person: S('<circle cx="12" cy="8.1" r="3.5"/><path d="M5.6 19.6c1.1-3.2 3.5-4.8 6.4-4.8s5.3 1.6 6.4 4.8"/>'),
    clock: S('<circle cx="12" cy="12" r="8.3"/><path d="M10.4 8.9l4.5 3.1-4.5 3.1z" fill="currentColor" stroke="none"/>'),
    danmu: S('<path d="M4.2 14.4v-2.2a7.8 7.8 0 0 1 15.6 0v2.2"/><rect x="2.1" y="12.4" width="4.5" height="6.8" rx="2.25"/><rect x="17.4" y="12.4" width="4.5" height="6.8" rx="2.25"/>'),
    thumb: S('<path d="M7.3 10.3v9.4H4.7a1.3 1.3 0 0 1-1.3-1.3v-6.9a1.3 1.3 0 0 1 1.3-1.2h2.6Z"/><path d="M7.3 10.3 11.4 4a1.3 1.3 0 0 1 2.4.8v4.2h4.6a1.9 1.9 0 0 1 1.9 2.3l-1.2 6.1a1.9 1.9 0 0 1-1.9 1.6H7.3"/>'),
    share: S('<path d="M13.3 5.2 20 11.1l-6.7 5.8v-3.4c-4.6-.3-7.5 1.7-9.1 5.1-.2-5 3.1-8.7 9.1-9.2V5.2Z"/>'),
    heart: S('<path d="M12 20.2c-.7-.5-7.5-5-7.5-10A4.3 4.3 0 0 1 12 7.5a4.3 4.3 0 0 1 7.5 2.7c0 5-6.8 9.5-7.5 10Z"/>'),
    bubble: S('<path d="M20.3 12.3c0 3.6-3.7 6.5-8.3 6.5-1 0-2-.13-2.9-.4L4 20.2l1.3-3.4c-.9-1.2-1.4-2.7-1.4-4.5 0-3.6 3.7-6.5 8.1-6.5s8.3 2.9 8.3 6.5Z"/>'),
    star: S('<path d="m12 3.9 2.6 5.2 5.8.85-4.2 4.1 1 5.75L12 17.1l-5.2 2.7 1-5.75-4.2-4.1 5.8-.85L12 3.9Z"/>'),
    play: `<span class="v25-play"><b></b></span>`
  };

  /* 万级缩写：抖音/视频号都这么显示，直接摆 4210 反而不像 */
  const nf = (n) => {
    const v = Number(String(n).replace(/[^\d.]/g, ""));
    if (!v && v !== 0) return n;
    if (v >= 10000) return (v / 10000).toFixed(1).replace(/\.0$/, "") + "万";
    return String(v);
  };

  /* 状态栏。真机状态栏是设备画的，这里只是让"这一屏"看起来完整 */
  const sb = (dark) =>
    `<div class="v25-sb${dark ? " d" : " w"}"><span>9:41</span>
      <span class="r"><i>▮▮▮</i>5G<b>90</b></span></div>`;

  /* 平台顶部返回条（抖音/视频号都有，小红书也有但样式不同） */
  const backRow = (right, cls) =>
    `<div class="v25-nav ${cls || ""}"><span class="bk">${I.chev}</span><span class="rt">${right || ""}</span></div>`;

  /* 四个数：类名固定，data-out 靠它就地改字 */
  const num = (k, v) => `<b class="v25-n-${k}">${nf(v)}</b>`;

  /* ============================ 抖音 ============================ */
  function dy(w, v, o) {
    return `<div class="v25-pf v25-dy${o.noSb ? " nosb" : ""}">
      <img class="v25-bg" src="${w.img}" alt="">
      <div class="v25-scrim"></div>
      ${sb(0)}
      <div class="v25-dy-nav">
        <span class="bk">${I.chev}</span>
        <span class="bk2">${I.frames}</span>
        <div class="tabs">
          <span>关注</span>
          <span class="fr">朋友<i class="rd"></i></span>
          <span class="on">推荐</span>
        </div>
        <span class="bk2">${I.search}</span>
        <span class="me">${I.person}<i>159</i></span>
      </div>

      <div class="v25-dy-bot">
        <div class="r1">
          <span class="later">${I.clock}稍后看</span>
          <span class="tm"><em>${w.dur}</em><em class="dm">${I.danmu}弹</em></span>
        </div>
        <div class="r2">
          <b class="av">P</b>
          <span class="nm">${w.who || "大 P"}</span>
          <span class="hb">${I.heart}</span>
        </div>
        <div class="r3">${w.title} ${w.tags || "#心脑血管科普 #磷虾油"}</div>
        <div class="r4">
          <b class="av2">陈</b>
          <div class="tt"><b>${w.card || "远方好物 · 全国招商总监"}</b><span>19 个朋友关注</span></div>
          <div class="ops">
            <span>${I.thumb}${num("like", v.like)}</span>
            <span>${I.share}${num("share", v.share)}</span>
            <span>${I.heart}${num("star", v.star)}</span>
            <span>${I.bubble}${num("cmt", v.cmt)}</span>
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ============================ 视频号 ============================ */
  function wx(w, v, o) {
    return `<div class="v25-pf v25-wx${o.noSb ? " nosb" : ""}">
      <img class="v25-bg" src="${w.img}" alt="">
      <div class="v25-scrim"></div>
      ${sb(0)}
      ${backRow('<span class="dots">···</span>')}

      <div class="v25-wx-side">
        <div class="av">P<i>+</i></div>
        <div>${I.heart}${num("like", v.like)}</div>
        <div>${I.bubble}${num("cmt", v.cmt)}</div>
        <div>${I.share}${num("share", v.share)}</div>
        <div>${I.star}${num("star", v.star)}</div>
      </div>

      <div class="v25-wx-bot">
        <b class="nm">${w.who || "大 P"}</b>
        <p class="tx">${w.title}</p>
        <span class="tg">${w.tags || "#心脑血管科普 #磷虾油"}</span>
        <span class="tm">昨天 20:14</span>
      </div>

      <div class="v25-wx-in"><span>说点什么…</span><i>${I.bubble}</i></div>
    </div>`;
  }

  /* ============================ 小红书 ============================ */
  function xhs(w, v, o) {
    return `<div class="v25-pf v25-xhs${o.noSb ? " nosb" : ""}">
      ${sb(1)}
      <div class="v25-xhs-top">
        <span class="bk">${I.chev}</span>
        <b class="av">P</b>
        <span class="nm">${w.who || "大 P"}</span>
        <em>关注</em>
      </div>
      <div class="v25-xhs-img">
        <img src="${w.img}" alt="">
        ${I.play}
        <span class="pg">1/1</span>
      </div>
      <div class="v25-xhs-tx">
        <b>${w.title}</b>
        <p>${w.body || "今天把我妈的体检单翻出来了，吃了三个月的变化都在这张纸上。不说效果，你们自己看。"}</p>
        <span class="tg">${w.tags || "#磷虾油 #中老年健康 #心血管"}</span>

        <div class="v25-xhs-cm">
          <div class="ch"><span>共 ${nf(v.cmt)} 条评论</span><em>昨天 20:14 · 广东</em></div>
          <div class="cr"><i>梅</i><div><b>阿梅</b><em>多少钱一盒？能寄梅州吗</em></div></div>
        </div>
      </div>
      <div class="v25-xhs-bar">
        <span class="inp">说点什么…</span>
        <span class="xo">${I.heart}${num("like", v.like)}</span>
        <span class="xo">${I.star}${num("star", v.star)}</span>
        <span class="xo">${I.bubble}${num("cmt", v.cmt)}</span>
      </div>
    </div>`;
  }

  const MAP = { dy, wx, xhs };

  window.SKIN = {
    /* pf: wx|dy|xhs  work: LIB.works 的一条  v: {like,share,star,cmt}
       opts.noSb: 外层已经有状态栏了，皮肤自己那份就不要再画一遍 */
    render(pf, work, v, opts) {
      const f = MAP[pf] || MAP.dy;
      const num = {
        like: v.like != null && v.like !== "" ? v.like : 0,
        share: v.share != null && v.share !== "" ? v.share : 0,
        star: v.star != null && v.star !== "" ? v.star : 0,
        cmt: v.cmt != null && v.cmt !== "" ? v.cmt : 0
      };
      return f(work, num, opts || {});
    },
    icon: I,
    nf
  };
})();
