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

/* 建团队：先买席位（10 席起，¥10/席），买完建团队再邀请 */
window.PAGES["E3.0"].prd = "PRD §6.22.2 · 新建团队（先买席位，10 席起）";
window.PAGES["E3.0"].render = function (ctx) {
  const C = window.C, LIB = window.DATA.library;
  const plans = window.DATA.seatPlans || [{ seats: 10, pay: 100 }];
  const sel = plans.filter((p) => String(p.seats) === String(ctx.seats))[0] || plans[0];
  const name = (ctx.name || "").replace(/"/g, "&quot;");
  const done = ctx.done === "1";
  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "新建团队", sub: "先购买席位，再建团队", back: "G1" })}
    <div class="body">
      ${done ? `<div class="okbar">已创建团队「${name || "新团队"}」并购买 ${sel.seats} 席 · 支付 ¥${sel.pay}（演示）</div>
        <div style="margin-top:16px"><div class="btn ai" data-go="E3" data-label="进入团队">进入团队 ›</div></div>` : `
      <div class="card" style="padding:14px">
        <div class="s" style="margin-bottom:8px">团队名称</div>
        <input data-bind="E3.0.name" data-live value="${name}" placeholder="给团队起个名字"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
      </div>
      <div class="feedhd">购买席位</div>
      <div class="plans">
        ${plans.map((p) => `<div class="plan${p.seats === sel.seats ? " on" : ""}" data-set="E3.0.seats=${p.seats}">
          <b>${p.seats}<i>席</i></b><span>¥${p.pay}</span>${p.tag ? `<em>${p.tag}</em>` : ""}</div>`).join("")}
      </div>
      <div class="note" style="margin:12px 2px 0;line-height:1.7">¥10 / 席，10 席起购；1 个成员占 1 席，之后可随时加购。</div>
      <div style="margin-top:16px"><div class="btn ai" data-set="E3.0.done=1" data-label="创建并支付">创建并支付 ¥${sel.pay}</div></div>`}
    </div>
  </div>`;
};

/* 席位管理：看总/已用/剩余，加购（10/20/50 席） */
window.PAGES["E3.2"].prd = "PRD §6.22.3 · 席位管理（¥10/席，10 席起购）";
window.PAGES["E3.2"].render = function (ctx) {
  const C = window.C, LIB = window.DATA.library;
  const team = (LIB.teams || [])[0] || {};
  const s = window.DATA.seatInfo || { total: 20, used: 12, price: 10, min: 10 };
  const plans = window.DATA.seatPlans || [{ seats: 10, pay: 100 }];
  const sel = plans.filter((p) => String(p.seats) === String(ctx.seats))[0] || plans[0];
  const paid = parseInt(ctx.paid || "0", 10) || 0;
  const total = s.total + paid;
  const left = total - s.used;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "席位管理", sub: team.name || "", back: "E3", act: "账单" })}
    <div class="body">
      ${paid ? `<div class="okbar">已购买 ${paid} 席 · 支付 ¥${paid * s.price}（演示）</div>` : ""}
      <div class="tstat">
        <div><b>${total}</b><span>总席位</span></div>
        <div><b>${s.used}</b><span>已用</span></div>
        <div><b>${left}</b><span>剩余</span></div>
      </div>
      <div class="note" style="margin:12px 2px 0;line-height:1.7">¥${s.price} / 席 · 最少 ${s.min} 席起购。席位不足时无法邀请新成员，可随时加购。</div>
      <div class="feedhd">加购席位</div>
      <div class="plans">
        ${plans.map((p) => `<div class="plan${p.seats === sel.seats ? " on" : ""}" data-set="E3.2.seats=${p.seats}">
          <b>${p.seats}<i>席</i></b><span>¥${p.pay}</span>${p.tag ? `<em>${p.tag}</em>` : ""}</div>`).join("")}
      </div>
      <div class="card" style="margin-top:12px;padding:12px 14px">
        <div class="xs" style="line-height:1.8">团队长建团队时至少买 10 席（¥100）；买完即可邀请成员，1 人占 1 席。</div>
        <div style="margin-top:10px"><span class="btn-pill line" data-go="E3.0" data-label="新建团队">还没团队？去新建 ›</span></div>
      </div>
    </div>
    <div class="actionbar">
      <div class="btn ai" data-set="E3.2.paid=${sel.seats}" data-label="购买席位">购买 ${sel.seats} 席 · ¥${sel.pay}</div>
    </div>
  </div>`;
};

/* 成员管理：团队长设/取消管理员、移出；管理员只能管成员不设管理员 */
window.PAGES["E3.3"].prd = "PRD §6.22.4 · 成员管理（角色 / 邀请 / 移出）";
window.PAGES["E3.3"].render = function (ctx) {
  const C = window.C, LIB = window.DATA.library;
  const team = (LIB.teams || [])[0] || {};
  const s = window.DATA.seatInfo || { total: 20, used: 12, price: 10, min: 10 };
  const all = LIB.teamMembers || [];
  const admin = (ctx.admin || "").split(",").filter(Boolean);
  const removed = (ctx.removed || "").split(",").filter(Boolean);
  const list = all.filter((m) => removed.indexOf(m.name) < 0);
  const left = s.total - s.used;

  const roleOf = (m) => (m.role !== "团员" ? m.role : (admin.indexOf(m.name) >= 0 ? "管理员" : "团员"));
  const addAdmin = (name) => (admin.indexOf(name) >= 0 ? admin : admin.concat(name));
  const delAdmin = (name) => admin.filter((x) => x !== name);

  const act = (m, role) => {
    if (m.name === "暴富者") return `<span class="mact mute">团长</span>`;
    const parts = [];
    if (role === "管理员" && m.role !== "副团长") {
      parts.push(`<span class="mact" data-set="E3.3.admin=${delAdmin(m.name).join(",")}">取消管理员</span>`);
    } else if (role === "团员") {
      parts.push(`<span class="mact" data-set="E3.3.admin=${addAdmin(m.name).join(",")}">设为管理员</span>`);
    }
    parts.push(`<span class="mact warn" data-set="E3.3.removed=${removed.concat(m.name).join(",")}">移出</span>`);
    return `<span class="tmact">${parts.join("")}</span>`;
  };

  const row = (m) => {
    const role = roleOf(m);
    return `<div class="tmr">
      <span class="tav" style="background:${m.bg}">${m.av}</span>
      <div class="tmt"><b>${m.name}${role !== "团员" ? `<em>${role}</em>` : ""}</b>
        <span>${m.joined}加入 · 本月 ${m.posts} 条 · ${m.phone}</span></div>
      ${act(m, role)}
    </div>`;
  };

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "成员管理", sub: `${team.name || ""} · ${list.length} 人`, back: "E3", act: "邀请" })}
    <div class="body">
      <div class="note" style="margin:2px 2px 0;line-height:1.7">团队长是超管，可设置/取消管理员；管理员可管理成员与素材。邀请新成员会占用 1 个席位。</div>
      <div class="tstat">
        <div><b>${list.length}</b><span>成员</span></div>
        <div><b>${s.total}</b><span>总席位</span></div>
        <div><b>${left}</b><span>剩余席位</span></div>
      </div>
      <div class="feedhd">全部成员<span>${list.length}</span></div>
      <div class="card" style="padding:2px 14px;border-radius:16px">${list.map(row).join("")}</div>
      ${removed.length ? `<div class="note" style="margin:10px 2px 0">已移出 ${removed.length} 人（演示，刷新后恢复）</div>` : ""}
    </div>
  </div>`;
};
