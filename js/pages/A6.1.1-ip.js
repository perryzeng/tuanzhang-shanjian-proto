/* A6.1.1 我的 IP 主页（V24 · 三平台 1:1 + 就地编辑）
   入口：我是谁 → 我的 IP 三张卡（A6.1?pf=xx）；任意播放页点自己的头像。

   同一团长在三个平台上是三个号，昵称/简介/粉丝数都不一样，
   所以这一页不是"一个主页换配色"，是三套真布局：
     抖音   —— 封面图 + 头像压上去，三列 3:4，右下角播放数，关注/粉丝/获赞
     视频号 —— 两列，每条带标题；关注/朋友/赞（视频号就叫"朋友"，不叫粉丝）
     小红书 —— 三列 3:4，右下角点赞数，关注/粉丝/获赞与收藏

   V24 加了三件必须串起来的事：
   1) 就地编辑：每个数旁边一支笔，点了原地变输入框（昵称/简介/关注/朋友/赞）。
      只有本人（isMine）才有笔；编辑模式（ed=1）才出现 ✕ 和 ＋，用来增删作品。
   2) 数的落地页：点关注/朋友/赞 → 底部升起名单或作品墙，跟真机一样点得进去。
   3) 作品集不手填：works.pfs 里带这个平台的自动进来（在 A8.4.2 里"以抖音方式分享"
      出去的那条，自动出现在抖音号的作品集）。手动加的只影响这一个号，标「手动」。 */

window.PAGES["A6.1.1"].prd = "PRD V24 §3.1 · 我的 IP 主页（三平台 1:1 + 就地编辑）";
window.PAGES["A6.1.1"].sysEntry = "我是谁 → 我的 IP 卡；播放页点自己头像";

window.PAGES["A6.1.1"].render = function (ctx) {
  const L = window.LIB, C = window.C;
  const pf = ["wx", "dy", "xhs"].indexOf(ctx.pf) >= 0 ? ctx.pf : "dy";
  const ip = L.ips[pf];
  const pfName = { wx: "视频号", dy: "抖音", xhs: "小红书" }[pf];
  const isMine = ctx.mine !== "0";        // 看别人的号 → 一支笔都不给
  const sh = String(ctx.sh || "");         // 落地页（看别人的号也能看名单，只是不能改）
  const ed = isMine && ctx.ed === "1";    // 编辑模式：能加片、删片
  const tab = String(ctx.tab || "w");
  const e = String(ctx.e || "");
  const V = (k, d) => { const v = ctx[k + "_" + pf]; return v != null && v !== "" ? v : d; };
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

  /* ---- 作品集：自动 + 手动 ----
     自动：发到本平台且没被移出（rm_）的。
     手动：从做过的片里加进来的（ad_），只挂在这一个号上。 */
  const rm = String(ctx["rm_" + pf] || "").split(",").filter(Boolean);
  const ad = String(ctx["ad_" + pf] || "").split(",").filter(Boolean);
  const base = L.works.filter((w) => w.status === "sent" && (w.pfs || []).indexOf(pf) >= 0 && rm.indexOf(w.id) < 0);
  const extra = ad.map((id) => L.works.filter((w) => w.id === id)[0]).filter((w) => w && !base.some((b) => b.id === w.id));
  const mine = base.concat(extra);
  const others = L.works.filter((w) => mine.indexOf(w) < 0);
  const n = mine.length;

  const name = V("n", ip.name);
  const bio = V("b", ip.bio);
  const ST = pf === "wx"
    ? [["f1", "关注", V("f1", ip.follows)], ["f2", "朋友", V("f2", ip.fans)], ["f3", "赞", V("f3", ip.likes)]]
    : pf === "dy"
      ? [["f1", "关注", V("f1", ip.follows)], ["f2", "粉丝", V("f2", ip.fans)], ["f3", "获赞", V("f3", ip.likes)]]
      : [["f1", "关注", V("f1", ip.follows)], ["f2", "粉丝", V("f2", ip.fans)], ["f3", "获赞与收藏", V("f3", ip.likes)]];

  /* ---- 笔：只在本人这里出现；正在改的那项变成 ✓ ---- */
  const PEN = `<svg viewBox="0 0 12 12" aria-hidden="true"><path
    d="M8.6 1.6a1.1 1.1 0 0 1 1.6 0l.2.2a1.1 1.1 0 0 1 0 1.6L4.6 9.2 2 10l.8-2.6z"
    fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/></svg>`;
  const pen = (k, lb) => isMine
    ? `<i class="v33-pen${e === k ? " on" : ""}" data-set="A6.1.1.e=${e === k ? "" : k}"
        data-label="${e === k ? "改好了" : "改" + lb}">${e === k ? "✓" : PEN}</i>`
    : "";

  /* ---- 一个数：数字 / 标签 / 笔。点了进落地页（正在改的时候不跳，否则一碰就丢焦点）---- */
  const stat = (k, lb, v) => {
    const editing = e === k;
    return `<div class="v33-n${editing ? " v33-editing" : ""}"${
      editing ? "" : ` data-set="A6.1.1.sh=${k}" data-label="${lb}名单"`
    }>${
      editing
        ? `<input class="v33-ein" data-bind="A6.1.1.${k}_${pf}" value="${esc(v)}" autocomplete="off">`
        : `<b>${v}</b>`
    }<span>${lb}</span>${pen(k, lb)}</div>`;
  };
  const nums = (cls) => `<div class="${cls}">${ST.map(([k, lb, v]) => stat(k, lb, v)).join("")}</div>`;

  const nameTag = (cls) => (e === "n"
    ? `<input class="v33-ein wide" data-bind="A6.1.1.n_${pf}" value="${esc(name)}" autocomplete="off">`
    : `<b class="${cls}">${name}</b>`);
  const bioTag = (cls) => (e === "b"
    ? `<textarea class="v33-ein v33-eta" data-bind="A6.1.1.b_${pf}" rows="2">${esc(bio)}</textarea>`
    : `<p class="${cls}">${bio}</p>`);

  /* 号（视频号 ID / 抖音号 / 小红书号）和标签也能改 ——
     "所有的都是可以编辑的"，别只给名字留笔。 */
  const handle = V("h", ip.handle);
  const handleTag = () => (e === "h"
    ? `<input class="v33-ein wide" data-bind="A6.1.1.h_${pf}" value="${esc(handle)}" autocomplete="off">`
    : `<span>${handle}</span>`);
  const handleLine = () => `<div class="v33-hl">${handleTag()}${pen("h", "号")}</div>`;

  const tagList = String(V("t", ip.tags.join(","))).split(/[,，\s]+/).filter(Boolean);
  const tagsLine = () => `<div class="v33-tags">${e === "t"
    ? `<input class="v33-ein wide" data-bind="A6.1.1.t_${pf}" value="${esc(tagList.join("，"))}" autocomplete="off">`
    : tagList.map((t) => `<span>#${t}</span>`).join("")}${pen("t", "标签")}</div>`;

  /* ---- 作品格子 ---- */
  const delSet = (w) => (ad.indexOf(w.id) >= 0
    ? `A6.1.1.ad_${pf}=${ad.filter((x) => x !== w.id).join(",")}`
    : `A6.1.1.rm_${pf}=${rm.concat(w.id).join(",")}`);
  const delBtn = (w) => (ed ? `<i class="v33-del" data-set="${delSet(w)}" data-label="移出作品集">✕</i>` : "");
  const manual = (w) => (ad.indexOf(w.id) >= 0 ? `<i class="v33-mk">手动</i>` : "");

  const cell = (w) => {
    const badge = pf === "dy" ? `▶ ${w.opens}` : pf === "xhs" ? `♥ ${w.likes}` : "";
    return `<div class="v33-cell" data-go="A8.4.2?pf=${pf}&c=${w.id}" data-label="${esc(w.title)}">
      <img src="${w.img}" alt=""><span class="badge">${badge}</span>${manual(w)}${delBtn(w)}</div>`;
  };
  const wxcell = (w) => `<div class="v33-wxcell" data-go="A8.4.2?pf=wx&c=${w.id}" data-label="${esc(w.title)}">
    <div class="th"><img src="${w.img}" alt=""></div>
    <b>${w.title}</b>
    <span>♥ ${w.likes} · 评 ${w.cmt} · 转 ${w.shares}</span>${manual(w)}${delBtn(w)}</div>`;

  const addCell = (kind) => (ed
    ? `<div class="v33-add${kind === "wx" ? " wxc" : ""}" data-set="A6.1.1.sh=add" data-label="加作品">
        <i>＋</i><span>从做过的片里加</span></div>`
    : "");

  const edBar = (cls) => (ed
    ? `<div class="v33-ebar ${cls || ""}">正在编辑「${pfName}」这个号：点 ✕ 移出，点 ＋ 加进来<i
        data-set="A6.1.1.ed=0">完成</i></div>`
    : "");

  const tabs = (list) => `<div class="v33-tabs">${list.map(([k, lb, cnt]) =>
    `<b class="${tab === k ? "on" : ""}" data-set="A6.1.1.tab=${k}" data-label="${lb}">${lb}${cnt != null ? " " + cnt : ""}</b>`).join("")}</div>`;

  /* 看别人的号时给一个明确的出口：不然切过去就回不来了 */
  const pvChip = () => (isMine
    ? ""
    : `<div class="v33-pv" data-set="A6.1.1.mine=1" data-label="退出预览">别人看到的样子<i>退出</i></div>`);

  const feed = (items) => `<div class="v33-feed">${items.map(([tx, at, lk]) =>
    `<div class="v33-fd"><b>${tx}</b><span>${at} · ♥ ${lk}</span></div>`).join("")}</div>`;

  /* ---------------- 底部落地页 ---------------- */
  const FELLOW = [
    ["营养师老周", "周", "健康科普 · 4.2 万粉"],
    ["梅州老家", "梅", "家乡号"],
    ["磷虾油小课堂", "磷", "品牌官方"],
    ["阿梅", "梅", "梅州 · 回头客"],
    ["陈姐", "陈", "深圳 · 老客"],
    ["周姨", "周", "梅州 · 老客"],
    ["团长联盟 · 老李", "李", "同行"],
    ["体检报告解读", "体", "工具号"],
    ["王姨", "王", "深圳 · 老客"],
    ["小林", "林", "梅州 · 新客"],
    ["张姐", "张", "深圳 · 老客"],
    ["刘姨", "刘", "梅州 · 观望"]
  ];
  const FANS = (L.genPool || []).map((g) => [g.who, g.av, g.tx]);

  const wrap = (title, sub, body, foot) => `<div class="v33-mask" data-set="A6.1.1.sh="></div>
    <div class="v33-sheet">
      <div class="v33-shd"><b>${title}</b><span>${sub || ""}</span><i data-set="A6.1.1.sh=">✕</i></div>
      <div class="v33-sbd">${body}</div>
      ${foot ? `<div class="v33-sft">${foot}</div>` : ""}
    </div>`;

  function sheetHTML() {
    if (!sh) return "";
    if (sh === "more" && !isMine) return "";
    if (sh === "add" && !isMine) return "";
    if (sh === "more") {
      return wrap("更多", pfName + " · " + name, `
        <div class="v33-row" data-set="A6.1.1.ed=${ed ? 0 : 1}&A6.1.1.sh=">
          <b>${ed ? "完成编辑" : "编辑资料"}</b>
          <span>改昵称、简介、关注数 / 朋友数 / 赞，增删作品</span><i>›</i></div>
        <div class="v33-row" data-go="A6.1" data-label="隐私设置">
          <b>隐私设置</b><span>谁能看我的动态和排名</span><i>›</i></div>
        <div class="v33-row" data-set="A6.1.1.mine=0&A6.1.1.sh=">
          <b>别人看到的样子</b><span>切过去只剩看，一支笔都没有</span><i>›</i></div>`);
    }
    if (sh === "add") {
      const pool = L.works.filter((w) => w.status === "sent" && mine.indexOf(w) < 0);
      return wrap("加入作品集", `只加到「${pfName}」这个号，别的平台不受影响`, pool.length
        ? pool.map((w) => `<div class="v33-pick">
            <div class="th"><img src="${w.img}" alt=""></div>
            <div class="tx"><b>${w.title}</b><span>${w.at} · 发在 ${(w.pfs || []).map((x) => ({ wx: "视频号", dy: "抖音", xhs: "小红书" }[x])).join(" / ") || "没发过"}</span></div>
            <i class="go" data-set="A6.1.1.ad_${pf}=${ad.concat(w.id).join(",")}" data-label="加入">加入</i>
          </div>`).join("")
        : `<div class="v33-none">做过的片都已经在这个号里了</div>`,
        `<span class="v33-sft-n">已加 ${extra.length} 条 · 它们只出现在${pfName}号</span>
         <em data-set="A6.1.1.sh=">完成</em>`);
    }
    if (sh === "f3") {
      return wrap("赞过的作品", `${pfName} · 共 ${others.length + 6} 条`, `
        <div class="v33-grid g3">${others.slice(0, 9).map((w) =>
          `<div class="v33-cell" data-go="A8.4.2?pf=${pf}&c=${w.id}" data-label="${esc(w.title)}">
            <img src="${w.img}" alt=""><span class="badge">♥ ${w.likes}</span></div>`).join("")}</div>
        <div class="v33-none">这些是点过赞的，不是自己发的</div>`);
    }
    if (sh === "f1") {
      return wrap("关注", `${FELLOW.length} 个号`, FELLOW.map(([nm, av, sd]) =>
        `<div class="v33-row"><i class="av">${av}</i><b>${nm}</b><span>${sd}</span><em>已关注</em></div>`).join(""));
    }
    if (sh === "f2") {
      return wrap(pf === "wx" ? "朋友" : "粉丝", `${FANS.length} 个人 · 都是评论过你的`, FANS.map(([nm, av, sd]) =>
        `<div class="v33-row"><i class="av">${av}</i><b>${nm}</b><span>${sd}</span><em class="y">回关</em></div>`).join(""));
    }
    return "";
  }

  /* ---------------- 抖音 ---------------- */
  if (pf === "dy") {
    return `<div class="app v33 v33-dy">
      <div class="v33-dy-cover">
        <img src="${L.works[0].img}" alt="">
        <div class="v33-dy-scrim"></div>
        <div class="v33-dy-nav">
          <span data-go="A6.1" data-label="返回">‹</span>
          <span class="r" data-set="A6.1.1.sh=more">⌕ ⋯</span>
        </div>
      </div>
      <div class="v33-sb">${C.sb(true)}</div>
      ${pvChip()}

      <div class="v33-dy-body">
        <div class="v33-dy-id">
          <i class="av">P</i>
          <div class="v33-nm">${nameTag("")}${pen("n", "昵称")}</div>
          ${handleLine()}
        </div>
        <div class="v33-bio-w">${bioTag("v33-bio")}${pen("b", "介绍")}</div>
        ${tagsLine()}
        ${nums("v33-dy-nums")}

        ${tabs([["w", "作品", n], ["p", "私密", 0], ["l", "喜欢", 12]])}
        ${edBar()}
        ${tab === "w" ? `<div class="v33-grid g3">${mine.map(cell).join("")}${addCell("dy")}</div>
          <div class="v33-empty-note">发到抖音的 ${n} 条自动在这里${extra.length ? `，其中 ${extra.length} 条是你手动加的` : ""}。</div>`
          : tab === "p" ? `<div class="v33-none">私密作品只有你自己能看见 · 0 条</div>`
            : `<div class="v33-grid g3">${others.slice(0, 9).map(cell).join("")}</div>
               <div class="v33-empty-note">点过赞的，不是自己发的。</div>`}
        <div style="height:16px"></div>
      </div>
      ${sheetHTML()}
    </div>`;
  }

  /* ---------------- 视频号 ---------------- */
  if (pf === "wx") {
    return `<div class="app v33 v33-wx">
      ${C.sb()}
      <div class="v33-wx-nav">
        <span data-go="A6.1" data-label="返回">‹</span>
        <b>${name}</b>
        <span class="r" data-set="A6.1.1.sh=more">···</span>
      </div>
      ${pvChip()}

      <div class="body nopad">
        <div class="v33-wx-head">
          <i class="av">P</i>
          <div class="v33-hb">
            <div class="v33-nm">${nameTag("")}${pen("n", "昵称")}</div>
            ${handleLine()}
          </div>
        </div>
        <div class="v33-bio-w">${bioTag("v33-wx-bio")}${pen("b", "介绍")}</div>
        ${nums("v33-wx-nums")}

        ${tabs([["w", "作品", n], ["f", "动态", null]])}
        ${edBar()}
        ${tab === "w" ? `<div class="v33-grid g2">${mine.map(wxcell).join("")}${addCell("wx")}</div>
          <div class="v33-empty-note">发到视频号的 ${n} 条自动在这里${extra.length ? `，其中 ${extra.length} 条是你手动加的` : ""}。</div>`
          : feed([
            ["今天在楼下菜市场碰到王姨，她说吃了两个月，体检单上那个箭头没了。", "2 小时前", 6],
            ["明天上午十点讲讲怎么看成人的血脂四项，有问题的评论区留。", "昨天", 11]
          ])}
        <div style="height:16px"></div>
      </div>
      ${pvChip()}
      ${sheetHTML()}
    </div>`;
  }

  /* ---------------- 小红书 ---------------- */
  return `<div class="app v33 v33-xhs">
    ${C.sb()}
    <div class="v33-xhs-nav">
      <span data-go="A6.1" data-label="返回">‹</span>
      <b>${name}</b>
      <span class="r" data-set="A6.1.1.sh=more">···</span>
    </div>
    ${pvChip()}

    <div class="body nopad">
      <div class="v33-xhs-head">
        <i class="av">P</i>
        <div class="v33-hb">
          <div class="v33-nm">${nameTag("")}${pen("n", "昵称")}</div>
          ${handleLine()}
        </div>
      </div>
      ${nums("v33-xhs-nums")}
      <div class="v33-bio-w">${bioTag("v33-xhs-bio")}${pen("b", "介绍")}</div>
      ${tagsLine()}

      ${tabs([["w", "笔记", n], ["c", "收藏", null], ["l", "赞过", null]])}
      ${edBar()}
      ${tab === "w" ? `<div class="v33-grid g3">${mine.map(cell).join("")}${addCell("xhs")}</div>
        <div class="v33-empty-note">发到小红书的 ${n} 条自动在这里${extra.length ? `，其中 ${extra.length} 条是你手动加的` : ""}。</div>`
        : `<div class="v33-grid g3">${others.slice(0, 9).map(cell).join("")}</div>
           <div class="v33-empty-note">${tab === "c" ? "收藏的笔记" : "赞过的笔记"}，不是自己发的。</div>`}
      <div style="height:16px"></div>
    </div>
    ${sheetHTML()}
  </div>`;
};

/* 打开笔以后把光标放进去。
   走 mount 不走 after：after 是 900ms 后再改状态、再重渲染，
   输入框会被第二次渲染冲掉，人还没开始打字就没了。 */
window.PAGES["A6.1.1"].mount = function (el) {
  const inp = el.querySelector(".v33-ein");
  if (!inp) return;
  inp.focus();
  try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (_) {}
  /* 回车 = 改好了：点那个 ✓，走的还是 data-set，不另开一套接口 */
  inp.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && inp.tagName !== "TEXTAREA") {
      ev.preventDefault();
      const ok = el.querySelector(".v33-pen.on");
      if (ok) ok.click();
    }
  });
};
