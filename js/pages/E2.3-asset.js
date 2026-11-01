window.PAGES["E2.3"].prd = "PRD §6.21.2 · 素材详情（先看这一条，再决定用不用；有权限可当面改）";

/* 素材详情。动态里说"阿强上传了 3 条素材"，点进去要看到的是**那一条**。
   从「素材整理」进来（mng=1）或点「编辑」后，就地可改：名称、封面、文件夹、精选、删除。 */
window.PAGES["E2.3"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;
  const it = D.libItem(ctx.id) || D.libItem("li_a1");
  const edit = ctx.edit === "1" || ctx.mng === "1";

  const m = /^li_([tf]?)([saw])\d+$/.exec(it.id) || [];
  const domain = m[1] === "t" ? "team" : m[1] === "f" ? "friend" : "mine";
  const kind = m[2] === "s" ? "script" : m[2] === "w" ? "work" : "asset";
  const folders = D.lib(domain, kind, {}).folders || [];
  const curFd = ctx.fd || it.fd;
  const folderName = (folders.filter((f) => f.id === curFd)[0] || {}).name || "";

  const GRADS = [
    "linear-gradient(150deg,#00A8E8,#00C2FF)",
    "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
    "linear-gradient(150deg,#7C5CFF,#B08CFF)",
    "linear-gradient(150deg,#FF7A45,#FFC85B)",
    "linear-gradient(150deg,#00B389,#00C2FF)",
    "linear-gradient(150deg,#0E1B3D,#2C5BFF)"
  ];
  const bg = ctx.bg || it.bg || GRADS[0];
  const name = ctx.name != null && ctx.name !== "" ? ctx.name : it.name;
  const pick = ctx.pick === "1" ? true : ctx.pick === "" ? false : it.pick;
  const dur = (it.sub.split(" · ").filter((s) => /秒/.test(s))[0]) || "";

  const folderChips = `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
      ${folders.map((f) => `<span class="chip${curFd === f.id ? " on" : ""}" data-set="E2.3.fd=${f.id}">${f.name}</span>`).join("") || `<span class="xs">这个库里还没有文件夹</span>`}
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: edit ? "编辑素材" : name, sub: it.sub, back: "E2" })}

    <div class="body">
      <div class="asset-pv" style="background:${bg}">
        ${it.img ? `<img src="${it.img}" alt="">` : ""}
        <span class="ply">▶</span>
        ${dur ? `<span class="dur">${dur}</span>` : ""}
        ${pick ? `<span class="picktag" style="position:absolute;right:10px;top:10px">精选</span>` : ""}
      </div>

      <div class="metaline">
        <span>作者 ${it.by || "—"}</span><i>·</i>
        <span>使用 ${D.plays(it.uses)} 次</span><i>·</i>
        <span>♥ ${D.plays(it.likes)}</span>
        ${folderName ? `<i>·</i><span>在「${folderName}」</span>` : ""}
      </div>

      ${edit ? `
        <div class="card" style="padding:14px;margin-top:12px">
          <div class="s" style="margin-bottom:7px">素材名称</div>
          <input data-bind="E2.3.name" data-live value="${name.replace(/"/g, "&quot;")}"
            style="width:100%;border:0;outline:0;background:var(--bg-2);border-radius:10px;
                   padding:11px 12px;font-size:13px;font-weight:600" />
        </div>

        <div class="feedhd" style="margin-top:14px">封面</div>
        <div class="card" style="padding:12px 14px">
          <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px">
            ${GRADS.map((g) => `<span data-set="E2.3.bg=${g}" data-label="换封面"
              style="aspect-ratio:1;border-radius:9px;background:${g};cursor:pointer;
                     box-shadow:${g === bg ? "0 0 0 2px var(--brand)" : "inset 0 0 0 1px rgba(0,0,0,.06)"}"></span>`).join("")}
          </div>
          <div class="xs" style="margin-top:8px">原型用色块示意；真机上这里是截取视频帧 / 上传封面。</div>
        </div>

        <div class="feedhd" style="margin-top:14px">移动到文件夹</div>
        <div class="card" style="padding:12px 14px">${folderChips}</div>

        <div class="card" style="margin-top:12px;padding:13px 14px;display:flex;align-items:center"
             data-set="E2.3.pick=${pick ? "" : "1"}">
          <div style="flex:1"><div class="h3">设为精选</div><div class="xs" style="margin-top:3px">精选会出现在「精选」tab</div></div>
          <span class="sw${pick ? " on" : ""}"></span>
        </div>

        <div class="warnnote">删除后成员就看不到了，且不可恢复。</div>
        <div style="margin-top:10px"><div class="btn ghost" style="color:#C2410C" data-go="E2" data-label="删除素材">删除这条素材</div></div>
      ` : `
        <div class="note" style="margin:12px 2px 0;line-height:1.7">
          这是一条可以直接铺画面的素材。点下面「用这条素材」，它会带着这条片子进发布器的素材选择器，
          你把它放到哪一段，就从哪一段开始铺。
        </div>
        <div class="row" style="margin-top:12px;justify-content:flex-end">
          <span class="btn-pill line" data-set="E2.3.edit=1" data-label="编辑素材">编辑这条</span>
        </div>
      `}
    </div>

    <div class="actionbar">
      ${edit
        ? `<div class="btn ai" data-set="E2.3.edit=&E2.3.mng=&E2.3.toast=已保存" data-label="保存">保存修改</div>`
        : `<div class="btn ai" data-go="B2.1?asset=${it.id}" data-label="用这条素材">✦ 用这条素材</div>`}
    </div>
  </div>`;
};
