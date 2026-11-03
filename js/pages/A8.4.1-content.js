/* A8.4.1 单条作品的全部数据（V16.3）
   用户的话：「点每一个作品应该可以看到这个作品分享带来的所有数据，
   包括动态（时间轴）、谁浏览了谁是潜客、评论内容、以及整体数据。」

   所以四个 tab，对应四种问法：
   ① 总览 —— 这条整体怎么样（漏斗 + 四个率 + 小剪的判断 + 用了哪几段）
   ② 动态 —— 刚刚发生了什么（按时间倒序，一条一幕）
   ③ 人 —— 谁看了、谁问了、谁是潜客（按意向排，可以直接跳去跟进）
   ④ 评论 —— 他们具体说了什么（这些是要回的人） */

window.PAGES["A8.4.1"].prd = "PRD V16 §5.1 · 作品详情（总览 / 动态 / 人 / 评论）";
window.PAGES["A8.4.1"].sysEntry = "作品列表点任意一条已发的";

window.PAGES["A8.4.1"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const w = L.works.filter((x) => x.id === ctx.c)[0] || L.works[0];
  const t = ctx.t || "all";

  const used = w.blocks.map((id) => L.blocks.filter((b) => b.id === id)[0]).filter(Boolean);
  const pct = (v) => (w.reach ? Math.max(7, Math.round(v / w.reach * 100)) : 7);

  /* 人：从时间轴里按人去重，合成"这个人在这条里的全部动作" */
  const people = {};
  w.timeline.forEach((e) => {
    if (!people[e.who]) people[e.who] = { n: e.who, av: e.av, acts: [], hot: false };
    people[e.who].acts.push(e.act);
    if (e.hot) people[e.who].hot = true;
  });
  const plist = Object.keys(people).map((k) => people[k]);

  const KIND = {
    view: { ic: "看", cls: "" },
    ask: { ic: "问", cls: "ask" },
    cmt: { ic: "评", cls: "cmt" },
    share: { ic: "转", cls: "share" },
    out: { ic: "走", cls: "out" }
  };

  const CM = { "问价": "o", "咨询": "b", "反馈": "g", "成交": "p" };

  const tabs = `<div class="tabs3" style="margin:14px 0 2px">
    <b class="${t === "all" ? "on" : ""}" data-set="A8.4.1.t=all">总览</b>
    <b class="${t === "log" ? "on" : ""}" data-set="A8.4.1.t=log">动态 ${w.timeline.length}</b>
    <b class="${t === "who" ? "on" : ""}" data-set="A8.4.1.t=who">人 ${plist.length}</b>
    <b class="${t === "cmt" ? "on" : ""}" data-set="A8.4.1.t=cmt">评论 ${w.cmt}</b>
  </div>`;

  let body = "";

  if (t === "all") {
    body = `<div class="v18-fn" style="margin-top:10px">
      ${w.funnel.map(([k, v], i) => `<div class="v18-fn-r">
        <span>${k}</span>
        <div class="v18-fn-bar"><i style="width:${pct(v)}%;opacity:${1 - i * 0.16}"></i></div>
        <b>${v}</b>
      </div>`).join("")}
    </div>

    <div class="v18-kpi">
      <div><b>${w.rate}</b><span>转化率</span></div>
      <div><b>${w.reach ? Math.round(w.open / w.reach * 100) + "%" : "—"}</b><span>点开率</span></div>
      <div><b>${w.open ? Math.round(w.full / w.open * 100) + "%" : "—"}</b><span>完播率</span></div>
      <div><b>${w.stay}</b><span>平均停留</span></div>
    </div>

    <div class="v18-insight">
      <div class="v18-insight-hd">小剪的判断</div>
      <p>${w.insight}</p>
    </div>

    ${C.sec("这条用了哪几段")}
    <div class="v18-used">
      ${used.map((b) => `<div class="v18-used-i">
        <img src="${b.img}" alt="">
        <span>${b.fn}</span>
      </div>`).join("")}
    </div>`;
  }

  if (t === "log") {
    body = `<div class="v19-tl">
      ${w.timeline.length ? w.timeline.map((e) => {
        const k = KIND[e.kind] || KIND.view;
        return `<div class="v19-tl-i ${k.cls}">
          <span class="v19-tl-t">${e.t}</span>
          <i class="v19-tl-d">${k.ic}</i>
          <div class="v19-tl-tx">
            <b>${e.who}</b>
            <span>${e.act}</span>
          </div>
          ${e.hot ? `<em>值得跟</em>` : ""}
        </div>`;
      }).join("") : `<div class="xs" style="text-align:center;padding:36px 0">这条还没发出去，暂时没有动态</div>`}
    </div>`;
  }

  if (t === "who") {
    body = plist.length ? `<div class="card" style="padding:4px 13px;margin-top:10px">
      ${plist.map((p) => `<div class="v18-v" data-go="G3.1?u=u_amei" data-label="跟进 ${p.n}">
        <i class="v18-v-av">${p.av}</i>
        <div>
          <b>${p.n}${p.hot ? `<em>潜客</em>` : ""}</b>
          <span>${p.acts[p.acts.length - 1]}</span>
        </div>
        <span class="v18-v-act">${p.acts.length} 次动作</span>
      </div>`).join("")}
    </div>` : `<div class="xs" style="text-align:center;padding:36px 0">还没有人看过这条</div>`;
  }

  if (t === "cmt") {
    body = w.commentList.length ? w.commentList.map((c) => `<div class="v19-cm">
      <i class="v18-v-av">${c.av}</i>
      <div>
        <div class="v19-cm-hd"><b>${c.who}</b><span class="tag ${CM[c.type] || "b"}">${c.type}</span><em>${c.at}</em></div>
        <p>${c.tx}</p>
        <div class="v19-cm-act">回复</div>
      </div>
    </div>`).join("") : `<div class="xs" style="text-align:center;padding:36px 0">还没有公开评论</div>`;
  }

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "这条作品", sub: w.at + " · " + w.ch, back: "A8.4", act: w.status === "sent" ? "再发一次" : "去发" })}

    <div class="body">
      <div class="v18-hero">
        <img src="${w.img}" alt="">
        <div class="v18-hero-tx">
          <b>${w.title}</b>
          <span>${w.dur}${w.tag ? " · " + w.tag : ""}</span>
        </div>
      </div>

      <div class="v18-total" style="margin-top:10px">
        <div><b>${w.open}</b><span>点开</span></div>
        <div><b>${w.full}</b><span>看完</span></div>
        <div><b>${w.ask}</b><span>问价</span></div>
        <div><b>${w.deal}</b><span>成交</span></div>
      </div>

      ${tabs}
      ${body}

      ${t === "all" ? `<div class="v18-reuse" data-go="B1?w=w_krill&ep=6" data-label="按这条再剪一条">
        <div>
          <b>按这个结构再剪一条</b>
          <span>开场钩子 + 证据 + 收尾行动，素材已经配好</span>
        </div>
        <em>›</em>
      </div>` : ""}
    </div>
  </div>`;
};
