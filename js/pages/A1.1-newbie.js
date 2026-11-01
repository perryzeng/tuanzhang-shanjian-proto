/* A1.1 首页 · 纯新用户版（注册 ≤ 7 天且发布数 = 0）
   和 A1（老用户日常版）并行存在，两个版本各自独立可点。
   业务逻辑与数据来源见 PRD §4.10。 */

window.PAGES["A1.1"].prd = "PRD §4.10 · 首页（纯新用户）";
window.PAGES["A1.1"].sysEntry = "注册 ≤7 天且未发布过视频 → 登录默认落地这一版（不靠点击进入）";

window.PAGES["A1.1"].render = function () {
  const C = window.C, G = window.G;
  const D = window.DATA, A = window.DERIVE;
  const me = D.me;

  /* 新人位：单张，不轮播（轮播只对多张生效） */
  const banner = C.banner({
    items: [{
      img: "assets/bn-3.jpg", pos: "center 50%", badge: "新人专享",
      title: "新人 7 天流量扶持计划", sub: "前 3 条视频平台加倍推送",
      btn: "看规则", go: "D1"
    }]
  });

  /* 同行案例：平台内容池，同类目 + 同量级 + 高完播 */
  const cases = A.newbieCases(3).map((v) => ({
    bg: v.bg, who: v.who.slice(-1), whoBg: v.whoBg,
    plays: A.plays(v.plays), title: v.title, sub: v.sub, go: v.go
  }));

  return `<div class="app">
    ${C.sb()}
    ${C.hrow({
      av: me.name.slice(-1),
      hi: "你好，" + me.name,
      hs: "新人第 1 天 · 已解锁 7 天流量扶持",
      unread: String(me.unread)
    })}

    <div class="body">
      ${banner}

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
      ${C.vrail(cases)}

      <div class="xs" style="text-align:center;margin:16px 0 4px">发出第 1 条后，首页自动升级为日常版</div>
    </div>

    ${C.tab("A1")}
  </div>`;
};
