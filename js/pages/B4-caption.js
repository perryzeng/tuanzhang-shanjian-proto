window.PAGES["B4"].prd = "PRD §6.15 · 做一张封面（底图 × 版式）";
window.PAGES["B4"].states = [
  { k: "", n: "默认：视频首帧当底图，六种爆款排法任选；也能从相册换一张" }
];

/* 单独做一张封面。

   注意它**不在生成链路上**了：生成前的封面已经在 B2.4 里跟模板、声音一起定完，
   这一页只是两个独立入口的落点——
   · 首页工具位「AI 封面」：团长想单独做张图发群里/朋友圈；
   · 成品详情里的「改封面」：发出去之后想换一张。

   页面内容和 B2.4 里那块是同一个组件（C.coverKit），不各写一遍：
   封面是"底图 × 版式"这件事只有一套规则，两处画法不一样迟早对不上。 */
window.PAGES["B4"].render = function (ctx) {
  const C = window.C;

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "做一张封面", sub: "只做封面，不剪视频", back: "back" })}

    <div class="body">
      ${C.coverKit({ pid: "B4", ctx })}

      <div class="note" style="margin-top:11px;line-height:1.7">
        换成自己那张脸、那盘货，点击率本来就更高——AI 只负责排字，不负责编画面。
      </div>
    </div>

    <div class="actionbar">
      <div class="btn" data-go="B4.1" data-label="保存封面 · 看成品">✓ 保存这张封面</div>
    </div>
  </div>`;
};
