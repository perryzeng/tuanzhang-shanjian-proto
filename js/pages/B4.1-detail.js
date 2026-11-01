window.PAGES["B4.1"].prd = "PRD §6.20 · 成品详情（导出 / 三平台入口 / 分享回传 / 谁动了）";
window.PAGES["B4.1"].states = [
  { k: "", n: "默认：动态 Tab 流水、平台按钮直进对应样式的播放页" }
];

/* 成品详情。这一页只回答一个问题：**这条发出去之后，谁动了。**

   版面按团长的真实动作从上往下排：
   ① **导出下载视频**放在最上面——他要做的第一件事常常不是看数据，是把片子存下来发群、发别的平台；
   ② **这条长什么样**：成品卡 + 三个平台按钮，点哪个进哪个样式的播放页（B4.1.1）；
   ③ **分享带来的**：播放 / 访客 / 停留 / 潜客；
   ④ **人**：动态 / 看过的人 / 潜客，默认给动态——"刚刚发生了什么"比"总共有谁"更急。

   **互动量从这里挪走了**（V5.0）：它不再是页面上的一排档位按钮，而是进播放页之后
   才出现的"这条现在多少人理"——因为互动量是**那条视频在平台里的样子**的一部分，
   跟视频画面、评论区是一件事，不该脱离视频单独摆在成品页上。

   动态流水不做二次加工：谁几点看了、谁几点点了赞、谁几点评论了什么，一条一条按时间排。
   汇总数字上面已经有了（分享带来的那四个），流水再汇总一遍就没人看了。 */
window.PAGES["B4.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const tab = ctx.tab === "all" ? "all" : ctx.tab === "lead" ? "lead" : "log";
  const saved = ctx.saved === "1";

  const all = D.viewers(), leads = D.leads();
  const st = D.shareStat();
  /* 回传数字固定用"中"档：这是这条视频真实跑出来的量，
     不是让用户在成品页上拨的那根档位杆。 */
  const heat = D.heat("warming");

  const PLAT = {
    wx: { name: "视频号", dot: "#FA9D3B", tip: "主阵地，默认按这个样式" },
    dy: { name: "抖音", dot: "#FE2C5B", tip: "图标更大、贴边" },
    xhs: { name: "小红书", dot: "#FF2442", tip: "白底正文 + 话题标签" }
  };

  const vrow = (u) => `<div class="vrow2" data-go="G3.1" data-label="跟进 ${u.name}">
      <div class="av" style="background:${u.bg}">${u.av}</div>
      <div class="tx">
        <div class="n">${u.name}${u.lead ? `<i class="lead">潜客 ${u.score}</i>` : ""}</div>
        <div class="s">${u.rel} · ${u.at} 看的</div>
        <div class="a">${u.act} · 停留 ${u.stay}${u.times > 1 ? " · 看了 " + u.times + " 次" : ""}</div>
      </div>
      <span class="go">跟进 ›</span>
    </div>`;

  /* 动态流水：看了 / 点了赞 / 评论了 / 分享了，四种各一个记号，按时间倒序。
     不合并同类项——"阿梅看了三遍"和"阿梅点了赞"是两条，因为它们指向两件不同的事。 */
  const ICON = { view: "◉", like: "♥", comment: "✎", share: "↗" };
  const logrow = (l) => `<div class="lg ${l.type}">
      <span class="tm">${l.t}</span>
      <span class="ic">${ICON[l.type] || "·"}</span>
      <span class="tx"><b>${l.who}</b> ${l.act}<i>${l.extra}</i></span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B4" data-label="返回封面">‹</span>
      <div class="ttl">这条成品<small>今天 20:14 发布 · 视频号 / 抖音</small></div>
    </div>

    <div class="body">
      <!-- 导出是这一页的第一个动作，不是最后一个：发群、发别的平台都从这里走 -->
      <div class="btn ${saved ? "gray" : "ai"}" ${saved ? "" : `data-set="B4.1.saved=1"`}>
        ${saved ? "✓ 已导出到相册 · 1080×1920" : "⬇ 导出下载视频"}
      </div>

      <div class="donecard" style="margin-top:12px" data-go="B4.1.1?pf=wx" data-label="看视频号样式">
        <div class="th">
          <div class="src" style="background:linear-gradient(160deg,#2C5BFF 0%,#0E2A6B 55%,#08142F 100%)"></div>
          <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b></div>
          <span class="play">▶</span>
          <span class="dur">46s</span>
        </div>
        <div class="tx">
          <b>磷虾油今晚开团，3 步选对不踩坑</b>
          <span>点一下进播放页 · 看互动和评论</span>
          <div class="plats">${Object.keys(PLAT).map((k) =>
            `<i style="background:${PLAT[k].dot}"></i>${PLAT[k].name}`).join("")}</div>
        </div>
        <span class="go">›</span>
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">按平台样式看</span>
        <span class="more">同一条，三种长相</span></div>
      <div class="platbtns">${Object.keys(PLAT).map((k) =>
        `<div class="pb" data-go="B4.1.1?pf=${k}" data-label="看${PLAT[k].name}样式">
          <span class="dot" style="background:${PLAT[k].dot}"></span>
          <b>${PLAT[k].name}</b>
          <i>${PLAT[k].tip}</i>
        </div>`).join("")}</div>

      <div class="sharedata" style="margin-top:16px">
        <div class="hd"><b>分享带来的</b><span>已分享 ${st.times} 次</span></div>
        <div class="grid4">
          <div><b>${heat.plays.toLocaleString()}</b><span>播放</span></div>
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
  </div>`;
};
