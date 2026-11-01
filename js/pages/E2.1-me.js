window.PAGES["E2.1"].render = function () {
  const C = window.C, G = window.G;

  const photo = (bg, tag) =>
    `<div style="border-radius:14px;overflow:hidden;position:relative;background:${bg};aspect-ratio:3/4;cursor:pointer">
      ${tag ? `<span style="position:absolute;left:6px;top:6px;background:rgba(255,255,255,.9);color:#1B3EDB;font-size:9px;font-weight:700;border-radius:999px;padding:2px 6px">${tag}</span>` : ""}
      <div style="position:absolute;left:0;right:0;bottom:0;height:32%;background:linear-gradient(0deg,rgba(0,0,0,.28),transparent)"></div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "我的出镜", sub: "画中画固定来源 · 不用真人录制", back: "E2", act: "上传" })}

    <div class="body">
      <div class="card" style="background:var(--violet-weak);box-shadow:none">
        <div class="row"><span class="tag p">怎么用</span></div>
        <div class="s" style="margin-top:9px;color:#4B2E86;line-height:1.65">混剪时说「要你出镜」的段，会自动从下面挑一张做成圆形画中画，3 秒出现后淡出。不用你真录。</div>
      </div>

      <div class="segtab" style="margin-top:14px">
        <b class="on">照片 12</b><b>小视频 3</b>
      </div>

      <div class="g3" style="gap:9px">
        ${photo(G("#7C5CFF", "#B08CFF"), "默认")}
        ${photo(G("#8B6BFF", "#C4A6FF"), "")}
        ${photo(G("#6B4BE0", "#9B7BFF"), "")}
        ${photo(G("#9B7BFF", "#D0B8FF"), "")}
        ${photo(G("#7C5CFF", "#A78BFA"), "")}
        ${photo(G("#5B3FD1", "#8B6BFF"), "")}
      </div>

      <div style="margin-top:10px;border:1.5px dashed #D9CFEF;border-radius:14px;padding:16px;text-align:center;cursor:pointer">
        <div style="font-size:19px;color:var(--violet)">＋</div>
        <div class="xs" style="margin-top:6px">从相册选 · 建议正面、光线好、不看镜头</div>
      </div>

      ${C.sec("小视频（3 秒片段）")}
      <div class="g3">
        ${photo(G("#2C5BFF", "#5B8CFF"), "3.0s")}
        ${photo(G("#00A8E8", "#00C2FF"), "2.6s")}
        ${photo(G("#5B8CFF", "#8FB0FF"), "3.2s")}
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 120px" data-go="B2.3" data-label="画中画设置">画中画设置</div>
      <div class="btn" data-go="E2" data-label="回到素材库">好了</div>
    </div>
  </div>`;
};
