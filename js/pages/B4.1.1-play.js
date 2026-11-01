window.PAGES["B4.1.1"].prd = "PRD §6.20.1 · 播放页（单平台样式 + 遮罩上的互动数据 + 评论）";
window.PAGES["B4.1.1"].states = [
  { k: "pf=wx", n: "视频号样式：还没有互动数据" },
  { k: "pf=dy&done=1&gencn=23&cm=1", n: "抖音样式：已按 23 条评论生成，评论展开" }
];

/* 播放页。进来之前，平台样式已经在成品卡的三个小图标上选好了——
   所以这一页**不再有平台切换**，它就是"这条在抖音里/在视频号里长什么样"，
   多一个切换等于让用户再选一次他已经选过的东西。

   互动量也不再有"少 / 中 / 多 / 自定义"四档：那是我上一版绕着弯做的，
   本质是"这条有多少赞、多少评、多少转发"。既然数字本身就可以改，
   直接把三个数放到视频遮罩上编辑，档位就是多余的中间层。

   版面从上到下只有一个动作链：看画面 → 改三个数 → 生成 → 点评论看。 */
window.PAGES["B4.1.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const pf = ctx.pf === "dy" ? "dy" : ctx.pf === "xhs" ? "xhs" : "wx";

  /* 起点是"中"档那组数——它代表这条片子正常跑起来的样子。
     之后用户改成多少就是多少，不再回头看档位。 */
  const base = D.heat("warming");
  const num = (k, def) => {
    const n = parseInt(ctx[k], 10);
    return Number.isFinite(n) && n >= 0 ? Math.min(n, 99999) : def;
  };
  const lk = num("lk", base.like);
  const cn = num("cn", base.comment);
  const sh = num("sh", base.share);

  /* 「已生成」记的是**生成时用的那个评论数**，不是一个开关：
     数字一改，gencn 对不上，页面自动回到"还没生成"，评论列表跟着收起。
     否则把 23 改成 200，上面仍写着"已生成 23 条"，数字和结果对不上。 */
  const done = ctx.done === "1" && +ctx.gencn === cn;
  const cm = ctx.cm === "1";
  const shared = ctx.shared === "1";

  const PLAT = {
    wx: { name: "视频号", dot: "#FA9D3B" },
    dy: { name: "抖音", dot: "#FE2C5B" },
    xhs: { name: "小红书", dot: "#FF2442" }
  };

  const fmt = (n) => (n > 9999 ? (n / 10000).toFixed(1) + "w" : String(n));

  /* 视频 + 紧贴下面的深色操作条：两块共用同一个深色底和圆角，
     看起来是"画面下方压出来的一条操作区"，而不是又一张卡片。 */
  const box = `<div class="plwrap ${pf}">
    <div class="plbox">
      <div class="src"></div>
      <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b><i>讲清成分和怎么买</i></div>
      <div class="plside">
        <span class="it on"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.7S3.2 15 3.2 9.1A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.9c0 5.9-8.8 11.6-8.8 11.6Z"/></svg><i>${fmt(lk)}</i></span>
        <span class="it"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.6-.7L4 20.5l1.4-4.3A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"/></svg><i>${fmt(cn)}</i></span>
        <span class="it"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 15.5V4"/><path d="m8 8 4-4 4 4"/></svg><i>${fmt(sh)}</i></span>
      </div>
      <div class="plfoot">
        <b>阿珍 · 大健康选品</b>
        <p>磷虾油今晚 8 点开团，3 步选对不踩坑 <em class="tg">#磷虾油 #开团</em></p>
      </div>
    </div>

    <!-- 遮罩上的三个数：点一下就能改，改完点和画面右侧同步变。
         去掉档位之后，这一条就是"互动量"本身，不需要再解释。 -->
    <div class="pkops">
      ${[["lk", "赞", lk], ["cn", "评论", cn], ["sh", "转发", sh]].map(([k, label, v]) =>
        `<label><input type="number" data-bind="B4.1.1.${k}" data-live min="0" max="99999"
           value="${v}" /><span>${label}</span></label>`).join("")}
    </div>
  </div>`;

  const cms = D.makeComments(cn);

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B4.1" data-label="返回成品">‹</span>
      <div class="ttl">${PLAT[pf].name}里长什么样<small>互动数据可以直接改</small></div>
      <span class="act" ${shared ? "" : `data-set="B4.1.1.shared=1"`}
        data-label="分享">${shared ? "已分享 ✓" : "分享"}</span>
    </div>

    <div class="body">
      ${box}

      ${!done ? `<div class="note" style="margin:12px 2px 0;line-height:1.65">
        改上面三个数，点底部按钮生成对应的互动数据——评论是 AI 按这条的台词写的，
        数字只决定有多少条。</div>` : ""}

      ${done ? `
        <div class="cmbar light" data-set="B4.1.1.cm=${cm ? "" : "1"}">
          <b>${cn} 条评论</b>
          <span>${cm ? "收起" : "看看大家在说什么 ›"}</span>
        </div>
        ${cm ? `<div class="card" style="padding:2px 13px 6px;border-radius:14px">
          ${cms.list.map((c) => `<div class="cmrow light">
            <span class="av" style="background:${c.bg}">${c.av}</span>
            <div class="tx">
              <div class="n">${c.who}${c.tag ? `<i>${c.tag}</i>` : ""}</div>
              <p>${c.tx}</p>
              <div class="m">${c.at} · ${c.like} 赞</div>
            </div>
          </div>`).join("")}
          ${cms.more ? `<div class="cmmore light">还有 ${cms.more} 条 · 都是 AI 按台词写的</div>` : ""}
        </div>` : ""}` : ""}
    </div>

    <div class="actionbar">
      ${done
        ? `<div class="btn gray">✓ 已生成 ${cn} 条评论</div>`
        : `<div class="btn ai" data-set="B4.1.1.done=1&B4.1.1.gencn=${cn}&B4.1.1.cm=" data-label="生成互动数据">✓ 按这些数生成互动数据</div>`}
    </div>
  </div>`;
};
