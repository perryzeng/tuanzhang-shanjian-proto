window.PAGES["B1.1"].prd = "PRD §6.10 · 生成前确认与扣费（写脚本这条路）";

/* AI 写脚本的开工页：把「我怎么理解你这句话」摊开让人改。
   为什么要在写之前拦一道：AI 猜错商品/猜错人设，写五段全废，重生一次要再扣一次额度。
   这一页只确认两件事：讲给谁、讲多长。谁在说（原音/AI 音色）留给 B2.4——
   那里和模板一起选，是一件事；在这里问一遍，用户要答两次同一个问题。 */
window.PAGES["B1.1"].render = function (ctx) {
  const C = window.C;
  /* 主题是上一页那个输入框里的原话。原型里没有全局 store，
     直接读 B1 的状态；接真接口后这里换成读 draft 对象。 */
  const typed = ctx.topic || ((window.STATE || {}).B1 || {}).topic || "";
  const topic = typed || "磷虾油今晚 8 点开团，讲清成分、含量和怎么买";
  const dur = ctx.dur || "45";
  const struct = ctx.struct || "开箱 → 成分 → 价格";

  const prod = /免疫|换季/.test(topic) ? "换季免疫" : "磷虾油";

  const DURS = [["30", "30 秒 · 短钩子"], ["45", "45 秒 · 讲清楚"], ["60", "60 秒 · 深度讲"]];
  const STRUCTS = ["开箱 → 成分 → 价格", "问题 → 原理 → 用法", "晒单 → 复购理由", "对比 → 我的选择"];

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "AI 写脚本", sub: "写之前先把话说清", back: "B1", act: "换主题", actGo: "B1" })}

    <div class="body">
      <div class="card" style="background:var(--brand-weak);box-shadow:none">
        <div class="xs" style="color:#3A5BA8;font-weight:600">你说的</div>
        <div class="t" style="margin-top:6px;font-weight:600;color:var(--brand-ink)">${topic}</div>
        ${typed ? "" : `<div class="xs" style="margin-top:5px;color:#5B7AB8">这是示例，回上一页可以改成你自己的说法</div>`}
      </div>

      ${C.sec("AI 读到的")}
      <div class="card" style="padding:4px 16px 8px">
        <div class="kv"><span class="k">商品</span><span class="v">${prod}</span></div>
        <div class="kv"><span class="k">讲给谁</span><span class="v">老客 + 观望的新客</span></div>
        <div class="kv"><span class="k">这次的重点</span><span class="v">开团时间与价格</span></div>
        <div class="kv"><span class="k">要不要带价格</span><span class="v" style="color:var(--brand)">要，说清团价</span></div>
      </div>

      ${C.sec("讲多长")}
      <div class="segtab">
        ${DURS.map(([k, tx]) => `<b class="${dur === k ? "on" : ""}" data-set="B1.1.dur=${k}">${tx}</b>`).join("")}
      </div>

      ${C.sec("结构模板")}
      <div class="chips">
        ${STRUCTS.map((s) => `<span class="chip ${struct === s ? "on" : ""}" data-set="B1.1.struct=${s}">${s}</span>`).join("")}
      </div>

      <div class="card plain" style="margin-top:14px">
        <div class="xs" style="line-height:1.7">
          <b style="color:var(--text)">会消耗 1 次生成额度</b>（本周还剩 8 次）。写完之后台词和画面都能改，
          改台词不重新扣费；只有「整条重写」才扣。声音和模板下一步再选，不影响这次扣费。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 108px" data-go="B1" data-label="回去改主题">改主题</div>
      <div class="btn ai" data-go="B2?kind=script&src=ai" data-label="开始写脚本">✦ 开始写 · 扣 1 次</div>
    </div>
  </div>`;
};
