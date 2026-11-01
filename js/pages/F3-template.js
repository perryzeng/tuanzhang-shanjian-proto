window.PAGES["F3"].render = function () {
  const C = window.C, G = window.G;

  const seg = (no, t, dur, tip) =>
    `<div style="display:flex;gap:11px;padding:11px 0;position:relative">
      <div style="width:22px;flex:0 0 22px;text-align:center">
        <div style="width:22px;height:22px;border-radius:50%;background:var(--brand-weak);color:var(--brand-ink);font-size:10.5px;font-weight:700;display:flex;align-items:center;justify-content:center">${no}</div>
      </div>
      <div style="flex:1;min-width:0">
        <div class="row"><span style="font-size:13px;font-weight:600">${t}</span><span class="seg-dur">${dur}</span></div>
        <div class="xs" style="margin-top:4px;line-height:1.5">${tip}</div>
      </div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "磷虾油 3 段式 · 信任版", sub: "阿玲 · 已用 128 次", back: "F1", act: "收藏" })}

    <div class="body">
      <div style="width:172px;margin:0 auto;border-radius:18px;overflow:hidden;background:${G("#7C5CFF", "#B08CFF")};position:relative;aspect-ratio:9/16;box-shadow:var(--sh-2)">
        <span style="position:absolute;left:12px;top:12px;background:rgba(0,0,0,.35);color:#fff;font-size:10px;border-radius:999px;padding:3px 9px">00:40</span>
        <div style="position:absolute;left:0;right:0;bottom:0;padding:16px;background:linear-gradient(0deg,rgba(0,0,0,.55),transparent);color:#fff">
          <div style="font-size:15px;font-weight:700;line-height:1.4">磷虾油 3 段式 · 信任版</div>
          <div style="font-size:11.5px;opacity:.8;margin-top:5px">3 段 · 40 秒 · 9:16</div>
        </div>
        <div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--brand)">▶</div>
      </div>

      <div class="lstat" style="margin-top:14px;grid-template-columns:repeat(3,1fr)">
        <div class="ls" style="padding:11px"><b style="font-size:17px">128</b><span>使用次数</span></div>
        <div class="ls" style="padding:11px"><b style="font-size:17px">3.2万</b><span>点赞数</span></div>
        <div class="ls" style="padding:11px"><b style="font-size:17px">8,600</b><span>收藏数</span></div>
      </div>

      ${C.sec("分段时间轴", "AI 拆解")}
      <div class="card" style="padding:6px 16px 8px">
        ${seg("01", "开场提问", "8s", "「你有没有买过假的磷虾油？」先制造身份认同")}
        ${seg("02", "使用感受", "14s", "讲自己吃多久、身体什么变化，不要数据")}
        ${seg("03", "开团 CTA", "8s", "点我头像进团，今天只有 500 单")}
      </div>

      <div class="card" style="margin-top:12px;display:flex;align-items:center;gap:11px" data-go="E1" data-label="看作者">
        <div style="width:36px;height:36px;border-radius:50%;background:${G("#2C5BFF", "#5B8CFF")};color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex:0 0 36px">玲</div>
        <div style="flex:1">
          <div class="h3">阿玲</div>
          <div class="xs" style="margin-top:3px">团队 Top1 · 本月 18 条 · 平均 3.2 万播放</div>
        </div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">用同款后，AI 会把这 3 段拆进发布器，标出建议你换的段（一般是出镜和 CTA）。</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="E1" data-label="看作者主页"><span style="font-size:13px">◍</span><b>作者</b></div>
      <div class="btn" data-go="C1" data-label="用同款">用同款 · 改成我的</div>
    </div>
  </div>`;
};
