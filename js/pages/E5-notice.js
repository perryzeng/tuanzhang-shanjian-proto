window.PAGES["E5"].render = function () {
  const C = window.C;

  const notice = (ic, bg, fg, title, sub, time, unread, go) =>
    `<div class="notice" style="cursor:pointer" data-go="${go}" data-label="${title}">
      ${unread ? `<span class="dot"></span>` : ""}
      <div style="width:38px;height:38px;border-radius:13px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;font-size:16px;flex:0 0 38px;margin-left:${unread ? "12px" : "0"}">${ic}</div>
      <div class="tx">
        <div style="font-size:13px;font-weight:600;line-height:1.4">${title}</div>
        <div class="xs" style="margin-top:4px;line-height:1.45">${sub}</div>
        <div class="xs" style="margin-top:5px;color:var(--text-4)">${time}</div>
      </div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "通知", sub: "3 条未读", back: "A1", act: "全部已读" })}

    <div class="body">
      <div class="segtab" style="margin-bottom:6px">
        <b class="on">全部 12</b><b>任务</b><b>团队</b><b>系统</b>
      </div>

      <div class="card" style="padding:2px 16px 6px">
        ${notice("✦", "var(--brand-weak)", "var(--brand)", "今天的 3 条候选已经生成好了", "按「信任背书」主题生成，都用你的声音", "10 分钟前", true, "T2")}
        ${notice("◍", "var(--violet-weak)", "var(--violet)", "阿玲发了新爆款，播放 8.6 万", "磷虾油 3 段式 · 你可以直接剪同款", "32 分钟前", true, "C1")}
        ${notice("⚑", "var(--warm-weak)", "#D9541F", "任务即将截止", "「信任背书口播」今天 22:00 截止，还差 24 人", "1 小时前", true, "E4")}
      </div>

      ${C.sec("更早")}
      <div class="card" style="padding:2px 16px 6px">
        ${notice("✓", "var(--success-weak)", "var(--success)", "昨天的视频跑了 1.2 万播放", "「3 步挑对磷虾油」已带来 27 个潜在客户", "昨天 20:14", false, "B4.1")}
        ${notice("▤", "var(--brand-weak)", "var(--brand)", "素材库更新了 6 条空镜", "小敏上传 · 产品摆台类", "昨天 16:30", false, "E2")}
        ${notice("◎", "var(--bg)", "var(--text-2)", "本周战报已生成", "团队 128 条，你排第 7", "昨天 09:00", false, "E1")}
      </div>
    </div>

    ${C.tab("E1")}
  </div>`;
};
