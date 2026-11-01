window.PAGES["C1"].prd = "PRD §6.2 · 视频文案抽取 / 视频二创（同一页，两种用途）";
window.PAGES["C1"].states = [
  { k: "", n: "还没选视频：一个大加号，或者贴个链接" },
  { k: "stage=doing", n: "抽取中：进度、四步、识别到的原话都在本页" },
  { k: "stage=done", n: "抽好了：结果卡就在下面，底部按钮直接去下一步" }
];

/* 这一页要服务两种目的：
   · 默认（视频文案抽取）——传视频或贴链接，只要文字，抽完去配新画面；
   · for=remix（视频二创）——传本地视频，选怎么切，连画面一起还原，抽完直接去发布器。

   **两条路都在本页走完，不再跳页**。
   上一版二创点了"开始抽取"会跳到 C1.1 干等几十秒，抽完还得再点一次才知道结果——
   用户的原话是"抽取也在当前页面嘛，不用再跳到下一个页面，抽完就直接去发布器"。
   跳页的唯一好处是"进度页可以离开"，但这个需求用一句"这一步不能离开页面"就能交代，
   不值得为它多两屏、多两次点击。

   进度的推进不写在渲染里：渲染只画当前这一帧，靠页面级 after 钩子
   每 900ms 推一格（core 每次重渲染先清定时器，不会叠出多条推进链）。 */
window.PAGES["C1"].render = function (ctx) {
  const C = window.C, G = window.G, D = window.DERIVE;
  const remix = ctx.for === "remix";

  const hasFile = remix ? ctx.file !== "0" : ctx.file === "1";
  const url = ctx.url || "";
  const mode = ctx.mode === "sec" ? "sec" : "auto";
  const sec = +(ctx.sec || 5);
  const stage = ctx.stage || "";            // "" | doing | done
  const tick = +(ctx.tick || 0);            // 0~3，抽取四步走到第几步
  const useLink = !remix && !!url.trim();   // 贴了链接就用链接，没贴才用文件
  const ready = hasFile || useLink;

  /* 第四步在两条路上不一样：抽取是"断句分段"，二创是"按所选方式切段" */
  const STEPS = ["拿到视频", "分离音轨", "识别口播",
    remix ? (mode === "sec" ? "每 " + sec + " 秒切一段" : "按语义断句分段") : "断句分段"];
  const doneN = stage === "done" ? 4 : tick;
  /* 别从 0% 起步：点了按钮还是 0%，用户会以为没反应。四档给固定的观感进度 */
  const pct = stage === "done" ? 100 : [14, 38, 62, 86][Math.min(tick, 3)];

  const stepsHTML = `<div class="psteps">${STEPS.map((t, i) => {
    const st = i < doneN ? "ok" : (i === doneN && stage === "doing" ? "now" : "");
    return `<div class="pstep ${st}"><span class="dot">${i < doneN ? "✓" : i + 1}</span><span>${t}</span></div>`;
  }).join("")}</div>`;

  const x = D.extract();
  /* 段数按"怎么切"算：按固定秒数是 52÷sec，AI 分段沿用识别结果。
     上一版这里直接读 x.segs，选"每 5 秒一段"却显示 6 段——标签和真结果对不上。 */
  const segN = remix
    ? (mode === "sec" ? Math.max(1, Math.round((x.dur || 52) / sec)) : x.segs)
    : x.lines.length;

  const modeRow = (k, t, sub, tag) =>
    `<div class="vrow${mode === k ? " on" : ""}" data-set="C1.mode=${k}">
      <span class="rd"></span>
      <span class="vw">
        <b>${t}${tag ? ` <span class="tag b" style="margin-left:4px">${tag}</span>` : ""}</b>
        <i>${sub}</i>
      </span>
    </div>`;

  /* 结果卡：两条路共用骨架，只有第三行说明和出口不一样。
     二创的每段多一个小方块——表示"这段画面也跟着切好了"，这是它和纯抽文案的区别。 */
  const resultCard = `
    <div class="prog done">
      <div class="ph"><b>${remix ? "切成 " + segN + " 段" : "抽到了 " + x.lines.length + " 段"}</b>
        <span>${x.dur || 52} 秒</span></div>
      <div class="pbar"><i style="width:100%"></i></div>
      ${stepsHTML}
      <div class="preview">
        ${x.lines.slice(0, 3).map((l, i) =>
          `<div class="pline"><span class="no">${String(i + 1).padStart(2, "0")}</span><span>${l.clean || l.vo}</span></div>`).join("")}
      </div>
      <div class="xs" style="margin-top:9px">${remix
        ? `每段都配好了原片画面，共 ${segN} 段 · 可以逐段换画面、改台词`
        : `已清掉 ${x.cleanedN} 处原作者痕迹，上面是清理后的文案 · 可以逐段改`}</div>
      ${remix ? `<div class="xs" style="margin-top:6px">原片画面会保留，发之前过一遍安全度——改得越多，分越高</div>` : `
      <div class="xs" style="margin-top:7px;display:flex;align-items:center;gap:5px">
        <span>不知道改了哪儿？</span>
        <span style="color:var(--brand);font-weight:700;cursor:pointer"
          data-go="C1.2" data-label="看清理明细">看清理明细 ›</span>
      </div>`}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({
      title: remix ? "视频二创" : "视频文案抽取",
      sub: remix ? "传一条视频，连画面一起还原" : "只要文字，抽完进脚本框配新画面",
      back: "B1"
    })}

    <div class="body">
      <div class="sec-h" style="margin:2px 2px 9px"><span class="h2">上传本地视频</span></div>
      ${hasFile ? `
        <div class="filecard">
          <div class="th" style="background:${G("#0E1B3D", "#2C5BFF")}">▶ 52s</div>
          <div class="tx">
            <b>IMG_2043.MOV</b>
            <span>竖屏 1080×1920 · 52 秒 · 已就绪</span>
          </div>
          <span class="btn-pill line" data-set="C1.file=0&C1.stage=&C1.tick=0">换一条</span>
        </div>` : `
        <div class="drop big" data-set="C1.file=1&C1.stage=&C1.tick=0">
          <div class="di">＋</div>
          <b>点加号选一条视频</b>
          <span>mp4 / mov · 竖屏优先 · 最长 3 分钟</span>
        </div>`}

      ${remix ? (stage === "" ? `
      <div class="sec-h" style="margin:14px 2px 9px"><span class="h2">怎么切</span>
        <span class="more">切成几段、每段多长</span></div>
      <div class="card" style="padding:2px 16px 6px">
        ${modeRow("auto", "AI 自动分段", "按台词断句，长短跟着语义走", "推荐")}
        ${modeRow("sec", "按固定秒数", "每段一样长，卡点更好对", "")}
        ${mode === "sec" ? `<div class="chips" style="margin:2px 0 12px">
          ${[3, 5, 10].map((n) => `<span class="chip ${sec === n ? "on" : ""}" data-set="C1.sec=${n}">${n} 秒/段</span>`).join("")}
        </div>` : ""}
      </div>
      <div class="xs" style="margin:8px 2px 0">
        这条 ${x.dur || 52} 秒的片子，大概切成 ${segN} 段
      </div>` : `
      <!-- 切完就把选项收成一行：已经切好了，再把"怎么切"铺在页面上只是占地方。
           想换一种切法点这行就退回未开始的状态，重切一次。 -->
      <div class="tpline" style="margin-top:12px;cursor:pointer" data-set="C1.stage=&C1.tick=0">
        <b>${mode === "sec" ? "按固定秒数 · 每 " + sec + " 秒一段" : "AI 自动分段"}</b>
        <i>·</i><span>点这里换一种切法</span>
      </div>`) : `
      <div class="sec-h" style="margin:14px 2px 9px"><span class="h2">或者贴个链接</span>
        <span class="more">抖音 · 视频号 · 小红书</span></div>
      <div class="urlbox">
        <span class="ic">↗</span>
        <!-- data-live：边打边判断能不能抽，底部按钮跟着变。
             不这么做的话，贴完链接按钮还写着"先传视频或贴链接"。 -->
        <input data-bind="C1.url" data-live value="${url.replace(/"/g, "&quot;")}"
               placeholder="把视频链接粘进来…" />
        ${url ? `<span class="clr" data-set="C1.url=&C1.stage=&C1.tick=0">清空</span>` : ""}
      </div>
      ${url ? `<div class="xs" style="margin:7px 2px 0;color:var(--brand);font-weight:600">已识别为抖音视频 · 只取文字，不下载原片</div>` : ""}`}

      ${stage === "doing" ? `
        <div class="prog">
          <div class="ph"><b>正在抽取</b><span>${pct}%</span></div>
          <div class="pbar"><i style="width:${pct}%"></i></div>
          ${stepsHTML}
          <div class="xs" style="margin-top:10px">这一步不能离开页面，大约 20 秒</div>
        </div>` : ""}

      ${stage === "done" ? resultCard : ""}

      ${stage === "" && remix ? `
        <div class="card plain" style="margin-top:11px">
          <div class="xs" style="line-height:1.75">
            抽完直接进发布器：<b style="color:var(--text)">一段文案配一段素材</b>，可以逐段换画面、改台词。
            原片的画面会保留，所以发之前要过一遍安全度——改得越多，分越高。
          </div>
        </div>` : ""}

      ${stage === "" && !remix ? `
        <div class="note" style="margin:14px 2px 0;line-height:1.7">
          本地视频只在本机识别，<b style="color:var(--text)">不上传原片</b>；抽出来的文字会进脚本库，下次直接引。
        </div>` : ""}
    </div>

    <div class="actionbar">
      ${stage === "doing"
        ? `<div class="btn gray">正在抽取… ${pct}%</div>`
        : stage === "done"
          ? remix
            ? `<div class="btn ai" data-go="B2?kind=remix&local=1&sec=${mode === "sec" ? sec : 0}" data-label="去发布器">✦ 去发布器 · ${segN} 段</div>`
            : `<div class="btn ai" data-go="B2?kind=script&src=extract" data-label="用这份文案配画面">✦ 用这份文案配画面</div>`
          : ready
            ? `<div class="btn ai" data-set="C1.stage=doing&C1.tick=0">${remix
                ? "开始切 · " + (mode === "sec" ? "每 " + sec + " 秒一段" : "AI 自动分段")
                : useLink ? "开启抽取文案" : "开启抽取"}</div>`
            : `<div class="btn gray">先上传视频${remix ? "" : "或贴链接"}</div>`}
    </div>
  </div>`;
};

/* 抽取过程一步一步走：doing 状态下每 900ms 推一格，四格走完变 done。
   两条路（抽取 / 二创）共用同一套推进，只是第四步的名字不同。 */
window.PAGES["C1"].after = function (ctx) {
  if (ctx.stage !== "doing") return null;
  const tick = +(ctx.tick || 0);
  return tick < 3 ? "C1.tick=" + (tick + 1) : "C1.stage=done";
};
