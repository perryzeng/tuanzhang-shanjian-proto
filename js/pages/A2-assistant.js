window.PAGES["A2"].prd = "PRD §4.2 · 小剪助理（对话式 Agent）";

/* 小剪助理：首页顶部的入口 → 这里。
   默认不空着：先给一句"今天最该做什么"，再给 4 个能直接点的快捷指令；
   点指令会真的进到对应页面。 */
window.PAGES["A2"].render = function (ctx) {
  const C = window.C;
  const q = ctx.q || "";
  const draft = (ctx.draft || "").replace(/"/g, "&quot;");

  const A = {
    "1": {
      ask: "今天先做什么？",
      say: "我按「快到截止 + 影响发布」排了序：<br>① 「信任背书口播」还差 6 人，今天 18:00 截止<br>② 开箱合集今天要发 1 条，团队还差 8 条<br>③ 晚上 8 点开团，封面得在 6 点前定<br>先去催最急的那条？",
      acts: [["去催办", "E4.1?id=tk_1"], ["看今天安排", "D1"]]
    },
    "2": {
      ask: "这个 App 怎么用？",
      say: "就三步：<br>① 选品、说一句你的口径，AI 出脚本<br>② 定模板 / 声音 / 封面（声音可以克隆你自己的）<br>③ 生成、发布，团队任务会自动记完成<br>想直接试？我带你开一条。",
      acts: [["开始剪一条", "B1"], ["看我的声音", "G1.4"]]
    },
    "3": {
      ask: "团队任务进度怎么样？",
      say: "今天 3 个任务：<br>· 信任背书口播 6/12<br>· 开箱合集 4/12<br>· 9 月复盘 12/12 已完成<br>最慢的是阿北和小晓，要不要一起催？",
      acts: [["看任务列表", "E4.2"], ["一键催办", "E4.1?id=tk_1"]]
    },
    "4": {
      ask: "帮我剪一条磷虾油",
      say: "已经按 3 段式搭好了：<b>开场钩子 / 是什么 / 开团价</b>，素材也配好了，你只要改两句台词就能生成。",
      acts: [["去剪辑", "B2?kind=script&src=tpl&struct=s3&tpl=tp_trust"]]
    },
    "5": {
      ask: ctx.draft || "……",
      say: "收到，我先记下这句。这个版本我还在学，你可以先点下面的快捷指令，或者去「剪同款」找一条照着改，我在旁边帮你改词。",
      acts: [["去剪同款", "F1"], ["看我的任务", "E4.2"]]
    }
  };

  const cur = A[q] || null;

  const bubble = (who, html, acts) => `<div class="msg ${who === "me" ? "me" : ""}">
      ${who === "me" ? "" : `<span class="mav">剪</span>`}
      <div>
        <div class="bub">${html}</div>
        ${acts ? `<div class="macts">${acts.map(([tx, go]) =>
          `<span class="mact-btn" data-go="${go}" data-label="${tx}">${tx} ›</span>`).join("")}</div>` : ""}
      </div>
    </div>`;

  const chips = [
    ["1", "今天先做什么"],
    ["2", "这个 App 怎么用"],
    ["3", "团队任务进度"],
    ["4", "帮我剪一条磷虾油"]
  ].map(([k, tx]) => `<span class="qchip" data-set="A2.q=${k}" data-label="${tx}">${tx}</span>`).join("");

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="A1" data-label="返回首页">‹</span>
      <div class="ttl">小剪助理<small>在线 · 今天的事我都记着</small></div>
      <span class="act" data-set="A2.q=" data-label="回到开头">重来</span>
    </div>

    <div class="chat">
      <div class="chat-day">今天</div>
      ${bubble("ai", "我是小剪，你的助理。<br>今天有 <b>3 项</b>要做，最急的是「信任背书口播」，还差 6 人交。<br>要我帮你排一下今天的顺序吗？")}

      ${bubble("ai", `<div style="font-weight:700;margin-bottom:7px">今天的 3 件</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          <div style="display:flex;gap:8px"><b style="color:#D9541F">1</b><span style="flex:1">信任背书口播 · 6/12</span><span style="color:#98A0B8">18:00</span></div>
          <div style="display:flex;gap:8px"><b style="color:#7C5CFF">2</b><span style="flex:1">开箱合集 · 4/12</span><span style="color:#98A0B8">今天</span></div>
          <div style="display:flex;gap:8px"><b style="color:#0B7D5E">3</b><span style="flex:1">晚上 8 点开团 · 封面待定</span><span style="color:#98A0B8">18:00</span></div>
        </div>
        <div style="margin-top:9px"><span class="mact-btn" data-go="E4.2" data-label="去处理">去处理 ›</span></div>`)}

      ${cur ? bubble("me", cur.ask) + bubble("ai", cur.say, cur.acts) : ""}

      ${!cur ? `<div class="qwrap">${chips}</div>` : `<div class="qwrap">${chips}</div>`}
    </div>

    <div class="chatbar">
      <input data-bind="A2.draft" data-live value="${draft}" placeholder="问小剪：今天先做什么？"
        style="flex:1;border:0;outline:0;background:var(--bg-2);border-radius:999px;padding:11px 15px;font-size:12.5px" />
      <span class="send" data-set="A2.q=5&A2.draft=" data-label="发送">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </span>
    </div>
  </div>`;
};
