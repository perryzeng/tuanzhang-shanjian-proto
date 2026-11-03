/* A6.1 我是谁（V15）
   这不是一个"个人资料页"，是 AI 的长期记忆。
   它改一次，之后每条片子的台词、语气、选题都会跟着变 ——
   所以每一项都用「U剪记住的」这种说法，而不是「编辑资料」。 */

window.PAGES["A6.1"].prd = "PRD V15 §3 · 我是谁（IP 设定）";
window.PAGES["A6.1"].sysEntry = "对话首页右上角头像；或 ◎ 抽屉第一项";

window.PAGES["A6.1"].render = function (ctx) {
  const C = window.C, AI = window.AI, B = window.BIZ;
  const ip = AI.ip;
  const priv = (ctx && ctx.priv) || "open";

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "我是谁", sub: "U剪写每一句台词前，先读这里", back: "A6", act: "改" })}

    <div class="body">
      <div class="v15-ipcard">
        <div class="v15-ip-av">${B.me.av}</div>
        <div>
          <b>${B.me.name}</b>
          <span>${ip.who}</span>
        </div>
      </div>

      ${C.sec("我的素材", "点进去看", "A8.1")}
      <div class="v19-mine" data-go="A8.1" data-label="我的素材">
        <div><b>${window.LIB.stats.clips}</b><span>可用片段</span></div>
        <div><b>${window.LIB.stats.mine.n}</b><span>原始素材</span></div>
        <div><b>${window.LIB.works.length}</b><span>作品</span></div>
        <em>›</em>
      </div>

      ${C.sec("U剪记住的")}
      <div class="v15-kv"><span>做什么的</span><b>${ip.industry}</b></div>
      <div class="v15-kv"><span>主要拍</span><b>${ip.types.join(" · ")}</b></div>
      <div class="v15-kv"><span>怎么说话</span><b>${ip.tone}</b></div>
      <div class="v15-kv"><span>给谁看</span><b>${ip.audience}</b></div>

      ${C.sec("我的口头禅")}
      <div class="v15-catch">「${ip.catch}」</div>
      <div class="xs" style="margin:7px 2px 0;line-height:1.6">每条片子开头我会往这上面靠，但不是每次都照抄。</div>

      ${C.sec("不能说")}
      <div class="v15-taboo">
        ${ip.taboo.map((t) => `<div><i>✕</i>${t}</div>`).join("")}
        <div class="v15-taboo-add" data-go="A6.1" data-label="加一条">＋ 再加一条</div>
      </div>

      ${C.sec("我的声音")}
      <div class="v15-voice">
        <span class="v15-voice-ic">声</span>
        <div>
          <b>已克隆你的声音</b>
          <span>${AI.voice.note} · ${AI.voice.at}</span>
        </div>
        <span class="v15-voice-play">▶ 听</span>
      </div>

      ${C.sec("我的形象")}
      <div class="v15-face">
        ${["assets/gen/p-person.jpg", "assets/gen/p-still.jpg", "assets/gen/p-chat.jpg"].map((s) =>
          `<img src="${s}" alt="">`).join("")}
        <div class="v15-face-add">＋</div>
      </div>
      <div class="xs" style="margin:8px 2px 0;line-height:1.6">这三张是我认你的依据。换脸、换风格都会影响出片。</div>

      ${C.sec("隐私", "组里的人能看多少")}
      <div class="v31-priv">
        ${[["open", "全组可见", "组员能在榜单点开你，看到你发了几条、交了任务、被表扬过"],
           ["lead", "仅组长可见", "组员只看到你的名次和数字，组长能看到你的行为轨迹"],
           ["off", "不公开", "谁点开都只看到名次。组长也看不到"]]
          .map(([k, t, d]) => {
            const on = (priv === k);
            return `<div class="v31-priv-i ${on ? "on" : ""}" data-set="A6.1.priv=${k}" data-label="${t}">
              <i class="rw"></i>
              <div><b>${t}</b><span>${d}</span></div>
            </div>`;
          }).join("")}
      </div>
      <div class="xs" style="margin:8px 2px 0;line-height:1.6">
        排名和发布数永远是组里公开的。这设置只管"你具体做了什么"要不要给人看。
      </div>
    </div>
  </div>`;
};
