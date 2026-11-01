window.PAGES["C1"].prd = "PRD §6.2 · 导入视频（本地 / 链接二选一，不并排要求两个都填）";

/* 本地上传和贴链接是**二选一**，不是两张都要填的表。
   所以先用两个并列选项问一句"从哪来"，选完只出现那一条路的操作面板——
   另一条路收起，用户不会以为要先把两条都走一遍。
   （比 Tab 好在：两个选项始终可见，随时能换；Tab 会藏掉另一个。） */
window.PAGES["C1"].render = function (ctx) {
  const C = window.C, G = window.G;
  const src = ctx.src === "link" ? "link" : "local";
  /* for=remix 是从"视频二创"那条路进来的：目的不是要文案，是要连画面一起还原。
     同一个导入页，两种意图，出口在 C1.2 那个岔口上默认值不同。 */
  const forRemix = ctx.for === "remix";
  const fq = forRemix ? "&for=remix" : "";
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
    ${C.ab({
      title: forRemix ? "导入视频 · 二创" : "导入视频",
      sub: forRemix ? "连画面一起还原，发前要过安全度" : "抽出口播文案，变成你的脚本",
      back: "B1"
    })}

    <div class="body">
      <div class="pick2">
        ${opt("local", "↑", "本地视频", "从相册选一条")}
        ${opt("link", "↗", "粘贴链接", "抖音 · 视频号")}
      </div>

      ${src === "local" ? `
      <div class="drop" data-go="C1.1?src=local${fq}" data-label="选择本地视频">
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
        <div class="btn" style="margin-top:14px" data-go="C1.1?src=link${fq}" data-label="开始抽取文案">开始抽取文案</div>
      </div>`}

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">${forRemix
          ? "二创会保留原片的画面和节奏，所以发之前必须过安全度检查——改的段越多，分越高。原片不建议存下来，我们只留抽取到的文案与片段索引。"
          : "只抽文案：本地视频只在本机识别，不上传原片；抽出来的文字会进脚本库，下次直接引。"}</div>
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
