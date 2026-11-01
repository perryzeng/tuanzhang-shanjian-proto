window.PAGES["G1"].render = function () {
  const C = window.C, DATA = window.DATA;
  const pts = DATA.points || { balance: 0 };

  const row = (ic, bg, fg, t, sub, go) =>
    `<div class="li" style="box-shadow:none;margin-bottom:0;border-radius:0;padding:13px 0" data-go="${go}" data-label="${t}">
      <div style="width:34px;height:34px;border-radius:11px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:center;font-size:14px;flex:0 0 34px">${ic}</div>
      <div class="tx"><b style="margin-bottom:2px">${t}</b><span>${sub}</span></div>
      <span style="color:var(--text-4);font-size:16px">›</span>
    </div>`;

  return `<div class="app">
    ${C.sb()}

    <div class="body" style="padding-top:8px">
      <!-- 账号卡：身份 + 积分（积分钱包并进来） -->
      <div class="acct">
        <div class="row">
          <div class="acct-av">暴</div>
          <div style="flex:1;min-width:0">
            <div class="acct-n">暴富者</div>
            <div class="acct-s">大健康选品 5 年 · 团队第 7</div>
          </div>
          <span class="acct-edit" data-go="G1.1" data-label="编辑资料">编辑</span>
        </div>

        <div class="acct-pt" data-go="G2" data-label="积分钱包">
          <div class="ptl"><span>积分</span><b>${pts.balance}</b><span>≈ ¥${(pts.balance / 100).toFixed(2)}</span></div>
          <span class="ptg">充值 ›</span>
        </div>
      </div>

      ${C.sec("账号")}
      <div class="card" style="padding:0 16px">
        ${row("◍", "var(--brand-weak)", "var(--brand)", "个人主页", "看看别人眼中的你", "G1.0")}
        ${row("✎", "var(--brand-weak)", "var(--brand)", "编辑资料", "头像、昵称、简介、手机号", "G1.1")}
        ${row("⇄", "var(--violet-weak)", "var(--violet)", "授权管理", "微信 · 抖音 · 小红书", "G1.3")}
      </div>

      ${C.sec("我的")}
      <div class="card" style="padding:0 16px">
        ${row("☺", "var(--brand-weak)", "var(--brand)", "我的团队", "暴富者的团 · 20 席 · 团长", "E3")}
        ${row("▤", "var(--brand-weak)", "var(--brand)", "我的出镜", "12 张照片 · 3 段小视频", "E2.1")}
        ${row("⏱", "var(--brand-weak)", "var(--brand)", "AI 定时任务", "每天 06:00 自动生成 3 条", "T1")}
        ${row("☆", "var(--violet-weak)", "var(--violet)", "我的收藏", "18 个模板 · 6 个脚本", "F1")}
      </div>

      ${C.sec("设置")}
      <div class="card" style="padding:0 16px">
        ${row("◔", "#F1F3F9", "var(--text-2)", "通知设置", "任务 / 团队 / 数据 三类", "E5")}
        ${row("≡", "#F1F3F9", "var(--text-2)", "声音与形象", "温柔女声 · 克隆音已就绪", "B2.3")}
        ${row("◫", "#F1F3F9", "var(--text-2)", "席位与团队", "20 席 · 已用 12 · ¥10/席", "E3.2")}
        ${row("?", "#F1F3F9", "var(--text-2)", "帮助与反馈", "怎么过审 · 怎么算安全度", "A1")}
      </div>

      <div class="logout" data-go="G1.2" data-label="退出登录">退出登录</div>
      <div class="xs" style="text-align:center;margin-top:14px">团长闪剪 v1.0 · 粤 ICP 备 2026xxxx</div>
    </div>

    ${C.tab("G1")}
  </div>`;
};

/* 个人主页：别人点进来看的样子 */
window.PAGES["G1.0"].prd = "我的 · 个人主页（对外展示）";
window.PAGES["G1.0"].render = function () {
  const C = window.C, DATA = window.DATA;
  const works = (DATA.library.items["mine.work"] || []).slice(0, 3);
  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "个人主页", back: "G1", act: "分享" })}
    <div class="body">
      <div class="acct" style="text-align:center;padding:20px 16px 16px">
        <div class="acct-av" style="margin:0 auto;width:64px;height:64px;font-size:22px">暴</div>
        <div class="acct-n" style="margin-top:10px;font-size:19px">暴富者</div>
        <div class="acct-s" style="margin-top:5px">大健康选品 5 年 · 深圳前海</div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px">
          <span class="chip">团长</span><span class="chip">磷虾油</span><span class="chip">素颜出镜</span>
        </div>
      </div>

      ${C.sec("我的作品", "全部 ›", "E2?open=work&tab=latest")}
      <div class="g3">
        ${works.map((w) => `<div class="tile" data-go="E2?open=work&tab=latest" data-label="${w.name}">
          <div class="im" style="aspect-ratio:3/4">${w.img ? `<img src="${w.img}" alt="">` : ""}</div>
        </div>`).join("")}
      </div>
    </div>
    <div class="actionbar">
      <div class="btn" data-go="G1.1" data-label="编辑资料">编辑资料</div>
    </div>
  </div>`;
};

/* 资料设置：头像 / 昵称 / 简介 / 手机号 / 城市 */
window.PAGES["G1.1"].prd = "我的 · 资料设置";
window.PAGES["G1.1"].render = function (ctx) {
  const C = window.C;
  const name = ctx.name || "暴富者";
  const bio = ctx.bio || "大健康选品 5 年，只推自己吃过的";
  const phone = ctx.phone || "138****6688";
  const city = ctx.city || "深圳 · 前海";
  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "编辑资料", back: "G1" })}
    <div class="body">
      <div class="card" style="padding:16px;display:flex;align-items:center;gap:14px">
        <div class="acct-av brand" style="width:56px;height:56px;font-size:19px">暴</div>
        <div style="flex:1"><div class="h3">头像</div><div class="xs" style="margin-top:3px">建议正脸、清晰、别用 logo</div></div>
        <span class="btn-pill line">更换</span>
      </div>

      <div class="card" style="padding:14px;margin-top:12px">
        <div class="s" style="margin-bottom:7px">昵称</div>
        <input data-bind="G1.1.name" data-live value="${name}"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
        <div class="s" style="margin:14px 0 7px">简介</div>
        <input data-bind="G1.1.bio" data-live value="${bio}"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:12.5px" />
        <div class="s" style="margin:14px 0 7px">手机号</div>
        <div style="display:flex;align-items:center;background:var(--bg-2);border-radius:10px;padding:11px 12px">
          <span style="font-size:13px;font-weight:600">${phone}</span>
          <span class="xs" style="margin-left:auto;color:var(--brand)">更换</span>
        </div>
        <div class="s" style="margin:14px 0 7px">城市</div>
        <input data-bind="G1.1.city" data-live value="${city}"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px" />
      </div>
    </div>
    <div class="actionbar"><div class="btn ai" data-go="G1" data-label="保存资料">保存</div></div>
  </div>`;
};

/* 登录：退出后回到这里；支持手机号 / 微信授权 */
window.PAGES["G1.2"].prd = "登录 / 切换账号";
window.PAGES["G1.2"].render = function (ctx) {
  const C = window.C;
  const agreed = ctx.agree === "1";
  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "登录", back: "G1" })}
    <div class="body" style="padding-top:20px">
      <div style="text-align:center;margin:18px 0 26px">
        <div class="acct-av brand" style="margin:0 auto;width:60px;height:60px;font-size:20px">团</div>
        <div class="h2" style="margin-top:12px">团长闪剪</div>
        <div class="xs" style="margin-top:5px">登录后同步你的素材、团队和积分</div>
      </div>

      <div class="card" style="padding:14px">
        <div class="s" style="margin-bottom:7px">手机号</div>
        <input data-bind="G1.2.phone" data-live placeholder="请输入手机号"
          style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
        <div class="s" style="margin:14px 0 7px">验证码</div>
        <div style="display:flex;gap:8px">
          <input data-bind="G1.2.code" data-live placeholder="6 位验证码"
            style="flex:1;border:0;outline:0;background:var(--bg-2);border-radius:10px;padding:11px 12px;font-size:13px;font-weight:600" />
          <span class="btn-pill line" style="height:42px;display:flex;align-items:center">获取验证码</span>
        </div>
      </div>

      <div style="margin-top:16px"><div class="btn ai" data-go="G1" data-label="登录">登录</div></div>

      <div class="row" style="margin:14px 0;color:var(--text-4)"><i style="flex:1;height:1px;background:var(--line)"></i><span class="xs">或</span><i style="flex:1;height:1px;background:var(--line)"></i></div>

      <div class="card" style="padding:13px 14px;display:flex;align-items:center;gap:10px" data-label="微信授权登录">
        <div style="width:34px;height:34px;border-radius:10px;background:#E8F8EC;color:#0FA958;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700">微</div>
        <div style="flex:1"><div class="h3">微信授权登录</div><div class="xs" style="margin-top:3px">用微信账号快速登录</div></div>
        <span style="color:var(--text-4)">›</span>
      </div>

      <div class="row" style="margin-top:18px;align-items:flex-start;gap:8px" data-set="G1.2.agree=${agreed ? "" : "1"}">
        <span class="ck${agreed ? " on" : ""}" style="flex:0 0 18px;margin-top:1px"></span>
        <span class="xs" style="line-height:1.6">已阅读并同意《用户协议》《隐私政策》，未注册手机号将自动创建账号</span>
      </div>
    </div>
  </div>`;
};

/* 授权管理：第三方账号授权 */
window.PAGES["G1.3"].prd = "授权管理（第三方账号）";
window.PAGES["G1.3"].render = function (ctx) {
  const C = window.C;
  const off = (ctx.off || "").split(",").filter(Boolean);
  const APPS = [
    { id: "wx", n: "微信", s: "用于登录与分享", bg: "#E8F8EC", fg: "#0FA958", ic: "微" },
    { id: "dy", n: "抖音", s: "发布视频、同步作品数据", bg: "#111", fg: "#fff", ic: "抖" },
    { id: "xhs", n: "小红书", s: "发布笔记、同步数据", bg: "#FF2442", fg: "#fff", ic: "红" },
    { id: "jy", n: "剪映", s: "导入草稿与素材", bg: "#0E1B3D", fg: "#fff", ic: "剪" }
  ];
  const isOff = (id) => off.indexOf(id) >= 0;
  const tg = (id) => "G1.3.off=" + (isOff(id) ? off.filter((x) => x !== id) : off.concat(id)).join(",");

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "授权管理", sub: "已授权 4 个应用", back: "G1" })}
    <div class="body">
      <div class="note" style="margin:2px 2px 8px;line-height:1.7">授权后可同步作品数据、一键发布。解除授权不会删除已发布的内容。</div>
      <div class="card" style="padding:2px 14px">
        ${APPS.map((a) => `<div class="tmr">
          <span class="tav" style="background:${a.bg};color:${a.fg}">${a.ic}</span>
          <div class="tmt"><b>${a.n}</b><span>${a.s}</span></div>
          <span class="mact ${isOff(a.id) ? "mute" : ""}" data-set="${tg(a.id)}">${isOff(a.id) ? "已解除" : "已授权"}</span>
        </div>`).join("")}
      </div>
    </div>
  </div>`;
};
