window.PAGES["B2.1"].render = function () {
  const C = window.C;

  const mat = (bg, label, meta, sel) =>
    `<div class="mat ${sel ? "sel" : ""}" style="border-width:${sel ? "2px" : "0"}" data-go="B2" data-label="选「${label}」">
      <div style="aspect-ratio:3/4;border-radius:9px;background:${bg};display:flex;align-items:flex-end;padding:6px;color:#fff;font-size:9.5px;font-weight:700;position:relative">
        <span style="background:rgba(0,0,0,.38);border-radius:5px;padding:2px 5px">${meta}</span>
        ${sel ? `<span style="position:absolute;right:5px;top:5px;width:16px;height:16px;border-radius:50%;background:var(--brand);color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center">✓</span>` : ""}
      </div>
      <div class="cap">${label}</div>
    </div>`;

  return `<div class="app">
    <div style="position:absolute;inset:0;background:linear-gradient(150deg,#2C5BFF,#5B8CFF);opacity:0"></div>

    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B2" data-label="返回发布器">‹</span>
      <div class="ttl">发布器 · 磷虾油今晚开团<small>给第 2 段配画面</small></div>
    </div>

    ${C.estage({
      preview: { bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", no: "02/05", cap: "今晚开团磷虾油，选购门道一次讲清楚", pip: true },
      code: "00:12 / 00:40",
      track: [[8, "done"], [14, "cur"], [10, ""], [10, ""], [6, ""]],
      now: `<b>第 2 段 · 磷虾油是什么</b><br>主画面：你的小视频 3s + 团队库特写`
    })}

    <div class="body" style="padding-top:0;opacity:.35;pointer-events:none">
      ${C.seg({ no: "01", name: "我是谁 · 立信任", dur: "8s", vo: "我是阿珍，做大健康选品 5 年。", clips: [{ bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", label: "空镜", pip: true }] })}
      ${C.seg({ no: "02", name: "磷虾油是什么", dur: "14s", vo: "今晚开团磷虾油，选购门道一次讲清楚。", clips: [{ bg: "linear-gradient(150deg,#7C5CFF,#B08CFF)", label: "小视频" }] })}
    </div>

    <div class="sheet">
      <div class="sheet-in">
        <div class="sheet-h">
          <div class="row">
            <div style="flex:1">
              <div class="t1">给「第 2 段 · 磷虾油是什么」配画面</div>
              <div class="t2">台词：「今晚开团磷虾油，选购门道一次讲清楚…」</div>
            </div>
            <span style="font-size:12px;font-weight:700;color:var(--brand);cursor:pointer" data-go="B2" data-label="关闭选择器">关闭</span>
          </div>
          <div style="margin-top:10px;background:var(--warm-weak);border-radius:9px;padding:8px 10px;font-size:11.5px;color:#D9541F;line-height:1.5">
            <b>画面建议：</b>拍你手拿产品的特写（顺手 3 秒即可），再配一个团队库特写
          </div>
        </div>

        <div class="sheet-b">
          <div class="tabs2">
            <b class="on">推荐 12</b><b>团队库</b><b>我的出镜</b><b>图库</b>
          </div>
          <div class="mgrid">
            ${mat("linear-gradient(150deg,#7C5CFF,#B08CFF)", "手拿产品特写", "你的 · 3s", true)}
            ${mat("linear-gradient(150deg,#00A8E8,#00C2FF)", "产品摆台", "团队 · 4s")}
            ${mat("linear-gradient(150deg,#2C5BFF,#5B8CFF)", "开箱空镜", "团队 · 6s")}
            ${mat("linear-gradient(150deg,#7C5CFF,#2C5BFF)", "成分特写", "AI · 3s")}
            ${mat("linear-gradient(150deg,#7C5CFF,#B08CFF)", "你本人出镜", "照片 · 画中画")}
            ${mat("linear-gradient(150deg,#2C5BFF,#00A8E8)", "成交截图", "团队 · 2s")}
          </div>
          <div class="xs" style="margin-top:12px;text-align:center">找不到？可以直接拍一段，或粘链接抓取</div>
          <div class="row" style="gap:8px;margin-top:10px">
            <div class="btn line" style="height:38px;font-size:13px" data-go="B2.2" data-label="去随手拍">＋ 随手拍 3 秒</div>
            <div class="btn line" style="height:38px;font-size:13px" data-go="B2.3" data-label="画中画配置">▣ 画中画</div>
          </div>
        </div>

        <div class="sheet-f">
          <div class="btn" data-go="B2" data-label="用这个片段">用这个片段 · 替换第 1 个画面</div>
        </div>
      </div>
    </div>
  </div>`;
};
