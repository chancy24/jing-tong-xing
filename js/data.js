const productMeta = {
  name: "京通行",
  subtitle: "面向首都都市圈的智慧通勤 MaaS 服务平台",
  positioning: "服务高频通勤人群，提供固定路线管理、迟到风险预警、绿色积分与通勤治理分析。"
};

const userTypes = [
  {
    id: "UG001",
    name: "北京联合大学学生",
    role: "student",
    description: "以学校、地铁站、实习单位和交通枢纽之间的高频出行为主。",
    coreNeeds: ["低成本路线", "校园接驳", "早八迟到提醒", "绿色积分"],
    typicalOD: ["北京联合大学—望京", "北京联合大学—北京站", "北京联合大学—国贸"]
  },
  {
    id: "UG002",
    name: "跨区上班族",
    role: "commuter",
    description: "居住区到就业中心的早晚高峰固定通勤人群。",
    coreNeeds: ["稳定到达", "少换乘", "拥挤预警", "迟到风险"],
    typicalOD: ["回龙观—西二旗", "燕郊—国贸", "固安—大兴"]
  },
  {
    id: "UG003",
    name: "园区企业员工",
    role: "enterprise_employee",
    description: "地铁站、社区与园区之间的末端接驳和班车需求人群。",
    coreNeeds: ["园区接驳", "班车信息", "停车替代", "绿色通勤"],
    typicalOD: ["荣京东街—亦庄软件园", "望京—望京产业园", "社区—园区"]
  },
  {
    id: "UG004",
    name: "高校/园区管理员",
    role: "organization_admin",
    description: "关注学生、员工集中到达、接驳短板和组织绿色通勤情况。",
    coreNeeds: ["组织通勤看板", "班车优化", "接驳短板", "绿色排行"],
    typicalOD: ["地铁站—校园", "地铁站—园区", "社区—园区"]
  },
  {
    id: "UG005",
    name: "政府交通治理人员",
    role: "government",
    description: "关注区域通勤走廊、公共交通接驳、绿色出行和政策评估。",
    coreNeeds: ["热门 OD", "通勤走廊", "接驳短板", "治理决策"],
    typicalOD: ["燕郊—国贸/通州", "回龙观—西二旗", "固安—大兴"]
  }
];

const locations = [
  { id: "LOC001", name: "北京联合大学", area: "朝阳区", type: "学校" },
  { id: "LOC002", name: "霍营", area: "昌平区", type: "居住区" },
  { id: "LOC003", name: "回龙观", area: "昌平区", type: "居住区" },
  { id: "LOC004", name: "天通苑", area: "昌平区", type: "居住区" },
  { id: "LOC005", name: "西二旗", area: "海淀区", type: "商务区" },
  { id: "LOC006", name: "望京", area: "朝阳区", type: "商务区" },
  { id: "LOC007", name: "国贸", area: "朝阳区", type: "商务区" },
  { id: "LOC008", name: "北京站", area: "东城区", type: "交通枢纽" },
  { id: "LOC009", name: "北京南站", area: "丰台区", type: "交通枢纽" },
  { id: "LOC010", name: "通州北关", area: "通州区", type: "居住区" },
  { id: "LOC011", name: "大兴新城", area: "大兴区", type: "居住区" },
  { id: "LOC012", name: "顺义", area: "顺义区", type: "居住区" },
  { id: "LOC013", name: "燕郊", area: "河北廊坊", type: "环京居住区" },
  { id: "LOC014", name: "固安", area: "河北廊坊", type: "环京居住区" },
  { id: "LOC015", name: "荣京东街", area: "大兴区", type: "轨道站点" },
  { id: "LOC016", name: "亦庄软件园", area: "经开区", type: "产业园区" },
  { id: "LOC017", name: "生命科学园社区", area: "昌平区", type: "居住区" },
  { id: "LOC018", name: "中关村软件园", area: "海淀区", type: "产业园区" },
  { id: "LOC019", name: "城市副中心办公区", area: "通州区", type: "政务办公区" },
  { id: "LOC020", name: "实习单位", area: "朝阳区", type: "商务区" }
];

const routes = [
  {
    id: "R001",
    name: "北京联合大学至国贸轨道快线",
    start: "北京联合大学",
    end: "国贸",
    modes: ["步行", "地铁"],
    duration: 36,
    transfers: 1,
    transferCount: 1,
    cost: 5,
    distance: 13.2,
    carbon: 0.52,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "步行", distance: 0.8 },
      { mode: "地铁", distance: 12.4 }
    ],
    steps: [
      "从北京联合大学步行至附近地铁站",
      "乘坐地铁 14 号线进入朝阳核心区",
      "在国贸站出站，步行至商务办公区"
    ],
    reason: "轨道交通占比高，时间稳定，适合日常实习或上班通勤。"
  },
  {
    id: "R002",
    name: "北京联合大学至国贸绿色接驳线",
    start: "北京联合大学",
    end: "国贸",
    modes: ["共享单车", "地铁", "步行"],
    duration: 44,
    transfers: 1,
    transferCount: 1,
    cost: 4.5,
    distance: 14.1,
    carbon: 0.32,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "共享单车", distance: 1.8 },
      { mode: "地铁", distance: 11.6 },
      { mode: "步行", distance: 0.7 }
    ],
    steps: [
      "从北京联合大学骑行至地铁站",
      "乘坐地铁 14 号线前往 CBD 方向",
      "国贸站出站后步行至办公区"
    ],
    reason: "骑行与轨道交通组合降低碳排放，适合绿色优先策略。"
  },
  {
    id: "R003",
    name: "北京联合大学至国贸少换乘公交线",
    start: "北京联合大学",
    end: "国贸",
    modes: ["公交", "步行"],
    duration: 45,
    transfers: 0,
    transferCount: 0,
    cost: 3,
    distance: 13.8,
    carbon: 1.05,
    comfort: 3,
    crowdedLevel: 3,
    status: "拥挤",
    segments: [
      { mode: "公交", distance: 13.0 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "从北京联合大学步行至公交站",
      "乘坐直达公交进入国贸片区",
      "下车后步行至目的地"
    ],
    reason: "换乘次数少且费用较低，适合换乘少或费用最低策略。"
  },
  {
    id: "R004",
    name: "北京联合大学至国贸综合备选线",
    start: "北京联合大学",
    end: "国贸",
    modes: ["步行", "公交", "地铁"],
    duration: 52,
    transfers: 2,
    transferCount: 2,
    cost: 4,
    distance: 15.4,
    carbon: 0.70,
    comfort: 3,
    crowdedLevel: 3,
    status: "延误",
    segments: [
      { mode: "步行", distance: 0.6 },
      { mode: "公交", distance: 2.8 },
      { mode: "地铁", distance: 12.0 }
    ],
    steps: [
      "步行至校园周边公交站",
      "乘坐公交完成首段接驳",
      "换乘地铁进入国贸区域"
    ],
    reason: "作为备选方案展示多模式联运，但当前存在轻微延误。"
  },
  {
    id: "R005",
    name: "北京联合大学至望京绿色接驳线",
    start: "北京联合大学",
    end: "望京",
    modes: ["共享单车", "地铁", "步行"],
    duration: 32,
    transfers: 1,
    transferCount: 1,
    cost: 4,
    distance: 10.6,
    carbon: 0.36,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "共享单车", distance: 1.6 },
      { mode: "地铁", distance: 8.2 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "从校园东门骑行至地铁站",
      "乘坐地铁 14 号线前往望京方向",
      "出站后步行至望京商务区"
    ],
    reason: "骑行接驳降低等待时间，碳排放低，适合绿色优先策略。"
  },
  {
    id: "R006",
    name: "霍营至国贸早高峰通勤线",
    start: "霍营",
    end: "国贸",
    modes: ["地铁", "步行"],
    duration: 58,
    transfers: 2,
    transferCount: 2,
    cost: 7,
    distance: 24.8,
    carbon: 0.99,
    comfort: 3,
    crowdedLevel: 4,
    status: "拥挤",
    segments: [
      { mode: "地铁", distance: 24.2 },
      { mode: "步行", distance: 0.6 }
    ],
    steps: [
      "霍营站乘坐地铁 13 号线",
      "换乘地铁 10 号线向东南方向通勤",
      "国贸站出站后步行至写字楼"
    ],
    reason: "覆盖典型北部居住区到 CBD 的跨区通勤，早高峰拥挤度较高。"
  },
  {
    id: "R024",
    name: "霍营至北京联合大学早八稳定通勤线",
    start: "霍营",
    end: "北京联合大学",
    modes: ["地铁", "步行", "校园接驳车"],
    duration: 46,
    transfers: 1,
    transferCount: 1,
    cost: 5,
    distance: 18.2,
    carbon: 0.78,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "地铁", distance: 16.8 },
      { mode: "步行", distance: 0.5 },
      { mode: "校园接驳车", distance: 0.9 }
    ],
    steps: [
      "霍营站乘坐地铁 13 号线进入城区方向",
      "换乘地铁到达北京联合大学周边站点",
      "出站后步行至校园接驳点",
      "乘坐校园接驳车到达教学区"
    ],
    reason: "准点率高、换乘风险可控，适合北京联合大学学生早八到校演示。"
  },
  {
    id: "R025",
    name: "霍营至北京联合大学最快到校方案",
    start: "霍营",
    end: "北京联合大学",
    modes: ["地铁", "共享单车"],
    duration: 40,
    transfers: 1,
    transferCount: 1,
    cost: 6.5,
    distance: 18.6,
    carbon: 0.72,
    comfort: 3,
    crowdedLevel: 3,
    status: "拥挤",
    segments: [
      { mode: "地铁", distance: 17.0 },
      { mode: "共享单车", distance: 1.6 }
    ],
    steps: [
      "霍营站乘坐地铁 13 号线出发",
      "换乘轨道交通前往学校周边站点",
      "出站后使用共享单车快速到达校门"
    ],
    reason: "用时最短，但早高峰出站单车供给波动，适合对比最快和最稳方案。"
  },
  {
    id: "R026",
    name: "霍营至北京联合大学低成本公交接驳线",
    start: "霍营",
    end: "北京联合大学",
    modes: ["地铁", "公交", "步行"],
    duration: 58,
    transfers: 2,
    transferCount: 2,
    cost: 4,
    distance: 19.1,
    carbon: 1.05,
    comfort: 3,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "地铁", distance: 14.6 },
      { mode: "公交", distance: 4.0 },
      { mode: "步行", distance: 0.5 }
    ],
    steps: [
      "霍营站乘坐地铁进入市区",
      "换乘公交完成学校周边接驳",
      "下车后步行到达北京联合大学"
    ],
    reason: "费用较低，适合预算敏感学生，但换乘和公交等待时间略高。"
  },
  {
    id: "R007",
    name: "回龙观至西二旗少换乘路线",
    start: "回龙观",
    end: "西二旗",
    modes: ["地铁", "步行"],
    duration: 24,
    transfers: 0,
    transferCount: 0,
    cost: 4,
    distance: 7.8,
    carbon: 0.31,
    comfort: 4,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "地铁", distance: 7.2 },
      { mode: "步行", distance: 0.6 }
    ],
    steps: [
      "回龙观站进站",
      "乘坐地铁 13 号线前往西二旗方向",
      "西二旗站出站后步行至软件园方向"
    ],
    reason: "换乘次数少、费用低，适合短距离通勤和学生实习出行。"
  },
  {
    id: "R008",
    name: "天通苑至望京公交地铁组合",
    start: "天通苑",
    end: "望京",
    modes: ["公交", "地铁", "步行"],
    duration: 49,
    transfers: 1,
    transferCount: 1,
    cost: 6,
    distance: 16.4,
    carbon: 0.87,
    comfort: 3,
    crowdedLevel: 4,
    status: "拥挤",
    segments: [
      { mode: "公交", distance: 3.2 },
      { mode: "地铁", distance: 12.4 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "从天通苑居住区乘坐公交接驳至地铁站",
      "换乘地铁进入望京方向",
      "步行到达望京办公区"
    ],
    reason: "公交接驳覆盖居住区末端，但早高峰舒适度一般。"
  },
  {
    id: "R009",
    name: "西二旗至北京南站交通枢纽线",
    start: "西二旗",
    end: "北京南站",
    modes: ["地铁", "步行"],
    duration: 64,
    transfers: 2,
    transferCount: 2,
    cost: 7,
    distance: 29.5,
    carbon: 1.18,
    comfort: 3,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "地铁", distance: 28.7 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "西二旗站乘坐轨道交通进入中心城区",
      "换乘南北向地铁线路",
      "北京南站出站进入铁路交通枢纽"
    ],
    reason: "适合软件园区域到铁路枢纽的跨区公共交通出行。"
  },
  {
    id: "R010",
    name: "通州北关至国贸副中心通勤线",
    start: "通州北关",
    end: "国贸",
    modes: ["步行", "地铁"],
    duration: 43,
    transfers: 1,
    transferCount: 1,
    cost: 6,
    distance: 21.3,
    carbon: 0.85,
    comfort: 4,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "步行", distance: 0.7 },
      { mode: "地铁", distance: 20.6 }
    ],
    steps: [
      "从通州北关步行至地铁站",
      "乘坐地铁 6 号线向中心城区方向",
      "换乘后抵达国贸区域"
    ],
    reason: "体现城市副中心与 CBD 之间的轨道交通通勤联系。"
  },
  {
    id: "R011",
    name: "大兴新城至北京南站低成本路线",
    start: "大兴新城",
    end: "北京南站",
    modes: ["公交", "地铁", "步行"],
    duration: 52,
    transfers: 1,
    transferCount: 1,
    cost: 6,
    distance: 24.1,
    carbon: 1.08,
    comfort: 3,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "公交", distance: 4.5 },
      { mode: "地铁", distance: 18.8 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "大兴新城乘坐公交到达地铁站",
      "换乘地铁进入北京南站方向",
      "步行进入铁路出发层"
    ],
    reason: "费用可控，适合大兴片区前往铁路枢纽的通勤或出行。"
  },
  {
    id: "R012",
    name: "顺义至望京产业通勤线",
    start: "顺义",
    end: "望京",
    modes: ["公交", "地铁", "步行"],
    duration: 68,
    transfers: 2,
    transferCount: 2,
    cost: 8,
    distance: 34.2,
    carbon: 1.69,
    comfort: 3,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "公交", distance: 5.4 },
      { mode: "地铁", distance: 27.9 },
      { mode: "步行", distance: 0.9 }
    ],
    steps: [
      "顺义居住区乘坐公交到达轨道交通站点",
      "换乘地铁进入朝阳北部商务区",
      "步行到达望京办公园区"
    ],
    reason: "体现远郊居住区与产业园区之间的多方式接驳需求。"
  },
  {
    id: "R013",
    name: "北京站至北京联合大学校园路线",
    start: "北京站",
    end: "北京联合大学",
    modes: ["地铁", "共享单车"],
    duration: 38,
    transfers: 1,
    transferCount: 1,
    cost: 5,
    distance: 12.6,
    carbon: 0.45,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "地铁", distance: 11.2 },
      { mode: "共享单车", distance: 1.4 }
    ],
    steps: [
      "北京站乘坐地铁进入朝阳方向",
      "出站后使用共享单车完成校园末端接驳",
      "到达北京联合大学校门"
    ],
    reason: "适合学生返校，末端骑行减少步行时间。"
  },
  {
    id: "R030",
    name: "北京联合大学至北京站返家枢纽线",
    start: "北京联合大学",
    end: "北京站",
    modes: ["步行", "地铁", "共享单车"],
    duration: 40,
    transfers: 1,
    transferCount: 1,
    cost: 5,
    distance: 12.8,
    carbon: 0.48,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "步行", distance: 0.6 },
      { mode: "地铁", distance: 11.0 },
      { mode: "共享单车", distance: 1.2 }
    ],
    steps: [
      "从北京联合大学步行至轨道交通站点",
      "乘坐地铁前往北京站方向",
      "出站后短距离骑行或步行到达进站口"
    ],
    reason: "适合学生周末返家或前往铁路枢纽，兼顾时间稳定和绿色接驳。"
  },
  {
    id: "R014",
    name: "北京南站至国贸商务出行线",
    start: "北京南站",
    end: "国贸",
    modes: ["地铁", "步行"],
    duration: 42,
    transfers: 1,
    transferCount: 1,
    cost: 5,
    distance: 15.7,
    carbon: 0.63,
    comfort: 4,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "地铁", distance: 15.0 },
      { mode: "步行", distance: 0.7 }
    ],
    steps: [
      "北京南站进入地铁换乘大厅",
      "乘坐地铁向东部商务区方向换乘",
      "国贸站出站步行到达目的地"
    ],
    reason: "适合铁路到达后的城市商务接续出行。"
  },
  {
    id: "R015",
    name: "霍营至望京少步行路线",
    start: "霍营",
    end: "望京",
    modes: ["地铁", "公交"],
    duration: 46,
    transfers: 1,
    transferCount: 1,
    cost: 6,
    distance: 17.9,
    carbon: 0.92,
    comfort: 3,
    crowdedLevel: 4,
    status: "拥挤",
    segments: [
      { mode: "地铁", distance: 15.8 },
      { mode: "公交", distance: 2.1 }
    ],
    steps: [
      "霍营站乘坐地铁进入北部换乘节点",
      "换乘公交接近望京办公片区",
      "在办公园区附近下车"
    ],
    reason: "减少末端步行距离，但公交段受路况影响较大。"
  },
  {
    id: "R016",
    name: "回龙观至国贸舒适备选线",
    start: "回龙观",
    end: "国贸",
    modes: ["地铁", "公交", "步行"],
    duration: 66,
    transfers: 2,
    transferCount: 2,
    cost: 7,
    distance: 25.6,
    carbon: 1.08,
    comfort: 3,
    crowdedLevel: 3,
    status: "延误",
    segments: [
      { mode: "地铁", distance: 22.4 },
      { mode: "公交", distance: 2.4 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "回龙观乘坐地铁进入中心城区",
      "避开部分拥挤站点后换乘公交",
      "步行至国贸办公楼"
    ],
    reason: "作为拥挤时段备选方案，当前存在轻微延误。"
  },
  {
    id: "R017",
    name: "天通苑至西二旗通勤接驳线",
    start: "天通苑",
    end: "西二旗",
    modes: ["公交", "地铁", "步行"],
    duration: 55,
    transfers: 2,
    transferCount: 2,
    cost: 6,
    distance: 21.4,
    carbon: 1.05,
    comfort: 3,
    crowdedLevel: 4,
    status: "拥挤",
    segments: [
      { mode: "公交", distance: 3.6 },
      { mode: "地铁", distance: 17.2 },
      { mode: "步行", distance: 0.6 }
    ],
    steps: [
      "天通苑居住区乘坐公交到达轨道站点",
      "换乘地铁前往西二旗方向",
      "出站步行至互联网办公区"
    ],
    reason: "连接北部大型居住区与就业中心，早高峰压力明显。"
  },
  {
    id: "R018",
    name: "顺义至北京站跨区综合路线",
    start: "顺义",
    end: "北京站",
    modes: ["公交", "地铁", "步行"],
    duration: 76,
    transfers: 2,
    transferCount: 2,
    cost: 9,
    distance: 39.8,
    carbon: 1.91,
    comfort: 3,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "公交", distance: 6.2 },
      { mode: "地铁", distance: 32.8 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "顺义居住区乘坐公交接驳轨道交通",
      "乘坐地铁进入中心城区",
      "北京站附近出站后步行至进站口"
    ],
    reason: "适合远郊到中心铁路枢纽的综合公共交通出行。"
  },
  {
    id: "R019",
    name: "燕郊至国贸跨城稳定通勤线",
    start: "燕郊",
    end: "国贸",
    modes: ["公交", "地铁", "步行"],
    duration: 72,
    transfers: 2,
    transferCount: 2,
    cost: 10,
    distance: 33.6,
    carbon: 1.72,
    comfort: 3,
    crowdedLevel: 4,
    status: "拥挤",
    segments: [
      { mode: "公交", distance: 12.8 },
      { mode: "地铁", distance: 20.0 },
      { mode: "步行", distance: 0.8 }
    ],
    steps: [
      "燕郊居住区乘坐跨城公交进入北京方向",
      "换乘地铁前往国贸商务区",
      "国贸站出站后步行到达办公楼"
    ],
    reason: "体现环京跨城进入 CBD 的典型高频通勤走廊，早高峰拥挤风险较高。"
  },
  {
    id: "R020",
    name: "燕郊至通州北关副中心接续线",
    start: "燕郊",
    end: "通州北关",
    modes: ["公交", "地铁", "共享单车"],
    duration: 46,
    transfers: 1,
    transferCount: 1,
    cost: 7,
    distance: 18.8,
    carbon: 0.92,
    comfort: 3,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "公交", distance: 10.4 },
      { mode: "地铁", distance: 7.2 },
      { mode: "共享单车", distance: 1.2 }
    ],
    steps: [
      "燕郊乘坐跨城公交到达通州方向换乘节点",
      "换乘轨道交通进入副中心片区",
      "使用共享单车完成末端接驳"
    ],
    reason: "适合环京居住区到城市副中心的跨界通勤和绿色接驳演示。"
  },
  {
    id: "R021",
    name: "固安至大兴新城低成本通勤线",
    start: "固安",
    end: "大兴新城",
    modes: ["公交", "地铁", "步行"],
    duration: 64,
    transfers: 1,
    transferCount: 1,
    cost: 8,
    distance: 31.2,
    carbon: 1.53,
    comfort: 3,
    crowdedLevel: 3,
    status: "畅通",
    segments: [
      { mode: "公交", distance: 16.5 },
      { mode: "地铁", distance: 14.0 },
      { mode: "步行", distance: 0.7 }
    ],
    steps: [
      "固安居住区乘坐公交进入大兴方向",
      "换乘轨道交通进入大兴新城",
      "出站后步行到达办公或公共服务区"
    ],
    reason: "覆盖南部环京居住区到大兴就业区的低成本通勤需求。"
  },
  {
    id: "R022",
    name: "荣京东街至亦庄软件园接驳班车线",
    start: "荣京东街",
    end: "亦庄软件园",
    modes: ["步行", "园区班车"],
    duration: 18,
    transfers: 0,
    transferCount: 0,
    cost: 2,
    distance: 4.8,
    carbon: 0.20,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "步行", distance: 0.4 },
      { mode: "园区班车", distance: 4.4 }
    ],
    steps: [
      "荣京东街站出站后步行至园区班车点",
      "乘坐园区班车进入亦庄软件园",
      "在园区主入口下车"
    ],
    reason: "面向园区最后一公里接驳，适合企业员工和园区管理端演示。"
  },
  {
    id: "R023",
    name: "生命科学园社区至中关村软件园通勤线",
    start: "生命科学园社区",
    end: "中关村软件园",
    modes: ["公交", "地铁", "共享单车"],
    duration: 42,
    transfers: 1,
    transferCount: 1,
    cost: 5,
    distance: 15.6,
    carbon: 0.77,
    comfort: 3,
    crowdedLevel: 3,
    status: "拥挤",
    segments: [
      { mode: "公交", distance: 3.4 },
      { mode: "地铁", distance: 10.2 },
      { mode: "共享单车", distance: 2.0 }
    ],
    steps: [
      "社区公交接驳至轨道站点",
      "乘坐轨道交通前往西二旗方向",
      "使用共享单车进入中关村软件园"
    ],
    reason: "反映社区到园区的组合通勤需求，末端单车可用性影响到达稳定性。"
  },
  {
    id: "R027",
    name: "西二旗地铁站至中关村软件园接驳线",
    start: "西二旗",
    end: "中关村软件园",
    modes: ["共享单车", "园区班车"],
    duration: 18,
    transfers: 0,
    transferCount: 0,
    cost: 2,
    distance: 3.2,
    carbon: 0.10,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "共享单车", distance: 1.2 },
      { mode: "园区班车", distance: 2.0 }
    ],
    steps: [
      "西二旗站出站后前往接驳点",
      "优先选择园区班车，班次不足时切换共享单车",
      "到达中关村软件园办公楼群"
    ],
    reason: "突出地铁站到园区最后一公里接驳，适合园区员工和企业管理端演示。"
  },
  {
    id: "R028",
    name: "通州北关至城市副中心办公区短驳线",
    start: "通州北关",
    end: "城市副中心办公区",
    modes: ["公交短驳", "步行"],
    duration: 22,
    transfers: 0,
    transferCount: 0,
    cost: 2,
    distance: 4.6,
    carbon: 0.34,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "公交短驳", distance: 4.0 },
      { mode: "步行", distance: 0.6 }
    ],
    steps: [
      "通州北关站出站进入公交短驳站台",
      "乘坐副中心办公区短驳公交",
      "下车后步行至办公楼入口"
    ],
    reason: "体现城市副中心办公区的末端公共交通接驳和政府治理场景。"
  },
  {
    id: "R029",
    name: "北京联合大学至实习单位稳定通勤线",
    start: "北京联合大学",
    end: "实习单位",
    modes: ["步行", "地铁", "共享单车"],
    duration: 39,
    transfers: 1,
    transferCount: 1,
    cost: 5.5,
    distance: 13.6,
    carbon: 0.49,
    comfort: 4,
    crowdedLevel: 2,
    status: "畅通",
    segments: [
      { mode: "步行", distance: 0.7 },
      { mode: "地铁", distance: 11.8 },
      { mode: "共享单车", distance: 1.1 }
    ],
    steps: [
      "从北京联合大学步行至轨道交通站点",
      "乘坐地铁前往朝阳商务区",
      "出站后共享单车到达实习单位"
    ],
    reason: "面向高校学生实习通勤，兼顾稳定到达、绿色积分和低成本。"
  }
];

const trafficStatus = [
  {
    lineName: "地铁 14 号线",
    type: "地铁",
    status: "畅通",
    arrivalTime: "3 分钟",
    crowdLevel: 2,
    description: "车辆运行稳定，适合北京联合大学至望京、国贸方向通勤。"
  },
  {
    lineName: "地铁 10 号线",
    type: "地铁",
    status: "拥挤",
    arrivalTime: "5 分钟",
    crowdLevel: 4,
    description: "早高峰客流较大，国贸、三元桥等换乘站压力较高。"
  },
  {
    lineName: "地铁 13 号线",
    type: "地铁",
    status: "拥挤",
    arrivalTime: "4 分钟",
    crowdLevel: 4,
    description: "连接霍营、回龙观、西二旗等重点通勤区域，早晚高峰拥挤。"
  },
  {
    lineName: "地铁 6 号线",
    type: "地铁",
    status: "畅通",
    arrivalTime: "4 分钟",
    crowdLevel: 3,
    description: "服务通州北关至中心城区方向，当前运行基本正常。"
  },
  {
    lineName: "地铁 4 号线 - 大兴线",
    type: "地铁",
    status: "畅通",
    arrivalTime: "6 分钟",
    crowdLevel: 3,
    description: "适合大兴新城至北京南站等南部通勤场景。"
  },
  {
    lineName: "快速公交 3 线",
    type: "公交",
    status: "延误",
    arrivalTime: "9 分钟",
    crowdLevel: 3,
    description: "受地面道路信号和早高峰车流影响，存在轻微延误。"
  },
  {
    lineName: "望京园区接驳公交",
    type: "公交",
    status: "畅通",
    arrivalTime: "7 分钟",
    crowdLevel: 2,
    description: "连接地铁站与办公园区，适合末端接驳。"
  },
  {
    lineName: "通州副中心接驳公交",
    type: "公交",
    status: "畅通",
    arrivalTime: "8 分钟",
    crowdLevel: 2,
    description: "服务通州北关周边居住区与轨道站点。"
  },
  {
    lineName: "校园周边共享单车",
    type: "共享单车",
    status: "畅通",
    arrivalTime: "随取随走",
    crowdLevel: 1,
    description: "适合北京联合大学周边 1-2 公里末端接驳。"
  },
  {
    lineName: "望京商务区共享单车",
    type: "共享单车",
    status: "拥挤",
    arrivalTime: "需步行 3 分钟找车",
    crowdLevel: 2,
    description: "早高峰用车需求较大，部分站点车辆紧张。"
  },
  {
    lineName: "西二旗软件园共享单车",
    type: "共享单车",
    status: "停运",
    arrivalTime: "暂未开放",
    crowdLevel: 0,
    description: "部分停车点维护中，暂不建议作为末端接驳方式。"
  }
];

const adminStats = {
  userCount: 128,
  favoriteRouteCount: 46,
  historyQueryCount: 382,
  totalCarbonReduction: 276.8,
  odPairCount: 5,
  corridorCount: 5,
  lastMileWeaknessCount: 4,
  greenCommuteRatio: 0.74,
  monthlyActiveUsers: 336
};

const users = [
  { id: "U001", username: "student", password: "123456", role: "user", userType: "北京联合大学学生" },
  { id: "U002", username: "commuter", password: "123456", role: "user", userType: "跨区上班族" },
  { id: "U003", username: "employee", password: "123456", role: "user", userType: "园区企业员工" },
  { id: "A001", username: "admin", password: "admin123", role: "admin", userType: "高校/园区管理员" },
  { id: "G001", username: "gov", password: "gov123", role: "government", userType: "政府交通治理人员" }
];

const carbonFactors = {
  car: 0.192,
  "公交": 0.082,
  "地铁": 0.045,
  "共享单车": 0,
  "骑行": 0,
  "步行": 0,
  "园区班车": 0.045,
  "校园接驳车": 0.045,
  "公交短驳": 0.082
};

const routeProfiles = {
  R001: { corridor: "北京联合大学—国贸通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.92, weatherImpact: "低", stabilityScore: 88, lateRisk: "低", lastMileType: "步行接驳", tags: ["最稳方案", "轨道优先", "实习通勤"] },
  R002: { corridor: "北京联合大学—国贸通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.9, weatherImpact: "中", stabilityScore: 85, lateRisk: "低", lastMileType: "共享单车接驳", tags: ["绿色推荐", "校园接驳"] },
  R003: { corridor: "北京联合大学—国贸通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.78, weatherImpact: "中", stabilityScore: 72, lateRisk: "中", lastMileType: "公交直达", tags: ["低成本方案", "少换乘"] },
  R004: { corridor: "北京联合大学—国贸通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.7, weatherImpact: "中", stabilityScore: 65, lateRisk: "高", lastMileType: "公交接驳", tags: ["备选方案"] },
  R005: { corridor: "北京联合大学—望京校园实习走廊", userGroup: "北京联合大学学生", punctualityRate: 0.91, weatherImpact: "中", stabilityScore: 87, lateRisk: "低", lastMileType: "共享单车接驳", tags: ["绿色推荐", "校园接驳"] },
  R006: { corridor: "霍营—国贸通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.76, weatherImpact: "低", stabilityScore: 70, lateRisk: "中", lastMileType: "步行接驳", tags: ["早高峰", "跨区通勤"] },
  R007: { corridor: "回龙观—西二旗通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.94, weatherImpact: "低", stabilityScore: 91, lateRisk: "低", lastMileType: "步行接驳", tags: ["最稳方案", "少换乘"] },
  R008: { corridor: "天通苑—望京通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.77, weatherImpact: "中", stabilityScore: 71, lateRisk: "中", lastMileType: "公交接驳", tags: ["接驳方案", "早高峰"] },
  R009: { corridor: "西二旗—北京南站枢纽走廊", userGroup: "跨区上班族", punctualityRate: 0.86, weatherImpact: "低", stabilityScore: 82, lateRisk: "中", lastMileType: "步行接驳", tags: ["交通枢纽"] },
  R010: { corridor: "通州副中心—国贸通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.88, weatherImpact: "低", stabilityScore: 84, lateRisk: "低", lastMileType: "步行接驳", tags: ["副中心通勤", "轨道优先"] },
  R011: { corridor: "大兴新城—北京南站通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.84, weatherImpact: "中", stabilityScore: 79, lateRisk: "中", lastMileType: "公交接驳", tags: ["低成本方案"] },
  R012: { corridor: "顺义—望京产业通勤走廊", userGroup: "园区企业员工", punctualityRate: 0.8, weatherImpact: "中", stabilityScore: 75, lateRisk: "中", lastMileType: "公交接驳", tags: ["产业园区", "长距离通勤"] },
  R013: { corridor: "北京站—北京联合大学校园走廊", userGroup: "北京联合大学学生", punctualityRate: 0.9, weatherImpact: "中", stabilityScore: 86, lateRisk: "低", lastMileType: "共享单车接驳", tags: ["校园接驳", "交通枢纽"] },
  R030: { corridor: "北京联合大学—北京站返家枢纽走廊", userGroup: "北京联合大学学生", punctualityRate: 0.89, weatherImpact: "中", stabilityScore: 85, lateRisk: "低", lastMileType: "共享单车接驳", tags: ["交通枢纽", "学生返家", "绿色推荐"] },
  R014: { corridor: "北京南站—国贸商务走廊", userGroup: "跨区上班族", punctualityRate: 0.89, weatherImpact: "低", stabilityScore: 85, lateRisk: "低", lastMileType: "步行接驳", tags: ["商务出行"] },
  R015: { corridor: "霍营—望京产业通勤走廊", userGroup: "园区企业员工", punctualityRate: 0.78, weatherImpact: "中", stabilityScore: 72, lateRisk: "中", lastMileType: "公交接驳", tags: ["园区接驳"] },
  R016: { corridor: "回龙观—国贸通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.68, weatherImpact: "中", stabilityScore: 63, lateRisk: "高", lastMileType: "公交接驳", tags: ["高风险", "备选方案"] },
  R017: { corridor: "天通苑—西二旗通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.74, weatherImpact: "中", stabilityScore: 69, lateRisk: "中", lastMileType: "公交接驳", tags: ["接驳短板"] },
  R018: { corridor: "顺义—北京站跨区综合走廊", userGroup: "跨区上班族", punctualityRate: 0.79, weatherImpact: "中", stabilityScore: 74, lateRisk: "中", lastMileType: "公交接驳", tags: ["交通枢纽", "长距离通勤"] },
  R019: { corridor: "燕郊—国贸通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.66, weatherImpact: "高", stabilityScore: 61, lateRisk: "高", lastMileType: "跨城公交接驳", tags: ["跨城通勤", "高风险", "热门 OD"] },
  R020: { corridor: "燕郊—通州副中心通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.82, weatherImpact: "中", stabilityScore: 78, lateRisk: "中", lastMileType: "共享单车接驳", tags: ["跨城通勤", "副中心通勤", "绿色推荐"] },
  R021: { corridor: "固安—大兴通勤走廊", userGroup: "跨区上班族", punctualityRate: 0.8, weatherImpact: "中", stabilityScore: 77, lateRisk: "中", lastMileType: "公交接驳", tags: ["跨城通勤", "低成本方案"] },
  R022: { corridor: "荣京东街—亦庄软件园接驳走廊", userGroup: "园区企业员工", punctualityRate: 0.93, weatherImpact: "低", stabilityScore: 90, lateRisk: "低", lastMileType: "园区班车", tags: ["最稳方案", "园区接驳", "班车方案"] },
  R023: { corridor: "生命科学园社区—中关村软件园通勤走廊", userGroup: "园区企业员工", punctualityRate: 0.75, weatherImpact: "中", stabilityScore: 70, lateRisk: "中", lastMileType: "共享单车接驳", tags: ["社区到园区", "接驳短板"] },
  R024: { corridor: "霍营—北京联合大学早八通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.93, weatherImpact: "低", stabilityScore: 90, lateRisk: "低", lastMileType: "校园接驳车", tags: ["最稳方案", "早八通勤", "校园接驳"] },
  R025: { corridor: "霍营—北京联合大学早八通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.84, weatherImpact: "中", stabilityScore: 82, lateRisk: "中", lastMileType: "共享单车接驳", tags: ["最快方案", "早八通勤"] },
  R026: { corridor: "霍营—北京联合大学早八通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.79, weatherImpact: "中", stabilityScore: 74, lateRisk: "中", lastMileType: "公交接驳", tags: ["低成本方案", "学生通勤"] },
  R027: { corridor: "西二旗—中关村软件园接驳走廊", userGroup: "园区企业员工", punctualityRate: 0.88, weatherImpact: "中", stabilityScore: 84, lateRisk: "低", lastMileType: "园区班车", tags: ["园区接驳", "最后一公里"] },
  R028: { corridor: "通州北关—城市副中心办公区接驳走廊", userGroup: "政府交通治理人员", punctualityRate: 0.9, weatherImpact: "低", stabilityScore: 87, lateRisk: "低", lastMileType: "公交短驳", tags: ["副中心通勤", "公交短驳"] },
  R029: { corridor: "北京联合大学—实习单位通勤走廊", userGroup: "北京联合大学学生", punctualityRate: 0.91, weatherImpact: "中", stabilityScore: 86, lateRisk: "低", lastMileType: "共享单车接驳", tags: ["实习通勤", "绿色推荐"] }
};

function calculateRouteCarbonReduction(route) {
  const carEmission = Number(route.distance || 0) * carbonFactors.car;
  const actualEmission = (route.segments || []).reduce((sum, segment) => {
    const factor = carbonFactors[segment.mode] ?? carbonFactors.car;
    return sum + Number(segment.distance || 0) * factor;
  }, 0);
  return Number(Math.max(carEmission - actualEmission, 0).toFixed(2));
}

function getWalkingDistance(route) {
  return Number((route.segments || [])
    .filter((segment) => segment.mode === "步行")
    .reduce((sum, segment) => sum + Number(segment.distance || 0), 0)
    .toFixed(1));
}

function inferLastMileType(route) {
  if ((route.modes || []).includes("园区班车")) return "园区班车";
  if ((route.modes || []).includes("共享单车")) return "共享单车接驳";
  if ((route.modes || []).includes("公交")) return "公交接驳";
  return "步行接驳";
}

function enhanceRoute(route) {
  const profile = routeProfiles[route.id] || {};
  const carbonReduction = calculateRouteCarbonReduction(route);
  const punctualityRate = profile.punctualityRate ?? Math.max(0.62, 0.96 - Number(route.crowdedLevel || 2) * 0.06);
  const stabilityScore = profile.stabilityScore ?? Math.round(punctualityRate * 100 - Number(route.transferCount || 0) * 4);
  const lateRisk = profile.lateRisk ?? (stabilityScore >= 82 ? "低" : stabilityScore >= 70 ? "中" : "高");

  return {
    ...route,
    routeId: route.routeId || route.id,
    routeName: route.routeName || route.name,
    origin: route.origin || route.start,
    destination: route.destination || route.end,
    corridor: profile.corridor || `${route.start}—${route.end}通勤走廊`,
    userGroup: profile.userGroup || "跨区上班族",
    transferCount: Number(route.transferCount ?? route.transfers ?? 0),
    transfers: Number(route.transfers ?? route.transferCount ?? 0),
    carbonEmission: Number(route.carbonEmission ?? route.carbon ?? 0),
    carbonReduction,
    punctualityRate,
    congestionLevel: Number(route.congestionLevel ?? route.crowdedLevel ?? 1),
    walkingDistance: Number(route.walkingDistance ?? getWalkingDistance(route)),
    lastMileType: route.lastMileType || profile.lastMileType || inferLastMileType(route),
    weatherImpact: route.weatherImpact || profile.weatherImpact || "中",
    stabilityScore,
    lateRisk,
    comfortScore: Number(route.comfortScore ?? route.comfort ?? 3),
    tags: route.tags || profile.tags || ["通勤方案"],
    recommendationReason: route.recommendationReason || route.reason || "综合通勤时间、稳定性、费用和低碳表现生成推荐。"
  };
}

const commuteRoutes = routes.map(enhanceRoute);

const commuteScenarios = [
  {
    scenarioId: "SC001",
    userGroup: "北京联合大学学生",
    title: "学校—地铁站校园接驳",
    origin: "北京联合大学",
    destination: "望京",
    corridor: "北京联合大学—望京校园实习走廊",
    relatedRouteIds: ["R005"],
    painPoints: ["路线不熟", "预算敏感", "末端骑行受天气影响"],
    productValue: "提供低成本、绿色优先和校园接驳推荐。"
  },
  {
    scenarioId: "SC002",
    userGroup: "北京联合大学学生",
    title: "学校—北京站返校/出行",
    origin: "北京站",
    destination: "北京联合大学",
    corridor: "北京站—北京联合大学校园走廊",
    relatedRouteIds: ["R013"],
    painPoints: ["换乘不熟", "行李携带", "末端距离"],
    productValue: "展示交通枢纽到校园的分段接驳和绿色减排。"
  },
  {
    scenarioId: "SC003",
    userGroup: "北京联合大学学生",
    title: "学校—实习单位",
    origin: "北京联合大学",
    destination: "国贸",
    corridor: "北京联合大学—国贸通勤走廊",
    relatedRouteIds: ["R001", "R002", "R003", "R004"],
    painPoints: ["早高峰拥挤", "准时到岗", "费用控制"],
    productValue: "支持固定实习路线、迟到风险预警和绿色积分。"
  },
  {
    scenarioId: "SC004",
    userGroup: "跨区上班族",
    title: "回龙观—西二旗稳定通勤",
    origin: "回龙观",
    destination: "西二旗",
    corridor: "回龙观—西二旗通勤走廊",
    relatedRouteIds: ["R007"],
    painPoints: ["早高峰客流集中", "换乘压力", "到岗准时"],
    productValue: "用稳定性评分帮助用户在最快和最稳之间选择。"
  },
  {
    scenarioId: "SC005",
    userGroup: "跨区上班族",
    title: "燕郊—国贸/通州跨城通勤",
    origin: "燕郊",
    destination: "国贸/通州北关",
    corridor: "燕郊—国贸/通州通勤走廊",
    relatedRouteIds: ["R019", "R020"],
    painPoints: ["跨城时间长", "拥挤波动大", "迟到风险高"],
    productValue: "面向政府端展示热门 OD 和跨界通勤治理价值。"
  },
  {
    scenarioId: "SC006",
    userGroup: "跨区上班族",
    title: "固安—大兴南部通勤",
    origin: "固安",
    destination: "大兴新城",
    corridor: "固安—大兴通勤走廊",
    relatedRouteIds: ["R021"],
    painPoints: ["跨区域接驳", "费用敏感", "公交换乘不稳定"],
    productValue: "展示南部环京通勤走廊的低成本方案。"
  },
  {
    scenarioId: "SC007",
    userGroup: "园区企业员工",
    title: "地铁站—园区最后一公里",
    origin: "荣京东街",
    destination: "亦庄软件园",
    corridor: "荣京东街—亦庄软件园接驳走廊",
    relatedRouteIds: ["R022"],
    painPoints: ["地铁到园区距离远", "班车时刻不透明", "集中到达"],
    productValue: "支持园区班车和接驳优化建议。"
  },
  {
    scenarioId: "SC008",
    userGroup: "园区企业员工",
    title: "社区—园区组合通勤",
    origin: "生命科学园社区",
    destination: "中关村软件园",
    corridor: "生命科学园社区—中关村软件园通勤走廊",
    relatedRouteIds: ["R023"],
    painPoints: ["单车可用性波动", "末端拥挤", "到达时间集中"],
    productValue: "沉淀园区通勤画像，辅助单车和班车投放。"
  },
  {
    scenarioId: "SC009",
    userGroup: "政府交通治理人员",
    title: "热门 OD、接驳短板、绿色出行统计",
    origin: "首都都市圈",
    destination: "治理看板",
    corridor: "区域通勤治理",
    relatedRouteIds: ["R007", "R019", "R021", "R022"],
    painPoints: ["跨区通勤走廊难识别", "接驳短板缺少量化", "绿色效果难统计"],
    productValue: "以匿名聚合数据支撑通勤治理和政策评估。"
  }
];

const odHotPairs = [
  { id: "OD001", origin: "回龙观", destination: "西二旗", corridor: "回龙观—西二旗通勤走廊", userGroup: "跨区上班族", dailyTrips: 1860, peakPeriod: "07:30-09:00", avgDuration: 24, avgLateRisk: "低", greenRatio: 0.82 },
  { id: "OD002", origin: "燕郊", destination: "国贸", corridor: "燕郊—国贸通勤走廊", userGroup: "跨区上班族", dailyTrips: 1520, peakPeriod: "06:50-08:40", avgDuration: 72, avgLateRisk: "高", greenRatio: 0.61 },
  { id: "OD003", origin: "固安", destination: "大兴新城", corridor: "固安—大兴通勤走廊", userGroup: "跨区上班族", dailyTrips: 980, peakPeriod: "07:00-08:30", avgDuration: 64, avgLateRisk: "中", greenRatio: 0.66 },
  { id: "OD004", origin: "北京联合大学", destination: "国贸", corridor: "北京联合大学—国贸通勤走廊", userGroup: "北京联合大学学生", dailyTrips: 420, peakPeriod: "08:00-09:30", avgDuration: 42, avgLateRisk: "中", greenRatio: 0.78 },
  { id: "OD005", origin: "荣京东街", destination: "亦庄软件园", corridor: "荣京东街—亦庄软件园接驳走廊", userGroup: "园区企业员工", dailyTrips: 760, peakPeriod: "08:20-09:20", avgDuration: 18, avgLateRisk: "低", greenRatio: 0.89 },
  { id: "OD006", origin: "霍营", destination: "北京联合大学", corridor: "霍营—北京联合大学早八通勤走廊", userGroup: "北京联合大学学生", dailyTrips: 560, peakPeriod: "07:00-08:10", avgDuration: 46, avgLateRisk: "中", greenRatio: 0.86 }
];

const commuteCorridors = [
  { id: "COR001", name: "回龙观—西二旗通勤走廊", scope: "北京北部", dailyTrips: 1860, mainModes: ["地铁", "步行"], stabilityScore: 91, lateRisk: "低", keyIssue: "早高峰进站客流集中", suggestion: "优化早高峰站厅引导和错峰提醒。" },
  { id: "COR002", name: "燕郊—国贸通勤走廊", scope: "环京跨城", dailyTrips: 1520, mainModes: ["公交", "地铁"], stabilityScore: 61, lateRisk: "高", keyIssue: "跨城公交受道路拥堵影响明显", suggestion: "增加跨界公交准点监测和备用轨道方案提示。" },
  { id: "COR003", name: "燕郊—通州副中心通勤走廊", scope: "环京跨城", dailyTrips: 1040, mainModes: ["公交", "地铁", "共享单车"], stabilityScore: 78, lateRisk: "中", keyIssue: "末端共享单车潮汐明显", suggestion: "早高峰在副中心地铁口增加单车调度。" },
  { id: "COR004", name: "固安—大兴通勤走廊", scope: "南部跨城", dailyTrips: 980, mainModes: ["公交", "地铁"], stabilityScore: 77, lateRisk: "中", keyIssue: "公交换乘等待时间波动", suggestion: "优化公交到轨道站的接驳时刻。" },
  { id: "COR005", name: "荣京东街—亦庄软件园接驳走廊", scope: "园区接驳", dailyTrips: 760, mainModes: ["园区班车", "步行"], stabilityScore: 90, lateRisk: "低", keyIssue: "班车余位信息不透明", suggestion: "展示班车余位和下一班发车时间。" },
  { id: "COR006", name: "霍营—北京联合大学早八通勤走廊", scope: "高校通勤", dailyTrips: 560, mainModes: ["地铁", "校园接驳车"], stabilityScore: 90, lateRisk: "低", keyIssue: "早八前集中到校，末端接驳易受天气影响", suggestion: "在 07:20-07:50 增加校园接驳车提示和迟到风险提醒。" }
];

const lastMileWeaknesses = [
  { id: "LM001", station: "荣京东街", target: "亦庄软件园", userGroup: "园区企业员工", weakness: "出站后步行距离较长，班车班次信息分散。", walkingDistance: 1.6, bikeAvailability: "中", shuttleDemand: "高", riskLevel: "中", suggestion: "增加园区班车提示和早高峰短驳班次。" },
  { id: "LM002", station: "西二旗", target: "中关村软件园", userGroup: "园区企业员工", weakness: "共享单车早高峰潮汐明显，可用车不稳定。", walkingDistance: 2.1, bikeAvailability: "低", shuttleDemand: "中", riskLevel: "中", suggestion: "建议运营企业增加单车投放和电子围栏引导。" },
  { id: "LM003", station: "北京联合大学周边地铁站", target: "北京联合大学", userGroup: "北京联合大学学生", weakness: "校园周边雨雪天气骑行体验下降。", walkingDistance: 1.4, bikeAvailability: "中", shuttleDemand: "低", riskLevel: "低", suggestion: "在恶劣天气提示公交或步行备选方案。" },
  { id: "LM004", station: "通州北关", target: "副中心办公区", userGroup: "跨区上班族", weakness: "末端单车需求集中，部分点位还车压力较大。", walkingDistance: 1.2, bikeAvailability: "中", shuttleDemand: "中", riskLevel: "中", suggestion: "优化单车停车点和早高峰调度。" }
];

const lastMileModes = [
  { type: "步行", estimatedTime: "6-15 分钟", cost: "0 元", reliability: "高", scenario: "800 米以内、天气较好、校园或园区门口直达", weatherAffected: "是" },
  { type: "共享单车", estimatedTime: "5-10 分钟", cost: "1.5 元", reliability: "中", scenario: "1-2.5 公里短距离接驳，适合学生和园区员工早晚高峰", weatherAffected: "是" },
  { type: "校园接驳车", estimatedTime: "6-12 分钟", cost: "0-1 元", reliability: "中高", scenario: "地铁站到高校校门、宿舍区、教学区的固定班次接驳", weatherAffected: "否" },
  { type: "园区班车", estimatedTime: "8-15 分钟", cost: "0-2 元", reliability: "高", scenario: "地铁站到产业园区、写字楼群、企业班车站点", weatherAffected: "否" },
  { type: "公交短驳", estimatedTime: "10-18 分钟", cost: "2 元", reliability: "中", scenario: "雨雪天气或共享单车不足时，替代步行和骑行", weatherAffected: "较低" }
];

const lastMileRecommendations = [
  { id: "LMR001", station: "北京联合大学周边地铁站", target: "北京联合大学", recommendedType: "校园接驳车", alternativeTypes: ["步行", "共享单车", "公交短驳"], estimatedTime: "8 分钟", cost: "0 元", reliability: "中高", scenario: "早八到校、宿舍到教学区、雨雪天气到校", weatherAffected: "否", walkingDistance: 1.4, note: "雨雪天气优先推荐校园接驳车，平峰可步行或骑行。" },
  { id: "LMR002", station: "荣京东街地铁站", target: "亦庄软件园", recommendedType: "园区班车", alternativeTypes: ["共享单车", "步行"], estimatedTime: "12 分钟", cost: "0 元", reliability: "高", scenario: "园区员工 9:00 前到岗，班车接入楼宇群", weatherAffected: "否", walkingDistance: 1.6, note: "班车稳定性高，适合固定通勤和企业考勤场景。" },
  { id: "LMR003", station: "西二旗地铁站", target: "中关村软件园", recommendedType: "共享单车", alternativeTypes: ["园区班车", "公交短驳"], estimatedTime: "10 分钟", cost: "1.5 元", reliability: "中", scenario: "早高峰地铁出站到软件园办公楼", weatherAffected: "是", walkingDistance: 2.1, note: "单车潮汐明显，雨雪或缺车时切换园区班车。" },
  { id: "LMR004", station: "通州北关地铁站", target: "城市副中心办公区", recommendedType: "公交短驳", alternativeTypes: ["共享单车", "步行"], estimatedTime: "14 分钟", cost: "2 元", reliability: "中", scenario: "副中心办公区早高峰到岗、会议出行", weatherAffected: "较低", walkingDistance: 1.2, note: "公交短驳覆盖稳定，单车适合天气良好时快速接驳。" }
];

const greenRewards = [
  { id: "GR001", name: "校园打印券", points: 120, scene: "学生学习场景", description: "可模拟兑换 20 页黑白打印额度。" },
  { id: "GR002", name: "咖啡券", points: 260, scene: "园区员工福利", description: "可模拟兑换园区咖啡折扣券。" },
  { id: "GR003", name: "公交优惠券", points: 420, scene: "公共交通激励", description: "可模拟兑换 2 元公交优惠券。" },
  { id: "GR004", name: "校园文创", points: 800, scene: "高校低碳激励", description: "可模拟兑换校园文创周边。" }
];

const fixedCommuteTemplates = [
  { id: "FCT001", routeName: "早八：霍营到北京联合大学", start: "霍营", end: "北京联合大学", departTime: "07:05", targetArrivalTime: "08:00", preference: "stable", userType: "北京联合大学学生" },
  { id: "FCT002", routeName: "回龙观到西二旗上班", start: "回龙观", end: "西二旗", departTime: "08:10", targetArrivalTime: "09:00", preference: "stable", userType: "跨区上班族" },
  { id: "FCT003", routeName: "地铁站到亦庄园区", start: "荣京东街", end: "亦庄软件园", departTime: "08:35", targetArrivalTime: "09:00", preference: "stable", userType: "园区企业员工" }
];

const messages = [
  { id: "MSG001", userId: "guest", type: "风险提醒", title: "今日迟到风险较低", time: "07:00", content: "霍营—北京联合大学稳定通勤线准点率较高，建议 07:05 前出发。", read: false },
  { id: "MSG002", userId: "guest", type: "线路拥挤", title: "13 号线早高峰进站客流较大", time: "07:12", content: "霍营、回龙观方向客流上升，建议预留 5 分钟换乘缓冲。", read: false },
  { id: "MSG003", userId: "guest", type: "接驳短板", title: "雨天建议选择校园接驳车", time: "07:20", content: "最后一公里距离较长时，共享单车受天气影响明显，校园接驳车更稳定。", read: true },
  { id: "MSG004", userId: "guest", type: "积分到账", title: "绿色积分可累计", time: "08:05", content: "选择或收藏绿色路线后，系统会按地铁、公交、步行和碳减排累计积分。", read: true }
];

const greenLeaderboard = [
  { rank: 1, username: "李明", userType: "北京联合大学学生", points: 1420, level: "低碳先锋" },
  { rank: 2, username: "王雨", userType: "园区企业员工", points: 980, level: "黄金通勤者" },
  { rank: 3, username: "张成学", userType: "北京联合大学学生", points: 860, level: "黄金通勤者" },
  { rank: 4, username: "陈晨", userType: "跨区上班族", points: 410, level: "白银通勤者" }
];

const monthlyReportTemplate = {
  month: "2026-05",
  tripCount: 18,
  totalDuration: 842,
  avgDuration: 47,
  mostCommonRoute: "霍营 → 北京联合大学",
  carbonReduction: 12.6,
  greenPoints: 860,
  mostStableRoute: "霍营至北京联合大学早八稳定通勤线",
  mostCongestedRoute: "霍营至北京联合大学最快到校方案",
  suggestion: "建议继续使用稳定优先方案，雨天优先选择校园接驳车。"
};

const backendDashboardStats = {
  campus: {
    greenUsers: 286,
    shuttleDemand: 72,
    hotDestinations: ["北京联合大学", "北京站", "国贸"],
    suggestedStops: ["北京联合大学周边地铁站", "西二旗", "荣京东街"]
  },
  enterprise: {
    parkingPressureIndex: 78,
    shuttleOptimization: "建议在 08:20-09:00 增加荣京东街至亦庄软件园班车。",
    lateRiskPeak: "08:30-09:00"
  },
  government: {
    publicTransportShareIncrease: "8.6%",
    carReplacementTrips: 1240,
    greenTravelRatio: "74%",
    governanceAdvice: "对燕郊—国贸、固安—大兴等走廊增加接驳公交和错峰引导。"
  }
};

const greenCommuteStats = {
  totalGreenTrips: 8240,
  totalCarbonReduction: 2864.5,
  totalGreenScore: 28645,
  greenRatio: 0.74,
  equivalentTrees: Number((2864.5 / 18).toFixed(1)),
  topLowCarbonCorridors: [
    { corridor: "回龙观—西二旗通勤走廊", greenTrips: 1580, carbonReduction: 412.6 },
    { corridor: "北京联合大学—国贸通勤走廊", greenTrips: 620, carbonReduction: 228.4 },
    { corridor: "荣京东街—亦庄软件园接驳走廊", greenTrips: 710, carbonReduction: 184.2 }
  ]
};

const userGrowthStats = [
  { month: "2026-01", registeredUsers: 120, activeUsers: 68, fixedRouteUsers: 21, greenPointClaims: 86 },
  { month: "2026-02", registeredUsers: 180, activeUsers: 102, fixedRouteUsers: 46, greenPointClaims: 134 },
  { month: "2026-03", registeredUsers: 260, activeUsers: 158, fixedRouteUsers: 82, greenPointClaims: 226 },
  { month: "2026-04", registeredUsers: 360, activeUsers: 228, fixedRouteUsers: 138, greenPointClaims: 350 },
  { month: "2026-05", registeredUsers: 520, activeUsers: 336, fixedRouteUsers: 226, greenPointClaims: 548 }
];

const organizationCommuteStats = [
  { id: "ORG001", organization: "北京联合大学", type: "高校", users: 420, fixedRouteRate: 0.58, avgLateRisk: "中", greenTrips: 980, carbonReduction: 302.4, keyCorridor: "北京联合大学—国贸通勤走廊" },
  { id: "ORG002", organization: "亦庄软件园", type: "产业园区", users: 760, fixedRouteRate: 0.66, avgLateRisk: "低", greenTrips: 1280, carbonReduction: 418.7, keyCorridor: "荣京东街—亦庄软件园接驳走廊" },
  { id: "ORG003", organization: "中关村软件园", type: "产业园区", users: 1120, fixedRouteRate: 0.62, avgLateRisk: "中", greenTrips: 1660, carbonReduction: 536.1, keyCorridor: "生命科学园社区—中关村软件园通勤走廊" }
];

const governanceStats = {
  focusArea: "首都都市圈通勤圈",
  dashboardAudience: ["政府交通治理人员", "高校/园区管理员", "交通运营企业"],
  keyIndicators: [
    { name: "热门 OD 对", value: odHotPairs.length, description: "用于识别高频通勤联系。" },
    { name: "高风险走廊", value: commuteCorridors.filter((item) => item.lateRisk === "高").length, description: "用于迟到风险治理和接驳改善。" },
    { name: "接驳短板点", value: lastMileWeaknesses.length, description: "用于班车、公交和共享单车投放建议。" },
    { name: "绿色通勤比例", value: `${Math.round(greenCommuteStats.greenRatio * 100)}%`, description: "用于绿色出行政策评估。" }
  ]
};

const lines = trafficStatus.map((item, index) => ({
  id: `L${String(index + 1).padStart(3, "0")}`,
  name: item.lineName,
  mode: item.type,
  status: item.status,
  crowdedLevel: item.crowdLevel,
  nextArrival: item.arrivalTime,
  description: item.description
}));

const SmartCommuteData = {
  productMeta,
  userTypes,
  locations,
  routes: commuteRoutes,
  routePlans: commuteRoutes,
  trafficStatus,
  lines,
  adminStats,
  users,
  carbonFactors,
  commuteScenarios,
  odHotPairs,
  commuteCorridors,
  lastMileModes,
  lastMileRecommendations,
  lastMileWeaknesses,
  greenRewards,
  fixedCommuteTemplates,
  messages,
  greenLeaderboard,
  monthlyReportTemplate,
  backendDashboardStats,
  greenCommuteStats,
  userGrowthStats,
  organizationCommuteStats,
  governanceStats
};

const COMMUTE_DATA = {
  locations,
  routePlans: commuteRoutes.map((route) => ({
    ...route,
    planId: route.id,
    routeName: route.name
  })),
  lines: lines.map((line) => ({
    ...line,
    routeName: line.name,
    operationTime: line.description || line.nextArrival
  })),
  modeLabels: {
    "地铁": "地铁",
    "公交": "公交",
    "步行": "步行",
    "共享单车": "共享单车",
    "校园接驳车": "校园接驳车",
    "园区班车": "园区班车",
    "公交短驳": "公交短驳"
  },
  strategyWeights: {
    time: { label: "时间优先", time: 0.5, transfer: 0.2, cost: 0.1, carbon: 0.1, crowd: 0.1 },
    transfer: { label: "换乘少", time: 0.2, transfer: 0.5, cost: 0.1, carbon: 0.1, crowd: 0.1 },
    green: { label: "绿色优先", time: 0.15, transfer: 0.15, cost: 0.1, carbon: 0.5, crowd: 0.1 },
    cost: { label: "费用最低", time: 0.15, transfer: 0.15, cost: 0.5, carbon: 0.1, crowd: 0.1 },
    stable: { label: "稳定优先", time: 0.2, transfer: 0.2, cost: 0.1, carbon: 0.1, crowd: 0.4 }
  },
  emissionFactors: carbonFactors
};

window.locations = locations;
window.routes = commuteRoutes;
window.trafficStatus = trafficStatus;
window.adminStats = adminStats;
window.productMeta = productMeta;
window.userTypes = userTypes;
window.commuteScenarios = commuteScenarios;
window.odHotPairs = odHotPairs;
window.commuteCorridors = commuteCorridors;
window.lastMileModes = lastMileModes;
window.lastMileRecommendations = lastMileRecommendations;
window.lastMileWeaknesses = lastMileWeaknesses;
window.greenRewards = greenRewards;
window.fixedCommuteTemplates = fixedCommuteTemplates;
window.messages = messages;
window.greenLeaderboard = greenLeaderboard;
window.monthlyReportTemplate = monthlyReportTemplate;
window.backendDashboardStats = backendDashboardStats;
window.greenCommuteStats = greenCommuteStats;
window.userGrowthStats = userGrowthStats;
window.organizationCommuteStats = organizationCommuteStats;
window.governanceStats = governanceStats;
window.SmartCommuteData = SmartCommuteData;
window.COMMUTE_DATA = COMMUTE_DATA;
