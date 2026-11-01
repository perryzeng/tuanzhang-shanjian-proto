window.PAGES["E1"].render = function () {
  const C = window.C, G = window.G;

  const rank = (no, nm, val, cls) =>
    `<div class="rank ${cls || ""}"><span class="no">${no}</span>
      <span style="width:26px;height:26px;border-radius:50%;background:${G("#2C5BFF", "#5B8CFF")};color:#fff;font-size:10.5px;display:flex;align-items:center;justify-content:center;flex:0 0 26px">${nm.slice(-1)}</span>
      <span class="nm">${nm}</span><span class="val">${val}</span></div>`;

  const feed = (av, bg, name, action, time, extra) =>
    `<div class="feed">
      <div class="av" style="background:${bg}">${av}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px;line-height:1.55"><b>${name}</b> ${action}</div>
        <div class="xs" style="margin-top:3px">${time}</div>
        ${extra || ""}
      </div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "团队", t: "86 人在跑同一个主题系列", av: "团" })}

    <div class="body">
      <div class="card" style="background:var(--g-brand);box-shadow:var(--sh-2);color:#fff">
        <div class="row"><span class="tag" style="background:rgba(255,255,255,.22);color:#fff">公告</span><span class="xs" style="margin-left:auto;color:rgba(255,255,255,.75)">已读 68/86</span></div>
        <div style="font-size:14px;font-weight:700;margin-top:10px;line-height:1.5">本周磷虾油统一口径更新：不能说「治疗」，改成「帮助」</div>
        <div style="font-size:11.5px;color:rgba(255,255,255,.78);margin-top:6px">团长 · 今天 09:12</div>
      </div>

      <div class="card" style="margin-top:12px;display:flex;align-items:center;gap:12px" data-go="F3" data-label="主推模板">
        <div style="width:44px;height:58px;border-radius:12px;background:${G("#7C5CFF", "#B08CFF")};flex:0 0 44px"></div>
        <div style="flex:1;min-width:0">
          <div class="row"><span class="tag p">置顶</span><span class="xs">主推模板</span></div>
          <div class="h3" style="margin-top:6px">磷虾油 3 段式（本周官方版）</div>
          <div class="xs" style="margin-top:3px">86 人已用 · 平均播放 3.2 万</div>
        </div>
        <span class="btn-pill">用同款</span>
      </div>

      ${C.sec("本周目标", "看战报", "E4")}
      <div class="card">
        <div class="row"><span class="h2">团队已发 128 条</span><span class="xs" style="margin-left:auto">目标 200 条</span></div>
        <div class="bar" style="margin:11px 0 14px"><i style="width:64%"></i></div>
        ${rank("1", "阿玲", "18 条", "top1")}
        ${rank("2", "阿强", "15 条", "top2")}
        ${rank("3", "小敏", "12 条", "top3")}
        <div class="rank" style="background:var(--brand-weak);border-radius:12px;padding:9px 10px;margin-top:4px">
          <span class="no" style="color:var(--brand)">7</span>
          <span style="width:26px;height:26px;border-radius:50%;background:#DDE6FF;color:var(--brand);font-size:10.5px;display:flex;align-items:center;justify-content:center;flex:0 0 26px">我</span>
          <span class="nm">你</span><span class="val" style="color:var(--brand);font-weight:700">9 条</span>
        </div>
      </div>

      ${C.sec("团队在动", "全部")}
      <div class="card" style="padding:4px 16px 8px">
        ${feed("玲", G("#2C5BFF", "#5B8CFF"), "阿玲", "用「磷虾油 3 段式」发了 1 条，<b style='color:#0B8C68'>播放 8.6 万</b>", "12 分钟前 · 可直接剪同款",
          `<div class="btn-pill ghost" style="margin-top:9px;height:28px" data-go="C1" data-label="剪阿玲的同款">剪同款</div>`)}
        ${feed("强", G("#7C5CFF", "#B08CFF"), "阿强", "在群里求助：<span style='color:var(--text-2)'>开团话术怎么过审</span>", "38 分钟前 · 3 条回复")}
        ${feed("敏", G("#00A8E8", "#00C2FF"), "小敏", "上传了 6 条产品摆台空镜，<b style='color:var(--brand)'>素材库已更新</b>", "1 小时前",
          `<div class="btn-pill ghost" style="margin-top:9px;height:28px" data-go="E2" data-label="去看素材">去看素材</div>`)}
      </div>
    </div>

    ${C.tab("E2")}
  </div>`;
};
