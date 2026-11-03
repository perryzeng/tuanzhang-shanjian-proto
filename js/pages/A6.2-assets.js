/* A6.2 我的素材（V15）
   和 E2「素材库」是两件事，别混：
   E2 是作品和脚本的仓库（做出来的东西）。
   这里是"我这个人的原料"—— 出镜、产品、场景、顾客反馈。
   每条片子都从这四格里取，所以它越全，出片越像你。 */

window.PAGES["A6.2"].prd = "PRD V15 §3 · 我的素材（私有原料包）";
window.PAGES["A6.2"].sysEntry = "◎ 抽屉第二项；引导第 4 问也落这里";

window.PAGES["A6.2"].render = function () {
  const C = window.C, AI = window.AI;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "我的素材", sub: "每条片子都从这四格取，越全越像你", back: "A6", act: "上传" })}

    <div class="body">
      <div class="v15-as-grid">
        ${AI.assets.map((a) => `<div class="v15-as-card" data-go="E2" data-label="${a.name}">
          <img src="${a.img}" alt="">
          <div class="v15-as-tx">
            <b>${a.name}</b>
            <span>${a.n}</span>
          </div>
          <em>${a.note}</em>
        </div>`).join("")}
      </div>

      ${C.sec("只有我有")}
      <div class="v15-voice">
        <span class="v15-voice-ic">声</span>
        <div>
          <b>我的声音</b>
          <span>${AI.voice.note}</span>
        </div>
        <span class="v15-voice-play">▶ 听</span>
      </div>
      <div class="v15-voice" style="margin-top:8px">
        <span class="v15-voice-ic" style="background:var(--violet-weak);color:#5B3FD1">脸</span>
        <div>
          <b>我的形象</b>
          <span>3 张出镜照 · 用于保持同一个人</span>
        </div>
        <span class="v15-voice-play">看</span>
      </div>

      ${C.sec("小剪会怎么用")}
      <div class="card plain" style="padding:13px">
        <div class="xs" style="line-height:1.85">
          · 讲「谁在吃」→ 取出镜里的吴阿姨<br>
          · 讲「是什么」→ 取产品实拍里的瓶身和成分表<br>
          · 讲「凭什么信」→ 取顾客反馈里的聊天截图<br>
          · 缺哪一格，我提前告诉你，不等到出片时才发现
        </div>
      </div>

      <div class="xs" style="margin:14px 2px 4px;line-height:1.7">
        这些只存在你自己的账号下，团队里别人看不到，也不会用来做行业样本。
      </div>
    </div>
  </div>`;
};
