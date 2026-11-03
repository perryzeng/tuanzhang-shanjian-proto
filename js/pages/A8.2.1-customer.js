/* A8.2.1 客户档案（V16.4）
   这一页是整套产品里最"能打"的一页 —— 因为它直接把钱说清楚了。

   六个区块，顺序就是团长脑子里的顺序：
   ① 她是谁（怎么来的、什么渠道、什么时候）
   ② 她卡在哪（AI 从行为里推的，不是团长填的）
   ③ 下一步干什么（一句人话的建议）
   ④ 她关心什么
   ⑤ 她做过什么（轨迹）
   ⑥ 第一句怎么说（三条话术，能直接复制）

   分数只出现在标题旁边，不当主角。主角是「怎么聊」。 */

window.PAGES["A8.2.1"].prd = "PRD V16 §3.1 · 客户档案（判断 / 轨迹 / 话术）";
window.PAGES["A8.2.1"].sysEntry = "客户列表点任意一位；对话里的「先跟阿梅」也跳这里";

window.PAGES["A8.2.1"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const u = L.customers.filter((x) => x.id === ctx.u)[0] || L.customers[0];

  const K = {
    view: { ic: "看", cls: "" }, ask: { ic: "问", cls: "ask" },
    cmt: { ic: "聊", cls: "cmt" }, save: { ic: "收", cls: "cmt" },
    share: { ic: "转", cls: "share" }, deal: { ic: "买", cls: "deal" }
  };

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: u.name, sub: "意向 " + u.score + " · " + u.tag, back: "A8.2", act: "标记成交" })}

    <div class="body">
      <div class="v20-me">
        <i class="v20-me-av" style="background:${u.bg}">${u.av}</i>
        <div>
          <b>${u.name}<em>${u.score}</em></b>
          <span>${u.profile}</span>
        </div>
      </div>

      <div class="v20-from" data-go="A8.4.1?c=c1" data-label="看那条作品">
        <span class="v20-from-k">从这条来的</span>
        <div>
          <b>${u.from.c}</b>
          <span>${u.from.ch} · ${u.from.at}</span>
        </div>
        <em>›</em>
      </div>

      <div class="v20-judge">
        <div class="v20-judge-hd">小剪的判断</div>
        <div class="v20-judge-stuck">${u.stuck}</div>
        <p>${u.advice}</p>
      </div>

      ${C.sec("她关心什么")}
      <div class="v20-cares">
        ${u.cares.map((c) => `<span>${c}</span>`).join("")}
      </div>

      ${C.sec("她做过什么")}
      <div class="v19-tl" style="margin-top:0">
        ${u.history.map((h) => {
          const k = K[h.k] || K.view;
          return `<div class="v19-tl-i ${k.cls}">
            <span class="v19-tl-t">${h.t}</span>
            <i class="v19-tl-d">${k.ic}</i>
            <div class="v19-tl-tx"><span style="margin-top:0">${h.a}</span></div>
          </div>`;
        }).join("")}
      </div>

      <div class="v20-bought">
        <span>买过什么</span>
        <b>${u.bought}</b>
      </div>

      ${C.sec("怎么开口", u.scripts.length + " 句现成的")}
      ${u.scripts.map((s, i) => `<div class="v20-say ${i === 0 ? "best" : ""}">
        <div class="v20-say-hd">${i === 0 ? "最建议这句" : "备选 " + i}</div>
        <p>${s}</p>
        <div class="v20-say-ft"><span>复制</span></div>
      </div>`).join("")}

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        话术是按她的行为生成的，不是群发模板。发之前按你的说话习惯改两个字更像你。
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" data-go="A8.4.1?c=c1" data-label="看她看过的"><span>▭</span><b>那条</b></div>
      <div class="btn" data-go="S1?c=dm&v=v_pending_1" data-label="发消息">发消息</div>
    </div>
  </div>`;
};
