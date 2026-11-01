window.PAGES["F1"].render = function (ctx) {
  const C = window.C, G = window.G;

  /* 剪同款：平台运营的"可抄作业"库。
     5 个分类 tab（热门/视频模板/封面/脚本/主题）都能点，且**每类展示形式不同**：
     热门=爆款大图 + 模板卡；视频模板=2 列 9:16 卡；封面=封面墙；脚本=脚本行；主题=主题大卡。 */

  const TABS = [
    ["hot", "🔥", "热门"],
    ["video", "▶", "视频模板"],
    ["cover", "▤", "封面"],
    ["script", "≡", "脚本"],
    ["topic", "◈", "主题"]
  ];
  const tab = TABS.some((t) => t[0] === ctx.tab) ? ctx.tab : "hot";

  const VIDEO = [
    { bg: G("#FF7A9C", "#FF3D6E"), cap: "美业人必看\n好业绩的关键", title: "经典 · 可换色", dur: "0:32", by: "小晓说房", av: "晓", avbg: G("#FF7A45", "#FF3D6E"), tag: "爆款", uses: "1.2万", likes: "3.4万" },
    { bg: G("#7C5CFF", "#B08CFF"), cap: "明星同款\n高级红 · 双语", title: "高级红 · 双语", dur: "0:28", by: "阿北选款小店", av: "北", avbg: G("#7C5CFF", "#2C5BFF"), tag: "", uses: "6,200", likes: "2.1万" },
    { bg: G("#FFB648", "#FF7A45"), cap: "包包脸速退！\n私域运营", title: "素雅姜红", dur: "0:41", by: "阿黎妈咪", av: "黎", avbg: G("#F5A623", "#FFC85B"), tag: "", uses: "8,600", likes: "1.8万" },
    { bg: G("#00C2FF", "#2C5BFF"), cap: "开小拍\n一镜到底", title: "秀丽 · 可换色", dur: "0:35", by: "美甲小贝", av: "贝", avbg: G("#00A8E8", "#00C2FF"), tag: "", uses: "5,400", likes: "9,800" },
    { bg: G("#5B8CFF", "#8FB0FF"), cap: "私域秘籍\n照抄就出单", title: "营销口播 v3", dur: "0:30", by: "阿玲", av: "玲", avbg: G("#2C5BFF", "#5B8CFF"), tag: "团队", uses: "4,100", likes: "1.2万" },
    { bg: G("#00B389", "#00C2FF"), cap: "哈喽\nHello everyone", title: "开场双语钩子", dur: "0:18", by: "小雨", av: "雨", avbg: G("#00B389", "#00C2FF"), tag: "", uses: "3,300", likes: "7,600" }
  ];
  const COVERS = [
    { bg: G("#FF7A9C", "#FF3D6E"), cap: "美业人必看\n好业绩的关键", hot: true, uses: "1.2万", likes: "3.4万" },
    { bg: G("#FFB648", "#FF7A45"), cap: "包包脸速退！\n7 天见效", hot: true, uses: "8,600", likes: "1.8万" },
    { bg: G("#7C5CFF", "#B08CFF"), cap: "明星同款\n高级红 · 双语", hot: false, uses: "6,200", likes: "2.1万" },
    { bg: G("#00C2FF", "#2C5BFF"), cap: "开小拍\n一镜到底", hot: false, uses: "5,400", likes: "9,800" },
    { bg: G("#2C5BFF", "#5B8CFF"), cap: "私域秘籍\n照抄就出单", hot: true, uses: "4,100", likes: "1.2万" },
    { bg: G("#00B389", "#00C2FF"), cap: "哈喽\nHello everyone", hot: false, uses: "3,300", likes: "7,600" }
  ];
  const SCRIPTS = [
    { title: "磷虾油 3 段式 · 信任版", by: "阿玲", tag: "口播", uses: "128", likes: "3.2万" },
    { title: "开箱带货结构 · 5 段骨架", by: "总部", tag: "开箱", uses: "96", likes: "1.8万" },
    { title: "先别买 · 反转开场", by: "阿强", tag: "钩子", uses: "74", likes: "9,600" },
    { title: "复购催单 · 3 句收尾", by: "小雨", tag: "催单", uses: "52", likes: "6,200" }
  ];
  const TOPICS = [
    { name: "秋季滋补专题", sub: "12 个模板 · 2.6 万人用过", bg: G("#7C5CFF", "#2C5BFF") },
    { name: "高转化开箱合集", sub: "8 个模板 · 3.2 万人用过", bg: G("#2C5BFF", "#00C2FF") },
    { name: "信任背书口播", sub: "6 个模板 · 1.4 万人用过", bg: G("#00A8E8", "#00C2FF") }
  ];

  /* 视频模板卡（热门 / 视频模板共用） */
  const vcard = (t) => `<div class="ttile">
      <div class="tcov" style="background:${t.bg}">
        ${t.tag ? `<span class="tctag">${t.tag}</span>` : ""}
        <span class="tcdur">${t.dur}</span>
        <div class="tcovtx">${t.cap}</div>
      </div>
      <div class="ttcap">${t.title}</div>
      <div class="ttmeta">用 ${t.uses} · ♥ ${t.likes}</div>
      <div class="ttft"><span class="tav" style="background:${t.avbg}">${t.av}</span>
        <span class="tname">${t.by}</span>
        <span class="tdo" data-go="F3" data-label="做同款 · ${t.title}">做同款</span></div>
    </div>`;

  const bodyOf = {
    hot: () => {
      const f = VIDEO[0];
      return `<div class="tfeature" data-go="F3" data-label="本周爆款 · ${f.title}">
        <div class="tfimg" style="background:${f.bg}">
          <span class="tfbadge">🔥 本周爆款</span>
          <div class="tfcap">${f.cap}</div>
          <span class="tfmeta">▶ 8.6 万播放 · 已用 128 次</span>
        </div>
        <div class="tfinfo"><b>${f.title}</b><span>@${f.by} · 3 段 40 秒</span>
          <span class="tdo" data-go="F3" data-label="做同款 · ${f.title}">做同款</span></div>
      </div>
      <div class="ttgrid">${VIDEO.slice(1, 5).map(vcard).join("")}</div>`;
    },
    video: () => `<div class="ttgrid">${VIDEO.map(vcard).join("")}</div>`,
    cover: () => `<div class="cvgrid">${COVERS.map((c) => `<div class="cvcard" data-go="F3" data-label="封面 · ${c.cap.replace(/\n/g, "")}">
        <div class="cvim" style="background:${c.bg}">
          ${c.hot ? `<span class="cvhot">爆款</span>` : ""}
          <div class="cvtxt">${c.cap}</div>
        </div>
        <div class="cvft"><span>用 ${c.uses}</span><span>♥ ${c.likes}</span></div>
      </div>`).join("")}</div>`,
    script: () => `<div class="sclist">${SCRIPTS.map((s) => `<div class="scrow" data-go="F3" data-label="${s.title}">
        <span class="sctic">≡</span>
        <div class="sctt"><b>${s.title}</b><span>${s.by} · 使用 ${s.uses} · ♥ ${s.likes}</span></div>
        <span class="sctag">${s.tag}</span>
        <span class="tdo" data-go="F3" data-label="做同款 · ${s.title}">做同款</span>
      </div>`).join("")}</div>`,
    topic: () => `<div class="tplist">${TOPICS.map((t) => `<div class="tpcard" style="background:${t.bg}" data-go="F1" data-label="${t.name}">
        <div class="tptx"><b>${t.name}</b><span>${t.sub}</span></div>
        <span class="tpgo">进入 ›</span>
      </div>`).join("")}</div>`
  };

  const chips = TABS.map(([k, ic, tx]) =>
    `<span class="chip${tab === k ? " on" : ""}" data-set="F1.tab=${k}">${ic} ${tx}</span>`).join("");

  return `<div class="app">
    ${C.sb()}
    ${C.ph({ k: "剪同款", t: "同行都在拍，一键做同款", act: `<span class="btn-pill line">＋ 发布</span>` })}

    <div class="body" style="padding-bottom:100px">
      <div class="gsearch"><span class="mag">⌕</span><span>搜模板、脚本、封面、主题</span></div>
      <div class="chips" style="margin-bottom:14px">${chips}</div>
      ${bodyOf[tab]()}
    </div>

    ${C.tab("F1")}
  </div>`;
};
