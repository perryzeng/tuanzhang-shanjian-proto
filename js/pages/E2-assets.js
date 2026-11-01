window.PAGES["E2"].render = function () {
  const C = window.C, G = window.G;

  const mat = (bg, tx, sub, go) =>
    `<div class="tile" data-go="${go}" data-label="${tx}">
      <div class="im" style="aspect-ratio:3/4;background:${bg}"><span style="background:rgba(0,0,0,.32);border-radius:6px;padding:2px 6px">${sub}</span></div>
      <div class="cap"><b>${tx}</b></div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "素材", t: "素材库", act: `<span class="btn-pill">↑ 上传</span>` })}

    <div class="body">
      <div class="gsearch"><span class="mag">⌕</span><span>搜素材，或粘贴链接抓取</span></div>

      <div class="chips" style="margin-bottom:14px">
        <span class="chip on">全部</span><span class="chip">产品空镜</span><span class="chip">成分示意</span>
        <span class="chip">成交截图</span><span class="chip">我的出镜</span>
      </div>

      <div class="card" style="display:flex;align-items:center;gap:12px;background:var(--violet-weak);box-shadow:none;margin-bottom:14px" data-go="E2.1" data-label="我的出镜">
        <div style="width:44px;height:44px;border-radius:50%;background:${G("#7C5CFF", "#B08CFF")};color:#fff;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex:0 0 44px">珍</div>
        <div style="flex:1;min-width:0">
          <div class="h3">我的出镜 <span class="tag p" style="margin-left:4px">画中画专用</span></div>
          <div class="xs" style="margin-top:4px">12 张照片 · 3 段小视频 · 混剪时自动取用</div>
        </div>
        <span style="font-size:12px;font-weight:700;color:var(--violet)">管理</span>
      </div>

      ${C.sec("团队共享", "128 个")}
      <div class="g2" style="margin-bottom:10px">
        ${mat(G("#2C5BFF", "#5B8CFF"), "产品摆台", "12 次", "B2.1")}
        ${mat(G("#00A8E8", "#00C2FF"), "开箱空镜", "8 次", "B2.1")}
      </div>
      <div class="g2" style="margin-bottom:10px">
        ${mat(G("#7C5CFF", "#B08CFF"), "成分特写", "6 次", "B2.1")}
        ${mat(G("#5B8CFF", "#8FB0FF"), "成交截图", "5 次", "B2.1")}
      </div>

      ${C.sec("我上传的", "23 个")}
      <div class="g2">
        ${mat(G("#00C2FF", "#8FE3FF"), "手拿产品", "3 次", "B2.1")}
        ${mat(G("#2C5BFF", "#7C5CFF"), "桌面摆拍", "1 次", "B2.1")}
      </div>

      <div class="card plain" style="margin-top:14px">
        <div class="xs" style="line-height:1.7">团队库是共享资产：别人传的空镜你直接能用，你传的也能被别人剪进视频。</div>
      </div>
    </div>

    ${C.tab("E1")}
  </div>`;
};
