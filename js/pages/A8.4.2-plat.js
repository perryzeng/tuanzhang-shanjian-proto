/* A8.4.2 按平台预览（V16.7）
   一条作品发到三个地方，长相完全不同：视频号是白底卡片、抖音是全屏黑、
   小红书是笔记。团长需要**先看见它长什么样**，再决定发哪儿。

   所以这一页做三件事：
   ① 1:1 还原三个平台的播放页样式（切 tab 就换）
   ② 模拟互动数据可改（点赞/评论/分享/转发），改了立刻在皮肤上看到
   ③ 贴真实链接，让爬虫回填平台真实数据 —— 抓不到也能手填

   底部「分享到朋友圈」出去的是我们自己的落地页，但客户打开时看到的
   仍是这套平台皮肤（L1 按同一个 pf 渲染）。 */

window.PAGES["A8.4.2"].prd = "PRD V16 §5.2 · 平台预览（三套皮肤 / 模拟数据 / 真实链接）";
window.PAGES["A8.4.2"].sysEntry = "作品详情里的三个平台入口";

window.PAGES["A8.4.2"].render = function (ctx) {
  const C = window.C, L = window.LIB;
  const w = L.works.filter((x) => x.id === ctx.c)[0] || L.works[0];
  const pf = ["wx", "dy", "xhs"].indexOf(ctx.pf) >= 0 ? ctx.pf : "wx";
  const p = L.plats[pf];

  /* 手填优先于默认值：input 用 data-bind 写进 STATE，不触发重渲染，
     所以打字时光标不会跳；切平台回来时还能读到自己填的数。 */
  const val = (k, d) => (ctx[pf + "_" + k] != null && ctx[pf + "_" + k] !== "") ? ctx[pf + "_" + k] : d;

  const skin = pf === "wx" ? `
    <div class="v24-ph v24-wx">
      <div class="v24-wx-top">
        <span class="v24-wx-av">P</span>
        <div><b>大 P</b><span>昨天 20:14</span></div>
        <em>···</em>
      </div>
      <div class="v24-wx-vd">
        <img src="${w.img}" alt="">
        <span class="v24-wx-play">▶</span>
        <span class="v24-wx-dur">${w.dur}</span>
      </div>
      <div class="v24-wx-t">${w.title}</div>
      <div class="v24-wx-tags">#心脑血管科普 #磷虾油</div>
      <div class="v24-wx-ops">
        <span><i>♥</i>${val("like", p.likes)}</span>
        <span><i>✎</i>${val("cmt", p.comments)}</span>
        <span><i>↗</i>${val("share", p.shares)}</span>
      </div>
      <div class="v24-wx-cm"><b>阿强</b>：多少钱一盒？能寄梅州吗</div>
    </div>` : pf === "dy" ? `
    <div class="v24-ph v24-dy">
      <img class="v24-dy-bg" src="${w.img}" alt="">
      <div class="v24-dy-top"><span>关注</span><span class="on">推荐</span><em>⌕</em></div>
      <div class="v24-dy-side">
        <span class="v24-dy-av">P<i>+</i></span>
        <div><i>♥</i><b>${val("like", p.likes)}</b></div>
        <div><i>✎</i><b>${val("cmt", p.comments)}</b></div>
        <div><i>↗</i><b>${val("share", p.shares)}</b></div>
        <div><i>⇄</i><b>${val("fw", p.forwards)}</b></div>
      </div>
      <div class="v24-dy-tx">
        <b>@大 P</b>
        <p>${w.title} #心脑血管 #磷虾油科普</p>
        <span>♫ 原声 · 大 P</span>
      </div>
      <div class="v24-dy-bar"><i></i></div>
    </div>` : `
    <div class="v24-ph v24-xhs">
      <div class="v24-xhs-top">
        <span class="v24-xhs-back">‹</span>
        <span class="v24-xhs-av">P</span>
        <span class="v24-xhs-nm">大 P</span>
        <em>关注</em>
      </div>
      <div class="v24-xhs-img">
        <img src="${w.img}" alt="">
        <span class="v24-xhs-play">▶</span>
      </div>
      <div class="v24-xhs-t">${w.title}</div>
      <div class="v24-xhs-b">今天把我妈的体检单翻出来了，吃了三个月的变化都在这张纸上。不说效果，你们自己看。</div>
      <div class="v24-xhs-tags">#磷虾油 #中老年健康 #心血管</div>
      <div class="v24-xhs-ops">
        <span>♥ ${val("like", p.likes)}</span>
        <span>☆ ${val("cmt", p.comments)}</span>
        <span>✎ 评论</span>
      </div>
    </div>`;

  return `<div class="app" style="background:#F2F1F6">
    ${C.sb()}
    ${C.ab({ title: "发到平台长什么样", sub: w.title, back: "A8.4.1?c=" + w.id, act: "分享" })}

    <div class="body" style="padding-top:0">
      <div class="v24-tabs">
        ${["wx", "dy", "xhs"].map((k) => `<span class="${pf === k ? "on" : ""}" data-set="A8.4.2.pf=${k}">${L.plats[k].name}</span>`).join("")}
      </div>

      ${skin}

      <div class="v24-edit">
        <div class="v24-edit-hd">模拟互动数据<em>改了立刻看到效果</em></div>
        <div class="v24-edit-grid">
          <label><span>点赞</span><input data-bind="A8.4.2.${pf}_like" value="${val("like", p.likes)}"></label>
          <label><span>评论</span><input data-bind="A8.4.2.${pf}_cmt" value="${val("cmt", p.comments)}"></label>
          <label><span>分享</span><input data-bind="A8.4.2.${pf}_share" value="${val("share", p.shares)}"></label>
          <label><span>转发</span><input data-bind="A8.4.2.${pf}_fw" value="${val("fw", p.forwards)}"></label>
        </div>
      </div>

      <div class="v24-link">
        <div class="v24-link-hd">贴真实链接，抓平台数据</div>
        <div class="v24-link-row">
          <input placeholder="粘贴${p.name}的作品链接" />
          <span class="v24-link-btn">抓取</span>
        </div>
        <div class="v24-link-tip">抓得到就用真实数据；抓不到也不影响，上面的数可以手填。</div>
      </div>

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        这里的数只影响「发出去长什么样」的模拟效果，不会回写到作品的真实数据。
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" data-go="A8.4.1?c=${w.id}" data-label="回作品"><span>‹</span><b>作品</b></div>
      <div class="btn" data-go="L1?pf=${pf}&c=${w.id}" data-label="分享到朋友圈">分享到朋友圈</div>
    </div>
  </div>`;
};
