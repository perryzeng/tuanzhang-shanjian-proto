window.PAGES["F1"].render = function () {
  const C = window.C, G = window.G;

  /* 剪同款：平台运营的"可抄作业"库。分四类内容——视频模板 / 封面 / 脚本 / 主题，
     每个分类是一个横向可滑的 chip，下面是 2 列 9:16 模板卡，右下角「做同款」。 */

  const TABS = [
    ["hot", "🔥", "热门"],
    ["video", "▶", "视频模板"],
    ["cover", "▤", "封面"],
    ["script", "≡", "脚本"],
    ["topic", "◈", "主题"]
  ];

  /* 模板卡：封面 + 标题 + 作者 + 做同款 */
  const card = (t) => `
    <div class="ttile">
      <div class="tcov" style="background:${t.bg}">
        ${t.tag ? `<span class="tctag">${t.tag}</span>` : ""}
        <span class="tcdur">${t.dur}</span>
        <div class="tcovtx">${t.cap}</div>
      </div>
      <div class="ttcap">${t.title}</div>
      <div class="ttft">
        <span class="tav" style="background:${t.avbg}">${t.av}</span>
        <span class="tname">${t.by}</span>
        <span class="tdo" data-go="F3" data-label="做同款 · ${t.title}">做同款</span>
      </div>
    </div>`;

  const FEED = [
    { bg: G("#FF7A9C", "#FF3D6E"), cap: "美业人必看\n好业绩的关键", title: "经典 · 可换色", dur: "0:32", by: "小晓说房", av: "晓", avbg: G("#FF7A45", "#FF3D6E"), tag: "爆款", hot: true },
    { bg: G("#7C5CFF", "#B08CFF"), cap: "明星同款\n高级红 · 双语", title: "高级红 · 双语", dur: "0:28", by: "阿北选款小店", av: "北", avbg: G("#7C5CFF", "#2C5BFF"), tag: "", hot: true },
    { bg: G("#FFB648", "#FF7A45"), cap: "包包脸速退！\n私域运营", title: "素雅姜红", dur: "0:41", by: "阿黎妈咪", av: "黎", avbg: G("#F5A623", "#FFC85B"), tag: "", hot: true },
    { bg: G("#00C2FF", "#2C5BFF"), cap: "开小拍\n一镜到底", title: "秀丽 · 可换色", dur: "0:35", by: "美甲小贝", av: "贝", avbg: G("#00A8E8", "#00C2FF"), tag: "", hot: false },
    { bg: G("#5B8CFF", "#8FB0FF"), cap: "私域秘籍\n照抄就出单", title: "营销口播 v3", dur: "0:30", by: "阿玲", av: "玲", avbg: G("#2C5BFF", "#5B8CFF"), tag: "团队", hot: false },
    { bg: G("#00B389", "#00C2FF"), cap: "哈喽\nHello everyone", title: "开场双语钩子", dur: "0:18", by: "小雨", av: "雨", avbg: G("#00B389", "#00C2FF"), tag: "", hot: false }
  ];

  const chips = TABS.map(([k, ic, tx]) =>
    `<span class="chip${k === "hot" ? " on" : ""}">${ic} ${tx}</span>`).join("");

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "剪同款", t: "同行都在拍，一键做同款", act: `<span class="btn-pill line">＋ 发布</span>` })}

    <div class="body" style="padding-bottom:100px">
      <div class="gsearch"><span class="mag">⌕</span><span>搜模板、脚本、封面、主题</span></div>

      <div class="chips" style="margin-bottom:14px">${chips}</div>

      <div class="ttgrid">${FEED.map(card).join("")}</div>
    </div>

    ${C.tab("F1")}
  </div>`;
};
