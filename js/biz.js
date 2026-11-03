/* 经营层数据（V14）
   重要前提（用户 2026-11-02 明确）：**这个应用没有商品模块，也没有交易模块。**
   成交发生在微信 / 团购群里，不经过本产品。

   所以这里刻意不出现：SKU、库存、价格体系、订单、支付、购物车、GMV。
   这里出现：一段"这一波在推什么"（团长自己起的名，系统只当标签）、
   内容走到第几条、谁看了、谁问了、谁成交了（**成交是团长自己标的**）。
   页面上凡是成交数字，都要让人知道是手标的，不是系统抓的。 */

window.BIZ = (function () {
  const me = {
    name: "阿珍",
    av: "珍",
    ip: "做心脑血管科普的靠谱团长",
    fans: 1286,
    group: "前海团长 · 3 组"
  };

  /* 一波内容 = 团长自己说"这段时间我在推什么"。
     它不是商品，是内容主线：讲清楚 → 给证据 → 给理由。
     系统不关心你卖多少钱，只关心这一波讲到第几条、还差哪一环。 */
  const wave = {
    id: "w_krill",
    name: "磷虾油 · 秋冬心脑血管",
    note: "自己起的名字",
    day: 5,
    openIn: 2,
    phases: [
      { k: "讲清楚为什么需要", short: "讲清楚", total: 4, done: 4 },
      { k: "给证据：真人反馈", short: "给证据", total: 2, done: 0, now: true },
      { k: "给理由：价格和名额", short: "给理由", total: 2, done: 0 }
    ],
    sent: 4,
    plan: 8,
    reached: 213,
    visitors: 47,
    leads: 9,
    deals: 3,
    today: {
      ep: 5,
      name: "老客回购实拍",
      angle: "吴阿姨吃了 3 个月，让她自己说",
      line: "我也不劝你买，你先看我这张体检单",
      dur: "约 45 秒 · 3 段",
      why: "前 4 条讲完「为什么要吃」，这条补「别人吃了有没有用」"
    },
    draft: {
      ep: 4,
      id: "d_4",
      name: "磷虾油到底适合谁",
      stuck: "缺 2 段素材",
      at: "昨天 21:40 卡住",
      go: "B1.4"
    }
  };

  const yesterday = {
    sent: 3,
    visitors: 47,
    repeat: 9,
    asked: 2,
    deals: 0,
    topLead: {
      id: "u_amei",
      name: "阿梅",
      av: "梅",
      bg: "linear-gradient(135deg,#FF8A65,#FF6B6B)",
      score: 86,
      why: "看了 3 遍，还点了「问团长」"
    }
  };

  const pending = [
    {
      id: "v_pending_1",
      title: "磷虾油到底适合谁？这 3 类人别乱买",
      at: "今天 09:20 剪好",
      hours: 5,
      dur: "42 秒",
      img: "assets/gen/p-still.jpg",
      ep: 4
    },
    {
      id: "v_pending_2",
      title: "我妈吃了三个月，体检单上的变化",
      at: "昨晚 21:40 剪好",
      hours: 17,
      dur: "51 秒",
      img: "assets/gen/p-person.jpg",
      ep: 3
    }
  ];

  /* 客户：没有交易模块，所以「成交」永远是团长自己标的。
     系统能给的是行为：看了几次、停留多久、看到第几个要点、有没有点「问我」。 */
  const leads = [
    {
      id: "u_amei", call: "梅姐", name: "阿梅", av: "梅", score: 86,
      bg: "linear-gradient(135deg,#FF8A65,#FF6B6B)",
      acts: "看了 3 遍 · 停留 1 分 12 秒 · 点了「问团长」",
      from: "朋友圈", last: "12 分钟前", wave: "w_krill",
      tags: ["看过 3 次", "点过问团长"],
      hook: "她点过「问团长」，说明在算账。先给团购信息，别讲成分"
    },
    {
      id: "u_qiang", call: "强哥", name: "阿强", av: "强", score: 74,
      bg: "linear-gradient(135deg,#7C6CFF,#A78BFA)",
      acts: "看完 2 遍 · 评论区问「多少钱一盒」",
      from: "微信群", last: "1 小时前", wave: "w_krill",
      tags: ["问过价", "看完 2 遍"],
      hook: "已经开口问价，直接报团购价 + 还剩几个名额"
    },
    {
      id: "u_hua", call: "华姐", name: "阿华", av: "华", score: 58,
      bg: "linear-gradient(135deg,#5AC8FA,#0A86C4)",
      acts: "看完 1 遍 · 收藏了视频",
      from: "私聊", last: "3 小时前", wave: "w_krill",
      tags: ["收藏了"],
      hook: "收藏是「想买但没定」。发一条老客反馈给她，不催"
    },
    {
      id: "u_li", call: "李姐", name: "李姐", av: "李", score: 46,
      bg: "linear-gradient(135deg,#12B886,#0B8C68)",
      acts: "停留 48 秒 · 没互动",
      from: "朋友圈", last: "昨天", wave: "w_krill",
      tags: ["看过 1 次"],
      hook: "还在门口看。别私信，先让她多看两条"
    },
    {
      id: "u_wang", call: "王叔", name: "王叔", av: "王", score: 38,
      bg: "linear-gradient(135deg,#FAC775,#BA7517)",
      acts: "看了 1 遍 · 划走了",
      from: "朋友圈", last: "昨天", wave: "w_krill",
      tags: ["看过 1 次"],
      hook: "没看完。可能开头不抓人，下次换个说法"
    }
  ];

  const team = [
    {
      who: "小敏", av: "敏", img: "assets/gen/p-person.jpg",
      title: "我妈吃了三个月……",
      note: "带来 3 位高潜、1 单成交",
      hit: "同款可复制",
      go: "F1"
    },
    {
      who: "阿珍", av: "珍", img: "assets/gen/p-chat.jpg",
      title: "体检单上这 3 个指标",
      note: "带来 5 位高潜，本组最高",
      hit: "本组第一",
      go: "F1"
    },
    {
      who: "大刘", av: "刘", img: "assets/gen/p-still.jpg",
      title: "299 两瓶，够吃两个月",
      note: "带来 2 单成交，转化最快",
      hit: "转化最快",
      go: "F1"
    }
  ];

  const todo = [
    { tx: "脚本审核：秋季话术 v2", from: "团队", go: "T2" },
    { tx: "今日打卡 · 连续第 6 天", from: "SOP", go: "D1" }
  ];

  const channels = [
    { k: "moments", name: "朋友圈", note: "一次性触达所有人 · 靠封面抓人", icon: "圈", tx: "发到朋友圈" },
    { k: "group", name: "微信群", note: "熟人群 · 可以直接讲价", icon: "群", tx: "发到 3 个群" },
    { k: "dm", name: "私聊", note: "一对一 · 只发给她一个人看", icon: "聊", tx: "发给指定的人" }
  ];

  const scripts = {
    moments: {
      title: "朋友圈文案 · 已按你的人设调过",
      body: "很多人问我磷虾油到底该不该吃。\n我不劝，先看这张体检单——我妈吃了三个月的变化。\n想了解的私信我，我一条条回。",
      tip: "配 1 张封面图 + 视频。前 2 行决定有没有人点「展开」"
    },
    group: {
      title: "群话术 · 带团购信息",
      body: "@所有人 上次问磷虾油的姐妹，今晚 8 点开团。\n2 瓶 299，比平时便宜 99，只有 20 份。\n想先了解的看我这条视频，别急着买。",
      tip: "群里先给理由再给价。只发价格会被当成广告"
    },
    dm: {
      title: "私聊话术 · 按她的行为生成",
      body: "梅姐，看你前两天点开过磷虾油那条，\n是不是在犹豫要不要给叔叔买？\n我把体检单和吃法整理成一页了，你先看看，不着急。",
      tip: "提到「她点开过」比提产品更有用 —— 这是一对一才有的优势"
    }
  };

  /* 落地页：没有交易动作。不放下单按钮、不放购物车，
     因为成交在微信里完成，这一页只负责「讲明白 + 让她来问我」。 */
  const landing = {
    seller: { name: "阿珍 · 前海团长", av: "珍", note: "做心脑血管科普 3 年 · 1286 位邻居在跟" },
    title: "磷虾油到底适合谁？这 3 类人别乱买",
    video: { img: "assets/gen/p-still.jpg", dur: "0:42" },
    offer: "团购 299 / 2 瓶 · 想要直接问我",
    points: [
      "每粒 500mg 磷脂型虾青素，吸收率是鱼油的 3 倍",
      "46 项无重金属检测，老人小孩都能吃",
      "一天不到 5 块钱，比买保健品划算"
    ],
    cta: "问阿珍要一份吃法",
    tracked: [
      ["谁点开的", "阿梅 · 12 分钟前"],
      ["看了多久", "1 分 12 秒 · 看到第 3 个要点"],
      ["点了什么", "「问团长」×1"]
    ]
  };

  const now = "2026-11-02 14:20";

  return { me, wave, yesterday, pending, leads, team, todo, channels, scripts, landing, now };
})();
