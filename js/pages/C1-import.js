window.PAGES["C1"].prd = "PRD §6.2 · 视频文案抽取 / 视频二创（两个入口共用一页，内容不同）";

/* 这一页要服务两种完全不同的目的，所以按 for 分两套内容：

   for=remix（视频二创）：上传本地视频 → 选抽取方式（AI 自动分段 / 按固定秒数）→ 抽完直接进发布器。
     它不需要"本地还是链接"的选择——二创只处理本地视频。
   默认（视频文案抽取）：传视频 或 贴链接，二选一 → **就在这一页抽**，进度和结果都在下方。
     走链接时拿不到原片，没法二创，所以只有文案抽取这条路需要链接。 */
window.PAGES["C1"].render = function (ctx) {
  const C = window.C, G = window.G, D = window.DERIVE;
  if (ctx.for === "remix") return renderRemix(C, G, ctx);

  const hasFile = ctx.file === "1";
  const url = ctx.url || "";
  const stage = ctx.stage || "";            // "" | doing | done
  const tick = +(ctx.tick || 0);            // 0~3，抽取四步走到第几步
  const useLink = !!url.trim();             // 贴了链接就用链接，没贴才用文件

  const ready = useLink || hasFile;

  /* 四步的完成情况由 tick 决定；done 时全部完成 */
  const STEPS = ["拿到视频", "分离音轨", "识别口播", "断句分段"];
  const doneN = stage === "done" ? 4 : tick;
  /* 别从 0% 起步：点了按钮还是 0%，用户会以为没反应。四档给固定的观感进度 */
  const pct = stage === "done" ? 100 : [14, 38, 62, 86][Math.min(tick, 3)];

  const stepsHTML = `<div class="psteps">${STEPS.map((t, i) => {
    const st = i < doneN ? "ok" : (i === doneN && stage === "doing" ? "now" : "");
    return `<div class="pstep ${st}"><span class="dot">${i < doneN ? "✓" : i + 1}</span><span>${t}</span></div>`;
  }).join("")}</div>`;

  const x = D.extract();

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "视频文案抽取", sub: "只要文字，抽完进脚本框配新画面", back: "B1" })}

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
      ${url ? `<div class="xs" style="margin:7px 2px 0;color:var(--brand);font-weight:600">已识别为抖音视频 · 只取文字，不下载原片</div>` : ""}

      ${stage === "doing" ? `
        <div class="prog">
          <div class="ph"><b>正在抽取</b><span>${pct}%</span></div>
          <div class="pbar"><i style="width:${pct}%"></i></div>
          ${stepsHTML}
          <div class="xs" style="margin-top:10px">这一步不能离开页面，大约 20 秒</div>
        </div>` : ""}

      ${stage === "done" ? `
        <div class="prog done">
          <div class="ph"><b>抽到了 ${x.lines.length} 段</b><span>${x.dur || 47} 秒</span></div>
          <div class="pbar"><i style="width:100%"></i></div>
          ${stepsHTML}
          <div class="preview">
            ${x.lines.slice(0, 3).map((l, i) =>
              `<div class="pline"><span class="no">${String(i + 1).padStart(2, "0")}</span><span>${l.clean || l.vo}</span></div>`).join("")}
          </div>
          <div class="xs" style="margin-top:9px">已清掉 ${x.cleanedN} 处原作者痕迹，上面是清理后的文案 · 可以逐段改</div>
          <div class="xs" style="margin-top:7px;display:flex;align-items:center;gap:5px">
            <span>不知道改了哪儿？</span>
            <span style="color:var(--brand);font-weight:700;cursor:pointer"
              data-go="C1.2" data-label="看清理明细">看清理明细 ›</span>
          </div>
        </div>` : ""}

      ${stage === "" ? `
        <div class="note" style="margin:14px 2px 0;line-height:1.7">
          本地视频只在本机识别，<b style="color:var(--text)">不上传原片</b>；抽出来的文字会进脚本库，下次直接引。
        </div>` : ""}
    </div>

    <div class="actionbar">
      ${stage === "doing"
        ? `<div class="btn gray">正在抽取… ${pct}%</div>`
        : stage === "done"
          ? `<div class="btn ai" data-go="B2?kind=script&src=extract" data-label="用这份文案配画面">✦ 用这份文案配画面</div>`
          : ready
            ? `<div class="btn ai" data-set="C1.stage=doing&C1.tick=0">${useLink ? "开启抽取文案" : "开启抽取"}</div>`
            : `<div class="btn gray">先传视频或贴链接</div>`}
    </div>
  </div>`;
};

/* 抽取过程一步一步走：doing 状态下每 900ms 推一格，四格走完变 done。
   用页面级 after 钩子推进，不写死在渲染里——渲染只负责画当前这一帧。 */
window.PAGES["C1"].after = function (ctx) {
  if (ctx.for === "remix") return null;
  if (ctx.stage !== "doing") return null;
  const tick = +(ctx.tick || 0);
  return tick < 3 ? "C1.tick=" + (tick + 1) : "C1.stage=done";
};

/* 视频二创：上传 → 选抽取方式 → 抽完直接进发布器（一段文案 + 一段素材） */
function renderRemix(C, G, ctx) {
  const has = ctx.file !== "0";
  const mode = ctx.mode === "sec" ? "sec" : "auto";
  const sec = +(ctx.sec || 5);
  const name = "IMG_2043.MOV";

  const modeRow = (k, t, sub, tag) =>
    `<div class="vrow${mode === k ? " on" : ""}" data-set="C1.mode=${k}">
      <span class="rd"></span>
      <span class="vw">
        <b>${t}${tag ? ` <span class="tag b" style="margin-left:4px">${tag}</span>` : ""}</b>
        <i>${sub}</i>
      </span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "视频二创", sub: "上传本地视频，抽成一段段文案 + 素材", back: "B1" })}

    <div class="body">
      ${has ? `
      <div class="card" style="display:flex;align-items:center;gap:12px">
        <div style="width:52px;height:92px;border-radius:10px;background:${G("#0E1B3D", "#2C5BFF")};flex:0 0 52px;
             display:flex;align-items:flex-end;padding:5px;color:#fff;font-size:8.5px;font-weight:700">▶ 52s</div>
        <div style="flex:1;min-width:0">
          <div class="h3" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</div>
          <div class="xs" style="margin-top:4px">竖屏 1080×1920 · 52 秒 · 已就绪</div>
          <span class="tag g" style="margin-top:7px">可以抽取</span>
        </div>
        <span class="btn-pill line" data-set="C1.file=0">换一条</span>
      </div>` : `
      <div class="drop" data-set="C1.file=1">
        <div class="di">＋</div>
        <b>上传本地视频</b>
        <span>mp4 / mov · 竖屏优先 · 最长 3 分钟</span>
      </div>`}

      ${C.sec("怎么抽")}
      <div class="card" style="padding:2px 16px 6px">
        ${modeRow("auto", "AI 自动分段", "按台词断句，长短跟着语义走", "推荐")}
        ${modeRow("sec", "按固定秒数", "每段一样长，卡点更好对", "")}
        ${mode === "sec" ? `<div class="chips" style="margin:2px 0 12px">
          ${[3, 5, 10].map((n) => `<span class="chip ${sec === n ? "on" : ""}" data-set="C1.sec=${n}">${n} 秒/段</span>`).join("")}
        </div>` : ""}
      </div>

      <div class="card plain" style="margin-top:11px">
        <div class="xs" style="line-height:1.75">
          抽完直接进发布器：<b style="color:var(--text)">一段文案配一段素材</b>，可以逐段换画面、改台词。
          原片的画面会保留，所以发之前要过一遍安全度——改得越多，分越高。
        </div>
      </div>
    </div>

    <div class="actionbar">
      ${has
        ? `<div class="btn ai" data-go="C1.1?for=remix&mode=${mode}&sec=${sec}" data-label="开始抽取">开始抽取 · ${mode === "sec" ? "每 " + sec + " 秒一段" : "AI 自动分段"}</div>`
        : `<div class="btn gray">先上传视频</div>`}
    </div>
  </div>`;
}
