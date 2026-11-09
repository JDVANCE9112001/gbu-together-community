/* 页面内容集中放在这里，后续可在不改交互代码的情况下增删示例。 */
window.GBU_CONTENT = {
  navigation: [
    { id: "home", label: "首页", short: "社区首页", description: "看看最近的讨论与精选内容。" },
    { id: "exchange", label: "校园交流", short: "校园交流", description: "想法、日常和那些不太适合发在大群里的话题。" },
    { id: "partners", label: "找搭子", short: "找搭子", description: "按课程、目标和节奏，遇见愿意一起开始的人。" },
    { id: "courses", label: "课程经验", short: "课程经验", description: "选课体验、学习方法、笔记与复习建议。" },
    { id: "guide", label: "新生指南", short: "新生指南", description: "把校园适应与学习生活的经验慢慢整理下来。" },
    { id: "opinions", label: "百家争鸣", short: "百家争鸣", description: "用网名或匿名写下观点、长文与不同声音。" },
    { id: "boards", label: "兴趣贴吧", short: "兴趣贴吧", description: "围绕课程、兴趣和校园生活开主题吧。" },
    { id: "teachers", label: "师资导航", short: "师资导航", description: "认识老师，从具体课程体验开始。" },
    { id: "life", label: "生活区", short: "生活区", description: "分享餐饮外卖体验，看看同学口碑榜单。" },
    { id: "roommates", label: "室友匹配", short: "室友匹配", description: "新生可先了解彼此的作息与住宿习惯。" }
  ],
  teachers: [
    { id: "cai-zhiqiang", name: "蔡智强", title: "讲席教授", department: "理学院" },
    { id: "bai-yang", name: "白杨", title: "助理教授", department: "先进工程学院" },
    { id: "cui-yaomin", name: "崔耀民", title: "讲师", department: "人文社会科学中心" },
    { id: "chen-jiang", name: "陈江", title: "产业副教授", department: "先进工程学院" },
    { id: "cheng-zhishen", name: "程之申", title: "讲席教授、院长", department: "信息科学技术学院" },
    { id: "chang-jian", name: "常建", title: "预聘副教授", department: "物质科学学院" }
  ],
  roommateProfiles: [
    { id: "r1", nickname: "松果", intro: "希望宿舍是能休息也能互相尊重的空间，公共区域愿意一起商量轮值。", habits: ["作息偏早", "夜间安静", "公共区域轮值"], note: "新生示例 · 虚构内容" },
    { id: "r2", nickname: "海盐", intro: "学习和休息时间会尽量分开，欢迎提前沟通访客、灯光和空调习惯。", habits: ["作息较灵活", "习惯提前沟通", "在宿舍学习较少"], note: "新生示例 · 虚构内容" },
    { id: "r3", nickname: "青柠", intro: "比较在意整洁但不追求一尘不染，希望可以一起定简单好执行的公共空间规则。", habits: ["重视公共区域整洁", "夜间安静", "愿意协商"], note: "新生示例 · 虚构内容" }
  ],
  lifeCategories: [
    { id: "takeout", name: "外卖口碑", desc: "配送、包装、分量和等待时间的体验标签。", tags: ["送达快", "包装稳妥", "分量合适", "适合多人拼单", "配送较慢", "分量偏少", "包装易洒"] },
    { id: "canteen", name: "校内餐饮", desc: "食堂窗口、快取选择和不同口味的同学体验。", tags: ["出餐快", "清淡可选", "适合带走", "选择较多", "高峰排队较久", "口味偏重"] },
    { id: "coffee", name: "咖啡与自习", desc: "适合短暂停留、聊天或学习的地点体验。", tags: ["安静", "插座方便", "适合聊天", "停留舒适", "座位较少", "高峰较吵"] },
    { id: "daily", name: "便利生活", desc: "围绕日常小需求整理经验与地点信息。", tags: ["营业时间友好", "步行方便", "服务稳定", "信息待补充"] }
  ],
  topics: ["全部", "校园生活", "兴趣与想法", "课程讨论", "关系与情绪"],
  posts: [
    { id: 1, topic: "校园生活", title: "大学里大家一般怎么从“认识”变成“熟悉”？", body: "感觉课上见过几次的人挺聊得来，但下课以后又不知道怎么自然地继续聊。你们是怎么开始约饭、一起活动的？", author: "匿名同学", anonymous: true, time: "今天 14:20", replies: 8, likes: 12, featured: true },
    { id: 2, topic: "课程讨论", title: "有没有同学愿意分享一下自己的记笔记方法？", body: "最近发现自己上课一直在记，但复习的时候还是串不起来。想看看大家怎么把概念和例子整理成结构。", author: "示例用户 · 本科生", anonymous: false, time: "今天 11:05", replies: 5, likes: 9 },
    { id: 3, topic: "关系与情绪", title: "想认识新朋友，也想慢慢来，有类似感受吗？", body: "刚到一个新环境，有时候很想主动认识人，有时候又怕给别人压力。希望可以从一起吃饭、散步这种轻松的相处开始。", author: "匿名同学", anonymous: true, time: "昨天 20:46", replies: 11, likes: 16 },
    { id: 4, topic: "兴趣与想法", title: "最近在看城市规划，有人想周末一起逛校园周边吗？", body: "想边散步边看看街区空间怎么变化，完全休闲向，不需要做功课。", author: "示例用户 · 本科生", anonymous: false, time: "昨天 16:30", replies: 3, likes: 7 }
  ],
  buddies: [
    { type: "学习", format: "两人同行", course: "大学数学", title: "每周固定两次，先各自做题再一起对答案", detail: "希望找到愿意稳定互相督促的同学，不追求刷题速度，可以一起整理卡住的概念。", rhythm: "每周 2 次 · 图书馆", tags: ["稳步复习", "一起讨论"], owner: "示例用户 · 本科生" },
    { type: "兴趣", format: "两人同行", course: "编程入门", title: "找人一起做小项目，边做边学", detail: "想把课堂内容用起来，题目可以一起想，代码各自写，遇到问题互相讲思路。", rhythm: "灵活约时间 · 线上/线下", tags: ["项目实践", "初学者友好"], owner: "示例用户 · 本科生" },
    { type: "兴趣", format: "两人同行", course: "英语表达", title: "每周找个主题练 20 分钟口语", detail: "不需要口音标准，主要想养成开口习惯，可以从兴趣和校园生活聊起。", rhythm: "每周 1 次 · 轻量练习", tags: ["语言练习", "低压力"], owner: "示例用户 · 本科生" },
    { type: "生活", format: "两人同行", course: "约饭", title: "下课后找个饭搭子，不用每次都聊学习", detail: "想认识新朋友，约饭时间和地点都可以提前商量，也欢迎安静吃饭。", rhythm: "午餐/晚餐 · 灵活约", tags: ["轻松社交", "不尬聊也可以"], owner: "示例内容 · 非真实用户" },
    { type: "运动", format: "两人同行", course: "散步与运动", title: "找个固定时间一起走走或慢跑", detail: "节奏轻松为主，可以从校园散步开始，互相提醒但不卷配速。", rhythm: "每周 1–2 次 · 时间可商量", tags: ["轻量运动", "新手友好"], owner: "示例内容 · 非真实用户" },
    { type: "兴趣", format: "两人同行", course: "看展与逛逛", title: "周末找人逛展、探店或看看校园周边", detail: "可以一起做简单计划，也可以临时起意。先聊好预算、时长和各自节奏。", rhythm: "周末 · 线下", tags: ["周末活动", "共同探索"], owner: "示例内容 · 非真实用户" }
  ],
  courses: [
    { name: "大学数学", category: "基础课程", title: "听课时怎样抓住定义、例题和推导之间的关系？", body: "一份示例学习经验：先标出定义，再记例题用到的条件，课后尝试用自己的话复述推导。具体方法因人而异，欢迎补充。", tags: ["课堂方法", "知识结构"], author: "示例课程笔记" },
    { name: "编程入门", category: "基础课程", title: "从能运行到能解释：给初学者的练习顺序", body: "先跑通最小例子，再改一个变量观察变化，最后尝试不看原代码重新写一遍。本文为结构示例，不是课程官方要求。", tags: ["练习方法", "入门"], author: "示例学习经验" },
    { name: "跨学科选修", category: "选课参考", title: "选课前可以先问自己的三个问题", body: "我对主题本身有没有好奇？这门课的作业形式适合我的时间安排吗？我希望它补充哪一块知识？建议结合当年课程信息和个人情况判断。", tags: ["选课思路", "时间管理"], author: "示例选课经验" }
  ],
  guides: [
    { title: "第一次选课，可以从哪里开始了解？", type: "学习与选课", text: "先弄清课程目标、考核方式和自己的兴趣，再找同学了解真实体验。往年经验只作参考，具体安排以当年课程信息为准。" },
    { title: "怎么找到适合自己的学习节奏？", type: "学习与选课", text: "试着记录一周里听课、复习和休息的实际时间，再做小幅调整。别人的高效方法可以借鉴，不必整套照搬。" },
    { title: "想认识同学，可以从一个小邀请开始", type: "社交与融入", text: "一起吃饭、课后散步或约一小时自习都是低压力的开始。对方说不方便时，留出空间也很重要。" },
    { title: "有问题但不知道该不该发群里？", type: "社交与融入", text: "先想想你希望得到什么回应：经验、讨论、陪伴，还是只想说出来。把背景讲清楚，别人会更容易接住你的问题。" }
  ],
  essays: [
    { id: "e1", topic: "校园观察", title: "大学里的自由，可能也需要一点主动设计", excerpt: "少了固定班级和统一节奏之后，时间变多了，但关系和学习也更需要自己搭建。也许自由不是没有结构，而是开始练习为自己选择结构。", author: "南窗", time: "今日 · 观点文章", reads: 28 },
    { id: "e2", topic: "学习方法", title: "把“我学会了”拆成能检查的几个小问题", excerpt: "复习时试着合上资料，写出概念之间的关系，再找一个例子验证。能讲出来的部分和仍然模糊的部分，会比划线多少更诚实。", author: "匿名写作者", time: "昨日 · 学习随笔", reads: 19 },
    { id: "e3", topic: "关系与生活", title: "礼貌的陌生人状态，怎样被轻轻打破？", excerpt: "一次具体的小邀请，比“以后常联系”更容易让关系继续。邀请也可以很轻：一起走去食堂、下课聊五分钟，或者约一小时自习。", author: "海盐柠檬", time: "本周 · 校园随笔", reads: 34 }
  ],
  boards: [
    { id: "b1", name: "新生互助吧", mark: "新", category: "校园生活", members: 46, threads: 12, last: "第一次选课，怎么找课程信息？", desc: "新生提问、生活经验和认识同学。" },
    { id: "b2", name: "学习搭子吧", mark: "学", category: "学习互助", members: 31, threads: 9, last: "周三晚图书馆一起自习吗", desc: "按课程和目标约自习、互相督促。" },
    { id: "b3", name: "课程经验吧", mark: "课", category: "课程讨论", members: 38, threads: 16, last: "大学数学的笔记怎么整理？", desc: "分享课程体验、笔记和复习思路。" },
    { id: "b4", name: "兴趣交换吧", mark: "趣", category: "兴趣交流", members: 24, threads: 7, last: "周末想找人逛展/散步", desc: "兴趣活动、书影音和小型约伴。" }
  ],
  boardThreads: [
    { board: "新生互助吧", title: "第一次选课，怎么找课程信息？", author: "匿名", replies: 6, time: "2 小时前", pinned: true },
    { board: "学习搭子吧", title: "周三晚图书馆一起自习吗", author: "松果", replies: 3, time: "4 小时前" },
    { board: "课程经验吧", title: "大学数学的笔记怎么整理？", author: "匿名", replies: 8, time: "昨天" },
    { board: "兴趣交换吧", title: "周末想找人逛展/散步", author: "青柠", replies: 2, time: "昨天" }
  ]
};
