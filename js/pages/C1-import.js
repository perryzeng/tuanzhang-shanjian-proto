window.PAGES["C1"].render = function () {
  const C = window.C, G = window.G;

  const step = (cls, ic, tx, side) =>
    `<div class="gstep ${cls}" style="justify-content:flex-start"><span class="dot">${ic}</span><span style="flex:1;text-align:left">${tx}</span><span style="font-size:11px">${side || ""}</span></div>`;

  const hot = (bg, tx, n) =>
    `<div style="flex:0 0 104px;cursor:pointer" data-go="F3" data-label="同款 ${tx}">
      <div style="height:138px;border-radius:16px;background:${bg};position:relative;overflow:hidden">
        <span style="position:absolute;right:6px;top:6px;background:rgba(0,0,0,.35);color:#fff;font-size:9px;border-radius:999px;padding:2px 6px">${n}</span>
      </div>
      <div style="font-size:12px;font-weight:600;margin-top:7px">${tx}</div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "剪同款", sub: "导入别人的爆款，改成你的", back: "B1" })}

    <div class="body">
      <div class="card" style="display:flex;align-items:center;gap:12px;margin-bottom:11px" data-go="B2?kind=remix" data-label="导入本地视频">
        <div style="width:46px;height:46px;border-radius:15px;background:var(--brand-weak);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:19px;flex:0 0 46px">↓</div>
        <div style="flex:1;min-width:0">
          <div class="h3">导入本地视频</div>
          <div class="xs" style="margin-top:3px">相册里的任意竖屏视频，最长 3 分钟</div>
        </div>
        <span class="btn-pill">选择</span>
      </div>

      <div class="card">
        <div class="row"><span class="h3">粘贴链接</span><span class="tag b" style="margin-left:auto">支持 3 个平台</span></div>
        <div style="margin-top:10px;background:#F5F7FC;border-radius:14px;padding:11px 13px;font-size:12.5px;color:var(--text-2);line-height:1.5">
          https://v.douyin.com/iRk8xQ2t/ <span style="color:var(--text-4)">· 阿玲的磷虾油视频</span>
        </div>
        <div class="row" style="gap:6px;margin-top:10px">
          <span class="pill">抖音</span><span class="pill">视频号</span><span class="pill">小红书</span>
        </div>
        <div class="btn" style="margin-top:14px" data-go="B2?kind=remix" data-label="开始拆解">开始拆解</div>
      </div>

      <div class="card" style="margin-top:14px">
        <div class="row"><span class="h3">拆解进度</span><span class="tag g">已抓取文案</span></div>
        <div class="gsteps" style="margin-top:12px;gap:11px">
          ${step("done", "✓", "下载视频", "12.4 MB")}
          ${step("done", "✓", "识别口播文案", "312 字")}
          ${step("done", "✓", "拆成 6 段", "52 秒")}
          ${step("now", "●", "匹配可替换素材", "进行中")}
        </div>
      </div>

      ${C.sec("本周热门同款", "全部", "F1")}
      <div class="chips" style="gap:10px;padding-bottom:6px">
        ${hot(G("#2C5BFF", "#00C2FF"), "磷虾油 3 段式", "8.6 万")}
        ${hot(G("#7C5CFF", "#B08CFF"), "开箱即口播", "5.2 万")}
        ${hot(G("#00A8E8", "#7C5CFF"), "对比测评", "3.1 万")}
      </div>
    </div>
  </div>`;
};
