/* 生成图：原型里所有"色块占位"都换成真实图片。
   assets/gen/*.jpg 由 AI 生成（去掉水印、压到 720 宽）。 */
window.IMG = {
  product: "assets/gen/p-product.jpg",
  still: "assets/gen/p-still.jpg",
  unbox: "assets/gen/p-unbox.jpg",
  chat: "assets/gen/p-chat.jpg",
  warehouse: "assets/gen/p-warehouse.jpg",
  ocean: "assets/gen/p-ocean.jpg",
  person: "assets/gen/p-person.jpg",
  brand: "assets/gen/p-brand.jpg",
  shot: "assets/gen/t-shot.jpg",
  text: "assets/gen/t-text.jpg",
  compare: "assets/gen/t-compare.jpg"
};

/* 按素材名挑图：先认场景词，认不出再按内容类型兜底 */
window.imgByName = function (name, kind) {
  const n = name || "";
  if (/素颜|出镜|口播|真人|姐妹|阿姨|顾客|人像/.test(n)) return window.IMG.person;
  if (/开箱/.test(n)) return window.IMG.unbox;
  if (/仓库|发货|物流|快递/.test(n)) return window.IMG.warehouse;
  if (/海|空镜|自然|浪/.test(n)) return window.IMG.ocean;
  if (/聊天|反馈|截图|成交|评价|私信/.test(n)) return window.IMG.chat;
  if (/成分|血管|说明|品牌|官片|对比/.test(n)) return window.IMG.brand;
  if (/摆台|产品|团价|瓶|特写/.test(n)) return window.IMG.still;
  return kind === "work" ? window.IMG.shot : window.IMG.product;
};

/* 同类别里换着用，避免一屏看到好几张一样的 */
window.imgVariant = function (name, kind, i) {
  const base = window.imgByName(name, kind);
  const key = Object.keys(window.IMG).filter((k) => window.IMG[k] === base)[0] || "product";
  const V = {
    person: ["person", "text"], still: ["still", "product", "shot"], product: ["product", "still", "unbox"],
    unbox: ["unbox", "warehouse"], chat: ["chat", "person"], warehouse: ["warehouse", "unbox"],
    ocean: ["ocean", "still"], brand: ["brand", "shot"], shot: ["shot", "product"],
    text: ["text", "person"], compare: ["compare", "still"]
  };
  const arr = V[key] || ["product"];
  return window.IMG[arr[(i || 0) % arr.length]];
};
window.imgByTags = function (tags) {
  const t = tags || [];
  if (t.indexOf("unbox") >= 0) return window.IMG.unbox;
  if (t.indexOf("proof") >= 0) return window.IMG.chat;
  if (t.indexOf("broll") >= 0) return window.IMG.warehouse;
  if (t.indexOf("nature") >= 0) return window.IMG.ocean;
  if (t.indexOf("person") >= 0 || t.indexOf("pip") >= 0) return window.IMG.person;
  if (t.indexOf("textcard") >= 0) return window.IMG.text;
  if (t.indexOf("ingredient") >= 0 || t.indexOf("explain") >= 0) return window.IMG.brand;
  if (t.indexOf("brand") >= 0) return window.IMG.brand;
  if (t.indexOf("still") >= 0 || t.indexOf("price") >= 0 || t.indexOf("cta") >= 0) return window.IMG.still;
  return window.IMG.product;
};
