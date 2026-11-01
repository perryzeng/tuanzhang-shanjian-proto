window.PAGES["B2.3"].prd = "PRD §6.16 · 画中画（照片出镜）配置";
window.PAGES["B2.3"].states = [
  { k: "", n: "默认：位置 / 大小 / 形状 / 出现时长" }
];

/* 画中画 = 在这段画面上再压一层"你的照片/人像"。
   大健康团长最常见的出镜方式就是它——不用真录，观众看到的是你在产品旁边。

   这一页有两个入口，所以必须带上下文回来：
   ① 从素材选择器 B2.1 进（这段还没有小窗，点了"让我的照片出镜"）；
   ② 从脚本框的「▣ 带小窗」标签进（已经有了，来调位置）。
   所以 `seg / kind / src / doc` 一路带着，「应用」才能准确回到那一段。 */
window.PAGES["B2.3"].render = function (ctx) {
  const C = window.C, G = window.G, D = window.DERIVE;
  const kind = ctx.kind || "script";
  const segId = ctx.seg || "";

  /* 认得出是哪一段，就把那一段的台词摆出来——"给这句话配个小窗"才具体 */
  let no = 2, name = "产品落卖点", vo = "今晚开团磷虾油，选品门槛一次讲清楚。";
  if (segId) {
    const d = D.draft(kind, { doc: ctx.doc, src: ctx.src, day: ctx.day });
    const s = d.segments.filter((x) => x.id === segId)[0];
    if (s) { no = s.idx + 1; name = s.name; vo = s.vo || "（这段台词还没生成）"; }
  }

  const backQ = kind === "series"
    ? "D2?c=" + (ctx.c || "cp_1") + "&d=" + (ctx.day || 5)
    : "B2?kind=" + kind + (ctx.src ? "&src=" + ctx.src : "") + (ctx.doc ? "&doc=" + ctx.doc : "");
  const applyQ = backQ + (segId ? "&seg=" + segId + "&pip=" + segId : "");

  /* 位置不用文字描述，直接画：每个格子里是一个竖屏小画框，小圆点就在那个角上。
     选项本身长得像结果，比"左上/右上/右下/居中"四个词快得多。 */
  const corner = (pos, on, label) => {
    const dot = { lt: "left:5px;top:5px", rt: "right:5px;top:5px", lb: "left:5px;bottom:5px",
      rb: "right:5px;bottom:5px", ct: "left:calc(50% - 4.5px);top:calc(50% - 4.5px)" }[pos];
    return `<div style="cursor:pointer">
      <div style="aspect-ratio:3/4;border-radius:9px;position:relative;background:${on ? "var(--brand-weak)" : "#F3F5FA"};box-shadow:${on ? "inset 0 0 0 1.5px var(--brand)" : "none"}">
        <i style="position:absolute;${dot};width:9px;height:9px;border-radius:50%;background:${on ? "var(--brand)" : "#B9C3D6"}"></i>
      </div>
      <div style="text-align:center;font-size:10px;margin-top:5px;color:${on ? "var(--brand-ink)" : "var(--text-3)"};font-weight:${on ? 700 : 400}">${label}</div>
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backQ}" data-label="返回">‹</span>
      <div class="ttl">加一层小窗<small>第 ${no} 段 · ${name} · 用你的照片出镜</small></div>
    </div>

    <div class="body">
      <div style="display:flex;justify-content:center">
        <div style="width:178px;position:relative;border-radius:16px;overflow:hidden;background:${G("#2C5BFF", "#5B8CFF")};aspect-ratio:9/16">
          <div style="position:absolute;left:8px;top:10px;font-size:9.5px;color:rgba(255,255,255,.8)">${name}</div>
          <div style="position:absolute;left:0;right:0;bottom:0;padding:8px;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent);color:#fff;font-size:9.5px;line-height:1.5">${vo}</div>
          <div style="position:absolute;right:10px;bottom:52px;width:58px;height:58px;border-radius:50%;background:${G("#7C5CFF", "#B08CFF")};box-shadow:0 0 0 2px #fff,0 8px 20px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700">暴</div>
        </div>
      </div>

      <div class="card plain" style="margin-top:12px;border:1.5px dashed #C9D2E6;background:#F7F9FD">
        <div class="xs" style="line-height:1.6;color:var(--text-2)">
          <b style="color:var(--text)">小窗是什么：</b>这段画面播着，你的照片一直压在角上，观众看到的是
          "你在讲这个产品"。不用真拍，也不用对口型。
        </div>
      </div>

      ${C.sec("放在哪")}
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        ${corner("lt", false, "左上")}${corner("rt", false, "右上")}${corner("rb", true, "右下")}${corner("ct", false, "居中")}
      </div>

      ${C.sec("多大")}
      <div class="card" style="padding:14px">
        <div class="row" style="gap:12px">
          <span class="xs" style="width:24px">小</span>
          <input type="range" min="0" max="100" value="46" style="flex:1;accent-color:var(--brand)">
          <span class="xs" style="width:24px;text-align:right">大</span>
        </div>
        <div class="row" style="gap:8px;margin-top:14px">
          <span class="pill on">圆形</span><span class="pill">圆角矩形</span><span class="pill">加白边</span>
        </div>
      </div>

      ${C.sec("什么时候出现")}
      <div class="card" style="padding:14px">
        <div class="kv" style="padding-top:0"><span class="k">整段都在</span><span class="switch on"><i></i></span></div>
        <div class="kv" style="padding-bottom:0"><span class="k">前 3 秒露脸，之后淡出</span><span class="switch"><i></i></span></div>
      </div>

      <div class="xs" style="margin-top:10px;line-height:1.6">
        换哪张照片走 <b data-go="E2.1" data-label="换照片" style="color:var(--brand)">我的出镜 ›</b>
        ——建议用有产品在手的半身照，纯头像会显得像客服。
      </div>
    </div>

    <div class="actionbar">
      <div class="btn" data-go="${applyQ}" data-label="应用到这一段">应用到第 ${no} 段</div>
    </div>
  </div>`;
};
