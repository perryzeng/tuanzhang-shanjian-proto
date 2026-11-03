/* A8.3.1 组员动态（V21）
   从「榜单」点头像进来。

   这个页面只有一个前提：**看不看得到，取决于他自己开没开。**
   排名、发布数、拓客数都是组里的公共信息，谁都能看；
   但"他几点在干什么"是行为轨迹，属于私人 —— 所以要有开关，
   而且关掉之后不能做成"加载失败"，得明明白白告诉他为什么看不到。

   为什么值得给一个人单独一页：
   小敏这周第一，团长想知道"她到底做了什么不一样" ——
   看她什么时候交片、什么时候跟客户、问了什么问题。
   这比一个「8 条」的数字有用得多。 */

window.PAGES["A8.3.1"].prd = "PRD V21 §4.1 · 组员动态（时间轴 / 隐私开关）";
window.PAGES["A8.3.1"].sysEntry = "小组 → 榜单 → 点头像";

window.PAGES["A8.3.1"].render = function (ctx) {
  const C = window.C, T = window.LIB.team;
  const m = T.crew.filter((x) => x.id === ctx.m)[0] || T.crew[0];

  /* 自己的公开状态以「我的 → 隐私」里选的为准，别让同一件事在两页显示两个答案。
     别人的用名册里写死的 open。 */
  const myPriv = (window.STATE["A6.1"] || {}).priv || "open";
  const opened = m.me ? myPriv !== "off" : m.open;

  const KIND = {
    post: { ic: "发", cls: "" },
    done: { ic: "交", cls: "" },
    praise: { ic: "赞", cls: "praise" },
    lead: { ic: "客", cls: "lead" },
    task: { ic: "领", cls: "" },
    ask: { ic: "问", cls: "" },
    notice: { ic: "告", cls: "" },
    join: { ic: "新", cls: "" }
  };

  const head = `<div class="v31-mh">
      <i class="av" style="background:${m.bg}">${m.av}</i>
      <div class="tx">
        <b>${m.n}${m.me ? `<em>你</em>` : ""}</b>
        <span>${m.role}</span>
      </div>
    </div>
    <div class="v31-mst">
      <div><b>${m.posts}</b><span>本周发片</span></div>
      <div><b>${m.leads}</b><span>带来意向</span></div>
      <div><b>${opened ? "公开" : "隐藏"}</b><span>动态可见</span></div>
    </div>`;

  /* 关了就是关了。不做成"空状态"，要明确说出为什么，以及什么还能看。 */
  const locked = `<div class="v31-lock">
      <div class="v31-lock-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4.6" y="10.5" width="14.8" height="9.6" rx="2.6"/>
        <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7"/></svg></div>
      <b>${m.n} 没有公开自己的动态</b>
      <p>排名和上面这两个数字是组里公开的，谁都能看。<br>
         但他几点发片、跟进了谁、问了什么，属于个人轨迹，他没有开。</p>
      ${m.me ? `<div class="v31-lock-go" data-go="A6.1" data-label="去隐私设置">你自己的话，去「我的 → 隐私」可以打开</div>`
        : `<div class="v31-lock-tip">想看的话，直接在组里问他。系统不会替他把门打开。</div>`}
    </div>`;

  const timeline = `<div class="v31-sect">他这周做了什么</div>
    <div class="v19-tl">
      ${m.acts.map((a) => {
        const k = KIND[a.k] || KIND.post;
        return `<div class="v19-tl-i ${k.cls}">
          <span class="v19-tl-t">${a.t}</span>
          <i class="v19-tl-d">${k.ic}</i>
          <div class="v19-tl-tx"><span>${a.a}</span></div>
        </div>`;
      }).join("")}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "组员动态", sub: T.name, back: "A8.3?t=rank" })}

    <div class="body">
      ${head}
      ${opened ? timeline : locked}

      <div class="xs" style="margin:14px 2px 4px;line-height:1.7">
        这里只有组内行为：发片、交任务、被表扬、跟进客户的数量。<br>
        客户是谁、聊了什么，永远不会出现在这里。
      </div>
    </div>
  </div>`;
};
