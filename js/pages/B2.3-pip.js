window.PAGES["B2.3"].render = function () {
  const C = window.C, G = window.G;

  const corner = (pos, on, label) =>
    `<div style="aspect-ratio:1;border-radius:10px;background:${on ? "var(--brand-weak)" : "#F3F5FA"};box-shadow:${on ? "inset 0 0 0 1.5px var(--brand)" : "none"};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:10px;color:${on ? "var(--brand-ink)" : "var(--text-3)"};font-weight:${on ? 700 : 400}">${label}</div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "画中画配置", sub: "照片出镜 · 第 2 段", back: "B2", act: "应用" })}

    <div class="body">
      <div style="display:flex;justify-content:center">
        <div style="width:190px;position:relative;border-radius:16px;overflow:hidden;background:${G("#2C5BFF", "#5B8CFF")};aspect-ratio:9/16">
          <div style="position:absolute;left:0;right:0;bottom:0;padding:8px;background:linear-gradient(0deg,rgba(0,0,0,.5),transparent);color:#fff;font-size:10px">今晚开团磷虾油</div>
          <div style="position:absolute;right:10px;bottom:52px;width:64px;height:64px;border-radius:50%;background:${G("#7C5CFF", "#B08CFF")};box-shadow:0 0 0 2px #fff,0 8px 20px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:700">珍</div>
        </div>
      </div>

      ${C.sec("位置")}
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
        ${corner("lt", false, "左上")}
        ${corner("rt", false, "右上")}
        ${corner("lb", true, "右下")}
        ${corner("ct", false, "居中")}
      </div>

      ${C.sec("大小")}
      <div class="card" style="padding:14px">
        <div class="row" style="gap:12px">
          <span class="xs" style="width:28px">小</span>
          <input type="range" min="0" max="100" value="46" style="flex:1;accent-color:var(--brand)">
          <span class="xs" style="width:28px;text-align:right">大</span>
        </div>
        <div class="row" style="gap:10px;margin-top:14px">
          <span class="pill on">圆形</span>
          <span class="pill">圆角矩形</span>
          <span class="pill">描边</span>
        </div>
      </div>

      ${C.sec("出现时长")}
      <div class="card" style="padding:14px">
        <div class="kv" style="padding-top:0"><span class="k">全程出现</span><span class="switch on"><i></i></span></div>
        <div class="kv" style="padding-bottom:0"><span class="k">前 3 秒出现后淡出</span><span class="switch"><i></i></span></div>
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs">照片画中画是这个产品的默认出镜方式：不用真录，观众看到的是你在产品旁边。</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="E2.1" data-label="换照片"><span style="font-size:13px">▤</span><b>换照片</b></div>
      <div class="btn" data-go="B2" data-label="应用画中画">应用</div>
    </div>
  </div>`;
};
