window.PAGES["D2"].states = [
  { k: "browse", n: "浏览态：这一集的骨架 + 今天的两段要现写" },
  { k: "edit", n: "编辑态：只改今天要换的那几段" }
];
window.PAGES["D2"].prd = "PRD §6.13 · 系列分集编辑（结构化脚本框的系列版）";

/* 系列为什么单独一页，不塞进 B2：
   单条视频的结构是「一条脚本 = N 个 part」；
   系列的结构是「一场战役 = M 天 × N 个 part」，其中大部分 part 每天复用，
   只有中间两段按当天主题重写。这是两种不同的东西，硬塞进同一个编辑器，
   要么单条被塞进一堆天数进度，要么系列丢掉了"复用"这个最大优势。

   但它和 B2 共享同一套底层：同一个 `draft()`、同一个 part 组件、同一个素材选择器、
   同样导向 B3 生成和 B4 发布——所以"发布链路"仍然是统一的。 */
window.PAGES["D2"].render = function (ctx) {
  const C = window.C, D = window.DERIVE;
  const mode = ctx.mode || "browse";
  const voVer = ctx.vo || "self";
  const c = D.campaign(ctx.c);
  const day = +ctx.d || c.day || 1;
  const d = D.draft("series", { day, pick: (ctx.seg && ctx.asset) ? { seg: ctx.seg, asset: ctx.asset } : null });
  const y = d.series.yesterday || {};
  const plan = D.dayPlan(c, day);
  const focus = d.segments.filter((s) => s.id === ctx.seg)[0] || d.cur;
  const pending = !!d.pendDay;
  const playing = ctx.pv || "";

  const pickGo = (id) => "B2.1?seg=" + id + "&kind=series&day=" + day;
  const backGo = "D1.2?c=" + c.id + "&d=" + day;

  const fixedN = d.segments.filter((s) => s.fixed).length;
  const variN = d.segCount - fixedN;

  function partHtml(s) {
    const isFocus = s.id === focus.id;
    const okShot = s.shots.filter((x) => !x.miss)[0];
    const badShot = s.shots.filter((x) => x.miss)[0];
    const slot = badShot
      ? { miss: true, label: badShot.label || "缺画面", go: pickGo(s.id) }
      : okShot ? { label: okShot.label, bg: okShot.bg, go: pickGo(s.id) }
      : { empty: true, label: "加画面", go: pickGo(s.id) };

    const tags = [].concat(
      s.fixed ? [["", "每天固定"]] : [["o", "今天要换"]],
      s.shots.some((x) => x.pip) ? [["p", "画中画"]] : []
    );

    const on = playing === s.id;
    const p = {
      no: s.no, name: s.name, dur: s.dur + "s", tags, slot, on: isFocus && mode === "edit",
      play: { on: on, act: on ? "D2.pv=" : "D2.pv=" + s.id }
    };
    if (on) p.playing = s.dur;

    if (mode === "edit" && isFocus) {
      p.editbox = voVer === "ai" && s.voAlt ? s.voAlt : s.vo;
      p.editOps = [["hot", "✦ 按这天的主题重写", "D2.vo=ai"], ["go", "✓ 用这版", "D2.mode=browse"]];
    } else if (s.vo) {
      p.vo = s.vo;
      p.edit = !s.fixed;
      if (!s.fixed) p.editSet = "D2.mode=edit&D2.seg=" + s.id;
    } else {
      p.pending = true;
      p.edit = false;
    }
    p.meta = pending ? (s.fixed ? "这段每天一样，已备好" : "") : D.slotMeta(s);
    if (mode === "edit" && isFocus && s.fixed) p.note = "这段每天固定，不用每天改；要改一次就全季生效";
    if (!s.fixed && !pending && s.vo && !on) {
      p.ops = [{ t: "✦ 换成我的说法", cls: "hot" }, { t: "从昨天抄", go: backGo }];
    }
    return C.part(p);
  }

  const head = `<div class="listhead"><b>这一集</b>${d.segCount} 个 part ·
      ${pending ? "结构已定 · 待生成" : d.durTotal + " 秒 · " + fixedN + " 段复用"}
      <span style="flex:1"></span>${pending ? `<span class="tag o">待生成</span>` : `<span class="tag g">素材已备</span>`}</div>`;

  const steps = `<div class="card plain" style="margin-bottom:12px">
      <div class="xs" style="line-height:1.75;color:var(--text-2)">
        <b style="color:var(--text)">这一集怎么出：</b>${fixedN} 段每天不动（开场立信任 / 结尾 CTA），
        ${variN} 段按今天的主题填。所以越往后拍越快。
      </div>
    </div>`;

  /* 和单条脚本一样：生成前先过「选模板与声音」，不直接进 B3 */
  const primary = pending
    ? { t: "✦ 生成这集的话术", go: "B2.4?from=D2&c=" + c.id + "&d=" + day, cls: "ai" }
    : { t: "下一步 · 选模板与声音", go: "B2.4?from=D2&c=" + c.id + "&d=" + day, cls: "ai" };

  const sub = mode === "edit"
    ? "正在改第 " + (focus.idx + 1) + " 段" + (focus.fixed ? "（每天固定，改一次全季生效）" : "")
    : "Day " + day + "/" + d.series.total + " · " + plan.topic;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="${backGo}" data-label="回到单日任务">‹</span>
      <div class="ttl">${d.series.name}<small>${sub}</small></div>
      <span class="act" data-set="D2.mode=${mode === "browse" ? "edit" : "browse"}">${mode === "browse" ? "编辑" : "完成"}</span>
    </div>

    <div class="body">
      <div class="card" style="background:var(--g-deep);color:#fff;box-shadow:0 12px 26px rgba(20,40,110,.24)"
           data-go="${backGo}" data-label="看这天的要点">
        <div class="row" style="opacity:.82">
          <span style="font-size:11.5px">Day ${day} / ${d.series.total}</span>
          <span style="margin-left:auto;font-size:11px">${c.owner}</span>
        </div>
        <div style="font-size:19px;font-weight:700;margin-top:8px;letter-spacing:-.3px">${plan.topic}</div>
        <div class="dbar" style="margin-top:11px">
          ${Array.from({ length: d.series.total }, (_, i) => {
            const n = i + 1;
            return `<i class="${n < day ? "done" : n === day ? "now" : ""}" style="background:${n < day ? "rgba(255,255,255,.5)" : n === day ? "#fff" : "rgba(255,255,255,.18)"}"></i>`;
          }).join("")}
        </div>
        <div style="font-size:11px;opacity:.72;margin-top:10px">看这天的要点与素材 ›</div>
      </div>

      ${mode === "browse" ? steps : ""}
      ${head}

      ${d.segments.map(partHtml).join("")}

      ${mode === "browse" ? `<div class="card plain" style="margin-top:2px">
        <div class="xs" style="line-height:1.75">
          <b style="color:var(--text)">昨天那集（Day ${y.day || day - 1} · ${y.topic || "—"}）</b><br>
          中间两段可以直接抄过来改两个字，观众不会觉得重复——他们看的是一致性，不是新鲜感。
        </div>
      </div>` : ""}
    </div>

    <div class="actionbar">
      <div class="btn ${primary.cls}" data-go="${primary.go}" data-label="${primary.t}">${primary.t}</div>
    </div>
  </div>`;
};
