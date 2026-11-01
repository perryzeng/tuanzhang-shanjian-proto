window.PAGES["C2"].render = function () {
  const C = window.C;

  return `<div class="app">
    ${C.sb()}
    <div class="ab">
      <span class="back" data-go="C1" data-label="返回导入">‹</span>
      <div class="ttl">拆解编辑<small>阿玲的磷虾油视频 · 6 段 52 秒</small></div>
      <span class="act" data-go="C3" data-label="下一步">下一步</span>
    </div>

    ${C.estage({
      preview: { bg: "linear-gradient(135deg,#7C5CFF,#B08CFF)", no: "03/06", cap: "我用了三个月" },
      code: "00:18 / 00:52",
      track: [[9, "done"], [8, "done"], [9, "cur"], [8, ""], [10, ""], [8, ""]],
      now: `<b>第 3 段 · 使用感受</b><br>建议换：这段是原作者的出镜表述`
    })}

    <div class="listhead" style="flex-direction:column;align-items:flex-start;gap:3px;padding-top:6px">
      <div><b>分段</b> 6 段 · 52 秒 · <span style="color:var(--success);font-weight:700">已换 2 段</span></div>
      <div class="xs" style="padding-left:0">✦ AI 标出 2 段建议换：出镜段 + 结尾 CTA</div>
    </div>

    <div class="body" style="padding-top:4px">
      ${C.fold({ no: "01", text: "开场提问 · 不用改 · 原始画面", cover: "linear-gradient(135deg,#2C5BFF,#5B8CFF)" })}

      <div class="seg on">
        <div class="seg-h"><span class="seg-no">03</span><span class="seg-name">使用感受</span>
          <span class="tag o">建议换</span><span class="seg-dur">9s</span></div>
        <div style="background:#F5F7FC;border-radius:12px;padding:9px 11px;margin-bottom:9px">
          <div style="font-size:9.5px;font-weight:700;color:var(--text-4);margin-bottom:3px">原文案</div>
          <div style="font-size:12px;color:var(--text-3);line-height:1.55">这个我吃了三个月，真的绝了，睡眠好了很多……</div>
        </div>
        <div class="editbox" style="min-height:56px">我自己吃了两个月，最明显的是早上起来不那么累。</div>
        <div class="clips">
          <div class="clip" style="background:linear-gradient(135deg,#7C5CFF,#B08CFF)">照片</div>
          <div class="addclip" data-go="B2.1" data-label="换素材">＋</div>
        </div>
        <div class="ops">
          <span class="op hot">✦ 按我的语气重写</span>
          <span class="op">换说法</span>
          <span class="op go">完成</span>
        </div>
      </div>

      <div class="fold" data-go="B2.1" data-label="补第 6 段花字卡">
        <span class="seg-no">06</span>
        <span class="tag r">务必改</span>
        <span class="fx">结尾 CTA · 缺花字卡 · 点这里补素材</span>
      </div>
    </div>

    <div class="actionbar">
      <div class="eto" style="width:64px"><span style="font-size:13px">◎</span><b>对照</b></div>
      <div class="btn" data-go="C3" data-label="检查二创安全度">下一步 · 查安全度</div>
    </div>
  </div>`;
};
