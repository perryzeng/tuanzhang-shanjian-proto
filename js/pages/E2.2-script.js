window.PAGES["E2.2"].prd = "PRD §6.21.1 · 脚本详情（先看懂，再拿去用；有权限可当面改）";

/* 脚本详情。默认纯阅读：标题 + 几段台词读完再决定用不用。
   从「素材整理」进来（mng=1）或点「编辑」后，就地变成可编辑：
   标题、每一段口播、所属文件夹、精选、删除，改完保存，所见即所得。 */
window.PAGES["E2.2"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;
  const it = D.libItem(ctx.id) || D.libItem("li_s1");
  const body = D.scriptBody(it.id);
  const edit = ctx.edit === "1" || ctx.mng === "1";

  /* 从 id 反推 domain / kind，拿到这条所在的文件夹列表 */
  const m = /^li_([tf]?)([saw])\d+$/.exec(it.id) || [];
  const domain = m[1] === "t" ? "team" : m[1] === "f" ? "friend" : "mine";
  const kind = m[2] === "a" ? "asset" : m[2] === "w" ? "work" : "script";
  const folders = D.lib(domain, kind, {}).folders || [];
  const curFd = ctx.fd || it.fd;
  const folderName = (folders.filter((f) => f.id === curFd)[0] || {}).name || "";
  const name = ctx.name != null && ctx.name !== "" ? ctx.name : it.name;

  const seg = (s, i) => `<div class="voseg">
      <span class="vn">${String(i + 1).padStart(2, "0")}</span>
      <div class="vb"><b>${s.n}</b><p>${s.vo}</p></div>
    </div>`;

  const segEdit = (s, i) => `<div class="voseg" style="align-items:flex-start">
      <span class="vn">${String(i + 1).padStart(2, "0")}</span>
      <div class="vb" style="flex:1">
        <b>${s.n}</b>
        <textarea data-bind="E2.2.vo${i}" data-live placeholder="这一段说什么"
          style="width:100%;margin-top:6px;border:0;outline:0;background:var(--bg-2);border-radius:9px;
                 padding:9px 10px;font-size:12.5px;line-height:1.6;resize:none;min-height:58px"
        >${ctx["vo" + i] != null ? ctx["vo" + i] : s.vo}</textarea>
      </div>
    </div>`;

  const folderChips = `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
      ${folders.map((f) => `<span class="chip${curFd === f.id ? " on" : ""}" data-set="E2.2.fd=${f.id}">${f.name}</span>`).join("") || `<span class="xs">这个库里还没有文件夹</span>`}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: edit ? "编辑脚本" : name, sub: it.sub, back: "E2" })}

    <div class="body">
      <div class="metaline">
        <span>作者 ${it.by || "—"}</span><i>·</i>
        <span>使用 ${D.plays(it.uses)} 次</span><i>·</i>
        <span>♥ ${D.plays(it.likes)}</span>
        ${folderName ? `<i>·</i><span>在「${folderName}」</span>` : ""}
        ${it.pick ? `<span class="picktag">精选</span>` : ""}
      </div>

      ${edit ? `
        <div class="card" style="padding:14px;margin-top:12px">
          <div class="s" style="margin-bottom:7px">脚本名称</div>
          <input data-bind="E2.2.name" data-live value="${name.replace(/"/g, "&quot;")}"
            style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;
                   padding:11px 12px;font-size:13px;font-weight:600" />
        </div>

        <div class="feedhd" style="margin-top:14px">分段台词<span>可逐段改</span></div>
        <div class="card" style="padding:6px 16px 10px;border-radius:16px">
          ${body.map(segEdit).join("")}
        </div>

        <div class="feedhd" style="margin-top:14px">移动到文件夹</div>
        <div class="card" style="padding:12px 14px">${folderChips}</div>

        <div class="card" style="margin-top:12px;padding:13px 14px;display:flex;align-items:center"
             data-set="E2.2.pick=${it.pick ? "" : "1"}">
          <div style="flex:1"><div class="h3">设为精选</div><div class="xs" style="margin-top:3px">精选会出现在「精选」tab</div></div>
          <span class="sw${it.pick || ctx.pick === "1" ? " on" : ""}"></span>
        </div>

        <div class="warnnote">删除后成员就看不到了，且不可恢复。</div>
        <div style="margin-top:10px"><div class="btn ghost" style="color:#C2410C" data-go="E2" data-label="删除脚本">删除这条脚本</div></div>
      ` : `
        <div class="card" style="padding:6px 16px 10px;border-radius:16px">
          ${body.map(seg).join("")}
        </div>

        <div class="note" style="margin:12px 2px 0;line-height:1.7">
          这是一份稿子，不是一条片子——画面还没配。点下面那颗按钮，它会带着台词进发布器，
          AI 按每段的语义配一遍画面，你再逐段换。
        </div>

        <div class="row" style="margin-top:12px;justify-content:flex-end">
          <span class="btn-pill line" data-set="E2.2.edit=1" data-label="编辑脚本">编辑这条</span>
        </div>
      `}
    </div>

    <div class="actionbar">
      ${edit
        ? `<div class="btn ai" data-set="E2.2.edit=&E2.2.mng=&E2.2.toast=已保存" data-label="保存">保存修改</div>`
        : `<div class="btn ai" data-go="B2?kind=script&src=import" data-label="用这个脚本创建视频">✦ 用这个脚本创建视频</div>`}
    </div>
  </div>`;
};
