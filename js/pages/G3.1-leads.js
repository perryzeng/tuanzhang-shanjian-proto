/* G3.1 客户（V14 重写）
   原来叫「高潜工作台」，藏在「我的」下面第三层，从成品详情才进得来。
   现在它是底部一级 tab「客」——因为这个页面直接对应 GMV，
   它比「剪同款」更该被看见。

   页面回答三个问题：
   ① 今天先跟谁（按意向分排，不是按时间排）
   ② 她为什么值得跟（她在你内容里的全部动作，一条时间线）
   ③ 第一句话说什么（按她的行为生成，不是通用话术）

   意向分算法保留原来的口径说明，不藏在设置里。 */

window.PAGES["G3.1"].prd = "PRD V14 §5 · 客户（意向分 / 行为时间线 / 跟进）";
window.PAGES["G3.1"].sysEntry = "底部一级 tab「客」；首页播报与「今天该跟进」都跳这里";

window.PAGES["G3.1"].render = function (ctx) {
  const C = window.C, B = window.BIZ;
  const L = B.leads;
  const u = L.filter((x) => x.id === ctx.u)[0];
  const filter = ctx.f || "all";

  const FILTERS = [
    { k: "all", tx: "全部 " + L.length },
    { k: "hot", tx: "看 2 次以上 " + L.filter((x) => x.score >= 60).length },
    { k: "asked", tx: "问过价 2" },
    { k: "cart", tx: "点过购物车 1" }
  ];

  let list = L;
  if (filter === "hot") list = L.filter((x) => x.score >= 60);
  if (filter === "asked") list = L.filter((x) => x.tags.indexOf("问过价") >= 0);
  if (filter === "cart") list = L.filter((x) => x.tags.indexOf("点过购物车") >= 0);

  const row = (x) => `<div class="v14-ld" data-set="G3.1.u=${x.id}">
      <div class="v14-ld-av" style="background:${x.bg}">${x.av}</div>
      <div class="v14-ld-tx">
        <div class="v14-ld-n"><b>${x.name}</b><em class="${x.score >= 80 ? "r" : ""}">${x.score}</em><span class="v14-ld-from">${x.from} · ${x.last}</span></div>
        <span>${x.acts}</span>
      </div>
      <div class="v14-ld-go">跟进</div>
    </div>`;

  /* 跟进抽屉：点谁就展开谁。不跳新页面 ——
     团长在这种场景下的动作是"看完就发消息"，中间多一次跳转就断了。 */
  const drawer = !u ? "" : `<div class="v14-dw-mask" data-set="G3.1.u=">
    <div class="v14-dw">
      <div class="v14-dw-hd">
        <div class="v14-ld-av" style="background:${u.bg};width:44px;height:44px;flex:0 0 44px;font-size:15px">${u.av}</div>
        <div style="flex:1;min-width:0">
          <div class="v14-dw-n">${u.name}<em class="${u.score >= 80 ? "r" : ""}">意向 ${u.score}</em></div>
          <div class="v14-dw-s">${u.from} · ${u.last} · 来自「${B.wave.name}」那条</div>
        </div>
        <span class="v14-dw-x" data-set="G3.1.u=">✕</span>
      </div>

      <div class="v14-dw-tl">
        <div class="v14-tl-i"><i></i><span>点开了你朋友圈那条「${B.wave.today.name}」</span><b>11:20</b></div>
        <div class="v14-tl-i"><i></i><span>看了 1 分 12 秒，看到第 3 个卖点</span><b>11:21</b></div>
        <div class="v14-tl-i on"><i></i><span>${u.acts.split("·").pop().trim()}</span><b>11:22</b></div>
        <div class="v14-tl-i dim"><i></i><span>还没下单</span><b>—</b></div>
      </div>

      <div class="v14-dw-tip">✦ ${u.hook}</div>

      <div class="v14-dw-msg">
        <b>建议这么开口</b>
        <p>${u.call}，看你点开过${B.wave.name}那条，<br>是不是在犹豫要不要给家里买？<br>我把吃法和体检单整理成一页了，你先看看，不着急。</p>
      </div>

      <div class="v14-dw-act">
        <div class="v14-dw-b1" data-go="S1?c=dm&v=v_pending_1" data-label="去私信">去私信她</div>
        <div class="v14-dw-b2">标记已成交</div>
      </div>
      <div class="v14-dw-note">发了什么、她回没回，都会记在这条客户档案上；团队里也能看到谁在跟。</div>
    </div>
  </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "客户", sub: "点谁都能看到她在你内容里的全部动作", back: "A1.2", act: "规则" })}

    <div class="body">
      <div class="hero">
        <div class="lb">今天值得跟进</div>
        <div class="num">3<small>人</small></div>
        <div class="sub">本月累计 ${L.length + 22} 位潜在 · 已成交 ${B.wave.deals} 单 · 昨天新增 6 位</div>
      </div>

      <div class="chips" style="margin:14px 0 12px">
        ${FILTERS.map((f) => `<span class="chip ${f.k === filter ? "on" : ""}" data-set="G3.1.f=${f.k}">${f.tx}</span>`).join("")}
      </div>

      ${list.length ? list.map(row).join("") : `<div class="card plain" style="padding:24px;text-align:center"><div class="xs">这一档暂时没有人</div></div>`}

      ${C.sec("意向分怎么算的")}
      <div class="card" style="padding:14px">
        <div class="kv" style="padding-top:0"><span class="k">看了几次</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 30%</span></div>
        <div class="kv"><span class="k">停留时长</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 30%</span></div>
        <div class="kv"><span class="k">看到第几个卖点</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 20%</span></div>
        <div class="kv" style="padding-bottom:0"><span class="k">互动（赞 / 评 / 点购物车）</span><span class="v" style="font-size:12px;color:var(--text-3)">权重 20%</span></div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">
          只有看满 15 秒的人才算「访客」。数据来自你分享出去的落地页回传，不含任何平台隐私数据。
        </div>
      </div>
    </div>

    ${drawer}
    ${C.tab("G3.1")}
  </div>`;
};
