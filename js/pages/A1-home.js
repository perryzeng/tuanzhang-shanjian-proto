/* A1 首页
   两个场景：
   - old：老用户日常首页（Banner → 发布器 Dock → 今天必须做 → 今天发什么 → 团队/平台）
   - new：新用户首周首页（Banner → 发第一条引导 → 立人设 → 新手清单 → 同行案例）
   右侧面板「本页状态」可切换。 */

window.PAGES["A1"].states = [
  { k: "old", n: "老用户：今天必须做 + 今天发什么 + 团队/平台" },
  { k: "new", n: "新用户：引导发第一条 + 立身份 IP 人设" }
];

window.PAGES["A1"].render = function (ctx) {
  const C = window.C, G = window.G;
  const mode = (ctx.mode || "old") === "new" ? "new" : "old";

  /* ---------- 头部 Banner（两个场景共用组件，内容不同） ---------- */
  const bannerOld = C.banner({
    items: [
      {
        img: "assets/bn-1.jpg", badge: "今晚 20:00 开团", pos: "center 46%",
        title: "磷虾油专场 · 团长专项价",
        sub: "库存 300 组 · 一键生成开团视频",
        btn: "去开团", go: "B1"
      },
      {
        img: "assets/bn-2.jpg", badge: "新功能", pos: "center 32%",
        title: "AI 帮你剪，3 分钟出一条",
        sub: "不用出镜，一张照片也能当主播",
        btn: "试一下", go: "B1"
      },
      {
        img: "assets/bn-3.jpg", badge: "团队", pos: "center 50%",
        title: "团长训练营 · 第 9 期报名",
        sub: "7 天起号 · 平台流量扶持",
        btn: "报名", go: "E1"
      }
    ]
  });

  const bannerNew = C.banner({
    items: [{
      img: "assets/bn-3.jpg", badge: "新人专享", pos: "center 50%",
      title: "新人 7 天流量扶持计划",
      sub: "前 3 条视频平台加倍推送",
      btn: "看规则", go: "D1"
    }]
  });

  /* ---------- 老用户 ---------- */
  if (mode === "old") {
    return `<div class="app">
      ${C.sb()}
      ${C.hrow({ av: "珍", hi: "下午好，阿珍", hs: "广东深圳 · 团队 12 人", unread: "3" })}

      <div class="body">
        ${bannerOld}

        ${C.dock({
          main: { title: "AI 剪辑发布器", sub: "选品 → 说一句口径 → 自动出片", btn: "立即开剪", go: "B1" },
          tools: [
            { ic: "⧉", tx: "剪同款", go: "C1", bg: G("#7C5CFF", "#B08CFF") },
            { ic: "▤", tx: "素材库", go: "E2", bg: G("#2C5BFF", "#00C2FF") },
            { ic: "◎", tx: "我的出镜", go: "E2.1", bg: G("#00A8E8", "#5B8CFF") },
            { ic: "◷", tx: "定时任务", go: "T1", bg: G("#1B3EDB", "#5B8CFF") }
          ]
        })}

        ${C.sec("今天必须做", "3 项 · 全部 ›", "D1")}
        ${C.tasks([
          {
            badge: "今天截止", cls: "hot", time: "23:59 前",
            title: "补 3 秒手部特写，磷虾油开团才能发",
            meta: "脚本和 4 段画面都已备好，只缺这一段",
            from: "来自：运营 · 阿强", btn: "去拍", go: "B2.2"
          },
          {
            badge: "团队任务", time: "18:00 前",
            title: "发 1 条「换季免疫力」主题视频",
            meta: "带团队话题发，能进本周榜单 · 你 0/1",
            from: "来自：SOP 第 3 天", btn: "去剪", go: "B1"
          },
          {
            badge: "今日打卡", cls: "todo", time: "还剩 4 小时",
            title: "评论区回 5 条「孩子能吃吗」",
            meta: "完成可续签本周流量扶持",
            from: "来自：SOP 战役", btn: "去打卡", go: "D1"
          }
        ])}

        ${C.sec("今天发什么", "助理推荐 · 换一批")}
        <div class="xs" style="margin:-6px 2px 10px">助理已按你的粉丝问题和近 7 天数据排好，直接用即可</div>
        ${C.li({ bg: G("#2C5BFF", "#5B8CFF"), im: "✦", title: "磷虾油 · 3 秒开箱钩子", m1: "✦ 同类完播率高 32%", m1cls: "hint", m2: "38 秒 · 4 段 · 素材库有 8 条", btn: "生成", go: "B1" })}
        ${C.li({ bg: G("#7C5CFF", "#B08CFF"), im: "✦", title: "换季免疫 · 口播拆功效", m1: "✦ 粉丝 7 天问了 12 次", m1cls: "hint", m2: "45 秒 · 5 段 · 缺 1 段特写", btn: "生成", go: "B1" })}
        ${C.li({ bg: G("#00A8E8", "#00C2FF"), im: "⚡", title: "老客复购 · 晒单合集", m1: "✦ 团队爆款结构 · 已过审", m1cls: "hint", m2: "32 秒 · 3 段 · 剪同款可套", btn: "套用", go: "C1" })}

        ${C.sec("团队最新", "团队 ›", "E1")}
        ${C.vrail([
          { bg: G("#2C5BFF", "#00C2FF"), who: "玲", whoBg: "rgba(44,91,255,.92)", plays: "12.4万", title: "磷虾油开箱 · 我妈也在吃", sub: "阿玲 · 2 小时前", go: "F3" },
          { bg: G("#7C5CFF", "#B08CFF"), who: "强", whoBg: "rgba(124,92,255,.92)", plays: "8.6万", title: "客户复购实录 · 第 3 次买", sub: "阿强 · 5 小时前", go: "F3" },
          { bg: G("#00A8E8", "#5B8CFF"), who: "雨", whoBg: "rgba(0,168,232,.92)", plays: "5.2万", title: "换季话术 · 3 句话讲完", sub: "小雨 · 昨天", go: "F3" }
        ])}

        ${C.sec("平台精选 · 运营推荐", "广场 ›", "F1")}
        ${C.themes([
          { img: "assets/bn-2.jpg", pos: "center 34%", title: "秋季滋补专题", sub: "12 条现成素材 · 平台已过审", go: "F1" },
          { img: "assets/bn-1.jpg", pos: "center 44%", title: "高转化开箱合集", sub: "照着结构改就能发", go: "F1" }
        ])}
        <div class="xs" style="text-align:center;margin:16px 0 4px">— 已经到底了 —</div>
      </div>

      ${C.tab("A1")}
    </div>`;
  }

  /* ---------- 新用户 ---------- */
  return `<div class="app">
    ${C.sb()}
    ${C.hrow({ av: "珍", hi: "下午好，阿珍", hs: "新人第 1 天 · 已解锁流量扶持", unread: "1" })}

    <div class="body">
      ${bannerNew}

      ${C.onb({
        k: "第一步 · 从这里开始", steps: 1,
        t: "今天先把第一条视频发出去",
        d: "AI 已经写好脚本、配好画面，你只要点一下，3 分钟出片。",
        btn: "帮我发第一条", go: "B1"
      })}

      ${C.persona({
        title: "让 AI 认识你（身份 IP 人设）", note: "0/3",
        desc: "回答 3 个问题，之后每条脚本都按你的人设写，越用越像你。",
        tags: [{ tx: "我是谁" }, { tx: "卖什么" }, { tx: "给谁看" }],
        go: "G1"
      })}

      ${C.sec("新手清单", "1/4 已完成")}
      ${C.checklist([
        { tx: "注册并绑定微信", done: true },
        { tx: "设置身份 IP 人设（2 分钟）", go: "G1" },
        { tx: "发出第一条视频", go: "B1" },
        { tx: "加入团队素材库", go: "E2" }
      ])}

      ${C.sec("同行都在这么发", "更多案例 ›", "F1")}
      <div class="xs" style="margin:-6px 2px 10px">不用原创，照着这几条的结构改，先跑出第一条数据</div>
      ${C.vrail([
        { bg: G("#2C5BFF", "#00C2FF"), who: "玲", whoBg: "rgba(44,91,255,.92)", plays: "12.4万", title: "开箱第一句就说价格", sub: "新手最容易抄的一条", go: "F3" },
        { bg: G("#7C5CFF", "#B08CFF"), who: "强", whoBg: "rgba(124,92,255,.92)", plays: "8.6万", title: "先讲问题再讲产品", sub: "完播率最高结构", go: "F3" },
        { bg: G("#00A8E8", "#5B8CFF"), who: "雨", whoBg: "rgba(0,168,232,.92)", plays: "5.2万", title: "晒单 + 一句我的感受", sub: "不用出镜也能拍", go: "F3" }
      ])}
    </div>

    ${C.tab("A1")}
  </div>`;
};
