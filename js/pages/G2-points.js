window.PAGES["G2"].prd = "PRD §6.23 · 积分充值（1 积分 = 1 分钱；20/50/100/200 阶梯）";

/* 积分：所有功能按积分消耗，1 积分 = 1 分钱；充值分 20/50/100/200 四档，
   充得越多送得越多（50 送 200、100 送 1000、200 送 3000）。 */
window.PAGES["G2"].render = function (ctx) {
  const C = window.C, DATA = window.DATA;
  const p = DATA.points || { balance: 1260, monthUse: 320 };
  const plans = DATA.pointPlans || [];
  const sel = plans.filter((x) => x.id === ctx.plan)[0] || plans[2] || plans[0] || { id: "", pay: 0, points: 0 };
  const charged = parseInt(ctx.charged || "0", 10) || 0;
  const bal = p.balance + charged;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "积分充值", back: "G1", act: "明细" })}

    <div class="body">
      ${charged ? `<div class="okbar">充值成功 +${charged} 积分（演示）</div>` : ""}

      <div class="hero" style="margin-top:12px">
        <div class="row"><span class="lb">当前积分</span>
          <span style="margin-left:auto;font-size:11px;color:rgba(255,255,255,.7)">1 积分 = 1 分钱</span></div>
        <div class="num">${bal}<small>积分</small></div>
        <div class="sub">约 ¥${(bal / 100).toFixed(2)} · 本月已用 ${p.monthUse} 积分</div>
      </div>

      <div class="feedhd">选择充值档位</div>
      <div class="plans two">
        ${plans.map((x) => `<div class="plan${x.id === sel.id ? " on" : ""}" data-set="G2.plan=${x.id}">
          <b>¥${x.pay}</b><span>${x.points} 积分</span>${x.tag ? `<em>${x.tag}</em>` : ""}</div>`).join("")}
      </div>

      <div class="note" style="margin:12px 2px 0;line-height:1.7">充得越多越划算：50 送 200、100 送 1000、200 送 3000。积分用于生成视频、导出、AI 写稿等，按次扣。</div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-set="G2.charged=${sel.points}" data-label="立即充值">立即充值 ¥${sel.pay} · 到账 ${sel.points}</div>
    </div>
  </div>`;
};
