window.PAGES["D1.3"].prd = "PRD §6.13 · 新建战役（团长自建节奏）";

/* 总部下发的战役是「跟着走」；团长自建的是「自己排节奏」。
   自建页只让人做两个决定：打几天、每天讲什么。选题先由 AI 铺满，人只做删改——
   从空白开始想 10 个选题，比改 10 个现成的难十倍。 */
window.PAGES["D1.3"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const product = ctx.product || "磷虾油";
  const total = +(ctx.total || 10);
  const seeds = D.topicSeeds(product);
  const topics = Array.from({ length: total }, (_, i) => seeds[i % seeds.length]);

  const field = (k, v) =>
    `<div class="kv"><span class="k">${k}</span><span class="v" style="font-size:13px">${v}</span></div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "新建战役", sub: "排一个自己的节奏", back: "D1", act: "存草稿" })}

    <div class="body">
      <div class="card" style="padding:14px 16px">
        <div class="xs" style="font-weight:700;color:var(--text-3)">战役名</div>
        <input value="磷虾油 10 天战役 · 我的版本" style="width:100%;border:0;outline:0;background:transparent;font-family:inherit;font-size:16px;font-weight:700;color:var(--text);padding:7px 0 2px" />
        <div class="divider" style="margin:8px 0"></div>
        ${field("开始日期", "11-05（周三）")}
        ${field("每天提醒", "20:00 · 到点推送选题和脚本")}
      </div>

      ${C.sec("打哪个品")}
      <div class="chips">
        ${["磷虾油", "换季免疫", "老客复购"].map((p) => `<span class="chip ${product === p ? "on" : ""}" data-set="D1.3.product=${p}">${p}</span>`).join("")}
      </div>

      ${C.sec("打几天")}
      <div class="chips">
        ${[7, 10, 14].map((n) => `<span class="chip ${total === n ? "on" : ""}" data-set="D1.3.total=${n}">${n} 天</span>`).join("")}
        <span class="chip">自定义</span>
      </div>

      ${C.sec("每天讲什么", "AI 铺的，可逐条改")}
      <div class="card" style="padding:4px 16px 6px">
        ${topics.map((t, i) => `<div class="kv" style="align-items:flex-start;padding:11px 0">
          <span class="k" style="flex:0 0 46px;font-size:11.5px;color:var(--text-3);padding-top:5px">Day ${i + 1}</span>
          <span style="flex:1;min-width:0">
            <input value="${t}" style="width:100%;border:0;outline:0;background:#F5F7FC;border-radius:9px;padding:7px 9px;font-family:inherit;font-size:12.5px;color:var(--text)" />
          </span>
          <span style="flex:0 0 auto;color:var(--brand);font-size:11.5px;font-weight:600;padding:7px 0 0 8px;cursor:pointer">换</span>
        </div>`).join("")}
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">
          前 3 天铺垫、中段立信任、最后 2 天收单——AI 按这个节奏铺的选题。
          改完直接生成日程，每天进去只需要换成自己的话。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 104px" data-go="D1" data-label="先不做">先不做</div>
      <div class="btn" data-go="D1.1?c=cp_1" data-label="生成日程">生成日程 · ${total} 天</div>
    </div>
  </div>`;
};
