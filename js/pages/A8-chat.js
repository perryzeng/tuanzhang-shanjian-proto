/* A8 对话首页（V17 · 全自动剪辑 + 对话式确认）
   ---------------------------------------------------------------
   定位变了：**剪和发之间不再有"工作台"。**
   以前是「首页点去剪 → B1 剪辑器 → B2 发布器 → 发出去」，
   现在是「说一句 → 我在后台剪 → 剪的过程中跟你确认几件事 → 成片 → 发」。

   所以首页要重新组织，不是改版：
   ① 删掉所有指向剪辑器/发布器的入口 —— 那两页已经不存在了
   ② 剪辑过程变成**看得见的进度卡**，不是一个跳走的按钮
   ③ 需要用户拿主意的地方（风格 / 封面 / 标题）都在对话里问，
      用结构化卡片给选项，用户点一下就推进，不跳页
   ④ 出片后仍然走 A8.4.2（平台预览 → 生成评论 → 分享）

   为什么确认必须做成"卡片"而不是一句话：
   "你想要什么风格" —— 用户答不上来。
   给三个带解释的选项（像上次那条 / 更直给 / 更生活），他才有得选。
   对话负责推进，卡片负责让选择变简单。这就是 Persona Agent 该有的样子。 */

window.PAGES["A8"].prd = "PRD V17 §1 · 对话首页（全自动剪辑 / 对话式确认）";
window.PAGES["A8"].sysEntry = "老用户默认落地；新用户走完 A8.0 引导后进来";

window.PAGES["A8"].render = function (ctx) {
  const C = window.C, L = window.LIB, B = window.BIZ;
  const b = L.board.me;
  const k = Math.min(3, Number(ctx.k || 0));
  const st = Number(ctx.st || 0), cv = Number(ctx.cv || 0), tt = Number(ctx.tt || 0);

  const STYLE = [
    ["像上次那条", "先给证据、最后才报价。你 10 月 30 日那条就是这么剪的，完播最高"],
    ["更直给", "前 3 秒就把价格和数量说出来。适合群里刷得快的人"],
    ["更生活", "像跟邻居聊天，全程不提「买」。适合朋友圈，不适合群"]
  ];
  const COVER = [
    ["体检单特写", "assets/gen/p-chat.jpg"],
    ["产品摆拍", "assets/gen/p-still.jpg"],
    ["我妈出镜", "assets/gen/p-person.jpg"]
  ];
  const TITLE = [
    "我不劝你买磷虾油，先看这张体检单",
    "299 两瓶，够吃两个月",
    "我妈吃了三个月，我拍了张体检单"
  ];

  const M = [];
  const ai = (html, acts) => M.push(`<div class="msg"><span class="mav">${C.uai({ bare: true })}</span><div>
      <div class="bub">${html}</div>
      ${acts && acts.length ? `<div class="macts">${acts.map(([tx, go]) =>
        `<span class="mact-btn" ${/=/.test(go) ? `data-set="${go}"` : `data-go="${go}"`} data-label="${tx}">${tx} ›</span>`).join("")}</div>` : ""}
    </div></div>`);
  const me = (html) => M.push(`<div class="msg me"><div><div class="bub">${html}</div></div></div>`);
  const card = (html) => M.push(`<div class="v15-cardwrap">${html}</div>`);

  /* ---------- 剪辑进度卡：过程要看得见，否则全自动就是黑箱 ---------- */
  const STEPS = ["挑素材", "配旁白", "配乐", "出封面"];
  const cutCard = () => {
    /* k=0 卡在配乐、k=1 卡在出封面、k>=2 四步都走完。
       但 k=2 时还在问标题，不能说"已出片" —— 画面齐了 ≠ 片成了。 */
    const stage = k === 0 ? 2 : k === 1 ? 3 : 4;
    const pct = [0, 42, 68, 86, 100][stage];
    const done = k >= 3;
    const left = { 2: "还要 40 秒", 3: "还要 15 秒", 4: "画面剪完了，还差标题" }[stage];
    return `<div class="v15-card v27-cut">
      <div class="v27-cut-hd">
        <b>第 5 集 · 老客回购实拍</b>
        <em>${done ? "已出片" : "剪到 " + pct + "%"}</em>
      </div>
      <div class="v27-steps">
        ${STEPS.map((s, i) => `<i class="${i < stage ? "ok" : i === stage ? "cur" : ""}">${s}</i>`).join("")}
      </div>
      <div class="v27-bar"><i style="width:${pct}%"></i></div>
      <div class="v27-cut-ft">
        <span>${done ? "4 步都做完了" : left}</span>
        <span class="v27-src">用了你 3 段、团队 2 段</span>
      </div>
    </div>`;
  };

  /* ---------- 三张确认卡 ---------- */
  const styleCard = () => `<div class="v27-pick">
    <div class="v27-pick-hd">三种剪法<em>选一个，我照这个剪</em></div>
    ${STYLE.map(([t, d], i) => `<div class="v27-opt" data-set="A8.k=1&A8.st=${i}" data-label="${t}">
      <b>${t}</b><span>${d}</span>
    </div>`).join("")}
  </div>`;

  const coverCard = () => `<div class="v27-pick">
    <div class="v27-pick-hd">三版封面<em>点一个，就用它</em></div>
    <div class="v27-covers">
      ${COVER.map(([t, img], i) => `<div class="v27-cv" data-set="A8.k=2&A8.cv=${i}" data-label="${t}">
        <div class="th"><img src="${img}" alt=""><span>9:16</span></div>
        <b>${t}</b>
      </div>`).join("")}
    </div>
    <div class="v27-tip">第一帧就是朋友圈里缩略图看到的那个画面，别选看不清人的。</div>
  </div>`;

  const titleCard = () => `<div class="v27-pick">
    <div class="v27-pick-hd">三条标题<em>挑一条，挑完就发</em></div>
    ${TITLE.map((t, i) => `<div class="v27-row" data-set="A8.k=3&A8.tt=${i}" data-label="${t}">
      <i>${i + 1}</i><b>${t}</b>
    </div>`).join("")}
  </div>`;

  const doneCard = () => `<div class="v15-card v27-done">
    <div class="th"><img src="${COVER[cv][1]}" alt=""><span>0:52</span></div>
    <div class="tx">
      <b>${TITLE[tt]}</b>
      <span>${STYLE[st][0]} · ${COVER[cv][0]} · 0:52</span>
    </div>
    <div class="v27-acts">
      <span class="ghost" data-set="A8.k=0&A8.st=&A8.cv=&A8.tt=" data-label="改一版">改一版</span>
      <span class="main" data-go="A8.4.2?pf=dy&c=c6" data-label="看效果">看效果</span>
    </div>
  </div>`;

  /* ---------- 对话 ---------- */
  ai(`早上好，${B.me.name}。昨天朋友圈有 <b>${b.visitors}</b> 个人点开，${b.asked} 个问了价。`);
  card(`<div class="v15-card v15-data">
    <div class="v15-data-hd">昨天 · 你的朋友圈</div>
    <div class="v15-data-grid">
      <div><b>${b.visitors}</b><span>次打开</span></div>
      <div><b>${b.repeat}</b><span>看两遍</span></div>
      <div><b>${b.asked}</b><span>问价</span></div>
      <div><b>${b.deals}</b><span>成交</span></div>
    </div>
  </div>`);

  ai(`阿梅昨天点了「问团长」，看的是第 3 个要点。要回的话我帮你把话写好。`);
  card(`<div class="v15-card v15-lead" data-go="A8.2.1?u=u_amei" data-label="看阿梅">
    <span class="v15-lead-av" style="background:${L.board.leads[0].bg}">${L.board.leads[0].av}</span>
    <div><b>${L.board.leads[0].name} <em>${L.board.leads[0].score}</em></b><span>${L.board.leads[0].acts}</span></div>
    <i>回她</i>
  </div>`);

  ai(`小组那边第 5 集今天 <b>18:00</b> 截止，你排第 3。我已经开剪了。`);
  card(cutCard());

  if (k === 0) {
    ai(`现在卡在配乐这步 —— 有个地方得你定，不然我剪完你大概率要返工。`);
    ai(`这条要哪种感觉？`);
    card(styleCard());
  }

  if (k >= 1) {
    me(`要「${STYLE[st][0]}」那种`);
    ai(`好，配乐和转场我按这个调。旁白也重录一遍，语气会跟着变。`);
  }

  if (k === 1) {
    ai(`封面我出了三版。第一帧就是别人在朋友圈刷到时的那个画面，你挑一个。`);
    card(coverCard());
  }

  if (k >= 2) {
    me(`封面用「${COVER[cv][0]}」`);
    ai(`定了。<br>标题我拟了三条，你挑一条，挑完就发 —— 不用再去别的页面改。`);
  }

  if (k === 2) {
    card(titleCard());
  }

  if (k >= 3) {
    me(`${TITLE[tt]}`);
    ai(`齐了。存到作品里了，现在就能发。`);
    card(doneCard());
    ai(`发出去以后谁点开、看了多久、划到第几个要点，我都会盯着。`);
  }

  return `<div class="app" style="background:var(--bg-2)">
    ${C.sb()}
    <div class="v15-hd">
      <span class="mav">${C.uai({ bare: true })}</span>
      <div class="v15-hd-t"><b>U剪</b><span>在线 · ${k >= 3 ? "第 5 集已出片" : "正在剪第 5 集"}</span></div>
      <span class="v15-hd-me" data-go="A6.1" data-label="我是谁">${B.me.av}</span>
    </div>

    <div class="chat v15-chat" style="padding-bottom:84px">
      <div class="chat-day">今天 早上 8:30</div>
      ${M.join("")}
    </div>

    <div class="chatbar">
      <span class="v15-plus" data-go="A6.1" data-label="我的">◎</span>
      <input placeholder="跟U剪说：换个更直给的开头 / 封面重出" style="flex:1;border:0;outline:0;background:var(--bg-2);border-radius:999px;padding:11px 15px;font-size:12.5px" />
      <span class="send" data-go="A8" data-label="发送">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </span>
    </div>

    ${C.tab8("A8")}
  </div>`;
};

/* 每确认一步都会重渲染，滚动位置会归零 —— 必须立刻跳到底，否则用户点完
   发现画面"跳回上一条"，会以为没生效。放 mount 不放 after：
   mount 在 innerHTML 之后同步跑，after 要等 900ms，中间那 0.9 秒看着像卡住。 */
window.PAGES["A8"].mount = function (el) {
  const c = el.querySelector(".v15-chat");
  if (c) c.scrollTop = c.scrollHeight;
};
