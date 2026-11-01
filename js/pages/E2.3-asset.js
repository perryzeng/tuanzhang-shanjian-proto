window.PAGES["E2.3"].prd = "PRD §6.21.2 · 素材详情（先看这一条，再决定用不用）";

/* 素材详情。动态里说"阿强上传了 3 条素材"，点进去要看到的是**那一条**，
   不是"视频素材"的一个大列表——所以单独一页：大预览 + 这条的底细 + 一个"用"的出口。
   和 E2.2 脚本详情同构：先看懂，再拿去用。 */
window.PAGES["E2.3"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;
  const it = D.libItem(ctx.id) || D.libItem("li_a1");
  const bg = it.bg || "linear-gradient(150deg,#00A8E8,#00C2FF)";

  /* 这条素材在哪一摞 */
  const folderName = (function () {
    const fs = window.DATA.library.folders;
    for (const k in fs) {
      const f = fs[k].filter((x) => x.id === it.fd)[0];
      if (f) return f.name;
    }
    return "";
  })();
  const dur = (it.sub.split(" · ").filter((s) => /秒/.test(s))[0]) || "";

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: it.name, sub: it.sub, back: "E2" })}

    <div class="body">
      <!-- 大预览：9:16 竖版画面，右下角标时长 -->
      <div class="asset-pv" style="background:${bg}">
        <span class="ply">▶</span>
        ${dur ? `<span class="dur">${dur}</span>` : ""}
      </div>

      <div class="metaline">
        <span>作者 ${it.by || "—"}</span><i>·</i>
        <span>使用 ${D.plays(it.uses)} 次</span><i>·</i>
        <span>♥ ${D.plays(it.likes)}</span>
        ${folderName ? `<i>·</i><span>在「${folderName}」</span>` : ""}
        ${it.pick ? `<span class="picktag">精选</span>` : ""}
      </div>

      <div class="note" style="margin:12px 2px 0;line-height:1.7">
        这是一条可以直接铺画面的素材。点下面「用这条素材」，它会带着这条片子进发布器的素材选择器，
        你把它放到的哪一段，就从哪一段开始铺。
      </div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-go="B2.1?asset=${it.id}" data-label="用这条素材">✦ 用这条素材</div>
    </div>
  </div>`;
};
