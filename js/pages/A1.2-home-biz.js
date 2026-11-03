/* A1.2 首页 · 经营版（V14.1）
   前提修正：**本产品没有商品模块、没有交易模块**，成交在微信里完成。
   所以首页不再出现"商品 / 价格 / SKU"，只出现「这一波在推什么」——
   团长自己起的一段内容主线，系统当标签用。

   一屏五个卡点，顺序就是团长的动作顺序：
   昨天谁动了 → 这一波讲到哪 → 待剪 → 待分发 → 该跟进
   三个"待"（剪 / 发 / 跟）是每天真正的漏损，缺一环这一波就白做。

   数据全部来自 js/biz.js，页面不写死。 */

window.PAGES["A1.2"].prd = "PRD V14 §1 · 首页（经营版）";
window.PAGES["A1.2"].sysEntry = "登录默认落地这一版；旧版 A1 保留在页面树里做对照";

window.PAGES["A1.2"].render = function () {
  const C = window.C, B = window.BIZ, IMG = window.IMG;
  const w = B.wave, y = B.yesterday, L = B.leads;
  const nowPhase = w.phases.filter((p) => p.now)[0] || w.phases[0];

  /* 阶段条：这一波 8 条内容，已发 4 条，第 5 条是今天要做的。
     不画百分比 —— 团长关心的是「还差哪几环」，不是「完成了 50%」。 */
  const cells = [];
  w.phases.forEach((ph) => {
    for (let i = 0; i < ph.total; i++) {
      const st = i < ph.done ? "done" : (ph.now ? "now" : "");
      cells.push(`<i class="${st}"></i>`);
    }
  });

  const leadRow = (u) => `<div class="v14-ld" data-go="G3.1?u=${u.id}" data-label="跟进 ${u.name}">
      <div class="v14-ld-av" style="background:${u.bg}">${u.av}</div>
      <div class="v14-ld-tx">
        <div class="v14-ld-n"><b>${u.name}</b><em>${u.score}</em><span class="v14-ld-from">${u.from}</span></div>
        <span>${u.acts}</span>
      </div>
      <div class="v14-ld-go">私信</div>
    </div>`;

  return `<div class="app">
    ${C.sb()}

    <div class="hrow">
      <div class="av">${B.me.av}</div>
      <div style="flex:1;min-width:0">
        <div class="hi">下午好，${B.me.name}</div>
        <div class="hs">${B.me.ip}</div>
      </div>
      <div class="v14-aibtn" data-go="A2?q=biz" data-label="问U剪">✦</div>
      <div class="bell" style="margin-left:8px" data-go="E5" data-label="通知中心">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5F5E5A" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8.6a6 6 0 1 0-12 0c0 6.4-2.4 8.4-2.4 8.4h16.8S18 15 18 8.6"/><path d="M13.7 20.5a2 2 0 0 1-3.4 0"/>
        </svg>
        <b>6</b>
      </div>
    </div>

    <div class="body">

      <div class="v14-bcast">
        <div class="v14-bc-k"><i class="v14-bc-dot"></i>昨天 · 你的朋友圈</div>
        <div class="v14-bc-t">${y.sent} 条片，<b>${y.visitors}</b> 位访客，<b>${y.repeat}</b> 人看了两遍以上</div>
        <div class="v14-bc-grid">
          <div><b>${y.visitors}</b><span>访客</span></div>
          <div><b>${y.repeat}</b><span>看 2 次以上</span></div>
          <div><b>${y.asked}</b><span>问过价</span></div>
          <div><b>${y.deals}</b><span>成交</span></div>
        </div>
        <div class="v14-bc-cta" data-go="G3.1?u=${y.topLead.id}" data-label="跟进 ${y.topLead.name}">
          先跟${y.topLead.name} —— ${y.topLead.why}<span>›</span>
        </div>
      </div>

      <div class="v14-prod">
        <div class="v14-pc-h">
          <div class="v14-pc-ic">波</div>
          <div class="v14-pc-tt">
            <b>${w.name}</b>
            <span>${w.note} · 第 ${w.day} 天 · 距开团 ${w.openIn} 天</span>
          </div>
          <span class="tag o">${nowPhase.short}</span>
        </div>
        <div class="v14-pc-bar">${cells.join("")}</div>
        <div class="v14-pc-legend">
          <span>已发 ${w.sent} / ${w.plan} 条</span>
          <span>触达 ${w.reached} 人 · 高潜 ${w.leads} 人</span>
        </div>
        <div class="v14-pc-act">
          <div class="v14-pc-b1" data-go="B1?w=${w.id}&ep=${w.today.ep}" data-label="剪第 ${w.today.ep} 条">剪第 ${w.today.ep} 条</div>
          <div class="v14-pc-b2" data-go="G3.1?w=${w.id}" data-label="看谁在关注">看谁在关注</div>
        </div>
      </div>

      <div class="sec-h"><span class="h2">待剪 2 条</span>
        <span class="more" data-go="E2" data-label="素材库" style="color:var(--brand-ink);font-weight:600">素材库 ›</span>
      </div>

      <div class="v14-today">
        <div class="v14-tc-img">
          <img src="${IMG.still}" alt="">
          <span class="v14-tc-ep">第 ${w.today.ep} 集</span>
        </div>
        <div class="v14-tc-tx">
          <b>${w.today.name}</b>
          <span class="v14-tc-a">${w.today.angle}</span>
          <div class="v14-tc-q">「${w.today.line}」</div>
          <div class="v14-tc-m">${w.today.dur} · 今天该出</div>
        </div>
      </div>
      <div class="v14-tc-why">✦ ${w.today.why}</div>
      <div class="v14-tc-go" data-go="B1?w=${w.id}&ep=${w.today.ep}" data-label="开始剪">开始剪 · 用这条口径出片</div>

      <div class="v14-draft" data-go="${w.draft.go}" data-label="接着做草稿">
        <span class="v14-df-k">草稿</span>
        <div class="v14-df-tx">
          <b>第 ${w.draft.ep} 集 · ${w.draft.name}</b>
          <span>${w.draft.stuck} · ${w.draft.at}</span>
        </div>
        <span class="v14-df-go">接着做</span>
      </div>

      ${C.sec("待分发 " + B.pending.length + " 条", "剪完没发，等于没剪")}
      ${B.pending.map((v) => `<div class="v14-pend">
        <img class="v14-pd-img" src="${v.img}" alt="">
        <div class="v14-pd-tx">
          <b>${v.title}</b>
          <span>${v.at} · ${v.dur}</span>
          <span class="v14-pd-warn">已放 ${v.hours} 小时，还没发出去</span>
        </div>
        <div class="v14-pd-go" data-go="S1?v=${v.id}" data-label="去发">去发</div>
      </div>`).join("")}

      ${C.sec("今天该跟进 " + Math.min(3, L.length) + " 人", "全部 " + w.leads + " 人 ›", "G3.1")}
      ${L.slice(0, 3).map(leadRow).join("")}

      ${C.sec("团队今天", "进团队 ›", "E3")}
      <div class="v14-tv">
        ${B.team.map((t) => `<div class="v14-tvc" data-go="${t.go}" data-label="剪同款 ${t.who}">
          <div class="v14-tvi">
            <img src="${t.img}" alt="">
            <span class="v14-tva">${t.av}</span>
          </div>
          <b>${t.note}</b>
          <span>${t.who}：${t.title}</span>
        </div>`).join("")}
      </div>

      <div class="v14-todo" data-go="E4" data-label="团队待办">
        <span class="v14-td-k">团队待办 ${B.todo.length}</span>
        <span class="v14-td-t">${B.todo.map((x) => x.tx).join(" / ")}</span>
        <span class="v14-td-g">›</span>
      </div>

      <div class="xs" style="text-align:center;margin:16px 0 4px">
        数据来自落地页回传 · 成交由你自己标注 · 更新于 ${B.now.slice(11, 16)}
      </div>
    </div>

    ${C.tab("A1.2")}
  </div>`;
};
