window.PAGES["B1.1"].prd = "PRD §6.16 · 开工确认（AI 复述 · 结构 · 时长 · 口吻）与扣费";
window.PAGES["B1.1"].states = [
  { k: "", n: "默认：AI 复述的每一项都能改，改完才写" }
];

/* AI 写脚本的开工页。这一页只干一件事：**在扣额度之前，把 AI 听懂了什么摊开给人改**。
   猜错商品 / 猜错听众 / 选错结构，写出来五段全废，重生一次再扣一次。

   版面分两层，顺序是刻意的：
   ① 上面一块 = **这条怎么讲**：AI 读到的四条 + 照哪个结构，合成同一张卡。
      为什么合成一块——它们本来就是同一件事（AI 从你那句话里读出来的"这条该长什么样"），
      拆成「AI 读到的」和「结构模板」两段，用户要分别判断两次，还得自己想这两者有没有关系。
      其中**影响整条结构的项一定给选项**（胶囊），只写成一行字没人会去看。
   ② 下面才是**多长**和**什么口吻**：这两项不改变"讲什么"，只改变"讲多细、用什么腔调"，
      所以放第二层——先定内容，再定形式。

   口吻和 B2.4 的"谁在说"不是一回事：这里是**怎么写**，那里是**谁的声音念**。 */
window.PAGES["B1.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  /* 主题是上一页那个输入框里的原话。原型里没有全局 store，
     直接读 B1 的状态；接真接口后这里换成读 draft 对象。 */
  const typed = ctx.topic || ((window.STATE || {}).B1 || {}).topic || "";
  const topic = typed || "磷虾油今晚 8 点开团，讲清成分、含量和怎么买";

  const b = D.brief();
  const vals = D.briefOf(ctx);
  const st = D.structOf(ctx.struct);
  const tn = D.tone(ctx.tone);
  const dur = ctx.dur || "45";
  const DURS = [["30", "30 秒", "短钩子"], ["45", "45 秒", "讲清楚"], ["60", "60 秒", "深度讲"]];

  /* 要人点头的条数。结构是单选，只算一项——按 options 数去加会算出 3，
     那是"有 3 个备选"，不是"3 件事要你定"。 */
  const askN = Object.keys(b).filter((k) => b[k].conf === "ask").length + 1;

  /* 一行 = 一项：AI 有把握的压成一行结论，要人定的给胶囊 */
  const row = (k) => {
    const it = b[k];
    const tag = it.conf === "ask" ? `<i class="need">要你定</i>` : `<i class="ok">已读到</i>`;
    if (!it.opts) {
      return `<div class="airow one">
        <div class="lb"><span>${it.label}</span>${tag}</div>
        <div class="val">${vals[k]}</div>
      </div>`;
    }
    return `<div class="airow">
      <div class="lb"><span>${it.label}</span>${tag}</div>
      <div class="optr">${it.opts.map((o) =>
        `<span class="optb ${vals[k] === o.id ? "on" : ""}" data-set="B1.1.${k}=${o.id}">${o.tx}</span>`).join("")}</div>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "AI 写脚本", sub: "写之前先把话说清", back: "B1", act: "换主题", actGo: "B1" })}

    <div class="body">
      <div class="card" style="background:var(--brand-weak);box-shadow:none;padding:11px 13px">
        <div class="xs" style="color:#3A5BA8;font-weight:600">你说的</div>
        <div class="t" style="margin-top:5px;font-weight:600;color:var(--brand-ink);line-height:1.45;font-size:14px">${topic}</div>
        ${typed ? "" : `<div class="xs" style="margin-top:4px;color:#5B7AB8">这是示例，回上一页可以改成你自己的说法</div>`}
      </div>

      <div class="sec-h"><span class="h2">这条怎么讲</span>
        <span class="more" style="color:#C2410C;font-weight:600">${askN} 项要你定</span></div>

      <div class="card" style="padding:2px 14px 4px">
        ${row("product")}${row("audience")}${row("focus")}${row("price")}

        <div class="airow" style="padding-bottom:13px">
          <div class="lb"><span>照着哪个结构讲</span><i class="need">要你定</i></div>
          <div class="optr">${D.structs().map((s) =>
            `<span class="optb ${st.id === s.id ? "on" : ""}" data-set="B1.1.struct=${s.id}">${s.short}</span>`).join("")}</div>
          <div class="note" style="margin-top:8px"><b style="color:var(--text-2)">${st.name}</b> · ${st.note}</div>
        </div>
      </div>

      <div class="sec-h" style="margin:15px 2px 9px"><span class="h2">讲多长 · 什么口吻</span>
        <span class="more">这两项只改怎么写，不改讲什么</span></div>

      <div class="card" style="padding:2px 14px 4px">
        <div class="airow" style="padding-bottom:13px">
          <div class="lb"><span>讲多长</span></div>
          <div class="optr">${DURS.map(([k, a, bb]) =>
            `<span class="optb ${dur === k ? "on" : ""}" data-set="B1.1.dur=${k}">${a} · ${bb}</span>`).join("")}</div>
        </div>
        <div class="airow" style="padding-bottom:13px">
          <div class="lb"><span>什么口吻</span></div>
          <div class="optr">${D.tones().map((t) =>
            `<span class="optb ${tn.id === t.id ? "on" : ""}" data-set="B1.1.tone=${t.id}">${t.name}</span>`).join("")}</div>
          <div class="note" style="margin-top:8px">${tn.note}</div>
        </div>
      </div>

      <div class="note" style="margin:12px 2px 0;line-height:1.7">
        <b style="color:var(--text)">会消耗 1 次生成额度</b>（本周还剩 8 次）。写完台词和画面都能改，
        改台词不重新扣费；只有「整条重写」才扣。
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 100px" data-go="B1" data-label="回去改主题">改主题</div>
      <div class="btn ai" data-go="B2?kind=script&src=ai&tone=${tn.id}&dur=${dur}" data-label="开始写脚本">✦ 开始写 · 扣 1 次</div>
    </div>
  </div>`;
};
