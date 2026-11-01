window.PAGES["B4.1"].prd = "PRD §6.20 · 成品详情（导出 / 平台预览 / 分享 / 谁看了谁问了）";
window.PAGES["B4.1"].states = [
  { k: "", n: "默认：主操作是导出；点视频全屏预览，默认视频号样式" }
];

/* 成品详情。这一页要回答一个问题：**这条发出去之后，谁动了**。

   版面顺序按团长真实动作排：
   ① 第一件事是**导出**——他要把这条发给团队群、发到别的平台，导出是唯一出口；
   ② 然后是**看这条长什么样**——点视频进全屏，默认按视频号的样式预览，
      可以切抖音 / 小红书（同一条片子在不同平台上，边框、按钮、文案位置都不一样，
      团长要确认的是"在我要发的地方，它体面吗"）；
   ③ 再是**分享**——分享是这一切数据的前提；
   ④ 最后才是数据：没有分享就没有播放，所以四格数字**挂在分享下面**，不是无条件摆着。

   上一版把"播放 1.2 万 / 访客 386 / 停留 42s / 潜客 27"四格顶在最上面，
   数字很好看，但团长看完不知道下一步做什么。这一版把数字降级成"分享带来的结果"，
   把**人的动作流水**提上来——"谁在三分钟前问了价"才是他要的东西。 */
window.PAGES["B4.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const tab = ctx.tab === "lead" ? "lead" : "all";
  const pf = ctx.pf || "wx";                  // wx 视频号 / dy 抖音 / xhs 小红书
  const pv = ctx.pv === "1";                  // 是否在全屏预览
  const shared = ctx.shared !== "0";          // 分享过才有数据
  const exp = ctx.exp === "1";                // 导出面板
  const hd = ctx.hd === "1";                  // 高清无水印
  const saved = ctx.saved === "1";

  const all = D.viewers(), leads = D.leads(), st = D.shareStat();
  const list = tab === "lead" ? leads : all;

  const PLAT = {
    wx: { name: "视频号", dot: "#FA9D3B" },
    dy: { name: "抖音", dot: "#FE2C5B" },
    xhs: { name: "小红书", dot: "#FF2442" }
  };

  /* 观众行：名字 + 关系 + 什么时候 + 做了什么。潜客多给一个意向分。 */
  const vrow = (u) => `<div class="vrow2" data-go="G3.1" data-label="跟进 ${u.name}">
      <div class="av" style="background:${u.bg}">${u.av}</div>
      <div class="tx">
        <div class="n">${u.name}
          ${u.lead ? `<i class="lead">潜客 ${u.score}</i>` : ""}
        </div>
        <div class="s">${u.rel} · ${u.at} 看的</div>
        <div class="a">${u.act} · 停留 ${u.stay}${u.times > 1 ? " · 看了 " + u.times + " 次" : ""}</div>
      </div>
      <span class="go">跟进 ›</span>
    </div>`;

  /* 日志：三种事件三种颜色。流水按时间倒序，第一条就是"刚刚"。 */
  const ICON = { view: "◉", share: "↗", comment: "✎" };
  const logrow = (l) => `<div class="lg ${l.type}">
      <span class="tm">${l.t}</span>
      <span class="ic">${ICON[l.type]}</span>
      <span class="tx"><b>${l.who}</b> ${l.act}<i>${l.extra}</i></span>
    </div>`;

  /* 全屏预览：三套平台样式。不是纯装饰——同一条片子在视频号是白底卡片，
     在抖音是压边竖排图标，在小红书是标题正文，团长要确认"发到哪儿都得体"。 */
  const preview = pv ? `<div class="pvf">
      <div class="pvf-hd">
        <div class="ptabs">${Object.keys(PLAT).map((k) =>
          `<b class="${pf === k ? "on" : ""}" data-set="B4.1.pf=${k}">${PLAT[k].name}</b>`).join("")}</div>
        <span class="x" data-set="B4.1.pv=">✕</span>
      </div>
      <div class="pvf-mid">
        <div class="pvf-screen ${pf}">
          <div class="src" style="background:linear-gradient(160deg,#2C5BFF 0%,#0E2A6B 55%,#08142F 100%)"></div>
          <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b><i>讲清成分和怎么买</i></div>
          <div class="pfui ${pf}">
            <div class="side">
              <span class="ava">珍</span>
              <span class="ic2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8C20.5 15 12 20.5 12 20.5Z"/></svg><i>128</i></span>
              <span class="ic2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.6-.7L4 20.5l1.4-4.3A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"/></svg><i>23</i></span>
              <span class="ic2"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 15.5V4"/><path d="m8 8 4-4 4 4"/></svg><i>${st.times}</i></span>
            </div>
            <div class="foot">
              <b>阿珍 · 大健康选品</b>
              <p>磷虾油今晚 8 点开团，3 步选对不踩坑 <em class="tg">#磷虾油 #开团</em></p>
              <span class="tags">#磷虾油 #开团</span>
            </div>
          </div>
        </div>
      </div>
      <div class="pvf-ft">这是「${PLAT[pf].name}」里的样子 · 换平台看排版</div>
    </div>` : "";

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B4" data-label="返回封面">‹</span>
      <div class="ttl">这条成品<small>今天 20:14 发布 · 视频号 / 抖音</small></div>
    </div>

    <div class="body">
      ${saved ? `<div class="savedtip"><span class="ck">✓</span>已保存到相册${hd ? " · 1080×1920 无水印" : " · 960×544 带水印"}</div>` : ""}

      <div class="donecard" data-set="B4.1.pv=1">
        <div class="th">
          <div class="src" style="background:linear-gradient(160deg,#2C5BFF 0%,#0E2A6B 55%,#08142F 100%)"></div>
          <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b></div>
          <span class="play">▶</span>
          <span class="dur">46s</span>
        </div>
        <div class="tx">
          <b>磷虾油今晚开团，3 步选对不踩坑</b>
          <span>点一下，全屏看看在视频号里长什么样</span>
          <div class="plats">${Object.keys(PLAT).map((k) =>
            `<i style="background:${PLAT[k].dot}"></i>${PLAT[k].name}`).join("")}</div>
        </div>
        <span class="go">›</span>
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">分享</span>
        <span class="more">${shared ? "已分享 " + st.times + " 次" : "还没分享出去"}</span></div>
      <div class="shrow">
        <div class="sh" data-set="B4.1.shared=1"><span class="i">群</span><b>给团队</b></div>
        <div class="sh" data-set="B4.1.shared=1"><span class="i">圈</span><b>朋友圈</b></div>
        <div class="sh" data-set="B4.1.shared=1"><span class="i">链</span><b>复制链接</b></div>
      </div>

      ${shared ? `
      <div class="sharedata">
        <div class="hd"><b>分享带来的</b><span>已分享 ${st.times} 次</span></div>
        <div class="grid4">
          <div><b>${st.plays}</b><span>播放</span></div>
          <div><b>${st.visitors}</b><span>访客</span></div>
          <div><b>${st.stay}</b><span>平均停留</span></div>
          <div><b>${st.leads}</b><span>潜客</span></div>
        </div>
      </div>` : `
      <div class="note" style="margin:12px 2px 0;line-height:1.65">
        分享出去之后，这里会出现播放、访客、停留时长和潜客——没有人转，就只有你自己那一次播放。
      </div>`}

      <div class="tabs3" style="margin:16px 0 2px">
        <b class="${tab === "all" ? "on" : ""}" data-set="B4.1.tab=all">看过的人 ${all.length}</b>
        <b class="${tab === "lead" ? "on" : ""}" data-set="B4.1.tab=lead">潜客 ${leads.length}</b>
      </div>
      <div class="card" style="padding:2px 13px;margin-top:9px;border-radius:16px">
        ${list.map(vrow).join("")}
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">动态</span>
        <span class="more">谁看了 · 谁分享 · 谁评论</span></div>
      <div class="card" style="padding:12px 13px;border-radius:16px">
        ${D.logs().map(logrow).join("")}
      </div>
    </div>

    <div class="actionbar">
      <div class="btn" data-set="B4.1.exp=1&B4.1.saved=" data-label="导出这条视频">导出</div>
    </div>

    ${preview}

    ${exp ? `<div class="sheet">
      <div class="sheet-in">
        <div class="sheet-h">
          <div class="row">
            <div style="flex:1">
              <div class="t1">导出这条</div>
              <div class="t2">存到相册之后，可以直接发到别的平台</div>
            </div>
            <span style="font-size:12px;font-weight:700;color:var(--brand);cursor:pointer"
              data-set="B4.1.exp=">关闭</span>
          </div>
        </div>
        <div class="sheet-b">
          <div class="vrow${hd ? "" : " on"}" data-set="B4.1.hd=0">
            <span class="rd"></span>
            <span class="vw"><b>带水印 · 免费</b><i>960×544 · 右下角一个「团长闪剪」角标</i></span>
          </div>
          <div class="vrow${hd ? " on" : ""}" data-set="B4.1.hd=1">
            <span class="rd"></span>
            <span class="vw"><b>高清无水印 <span class="tag b" style="margin-left:4px">推荐</span></b>
              <i>1080×1920 · 扣 1 次生成额度 · 本周还剩 7 次</i></span>
          </div>
        </div>
        <div class="sheet-f">
          <div class="btn" data-set="B4.1.exp=&B4.1.saved=1" data-label="保存到相册">保存到相册</div>
        </div>
      </div>
    </div>` : ""}
  </div>`;
};
