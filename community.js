(() => {
  "use strict";
  const D = window.GBU_CONTENT,
    store = window.CommunityStore,
    $ = (s) => document.querySelector(s);
  const esc = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const uid = () => crypto.randomUUID();
  const S = D.navigation
    .filter((item) => item.id !== "home")
    .map((item) => [item.id, item.label, item.description, item.icon, item.group]);
  const label = (id) =>
    S.find((s) => s[0] === id)?.[1] ||
    { home: "社区广场", search: "搜索", me: "我的空间", saved: "我的收藏" }[
      id
    ] ||
    "内容";
  const extraEssay = [
    "\n\n高中时，关系往往自然发生：每天坐在同一个教室，走同一条放学路。到了大学，认识一个人和持续见到一个人，变成了两件事。\n\n可以先给自己留一个小小的固定安排。每周同一个时间去运动，和某位同学课后聊一道题，或找一个人一起吃周五的晚饭。具体、轻量、可以重复的相遇，会让下一次开口更容易。\n\n不必把每一次邀请都当成一场社交考试。有人愿意来，有人这周不方便，都是正常的反馈。给自己一点主动，也给彼此一点空间。",
    "\n\n我能用自己的话讲出这个概念吗？我知道它在什么条件下成立吗？换一个例子，我还能用它解释吗？\n\n整理笔记时，可以把这三个问题放在每一页的旁边。回答不出来的地方，往往比已经划过线的地方更值得花时间。\n\n找同学互相讲解也有帮助。讲到一半卡住并不丢人，它让“我好像懂了”变成一个具体、可以解决的问题。",
    "\n\n“以后有空一起吃饭”是一句友善的话，“周四下课一起去吃午饭吗”则给了对方一个容易回答的邀请。\n\n刚认识时，不一定要聊很多私人经历。分享今天遇到的一件小事，交换一个有趣的网站，或者安静地走一段路，都可以是关系的开始。\n\n邀请可以被拒绝，相处也可以慢慢来。我们需要的，或许只是更多自然遇见彼此的机会。",
  ];
  const examples = [
    ...D.posts.map((p) => ({
      ...p,
      id: "post-" + p.id,
      section: "exchange",
      tags: [p.topic],
      sample: true,
    })),
    ...D.essays.map((p, i) => ({
      ...p,
      id: p.id,
      section: "opinions",
      body: p.excerpt + extraEssay[i],
      tags: [p.topic],
      sample: true,
    })),
    ...D.buddies.map((p, i) => ({
      ...p,
      id: "buddy-" + i,
      section: "partners",
      body: p.detail,
      author: "示例邀请",
      tags: [p.type, p.format, ...p.tags],
      sample: true,
    })),
    ...D.courses.map((p, i) => ({
      ...p,
      id: "course-" + i,
      section: "courses",
      tags: [p.name, ...p.tags],
      sample: true,
    })),
    ...D.guides.map((p, i) => ({
      ...p,
      id: "guide-" + i,
      section: "guide",
      body: p.text,
      author: "共建编辑示例",
      tags: [p.type],
      sample: true,
    })),
    ...D.roommateProfiles.map((p) => ({
      ...p,
      id: p.id,
      section: "roommates",
      title: p.nickname + "的室友自我介绍",
      body: p.intro,
      author: p.nickname,
      tags: p.habits,
      sample: true,
    })),
    ...D.boardThreads.map((p, i) => ({
      ...p,
      id: "thread-" + i,
      section: "boards",
      boardId: D.boards.find((b) => b.name === p.board)?.id,
      body: [
        "我想先了解课程目标和考核方式，再听听修过的同学怎么安排时间。你会优先看哪些信息？",
        "希望从一小时安静自习开始，最后留十分钟交流卡住的问题。你通常什么时间方便？",
        "最近尝试把定义、例题和错题分开记录。想听听大家怎么把它们连起来。",
        "想找同学一起散步或看展，时间和预算都可以商量。也欢迎分享有意思的地方。",
      ][i],
      tags: [p.board],
      sample: true,
    })),
  ];
  const posts = () => [...store.get().posts, ...examples];
  const boards = () => [...D.boards, ...store.get().boards];
  let filter = "全部",
    sort = "推荐",
    query = "",
    section = "home",
    path = [],
    toastTimer;
  const tags = (a) =>
    (a || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  const link = (route, text, cls = "") =>
    `<a class="${cls}" href="#${esc(route)}">${text}</a>`;
  const empty = (title, body, button = "") =>
    `<div class="empty"><span>↗</span><h3>${title}</h3><p>${body}</p>${button}</div>`;
  const button = (action, text, cls = "", attrs = "") =>
    `<button type="button" class="${cls}" data-action="${action}" ${attrs}>${text}</button>`;
  function notify(text) {
    if (!store.available && /已.*(保存|发布|更新)/.test(text))
      text = "浏览器存储不可用：修改仅保留在当前页面，刷新后可能丢失。";
    $("#toast").textContent = text;
    $("#toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("#toast").hidden = true), 4000);
  }
  function commit(fn) {
    const ok = store.update(fn);
    if (!ok) notify("浏览器存储不可用，本次修改仅在当前页面保留。");
    return ok;
  }
  function toggle(key, id) {
    commit((s) => {
      s[key] = s[key].includes(id)
        ? s[key].filter((x) => x !== id)
        : [...s[key], id];
    });
  }
  const stamp = (p) =>
    p.sample
      ? "示例内容"
      : new Date(p.createdAt).toLocaleDateString("zh-CN", {
          month: "short",
          day: "numeric",
        });
  function shell() {
    document.body.innerHTML = `<a class="skip" href="#main">跳到内容</a><aside class="sidebar"><a href="#home" class="brand"><span class="brand-mark">同</span><span>GBU 同行<small>几百个人，也是一整个世界</small></span></a><nav aria-label="社区导航">${link("home", "<span>◉</span> 社区广场", "nav-item")}${D.navigationGroups
      .map(
        ({ id, label: groupLabel }) =>
          `<p class="nav-label">${esc(groupLabel)}</p>${S.filter((s) => s[4] === id)
            .map((s) => link(s[0], `<span>${s[3]}</span>${s[1]}`, "nav-item"))
            .join("")}`,
      )
      .join("")}</nav><div class="sidebar-bottom">${link("saved", "<span>♧</span> 我的收藏", "nav-item")}${link("me", "<span>◌</span> 我的空间", "nav-item")}<div class="local-note"><i></i> 本机体验版<small>邀请制社区 · 独立于学校系统</small></div></div></aside><div class="workspace"><header class="topbar"><button class="mobile-menu" data-action="menu" aria-label="展开导航" aria-expanded="false">☰</button><span id="crumb">社区广场</span><form id="search-form" role="search"><label class="sr-only" for="global-search">搜索社区内容、课程、老师</label><span>⌕</span><input id="global-search" type="search" placeholder="搜内容、课程、老师…" maxlength="100"><kbd>/</kbd></form>${button("join", "邀请码加入", "quiet")}${button("compose", "＋ 发布", "primary")}</header><div class="preview-strip">正在浏览功能体验版 <span>标注「示例」的内容为演示；你的操作只保存在此浏览器。</span></div><main id="main" tabindex="-1"></main><footer>GBU 同行 · 学生自发的社区构想 <span>让经验留下，让相遇发生。</span></footer></div><dialog id="modal" aria-labelledby="modal-title"></dialog><div id="toast" role="status" hidden></div>`;
  }
  function card(p, compact = false) {
    const st = store.get();
    return `<article class="feed-card ${compact ? "compact" : ""}"><div class="card-meta"><span class="avatar ${p.section}">${esc((p.author || "同")[0])}</span><span>${esc(p.author || "同行者")}<small>${label(p.section)} · ${stamp(p)}</small></span>${p.sample ? '<span class="sample">示例</span>' : '<span class="sample local">本机发布</span>'}${p.section === "partners" ? `<span class="availability">${p.closed ? "已结束" : "可表达兴趣"}</span>` : ""}</div><h3>${link("read/" + p.id, esc(p.title))}</h3><p class="excerpt">${esc(p.body || "")}</p><div class="tags">${tags(p.tags)}</div><div class="card-actions">${button("like", `${st.liked.includes(p.id) ? "♥" : "♡"} 有共鸣${st.liked.includes(p.id) ? " · 1" : ""}`, st.liked.includes(p.id) ? "selected" : "", `data-id="${esc(p.id)}" aria-pressed="${st.liked.includes(p.id)}"`)}${link("read/" + p.id, `↳ 讨论${(st.replies[p.id] || []).length ? " · " + st.replies[p.id].length : ""}`)}${button("save", st.saved.includes(p.id) ? "已收藏" : "＋ 收藏", st.saved.includes(p.id) ? "selected" : "", `data-id="${esc(p.id)}" aria-pressed="${st.saved.includes(p.id)}"`)}${p.section === "partners" ? link("read/" + p.id, "看看计划 ↗", "push") : ""}</div></article>`;
  }
  function title(eyebrow, name, desc, action = "") {
    return `<div class="page-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${name}</h1><p>${desc}</p></div>${action}</div>`;
  }
  function chips(items, attr = "filter") {
    return `<div class="chips" aria-label="内容筛选">${items.map((x) => button(attr, esc(x), filter === x ? "active" : "", `data-value="${esc(x)}" aria-pressed="${filter === x}"`)).join("")}</div>`;
  }
  function filtered(items) {
    let list = items.filter(
      (p) =>
        filter === "全部" ||
        p.tags?.includes(filter) ||
        label(p.section) === filter,
    );
    if (sort === "最新")
      list = [...list].sort((a, b) =>
        (b.createdAt || "").localeCompare(a.createdAt || ""),
      );
    if (sort === "讨论最多")
      list = [...list].sort(
        (a, b) =>
          (store.get().replies[b.id] || []).length -
          (store.get().replies[a.id] || []).length,
      );
    return list;
  }
  function sortControl() {
    return `<label class="sort-label">排序 <select id="sort"><option ${sort === "推荐" ? "selected" : ""}>推荐</option><option ${sort === "最新" ? "selected" : ""}>最新</option><option ${sort === "讨论最多" ? "selected" : ""}>讨论最多</option></select></label>`;
  }
  function rail() {
    return `<aside class="right-rail"><section class="panel invite-panel"><div class="rail-kicker">从认识，到熟悉</div><h2>把「改天吧」<br>变成一个小计划。</h2><p>一起吃顿饭、走一段路，<br>不必等到准备好所有话题。</p>${link("partners", "找个搭子 ↗", "primary")}</section><section class="panel"><div class="panel-title"><h2>正在找同行的人</h2>${link("partners", "全部 ↗")}</div>${posts()
      .filter((p) => p.section === "partners" && !p.closed)
      .slice(0, 3)
      .map((p) =>
        link(
          "read/" + p.id,
          `<span class="mini-icon">↗</span><span><b>${esc(p.course || p.title)}</b><small>${esc(p.rhythm || "时间可商量")}</small></span>`,
          "mini-row",
        ),
      )
      .join(
        "",
      )}</section><section class="panel"><div class="panel-title"><h2>新生的小抄</h2>${link("guide", "更多 ↗")}</div>${D.guides
      .slice(0, 3)
      .map((g, i) =>
        link(
          "read/guide-" + i,
          `<span class="number">0${i + 1}</span><b>${esc(g.title)}</b>`,
          "mini-row",
        ),
      )
      .join(
        "",
      )}</section><section class="panel community-note"><span class="eyebrow">一起来写这所大学</span><h3>给文学社，留一张桌子。</h3><p>随笔、诗歌、校园观察，都可以有自己的栏目。共建入口已留好，等待未来的合作。</p>${link("opinions", "去百家争鸣看看 →")}</section></aside>`;
  }
  function home() {
    const list = filtered(
      posts().filter((p) =>
        ["exchange", "opinions", "courses", "partners"].includes(p.section),
      ),
    );
    const highlights = D.homeHighlights
      .map((item) => ({ ...item, icon: S.find((s) => s[0] === item.id)?.[3] || "↗" }))
      .filter((item) => S.some((s) => s[0] === item.id));
    const spaces = D.navigationGroups
      .map((group) => {
        const items = S.filter((item) => item[4] === group.id);
        if (!items.length) return "";
        return `<section class="space-group"><div class="space-group-title"><h3>${esc(group.label)}</h3><span>${esc(group.description)}</span></div><div class="space-grid">${items
          .map(([id, name, description, icon]) => link(id, `<span class="space-icon ${esc(id)}">${esc(icon)}</span><span><b>${esc(name)}</b><small>${esc(description)}</small></span><span class="space-arrow">↗</span>`, "space-card"))
          .join("")}</div></section>`;
      })
      .join("");
    return `${title("YOUR EVERYDAY CAMPUS", "今天，想在校园里遇见什么？", "不用很会社交。从一个问题、一篇笔记，或一次同行开始。")}<div class="portal-grid">${highlights
      .map(({ id, icon, title: name, summary }) =>
        link(
          id,
          `<span class="portal-icon ${esc(id)}">${esc(icon)}</span><span><b>${esc(name)}</b><small>${esc(summary)}</small></span><span>↗</span>`,
          "portal",
        ),
      )
      .join("")}</div><section class="space-directory"><div class="space-directory-heading"><div><p class="eyebrow">COMMUNITY MAP</p><h2>校园里的九个小空间</h2></div><p>想认识人、找学习方法，或分享一个想法，都能从这里开始。</p></div>${spaces}</section><div class="home-layout"><div class="feed"><div class="feed-heading"><h2>社区正在发生</h2>${sortControl()}</div>${chips(["全部", "校园交流", "找搭子", "课程经验", "百家争鸣"])}<button class="quick-compose" data-action="compose"><span class="avatar">＋</span><span>分享一个想法，或发出一个小邀请…</span><b>写点什么 ↗</b></button><div class="feed-list">${list.length ? list.map((p) => card(p)).join("") : empty("这里还很安静", "试试其他分类，或者写下第一条内容。")}</div></div>${rail()}</div>`;
  }
  function listing(id) {
    const meta = S.find((s) => s[0] === id),
      items = posts().filter((p) => p.section === id);
    const options =
      id === "partners"
        ? ["全部", "学习", "生活", "运动", "兴趣"]
        : id === "exchange"
          ? D.topics
          : id === "courses"
            ? [
                "全部",
                ...new Set(items.map((p) => p.tags?.[0]).filter(Boolean)),
              ]
            : id === "opinions"
              ? ["全部", "校园观察", "学习方法", "关系与生活", "文学创作"]
              : ["全部"];
    const list = filtered(items);
    return `${title("GBU / " + label(id), meta[1], meta[2], button("compose", id === "partners" ? "＋ 发起同行计划" : "＋ 分享内容", "primary", `data-section="${id}"`))}${id === "opinions" ? '<div class="editor-note"><span>共创预留</span><b>一个能容纳长文字的地方。</b><p>随笔、观点、诗歌与不同意见。未来可与文学社共建专题，目前尚无社团入驻。</p></div>' : ""}<div class="section-toolbar">${chips(options)}${sortControl()}</div><div class="${id === "partners" ? "two-grid" : "reading-feed"}">${list.length ? list.map((p) => card(p)).join("") : empty("还没有这类内容", "你可以先保存草稿，慢慢完善。")}</div>`;
  }
  function boardPage(id) {
    const b = boards().find((x) => x.id === id);
    if (id && !b) return missing();
    if (b) {
      const items = posts().filter((p) => p.boardId === id);
      return `${link("boards", "← 所有兴趣贴吧", "back")}${title("TOPIC BOARD", esc(b.name), esc(b.desc), button("follow", store.get().followed.includes(id) ? "已关注" : "＋ 关注这个吧", "secondary", `data-id="${esc(id)}"`))}<div class="section-toolbar"><span>${items.length} 条内容 · ${b.sample === false ? "本机创建" : "示例主题吧"}</span>${button("compose", "＋ 在本吧发帖", "primary", `data-section="boards" data-board="${esc(id)}"`)}</div><div class="reading-feed">${items.map((p) => card(p)).join("") || empty("第一条帖子，留给你", "分享问题、发现或活动计划。")}</div>`;
    }
    return `${title("SMALL CIRCLES, LONG CONVERSATIONS", "兴趣贴吧", "围绕共同喜欢的事，把一次聊天变成持续的交流。", button("create-board", "＋ 创建主题吧", "primary"))}<div class="board-grid">${boards()
      .map((b) =>
        link(
          "boards/" + b.id,
          `<span class="board-symbol">${esc(b.mark || "吧")}</span><div><h2>${esc(b.name)}</h2><p>${esc(b.desc)}</p><small>${posts().filter((p) => p.boardId === b.id).length} 条${b.sample === false ? "本机" : "示例"}内容 ${store.get().followed.includes(b.id) ? "· 已关注" : ""}</small></div><span>↗</span>`,
          "board-card",
        ),
      )
      .join("")}</div>`;
  }
  function roommates() {
    const items = posts().filter((p) => p.section === "roommates");
    return `${title("LIVING TOGETHER", "先聊清楚，怎么一起生活。", "为新生准备的自愿介绍空间；室友意向由双方商量，不关联学校宿舍分配。", button("compose", "＋ 填写相处偏好", "primary", 'data-section="roommates"'))}<div class="tip-line">从作息、灯光、公共区域和沟通方式开始。这里不填写手机号、学号或房间号。</div>${chips(["全部", "作息偏早", "作息较灵活", "夜间安静", "重视公共区域整洁"])}<div class="two-grid">${
      filtered(items)
        .map((p) => card(p))
        .join("") || empty("暂时没有符合的介绍", "换一个习惯标签看看。")
    }</div>`;
  }
  function teachers(id) {
    const teacher = D.teachers.find((t) => t.id === id);
    if (id && !teacher) return missing();
    if (teacher) {
      const exp = store.get().experiences.filter((e) => e.teacherId === id);
      return `${link("teachers", "← 返回师资导航", "back")}${title("TEACHER × COURSE", esc(teacher.name), esc(teacher.department + " · " + teacher.title), button("experience", "＋ 记录课程体验", "primary", `data-id="${esc(id)}"`))}<div class="tip-line">评价对应具体课程和学期。标签描述授课方式，不给老师做笼统排名。</div><div class="reading-feed">${exp.length ? exp.map((e) => `<article class="feed-card"><div class="card-meta"><span class="sample local">本机记录</span><span>${esc(e.term)}</span></div><h2>${esc(e.course)}</h2><div class="tags">${tags(e.tags)}</div></article>`).join("") : empty("这门课的体验，等你来补充", "目前没有真实学生评价；老师姓名来自先前导入的官网公开目录样例。")}</div>`;
    }
    const q = query.toLowerCase();
    const ts = D.teachers.filter((t) =>
      (t.name + t.department).toLowerCase().includes(q),
    );
    return `${title("FACULTY DIRECTORY", "认识老师，从一门课开始。", "以具体课程为单位记录节奏、讲授方式、课堂互动和作业反馈。")}<label class="inline-search">搜索老师或学院<input id="teacher-filter" type="search" placeholder="姓名 / 学院" value="${esc(query)}"></label><div class="three-grid" id="teacher-results">${teacherCards(ts)}</div><p class="footnote">${D.teachers.length} 位公开目录样例 · 不是完整师资库 · <a href="https://www.gbu.edu.cn/teacher.html" target="_blank" rel="noopener noreferrer">学校官网师资库 ↗</a></p>`;
  }
  function teacherCards(ts) {
    return (
      ts
        .map((t) =>
          link(
            "teachers/" + t.id,
            `<span class="eyebrow">${esc(t.department)}</span><div class="teacher-initial">${esc(t.name[0])}</div><h2>${esc(t.name)}</h2><p>${esc(t.title)}</p><div class="card-bottom">老师 × 课程 <span>↗</span></div>`,
            "teacher-card",
          ),
        )
        .join("") || empty("没有匹配的老师", "尝试其他姓名或学院。")
    );
  }
  function guide() {
    return `${title("A FIELD GUIDE, WRITTEN TOGETHER", "大学生活，没有唯一标准答案。", "把有帮助的方法留在这里，下一位新生就能少摸索一点。")}<div class="guide-grid">${D.guides.map((g, i) => link("read/guide-" + i, `<span class="chapter">0${i + 1}</span><span class="eyebrow">${esc(g.type)}</span><h2>${esc(g.title)}</h2><p>${esc(g.text)}</p><span>打开指南 →</span>`, "guide-card")).join("")}</div><div class="tip-line">指南是同学经验的整理；课程、住宿和校园安排以当年的学校通知为准。</div>`;
  }
  function life() {
    const cats = D.lifeCategories,
      rs = store
        .get()
        .reviews.filter((r) => filter === "全部" || r.category === filter);
    const groups = new Map();
    rs.forEach((r) => {
      const k = r.category + "|" + r.place.trim().toLowerCase();
      if (!groups.has(k))
        groups.set(k, {
          place: r.place,
          category: r.category,
          count: 0,
          tags: [],
        });
      const g = groups.get(k);
      g.count++;
      g.tags.push(...r.tags);
    });
    const ranked = [...groups.values()].sort((a, b) => b.count - a.count);
    return `${title("LITTLE THINGS, BETTER DAYS", "生活区 · 把好经验传下去。", "外卖、食堂、自习地点。记录一次具体体验，比一个笼统的分数更有帮助。", button("review", "＋ 分享生活体验", "primary"))}<div class="life-categories">${button("filter", "全部", "life-category " + (filter === "全部" ? "active" : ""), 'data-value="全部"')}${cats.map((c) => button("filter", `<b>${esc(c.name)}</b><small>${esc(c.desc)}</small>`, "life-category " + (filter === c.id ? "active" : ""), `data-value="${c.id}"`)).join("")}</div><div class="life-layout"><section class="panel"><div class="panel-title"><h2>本机体验榜</h2><span class="sample">按记录次数排序</span></div><p class="muted">只统计此浏览器的记录，不代表社区口碑。接入真实用户后才能形成社区榜单。</p>${ranked.length ? ranked.map((r, i) => `<div class="ranking"><span class="rank">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(r.place)}</h3><div class="tags">${tags([...new Set(r.tags)])}</div></div><small>${r.count} 次记录</small></div>`).join("") : empty("榜单从第一次体验开始", "没有虚构商家或评分。你可以添加一条本机记录，体验分类与排序。")}</section><section class="panel"><h2>最近体验</h2>${rs.length ? rs.map((r) => `<article class="review"><span class="sample local">本机记录</span><h3>${esc(r.place)}</h3><div class="tags">${tags(r.tags)}</div><p>${esc(r.note || "")}</p><small>${new Date(r.createdAt).toLocaleDateString("zh-CN")}</small></article>`).join("") : '<p class="muted">还没有体验。第一次分享，可以从分量、包装和等餐时间说起。</p>'}</section></div>`;
  }
  function read(id) {
    const p = posts().find((x) => x.id === id);
    if (!p) return missing();
    const st = store.get(),
      replies = st.replies[id] || [];
    return `<div class="article-wrap">${link(p.boardId ? "boards/" + p.boardId : p.section, "← 返回" + label(p.section), "back")}<article class="article"><div class="article-kicker">${label(p.section)} <span class="sample">${stamp(p)}</span></div><h1>${esc(p.title)}</h1><div class="article-author"><span class="avatar">${esc((p.author || "同")[0])}</span>${esc(p.author || "同行者")}<span>${p.anonymous ? "匿名表达" : "网名表达"}</span></div><div class="tags">${tags(p.tags)}</div><div class="prose">${esc(
      p.body,
    )
      .split("\n")
      .filter(Boolean)
      .map((x) => `<p>${x}</p>`)
      .join(
        "",
      )}</div>${p.rhythm ? `<div class="plan-box"><span>时间与节奏</span><strong>${esc(p.rhythm)}</strong><span>同行形式</span><strong>${esc(p.format || "两人同行")}</strong></div>` : ""}${["partners", "roommates"].includes(p.section) ? `<div class="interest-box"><div><b>${p.closed ? "这个计划已经结束" : p.section === "roommates" ? "愿意进一步聊聊相处习惯？" : "这个计划，你也想参加？"}</b><p>意向只记在你的本机空间，暂不向对方发送消息。</p></div>${p.closed ? "" : button("interest", st.interests.includes(id) ? "已记下意向 ✓" : "记下我的意向 ↗", "primary", `data-id="${esc(id)}"`)}</div>` : ""}<div class="article-tools">${button("save", st.saved.includes(id) ? "已收藏 ✓" : "＋ 收藏到我的空间", "secondary", `data-id="${esc(id)}"`)}${button("like", st.liked.includes(id) ? "♥ 有共鸣" : "♡ 有共鸣", "quiet", `data-id="${esc(id)}"`)}${!p.sample && p.section === "partners" ? button("close-plan", p.closed ? "重新开放计划" : "结束这个计划", "quiet", `data-id="${esc(id)}"`) : ""}${!p.sample ? button("edit", "编辑内容", "quiet", `data-id="${esc(id)}"`) : ""}${!p.sample ? button("delete-post", "删除我的内容", "quiet danger", `data-id="${esc(id)}"`) : ""}</div></article><section class="discussion"><div class="panel-title"><h2>接着聊聊 <span>${replies.length}</span></h2><small>本机讨论演示</small></div>${replies.length ? replies.map((r, i) => `<article class="reply"><span class="avatar">${esc(r.author[0])}</span><div><b>${esc(r.author)}</b><small>${i + 1} 楼 · 本机回复</small><p>${esc(r.body)}</p></div></article>`).join("") : '<p class="muted">还没有回复。一个具体的经验，也许就能接住这个话题。</p>'}<form id="reply-form" data-id="${esc(id)}"><label for="reply-body">补充你的经验或想法</label><textarea id="reply-body" name="body" rows="3" maxlength="2000" required placeholder="友好表达，允许不同的经历和看法。"></textarea><div class="form-footer"><label class="checkbox"><input name="anonymous" type="checkbox">匿名回复</label><button class="primary" type="submit">保存本机回复 →</button></div></form></section></div>`;
  }
  function search() {
    const q = query.trim().toLowerCase(),
      items = q
        ? posts().filter((p) =>
            [p.title, p.body, p.author, ...(p.tags || [])]
              .join(" ")
              .toLowerCase()
              .includes(q),
          )
        : [];
    const ts = q
      ? D.teachers.filter((t) =>
          (t.name + t.department).toLowerCase().includes(q),
        )
      : [];
    return `${title("FIND SOMETHING USEFUL", "搜索社区", q ? "与「" + esc(query) + "」有关的内容" : "输入一个问题、课程名称或关键词。")}<p class="muted">${items.length} 条内容 · ${ts.length} 位老师</p>${ts.length ? `<div class="three-grid">${teacherCards(ts)}</div>` : ""}<div class="reading-feed">${items.map((p) => card(p)).join("") || (!ts.length ? empty("暂时没找到", "试试“笔记”“约饭”“自由”，或者换一个更短的关键词。") : "")}</div>`;
  }
  function personal(savedOnly = false) {
    const st = store.get(),
      items = posts().filter((p) =>
        savedOnly ? st.saved.includes(p.id) : !p.sample,
      );
    return `${title("YOUR LITTLE CORNER", savedOnly ? "把有用的，留在手边。" : esc(st.profile.name) + "的小空间", savedOnly ? "收藏在本浏览器保存，下次回来还能找到。" : "这里汇集你的发布、同行意向和关注。当前是本机体验身份。", savedOnly ? "" : button("profile", "编辑网名", "secondary"))}${
      savedOnly
        ? ""
        : `<div class="profile-stats"><div><b>${items.length}</b><span>我的发布</span></div><div><b>${st.saved.length}</b><span>我的收藏</span></div><div><b>${st.interests.length}</b><span>同行意向</span></div><div><b>${st.followed.length}</b><span>关注的吧</span></div></div><div class="personal-tools">${link("saved", "打开我的收藏 →", "secondary")}${st.draft ? button("draft", "继续上次的草稿", "secondary") : ""}${button("export", "导出本机数据", "quiet")}</div>${
            st.interests.length
              ? `<section class="panel"><h2>记下的同行意向</h2>${posts()
                  .filter((p) => st.interests.includes(p.id))
                  .map((p) =>
                    link(
                      "read/" + p.id,
                      `${esc(p.title)} <span>↗</span>`,
                      "saved-row",
                    ),
                  )
                  .join("")}</section>`
              : ""
          }${
            st.followed.length
              ? `<section class="panel"><h2>关注的主题吧</h2>${boards()
                  .filter((b) => st.followed.includes(b.id))
                  .map((b) =>
                    link("boards/" + b.id, esc(b.name) + " ↗", "saved-row"),
                  )
                  .join("")}</section>`
              : ""
          }<h2 class="section-title">我的发布</h2>`
    }<div class="reading-feed">${items.map((p) => card(p)).join("") || empty(savedOnly ? "还没有收藏" : "从第一条分享开始", savedOnly ? "看到想留住的内容，点一下“收藏”。" : "一个想法、一份经验，或者一场两个人的小计划。", savedOnly ? link("home", "回广场看看 →", "primary") : button("compose", "＋ 写点什么", "primary"))}</div>`;
  }
  function missing() {
    return empty(
      "这条内容暂时找不到",
      "可能已经删除，或来自另一个浏览器的本机记录。",
      link("home", "回到社区广场", "primary"),
    );
  }
  function render() {
    let raw;
    try {
      raw = decodeURIComponent(location.hash.slice(1) || "home");
    } catch {
      raw = "home";
    }
    path = raw.split("/");
    if (path.length === 3) {
      const [legacy, kind, key] = path;
      let mapped;
      if (kind === "teacher") mapped = "teachers/" + key;
      else if (kind === "board") mapped = "boards/" + key;
      else if (kind === "post") mapped = "read/post-" + key;
      else if (kind === "essay") mapped = "read/" + key;
      else if (["buddy", "course", "guide"].includes(kind))
        mapped = "read/" + kind + "-" + key;
      else if (kind === "roommate") mapped = "read/" + key;
      else if (kind === "life") mapped = "life";
      else if (kind === "thread") {
        const [bid, i] = key.split(":");
        const board = D.boards.find((b) => b.id === bid);
        const thread = examples.filter(
          (p) => p.section === "boards" && p.boardId === board?.id,
        )[Number(i)];
        if (thread) mapped = "read/" + thread.id;
      }
      if (mapped) {
        history.replaceState(null, "", "#" + mapped);
        path = mapped.split("/");
      }
    }
    section = path[0];
    if (section === "search") query = path.slice(1).join("/");
    $("#crumb").textContent = section === "read" ? "内容详情" : label(section);
    $("#global-search").value = query;
    document.querySelectorAll(".nav-item").forEach((a) => {
      const active = a.hash === "#" + section;
      a.classList.toggle("active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    $("#main").dataset.section = section;
    $("#main").innerHTML =
      section === "home"
        ? home()
        : section === "read"
          ? read(path[1])
          : section === "boards"
            ? boardPage(path[1])
            : section === "roommates"
              ? roommates()
              : section === "teachers"
                ? teachers(path[1])
                : section === "guide"
                  ? guide()
                  : section === "life"
                    ? life()
                    : section === "search"
                      ? search()
                      : section === "saved"
                        ? personal(true)
                        : section === "me"
                          ? personal()
                          : S.some((s) => s[0] === section)
                            ? listing(section)
                            : missing();
    document.title =
      (section === "read"
        ? posts().find((p) => p.id === path[1])?.title || "内容"
        : label(section)) + " · GBU 同行";
  }
  function modal(name, body, kind) {
    $("#modal").innerHTML =
      `<div class="modal-heading"><div><span class="eyebrow">GBU 同行</span><h2 id="modal-title">${name}</h2></div>${button("dismiss", "×", "close", 'aria-label="关闭弹窗"')}</div><form id="modal-form" data-kind="${kind}">${body}</form>`;
    $("#modal").showModal();
  }
  const field = (
    name,
    label,
    type = "text",
    value = "",
    placeholder = "",
    required = true,
  ) =>
    `<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" maxlength="${name === "title" ? 100 : 80}" ${required ? "required" : ""}></label>`;
  const checks = (name, options, values = []) =>
    `<div class="check-tags">${options.map((t) => `<label><input type="checkbox" name="${name}" value="${esc(t)}" ${values.includes(t) ? "checked" : ""}><span>${esc(t)}</span></label>`).join("")}</div>`;
  const foot = (text = "保存到本机") =>
    `<p class="form-note">仅保存到此浏览器，不会公开发送。正式社区将使用邀请码注册。</p><div id="form-error" role="alert"></div><div class="form-footer"><span id="draft-status"></span><button class="primary" type="submit">${text} →</button></div>`;
  function compose(target = "exchange", boardId = "", draft = null) {
    const p = draft || {};
    const opts = S.filter((s) => !["life", "teachers", "guide"].includes(s[0]));
    modal(
      "写点什么，让连接发生",
      `<input type="hidden" name="editingId" value="${esc(p.editingId || p.id || "")}"><div class="form-two"><label class="field">发布到<select name="section" id="compose-section">${opts.map((s) => `<option value="${s[0]}" ${s[0] === (p.section || target) ? "selected" : ""}>${s[1]}</option>`).join("")}</select></label><label class="field">表达身份<select name="identity"><option value="nickname" ${!p.anonymous ? "selected" : ""}>使用网名</option><option value="anonymous" ${p.anonymous ? "selected" : ""}>匿名表达</option></select></label></div><div id="compose-extra"></div>${field("title", "标题", "text", p.title || "", "一个具体的问题或邀请")}<label class="field">正文<textarea name="body" rows="7" maxlength="16000" required placeholder="说说背景、你的想法，或希望一起做的事。">${esc(p.body || "")}</textarea></label>${foot("发布到本机预览")}`,
      "post",
    );
    fillExtra(p.section || target, { ...p, boardId: p.boardId || boardId });
    $("#modal-form").addEventListener("input", saveDraft);
    $("#compose-section").addEventListener("change", (e) => {
      fillExtra(e.target.value, {});
      saveDraft();
    });
  }
  function fillExtra(id, p) {
    $("#compose-extra").innerHTML =
      id === "partners"
        ? `<div class="form-two"><label class="field">搭子类型<select name="type">${["学习", "生活", "运动", "兴趣"].map((x) => `<option ${p.type === x ? "selected" : ""}>${x}</option>`).join("")}</select></label><label class="field">同行形式<select name="format">${["两人同行", "小组活动"].map((x) => `<option ${p.format === x ? "selected" : ""}>${x}</option>`).join("")}</select></label></div>${field("rhythm", "时间与节奏", "text", p.rhythm || "", "如：周三晚，一小时；具体时间商量")}`
        : id === "roommates"
          ? `<label class="field">相处习惯（至少一项）</label>${checks("habit", ["作息偏早", "作息较灵活", "夜间安静", "重视公共区域整洁", "习惯提前沟通", "愿意协商公共规则"], p.tags || [])}`
          : id === "boards"
            ? `<label class="field">主题吧<select name="boardId">${boards()
                .map(
                  (b) =>
                    `<option value="${b.id}" ${p.boardId === b.id ? "selected" : ""}>${esc(b.name)}</option>`,
                )
                .join("")}</select></label>`
            : id === "courses"
              ? field(
                  "course",
                  "课程名称",
                  "text",
                  p.course || "",
                  "按具体课程分享方法",
                )
              : `<label class="field">话题<select name="topic">${(id === "opinions" ? ["校园观察", "学习方法", "关系与生活", "文学创作"] : D.topics.filter((x) => x !== "全部")).map((t) => `<option ${p.topic === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>`;
  }
  function draftData() {
    const f = new FormData($("#modal-form"));
    return {
      editingId: f.get("editingId"),
      section: f.get("section"),
      title: f.get("title"),
      body: f.get("body"),
      anonymous: f.get("identity") === "anonymous",
      type: f.get("type"),
      format: f.get("format"),
      rhythm: f.get("rhythm"),
      boardId: f.get("boardId"),
      course: f.get("course"),
      topic: f.get("topic"),
      tags: f.getAll("habit"),
    };
  }
  function saveDraft() {
    const ok = commit((s) => (s.draft = draftData()));
    $("#draft-status").textContent = ok
      ? "草稿已存到本机"
      : "草稿仅在当前页面保留";
  }
  function join() {
    modal(
      "用邀请，慢慢认识彼此",
      `<div class="join-steps"><span>01<b>获得同学邀请</b><small>小范围开放，逐步建立社区。</small></span><span>02<b>独立账号与网名</b><small>未来使用邮箱注册，无需学校统一认证。</small></span><span>03<b>选择如何表达</b><small>可用网名，也可在支持的板块匿名发言。</small></span></div><div class="tip-line">邀请码验证与邮件服务尚未上线。目前可以体验本机发帖、收藏、回复与草稿，不会创建真实账号。</div>${button("dismiss", "先逛逛社区", "primary wide")}`,
      "join",
    );
  }
  function experience(id) {
    modal(
      "记录具体课程的授课体验",
      `<input type="hidden" name="teacherId" value="${esc(id)}">${field("course", "课程名称")}${field("term", "修读学期", "text", "", "例如：2026 秋季")}<label class="field">课堂体验（至少一项）</label>${checks("tags", ["循序渐进", "节奏较快", "信息密集", "板书推导", "案例讲解", "问题启发", "鼓励提问", "结构清晰", "资料丰富", "预习帮助大", "作业较少", "作业适中", "作业较多", "反馈及时", "重视过程练习"])}${foot()}`,
      "experience",
    );
  }
  function review() {
    modal(
      "分享一次生活体验",
      `<label class="field">分区<select name="category" id="review-category">${D.lifeCategories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}</select></label>${field("place", "店铺或地点", "text", "", "填写你体验过的地点")}<label class="field">体验标签（至少一项）</label><div id="review-tags">${checks("tags", D.lifeCategories[0].tags)}</div><label class="field">补充说明（选填）<textarea name="note" rows="3" maxlength="500" placeholder="例如：工作日午餐时段，等餐约多久。"></textarea></label>${foot()}`,
      "review",
    );
    $("#review-category").addEventListener(
      "change",
      (e) =>
        ($("#review-tags").innerHTML = checks(
          "tags",
          D.lifeCategories.find((c) => c.id === e.target.value).tags,
        )),
    );
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest(".skip")) {
      e.preventDefault();
      $("#main").focus();
      return;
    }
    const a = e.target.closest("[data-action]");
    if (!a) return;
    const { action, id, value } = a.dataset;
    if (action === "menu") {
      document.body.classList.toggle("menu-open");
      a.setAttribute(
        "aria-expanded",
        document.body.classList.contains("menu-open"),
      );
    }
    if (action === "filter") {
      filter = value;
      render();
    }
    if (action === "compose")
      compose(
        a.dataset.section ||
          ([
            "exchange",
            "partners",
            "courses",
            "opinions",
            "boards",
            "roommates",
          ].includes(section)
            ? section
            : "exchange"),
        a.dataset.board || "",
      );
    if (action === "draft") compose("exchange", "", store.get().draft);
    if (action === "edit")
      compose(
        "exchange",
        "",
        store.get().posts.find((p) => p.id === id),
      );
    if (action === "dismiss") $("#modal").close();
    if (action === "join") join();
    if (
      action === "like" ||
      action === "save" ||
      action === "interest" ||
      action === "follow"
    ) {
      toggle(
        {
          like: "liked",
          save: "saved",
          interest: "interests",
          follow: "followed",
        }[action],
        id,
      );
      render();
      if (action === "interest")
        notify("意向已更新；只保存在本机，没有向对方发送消息。");
    }
    if (action === "profile")
      modal(
        "你想被怎样称呼？",
        field("name", "网名", "text", store.get().profile.name) + foot(),
        "profile",
      );
    if (action === "create-board")
      modal(
        "给共同兴趣一个位置",
        field("name", "主题吧名称") +
          field("desc", "一句话介绍") +
          foot("创建本机主题吧"),
        "board",
      );
    if (action === "experience") experience(id);
    if (action === "review") review();
    if (action === "close-plan") {
      commit((s) => {
        const p = s.posts.find((p) => p.id === id);
        if (p) p.closed = !p.closed;
      });
      render();
    }
    if (action === "delete-post")
      modal(
        "删除这条本机内容？",
        `<p>这会移除此浏览器中你发布的内容及对应的本机回复。</p><input name="id" type="hidden" value="${esc(id)}"><div class="form-footer">${button("dismiss", "保留内容", "secondary")}<button class="primary" type="submit">确认删除</button></div>`,
        "delete",
      );
    if (action === "export") {
      const blob = new Blob([store.export()], { type: "application/json" }),
        url = URL.createObjectURL(blob),
        el = document.createElement("a");
      el.href = url;
      el.download = "GBU同行-本机数据.json";
      el.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify("已导出本机内容、收藏、偏好和草稿。");
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id === "search-form") {
      e.preventDefault();
      query = $("#global-search").value.trim();
      location.hash = "search/" + encodeURIComponent(query);
      if (section === "search") render();
      return;
    }
    if (e.target.id === "reply-form") {
      e.preventDefault();
      const f = new FormData(e.target),
        body = String(f.get("body")).trim();
      if (!body) return;
      const id = e.target.dataset.id;
      commit((s) => {
        (s.replies[id] ||= []).push({
          id: uid(),
          body,
          author: f.get("anonymous") ? "匿名同学" : s.profile.name,
          createdAt: new Date().toISOString(),
        });
      });
      render();
      notify("回复已保存在本机。");
      return;
    }
    if (e.target.id !== "modal-form") return;
    e.preventDefault();
    const f = new FormData(e.target),
      kind = e.target.dataset.kind,
      get = (k) => String(f.get(k) || "").trim();
    const error = (message) => {
      const box = $("#form-error");
      if (box) box.textContent = message;
      else notify(message);
    };
    if (kind === "post") {
      const p = draftData();
      if (!p.title.trim() || !p.body.trim())
        return error("标题和正文不能只包含空格。");
      if (p.section === "roommates" && !p.tags.length)
        return error("至少选择一项相处习惯。");
      if (p.section === "partners" && !p.rhythm.trim())
        return error("请写下时间安排，可以填“时间商量”。");
      const previous = store.get().posts.find((x) => x.id === p.editingId);
      const id = previous?.id || uid();
      const post = {
        ...p,
        id,
        title: p.title.trim(),
        body: p.body.trim(),
        author: p.anonymous ? "匿名同学" : store.get().profile.name,
        createdAt: previous?.createdAt || new Date().toISOString(),
        closed: previous?.closed || false,
        sample: false,
        tags:
          p.section === "roommates"
            ? p.tags
            : p.section === "partners"
              ? [p.type, p.format]
              : p.section === "courses"
                ? [p.course]
                : p.section === "boards"
                  ? [boards().find((b) => b.id === p.boardId)?.name || "主题帖"]
                  : [p.topic],
      };
      commit((s) => {
        s.posts = s.posts.filter((x) => x.id !== id);
        s.posts.unshift(post);
        s.draft = null;
      });
      $("#modal").close();
      location.hash = "read/" + id;
      render();
      notify("已保存到本机预览；刷新后仍可查看。");
      return;
    }
    if (kind === "profile") {
      if (!get("name")) return error("请填写一个网名。");
      commit((s) => (s.profile.name = get("name")));
    }
    if (kind === "board") {
      if (!get("name") || !get("desc")) return error("请填写名称与介绍。");
      if (boards().some((b) => b.name === get("name")))
        return error("这个名称已经存在。");
      commit((s) =>
        s.boards.push({
          id: uid(),
          name: get("name"),
          desc: get("desc"),
          mark: get("name")[0],
          sample: false,
        }),
      );
    }
    if (kind === "experience") {
      const t = f.getAll("tags");
      if (!get("course") || !get("term") || !t.length)
        return error("请填写课程、学期，并选择至少一个标签。");
      commit((s) =>
        s.experiences.push({
          id: uid(),
          teacherId: get("teacherId"),
          course: get("course"),
          term: get("term"),
          tags: t,
        }),
      );
    }
    if (kind === "review") {
      const t = f.getAll("tags");
      if (!get("place") || !t.length)
        return error("请填写地点，并选择至少一个标签。");
      commit((s) =>
        s.reviews.unshift({
          id: uid(),
          category: get("category"),
          place: get("place"),
          tags: t,
          note: get("note"),
          createdAt: new Date().toISOString(),
        }),
      );
    }
    if (kind === "delete") {
      const id = get("id");
      commit((s) => {
        s.posts = s.posts.filter((p) => p.id !== id);
        s.saved = s.saved.filter((x) => x !== id);
        s.interests = s.interests.filter((x) => x !== id);
        s.liked = s.liked.filter((x) => x !== id);
        delete s.replies[id];
      });
      $("#modal").close();
      location.hash = "me";
      return;
    }
    $("#modal").close();
    render();
    notify("已保存到本机。");
  });
  document.addEventListener("change", (e) => {
    if (e.target.id === "sort") {
      sort = e.target.value;
      render();
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "teacher-filter") {
      query = e.target.value;
      $("#teacher-results").innerHTML = teacherCards(
        D.teachers.filter((t) =>
          (t.name + t.department).toLowerCase().includes(query.toLowerCase()),
        ),
      );
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.body.classList.remove("menu-open");
      $(".mobile-menu").setAttribute("aria-expanded", "false");
    }
    if (
      e.key === "/" &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement.tagName,
      ) &&
      !$("#modal").open
    ) {
      e.preventDefault();
      $("#global-search").focus();
    }
  });
  window.addEventListener("hashchange", () => {
    filter = "全部";
    query = "";
    sort = "推荐";
    render();
    document.body.classList.remove("menu-open");
    $(".mobile-menu").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
    $("#main").focus({ preventScroll: true });
  });
  shell();
  render();
  if (!store.available) notify("本机存储暂不可用；内容仅在当前页面保留。");
})();
