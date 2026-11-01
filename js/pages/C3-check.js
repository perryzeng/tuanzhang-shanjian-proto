window.PAGES["C3"].render = function () {
  const C = window.C;

  const score = (n, t, sub, color, w) =>
    `<div style="display:flex;align-items:center;gap:12px;padding:12px 0">
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600">${t}</div>
        <div class="xs" style="margin-top:3px">${sub}</div>
        <div class="bar" style="margin-top:8px"><i style="width:${w}%;background:${color}"></i></div>
      </div>
      <span style="font-size:15px;font-weight:700;color:${color};font-variant-numeric:tabular-nums">${n}</span>
    </div>`;

  const check = (ok, t, sub) =>
    `<div class="kv"><span class="k" style="display:flex;align-items:center;gap:8px">
      <span style="width:18px;height:18px;border-radius:50%;background:${ok ? "var(--success-weak)" : "var(--danger-weak)"};color:${ok ? "var(--success)" : "var(--danger)"};font-size:10px;display:flex;align-items:center;justify-content:center">${ok ? "✓" : "!"}</span>
      <span>${t}<small style="display:block;color:var(--text-3);font-size:11px;margin-top:2px">${sub}</small></span></span>
      <span class="v" style="font-size:12px;color:${ok ? "var(--success)" : "var(--danger)"}">${ok ? "通过" : "待处理"}</span></div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "二创检查站", sub: "发出去之前最后一道关", back: "B2", act: "规则" })}

    <div class="body">
      <div class="hero" style="text-align:center;padding:22px 18px">
        <div class="lb">二创安全度</div>
        <div class="num" style="font-size:44px;margin:6px 0 4px">62</div>
        <div class="sub">及格线 60 · 可以发，但还能更安全</div>
        <div class="bar" style="margin-top:14px;background:rgba(255,255,255,.16)"><i style="width:62%;background:linear-gradient(90deg,#8FE3FF,#fff)"></i></div>
      </div>

      <div class="card" style="margin-top:14px;padding:4px 16px 8px">
        ${score("+18", "改动段数", "6 段里改了 2 段", "#2C5BFF", 34)}
        ${score("+26", "文案差异", "语义相似度 38%", "#00A8E8", 62)}
        ${score("+18", "画面差异", "2/3 画面已换成本地素材", "#7C5CFF", 48)}
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">再改 1 段（比如第 4 段换成你自己的说法），安全度可到 <b style="color:var(--brand)">74</b>，过审更稳。</div>
      </div>

      ${C.sec("发布前体检")}
      <div class="card" style="padding:4px 16px 8px">
        ${check(true, "违规词检测", "美颜/最/第一 等 12 类敏感词")}
        ${check(true, "AI 标注", "AI 生成画面已打标")}
        ${check(false, "结尾素材缺失", "第 6 段花字卡还没做")}
        ${check(true, "时长与比例", "52 秒 · 9:16")}
      </div>
    </div>

    <div class="actionbar">
      <div class="btn line" style="flex:0 0 118px" data-go="B2?kind=remix" data-label="回去再改一段">再改 1 段</div>
      <div class="btn" data-go="B2.4?from=C3" data-label="生成并去定模板封面">生成 · 下一步</div>
    </div>
  </div>`;
};
