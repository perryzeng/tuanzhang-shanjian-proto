window.PAGES["B2"].states = [
  { k: "browse", n: "浏览态：整段扫读，只有当前段有操作行" },
  { k: "edit", n: "编辑态：台词就地展开，不用改的段折叠" }
];

window.PAGES["B2"].render = function (ctx) {
  const C = window.C;
  const edit = (ctx.mode || "browse") === "edit";

  const estage = C.estage({
    preview: {
      bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)",
      no: "02/05",
      cap: "今晚开团",
      pip: !edit
    },
    code: "00:12 / 00:40",
    track: [[8, "done"], [14, "cur"], [10, ""], [10, ""], [6, ""]],
    paused: edit,
    now: edit
      ? `<b>试听中 · 第 2 段（AI 配音）</b> · 改完即时重配`
      : `<b>第 2 段 · 磷虾油是什么</b><br>主画面：你的小视频 3s + 团队库特写`
  });

  const bar = `<div class="actionbar">
    <div class="etools">
      <div class="eto" data-set="B2.mode=edit"><span style="font-size:13px">♪</span><b>声音</b></div>
      <div class="eto" data-set="B2.mode=edit"><span style="font-size:13px">♫</span><b>音乐</b></div>
      <div class="eto" data-set="B2.mode=edit"><span style="font-size:13px">▭</span><b>字幕</b></div>
    </div>
    <div class="btn ai" data-go="B3" data-label="① 生成 · 混剪">① 生成 · 混剪</div>
  </div>`;

  const seg01 = C.seg({
    no: "01", name: "我是谁 · 立信任", dur: "8s", tags: [["p", "画中画"]],
    vo: "我是阿珍，做大健康选品 5 年。",
    editSet: "B2.mode=edit",
    clips: [{ bg: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", label: "空镜", pip: true }],
    state: edit ? "dim" : ""
  });

  const seg02 = C.seg({
    no: "02", name: edit ? "磷虾油是什么" : "磷虾油是什么", dur: "14s", tags: edit ? [["g", "我的片段"]] : [],
    vo: edit ? null : "今晚开团磷虾油，选购门道一次讲清楚。",
    editbox: edit ? "今晚开团磷虾油，选购门道一次讲清楚——从原料、含量到认准标志，三步教你不踩坑。" : null,
    editOps: edit ? [["hot", "✦ AI 帮我写"], ["", "语气 · 亲切"], ["go", "完成"]] : null,
    clips: [
      { bg: "linear-gradient(150deg,#7C5CFF,#B08CFF)", label: "小视频" },
      { bg: "linear-gradient(150deg,#00A8E8,#00C2FF)", label: "特写" },
      { add: true, label: "＋", go: "B2.1" }
    ],
    ops: edit ? null : [
      { t: "换片段", go: "B2.1" },
      { t: "＋ 随手拍", cls: "hot", go: "B2.2" },
      { t: "▶ 试听" }
    ],
    state: edit ? "on" : ""
  });

  const seg03 = edit ? null : C.seg({
    no: "03", name: "血管知识示意", dur: "10s", tags: [["a", "AI 生成"]],
    vo: "南极磷虾油，每粒含磷脂型 Omega-3，吸收率是普通鱼油的三倍。",
    editGo: "B2.1",
    clips: [
      { bg: "linear-gradient(150deg,#00C2FF,#00A8E8)", label: "示意" },
      { add: true, label: "＋", go: "B2.1" }
    ]
  });

  const fold04 = C.fold({
    no: "04", tag: ["", "品牌锁定"],
    text: "产品落卖点 · 官方 4K 特写 · 锁定不可改",
    cover: "linear-gradient(150deg,#5B3FD1,#7C5CFF)"
  });

  const seg05 = C.seg({
    no: "05", name: "CTA · 开团", dur: "6s", tags: [["r", "缺素材"]],
    vo: "点我头像参团，只有 500 单。",
    editSet: "B2.mode=edit",
    clips: [{ add: true, need: true, label: "缺花字卡", go: "B2.1" }, { add: true, label: "＋", go: "B2.1" }],
    ops: [
      { t: "✦ AI 生成花字卡", cls: "hot" },
      { t: "图库替代", go: "B2.1" },
      { t: "换说法免素材" }
    ],
    state: "miss"
  });

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="B1" data-label="返回创作中心">‹</span>
      <div class="ttl">发布器 · 磷虾油今晚开团<small>${edit ? "正在编辑第 2 段台词" : "① 脚本 × 素材 同页改 · 改完直接生成"}</small></div>
      <span class="act" data-set="B2.mode=${edit ? "browse" : "edit"}">${edit ? "完成" : "编辑"}</span>
    </div>

    ${estage}

    ${edit ? "" : `<div class="hintline"><span class="hic">✦</span><span><b>AI 已按段落语义配好画面</b>，出镜处用你的照片画中画</span><span class="r2">换一批</span></div>
    <div class="listhead"><b>分段</b>5 段 · 约 40 秒 · <span style="color:var(--success);font-weight:700">合规 ✓</span><span style="flex:1"></span><span class="tag r">缺 1 段</span></div>`}

    ${edit ? "" : `<div class="fade" style="bottom:74px"></div>`}
    <div class="body" style="padding:${edit ? "12px 16px 24px" : "0 16px 24px"}">
      ${edit ? C.fold({ no: "01", text: "我是谁 · 立信任 · 8s · 已配好（照片画中画）", cover: "linear-gradient(150deg,#2C5BFF,#5B8CFF)", go: "B2.1" }) : seg01}
      ${seg02}
      ${edit ? "" : seg03}
      ${edit ? "" : fold04}
      ${seg05}
    </div>

    ${bar}
  </div>`;
};
