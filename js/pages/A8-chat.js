/* A8 对话首页（V16 · Persona Agent 完整形态）
   和 A6 的区别不是"改版"，是**产品定位变了**：
   A6 是"帮你剪片的助手"，A8 是"替你盯着整盘生意的 Agent"。

   所以对话里同时出现四种卡：数据、素材、任务、客户。
   一条对话把这些串起来，用户不用去四个 tab 分别看一遍。

   底部保留四项导航（小剪/素材/看板/团队）：
   对话擅长"今天做什么"，不擅长"翻一遍所有素材"和"比一比这周数据"。
   该给板块的还是要给板块 —— 这是 A6 纯对话版最大的教训。 */

window.PAGES["A8"].prd = "PRD V16 §1 · 对话首页（Persona Agent）";
window.PAGES["A8"].sysEntry = "老用户默认落地；新用户走完 A8.0 引导后进来";

window.PAGES["A8"].render = function () {
  const C = window.C, L = window.LIB, B = window.BIZ;
  const b = L.board.me;

  const M = [];
  const ai = (html, acts) => M.push(`<div class="msg"><span class="mav">剪</span><div>
      <div class="bub">${html}</div>
      ${acts && acts.length ? `<div class="macts">${acts.map(([tx, go]) =>
        `<span class="mact-btn" ${/=/.test(go) ? `data-set="${go}"` : `data-go="${go}"`} data-label="${tx}">${tx} ›</span>`).join("")}</div>` : ""}
    </div></div>`);
  const card = (html) => M.push(`<div class="v15-cardwrap">${html}</div>`);

  ai(`早上好，${B.me.name}。<br>三件事，两分钟看完。`);

  card(`<div class="v15-card v15-data">
    <div class="v15-data-hd">昨天 · 你的朋友圈</div>
    <div class="v15-data-grid">
      <div><b>${b.visitors}</b><span>点开</span></div>
      <div><b>${b.repeat}</b><span>看两遍</span></div>
      <div><b>${b.asked}</b><span>问价</span></div>
      <div><b>${b.deals}</b><span>成交</span></div>
    </div>
  </div>`);

  ai(`素材库昨晚进了 <b>3</b> 条新料，都是这行的。有一条讲成分的，正好补你第 5 条那一段。`);
  card(`<div class="v15-card v16-new" data-go="A8.1" data-label="看新素材">
    <img src="${L.items[0].img}" alt="">
    <div>
      <b>${L.items[0].title}</b>
      <span>平台新进 · 拆出 ${L.items[0].clips} 个片段 · ${L.items[0].usable} 个能用</span>
    </div>
    <i>看</i>
  </div>`);

  ai(`第 5 条还没剪。小组那边今天 <b>18:00</b> 截止，你现在排第 3。`);
  card(`<div class="v15-card v16-task">
    <span class="v16-task-k">小组</span>
    <div>
      <b>第 5 集 · 老客回购实拍</b>
      <span>今天 18:00 截止 · 8/12 人已交</span>
    </div>
    <i>去剪</i>
  </div>`);

  ai(`阿梅昨天点了「问团长」，看的是第 3 个要点。`);
  card(`<div class="v15-card v15-lead" data-go="A8.2" data-label="看阿梅">
    <span class="v15-lead-av" style="background:${L.board.leads[0].bg}">${L.board.leads[0].av}</span>
    <div><b>${L.board.leads[0].name} <em>${L.board.leads[0].score}</em></b><span>${L.board.leads[0].acts}</span></div>
    <i>回她</i>
  </div>`);

  ai(`要我先出第 5 条吗？素材我已经挑好了 3 个片段。`, [
    ["开始剪", "B1?w=w_krill&ep=5"], ["先看看素材", "A8.1"]
  ]);

  return `<div class="app" style="background:var(--bg-2)">
    ${C.sb()}
    <div class="v15-hd">
      <span class="mav">剪</span>
      <div class="v15-hd-t"><b>小剪</b><span>在线 · 这一波已发 ${B.wave.sent} 条</span></div>
      <span class="v15-hd-me" data-go="A6.1" data-label="我是谁">${B.me.av}</span>
    </div>

    <div class="chat v15-chat" style="padding-bottom:84px">
      <div class="chat-day">今天 早上 8:30</div>
      ${M.join("")}
    </div>

    <div class="chatbar">
      <span class="v15-plus" data-go="A6.1" data-label="我的">◎</span>
      <input placeholder="跟小剪说：剪第 5 条 / 素材里找点东西" style="flex:1;border:0;outline:0;background:var(--bg-2);border-radius:999px;padding:11px 15px;font-size:12.5px" />
      <span class="send" data-go="B1" data-label="发送">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </span>
    </div>

    ${C.tab8("A8")}
  </div>`;
};

window.PAGES["A8"].after = function () {
  const el = document.querySelector(".phone .v15-chat");
  if (el) el.scrollTop = el.scrollHeight;
  return null;
};
