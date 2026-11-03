/* A8.4.2 按平台预览 + 生成 + 分享（V16.9）
   一条作品发到三个地方，长相完全不同，团长要**先看见它长什么样**再决定发哪儿。
   三套皮肤在 js/skins.js —— 落地页 L1 用的是同一份。

   这一页走完的是「发出去」这一整段：
   ① 整屏还原三个平台的播放页
   ② 四个互动数随手改，屏上立刻跟着变（data-out，不整页重渲染）
   ③ 点「确定生成」→ 小剪按你填的数生成对应的评论（这里模拟一次模型调用）
   ④ 点「分享」→ 调起微信选择朋友圈 / 好友 / 群 → 编辑文案 → 发表
   ⑤ 发表完给「客户点开看到的样子」，链路就闭环了

   为什么没有「贴真实链接抓数据」：那是"发出去以后"才有的动作，
   和"正准备发"混在一屏，团长会分不清自己在预览还是在复盘。挪到作品详情的评论区再说。 */

window.PAGES["A8.4.2"].prd = "PRD V16 §5.2 · 平台预览（三套皮肤 / 生成评论 / 微信分享）";
window.PAGES["A8.4.2"].sysEntry = "作品详情里的三个平台入口";

/* 生成是"过程"，不是一瞬间。渲染只画当前这一帧，
   900ms 后由 after() 推进一步 —— 这样进度条才看得见。 */
window.PAGES["A8.4.2"].after = function (s) {
  if (s.gen === "1") return "A8.4.2.gen=2&A8.4.2.sheet=cmt";
  return null;
};

window.PAGES["A8.4.2"].render = function (ctx) {
  const C = window.C, L = window.LIB, S = window.SKIN;
  const w = L.works.filter((x) => x.id === ctx.c)[0] || L.works[0];
  const pf = ["wx", "dy", "xhs"].indexOf(ctx.pf) >= 0 ? ctx.pf : "dy";
  const p = L.plats[pf];

  /* 手填优先于默认值：input 用 data-bind 写进 STATE（不重渲染，光标不跳），
     切平台回来还能读到自己填的数。 */
  const val = (k, d) => (ctx[pf + "_" + k] != null && ctx[pf + "_" + k] !== "") ? ctx[pf + "_" + k] : d;
  const v = { like: val("like", p.likes), cmt: val("cmt", p.comments), share: val("share", p.shares), star: val("star", p.stars) };

  const wf = Object.assign({}, w, {
    who: "大 P",
    tags: "#心脑血管科普 #磷虾油",
    card: "大 P · 每天一条中老年营养",
    body: "今天把我妈的体检单翻出来了，吃了三个月的变化都在这张纸上。不说效果，你们自己看。"
  });

  const gen = ctx.gen || "";
  const sheet = ctx.sheet || "";
  const chan = ctx.chan || "";
  const batch = Number(ctx.batch || 0);

  /* 评论：从语料池里轮着取 8 条。「换一批」只挪起点，不重新跑模型 */
  const pool = L.genPool;
  const rot = pool.slice(batch % pool.length).concat(pool.slice(0, batch % pool.length));
  const shown = rot.slice(0, 8);

  const AV = ["linear-gradient(135deg,#FF8A65,#FF6B6B)", "linear-gradient(135deg,#7FA8F5,#5B7BE8)",
    "linear-gradient(135deg,#7ED0A8,#45A97C)", "linear-gradient(135deg,#C39BEA,#9B72D6)",
    "linear-gradient(135deg,#F2C14E,#D9A02B)", "linear-gradient(135deg,#8FC7D8,#5B9DB0)"];
  const avBg = (i) => AV[i % AV.length];
  const tagCls = (t) => (t === "问价" || t === "咨询" ? "q" : t === "成交" ? "d" : "");

  const GEN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3Z"/><path d="M18 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"/></svg>`;

  /* ---------- 底部弹层 ---------- */
  let sheetHTML = "";

  if (sheet === "cmt") {
    sheetHTML = `<div class="v26-mask" data-set="A8.4.2.sheet="></div>
    <div class="v26-sh">
      <div class="v26-sh-hd"><b>评论 ${v.cmt}</b><span>按你填的数由小剪生成</span>
        <em data-set="A8.4.2.sheet=">✕</em></div>
      <div class="v26-sh-bd">
        ${shown.map((c, i) => `<div class="v26-cm">
          <i class="av" style="background:${avBg(i)}">${c.av}</i>
          <div class="tx">
            <div class="nm"><b>${c.who}</b><i class="${tagCls(c.type)}">${c.type}</i></div>
            <p>${c.tx}</p>
            <div class="mt"><em>${c.at}</em><em>♥ ${c.likes}</em><em>回复</em></div>
          </div>
        </div>`).join("")}
        <div class="v26-hint" style="padding:12px 0 6px">还有 ${Math.max(0, v.cmt - 8)} 条没展开 · 发出去以后就按这个名单排在评论区</div>
      </div>
      <div class="v26-sh-ft">
        <div class="v26-go ghost" style="flex:0 0 96px;margin:0" data-set="A8.4.2.batch=${batch + 3}">换一批</div>
        <div class="v26-go" style="flex:1;margin:0" data-set="A8.4.2.sheet=share">就发这些 · 去分享</div>
      </div>
    </div>`;
  }

  if (sheet === "share") {
    const opts = [
      ["朋友圈", "圈", "#07C160", "moments"],
      ["微信好友", "友", "#2BB673", "moments"],
      ["群聊", "群", "#4C8DFF", "moments"],
      ["复制链接", "链", "#6B6B7A", "copied"]
    ];
    sheetHTML = `<div class="v26-mask" data-set="A8.4.2.sheet="></div>
    <div class="v26-sh">
      <div class="v26-sh-hd"><b>分享到</b><span>调起微信</span>
        <em data-set="A8.4.2.sheet=">✕</em></div>
      <div class="v26-sh-bd">
        <div class="v26-shr">
          ${opts.map(([n, ic, c, to]) => `<div data-set="A8.4.2.chan=${n}&A8.4.2.sheet=${to}">
            <i style="background:${c}">${ic}</i><b>${n}</b>
          </div>`).join("")}
        </div>
        <div class="v26-hint" style="text-align:left;padding:2px 0 10px">
          发出去的是这个应用的落地页链接，客户点开看到的是<em>${p.name}</em>的样子。
        </div>
      </div>
      <div class="v26-sh-ft"><div class="v26-go ghost" style="flex:1;margin:0" data-set="A8.4.2.sheet=">取消</div></div>
    </div>`;
  }

  if (sheet === "moments") {
    const to = chan === "群聊" ? "群里" : chan === "微信好友" ? "微信好友" : "朋友圈";
    sheetHTML = `<div class="v26-mask" data-set="A8.4.2.sheet="></div>
    <div class="v26-sh">
      <div class="v26-sh-hd"><b>发到${to}</b><span>${w.title.slice(0, 12)}…</span>
        <em data-set="A8.4.2.sheet=share">‹</em></div>
      <div class="v26-sh-bd">
        <div class="v26-mo">
          <div class="th"><img src="${w.img}" alt=""></div>
          <div class="ed">
            <textarea data-bind="A8.4.2.cap">${ctx.cap || "我妈吃了三个月，体检单我拍下来了 —— 想看的点开这条。团购还有 6 份，先到先得。"}</textarea>
            <span class="lk">已带上 · 大 P / 这条作品 / ${chan || "朋友圈"}</span>
          </div>
        </div>
      </div>
      <div class="v26-sh-ft">
        <div class="v26-go ghost" style="flex:0 0 96px;margin:0" data-set="A8.4.2.sheet=share">返回</div>
        <div class="v26-go" style="flex:1;margin:0" data-set="A8.4.2.sheet=sent">发表</div>
      </div>
    </div>`;
  }

  if (sheet === "copied") {
    sheetHTML = `<div class="v26-mask" data-set="A8.4.2.sheet="></div>
    <div class="v26-sh">
      <div class="v26-sh-bd">
        <div class="v26-done">
          <div class="ok">✓</div>
          <b>链接已复制</b>
          <p>可以直接粘贴到任意聊天窗口。<br>链接里已经带上<em>团长 / 这条作品 / 渠道</em>三个参数，谁点开的都能认出来。</p>
        </div>
      </div>
      <div class="v26-sh-ft">
        <div class="v26-go ghost" style="flex:1;margin:0" data-set="A8.4.2.sheet=">知道了</div>
      </div>
    </div>`;
  }

  if (sheet === "sent") {
    sheetHTML = `<div class="v26-mask" data-set="A8.4.2.sheet="></div>
    <div class="v26-sh">
      <div class="v26-sh-bd">
        <div class="v26-done">
          <div class="ok">✓</div>
          <b>${chan === "群聊" ? "已发到 3 个群" : chan === "微信好友" ? "已发给微信好友" : "已发到朋友圈"}</b>
          <p>客户点开会看到<em>${p.name}</em>的播放页，往下滑是我们的团购信息和「问团长」。<br>
             谁点开、看了多久、划到第几个要点，都会回到这条作品的动态里。</p>
        </div>
      </div>
      <div class="v26-sh-ft">
        <div class="v26-go ghost" style="flex:0 0 92px;margin:0" data-go="A8.4.1?c=${w.id}" data-label="回作品">回作品</div>
        <div class="v26-go" style="flex:1;margin:0" data-go="L1?pf=${pf}&c=${w.id}" data-label="看客户点开的样子">客户看到的样子 ›</div>
      </div>
    </div>`;
  }

  /* ---------- 生成按钮的三种样子 ---------- */
  const goBtn = gen === "1"
    ? `<div class="v26-go wait">小剪在写 ${v.cmt} 条评论…</div>`
    : gen === "2"
      ? `<div class="v26-go ghost" data-set="A8.4.2.gen=1&A8.4.2.batch=${batch + 3}">↻ 重新生成评论</div>`
      : `<div class="v26-go" data-set="A8.4.2.gen=1">${GEN_ICON}确定生成</div>`;

  return `<div class="app v25-app">
    ${C.sb(true)}

    <div class="v25-bar">
      <span class="bk" data-go="A8.4.1?c=${w.id}" data-label="回作品">${S.icon.chev}</span>
      <div class="seg">
        ${["wx", "dy", "xhs"].map((k) => `<span class="${pf === k ? "on" : ""}" data-set="A8.4.2.pf=${k}">${L.plats[k].name}</span>`).join("")}
      </div>
      <span class="ghost">分享效果</span>
    </div>

    <div class="v25-scr">${S.render(pf, wf, v, { noSb: true })}</div>

    <div class="body" style="padding:0">
      <div class="v25-panel">
        <div class="hd">模拟互动数据<em>改了上面立刻变</em></div>
        <div class="v25-grid">
          <label><span>点赞</span><input data-bind="A8.4.2.${pf}_like" data-out=".v25-n-like" value="${v.like}"></label>
          <label><span>评论</span><input data-bind="A8.4.2.${pf}_cmt" data-out=".v25-n-cmt" value="${v.cmt}"></label>
          <label><span>分享</span><input data-bind="A8.4.2.${pf}_share" data-out=".v25-n-share" value="${v.share}"></label>
          <label><span>收藏</span><input data-bind="A8.4.2.${pf}_star" data-out=".v25-n-star" value="${v.star}"></label>
        </div>

        ${goBtn}
        <div class="v26-hint">${gen === "2"
          ? `已按这组数生成 <em>${v.cmt}</em> 条评论，发出去就是这些`
          : `点确定后，小剪按上面这组数生成对应的评论，发出去就是这些`}</div>

        <div class="v26-lp" data-go="L1?pf=${pf}&c=${w.id}" data-label="看客户点开的样子">客户点开看到的就是上面这一屏 <b>›</b></div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" data-go="A8.4.1?c=${w.id}" data-label="回作品"><span>‹</span><b>作品</b></div>
      <div class="btn" data-set="A8.4.2.sheet=share">分享</div>
    </div>

    ${sheetHTML}
  </div>`;
};
