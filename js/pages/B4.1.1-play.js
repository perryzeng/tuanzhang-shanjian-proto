window.PAGES["B4.1.1"].prd = "PRD §6.20.1 · 播放页（三平台样式 + 互动量 + 评论）";
window.PAGES["B4.1.1"].states = [
  { k: "pf=wx", n: "默认：视频号样式，互动量中档，评论还没生成" },
  { k: "pf=dy&heat=hot", n: "抖音样式 + 互动量多档" },
  { k: "heat=custom", n: "自定义：三个数字自己填，填完点生成评论" }
];

/* 播放页。它替掉了上一版"成品页上直接摆互动量三档"的做法——
   用户的原话是"互动量不是在这个地方外面的，他应该是点了视频号、抖音、小红书之后
   进到播放页下面"。

   所以这一页要做三件事，顺序就是团长刷到自己视频时的顺序：
   ① 先看**这条在平台里长什么样**（三种样式，右上角切换）；
   ② 再看**这一档互动量下有多少人理**（少 / 中 / 多 / 自定义），
      数字填好点「生成评论」——评论数决定了下面能刷出多少条评论；
   ③ 最后**点评论数看大家在说什么**，像视频号那样一条条往下翻。

   为什么数字要"确定"一次而不是实时跟着输入变：评论是"按这个数生成"的东西，
   边打字边生成会一直闪；确定一下，才有"生成了 23 条"这个动作感。 */
window.PAGES["B4.1.1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const pf = ctx.pf === "dy" ? "dy" : ctx.pf === "xhs" ? "xhs" : "wx";
  const custom = ctx.heat === "custom";
  const heatId = custom ? "warming" : (ctx.heat || "warming");
  const base = D.heat(heatId);
  const cm = ctx.cm === "1";
  const shared = ctx.shared === "1";

  /* 自定义时读用户填的数，没填就用"中"档那组当起点——空着比给 0 好 */
  const num = (k, def) => {
    const v = ctx[k];
    if (!custom) return def;
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? Math.min(n, 99999) : def;
  };
  const lk = num("lk", base.like);
  const cn = num("cn", base.comment);
  const sh = num("sh", base.share);

  /* 「已生成」不是靠一个开关记的，而是**记下生成时用的那个评论数**：
     数字一改，gencn 对不上，页面自动回到"还没生成"，评论列表跟着收起。
     否则用户把 23 改成 200，上面仍写着"已生成 23 条"——数字和结果对不上。 */
  const done = ctx.done === "1" && +ctx.gencn === cn;

  const PLAT = {
    wx: { name: "视频号", dot: "#FA9D3B" },
    dy: { name: "抖音", dot: "#FE2C5B" },
    xhs: { name: "小红书", dot: "#FF2442" }
  };

  const box = `<div class="plbox ${pf}">
    <div class="src"></div>
    <div class="cvtxt"><b>磷虾油今晚<br>8 点开团</b><i>讲清成分和怎么买</i></div>
    <div class="plside">
      <span class="it on"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.7S3.2 15 3.2 9.1A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.9c0 5.9-8.8 11.6-8.8 11.6Z"/></svg><i>${lk > 9999 ? (lk / 10000).toFixed(1) + "w" : lk}</i></span>
      <span class="it"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 9 9 0 0 1-3.6-.7L4 20.5l1.4-4.3A8.2 8.2 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z"/></svg><i>${cn > 9999 ? (cn / 10000).toFixed(1) + "w" : cn}</i></span>
      <span class="it"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 15.5V4"/><path d="m8 8 4-4 4 4"/></svg><i>${sh > 9999 ? (sh / 10000).toFixed(1) + "w" : sh}</i></span>
    </div>
    <div class="plfoot">
      <b>阿珍 · 大健康选品</b>
      <p>磷虾油今晚 8 点开团，3 步选对不踩坑 <em class="tg">#磷虾油 #开团</em></p>
    </div>
  </div>`;

  /* 互动量：少 / 中 / 多 / 自定义。
     档位只换数字，不换解释——团长看的是"这条现在有多少人理"，
     所以每档下面不写"冷启动""进推荐池"这种运营词，副标题只在上面出现一次。 */
  const HPICK = [["cold", "少"], ["warming", "中"], ["hot", "多"], ["custom", "自定义"]];
  const hp = HPICK.map(([k, tx]) =>
    `<span class="h${(custom ? k === "custom" : (!custom && heatId === k)) ? " on" : ""}"
      data-set="B4.1.1.heat=${k}&B4.1.1.done=&B4.1.1.cm=">${tx}</span>`).join("");

  /* 数字区：预设档位是只读的三个数，自定义是可输入的三个框 */
  /* 自定义的三个格子要看出"能改"：加描边 + 把数字放进一个浅底输入框里。
     只靠一个光秃秃的粗体数字，用户会以为那是只读的统计值。 */
  const numBox = (k, label, val) => custom
    ? `<div class="n ed"><input type="number" data-bind="B4.1.1.${k}" data-live min="0" max="99999"
         value="${val}" /><span>${label}</span></div>`
    : `<div class="n"><b>${val > 9999 ? val.toLocaleString() : val}</b><span>${label}</span></div>`;

  const cms = D.makeComments(cn);

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: PLAT[pf].name + "里长什么样", sub: "同一条，三种长相", back: "B4.1" })}

    <div class="body">
      <div class="ptabs3">
        ${Object.keys(PLAT).map((k) =>
          `<b class="${pf === k ? "on" : ""}" data-set="B4.1.1.pf=${k}&B4.1.1.cm=">
            <i style="background:${PLAT[k].dot}"></i>${PLAT[k].name}</b>`).join("")}
      </div>

      ${box}

      <div class="sec-h" style="margin:15px 2px 9px"><span class="h2">互动量</span>
        <span class="more">${custom ? "自己填三个数" : base.note}</span></div>
      <div class="card" style="padding:12px 13px">
        <div class="heatpick">${hp}</div>
        <div class="nums">
          ${numBox("lk", "赞", lk)}${numBox("cn", "评论", cn)}${numBox("sh", "转发", sh)}
        </div>
        <div class="gencm${done ? " ok" : ""}" ${done ? "" : `data-set="B4.1.1.done=1&B4.1.1.gencn=${cn}&B4.1.1.cm="`}>
          ${done ? `✓ 已按 ${cn} 条评论生成` : `✓ 按这些数生成 ${cn} 条评论`}
        </div>
        <div class="xs" style="margin-top:7px;line-height:1.5">
          ${done ? "改数字会重新生成" : "评论由 AI 按这条的台词和卖点写，数字只决定有多少条。"}</div>
      </div>

      ${done ? `
        <div class="cmbar light" data-set="B4.1.1.cm=${cm ? "" : "1"}">
          <b>${cn} 条评论</b>
          <span>${cm ? "收起" : "看看大家在说什么 ›"}</span>
        </div>
        ${cm ? `<div class="card" style="padding:2px 13px 6px;border-radius:14px">
          ${cms.list.map((c) => `<div class="cmrow light">
            <span class="av" style="background:${c.bg}">${c.av}</span>
            <div class="tx">
              <div class="n">${c.who}${c.tag ? `<i>${c.tag}</i>` : ""}</div>
              <p>${c.tx}</p>
              <div class="m">${c.at} · ${c.like} 赞</div>
            </div>
          </div>`).join("")}
          ${cms.more ? `<div class="cmmore light">还有 ${cms.more} 条 · 都是 AI 按台词写的</div>` : ""}
        </div>` : ""}` : ""}
    </div>

    <div class="actionbar">
      <div class="btn ${shared ? "gray" : ""}" ${shared ? "" : `data-set="B4.1.1.shared=1"`}>
        ${shared ? "✓ 已按「" + PLAT[pf].name + "」样式分享" : "分享这条 · 用「" + PLAT[pf].name + "」样式"}
      </div>
    </div>
  </div>`;
};
