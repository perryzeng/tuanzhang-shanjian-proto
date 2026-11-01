window.PAGES["E4"].render = function () {
  const C = window.C, G = window.G;

  const mem = (av, bg, nm, done, total, state, stateCls) =>
    `<div class="vline" data-go="E5" data-label="通知 ${nm}">
      <div class="av" style="background:${bg}">${av}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:12.5px;font-weight:600">${nm}</div>
        <div class="xs" style="margin-top:3px">已完成 ${done}/${total} 条</div>
      </div>
      <span class="tag ${stateCls}">${state}</span>
      <span class="btn-pill ${done >= total ? "line" : ""}" style="height:28px;font-size:11.5px">${done >= total ? "已达标" : "催办"}</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "任务派发", sub: "磷虾油系列 · Day 5", back: "E1", act: "新建" })}

    <div class="body">
      <div class="hero">
        <div class="row"><span class="lb">今日派发完成率</span>
          <span style="margin-left:auto;font-size:11.5px;background:rgba(255,255,255,.16);border-radius:999px;padding:4px 11px">86 人</span></div>
        <div class="num">64<small>%</small></div>
        <div class="sub">55 人已完成 · 31 人未开始</div>
        <div class="bar" style="margin-top:14px;background:rgba(255,255,255,.16)"><i style="width:64%;background:linear-gradient(90deg,#8FE3FF,#fff)"></i></div>
      </div>

      ${C.sec("进行中的任务", "全部 3 条")}
      <div class="card" style="margin-bottom:10px">
        <div class="row"><span class="tag b">必做</span><span class="xs" style="margin-left:auto">截止今天 22:00</span></div>
        <div class="h3" style="margin-top:9px">发 1 条信任背书口播</div>
        <div class="bar" style="margin:11px 0 8px"><i style="width:72%;background:var(--g-brand)"></i></div>
        <div class="xs">62/86 人完成</div>
      </div>
      <div class="card" style="margin-bottom:10px">
        <div class="row"><span class="tag">选做</span><span class="xs" style="margin-left:auto">截止明天 12:00</span></div>
        <div class="h3" style="margin-top:9px">剪 2 条本周爆款同款</div>
        <div class="bar" style="margin:11px 0 8px"><i style="width:38%;background:var(--g-violet)"></i></div>
        <div class="xs">33/86 人完成</div>
      </div>

      ${C.sec("成员进度", "按完成率")}
      <div class="card" style="padding:2px 16px 6px">
        ${mem("玲", G("#2C5BFF", "#5B8CFF"), "阿玲", 3, 3, "已完成", "g")}
        ${mem("强", G("#7C5CFF", "#B08CFF"), "阿强", 2, 3, "进行中", "b")}
        ${mem("敏", G("#00A8E8", "#00C2FF"), "小敏", 1, 3, "落后", "o")}
        ${mem("华", G("#5B8CFF", "#8FB0FF"), "阿华", 0, 3, "未开始", "r")}
        ${mem("珍", G("#2C5BFF", "#00C2FF"), "你", 2, 3, "进行中", "b")}
      </div>

      <div class="card plain" style="margin-top:12px">
        <div class="xs" style="line-height:1.7">催办会发一条企业微信提醒，同一个人 2 小时内只提醒一次。</div>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px" data-go="E5" data-label="通知中心"><span style="font-size:13px">◔</span><b>通知</b></div>
      <div class="btn" data-go="E1" data-label="一键催办未完成">一键催办 31 人</div>
    </div>
  </div>`;
};
