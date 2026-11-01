window.PAGES["F3"].render = function () {
  const C = window.C;

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

  const ico = {
    play: `<svg viewBox="0 0 24 24"><path d="M9 7.5v9l7-4.5z"/></svg>`,
    heart: `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9z"/></svg>`,
    star: `<svg viewBox="0 0 24 24"><path d="M12 4.5l2.3 4.7 5.2.8-3.8 3.7.9 5.2-4.6-2.4-4.6 2.4.9-5.2L4.5 10l5.2-.8z"/></svg>`
  };
  const stat = (icon, num, label) =>
    `<div class="tstat-i"><span class="ic">${ico[icon]}</span><b>${num}</b><span class="lb">${label}</span></div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "磷虾油 3 段式 · 信任版", sub: "阿玲 · 已用 128 次", back: "F1", act: "收藏" })}

    <div class="body">
      <div style="width:172px;margin:0 auto;border-radius:18px;overflow:hidden;background:${window.G("#7C5CFF", "#B08CFF")};position:relative;aspect-ratio:9/16;box-shadow:var(--sh-2)">
        <img src="assets/gen/t-compare.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9">
        <span style="position:absolute;left:12px;top:12px;background:rgba(0,0,0,.35);color:#fff;font-size:10px;border-radius:999px;padding:3px 9px">00:40</span>
        <div style="position:absolute;left:0;right:0;bottom:0;padding:16px;background:linear-gradient(0deg,rgba(0,0,0,.62),transparent);color:#fff">
          <div style="font-size:15px;font-weight:700;line-height:1.4">磷虾油 3 段式 · 信任版</div>
          <div style="font-size:11.5px;opacity:.8;margin-top:5px">3 段 · 40 秒 · 9:16</div>
        </div>
        <div style="position:absolute;left:50%;top:44%;transform:translate(-50%,-50%);width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--brand)">▶</div>
      </div>

      <div class="tstats">
        ${stat("play", "128", "使用")}
        ${stat("heart", "3.2万", "点赞")}
        ${stat("star", "8,600", "收藏")}
      </div>

      ${C.sec("分段时间轴", "AI 拆解")}
      <div class="card" style="padding:6px 16px 8px">
        ${seg("01", "开场提问", "8s", "「你有没有买过假的磷虾油？」先制造身份认同")}
        ${seg("02", "使用感受", "14s", "讲自己吃多久、身体什么变化，不要数据")}
        ${seg("03", "开团 CTA", "8s", "点我头像进团，今天只有 500 单")}
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">去剪辑会把 3 段拆进编辑器，脚本和素材按模板先配好，你再逐段换。</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-go="B2?kind=script&src=tpl&struct=s3&tpl=tp_trust" data-label="去剪辑">去剪辑</div>
    </div>
  </div>`;
};
