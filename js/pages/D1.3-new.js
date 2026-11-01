window.PAGES["D1.3"].prd = "PRD §6.13 · 新建主题系列（写一个主题 → 选分几条 → 生成后列出每条讲什么）";

/* 建系列和写脚本是同一个动作，只是"颗粒度"不同：
   写脚本是"我要讲什么"，建系列是"我要做一场什么"。
   所以这一页照抄写脚本的交互：一句话说清 + 一个必选项 + AI 排好的结果。

   **分几条视频是必选项，且必须在生成按钮前面**：
   上一版把它放在按钮下面、又默认选了 10 条，等于"没选也能生成"——
   用户根本不知道这个数从哪来的。现在不选就是空着，按钮是灰的、点不动；
   选了才变蓝，点了 AI 才开始排。

   **列表只在生成之后出现**：没点生成之前，页面不应该先摆出十条选题。
   那会让人以为"AI 已经排好了"，也就不会去点那个按钮——按钮看着像多余的。

   底部不再有操作栏：这一页的动作只有"生成"一个，按钮跟着选项走，
   不需要在屏幕最下面再钉一个重复的。生成完想看就去 D1.1。 */
window.PAGES["D1.3"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const product = ctx.product || "磷虾油";
  const typed = ctx.topic || "";
  const pick = ctx.days || "";               // "" 未选 | "ai" | "2" | "3" | "5" | "custom"
  const gen = ctx.gen === "1" && !!pick;     // 生成过才列条
  /* 从创作页进来的（不是从 D1 列表），返回就回创作页，别把人扔进他不认识的地方 */
  const backGo = ctx.from === "B1" ? "B1" : "D1";

  /* 「AI 默认」= 从主题里读一个数（"磷虾油 10 天" → 10），读不出就 5 条（跟选项里的 5 对齐）。
     读出来的数要落在合理区间（2~21），否则"100 天"这种会把页撑爆。 */
  const aiN = (function () {
    const m = String(typed).match(/(\d+)\s*(天|条|集|期)/);
    const v = m ? +m[1] : 5;
    return v >= 2 && v <= 21 ? v : 5;
  })();
  /* 自定义：给一个默认值 6，用户输入后就按他写的来，仍夹在 2~21 */
  const cus = Math.max(2, Math.min(21, +(ctx.custom || 0) || 6));
  const n = pick === "ai" ? aiN : pick === "custom" ? cus : (+pick || 0);

  const topics = gen ? D.planTopics(product, n) : [];
  const toCampaign = { "磷虾油": "cp_1", "换季免疫": "cp_2", "老客复购": "cp_3" }[product] || "cp_1";

  /* 按钮三态：没选（灰、点不动）/ 选了（蓝、可点）/ 生成过了（蓝、去排日程）。
     灰态也写着"生成主题系列"，只是点不动——按钮身份要一致，
     否则用户会以为"先选分几个视频"是另一个动作。
     生成过之后这颗按钮变成"去排日程"：选条数 → 生成 → 确认，一条直线走完；
     "重新排"降级成小标题右侧的一个小链接，它是兜底动作，不该占主位。 */
  const cta = !pick
    ? `<div class="btn gray">✦ 生成主题系列</div>`
    : gen
      ? `<div class="btn" data-go="D1.1?c=${toCampaign}&days=${n}" data-label="去排日程">✓ 就用这 ${n} 条 · 去排日程</div>`
      : `<div class="btn ai" data-set="D1.3.gen=1" data-label="生成主题系列">✦ 生成主题系列 · ${n} 条</div>`;

  const chip = (k, tx) =>
    `<span class="chip ${pick === k ? "on" : ""}" data-set="D1.3.days=${k}&D1.3.gen=">${tx}</span>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "新建主题系列", sub: "写一个主题，AI 排每条讲什么", back: backGo, act: "存草稿" })}

    <div class="body">
      <div class="composer">
        <textarea data-bind="D1.3.topic" placeholder="写一个主题系列。比如：磷虾油 10 天，从成分讲到复购">${typed}</textarea>
        <div class="quick">
          ${["磷虾油", "换季免疫", "老客复购"].map((p) =>
            `<span class="chip ${product === p ? "on" : ""}" data-set="D1.3.product=${p}&D1.3.gen=">${p}</span>`).join("")}
        </div>
        <div class="cbot"><span class="hint">${typed ? "AI 按你说的排" : "这是示例，可以改成你的说法"}</span></div>
      </div>

      ${C.sec("分几个视频", pick
        ? (pick === "ai" ? "AI 按主题定：约 " + n + " 条" : "一个主题拆成 " + n + " 条片子")
        : "必选 · 决定 AI 排几条")}
      <div class="chips tight">
        ${chip("ai", "AI 默认")}${chip("2", "2 条")}${chip("3", "3 条")}${chip("5", "5 条")}${chip("custom", "自定义")}
      </div>
      <!-- 自定义不弹窗、不换页：点开就在下面长出一个输入框，填完直接生效。
           条数写"条视频"而不是"条"——这一页前面刚说过"分几个视频"，这里不能又省略掉宾语。 -->
      ${pick === "custom" ? `<div class="cnumbox">
        <input type="number" data-bind="D1.3.custom" data-live min="2" max="21"
               value="${ctx.custom != null ? ctx.custom : 6}" placeholder="6" />
        <span>条视频 · 可填 2 ~ 21</span>
      </div>` : ""}

      <div style="margin-top:12px">${cta}</div>

      ${!gen ? `<div class="card plain" style="margin-top:11px">
        <div class="xs" style="line-height:1.7">
          AI 按「先铺垫、再立信任、最后收单」排。改条数只砍中间——收尾那条是团价和复盘，
          砍掉它，前面几条就一直在铺垫、始终不收单。
        </div>
      </div>` : ""}

      ${gen ? `
        <div class="sec-h"><span class="h2">每条讲什么</span>
          <span class="more" data-set="D1.3.gen=">↺ 重排</span></div>
        <div class="card" style="padding:4px 16px 6px">
          ${topics.map((t, i) => `<div class="kv" style="align-items:flex-start;padding:9px 0">
            <span class="k" style="flex:0 0 52px;font-size:11px;color:var(--text-3);padding-top:8px">第 ${i + 1} 条</span>
            <span style="flex:1;min-width:0">
              <input value="${t}" style="width:100%;border:0;outline:0;background:#F5F7FC;border-radius:9px;padding:7px 9px;font-family:inherit;font-size:12.5px;color:var(--text)" />
            </span>
            <span style="flex:0 0 auto;color:var(--brand);font-size:11.5px;font-weight:600;padding:8px 0 0 8px;cursor:pointer">换</span>
          </div>`).join("")}
        </div>` : ""}
    </div>
  </div>`;
};
