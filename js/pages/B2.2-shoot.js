window.PAGES["B2.2"].render = function () {
  const C = window.C;
  return `<div class="app" style="background:#0B1330">
    ${C.sb(true)}
    <div class="ab">
      <span class="back" data-go="B2" data-label="返回发布器" style="background:rgba(255,255,255,.14);color:#fff">‹</span>
      <div class="ttl" style="color:#fff">拍第 2 段画面<small style="color:rgba(255,255,255,.55)">拍完自动进混剪</small></div>
      <span class="act" style="color:#8FE3FF">相册</span>
    </div>

    <div style="margin:0 16px 12px;background:rgba(143,227,255,.12);border-radius:14px;padding:11px 13px;font-size:11.5px;color:#8FE3FF;line-height:1.5">
      <b>拍什么：</b>手拿产品对着镜头晃一下，3 秒就够，不用说话
    </div>

    <div style="flex:1;margin:0 16px;border-radius:22px;background:linear-gradient(160deg,#16224A,#0E1730);position:relative;overflow:hidden">
      <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px);background-size:33.3% 33.3%"></div>
      <div style="position:absolute;left:50%;top:52%;transform:translate(-50%,-50%);text-align:center">
        <div style="width:150px;height:210px;border:2px dashed rgba(143,227,255,.5);border-radius:110px 110px 24px 24px;margin:0 auto"></div>
        <div style="margin-top:16px;font-size:12px;color:rgba(255,255,255,.6)">把手和产品放进去</div>
      </div>
      <div style="position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:rgba(0,0,0,.45);color:#fff;font-size:11.5px;border-radius:999px;padding:6px 14px">已录 0.0s / 3.0s</div>
    </div>

    <div style="padding:18px 16px 26px;display:flex;align-items:center;justify-content:space-between">
      <div style="width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px">相册</div>
      <div data-go="B2" data-label="拍完用这段" style="width:74px;height:74px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;cursor:pointer">
        <div style="width:58px;height:58px;border-radius:50%;background:var(--g-brand)"></div>
      </div>
      <div style="width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px">⇄</div>
    </div>
  </div>`;
};
