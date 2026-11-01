window.PAGES["D1.3"].prd = "PRD §6.13 · 新建系列（做什么 / 几天 / 每天几趴 → 自动排每天主题）";

/* 建系列和写脚本是同一个动作，只是"颗粒度"不同：
   写脚本是"我要讲什么"，建系列是"我要做一场什么"。
   所以这一页照抄写脚本的交互：一句话说清 + 几个可选项 + AI 排好的结果。
   可选项就三个：做什么品、分几天、每天几趴。剩下的（每天选题、每天骨架）由 AI 排，
   人只做删改——从空白想 10 个选题，比改 10 个现成的难十倍。 */
window.PAGES["D1.3"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const product = ctx.product || "磷虾油";
  const days = +(ctx.days || 10);
  const parts = +(ctx.parts || 5);
  const typed = ctx.topic || "";

  const topics = D.planTopics(product, days);
  const skel = D.partSkeleton(parts);
  const toCampaign = { "磷虾油": "cp_1", "换季免疫": "cp_2", "老客复购": "cp_3" }[product] || "cp_1";

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "新建系列", sub: "说清做什么，剩下的 AI 排", back: "D1", act: "存草稿" })}

    <div class="body">
      <div class="composer">
        <textarea data-bind="D1.3.topic" placeholder="一句话说清要做什么系列。比如：磷虾油 10 天，从成分讲到复购">${typed}</textarea>
        <div class="quick">
          ${["磷虾油", "换季免疫", "老客复购"].map((p) => `<span class="chip ${product === p ? "on" : ""}" data-set="D1.3.product=${p}">${p}</span>`).join("")}
        </div>
        <div class="cbot">
          <span class="hint">${typed ? "AI 按你说的排" : "这是示例，可以改成你的说法"}</span>
          <div class="btn ai" data-go="D1.1?c=${toCampaign}" data-label="生成日程">✦ 生成日程</div>
        </div>
      </div>

      ${C.sec("分几天")}
      <div class="chips">
        ${[7, 10, 14].map((n) => `<span class="chip ${days === n ? "on" : ""}" data-set="D1.3.days=${n}">${n} 天</span>`).join("")}
      </div>

      ${C.sec("每天几趴")}
      <div class="chips">
        ${[3, 4, 5].map((n) => `<span class="chip ${parts === n ? "on" : ""}" data-set="D1.3.parts=${n}">${n} 趴</span>`).join("")}
      </div>
      <div class="card plain" style="margin-top:10px">
        <div class="xs" style="line-height:1.6;color:var(--text-2)">
          <b style="color:var(--text)">一天的骨架：</b>${skel.join(" › ")}
        </div>
        <div class="xs" style="margin-top:5px">趴 = 一天视频里的分段：一段台词配一个画面槽。3 趴最省事，5 趴最完整。</div>
      </div>

      ${C.sec("每天讲什么", "AI 排的 · 可逐条改")}
      <div class="card" style="padding:4px 16px 6px">
        ${topics.map((t, i) => `<div class="kv" style="align-items:flex-start;padding:10px 0">
          <span class="k" style="flex:0 0 46px;font-size:11.5px;color:var(--text-3);padding-top:7px">Day ${i + 1}</span>
          <span style="flex:1;min-width:0">
            <input value="${t}" style="width:100%;border:0;outline:0;background:#F5F7FC;border-radius:9px;padding:7px 9px;font-family:inherit;font-size:12.5px;color:var(--text)" />
          </span>
          <span style="flex:0 0 auto;color:var(--brand);font-size:11.5px;font-weight:600;padding:8px 0 0 8px;cursor:pointer">换</span>
        </div>`).join("")}
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.75">
          排的顺序是「先铺垫、再立信任、最后收单」：砍天数只砍中间，开头和收尾一直留着。
          生成之后，每天进去只换中间那几趴，开头立信任和结尾 CTA 每天复用。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 104px" data-go="D1" data-label="先不做">先不做</div>
      <div class="btn" data-go="D1.1?c=${toCampaign}" data-label="生成日程">生成日程 · ${days} 天 × ${parts} 趴</div>
    </div>
  </div>`;
};
