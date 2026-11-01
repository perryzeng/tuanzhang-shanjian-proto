window.PAGES["D1.3"].prd = "PRD §6.13 · 新建主题系列（写一个主题 / 分几条视频 → 自动排每条讲什么）";

/* 建系列和写脚本是同一个动作，只是"颗粒度"不同：
   写脚本是"我要讲什么"，建系列是"我要做一场什么"。
   所以这一页照抄写脚本的交互：一句话说清 + 一个可选项 + AI 排好的结果。

   **可选项只有一个：分几条视频**。
   上一版问了两次——"分几天"和"每天几趴"。问题在"趴"：团长不知道趴是什么，
   而它其实只是"一条视频里有几个分段"这种内部概念，生成之后在脚本框里自然会分，
   不需要在建系列时先定死。所以整组砍掉，只留"这个系列一共几条视频"。
   "几天"也一并改说"几条视频"——系列真正的产出是几条片子，不是几天工期。 */
window.PAGES["D1.3"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const product = ctx.product || "磷虾油";
  const days = +(ctx.days || 10);
  const typed = ctx.topic || "";
  /* 从创作页进来的（不是从 D1 列表），返回就回创作页，别把人扔进他不认识的地方 */
  const backGo = ctx.from === "B1" ? "B1" : "D1";

  const topics = D.planTopics(product, days);
  const toCampaign = { "磷虾油": "cp_1", "换季免疫": "cp_2", "老客复购": "cp_3" }[product] || "cp_1";

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "新建主题系列", sub: "写一个主题，AI 排每条讲什么", back: backGo, act: "存草稿" })}

    <div class="body">
      <div class="composer">
        <textarea data-bind="D1.3.topic" placeholder="写一个主题系列。比如：磷虾油 10 天，从成分讲到复购">${typed}</textarea>
        <div class="quick">
          ${["磷虾油", "换季免疫", "老客复购"].map((p) => `<span class="chip ${product === p ? "on" : ""}" data-set="D1.3.product=${p}">${p}</span>`).join("")}
        </div>
        <div class="cbot">
          <span class="hint">${typed ? "AI 按你说的排" : "这是示例，可以改成你的说法"}</span>
          <div class="btn ai" data-go="D1.1?c=${toCampaign}" data-label="生成系列">✦ 生成系列</div>
        </div>
      </div>

      ${C.sec("分几个视频", "一个主题拆成几条片子")}
      <div class="chips">
        ${[7, 10, 14].map((n) => `<span class="chip ${days === n ? "on" : ""}" data-set="D1.3.days=${n}">${n} 条</span>`).join("")}
      </div>
      <div class="card plain" style="margin-top:10px">
        <div class="xs" style="line-height:1.7">
          顺序是「先铺垫、再立信任、最后收单」。改条数只砍中间，开头和收尾一直留着——
          收尾那条是团价和复盘，砍掉它，前面几条就变成一直在铺垫、始终不收单。
        </div>
      </div>

      ${C.sec("每条讲什么", "AI 排的 · 可逐条改")}
      <div class="card" style="padding:4px 16px 6px">
        ${topics.map((t, i) => `<div class="kv" style="align-items:flex-start;padding:9px 0">
          <span class="k" style="flex:0 0 52px;font-size:11px;color:var(--text-3);padding-top:8px">第 ${i + 1} 条</span>
          <span style="flex:1;min-width:0">
            <input value="${t}" style="width:100%;border:0;outline:0;background:#F5F7FC;border-radius:9px;padding:7px 9px;font-family:inherit;font-size:12.5px;color:var(--text)" />
          </span>
          <span style="flex:0 0 auto;color:var(--brand);font-size:11.5px;font-weight:600;padding:8px 0 0 8px;cursor:pointer">换</span>
        </div>`).join("")}
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 104px" data-go="${backGo}" data-label="先不做">先不做</div>
      <div class="btn" data-go="D1.1?c=${toCampaign}" data-label="生成系列">生成系列 · ${days} 条视频</div>
    </div>
  </div>`;
};
