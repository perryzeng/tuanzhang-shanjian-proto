window.PAGES["A2"].prd = "PRD §4.2 · U剪助理（对话式 Agent）";

/* U剪助理：首页顶部的入口 → 这里。
   默认不空着：先给一句"今天最该做什么"，再给 4 个能直接点的快捷指令；
   点指令会真的进到对应页面。 */
window.PAGES["A2"].render = function (ctx) {
  const C = window.C;
  const q = ctx.q || "";
  const draft = (ctx.draft || "").replace(/"/g, "&quot;");

  const A = {
    /* 首页右上角那个 ✦ 进来的就是这一支：不问"任务完成没"，
       只回答"今天先动哪一步"。助理的角色从催办员换成参谋。 */
    biz: {
      ask: "今天先干什么？",
      say: "看了你这一波：<br>· 第 5 条「老客回购」还没剪，这一环补的是「别人吃了有没有用」<br>· 2 条剪好了没发，最久的放了 17 小时<br>· 阿梅点了「问团长」，是今天最该跟的人<br>先剪，还是先跟？",
      acts: [["先剪第 5 条", "B1?w=w_krill&ep=5"], ["先跟阿梅", "G3.1?u=u_amei"], ["看这一波进度", "A1.2"]]
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
      ${who === "me" ? "" : `<span class="mav">${C.uai({ bare: true })}</span>`}
      <div>
        <div class="bub">${html}</div>
        ${acts ? `<div class="macts">${acts.map(([tx, go]) =>
          `<span class="mact-btn" data-go="${go}" data-label="${tx}">${tx} ›</span>`).join("")}</div>` : ""}
      </div>
    </div>`;

  const chips = [
    ["biz", "今天先做什么"],
    ["2", "这个 App 怎么用"],
    ["3", "团队任务进度"],
    ["4", "帮我剪一条磷虾油"]
  ].map(([k, tx]) => `<span class="qchip" data-set="A2.q=${k}" data-label="${tx}">${tx}</span>`).join("");

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="A1.2" data-label="返回首页">‹</span>
      <div class="ttl">U剪助理<small>在线 · 今天的事我都记着</small></div>
      <span class="act" data-set="A2.q=" data-label="回到开头">重来</span>
    </div>

    <div class="chat">
      <div class="chat-day">今天</div>
      ${bubble("ai", "我是U剪。<br>你这一波讲到第 <b>5</b> 条，还差「给证据」这一环。<br>今天其实就三步：剪 1 条、发 2 条、跟 3 个人。")}

      ${bubble("ai", `<div style="font-weight:700;margin-bottom:7px">今天这三步</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          <div style="display:flex;gap:8px"><b style="color:#D9541F">剪</b><span style="flex:1">第 5 集 · 老客回购实拍</span><span style="color:#98A0B8">1 条</span></div>
          <div style="display:flex;gap:8px"><b style="color:#7C5CFF">发</b><span style="flex:1">剪好没发 · 最久放了 17 小时</span><span style="color:#98A0B8">2 条</span></div>
          <div style="display:flex;gap:8px"><b style="color:#0B7D5E">跟</b><span style="flex:1">阿梅点了「问团长」</span><span style="color:#98A0B8">3 人</span></div>
        </div>
        <div style="margin-top:9px;display:flex;gap:7px;flex-wrap:wrap">
          <span class="mact-btn" data-go="B1?w=w_krill&ep=5" data-label="去剪">去剪 ›</span>
          <span class="mact-btn" data-go="S1?v=v_pending_1" data-label="去发">去发 ›</span>
          <span class="mact-btn" data-go="G3.1" data-label="去跟">去跟 ›</span>
        </div>`)}

      ${cur ? bubble("me", cur.ask) + bubble("ai", cur.say, cur.acts) : ""}

      ${!cur ? `<div class="qwrap">${chips}</div>` : `<div class="qwrap">${chips}</div>`}
    </div>

    <div class="chatbar">
      <input data-bind="A2.draft" data-live value="${draft}" placeholder="问U剪：今天先做什么？"
        style="flex:1;border:0;outline:0;background:var(--bg-2);border-radius:999px;padding:11px 15px;font-size:12.5px" />
      <span class="send" data-set="A2.q=5&A2.draft=" data-label="发送">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </span>
    </div>
  </div>`;
};
