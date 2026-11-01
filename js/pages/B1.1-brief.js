window.PAGES["B1.1"].prd = "PRD §6.16 · 开工确认（AI 复述 · 结构 · 长短 · 口吻）与扣费";
window.PAGES["B1.1"].states = [
  { k: "", n: "默认：AI 复述只读，真正要选的只有三件——结构、长短、口吻" }
];

/* AI 写脚本的开工页。这一页只干两件事：
   ① 把 AI 听懂了什么**说给人听**（只读，供他一眼确认）；
   ② 让他选三个**AI 猜不了、只有他知道**的东西：结构、长短、口吻。

   上一版把「讲给谁 / 这次的重点 / 带不带价格」也做成了选项，四项胶囊、
   五处「要你定」——用户反馈是"选择太多"。这个反馈是对的：
   那几项本来就是 AI 该读出来的（读错了他会回上一页改主题那句话），
   把它做成表单项，等于让用户替 AI 干活。**能读的不要问，只能问的才问。**

   口吻和 B2.4 的"谁在说"不是一回事：这里是**怎么写**，那里是**谁的声音念**。 */
window.PAGES["B1.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const typed = ctx.topic || ((window.STATE || {}).B1 || {}).topic || "";
  const topic = typed || "磷虾油今晚 8 点开团，讲清成分、含量和怎么买";

  const b = D.brief(), vals = D.briefOf(ctx);
  /* 结构可以"不选"——上一版没给这个出口，等于逼用户替 AI 拍板 */
  const autoStruct = ctx.struct === "auto";
  const st = autoStruct ? null : D.structOf(ctx.struct);
  const ln = D.len(ctx.len);
  const tn = D.tone(ctx.tone);

  /* 把 AI 读到的几条拼成一句人话。四行小表看着像"要填的东西"，
     一句话才像"我复述一遍你听听"。
     注意用 say 而不是 tx：tx 是按钮上的短标签（"两类都要"），
     直接拼进句子会变成"讲给两类都要"，读不通。 */
  const say = (k) => {
    const it = b[k], o = (it.opts || []).filter((x) => x.id === vals[k])[0];
    return o ? o.say : vals[k];
  };
  const bits = [b.product.value, say("audience"), say("focus")];
  /* 重点已经是价格时再说一遍"会说团价"就是重复 */
  if (!(vals.focus === "price" && vals.price === "yes")) bits.push(say("price"));
  const readback = bits.join("，") + "。";

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "AI 写脚本", sub: "写之前先把话说清", back: "B1", act: "换主题", actGo: "B1" })}

    <div class="body">
      <div class="card" style="background:var(--brand-weak);box-shadow:none;padding:11px 13px">
        <div class="xs" style="color:#3A5BA8;font-weight:600">你说的</div>
        <div class="t" style="margin-top:5px;font-weight:600;color:var(--brand-ink);line-height:1.45;font-size:14px">${topic}</div>
        ${typed ? "" : `<div class="xs" style="margin-top:4px;color:#5B7AB8">这是示例，回上一页可以改成你自己的说法</div>`}
      </div>

      <div class="readback">
        <span class="lb">AI 这样理解</span>
        <p>${readback}</p>
        <span class="fix" data-go="B1" data-label="回去改主题">哪里说错了？改主题 ›</span>
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">脚本结构</span>
        <span class="more">分几段，每段讲什么</span></div>
      <!-- 结构不是一个"风格名"，是一副骨架：几段、每段说什么。
           所以每一项都要把段数和链路写出来，用户选的是"这条片子怎么走"。 -->
      <div class="slist">${D.structs().map((x) =>
        `<div class="sitem${st && st.id === x.id ? " on" : ""}" data-set="B1.1.struct=${x.id}">
          <span class="sn">${x.parts} 段</span>
          <span class="sk">${x.name}</span>
          ${st && st.id === x.id ? `<span class="ck">✓</span>` : ""}
        </div>`).join("")}</div>
      <div class="note" style="margin:9px 2px 0;display:flex;gap:8px;align-items:flex-start">
        <span style="flex:1">${autoStruct ? "不指定 —— AI 按主题自己挑一副骨架" : st.note}</span>
        <span style="flex:0 0 auto;color:var(--brand);font-weight:700;cursor:pointer"
          data-set="B1.1.struct=${autoStruct ? "s4" : "auto"}">${autoStruct ? "指定一个 ›" : "不选 ›"}</span>
      </div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">讲多长</span></div>
      <div class="optr eq" style="margin:0 2px">${D.lens().map((x) =>
        `<span class="optb ${ln.id === x.id ? "on" : ""}" data-set="B1.1.len=${x.id}">${x.name}</span>`).join("")}</div>
      <div class="note" style="margin:8px 2px 0">${ln.note}</div>

      <div class="sec-h" style="margin:16px 2px 9px"><span class="h2">什么口吻</span></div>
      <div class="optr" style="margin:0 2px">${D.tones().map((x) =>
        `<span class="optb ${tn.id === x.id ? "on" : ""}" data-set="B1.1.tone=${x.id}">${x.name}</span>`).join("")}</div>
      <div class="note" style="margin:8px 2px 0">${tn.note}</div>

      <div class="note" style="margin:14px 2px 0;line-height:1.7">
        <b style="color:var(--text)">会消耗 1 次生成额度</b>（本周还剩 8 次）。写完台词和画面都能改，
        改台词不重新扣费；只有「整条重写」才扣。
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 100px" data-go="B1" data-label="回去改主题">改主题</div>
      <div class="btn ai" data-go="B2?kind=script&src=ai&tone=${tn.id}&len=${ln.id}&struct=${autoStruct ? "auto" : st.id}"
        data-label="开始写脚本">✦ 开始写 · 扣 1 次</div>
    </div>
  </div>`;
};
