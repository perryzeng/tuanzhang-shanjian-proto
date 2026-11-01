window.PAGES["B2.4"].prd = "PRD §6.14 · 定模板 / 声音 / 封面（一页定完，点生成）";
window.PAGES["B2.4"].states = [
  { k: "", n: "默认：镜头快切 + 亲和女声 + 首帧封面（都能直接改）" }
];

/* 生成前只剩三件事，一页问完：**片子怎么剪 / 谁在念 / 长什么样**。

   为什么把封面并进来：上一版封面单独占一页（B4），用户在"选模板"和"选封面"
   之间来回跳，跳完还不知道自己改的是哪一步。这三件事本质是同一件事——
   "这条片子最后是什么样"，拆成两页反而更难理解。

   结构上做了减法：
   · 模板去掉了 6 个分类 tab（我的/热门/双语/双11/日记）——8 款横滑一屏能扫完，
     分类是给几百款模板用的，8 款分类等于让用户多点一次；
   · 声音从 5 个缩到 3 个，一行一个，不再有试听弹窗；
   · 每段都标了序号 ①②③，一眼知道走到第几步、还剩几步。

   模板卡画的不是"渐变图 + 大标题"，而是**版式示意**：三格切、大字条、分屏 ✕✓、
   进度条……团长选模板靠"看着像不像我要的效果"，不靠读"每 1.5 秒切一次"。
   卡下面再给一句实例（eg），用他见过的场景说话，不用术语。 */
window.PAGES["B2.4"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const from = ctx.from === "D2" ? "D2" : "B2";
  const kind = ctx.kind === "remix" ? "remix" : "script";
  const tplId = ctx.tpl || "tp_fast";
  const vid = ctx.voice || "v_f1";
  const v = D.voice(vid);
  const tpl = D.template(tplId);

  const isSeries = from === "D2";
  const d = isSeries
    ? D.draft("series", { day: ctx.d || 5 })
    : D.draft(kind, { doc: ctx.doc, src: ctx.src, day: ctx.day });

  /* 摘要条只讲这一条片子是什么，不重复下面的选择 */
  const summary = isSeries
    ? d.series.name + " · Day " + (ctx.d || 5)
    : d.title;

  const carry = (isSeries
    ? "&c=" + (ctx.c || "cp_1") + "&d=" + (ctx.d || 5)
    : "&kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : ""));

  const backGo = from === "D2" ? "D2?c=" + (ctx.c || "cp_1") + "&d=" + (ctx.d || 5)
    : "B2?kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : "");
  const genGo = "B3?from=" + from + carry + "&tpl=" + tplId + "&voice=" + vid;

  /* 分段小标题：序号 + 一句人话。三段的问法是"为什么"，不是"叫什么" */
  const step = (n, t, s) => `<div class="sth"><i>${n}</i><b>${t}</b><span>${s}</span></div>`;

  /* 版式示意：用小块画出来，扫一眼就知道这条片子长什么样。
     颜色只做底板，真正的信息在"字压在哪、画面怎么分"。 */
  const SHAPE = {
    /* 三格切：两条分割线 + 底部一句大字 */
    grid3: `<i class="fline" style="top:32%"></i><i class="fline" style="top:65%"></i>
      <b class="fbar" style="left:7px;right:7px;bottom:8px;text-align:center">说一句 换一镜</b>`,
    /* 大字口播：三行白字，一行比一行短 */
    big: `<b class="fbar" style="left:8px;right:18px;top:38px">我妈吃了</b>
      <b class="fbar" style="left:8px;right:32px;top:56px">三个月</b>
      <b class="fbar" style="left:8px;right:50px;top:74px">真有用</b>`,
    /* 左右对比：中间竖线，左 ✕ 右 ✓ */
    split: `<i class="fvl"></i><i class="fdim"></i>
      <em class="fgl" style="left:16px;top:40px">✕</em><em class="fgl" style="right:16px;top:40px">✓</em>
      <b class="fbar" style="left:7px;right:7px;bottom:8px;text-align:center">差在吸收率</b>`,
    /* 先反着说：一个大问号 + 底部一句 */
    ask: `<em class="fgl" style="left:0;right:0;top:26px;text-align:center;font-size:34px">?</em>
      <b class="fbar" style="left:7px;right:7px;bottom:8px;text-align:center">先别买</b>`,
    /* 图片往上滑：三张叠着的白卡 */
    slide: `<i class="fsheet" style="top:34px;left:9px;right:9px;transform:rotate(-5deg)"></i>
      <i class="fsheet" style="top:42px;left:9px;right:9px;transform:rotate(3deg)"></i>
      <i class="fsheet" style="top:50px;left:9px;right:9px"></i>
      <b class="fbar" style="left:7px;right:7px;bottom:8px;text-align:center">6 张图够</b>`,
    /* 真人在讲：头像 + 肩，底下两行小字幕 */
    face: `<i class="fhead"></i><i class="fbody"></i>
      <b class="fbar thin" style="left:16px;right:16px;bottom:16px"></b>
      <b class="fbar thin" style="left:24px;right:24px;bottom:8px"></b>`,
    /* 中英双语：中文一行、英文一行 */
    duo: `<b class="fbar" style="left:8px;right:8px;top:44px;text-align:center">每粒 500mg</b>
      <b class="fbar thin" style="left:8px;right:8px;top:74px;text-align:center">500mg softgel</b>`,
    /* 促销大字：价格 + 倒计时条 */
    sale: `<em class="fgl" style="left:0;right:0;top:34px;text-align:center;font-size:15px;letter-spacing:-.5px">¥99 / 3 盒</em>
      <b class="fcd">距结束 02:14</b>`
  };

  const card = (t) => `<div class="tcard${t.id === tplId ? " sel" : ""}" data-set="B2.4.tpl=${t.id}">
      <div class="tvis${t.img ? " hasimg" : ""}" style="--c1:${t.c1};--c2:${t.c2}">
        <div class="fbg"></div>
        ${t.img ? `<img class="timg" src="${t.img}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block">` : ""}
        <span class="tt">${t.tag}</span>
        ${SHAPE[t.shape] || ""}
        ${t.id === tplId ? `<span class="tk">✓</span>` : ""}
      </div>
      <div class="tn">${t.name}</div>
      <div class="tr">${t.rate}</div>
    </div>`;

  /* 声音：一行三格。上一版是三行横条，每行右边还挂一个「▶ 听一句」，
     占掉 160px 却只说清三件事。现在并排三格，一屏看完。
     格子比横条更容易"扫"——三选一本来就该并排摆，不该竖着一条条读；
     以后再多个声音也只是换行，不会变成六行。
     「推荐 / 要录」不单独占位：默认选中的那个就是推荐，原音那格副句已写「要你念一遍」。
     试听按钮也去掉了——原型里点了没有真声音，留着反而是个假按钮。 */
  const voiceCell = (x) => `<div class="vcell${x.id === vid ? " on" : ""}" data-set="B2.4.voice=${x.id}">
      <span class="vv"><i></i><i></i><i></i></span>
      <b>${x.name}</b>
      <em>${x.sub}</em>
      ${x.id === vid ? `<span class="vk">✓</span>` : ""}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "定模板 · 声音 · 封面", sub: "第 2 步 · 定完就开始剪", back: backGo })}

    <div class="body" style="padding:0 0 26px">
      <div style="padding:0 16px">
        <div class="cfgbrief">
          <b>${summary}</b>
          <span>${d.segCount} 段 · 约 ${d.durTotal} 秒</span>
        </div>
      </div>

      ${step(1, "选模板", "这条片子怎么剪")}
      <div class="trow">${D.templates().map(card).join("")}</div>
      <div style="padding:0 16px">
        <div class="tpline"><b>${tpl.name}</b><i>·</i><span>${tpl.desc}</span></div>
      </div>

      ${step(2, "选声音", "谁在念这段词")}
      <div style="padding:0 16px">
        <div class="vgrid">${D.voices().map(voiceCell).join("")}</div>
        <div class="card" style="margin-top:10px;padding:12px 14px;display:flex;align-items:center;gap:10px"
             data-go="G1.4" data-label="克隆我的声音">
          <div style="width:32px;height:32px;border-radius:10px;background:var(--brand-weak);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:13px;flex:0 0 32px">声</div>
          <div style="flex:1;min-width:0"><div class="h3">我的声音</div><div class="xs" style="margin-top:2px">还没克隆？用你自己的声音生成，更像你</div></div>
          <span class="btn-pill line">去克隆</span>
        </div>
        <div class="note" style="margin:7px 2px 0">${v.k === "self"
          ? "自己念信任最高，但要按分段录一遍（约 3 分钟），改词还得重录。"
          : "AI 配音不用出声，改完台词直接重配；老客听得出不是你本人。"}</div>
      </div>

      ${step(3, "封面", "不改也能直接用")}
      <div style="padding:0 16px">
        ${C.coverKit({ pid: "B2.4", ctx: { ...ctx, topic: summary }, compact: true })}
        <div class="okline"><b>✓</b> 封面字已过合规：没有「最 / 第一 / 治疗」这类词</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-go="${genGo}" data-label="生成视频">✦ 生成视频 · 约 ${d.durTotal} 秒</div>
    </div>
  </div>`;
};
