/* A8.3.2 小组管理（V22）
   从小组页右上角「管理」进来。**只有管理员能进** ——
   组员那边这个入口压根不渲染，不是灰掉，是根本不存在。
   （一个组只有一个组长，灰色按钮反而会让人觉得"申请一下就能用"。）

   这一页只管四件事：
   ① 口径 —— 全组这周按什么说。改一次，所有人跟着变
   ② 发布 —— 公告和任务，都是"往下发"的动作
   ③ 组员 —— 谁在、谁安静了、谁该提一下
   ④ 提醒 —— 不点名地指出问题，比逐个踢人有用 */

window.PAGES["A8.3.2"].prd = "PRD V22 §4.2 · 小组管理（仅管理员）";
window.PAGES["A8.3.2"].sysEntry = "小组页右上角「管理」，仅管理员可见";

window.PAGES["A8.3.2"].render = function () {
  const C = window.C, T = window.LIB.team;

  /* 不是管理员就到此为止。真实产品这里应该是 403，原型里说清楚就行。 */
  if (!T.isAdmin) {
    return `<div class="app">
      ${C.sb()}
      ${C.ab({ title: "小组管理", back: "A8.3" })}
      <div class="body">
        <div class="v31-lock">
          <div class="v31-lock-ic">锁</div>
          <b>这一页只有管理员能进</b>
          <p>你要是需要改口径或发任务，找组长说一声。</p>
        </div>
      </div>
    </div>`;
  }

  const quiet = T.crew.filter((m) => m.posts <= 1);
  const idle = T.crew.filter((m) => m.posts === 1);

  return `<div class="app">
    ${C.sb()}
    ${C.ab({ title: "小组管理", sub: "只有管理员能进", back: "A8.3", act: "保存" })}

    <div class="body">
      <div class="v32-admin">
        <b>${T.name}</b>
        <span>${T.members} 人 · 你是组长</span>
      </div>

      <div class="v32-sect">本周口径<em>改一次，全组跟着变</em></div>
      <div class="v32-caliber">
        <b>${T.direction.title}</b>
        <p>${T.direction.note}</p>
        <span class="v32-caliber-go">改口径 ›</span>
      </div>

      <div class="v32-sect">发布</div>
      <div class="v32-pub">
        <div class="v32-pub-i"><i>告</i><b>发一条公告</b><em>›</em></div>
        <div class="v32-pub-i"><i>任</i><b>发一个任务</b><em>›</em></div>
      </div>

      <div class="v32-sect">组员 ${T.crew.length}<em>按本片数排</em></div>
      <div class="v32-mem">
        ${T.crew.slice().sort((a, b) => b.posts - a.posts).map((m) => `<div class="v32-mem-i">
          <i class="av" style="background:${m.bg}">${m.av}</i>
          <div class="tx">
            <b>${m.n}${m.me ? `<em>你</em>` : ""}</b>
            <span>${m.posts} 条片 · ${m.leads} 个意向</span>
          </div>
          <span class="tag2${m.posts <= 1 ? " warn" : ""}">${m.posts <= 1 ? "安静" : "正常"}</span>
        </div>`).join("")}
      </div>
      <div class="v32-invite">＋ 邀请新成员</div>

      <div class="v32-sect">该提一句</div>
      <div class="v32-warn">
        <div><b>${idle.length} 人这周只发了 1 条</b><span>${idle.map((m) => m.n).join("、")}</span></div>
        <div><b>${quiet.length} 人几乎没有动静</b><span>别在大群里点名。私聊一句比公告有用</span></div>
      </div>

      <div class="xs" style="margin:12px 2px 4px;line-height:1.7">
        管理页只做"往下发"的事：定口径、发任务、看谁安静了。<br>
        组员的客户和私聊，管理员也看不到 —— 那是他们自己的生意。
      </div>
    </div>
  </div>`;
};
