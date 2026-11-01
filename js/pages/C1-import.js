window.PAGES["C1"].prd = "PRD §6.2 · 导入视频（本地 / 链接 → 抽文案）";

/* 导入视频的目的只有一个：把别人（或者自己以前）口播的文案抽出来。
   抽出来之后有两条完全不同的去向，所以这一页只负责「把视频拿进来」，
   去向留给 C1.2 让人自己选：只要文案 → 当脚本；连画面一起 → 走二创。 */
window.PAGES["C1"].render = function (ctx) {
  const C = window.C, D = window.DERIVE, G = window.G;
  const tab = ctx.tab || "link";
  const imports = window.DATA.imports;

  const st = (x) => x.state === "fail"
    ? ["识别失败", "r"]
    : x.state === "doing" ? ["抽取中", "o"] : ["已抽取", "g"];

  const hot = (bg, tx, n) =>
    `<div style="flex:0 0 104px;cursor:pointer" data-go="F3" data-label="同款 ${tx}">
      <div style="height:138px;border-radius:16px;background:${bg};position:relative;overflow:hidden">
        <span style="position:absolute;right:6px;top:6px;background:rgba(0,0,0,.35);color:#fff;font-size:9px;border-radius:999px;padding:2px 6px">${n}</span>
      </div>
      <div style="font-size:12px;font-weight:600;margin-top:7px">${tx}</div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "导入视频", sub: "抽出口播文案，变成你的脚本", back: "B1" })}

    <div class="body">
      <div class="segtab">
        <b class="${tab === "link" ? "on" : ""}" data-set="C1.tab=link">粘贴链接</b>
        <b class="${tab === "local" ? "on" : ""}" data-set="C1.tab=local">本地相册</b>
      </div>

      ${tab === "link" ? `
      <div class="card">
        <div style="background:#F5F7FC;border-radius:14px;padding:12px 13px;font-size:12.5px;color:var(--text-2);line-height:1.5">
          https://v.douyin.com/iRk8xQ2t/ <span style="color:var(--text-4)">· 阿玲的磷虾油视频</span>
        </div>
        <div class="row" style="gap:6px;margin-top:11px">
          <span class="pill on">抖音</span><span class="pill">视频号</span><span class="pill">小红书</span>
          <span class="xs" style="margin-left:auto">小红书只支持公开笔记</span>
        </div>
        <div class="btn" style="margin-top:14px" data-go="C1.1?src=link" data-label="开始抽取文案">开始抽取文案</div>
        <div class="xs" style="margin-top:9px;text-align:center;line-height:1.6">
          只抽文案，视频文件不会存下来 · 最长 3 分钟
        </div>
      </div>` : `
      <div class="card" style="display:flex;align-items:center;gap:12px" data-go="C1.1?src=local" data-label="从相册选视频">
        <div style="width:46px;height:46px;border-radius:15px;background:var(--brand-weak);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:19px;flex:0 0 46px">↓</div>
        <div style="flex:1;min-width:0">
          <div class="h3">从相册选一条视频</div>
          <div class="xs" style="margin-top:3px">竖屏优先，最长 3 分钟，支持多选连抽</div>
        </div>
        <span class="btn-pill">选择</span>
      </div>
      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">本地视频只在本机识别口播，不上传原片；抽出来的文字会存进脚本库。</div>
      </div>`}

      ${C.sec("最近导入", "全部")}
      ${imports.map((x) => C.li({
        bg: x.state === "fail" ? G("#9AA5BD", "#C9CEDA") : G("#00A8E8", "#00C2FF"),
        im: x.state === "fail" ? "!" : "▶",
        title: x.title,
        m1: x.from + " · " + x.at + (x.segs ? " · " + x.segs + " 段 / " + x.dur + " 秒" : ""),
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

      <div class="card plain" style="margin-top:14px">
        <div class="xs" style="line-height:1.7">
          抽出来的是<b style="color:var(--text)">文字</b>。要连画面一起还原，那就是二创——<br>
          系统会标出哪几段带着原作者的痕迹，改完才让你发。
        </div>
      </div>
    </div>
  </div>`;
};
