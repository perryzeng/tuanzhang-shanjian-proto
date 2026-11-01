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

window.PAGES["E3.1"].prd = "PRD §6.22.1 · 团队资料（基本资料 + 席位 + 成员通讯录 + 管理入口）";
window.PAGES["E3.1"].render = function (ctx) {
  const C = window.C;
  const LIB = window.DATA.library;
  const DATA = window.DATA;
  const teams = LIB.teams || [];
  const tid = teams.some((t) => t.id === ctx.tid) ? ctx.tid : (teams[0] || {}).id;
  const team = teams.filter((t) => t.id === tid)[0] || {};
  const mem = LIB.teamMembers || [];
  const totalPosts = mem.reduce((s, m) => s + (m.posts || 0), 0);
  const show = mem.slice(0, 8);
  const more = Math.max(0, (team.members || 0) - show.length);
  const s = DATA.seatInfo || { total: 20, used: 12, price: 10, min: 10 };
  const view = ctx.view === "admin" ? "admin" : ctx.view === "member" ? "member" : "owner";

  const row = (m) => `<div class="tmr" data-label="${m.name}">
      <span class="tav" style="background:${m.bg}">${m.av}</span>
      <div class="tmt"><b>${m.name}${m.role !== "团员" ? `<em>${m.role}</em>` : ""}</b>
        <span>${m.joined}加入 · 本月 ${m.posts} 条</span></div>
      <span class="tmp">${m.phone}</span>
    </div>`;

  const linkRow = (ic, t, sub, go) => `<div class="li" style="box-shadow:none;margin:0;border-radius:0;padding:13px 0" data-go="${go}" data-label="${t}">
      <div style="width:34px;height:34px;border-radius:11px;background:var(--brand-weak);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:14px;flex:0 0 34px">${ic}</div>
      <div class="tx"><b style="margin-bottom:2px">${t}</b><span>${sub}</span></div>
      <span style="color:var(--text-4);font-size:16px">›</span></div>`;

  const canEdit = view !== "member";
  const edit = ctx.edit === "1";
  const tname = ctx.name != null && ctx.name !== "" ? ctx.name : (team.name || "");
  const tbrief = ctx.brief != null && ctx.brief !== "" ? ctx.brief : (team.brief || "");
  const logo = ctx.logo != null && ctx.logo !== "" ? ctx.logo : (tname || "团").slice(0, 1);

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: edit ? "编辑团队资料" : "团队资料", sub: tname, back: "E3" })}

    <div class="body">
      ${edit ? `
      <div class="card" style="padding:14px">
        <div class="s" style="margin-bottom:7px">团队名称</div>
        <input data-bind="E3.1.name" data-live value="${tname.replace(/"/g, "&quot;")}"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
        <div class="s" style="margin:14px 0 7px">团队简介</div>
        <input data-bind="E3.1.brief" data-live value="${tbrief.replace(/"/g, "&quot;")}"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:12.5px" />
        <div class="s" style="margin:14px 0 7px">团队 Logo</div>
        <input data-bind="E3.1.logo" data-live maxlength="1" value="${logo}"
          style="width:64px;text-align:center;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 0;font-size:18px;font-weight:800;color:var(--brand)" />
        <div class="xs" style="margin-top:8px">先用一个字代替；真机上支持上传图片。</div>
      </div>
      <div class="note" style="margin:12px 2px 0;line-height:1.7">团队名称、简介、Logo 会展示在成员端首页与邀请卡片上，改完即生效。</div>
      ` : `
      <div class="tinfo" style="background:linear-gradient(135deg,#2C5BFF,#7C5CFF)">
        <span class="tiav">${logo}</span>
        <div><b>${tname}</b><span>${tbrief}</span></div>
      </div>

      <div class="tstat">
        <div><b>${team.members}</b><span>成员</span></div>
        <div><b>${totalPosts}</b><span>本月发布</span></div>
        <div><b>${team.role}</b><span>我的身份</span></div>
      </div>

      ${canEdit ? `<div class="card" style="margin-top:12px;padding:0 14px">
        ${linkRow("✎", "编辑团队资料", "名称、简介、Logo，改完即生效", "E3.1?view=" + view + "&edit=1")}
        ${linkRow("⚙", "团队管理", "发公告 / 任务 · 成员 · 素材 · Banner", "E3.4?view=" + view)}
      </div>` : ""}

      <div class="seatcard">
        <div class="seatcard-l"><b>席位</b><span>已用 ${s.used}/${s.total} · 剩余 ${s.total - s.used} · ¥${s.price}/席</span></div>
        ${view === "owner"
          ? `<span class="btn-pill" data-go="E3.2" data-label="购买席位">购买席位</span>`
          : `<span class="xs">${s.total - s.used} 席可用</span>`}
      </div>
      ${view === "owner" ? `<div class="xs" style="margin:8px 2px 0;line-height:1.6">席位不足会导致邀请失败；1 人占 1 席，可随时加购。</div>` : ""}

      <div class="feedhd">团队成员<span>${team.members}</span></div>
      <div class="card" style="padding:2px 14px;border-radius:16px">
        ${show.map(row).join("")}
        ${more ? `<div class="tmr" data-label="更多成员"><span class="tav" style="background:var(--bg-2);color:var(--text-3)">+${more}</span>
          <div class="tmt"><b>还有 ${more} 位成员</b><span>通讯录里可搜索全部</span></div></div>` : ""}
      </div>
      `}
    </div>

    ${edit ? `<div class="actionbar"><div class="btn ai" data-set="E3.1.edit=&E3.1.toast=已保存" data-label="保存">保存修改</div></div>` : ""}
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

/* 团队管理：首页右上角「管理」进来的唯一入口页。
   按互联网习惯分区：内容运营 / 成员与权限 / 素材 / 团队设置，权限不同看到的项不同。 */
window.PAGES["E3.4"].prd = "PRD §6.22.5 · 团队管理（权限分离：团队长 vs 管理员）";
window.PAGES["E3.4"].render = function (ctx) {
  const C = window.C, LIB = window.DATA.library, DATA = window.DATA;
  const team = (LIB.teams || [])[0] || {};
  const role = ctx.view === "admin" ? "admin" : "owner";
  const owner = role === "owner";
  const s = DATA.seatInfo || { total: 20, used: 12, price: 10, min: 10 };
  const left = s.total - s.used;
  const members = (LIB.teamMembers || []).length;

  const row = (ic, t, sub, go, badge) => `<div class="li" style="box-shadow:none;margin:0;border-radius:0;padding:13px 0" data-go="${go}" data-label="${t}">
      <div style="width:34px;height:34px;border-radius:11px;background:var(--brand-weak);color:var(--brand);display:flex;align-items:center;justify-content:center;font-size:14px;flex:0 0 34px">${ic}</div>
      <div class="tx"><b style="margin-bottom:2px">${t}${badge ? `<em class="only">${badge}</em>` : ""}</b><span>${sub}</span></div>
      <span style="color:var(--text-4);font-size:16px">›</span></div>`;
  const grp = (title, rows) => `<div class="feedhd" style="margin-top:14px">${title}</div><div class="card" style="padding:0 16px">${rows.join("")}</div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "团队管理", sub: `${team.name || ""} · ${owner ? "团队长（超管）" : "管理员"}`, back: "E3" })}
    <div class="body">
      <div class="note" style="margin:2px 2px 8px;line-height:1.7">${owner
        ? "团队长拥有全部权限：发公告 / 任务、管理成员与素材、设置管理员、管理席位与 Banner。"
        : "管理员可发公告 / 任务、管理成员与素材、设置 Banner；席位与解散团队仅团队长可操作。"}</div>

      ${grp("内容运营", [
        row("✎", "发布公告", "公告会出现在团队首页顶部", "E3.5"),
        row("✓", "发布任务", "剪视频 / 系列主题，默认全员每人 1 条", "E4"),
        row("≡", "任务列表", "已发布任务 · 看每条完成情况", "E4.2"),
        row("▤", "Banner 运营", "首页轮播位，可新增 / 上下线", "E3.7")
      ])}

      ${grp("成员与权限", [
        row("☺", "成员管理", `${members} 位成员 · 剩余 ${left} 席`, "E3.3"),
        owner ? row("★", "设置管理员", "在成员管理里指定 / 取消管理员", "E3.3") : ""
      ].filter(Boolean))}

      ${grp("团队素材", [
        row("◫", "素材整理", "点开任意一条，直接改名 / 换文件夹 / 设精选 / 删除", "E3?open=asset&tab=latest&mng=1")
      ])}

      ${grp("团队设置", [
        row("ⓘ", "团队资料", "名称、简介、成员通讯录", "E3.1"),
        owner ? row("◎", "席位管理", `已用 ${s.used}/${s.total} · 剩余 ${left} 席 · ¥${s.price}/席`, "E3.2") : ""
      ].filter(Boolean))}

      ${owner ? `<div class="warnnote">解散团队：清空成员与内容，席位与积分不退，需二次确认。</div>` : ""}
    </div>
  </div>`;
};

/* 发布公告（团队长 / 管理员） */
window.PAGES["E3.5"].prd = "PRD §6.22.6 · 发布公告";
window.PAGES["E3.5"].render = function (ctx) {
  const C = window.C;
  const done = ctx.done === "1";
  const top = ctx.top === "1";
  const title = (ctx.title || "").replace(/"/g, "&quot;");
  const body = (ctx.body || "").replace(/</g, "&lt;");
  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "发布公告", sub: "团队首页 · 公告", back: "E3.4" })}
    <div class="body">
      ${done ? `<div class="okbar">公告已发布，成员会在团队首页看到（演示）</div>
        <div style="margin-top:16px"><div class="btn ai" data-go="E3" data-label="返回团队">返回团队 ›</div></div>` : `
      <div class="card" style="padding:14px">
        <div class="s" style="margin-bottom:7px">标题</div>
        <input data-bind="E3.5.title" data-live value="${title}" placeholder="例如：10 月团价已调整"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600;margin-bottom:13px" />
        <div class="s" style="margin-bottom:7px">内容</div>
        <textarea data-bind="E3.5.body" data-live placeholder="写清楚改了什么、什么时候生效"
          style="width:100%;height:110px;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:12.5px;line-height:1.6;resize:none">${body}</textarea>
      </div>
      <div class="card" style="margin-top:12px;padding:13px 14px;display:flex;align-items:center" data-set="E3.5.top=${top ? "" : "1"}">
        <div style="flex:1"><div class="h3">置顶公告</div><div class="xs" style="margin-top:3px">置顶后会钉在团队首页最上方</div></div>
        <span class="sw${top ? " on" : ""}"></span>
      </div>`}
    </div>
    ${done ? "" : `<div class="actionbar"><div class="btn ai" data-set="E3.5.done=1" data-label="发布公告">发布公告</div></div>`}
  </div>`;
};

/* Banner 运营（团队长 / 管理员）：列表 + 上下线 + 新增 */
window.PAGES["E3.7"].prd = "PRD §6.22.7 · Banner 运营";
window.PAGES["E3.7"].render = function (ctx) {
  const C = window.C, LIB = window.DATA.library;
  const banners = LIB.teamBanners || [];
  const off = (ctx.off || "").split(",").filter(Boolean);
  const mine = (ctx.mine || "").split("|").filter(Boolean);
  const isOff = (id) => off.indexOf(id) >= 0;
  const toggle = (id) => "E3.7.off=" + (isOff(id) ? off.filter((x) => x !== id) : off.concat(id)).join(",");
  const formOpen = ctx.new === "1";
  const ntitle = (ctx.ntitle || "").replace(/"/g, "&quot;");

  const items = banners.map((b, i) => ({ id: "b" + i, t: b.t, sub: b.sub, tag: b.tag, bg: b.bg }))
    .concat(mine.map((t, i) => ({ id: "m" + i, t, sub: "自定义 Banner", tag: "新增", bg: "linear-gradient(135deg,#5B8CFF,#2C5BFF)" })));

  const row = (it) => `<div class="tmr">
      <span class="tav" style="background:${it.bg};border-radius:10px">${(it.t || "B").slice(0, 1)}</span>
      <div class="tmt"><b>${it.t}${it.tag ? `<em>${it.tag}</em>` : ""}</b><span>${it.sub}</span></div>
      <span class="mact ${isOff(it.id) ? "mute" : ""}" data-set="${toggle(it.id)}">${isOff(it.id) ? "已下线" : "上线中"}</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "Banner 运营", sub: "团队首页轮播", back: "E3.4" })}
    <div class="body">
      <div class="note" style="margin:2px 2px 8px;line-height:1.7">团队长与管理员都可设置；轮播按顺序展示，最多 5 张。点右侧可临时下线。</div>
      ${!formOpen ? `<div class="row" style="justify-content:flex-end;margin:0 2px 10px">
        <span class="btn-pill" data-set="E3.7.new=1" data-label="新增 Banner">＋ 新增 Banner</span>
      </div>` : ""}
      ${formOpen ? `<div class="card" style="padding:14px">
        <div class="s" style="margin-bottom:7px">Banner 标题</div>
        <input data-bind="E3.7.ntitle" data-live value="${ntitle}" placeholder="例如：本周冲 3 条开团片"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
        <div style="display:flex;gap:10px;margin-top:12px">
          <div class="btn ai" style="flex:1" data-set="E3.7.mine=${mine.concat(ctx.ntitle || "新 Banner").join("|")}&E3.7.new=&E3.7.ntitle=" data-label="保存 Banner">保存</div>
          <div class="btn ghost" style="flex:0 0 92px" data-set="E3.7.new=" data-label="取消">取消</div>
        </div>
      </div>` : ""}
      <div class="feedhd" style="margin-top:14px">轮播内容<span>${items.length}</span></div>
      <div class="card" style="padding:2px 14px;border-radius:16px">${items.map(row).join("") || `<div class="frempty">还没有 Banner</div>`}</div>
    </div>
  </div>`;
};
