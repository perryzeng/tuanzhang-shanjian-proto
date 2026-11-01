window.PAGES["B4.1"].prd = "PRD §6.20 · 成品详情（导出 / 三平台样式预览 / 互动量 / 谁看了）";
window.PAGES["B4.1"].states = [
  { k: "", n: "默认：动态 Tab、启动中热度；页面上三个平台按钮，点了直接进对应样式的全屏预览" }
];

/* 成品详情。这一页要回答一个问题：**这条发出去之后，谁动了。**

   版面按团长的真实动作排：
   ① 第一件事是**导出视频**——发给团队群、发到别的平台，导出是唯一出口，不给选项，点了就导；
   ② 然后是**看长什么样**：三个平台按钮直接摆在页面上（视频号 / 抖音 / 小红书），
      点哪个进哪个样式的全屏。不藏在预览里再切一次 tab——他想看抖音，就该一下点到抖音；
   ③ **互动量**三档（冷启动 / 启动中 / 热门）：同一条片子在不同阶段的三种样子。
      换一档，赞/评/转和播放/访客/潜客一起变，评论区条数也跟着变；
   ④ 最后是**人**：动态 / 看过的人 / 潜客，默认给动态——"刚刚发生了什么"比"总共有谁"更急。

   分享只有一个入口，在预览里：在哪个样式下点分享，出去的链接就是那个样式，
   别人打开看到的赞/评/转就是这里显示的那些数。 */
window.PAGES["B4.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const tab = ctx.tab === "all" ? "all" : ctx.tab === "lead" ? "lead" : "log";
  const pf = ctx.pf || "wx";                  // wx 视频号 / dy 抖音 / xhs 小红书
  const pv = ctx.pv === "1";                  // 全屏预览
  const cm = ctx.cm === "1";                  // 预览里展开评论
  const heat = D.heat(ctx.heat || "warming");
  const sharedPf = ctx.shared || "";          // 分享时用的样式
  const saved = ctx.saved === "1";

  const all = D.viewers(), leads = D.leads();
  const st = D.shareStat();
  const cms = D.comments().slice(0, Math.min(heat.comment, 8));

  const PLAT = {
    wx: { name: "视频号", dot: "#FA9D3B", tip: "主阵地，默认按这个样式" },
    dy: { name: "抖音", dot: "#FE2C5B", tip: "图标更大、贴边" },
    xhs: { name: "小红书", dot: "#FF2442", tip: "白底正文 + 话题标签" }
  };

  /* 观众行 */
  const vrow = (u) => `<div class="vrow2" data-go="G3.1" data-label="跟进 ${u.name}">
      <div class="av" style="background:${u.bg}">${u.av}</div>
      <div class="tx">
        <div class="n">${u.name}${u.lead ? `<i class="lead">潜客 ${u.score}</i>` : ""}</div>
        <div class="s">${u.rel} · ${u.at} 看的</div>
        <div class="a">${u.act} · 停留 ${u.stay}${u.times > 1 ? " · 看了 " + u.times + " 次" : ""}</div>
      </div>
      <span class="go">跟进 ›</span>
    </div>`;

  /* 动态流水 */
  const ICON = { view: "◉", share: "↗", comment: "✎" };
  const logrow = (l) => `<div class="lg ${l.type}">
      <span class="tm">${l.t}</span>
      <span class="ic">${ICON[l.type]}</span>
      <span class="tx"><b>${l.who}</b> ${l.act}<i>${l.extra}</i></span>
    </div>`;

  /* 全屏预览：三套平台样式 + 可展开的评论区 + 分享 */
  const preview = pv ? `<div class="pvf">
      <div class="pvf-hd">
        <span class="pfname">${PLAT[pf].name}里的样子</span>
        <span class="x" data-set="B4.1.pv=&B4.1.cm=">✕</span>
      </div>
      <div class="pvf-mid">
        <div class="pvf-screen ${pf}">
          <div class="src" style="background:linear-gradient(160deg,#2C5BFF 0%,#0E2A6B 55%,#08142F 100%)"></div>
          <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b><i>讲清成分和怎么买</i></div>
          <div class="pfui ${pf}">
            <div class="side">
              <span class="ava">珍</span>
              <span class="ic2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8C20.5 15 12 20.5 12 20.5Z"/></svg><i>${heat.like}</i></span>
              <span class="ic2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.6-.7L4 20.5l1.4-4.3A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"/></svg><i>${heat.comment}</i></span>
              <span class="ic2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 15.5V4"/><path d="m8 8 4-4 4 4"/></svg><i>${heat.share}</i></span>
            </div>
            <div class="foot">
              <b>阿珍 · 大健康选品</b>
              <p>磷虾油今晚 8 点开团，3 步选对不踩坑 <em class="tg">#磷虾油 #开团</em></p>
              <span class="tags">#磷虾油 #开团</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pvf-cm${cm ? " open" : ""}">
        <div class="cmbar" data-set="B4.1.cm=${cm ? "" : "1"}">
          <b>${heat.comment} 条评论</b>
          <span>${cm ? "收起" : "看看大家在说什么 ›"}</span>
        </div>
        ${cm ? `<div class="cmlist">${cms.map((c) => `<div class="cmrow">
            <span class="av" style="background:${c.bg}">${c.av}</span>
            <div class="tx"><div class="n">${c.who}${c.tag ? `<i>${c.tag}</i>` : ""}</div>
              <p>${c.tx}</p><div class="m">${c.at} · ${c.like} 赞</div></div>
          </div>`).join("")}
          ${heat.comment > cms.length ? `<div class="cmmore">还有 ${heat.comment - cms.length} 条 · 按台词自动生成</div>` : ""}
        </div>` : ""}
      </div>

      <div class="pvf-ft2">
        <span class="shb" data-set="B4.1.shared=${pf}" data-label="分享这个样式">分享这个样式</span>
      </div>
    </div>` : "";

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B4" data-label="返回封面">‹</span>
      <div class="ttl">这条成品<small>今天 20:14 发布 · 视频号 / 抖音</small></div>
    </div>

    <div class="body">
      ${saved ? `<div class="savedtip"><span class="ck">✓</span>视频已导出到相册 · 1080×1920</div>` : ""}

      <div class="donecard" data-set="B4.1.pv=1&B4.1.pf=wx&B4.1.cm=">
        <div class="th">
          <div class="src" style="background:linear-gradient(160deg,#2C5BFF 0%,#0E2A6B 55%,#08142F 100%)"></div>
          <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b></div>
          <span class="play">▶</span>
          <span class="dur">46s</span>
        </div>
        <div class="tx">
          <b>磷虾油今晚开团，3 步选对不踩坑</b>
          <span>点一下全屏看 · 默认视频号样式</span>
          <div class="plats">${Object.keys(PLAT).map((k) =>
            `<i style="background:${PLAT[k].dot}"></i>${PLAT[k].name}`).join("")}</div>
        </div>
        <span class="go">›</span>
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">按平台样式看</span>
        <span class="more">同一条，三种长相</span></div>
      <div class="platbtns">${Object.keys(PLAT).map((k) =>
        `<div class="pb" data-set="B4.1.pf=${k}&B4.1.pv=1&B4.1.cm=" data-label="看${PLAT[k].name}样式">
          <span class="dot" style="background:${PLAT[k].dot}"></span>
          <b>${PLAT[k].name}</b>
          <i>${PLAT[k].tip}</i>
        </div>`).join("")}</div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">互动量</span>
        <span class="more">这条现在处在哪一档</span></div>
      <div class="heats">${D.heatLevels().map((h) =>
        `<div class="ht${heat.id === h.id ? " on" : ""}" data-set="B4.1.heat=${h.id}">
          <b>${h.name}</b><i>${h.note}</i>
        </div>`).join("")}</div>
      <div class="heatnums">
        <span><b>${heat.like}</b>赞</span>
        <span><b>${heat.comment}</b>评论</span>
        <span><b>${heat.share}</b>转发</span>
        <span><b>${heat.plays}</b>播放</span>
      </div>

      ${sharedPf ? `<div class="sharedtip">已按「${PLAT[sharedPf].name}」样式分享 · 别人打开看到的就是这个样子</div>` : ""}

      <div class="sharedata">
        <div class="hd"><b>分享带来的</b><span>已分享 ${st.times} 次</span></div>
        <div class="grid4">
          <div><b>${heat.plays}</b><span>播放</span></div>
          <div><b>${heat.visitors}</b><span>访客</span></div>
          <div><b>${st.stay}</b><span>平均停留</span></div>
          <div><b>${heat.leads}</b><span>潜客</span></div>
        </div>
      </div>

      <div class="tabs3" style="margin:16px 0 2px">
        <b class="${tab === "log" ? "on" : ""}" data-set="B4.1.tab=log">动态</b>
        <b class="${tab === "all" ? "on" : ""}" data-set="B4.1.tab=all">看过的人 ${heat.visitors}</b>
        <b class="${tab === "lead" ? "on" : ""}" data-set="B4.1.tab=lead">潜客 ${heat.leads}</b>
      </div>
      ${tab === "log" ? "" : `<div class="xs" style="margin:8px 2px 0">
        下面只列最近跟进的 ${tab === "lead" ? leads.length : all.length} 个，全量在「我的客户」里</div>`}
      <div class="card" style="padding:2px 13px;margin-top:9px;border-radius:16px">
        ${tab === "log" ? D.logs().map(logrow).join("")
          : (tab === "lead" ? leads : all).map(vrow).join("")}
      </div>
    </div>

    <div class="actionbar">
      <div class="btn" data-set="B4.1.saved=1" data-label="导出视频">导出视频</div>
    </div>

    ${preview}
  </div>`;
};
