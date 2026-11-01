window.PAGES["C1"].prd = "PRD §6.2 · 视频文案抽取 / 视频二创（两个入口共用一页，内容不同）";

/* 这一页要服务两种完全不同的目的，所以按 for 分两套内容：

   for=remix（视频二创）：上传本地视频 → 选抽取方式（AI 自动分段 / 按固定秒数）→ 抽完直接进发布器。
     它不需要"本地还是链接"的选择——二创只处理本地视频。
   默认（视频文案抽取）：从哪来二选一（本地 / 链接）→ 只抽文案，抽完还要问"要文案还是连画面"。
     走链接时拿不到原片，没法二创，所以只有文案抽取这条路需要链接。 */
window.PAGES["C1"].render = function (ctx) {
  const C = window.C, G = window.G;
  if (ctx.for === "remix") return renderRemix(C, G, ctx);

  const src = ctx.src === "link" ? "link" : "local";
  const imports = window.DATA.imports;

  const st = (x) => x.state === "fail"
    ? ["识别失败", "r"]
    : x.state === "doing" ? ["抽取中", "o"] : ["已抽取", "g"];

  const opt = (k, ic, name, sub) =>
    `<div class="opt ${src === k ? "on" : ""}" data-set="C1.src=${k}">
      <div class="oi">${ic}</div>
      <b>${name}</b><span>${sub}</span>
      ${src === k ? `<i class="ck">✓</i>` : ""}
    </div>`;

  const hot = (bg, tx, n) =>
    `<div style="flex:0 0 104px;cursor:pointer" data-go="F3" data-label="同款 ${tx}">
      <div style="height:138px;border-radius:16px;background:${bg};position:relative;overflow:hidden">
        <span style="position:absolute;right:6px;top:6px;background:rgba(0,0,0,.35);color:#fff;font-size:9px;border-radius:999px;padding:2px 6px">${n}</span>
      </div>
      <div style="font-size:12px;font-weight:600;margin-top:7px">${tx}</div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "视频文案抽取", sub: "只要文字，抽完进脚本框配新画面", back: "B1" })}

    <div class="body">
      <div class="pick2">
        ${opt("local", "↑", "本地视频", "从相册选一条")}
        ${opt("link", "↗", "粘贴链接", "抖音 · 视频号")}
      </div>

      ${src === "local" ? `
      <div class="drop" data-go="C1.1?src=local" data-label="选择本地视频">
        <div class="di">↑</div>
        <b>点这里选视频</b>
        <span>mp4 / mov · 竖屏优先 · 最长 3 分钟</span>
        <div class="btn-pill" style="margin-top:11px">选择视频</div>
      </div>` : `
      <div class="card">
        <div style="background:#F5F7FC;border-radius:14px;padding:12px 13px;font-size:12.5px;color:var(--text-2);line-height:1.5">
          https://v.douyin.com/iRk8xQ2t/ <span style="color:var(--text-4)">· 已识别为抖音视频</span>
        </div>
        <div class="row" style="gap:6px;margin-top:11px">
          <span class="pill on">抖音</span><span class="pill">视频号</span><span class="pill">小红书</span>
          <span class="xs" style="margin-left:auto">小红书仅公开笔记</span>
        </div>
        <div class="btn" style="margin-top:14px" data-go="C1.1?src=link" data-label="开始抽取文案">开始抽取文案</div>
      </div>`}

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">
          只抽文案：本地视频只在本机识别，不上传原片；抽出来的文字会进脚本库，下次直接引。
          想连画面一起还原，用下面的「其他发布器 · 视频二创」。
        </div>
      </div>

      ${C.sec("最近导入", "全部")}
      ${imports.map((x) => C.li({
        bg: x.state === "fail" ? G("#9AA5BD", "#C9CEDA") : G("#00A8E8", "#00C2FF"),
        im: x.state === "fail" ? "!" : "▶",
        title: x.title,
        m1: x.from + " · " + x.at + (x.segs ? " · " + x.segs + " 段" : ""),
        m2: x.state === "fail" ? "没识别到人声，建议换一条或手动输入" : "",
        tag: st(x)[0],
        tagCls: st(x)[1],
        go: x.go
      })).join("")}

      ${C.sec("本周热门同款", "全部", "F1")}
      <div class="chips" style="gap:10px;padding-bottom:6px">
        ${hot(G("#2C5BFF", "#00C2FF"), "磷虾油 3 段式", "8.6 万")}
        ${hot(G("#7C5CFF", "#B08CFF"), "开箱即口播", "5.2 万")}
        ${hot(G("#00A8E8", "#7C5CFF"), "对比测评", "3.1 万")}
      </div>
    </div>
  </div>`;
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
        <div class="di">↑</div>
        <b>上传本地视频</b>
        <span>mp4 / mov · 竖屏优先 · 最长 3 分钟</span>
        <div class="btn-pill" style="margin-top:11px">选择视频</div>
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
