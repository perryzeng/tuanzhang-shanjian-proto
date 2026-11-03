/* A6 对话首页（V15 · AI 原生实验分支）
   和 A1.2 是两条不同的路：
   A1.2 = 模块拼起来的经营台，用户"看"信息，再决定点哪。
   A6   = 一条对话，AI 先开口，用户"答"就行，答完直接出东西。

   这一版刻意砍掉底部 tab：整个产品只剩一个输入框。
   其他东西（我是谁 / 素材 / 作品 / 客户）收进左下角的 ◎ 抽屉。

   一条完整链路：
   早上 AI 汇报 → 说「剪一条」→ 三轮选择 → 脚本卡（可改字）→ 出片
   → 选渠道 → 拿链接和文案 → 数据回来 → AI 推给你该回谁。 */

window.PAGES["A6"].prd = "PRD V15 §1 · 对话式首页（AI 原生）";
window.PAGES["A6"].sysEntry = "首次引导（A6.0）走完后落地；老用户默认从这里进";

window.PAGES["A6"].render = function (ctx) {
  const C = window.C, AI = window.AI, B = window.BIZ;
  const s = ctx.s || "home";
  const menu = ctx.menu === "1";
  const W = B.wave, L = B.leads;
  const after = (list) => list.indexOf(s) >= 0;

  const M = [];
  const ai = (html, acts) => M.push(`<div class="msg"><span class="mav">${C.uai({ bare: true })}</span><div>
      <div class="bub">${html}</div>
      ${acts && acts.length ? `<div class="macts">${acts.map(([tx, set]) =>
        `<span class="mact-btn" data-set="${set}" data-label="${tx}">${tx} ›</span>`).join("")}</div>` : ""}
    </div></div>`);
  const me = (html) => M.push(`<div class="msg me"><div><div class="bub">${html}</div></div></div>`);
  const card = (html) => M.push(`<div class="v15-cardwrap">${html}</div>`);

  /* ---------- 1. 每天开场：AI 先说三件事 ---------- */
  ai(`早上好，${B.me.name}。昨天 <b>3</b> 条片，<b>47</b> 人点开。`);
  card(`<div class="v15-card v15-data">
    <div class="v15-data-hd">昨天 · 你的朋友圈</div>
    <div class="v15-data-grid">
      <div><b>${B.yesterday.visitors}</b><span>点开</span></div>
      <div><b>${B.yesterday.repeat}</b><span>看两遍</span></div>
      <div><b>${B.yesterday.asked}</b><span>问价</span></div>
      <div><b>${B.yesterday.deals}</b><span>成交</span></div>
    </div>
  </div>`);

  ai(`今天该出第 <b>${W.today.ep}</b> 条：${W.today.name}。<br>素材你上次传过吴阿姨那条，够用。`);
  card(`<div class="v15-card v15-today" data-go="B1?w=${W.id}&ep=${W.today.ep}" data-label="开始剪">
    <img src="${window.IMG.still}" alt="">
    <div>
      <b>第 ${W.today.ep} 集 · ${W.today.name}</b>
      <span>${W.today.dur} · 这一环补「别人吃了有没有用」</span>
    </div>
    <i>剪</i>
  </div>`);

  ai(`另外 <b>${B.pending.length}</b> 条剪好了没发，最久的放了 17 小时。`);
  card(`<div class="v15-card v15-pend">
    <div class="v15-pend-hd">待发 ${B.pending.length} 条</div>
    ${B.pending.map((v) => `<div class="v15-pend-r" data-go="S1?v=${v.id}" data-label="去发">
      <img src="${v.img}" alt=""><span>${v.title}</span><em>放 ${v.hours}h</em></div>`).join("")}
  </div>`);

  ai(`阿梅昨天点了「问团长」，看的是第 3 个要点。`);
  card(`<div class="v15-card v15-lead" data-go="G3.1?u=u_amei" data-label="跟进阿梅">
    <span class="v15-lead-av" style="background:${L[0].bg}">${L[0].av}</span>
    <div><b>阿梅 <em>${L[0].score}</em></b><span>${L[0].acts}</span></div>
    <i>回她</i>
  </div>`);

  /* ---------- 2. 剪片：三轮问完，出一个能改的脚本卡 ---------- */
  if (after(["cut1", "cut2", "cut3", "card", "video", "share", "data"])) {
    me("帮我剪一条");
    ai("讲什么？这三个都是你这一波还没讲的：", [
      ["老客回购", "A6.s=cut2"], ["成分对比", "A6.s=cut2"], ["3 个常见误区", "A6.s=cut2"]
    ]);
  }

  if (after(["cut2", "cut3", "card", "video", "share", "data"])) {
    me("老客回购");
    ai("给谁看？", [["老客", "A6.s=cut3"], ["新客", "A6.s=cut3"], ["都在", "A6.s=cut3"]]);
  }

  if (after(["cut3", "card", "video", "share", "data"])) {
    me("老客");
    ai("多长？", [["30 秒", "A6.s=card"], ["45 秒", "A6.s=card"], ["1 分钟", "A6.s=card"]]);
  }

  if (after(["card", "video", "share", "data"])) {
    me("45 秒");
    ai(`按你的人设写的，3 段。素材从你那包里取的 —— 台词直接点就能改。`);
    card(`<div class="v15-card v15-sc">
      <div class="v15-sc-hd"><b>${AI.script.title}</b><span>${AI.script.total}</span></div>
      ${AI.script.segs.map((g) => `<div class="v15-sc-seg">
        <img src="${g.img}" alt="">
        <div>
          <div class="v15-sc-n">${g.no} ${g.name}<em>${g.dur}</em></div>
          <p>${g.vo}</p>
          <span class="v15-sc-slot">画面：${g.slot}</span>
        </div>
      </div>`).join("")}
    </div>`);
    ai(`说得不对就点那句改。没问题就出片。`, [["就这样，出片", "A6.s=video"], ["开头换个说法", "A6.s=card"]]);
  }

  /* ---------- 3. 出片 + 分发 ---------- */
  if (after(["video", "share", "data"])) {
    me("就这样，出片");
    ai(`出好了，46 秒。`);
    card(`<div class="v15-card v15-video">
      <div class="v15-video-th"><img src="${AI.video.img}" alt=""><span>${AI.video.dur}</span><i>▶</i></div>
      <b>${AI.video.title}</b>
    </div>`);
    ai("发哪儿？三个地方说法不一样，我按地方给你配。", [
      ["发朋友圈", "A6.s=share"], ["发 3 个群", "A6.s=share"], ["先存着", "A6.s=share"]
    ]);
  }

  if (after(["share", "data"])) {
    me("发朋友圈");
    ai("文案配好了。链接带了你和这条的标记 —— 谁点开我都能看见。");
    card(`<div class="v15-card v15-share">
      <p>${AI.share.text.replace(/\n/g, "<br>")}</p>
      <div class="v15-share-lk">🔗 ${AI.share.link} <em>${AI.share.note}</em></div>
    </div>`);
    ai("复制这段，去微信粘贴就行。", [["复制文案 · 去发", "A6.s=data"]]);
  }

  if (after(["data"])) {
    me("复制文案 · 去发");
    ai(`发出去 ${AI.back.min} 分钟：<b>${AI.back.open}</b> 人点开，<b>${AI.back.full}</b> 个看完了。`);
    card(`<div class="v15-card v15-back">
      <div class="v15-back-hd">刚发的那条</div>
      <div class="v15-back-r"><span>点开</span><b>${AI.back.open}</b></div>
      <div class="v15-back-r"><span>看完</span><b>${AI.back.full}</b></div>
      <div class="v15-back-r"><span>点「问团长」</span><b>1</b></div>
    </div>`);
    ai(`${AI.back.who}。<br>${AI.back.ask}`, [
      ["现在回她", "G3.1?u=u_li"], ["明天再说", "A6.s=data"]
    ]);
  }

  /* ---------- 4. 首页专属：开头那个按钮 ---------- */
  if (s === "home") {
    ai("要我现在开始第 5 条吗？", [["开始剪", "A6.s=cut1"], ["先跟阿梅", "G3.1?u=u_amei"]]);
  }

  return `<div class="app" style="background:var(--bg-2)">
    ${C.sb()}

    <div class="v15-hd">
      <span class="mav">${C.uai({ bare: true })}</span>
      <div class="v15-hd-t"><b>U剪</b><span>在线 · 这一波已发 ${W.sent} 条</span></div>
      <span class="v15-hd-me" data-go="A6.1" data-label="我是谁">${B.me.av}</span>
    </div>

    <div class="chat v15-chat">
      <div class="chat-day">${s === "home" ? "今天 早上 8:30" : "刚刚"}</div>
      ${M.join("")}
    </div>

    <div class="chatbar">
      <span class="v15-plus" data-set="A6.menu=1" data-label="我的">◎</span>
      <input placeholder="跟U剪说：剪一条 / 发朋友圈 / 谁在看" style="flex:1;border:0;outline:0;background:var(--bg-2);border-radius:999px;padding:11px 15px;font-size:12.5px" />
      <span class="send" data-set="A6.s=cut1" data-label="发送">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </span>
    </div>

    ${menu ? `<div class="v15-mask" data-set="A6.menu=">
      <div class="v15-menu">
        <div class="v15-menu-hd">我的东西</div>
        <div class="v15-mi" data-go="A6.1" data-label="我是谁">
          <i>人</i><div><b>我是谁</b><span>行业 · 人设 · 口头禅 · 不能说</span></div><em>›</em>
        </div>
        <div class="v15-mi" data-go="A6.2" data-label="我的素材">
          <i>料</i><div><b>我的素材</b><span>12 条出镜 · 声音已克隆</span></div><em>›</em>
        </div>
        <div class="v15-mi" data-go="E2" data-label="我的作品">
          <i>作</i><div><b>我的作品</b><span>发过的都在这</span></div><em>›</em>
        </div>
        <div class="v15-mi" data-go="G3.1" data-label="我的客户">
          <i>客</i><div><b>我的客户</b><span>27 位 · 今天该跟 3 个</span></div><em>›</em>
        </div>
      </div>
    </div>` : ""}
  </div>`;
};

/* 每次切状态都滚到底：对话是往下长的，不滚就等于没看到新消息。
   core.js 在 renderAll 后调 after()，这里只负责滚动，不推进状态。 */
window.PAGES["A6"].after = function () {
  const el = document.querySelector(".phone .v15-chat");
  if (el) el.scrollTop = el.scrollHeight;
  return null;
};
