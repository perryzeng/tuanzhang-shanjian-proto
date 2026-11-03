/* S1 分发器（V14 新增）
   这一页只干一件事：把剪好的片子，变成能在微信里发出去的东西。

   为什么必须单独一页、不能留在成品详情里：
   成品详情回答「这条怎么样」，分发回答「这条怎么发出去、发给谁」。
   团长在微信里发东西，三个渠道的说法完全不一样——
   朋友圈要钩子，群里要理由，私聊要称呼和她关心的事。
   一个「分享到…」按钮解决不了这件事。

   右侧面板的出口：L1（客户点开看到什么）、A1.2（发完回首页看回传）。 */

window.PAGES["S1"].prd = "PRD V14 §3 · 分发器（三渠道话术 + 落地页链接）";

window.PAGES["S1"].render = function (ctx) {
  const C = window.C, B = window.BIZ;
  const ch = ctx.c || "moments";
  const sc = B.scripts[ch];
  const v = B.pending.filter((x) => x.id === ctx.v)[0] || B.pending[0];
  const done = ctx.done === "1";

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "发出去", sub: "这条发到哪儿、怎么说", back: "A1.2", act: "全部" })}

    <div class="body">
      <div class="donecard" style="align-items:flex-start">
        <div class="th" style="width:54px;height:96px;flex:0 0 54px">
          <img src="${v.img}" alt="" style="width:100%;height:100%;object-fit:cover">
          <span class="dur">${v.dur}</span>
        </div>
        <div class="tx">
          <b>${v.title}</b>
          <span>${v.at}</span>
          <div class="expbtn" style="background:var(--brand-weak);color:var(--brand-ink);margin-top:8px"
               data-go="L1?v=${v.id}" data-label="预览落地页">
            客户点开会看到什么 ›
          </div>
        </div>
      </div>

      <div class="sec-h"><span class="h2">发给谁</span><span class="more">三个渠道说法不一样</span></div>
      <div class="v14-chs">
        ${B.channels.map((c) => `<div class="v14-ch ${c.k === ch ? "on" : ""}" data-set="S1.c=${c.k}">
          <span class="v14-chi">${c.icon}</span>
          <b>${c.name}</b>
          <span class="v14-chn">${c.note}</span>
        </div>`).join("")}
      </div>

      <div class="sec-h"><span class="h2">${sc.title}</span></div>
      <div class="v14-script">
        <div class="v14-sc-body">${sc.body.replace(/\n/g, "<br>")}</div>
        <div class="v14-sc-ops">
          <span class="v14-op" data-set="S1.c=${ch}">换一版</span>
          <span class="v14-op" data-set="S1.done=1">改两个字</span>
        </div>
      </div>
      <div class="v14-sc-tip">${sc.tip}</div>

      <div class="card plain" style="margin-top:12px;padding:12px 13px">
        <div class="xs" style="line-height:1.75">
          发出去之后，链接会带上「你 · 这条内容 · <b>${B.channels.filter((x) => x.k === ch)[0].name}</b>」三个标记。
          谁点进来、看了多久、点了什么，都会回到首页。
        </div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" data-go="L1?v=${v.id}" data-label="预览">${"<span>◇</span><b>预览</b>"}</div>
      <div class="btn"${done ? "" : ` data-set="S1.done=1"`}>${done ? "✓ 已复制，去微信粘贴" : "复制文案 · 去微信发"}</div>
    </div>
  </div>`;
};
