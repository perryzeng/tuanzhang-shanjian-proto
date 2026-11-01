window.PAGES["E3"].prd = "PRD §6.22 · 团队（底部一级 tab：数据 + 公告 + 任务 + 作品/素材/脚本 + 团队动态）";
window.PAGES["E3"].states = [
  { k: "", n: "团队首页：团队数据 + 公告 + 任务 + 三张模块卡 + 整个团队动态" },
  { k: "open=script", n: "团队脚本：动态/最新/精选/目录" },
  { k: "open=asset", n: "团队素材：动态/最新/精选/目录" },
  { k: "open=work", n: "团队作品：动态/最新/精选/目录" }
];

/* 团队 = 底部一级 tab。渲染完全复用素材库 E2 的实现（同一套模块卡 / 四个 tab / 目录整理），
   只是把 side 锁成 team，并把状态写到 E3（而不是 E2），这样「素材」和「团队」各自记各自的位置。 */
window.PAGES["E3"].render = function (ctx) {
  return window.PAGES["E2"].render(Object.assign({}, ctx, { __pid: "E3", __side: "team" }));
};

window.PAGES["E3.1"].prd = "PRD §6.22.1 · 团队信息（基本资料 + 成员通讯录）";
window.PAGES["E3.1"].render = function (ctx) {
  const C = window.C;
  const LIB = window.DATA.library;
  const teams = LIB.teams || [];
  const tid = teams.some((t) => t.id === ctx.tid) ? ctx.tid : (teams[0] || {}).id;
  const team = teams.filter((t) => t.id === tid)[0] || {};
  const mem = LIB.teamMembers || [];
  const totalPosts = mem.reduce((s, m) => s + (m.posts || 0), 0);
  const show = mem.slice(0, 8);
  const more = Math.max(0, (team.members || 0) - show.length);

  const row = (m) => `<div class="tmr" data-label="${m.name}">
      <span class="tav" style="background:${m.bg}">${m.av}</span>
      <div class="tmt"><b>${m.name}${m.role !== "团员" ? `<em>${m.role}</em>` : ""}</b>
        <span>${m.joined}加入 · 本月 ${m.posts} 条</span></div>
      <span class="tmp">${m.phone}</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "团队信息", sub: team.name, back: "E3", act: "邀请" })}

    <div class="body">
      <div class="tinfo" style="background:linear-gradient(135deg,#2C5BFF,#7C5CFF)">
        <span class="tiav">${(team.name || "团").slice(0, 1)}</span>
        <div><b>${team.name}</b><span>${team.brief || ""}</span></div>
      </div>

      <div class="tstat">
        <div><b>${team.members}</b><span>成员</span></div>
        <div><b>${totalPosts}</b><span>本月发布</span></div>
        <div><b>${team.role}</b><span>我的身份</span></div>
      </div>

      <div class="feedhd">团队成员<span>${team.members}</span></div>
      <div class="card" style="padding:2px 14px;border-radius:16px">
        ${show.map(row).join("")}
        ${more ? `<div class="tmr" data-label="更多成员"><span class="tav" style="background:var(--bg-2);color:var(--text-3)">+${more}</span>
          <div class="tmt"><b>还有 ${more} 位成员</b><span>通讯录里可搜索全部</span></div></div>` : ""}
      </div>
    </div>
  </div>`;
};
