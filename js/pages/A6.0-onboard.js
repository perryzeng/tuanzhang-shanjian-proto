/* A6.0 首次引导（V15）
   纯对话产品的生死线就在这里。第一次进来看到的不是表单，是四个问题。

   为什么是这四个、这个顺序：
   ① 行业 —— 决定用哪套话术库和合规红线（保健品不能讲疗效）
   ② 内容类型 —— 决定结构模板（科普讲「一个点」，带货讲「一个理由」）
   ③ 人设 —— 决定语气（"专业"和"亲切"写出来的台词完全不同）
   ④ 素材 —— 决定能不能真出片，不能出片的话前面三条都白搭

   答完立刻给第一条选题，不让人空手走。 */

window.PAGES["A6.0"].prd = "PRD V15 §2 · 首次引导（四问）";
window.PAGES["A6.0"].sysEntry = "新用户首次登录；可在「我是谁」里重答";

window.PAGES["A6.0"].render = function (ctx) {
  const C = window.C, AI = window.AI;
  const s = ctx.s || "ind";
  const order = ["ind", "type", "tone", "asset", "done"];
  const idx = order.indexOf(s);
  const at = (k) => idx >= order.indexOf(k);

  const ind = ctx.ind || "保健";
  const type = ctx.type || "科普";
  const tone = ctx.tone || "亲切";

  const M = [];
  const ai = (html, acts) => M.push(`<div class="msg"><span class="mav">剪</span><div>
      <div class="bub">${html}</div>
      ${acts && acts.length ? `<div class="macts">${acts.map(([tx, set]) =>
        `<span class="mact-btn" data-set="${set}" data-label="${tx}">${tx} ›</span>`).join("")}</div>` : ""}
    </div></div>`);
  const me = (html) => M.push(`<div class="msg me"><div><div class="bub">${html}</div></div></div>`);

  ai("你好。我是小剪。<br>先问你四件事，之后每条片子都按你的路子来 —— 不用你每次重新解释。");

  /* ① 行业 */
  if (idx === 0) {
    ai(AI.onboarding[0].ask + `<br><span style="color:var(--text-3);font-size:11.5px">${AI.onboarding[0].hint}</span>`);
    M.push(`<div class="v15-opts">${[
      ["保健", "保健品 / 营养品"], ["食品", "食品生鲜"], ["母婴", "母婴"],
      ["家居", "家居日用"], ["个护", "个护美妆"], ["本地", "本地生活"]
    ].map(([v, tx]) => `<span class="qchip" data-set="A6.0.s=type&A6.0.ind=${v}" data-label="${tx}">${tx}</span>`).join("")}</div>`);
  } else {
    me(`我做${["保健", "食品", "母婴", "家居", "个护", "本地"].indexOf(ind) >= 0 ? "保健品 / 营养品" : "这行"}的。`);
    ai("保健品，懂了。这行最怕讲得像广告 —— 我给你把话写成像聊天。");
  }

  /* ② 内容类型 */
  if (at("type") && idx > 0) {
    if (idx === 1) {
      ai(AI.onboarding[1].ask + `<br><span style="color:var(--text-3);font-size:11.5px">${AI.onboarding[1].hint}</span>`);
      M.push(`<div class="v15-opts">${[
        ["科普", "科普讲明白"], ["带货", "直接带货"], ["见证", "真人见证"], ["日常", "日常人设"]
      ].map(([v, tx]) => `<span class="qchip" data-set="A6.0.s=tone&A6.0.type=${v}" data-label="${tx}">${tx}</span>`).join("")}</div>`);
    } else {
      me("主要拍科普讲明白。");
      ai("科普为主。那我默认每条先讲清<b>一个点</b>，再提货 —— 上来就卖反而没人看。");
    }
  }

  /* ③ 人设 */
  if (at("tone") && idx > 2) {
    if (idx === 2) {
      ai(AI.onboarding[2].ask + `<br><span style="color:var(--text-3);font-size:11.5px">${AI.onboarding[2].hint}</span>`);
      M.push(`<div class="v15-opts">${[
        ["专业", "专业靠谱，像个懂行的"], ["亲切", "亲切，像邻居大姐"], ["实在", "实在，不忽悠"]
      ].map(([v, tx]) => `<span class="qchip" data-set="A6.0.s=asset&A6.0.tone=${v}" data-label="${tx}">${tx}</span>`).join("")}</div>`);
    } else {
      me("希望别人觉得我亲切，像邻居大姐。");
      ai(`那我写台词就不端着。开头大概长这样：<br><b>「我不劝你买，你先看看这张体检单。」</b>`);
    }
  }

  /* ④ 素材 */
  if (at("asset") && idx > 3) {
    if (idx === 3) {
      ai("最后一样。先给我四样东西，以后每条片子都从这取。<br><span style='color:var(--text-3);font-size:11.5px'>现在没有可以跳过，后面补也行</span>");
      M.push(`<div class="v15-assets">${AI.assets.map((a) =>
        `<div class="v15-asset"><i>${a.ic}</i><b>${a.name}</b><span>${a.note}</span></div>`).join("")}</div>`);
      ai("", [["我传好了，开始", "A6.0.s=done"], ["先跳过，用行业素材", "A6.0.s=done"]]);
    } else {
      me("先跳过，用行业素材。");
      ai("行。等行业素材不够用了，我再问你要。");
    }
  }

  /* ⑤ 收尾：立刻给第一条 */
  if (s === "done") {
    ai(`搭好了。你的第一条我建议就讲：<b>磷虾油到底适合谁</b>。<br>素材不够也没事，我先用行业素材和你的口播拼一版。`);
    ai("", [["出第一条", "A6"], ["先看看我是怎么被设置的", "A6.1"]]);
  }

  return `<div class="app" style="background:var(--bg-2)">
    ${C.sb()}
    <div class="v15-hd">
      <span class="mav">剪</span>
      <div class="v15-hd-t"><b>小剪</b><span>第一次见面 · 第 ${Math.min(idx + 1, 4)} / 4 个问题</span></div>
      <span class="v15-hd-step">${idx >= 4 ? "✓" : idx + 1 + "/4"}</span>
    </div>

    <div class="chat v15-chat">
      <div class="chat-day">刚刚</div>
      ${M.join("")}
    </div>

    ${idx < 4 ? `<div class="v15-tip" data-go="A6" data-label="跳过引导">也可以直接开始，我边做边问 ›</div>` : ""}
  </div>`;
};

window.PAGES["A6.0"].after = function () {
  const el = document.querySelector(".phone .v15-chat");
  if (el) el.scrollTop = el.scrollHeight;
  return null;
};
