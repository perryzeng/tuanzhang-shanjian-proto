window.PAGES["B4.2"].prd = "PRD §6.15 · 给封面挑一张照片";
window.PAGES["B4.2"].states = [
  { k: "", n: "默认：从相册传一张，或者用以前传过的" }
];

/* 封面底图从哪来。两种：现拍/现传，或者用相册里以前传过的。
   为什么不做成"只有上传"：团长手机里本来就躺着一堆产品图、自拍、开箱照，
   他九成会从里面挑，重新拍一张反而慢。 */
window.PAGES["B4.2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const sel = ctx.ph || "";

  const ph = (p) => `<div class="phcell${sel === p.id ? " sel" : ""}" data-go="B4?base=photo&ph=${p.id}" data-label="用这张当封面底图">
      <div class="im" style="background:${p.bg}"></div>
      <div class="tx"><b>${p.label}</b><span>${p.at}</span></div>
      ${sel === p.id ? `<span class="ck">✓</span>` : ""}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "选一张照片", sub: "当封面的底图", back: "B4", act: "相册" })}

    <div class="body">
      <div class="card pay" style="display:flex;align-items:center;gap:11px;cursor:pointer">
        <span style="width:36px;height:36px;border-radius:11px;background:var(--g-brand);color:#fff;
          display:flex;align-items:center;justify-content:center;font-size:16px;flex:0 0 36px">↑</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:13.5px;font-weight:600">从手机相册传一张</div>
          <div class="xs" style="margin-top:3px">建议竖版、画面里有人或产品；横图会被裁成竖版</div>
        </div>
        <span style="font-size:17px;color:var(--text-4)">›</span>
      </div>

      <div class="sec-h" style="margin:16px 2px 10px"><span class="h2">最近传过的</span>
        <span class="more">${D.myPhotos().length} 张</span></div>
      <div class="phgrid">${D.myPhotos().map(ph).join("")}</div>

      <div class="note" style="margin:12px 2px 0;line-height:1.7">
        选中的这张只当封面用，不会混进素材库；想长期用就传进「我的出镜」。
      </div>
    </div>
  </div>`;
};
