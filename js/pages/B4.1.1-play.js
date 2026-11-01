window.PAGES["B4.1.1"].prd = "PRD §6.20.1 · 播放页（平台复刻 + 互动数 + 分享链接）";
window.PAGES["B4.1.1"].states = [
  { k: "pf=wx", n: "视频号样式：互动数是中档，还没生成分享链接" },
  { k: "pf=xhs&cm=1", n: "小红书样式：评论展开" },
  { k: "pf=dy&linked=1&gsig=186-23-17", n: "抖音样式：已生成分享链接并存入我的作品" }
];

/* 播放页。平台由成品卡上的三个 icon 决定，所以页内不再切换。

   这一页只干一件事：**把这条视频配上一组互动数，生成一条带数据的分享链接。**
   顺序是：
   ① 先看到它在平台里长什么样（三种样式尽量复刻，所见即所得）；
   ② 「少 / 中 / 多」快速填三个数——省得一个个敲；
   ③ 三个数也可以直接改（就在画面下面那条操作区里），改完链接自动作废；
   ④ 点底部按钮生成分享链接，并存进「我的作品」——以后从作品里再分享，带的就是这组数；
   ⑤ 点右侧评论图标，看 AI 按台词写的那 N 条评论。

   为什么"少中多"要留、而"自定义"不要：三个数本身就能改，自定义那一档是多余的；
   但"少中多"不是多余——它是**一步填满三个数**的快捷方式，改一个数要敲三次键盘。 */
window.PAGES["B4.1.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const pf = ctx.pf === "dy" ? "dy" : ctx.pf === "xhs" ? "xhs" : "wx";

  const base = D.heat("warming");
  const num = (k, def) => {
    const n = parseInt(ctx[k], 10);
    return Number.isFinite(n) && n >= 0 ? Math.min(n, 99999) : def;
  };
  const lk = num("lk", base.like);
  const cn = num("cn", base.comment);
  const sh = num("sh", base.share);

  /* 分享链接带的是"生成那一刻"这组数。所以记一个签名而不是一个开关：
     只要三个数里有任何一个变了，链接就算过期，底部按钮自动变回"生成"。 */
  const sig = lk + "-" + cn + "-" + sh;
  const linked = ctx.linked === "1" && ctx.gsig === sig;
  const copied = ctx.copied === "1";
  const cm = ctx.cm === "1";
  const shared = ctx.shared === "1";

  const PLAT = {
    wx: { name: "视频号", dot: "#FA9D3B" },
    dy: { name: "抖音", dot: "#FE2C5B" },
    xhs: { name: "小红书", dot: "#FF2442" }
  };
  const fmt = (n) => (n > 9999 ? (n / 10000).toFixed(1) + "w" : String(n));

  /* 少 / 中 / 多：一步填满三个数。当前数正好等于某一档时，那一档亮起来。 */
  const hpick = [["cold", "少"], ["warming", "中"], ["hot", "多"]].map(([id, tx]) => {
    const h = D.heat(id);
    const on = h.like === lk && h.comment === cn && h.share === sh;
    return `<b class="${on ? "on" : ""}"
      data-set="B4.1.1.lk=${h.like}&B4.1.1.cn=${h.comment}&B4.1.1.sh=${h.share}&B4.1.1.linked=">${tx}</b>`;
  }).join("");

  /* 三套样式尽量按各家真实的样子排：
     视频号＝深色压底；抖音＝大图标贴边 + 右下转盘；小红书＝顶部作者 + 白卡正文 + 收藏。 */
  const sideIcon = (k) =>
    k === "like" ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.7S3.2 15 3.2 9.1A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.9c0 5.9-8.8 11.6-8.8 11.6Z"/></svg>`
      : k === "star" ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3.6 2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.6 6.8 19.5 8 13.7 3.6 9.7l5.9-.7z"/></svg>`
        : k === "comment" ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.6-.7L4 20.5l1.4-4.3A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"/></svg>`
          : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 15.5V4"/><path d="m8 8 4-4 4 4"/></svg>`;

  const box = `<div class="plwrap">
    <div class="plbox ${pf}">
      <div class="src"></div>
      ${pf === "xhs" ? `<div class="plhead">
        <span class="ava">暴</span><b>暴富者 · 大健康选品</b><em>关注</em></div>` : ""}
      <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b><i>讲清成分和怎么买</i></div>
      <div class="plside">
        ${pf === "dy" ? `<span class="it"><span class="ava2">暴</span></span>` : ""}
        <span class="it on">${sideIcon("like")}<i>${fmt(lk)}</i></span>
        ${pf === "xhs" ? `<span class="it">${sideIcon("star")}<i>${fmt(Math.round(lk / 3))}</i></span>` : ""}
        <span class="it" data-set="B4.1.1.cm=${cm ? "" : "1"}" data-label="看评论">${sideIcon("comment")}<i>${fmt(cn)}</i></span>
        <span class="it">${sideIcon("share")}<i>${fmt(sh)}</i></span>
      </div>
      ${pf === "dy" ? `<div class="pldisc"><i></i></div>` : ""}
      <div class="plfoot">
        <b>暴富者 · 大健康选品</b>
        <p>磷虾油今晚 8 点开团，3 步选对不踩坑 <em class="tg">#磷虾油 #开团</em></p>
        ${pf === "xhs" ? `<span class="morelink">展开</span>` : ""}
      </div>
    </div>

    <!-- 画面下方紧贴的一条操作区：跟画面共用一块深色和同一个圆角，
         看起来是"画面压出来的一条"，不是又一张卡。三个数直接改。 -->
    <div class="pkops">
      ${[["lk", "赞", lk], ["cn", "评论", cn], ["sh", "转发", sh]].map(([k, label, v]) =>
        `<label><input type="number" data-bind="B4.1.1.${k}" data-live min="0" max="99999"
           value="${v}" /><span>${label}</span></label>`).join("")}
    </div>
  </div>`;

  const cms = D.makeComments(cn);
  const link = "https://tz.cn/s/" + (1000 + lk + cn * 7 + sh * 13).toString(36).toUpperCase();

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B4.1" data-label="返回成品">‹</span>
      <div class="ttl">${PLAT[pf].name}里长什么样<small>配一组互动数，生成可分享的链接</small></div>
      <span class="act" ${shared ? "" : `data-set="B4.1.1.shared=1"`}
        data-label="分享">${shared ? "已分享 ✓" : "分享"}</span>
    </div>

    <div class="body">
      ${box}

      <!-- 一步填满三个数：改一个数要敲三次键盘，三个数一起改才是常事 -->
      <div class="heat3" style="margin-top:12px">${hpick}</div>

      ${linked ? `
        <div class="linkbox">
          <div class="hd"><b>✓ 分享链接已生成</b><span>已存入「我的作品」</span></div>
          <div class="url">
            <span>${link}</span>
            <b data-set="B4.1.1.copied=1">${copied ? "已复制" : "复制"}</b>
          </div>
          <div class="xs">以后从作品里再分享，别人打开看到的赞 / 评 / 转就是这组数。</div>
        </div>` : ""}

      ${cm ? `
        <div class="cmbar light" data-set="B4.1.1.cm=">
          <b>${cn} 条评论</b><span>收起</span>
        </div>
        <div class="card" style="padding:2px 13px 6px;border-radius:14px">
          ${cms.list.map((c) => `<div class="cmrow light">
            <span class="av" style="background:${c.bg}">${c.av}</span>
            <div class="tx">
              <div class="n">${c.who}${c.tag ? `<i>${c.tag}</i>` : ""}</div>
              <p>${c.tx}</p>
              <div class="m">${c.at} · ${c.like} 赞</div>
            </div>
          </div>`).join("")}
          ${cms.more ? `<div class="cmmore light">还有 ${cms.more} 条 · 都是 AI 按台词写的</div>` : ""}
        </div>` : `<div class="note" style="margin:12px 2px 0;line-height:1.65">
          点画面右侧的评论图标，能看到 AI 按这条台词写的 ${cn} 条评论。</div>`}
    </div>

    <div class="actionbar">
      ${linked
        ? `<div class="btn gray">✓ 已生成 · 点上面的链接复制</div>`
        : `<div class="btn ai" data-set="B4.1.1.linked=1&B4.1.1.gsig=${sig}&B4.1.1.copied=" data-label="生成分享链接">✓ 按这些互动数生成分享链接</div>`}
    </div>
  </div>`;
};
