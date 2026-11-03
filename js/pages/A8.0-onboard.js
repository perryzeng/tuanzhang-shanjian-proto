/* A8.0 新人引导（V16）
   三个问题，答完立刻给两样东西：**一段可改的人设 prompt + 一份 7 天排期。**

   为什么终点不是"资料填完了"：
   新用户注册完最怕的是空白 —— 没人告诉他明天发什么。
   7 天排期解决"发什么"，人设 prompt 解决"怎么说"，
   两个都给了，他第二天才会回来。

   这三问的顺序也是 AI 的依赖顺序：
   行业 → 话术库和合规红线；身份 → 谁在说话；想成为谁 → 语气。 */

window.PAGES["A8.0"].prd = "PRD V16 §5 · 新人引导（三问 → 人设 prompt + 7 天）";
window.PAGES["A8.0"].sysEntry = "新注册用户首次登录；也可从「我是谁」重跑";

window.PAGES["A8.0"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const s = ctx.s || "q1";

  const Q = {
    q1: { ask: "你是做什么的？", opts: [["保健", "保健品 / 营养品"], ["食品", "食品生鲜"], ["母婴", "母婴"], ["家居", "家居日用"], ["个护", "个护美妆"], ["本地", "本地生活"]] },
    q2: { ask: "你以什么身份出镜？", opts: [["团长", "社区团长"], ["店主", "店主 / 老板"], ["宝妈", "宝妈"], ["营养师", "营养师 / 专业人士"], ["店员", "店员"]] },
    q3: { ask: "你希望别人看完，觉得你是个什么人？", opts: [["专业", "懂行的"], ["亲切", "像邻居大姐"], ["实在", "不忽悠"]] }
  };

  const M = [];
  const ai = (html, acts) => M.push(`<div class="msg"><span class="mav">${C.uai({ bare: true })}</span><div>
      <div class="bub">${html}</div>
      ${acts && acts.length ? `<div class="macts">${acts.map(([tx, set]) =>
        `<span class="mact-btn" data-set="${set}" data-label="${tx}">${tx} ›</span>`).join("")}</div>` : ""}
    </div></div>`);
  const me = (html) => M.push(`<div class="msg me"><div><div class="bub">${html}</div></div></div>`);
  const card = (html) => M.push(`<div class="v15-cardwrap">${html}</div>`);
  const opts = (list) => M.push(`<div class="v15-opts">${list.map(([tx, set]) =>
    `<span class="qchip" data-set="${set}" data-label="${tx}">${tx}</span>`).join("")}</div>`);

  ai(`先问你三句。答完我给你两样东西：<b>一段人设</b>（以后每句台词都按它写）和<b>这 7 天发什么</b>。`);

  /* ① 行业 */
  if (s === "q1") {
    ai(Q.q1.ask);
    opts(Q.q1.opts.map(([v, tx]) => [tx, "A8.0.s=q2&A8.0.ind=" + v]));
  } else {
    me("保健品 / 营养品");
    ai("保健品。这行最怕讲得像广告，我给你把话说成像聊天。");
  }

  /* ② 身份 */
  if (s === "q2") {
    ai(Q.q2.ask);
    opts(Q.q2.opts.map(([v, tx]) => [tx, "A8.0.s=q3&A8.0.role=" + v]));
  } else if (s !== "q1") {
    me("社区团长");
    ai("社区团长 —— 那你的优势是「我认识你」，不是「我比你懂」。");
  }

  /* ③ 想成为谁 */
  if (s === "q3") {
    ai(Q.q3.ask);
    opts(Q.q3.opts.map(([v, tx]) => [tx, "A8.0.s=gen&A8.0.tone=" + v]));
  } else if (s === "gen") {
    me("像邻居大姐");
    ai(`写好了。我每写一句台词前，都会先读下面这段。`);
    card(`<div class="v15-card v16-prompt">
      <div class="v16-prompt-hd">我的人设 prompt<em>可以直接改</em></div>
      <textarea rows="9" data-bind="A8.0.prompt">${ctx.prompt || L.persona.prompt}</textarea>
      <div class="v16-prompt-ft">
        <span>改了会自动生效，之前写的不受影响</span>
      </div>
    </div>`);

    ai(`这是你这 7 天该发的。前 4 条讲清楚，第 5 条给证据，最后 2 条给理由 —— 顺序别乱。`);
    card(`<div class="v15-card">
      <div class="v16-plan-hd">7 天排期</div>
      ${L.plan7.map((p) => `<div class="v16-plan-r ${p.st === "today" ? "on" : ""}">
        <span class="v16-plan-d">${p.d}</span>
        <div><b>${p.t}</b><span>${p.k}</span></div>
        ${p.st === "today" ? `<em>今天</em>` : ""}
      </div>`).join("")}
    </div>`);

    ai(`今天这条我已经挑好素材了 —— 就是排期里标着「今天」的那条。要现在出个草稿吗？`, [
      ["让U剪开剪", "A8"], ["先改改人设", "A6.1"]
    ]);
  }

  return `<div class="app" style="background:var(--bg-2)">
    ${C.sb()}
    <div class="v15-hd">
      <span class="mav">${C.uai({ bare: true })}</span>
      <div class="v15-hd-t"><b>U剪</b><span>第一次见面 · 三个问题</span></div>
    </div>

    <div class="chat v15-chat">
      <div class="chat-day">刚刚</div>
      <div class="uai-intro">
        ${C.uai({ s: 54 })}
        <div>
          <b>U剪</b>
          <span>你的内容助理 · 会剪、会写，还会提醒你该跟谁聊</span>
        </div>
      </div>
      ${M.join("")}
    </div>

    ${s !== "gen" ? `<div class="v15-tip" data-go="A8" data-label="跳过">先跳过，边做边问 ›</div>` : ""}
  </div>`;
};

window.PAGES["A8.0"].after = function () {
  const el = document.querySelector(".phone .v15-chat");
  if (!el) return null;
  /* 出结果那一步不要滚到底 —— 停在人设卡顶部，
     否则用户第一眼看到的是半截 prompt，会以为写坏了。 */
  const pr = el.querySelector(".v16-prompt");
  el.scrollTop = pr ? Math.max(0, pr.offsetTop - 50) : el.scrollHeight;
  return null;
};
