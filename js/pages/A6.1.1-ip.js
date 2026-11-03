/* A6.1.1 我的 IP 主页（V23）
   从「我是谁」里的三个 IP 卡进来，也可以从任意播放页点我自己的头像进来。

   一个团长在三个平台上就是三个号：昵称、简介、粉丝数都不一样，
   因为三个平台的受众和说话方式本来就不一样。所以这一页不是"一个主页换配色"，
   是**三套真布局**：
     抖音   —— 封面图 + 头像压在上面，三列 3:4，右下角播放数
     视频号 —— 两列，每条下面带标题和互动数（视频号的作品是有名字的）
     小红书 —— 三列 3:4，右下角点赞数，号在简介下面

   作品集不手填：只看 works.pfs 里有没有这个平台。
   也就是说，团长在 A8.4.2 里"以抖音方式分享"出去的那条，会自动出现在抖音 IP 里。
   这条链必须自动，不然三个号会越用越乱。 */

window.PAGES["A6.1.1"].prd = "PRD V23 §3.1 · 我的 IP 主页（三平台 1:1）";
window.PAGES["A6.1.1"].sysEntry = "我是谁 → 我的 IP 卡；播放页点自己头像";

window.PAGES["A6.1.1"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const pf = ["wx", "dy", "xhs"].indexOf(ctx.pf) >= 0 ? ctx.pf : "dy";
  const ip = L.ips[pf];
  const mine = L.works.filter((w) => w.status === "sent" && (w.pfs || []).indexOf(pf) >= 0);
  const n = mine.length;

  const cover = (w, i, kind) => {
    const badge = kind === "dy"
      ? `▶ ${w.opens}`
      : kind === "xhs" ? `♥ ${w.likes}` : "";
    if (kind === "wx") {
      return `<div class="v33-wxcell" data-go="A8.4.2?pf=wx&c=${w.id}" data-label="${w.title}">
        <div class="th"><img src="${w.img}" alt=""></div>
        <b>${w.title}</b>
        <span>♥ ${w.likes} · 评 ${w.cmt} · 转 ${w.shares}</span>
      </div>`;
    }
    return `<div class="v33-cell" data-go="A8.4.2?pf=${pf}&c=${w.id}" data-label="${w.title}">
      <img src="${w.img}" alt="">
      <span class="badge">${badge}</span>
    </div>`;
  };

  /* ---------------- 抖音 ---------------- */
  if (pf === "dy") {
    return `<div class="app v33 v33-dy">
      <div class="v33-dy-cover">
        <img src="${L.works[0].img}" alt="">
        <div class="v33-dy-scrim"></div>
        <div class="v33-dy-nav">
          <span data-go="A6.1" data-label="返回">‹</span>
          <span class="r">⌕ ¤</span>
        </div>
      </div>
      <div class="v33-sb">${C.sb(true)}</div>

      <div class="v33-dy-body">
        <div class="v33-dy-id">
          <i class="av">P</i>
          <b>${ip.name}</b>
          <span>${ip.handle}</span>
        </div>
        <div class="v33-dy-nums">
          <div><b>${ip.follows}</b><span>关注</span></div>
          <div><b>${ip.fans}</b><span>粉丝</span></div>
          <div><b>${ip.likes}</b><span>获赞</span></div>
          <em>编辑资料</em>
        </div>
        <p class="v33-bio">${ip.bio}</p>
        <div class="v33-tags">${ip.tags.map((t) => `<span>#${t}</span>`).join("")}</div>

        <div class="v33-tabs">
          <b class="on">作品 ${n}</b><b>私密 0</b><b>喜欢 12</b>
        </div>
        <div class="v33-grid g3">${mine.map((w, i) => cover(w, i, "dy")).join("")}</div>
        <div class="v33-empty-note">只显示发到抖音的 ${n} 条。别的平台发的不在这里。</div>
      </div>
    </div>`;
  }

  /* ---------------- 视频号 ---------------- */
  if (pf === "wx") {
    return `<div class="app v33 v33-wx">
      ${C.sb()}
      <div class="v33-wx-nav">
        <span data-go="A6.1" data-label="返回">‹</span>
        <b>${ip.name}</b>
        <span class="r">···</span>
      </div>

      <div class="body nopad">
        <div class="v33-wx-head">
          <i class="av">P</i>
          <div>
            <b>${ip.name}</b>
            <span>${ip.handle}</span>
          </div>
        </div>
        <p class="v33-wx-bio">${ip.bio}</p>
        <div class="v33-wx-nums">
          <div><b>${ip.follows}</b><span>关注</span></div>
          <div><b>${ip.fans}</b><span>朋友</span></div>
          <div><b>${ip.likes}</b><span>点赞</span></div>
        </div>

        <div class="v33-tabs">
          <b class="on">作品 ${n}</b><b>动态</b>
        </div>
        <div class="v33-grid g2">${mine.map((w, i) => cover(w, i, "wx")).join("")}</div>
        <div class="v33-empty-note">只显示发到视频号的 ${n} 条。</div>
      </div>
    </div>`;
  }

  /* ---------------- 小红书 ---------------- */
  return `<div class="app v33 v33-xhs">
    ${C.sb()}
    <div class="v33-xhs-nav">
      <span data-go="A6.1" data-label="返回">‹</span>
      <b>${ip.name}</b>
      <span class="r">↗</span>
    </div>

    <div class="body nopad">
      <div class="v33-xhs-head">
        <i class="av">P</i>
        <div>
          <b>${ip.name}</b>
          <span>${ip.handle}</span>
        </div>
      </div>
      <div class="v33-xhs-nums">
        <div><b>${ip.follows}</b><span>关注</span></div>
        <div><b>${ip.fans}</b><span>粉丝</span></div>
        <div><b>${ip.likes}</b><span>获赞与收藏</span></div>
      </div>
      <p class="v33-xhs-bio">${ip.bio}</p>
      <div class="v33-tags">${ip.tags.map((t) => `<span>#${t}</span>`).join("")}</div>

      <div class="v33-tabs">
        <b class="on">笔记 ${n}</b><b>收藏</b><b>赞过</b>
      </div>
      <div class="v33-grid g3">${mine.map((w, i) => cover(w, i, "xhs")).join("")}</div>
      <div class="v33-empty-note">只显示发到小红书的 ${n} 条。</div>
    </div>
  </div>`;
};
