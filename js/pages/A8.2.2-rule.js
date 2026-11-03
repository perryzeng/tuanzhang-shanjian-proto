/* A8.2.2 客户规则（V19）
   从客户页右上角「规则」进来。

   这一页要回答两件事，而且顺序不能反：
   ① **谁值得我花时间** —— 四档是怎么算出来的（可读，也能改阈值）
   ② **什么时候来提醒我** —— 满足什么条件才把人推进「待跟进」

   为什么第二件事比第一件重要：
   规则定得松，128 个人全进待跟进，团长第二天就不看了；
   定得紧，一天只提醒一个人，又漏掉真机会。
   所以这一页的核心控件是「跟进范围」那个三选一，不是那堆阈值。

   改完立刻生效，下面那行「按这套今天会提醒你 N 个」是实时算的 —— 
   调完马上能看到后果，不用回客户页对。 */

window.PAGES["A8.2.2"].prd = "PRD V19 §3.1 · 客户规则（分层判定 / 跟进触发 / 打扰控制）";
window.PAGES["A8.2.2"].sysEntry = "客户页右上角「规则」";

window.PAGES["A8.2.2"].render = function (ctx) {
  const C = window.C, L = window.LIB;

  const scope = ctx.scope || "keypot";
  const nv = Math.max(1, Number(ctx.nv || 2));      // 访问几次算来过
  const ns = Math.max(5, Number(ctx.ns || 30));     // 停留几秒算看过
  const nd = Math.max(1, Number(ctx.nd || 7));      // 几天没来算凉
  const cap = Math.max(1, Number(ctx.cap || 8));    // 每天最多提醒几个
  const quiet = ctx.quiet !== "0";                  // 夜间不打扰

  const all = L.customers;
  const by = (t) => all.filter((u) => u.tier === t).length;

  /* 三档跟进范围各自会提醒多少人 —— 这就是"把规则调松会怎样"的即时反馈 */
  const WHO = [
    ["key", "只跟重点客户", "问过价或买过的人。最省时间，也最容易漏掉还在观望的", by("key")],
    ["keypot", "重点 + 潜客", "再加有互动但没问价的。默认档，漏得少也不至于太吵", by("key") + by("pot")],
    ["any", "只要有互动就跟", "连只点过赞、收藏过的也算。适合刚起号、人还不多的时候", by("key") + by("pot") + by("gen")]
  ];
  const hit = (WHO.filter((x) => x[0] === scope)[0] || WHO[1])[3];
  const finalN = Math.min(hit, cap);

  const step = (k, v) => `<div class="v30-ctl">
      <i data-set="A8.2.2.${k}=${v - 1}" data-label="减">−</i>
      <b>${v}</b>
      <i data-set="A8.2.2.${k}=${v + 1}" data-label="加">+</i>
    </div>`;

  const TIERS = [
    ["key", "重点跟进", `问过价或买过，而且访问 ≥ ${nv} 次`],
    ["pot", "潜在客户", "有互动（点赞 / 收藏 / 评论 / 转发），但没问过价"],
    ["gen", "一般客户", `访问过、停留 ≥ ${ns} 秒，但零互动`],
    ["new", "新客", "刚进来 3 天内，只访问过 1 次"]
  ];

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "客户规则", sub: "改完立刻生效", back: "A8.2" })}

    <div class="body">
      <!-- ① 谁进待跟进：这一页最该被调的东西 -->
      <div class="v30-blk">
        <div class="v30-hd">谁进「待跟进」<em>定松了吵人，定紧了漏人</em></div>
        ${WHO.map(([k, t, d, n]) => `<div class="v30-opt ${scope === k ? "on" : ""}" data-set="A8.2.2.scope=${k}" data-label="${t}">
          <i class="rw"></i>
          <div><b>${t}<em>约 ${n} 人 / 天</em></b><span>${d}</span></div>
        </div>`).join("")}
        <div class="v30-live">
          按这套，今天会提醒你 <b>${finalN}</b> 个人
          ${hit > cap ? `<em>（符合的有 ${hit} 个，受每天上限 ${cap} 个限制）</em>` : ""}
        </div>
      </div>

      <!-- ② 阈值 -->
      <div class="v30-blk">
        <div class="v30-hd">判定条件<em>点数字旁边的加减</em></div>
        <div class="v30-row">
          <div class="tx"><b>访问次数</b><span>达到这个次数才算「来过」，不是刷到就算</span></div>
          ${step("nv", nv)}
        </div>
        <div class="v30-row">
          <div class="tx"><b>单次停留</b><span>秒。低于这个数，说明他其实没在看</span></div>
          ${step("ns", ns)}
        </div>
        <div class="v30-row">
          <div class="tx"><b>几天算凉</b><span>超过这么多天没来，就不再占待跟进的位置</span></div>
          ${step("nd", nd)}
        </div>
      </div>

      <!-- ③ 四档怎么算出来的：只读，让人知道系统凭什么这么分 -->
      <div class="v30-blk">
        <div class="v30-hd">四档怎么分<em>只看行为，不看你说什么</em></div>
        ${TIERS.map(([k, n, d]) => `<div class="v30-tier t-${k}">
          <i></i>
          <div><b>${n}（${by(k)}）</b><span>${d}</span></div>
        </div>`).join("")}
        <div class="v30-note">分档只用来排序。真正决定"今天跟谁"的，是上面那个跟进范围。</div>
      </div>

      <!-- ④ 打扰控制 -->
      <div class="v30-blk">
        <div class="v30-hd">别把自己吵死<em>提醒多了等于没有提醒</em></div>
        <div class="v30-row">
          <div class="tx"><b>每天最多提醒</b><span>超出的自动排到明天，不会丢</span></div>
          ${step("cap", cap)}
        </div>
        <div class="v30-row">
          <div class="tx"><b>夜间不打扰</b><span>22:00–08:00 不推跟进提醒</span></div>
          <span class="v30-sw ${quiet ? "on" : ""}" data-set="A8.2.2.quiet=${quiet ? "0" : "1"}" data-label="夜间不打扰"><i></i></span>
        </div>
      </div>

      <div class="xs" style="margin:12px 2px 6px;line-height:1.7">
        规则改的是「系统什么时候来叫你」，不改变客户本身的分档。<br>
        分档靠她自己的动作算，你改不动 —— 这才是它可信的原因。
      </div>
    </div>
  </div>`;
};
