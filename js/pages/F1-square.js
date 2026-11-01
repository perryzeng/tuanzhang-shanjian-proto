window.PAGES["F1"].render = function () {
  const C = window.C, G = window.G;

  const tile = (bg, tx, sub, go) =>
    `<div class="tile" data-go="${go}" data-label="${tx}">
      <div class="im" style="aspect-ratio:3/4;background:${bg}">
        <span style="background:rgba(0,0,0,.3);border-radius:6px;padding:2px 6px">${sub}</span>
      </div>
      <div class="cap"><b>${tx}</b><span>1.2 万人用过</span></div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "创意广场", t: "抄作业的地方", act: `<span class="btn-pill line">我的收藏</span>` })}

    <div class="body">
      <div class="gsearch"><span class="mag">⌕</span><span>搜模板、脚本、主题</span></div>

      <div class="chips" style="margin-bottom:14px">
        <span class="chip on">全部</span><span class="chip">磷虾油</span><span class="chip">大健康</span>
        <span class="chip">开箱</span><span class="chip">口播</span><span class="chip">晒单</span>
      </div>

      <div class="card" style="padding:0;overflow:hidden;cursor:pointer" data-go="F3" data-label="本周爆款第一名">
        <div style="height:168px;background:${G("#7C5CFF", "#B08CFF")};position:relative">
          <span style="position:absolute;left:12px;top:12px;background:rgba(255,255,255,.92);color:#5B3FD1;font-size:10px;font-weight:700;border-radius:999px;padding:3px 9px">本周 Top1</span>
          <span style="position:absolute;right:12px;top:12px;background:rgba(0,0,0,.35);color:#fff;font-size:10px;border-radius:999px;padding:3px 9px">8.6 万播放</span>
        </div>
        <div style="padding:14px">
          <div class="h2">磷虾油 3 段式 · 信任版</div>
          <div class="s" style="margin-top:6px">3 段 40 秒，开场提问 + 使用感受 + 开团。已 128 人使用。</div>
          <div class="row" style="gap:8px;margin-top:12px">
            <div style="width:28px;height:28px;border-radius:50%;background:${G("#2C5BFF", "#5B8CFF")};color:#fff;font-size:11px;display:flex;align-items:center;justify-content:center">玲</div>
            <span class="xs">阿玲 · 团队 Top1</span>
            <span class="btn-pill" style="margin-left:auto">用同款</span>
          </div>
        </div>
      </div>

      ${C.sec("主题合集", "全部")}
      <div class="g2" style="margin-bottom:10px">
        <div class="card" style="padding:14px;background:${G("#2C5BFF", "#5B8CFF")};color:#fff;cursor:pointer" data-go="F3" data-label="开箱实拍合集">
          <div style="font-size:13.5px;font-weight:700">开箱实拍</div>
          <div style="font-size:11px;opacity:.78;margin-top:5px">8 个模板 · 3.2 万人用过</div>
        </div>
        <div class="card" style="padding:14px;background:${G("#00A8E8", "#00C2FF")};color:#fff;cursor:pointer" data-go="F3" data-label="口播讲解合集">
          <div style="font-size:13.5px;font-weight:700">口播讲解</div>
          <div style="font-size:11px;opacity:.78;margin-top:5px">12 个模板 · 2.6 万人用过</div>
        </div>
      </div>

      ${C.sec("大家都在用")}
      <div class="g3">
        ${tile(G("#2C5BFF", "#00C2FF"), "成分拆解", "6 段", "F3")}
        ${tile(G("#7C5CFF", "#B08CFF"), "晒单合集", "4 段", "F3")}
        ${tile(G("#00A8E8", "#7C5CFF"), "对比测评", "5 段", "F3")}
      </div>
      <div class="g3" style="margin-top:10px">
        ${tile(G("#5B8CFF", "#8FB0FF"), "开团倒计时", "3 段", "F3")}
        ${tile(G("#2C5BFF", "#5B8CFF"), "长辈关心的点", "4 段", "F3")}
        ${tile(G("#00C2FF", "#8FE3FF"), "囤货攻略", "5 段", "F3")}
      </div>
    </div>

    ${C.tab("F1")}
  </div>`;
};
