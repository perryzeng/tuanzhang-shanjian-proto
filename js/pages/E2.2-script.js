window.PAGES["E2.2"].prd = "PRD §6.21.1 · 脚本详情（先看懂，再拿去用）";

/* 脚本详情。存在的理由只有一个：**看是看，用是用。**
   上一版在列表里点一条脚本，直接被拽进发布器（B2）——那是个"编辑/生成"的页面，
   可用户当时只是想看看这份稿子讲了什么。误触一次就得退回来，还丢了原来的位置。

   所以这里做成一页纯阅读：一句话标题 + 几段台词，从上往下读完；
   读完觉得能用，再点底部那颗「用这个脚本创建视频」。 */
window.PAGES["E2.2"].render = function (ctx) {
  const C = window.C;
  const D = window.DERIVE;
  const it = D.libItem(ctx.id) || D.libItem("li_s1");
  const body = D.scriptBody(it.id);
  /* 找出这条脚本在哪一摞：数据里是 fd，展示要的是名字 */
  const folderName = (function () {
    const fs = window.DATA.library.folders;
    for (const k in fs) {
      const f = fs[k].filter((x) => x.id === it.fd)[0];
      if (f) return f.name;
    }
    return "";
  })();

  const seg = (s, i) => `<div class="voseg">
      <span class="vn">${String(i + 1).padStart(2, "0")}</span>
      <div class="vb"><b>${s.n}</b><p>${s.vo}</p></div>
    </div>`;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: it.name, sub: it.sub + " · " + (it.at === 1 ? "今天" : it.at + " 天前"), back: "E2" })}

    <div class="body">
      <!-- 这一段只说标题栏没说的：用过几次、放在哪一摞。
           "5 段 · 46 秒"上面已经有了，这里再说一遍是废话。 -->
      <div class="metaline">
        <span>作者 ${it.by || "—"}</span><i>·</i>
        <span>使用 ${D.plays(it.uses)} 次</span><i>·</i>
        <span>♥ ${D.plays(it.likes)}</span>
        ${folderName ? `<i>·</i><span>在「${folderName}」</span>` : ""}
        ${it.pick ? `<span class="picktag">精选</span>` : ""}
      </div>

      <div class="card" style="padding:6px 16px 10px;border-radius:16px">
        ${body.map(seg).join("")}
      </div>

      <div class="note" style="margin:12px 2px 0;line-height:1.7">
        这是一份稿子，不是一条片子——画面还没配。点下面那颗按钮，它会带着台词进发布器，
        AI 按每段的语义配一遍画面，你再逐段换。
      </div>
    </div>

    <div class="actionbar">
      <div class="btn ai" data-go="B2?kind=script&src=import" data-label="用这个脚本创建视频">✦ 用这个脚本创建视频</div>
    </div>
  </div>`;
};
