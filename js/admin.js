document.addEventListener("DOMContentLoaded", () => {
  try {
    initAdmin();
  } catch (error) {
    console.error("后台初始化失败：", error);
    const message = document.getElementById("adminMessage");
    if (message) {
      message.textContent = "后台初始化出现问题，请打开控制台查看错误。";
    }
  }
});

function initAdmin() {
  SmartStorage.ensureSeedData();

  const ROUTE_STORAGE_KEY = "smart_commute_admin_routes";

  const elements = {
    loginCard: document.getElementById("adminLoginCard"),
    dashboard: document.getElementById("adminDashboard"),
    username: document.getElementById("adminUsername"),
    password: document.getElementById("adminPassword"),
    loginBtn: document.getElementById("adminLoginBtn"),
    message: document.getElementById("adminMessage"),
    refreshBtn: document.getElementById("refreshAdminBtn"),
    loadDemoDataBtn: document.getElementById("loadDemoDataBtn"),
    clearDemoAdminDataBtn: document.getElementById("clearDemoAdminDataBtn"),
    demoMessage: document.getElementById("adminDemoMessage"),
    userCount: document.getElementById("adminUserCount"),
    favoriteCount: document.getElementById("adminFavoriteCount"),
    historyCount: document.getElementById("adminHistoryCount"),
    carbonTotal: document.getElementById("adminCarbonTotal"),
    userTable: document.getElementById("userTable"),
    routeTable: document.getElementById("routeTable"),
    routeForm: document.getElementById("routeForm"),
    routeIdInput: document.getElementById("routeIdInput"),
    routeNameInput: document.getElementById("routeNameInput"),
    routeStartInput: document.getElementById("routeStartInput"),
    routeEndInput: document.getElementById("routeEndInput"),
    routeModesInput: document.getElementById("routeModesInput"),
    routeDurationInput: document.getElementById("routeDurationInput"),
    routeTransfersInput: document.getElementById("routeTransfersInput"),
    routeCostInput: document.getElementById("routeCostInput"),
    routeCarbonInput: document.getElementById("routeCarbonInput"),
    routeStatusInput: document.getElementById("routeStatusInput"),
    resetRouteFormBtn: document.getElementById("resetRouteFormBtn"),
    resetRoutesBtn: document.getElementById("resetRoutesBtn"),
    managementTabs: document.getElementById("adminManagementTabs"),
    campusSourceStats: document.getElementById("campusSourceStats"),
    campusShuttleDemand: document.getElementById("campusShuttleDemand"),
    campusHotDestinations: document.getElementById("campusHotDestinations"),
    campusGreenUsers: document.getElementById("campusGreenUsers"),
    campusShuttleSuggestions: document.getElementById("campusShuttleSuggestions"),
    enterpriseCorridorStats: document.getElementById("enterpriseCorridorStats"),
    enterpriseShuttleAdvice: document.getElementById("enterpriseShuttleAdvice"),
    enterpriseParkingPressure: document.getElementById("enterpriseParkingPressure"),
    enterpriseLateRiskSlots: document.getElementById("enterpriseLateRiskSlots"),
    enterpriseGreenRank: document.getElementById("enterpriseGreenRank"),
    governmentOdTable: document.getElementById("governmentOdTable"),
    governmentCorridorBars: document.getElementById("governmentCorridorBars"),
    governmentLastMileShortage: document.getElementById("governmentLastMileShortage"),
    governmentGreenImpact: document.getElementById("governmentGreenImpact"),
    governmentPolicyMetrics: document.getElementById("governmentPolicyMetrics"),
    odTopFive: document.getElementById("odTopFive"),
    odCorridorChart: document.getElementById("odCorridorChart"),
    odCorridorTable: document.getElementById("odCorridorTable"),
    popularRoutes: document.getElementById("popularRoutes"),
    greenStats: document.getElementById("greenStats"),
    lastMileWeaknessList: document.getElementById("lastMileWeaknessList")
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function cloneInitialRoutes() {
    return SmartCommuteData.routes.map((route) => ({ ...route }));
  }

  function getManagedRoutes() {
    const stored = readJson(ROUTE_STORAGE_KEY, null);
    if (Array.isArray(stored)) {
      return stored;
    }
    const initialRoutes = cloneInitialRoutes();
    writeJson(ROUTE_STORAGE_KEY, initialRoutes);
    return initialRoutes;
  }

  function saveManagedRoutes(routes) {
    writeJson(ROUTE_STORAGE_KEY, routes);
  }

  function isAdmin() {
    const user = SmartStorage.getCurrentUser();
    return Boolean(user && user.role === "admin");
  }

  function getAllGreenRecords() {
    return SmartStorage.getAllCarbonRecords
      ? SmartStorage.getAllCarbonRecords()
      : SmartStorage.getAllCarbon();
  }

  function renderOverview() {
    const users = SmartStorage.getUsers();
    const favorites = SmartStorage.getAllFavorites ? SmartStorage.getAllFavorites() : [];
    const history = SmartStorage.getAllHistory();
    const carbonRecords = getAllGreenRecords();
    const carbonTotal = carbonRecords.reduce((sum, record) => sum + Number(record.reduceCO2 || 0), 0);

    elements.userCount.textContent = users.filter((user) => user.role !== "admin").length;
    elements.favoriteCount.textContent = favorites.length;
    elements.historyCount.textContent = history.length;
    elements.carbonTotal.textContent = `${carbonTotal.toFixed(2)} kg`;
  }

  function renderUsers() {
    const users = SmartStorage.getUsers();
    elements.userTable.innerHTML = users.length
      ? users.map((user) => `
        <tr>
          <td>${escapeHtml(user.id)}</td>
          <td>${escapeHtml(user.username)}</td>
          <td>${user.role === "admin" ? "管理员" : "普通用户"}</td>
          <td>${escapeHtml(user.createTime || "系统默认")}</td>
        </tr>
      `).join("")
      : `<tr><td colspan="4">暂无用户数据</td></tr>`;
  }

  function renderRoutes() {
    const routes = getManagedRoutes();
    elements.routeTable.innerHTML = routes.length
      ? routes.map((route) => `
        <tr>
          <td>${escapeHtml(route.name)}</td>
          <td>${escapeHtml(route.start)}</td>
          <td>${escapeHtml(route.end)}</td>
          <td>${escapeHtml((route.modes || []).join(" + "))}</td>
          <td>${escapeHtml(route.duration)} 分钟</td>
          <td>${escapeHtml(route.transfers ?? route.transferCount ?? 0)} 次</td>
          <td>${escapeHtml(route.cost)} 元</td>
          <td><span class="status-pill ${statusClass(route.status)}">${escapeHtml(route.status)}</span></td>
          <td>
            <div class="table-actions">
              <button class="mini-btn edit-route-btn" type="button" data-route-id="${escapeHtml(route.id)}">编辑</button>
              <button class="mini-btn danger delete-route-btn" type="button" data-route-id="${escapeHtml(route.id)}">删除</button>
            </div>
          </td>
        </tr>
      `).join("")
      : `<tr><td colspan="9">暂无路线数据</td></tr>`;
  }

  function statusClass(status) {
    if (status === "畅通") return "ok";
    if (status === "拥挤") return "congested";
    if (status === "延误") return "delay";
    if (status === "停运") return "closed";
    return "";
  }

  function percent(value) {
    return `${Math.round(Number(value || 0) * 100)}%`;
  }

  function renderBarList(items, valueField = "value", options = {}) {
    const maxValue = Math.max(...items.map((item) => Number(item[valueField] || 0)), 1);
    return items.map((item) => {
      const value = Number(item[valueField] || 0);
      const width = Math.min(Math.max((value / maxValue) * 100, 6), 100);
      const valueText = options.formatValue ? options.formatValue(value, item) : value;
      return `
        <div class="bar-row">
          <div class="bar-row-head">
            <strong>${escapeHtml(item.name || item.label || item.corridor || item.route || "-")}</strong>
            <span>${escapeHtml(valueText)}</span>
          </div>
          <div class="bar-track"><i style="width: ${width}%"></i></div>
          ${item.note ? `<small>${escapeHtml(item.note)}</small>` : ""}
        </div>
      `;
    }).join("");
  }

  function renderDataCards(items) {
    return items.map((item) => `
      <div class="management-data-card">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        <p>${escapeHtml(item.note || "")}</p>
      </div>
    `).join("");
  }

  function renderSimpleTable(headers, rows) {
    return `
      <table>
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  function getCampusSources() {
    return [
      { name: "回龙观 / 霍营", value: 168, note: "学生和青年员工集中居住区" },
      { name: "通州北关 / 副中心", value: 126, note: "跨区通勤来源稳定增长" },
      { name: "北京站 / 北京南站", value: 84, note: "枢纽到校、到园区换乘明显" },
      { name: "顺义 / 望京", value: 62, note: "实习与产业园区通勤混合" }
    ];
  }

  function getCampusHotDestinations() {
    return [
      { name: "北京联合大学", value: 420, note: "早八到校集中" },
      { name: "亦庄软件园", value: 318, note: "地铁站到园区接驳需求高" },
      { name: "中关村软件园", value: 286, note: "单车潮汐明显" },
      { name: "副中心办公区", value: 214, note: "公交短驳更稳定" }
    ];
  }

  function getEnterpriseGreenRank() {
    return [
      { name: "研发一部", users: 86, points: 6820, greenRatio: "82%" },
      { name: "产品运营部", users: 64, points: 5360, greenRatio: "76%" },
      { name: "客户成功部", users: 52, points: 4380, greenRatio: "71%" },
      { name: "行政支持部", users: 38, points: 3120, greenRatio: "68%" }
    ];
  }

  function renderCampusDashboard() {
    const weaknesses = SmartCommuteData.lastMileWeaknesses || [];
    const orgStats = SmartCommuteData.organizationCommuteStats || [];
    const greenUsers = orgStats.reduce((sum, item) => sum + Number(item.greenTrips || 0), 0);

    elements.campusSourceStats.innerHTML = renderBarList(getCampusSources(), "value", {
      formatValue: (value) => `${value} 人`
    });
    elements.campusShuttleDemand.innerHTML = renderDataCards([
      { label: "接驳需求站点", value: `${weaknesses.length} 个`, note: "来自地铁站到校园/园区的末端短驳识别。" },
      { label: "高需求班车点", value: `${weaknesses.filter((item) => item.shuttleDemand === "高").length} 个`, note: "优先评估早高峰接驳车班次。" },
      { label: "平均末端步行", value: `${(weaknesses.reduce((sum, item) => sum + Number(item.walkingDistance || 0), 0) / Math.max(weaknesses.length, 1)).toFixed(1)} km`, note: "超过 1.2km 的点位建议提供接驳替代。" }
    ]);
    elements.campusHotDestinations.innerHTML = renderBarList(getCampusHotDestinations(), "value", {
      formatValue: (value) => `${value} 人次`
    });
    elements.campusGreenUsers.innerHTML = renderDataCards([
      { label: "绿色通勤人数", value: `${greenUsers} 人次`, note: "高校和园区组织通勤统计口径。" },
      { label: "固定路线使用率", value: percent(orgStats.reduce((sum, item) => sum + Number(item.fixedRouteRate || 0), 0) / Math.max(orgStats.length, 1)), note: "固定路线越高，越适合做月报和准点提醒。" },
      { label: "平均迟到风险", value: "中", note: "校园到岗场景需重点关注早高峰接驳。" }
    ]);
    elements.campusShuttleSuggestions.innerHTML = renderSimpleTable(
      ["站点", "到达地", "短板", "建议"],
      weaknesses.map((item) => [item.station, item.target, item.weakness, item.suggestion])
    );
  }

  function renderEnterpriseDashboard() {
    const corridors = (SmartCommuteData.commuteCorridors || [])
      .filter((item) => item.name.includes("园区") || item.name.includes("西二旗") || item.name.includes("望京"))
      .slice(0, 5);
    const lateSlots = [
      { name: "08:20-08:40", value: 34, note: "进站客流叠加，建议提前 10 分钟" },
      { name: "08:40-09:00", value: 48, note: "到岗高峰，班车余位紧张" },
      { name: "09:00-09:20", value: 29, note: "园区门口排队明显" },
      { name: "18:20-19:00", value: 22, note: "晚高峰返程拥挤" }
    ];
    const greenRank = getEnterpriseGreenRank();

    elements.enterpriseCorridorStats.innerHTML = renderBarList(corridors, "dailyTrips", {
      formatValue: (value) => `${value} 人次/日`
    });
    elements.enterpriseShuttleAdvice.innerHTML = renderDataCards([
      { label: "建议新增班车", value: "荣京东街 → 亦庄软件园", note: "固定员工流量高，班车稳定性评分可提升。" },
      { label: "建议加密班次", value: "08:30-09:10", note: "迟到风险集中在到岗前 40 分钟。" },
      { label: "建议备用线路", value: "西二旗 → 中关村软件园", note: "共享单车不足时启用公交短驳或园区班车。" }
    ]);
    elements.enterpriseParkingPressure.innerHTML = renderDataCards([
      { label: "停车压力指数", value: "78/100", note: "小汽车替代空间较大，适合绿色积分激励。" },
      { label: "高峰入场车辆", value: "620 辆", note: "08:30-09:10 集中入场。" },
      { label: "可替代次数", value: "240 次/日", note: "通过班车、地铁接驳和公交优惠引导。" }
    ]);
    elements.enterpriseLateRiskSlots.innerHTML = renderBarList(lateSlots, "value", {
      formatValue: (value) => `${value}%`
    });
    elements.enterpriseGreenRank.innerHTML = renderSimpleTable(
      ["部门", "绿色通勤人数", "绿色积分", "绿色比例"],
      greenRank.map((item) => [item.name, `${item.users} 人`, `${item.points} 分`, item.greenRatio])
    );
  }

  function renderGovernmentDashboard() {
    const odPairs = SmartCommuteData.odHotPairs || [];
    const corridors = SmartCommuteData.commuteCorridors || [];
    const weaknesses = SmartCommuteData.lastMileWeaknesses || [];
    const green = SmartCommuteData.greenCommuteStats || {};
    const policyMetrics = [
      { name: "公共交通分担率提升", value: 7.8, note: "模拟政策实施后提升幅度" },
      { name: "小汽车替代次数", value: 1840, note: "按绿色通勤记录和热门 OD 估算" },
      { name: "接驳短板改善率", value: 42, note: "已纳入调度或班车建议的短板占比" },
      { name: "绿色通勤比例", value: Math.round(Number(green.greenRatio || 0) * 100), note: "绿色出行政策评估指标" }
    ];

    elements.governmentOdTable.innerHTML = renderSimpleTable(
      ["OD", "走廊", "日通勤量", "高峰时段", "迟到风险"],
      odPairs.map((item) => [`${item.origin} → ${item.destination}`, item.corridor, `${item.dailyTrips} 人次`, item.peakPeriod, item.avgLateRisk])
    );
    elements.governmentCorridorBars.innerHTML = renderBarList(corridors, "dailyTrips", {
      formatValue: (value) => `${value} 人次/日`
    });
    elements.governmentLastMileShortage.innerHTML = renderDataCards(weaknesses.map((item) => ({
      label: `${item.station} → ${item.target}`,
      value: `风险${item.riskLevel}`,
      note: item.suggestion
    })));
    elements.governmentGreenImpact.innerHTML = renderDataCards([
      { label: "绿色出行总减排", value: `${Number(green.totalCarbonReduction || 0).toFixed(1)} kg`, note: "平台模拟绿色通勤累计减排。" },
      { label: "绿色通勤总量", value: `${green.totalGreenTrips || 0} 次`, note: "用于绿色出行政策评估。" },
      { label: "等效种树", value: `${green.equivalentTrees || 0} 棵`, note: "按 1 棵树每年吸收 18 kg CO2 估算。" }
    ]);
    elements.governmentPolicyMetrics.innerHTML = renderBarList(policyMetrics, "value", {
      formatValue: (value, item) => item.name.includes("次数") ? `${value} 次` : `${value}%`
    });
  }

  function renderRoleDashboards() {
    renderCampusDashboard();
    renderEnterpriseDashboard();
    renderGovernmentDashboard();
  }

  function switchManagementTab(tabName) {
    document.querySelectorAll("[data-admin-tab]").forEach((button) => {
      button.classList.toggle("active", button.dataset.adminTab === tabName);
    });
    document.querySelectorAll("[data-admin-panel]").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.adminPanel !== tabName);
    });
  }

  function normalizeOdName(name) {
    const value = String(name || "");
    if (value.includes("通州")) return "通州";
    if (value.includes("大兴")) return "大兴";
    return value;
  }

  function odKey(start, end) {
    return `${normalizeOdName(start)} → ${normalizeOdName(end)}`;
  }

  function corridorKey(start, end) {
    return [normalizeOdName(start), normalizeOdName(end)].sort().join("—");
  }

  function countHistoryByOd() {
    return SmartStorage.getAllHistory().reduce((map, item) => {
      const key = odKey(item.start, item.end);
      if (!map[key]) {
        map[key] = {
          name: key,
          start: normalizeOdName(item.start),
          end: normalizeOdName(item.end),
          count: 0,
          latestTime: item.queryTime
        };
      }
      map[key].count += 1;
      map[key].latestTime = item.queryTime || map[key].latestTime;
      return map;
    }, {});
  }

  function countHistoryByCorridor(start, end) {
    const key = corridorKey(start, end);
    return SmartStorage.getAllHistory().filter((item) => corridorKey(item.start, item.end) === key).length;
  }

  function findRoutesForCorridor(definition) {
    const start = normalizeOdName(definition.start);
    const end = normalizeOdName(definition.end);
    return (SmartCommuteData.routes || []).filter((route) => {
      const routeStart = normalizeOdName(route.start);
      const routeEnd = normalizeOdName(route.end);
      const sameDirection = routeStart === start && routeEnd === end;
      const reverseDirection = routeStart === end && routeEnd === start;
      return sameDirection || reverseDirection || String(route.corridor || "").includes(definition.shortName);
    });
  }

  function getCorridorWeakness(definition) {
    const weaknesses = SmartCommuteData.lastMileWeaknesses || [];
    const matched = weaknesses.find((item) => {
      const text = `${item.station}${item.target}${item.userGroup}${item.weakness}`;
      return definition.keywords.some((keyword) => text.includes(keyword));
    });
    return matched ? matched.weakness : definition.fallbackWeakness;
  }

  function getCorridorSuggestion(definition, congestionIndex) {
    if (definition.suggestion) {
      return definition.suggestion;
    }
    if (congestionIndex >= 75) {
      return "该走廊早高峰拥挤指数较高，建议增加接驳公交班次或引导错峰出行。";
    }
    if (congestionIndex >= 55) {
      return "该走廊存在一定高峰波动，建议优化接驳时刻并加强实时提醒。";
    }
    return "该走廊整体运行较稳定，可继续提升绿色出行激励和固定路线服务。";
  }

  function buildTopOdData() {
    const historyMap = countHistoryByOd();
    (SmartCommuteData.odHotPairs || []).forEach((item) => {
      const key = odKey(item.origin, item.destination);
      if (!historyMap[key]) {
        historyMap[key] = {
          name: key,
          start: normalizeOdName(item.origin),
          end: normalizeOdName(item.destination),
          count: 0,
          simulatedCount: Math.max(Math.round(Number(item.dailyTrips || 0) / 80), 1),
          latestTime: "模拟数据"
        };
      } else {
        historyMap[key].simulatedCount = Math.max(Math.round(Number(item.dailyTrips || 0) / 80), 1);
      }
      historyMap[key].corridor = item.corridor;
      historyMap[key].avgDuration = item.avgDuration;
      historyMap[key].greenRatio = item.greenRatio;
    });

    return Object.values(historyMap)
      .map((item) => ({
        ...item,
        totalCount: Number(item.count || 0) + Number(item.simulatedCount || 0)
      }))
      .sort((a, b) => b.totalCount - a.totalCount)
      .slice(0, 5);
  }

  function buildCorridorDefinitions() {
    return [
      {
        shortName: "回龙观—西二旗",
        start: "回龙观",
        end: "西二旗",
        keywords: ["西二旗", "回龙观"],
        fallbackWeakness: "早高峰进站客流集中，站厅与换乘通道压力较高。"
      },
      {
        shortName: "燕郊—国贸",
        start: "燕郊",
        end: "国贸",
        keywords: ["燕郊", "跨城", "国贸"],
        fallbackWeakness: "跨城公交受道路拥堵影响明显，迟到风险波动较大。"
      },
      {
        shortName: "固安—大兴",
        start: "固安",
        end: "大兴",
        keywords: ["固安", "大兴"],
        fallbackWeakness: "公交到轨道换乘等待时间不稳定，末端接驳信息不足。"
      },
      {
        shortName: "通州—国贸",
        start: "通州",
        end: "国贸",
        keywords: ["通州", "副中心", "国贸"],
        fallbackWeakness: "副中心到中心城区方向早高峰单车和轨道客流叠加。",
        suggestion: "该走廊连接副中心与核心商务区，建议优化轨道换乘引导并增加地铁站周边单车调度。"
      },
      {
        shortName: "北京联合大学—北京站",
        start: "北京联合大学",
        end: "北京站",
        keywords: ["北京联合大学", "北京站", "校园"],
        fallbackWeakness: "学生携带行李时末端骑行体验下降，雨雪天气需要公交或校园接驳备选。",
        suggestion: "该走廊面向学生返校和枢纽出行，建议在高峰时段提示校园接驳车和低成本备选路线。"
      }
    ];
  }

  function buildCorridorAnalysis() {
    return buildCorridorDefinitions().map((definition) => {
      const routes = findRoutesForCorridor(definition);
      const routeCount = Math.max(routes.length, 1);
      const simulated = (SmartCommuteData.odHotPairs || []).find((item) => {
        const itemKey = corridorKey(item.origin, item.destination);
        return itemKey === corridorKey(definition.start, definition.end)
          || String(item.corridor || "").includes(definition.shortName);
      });
      const queryCount = countHistoryByCorridor(definition.start, definition.end)
        + Math.max(Math.round(Number(simulated?.dailyTrips || routes[0]?.distance * 20 || 260) / 100), 1);
      const avgDuration = routes.length
        ? routes.reduce((sum, route) => sum + Number(route.duration || 0), 0) / routeCount
        : Number(simulated?.avgDuration || 45);
      const avgCrowd = routes.length
        ? routes.reduce((sum, route) => sum + Number(route.congestionLevel ?? route.crowdedLevel ?? 3), 0) / routeCount
        : 3;
      const congestionIndex = Math.round(Math.min(avgCrowd * 20, 100));
      const greenRatio = Number(simulated?.greenRatio ?? (
        routes.length
          ? routes.filter((route) => Number(route.carbonEmission ?? route.carbon ?? 0) <= 1).length / routeCount
          : 0.68
      ));
      const lastMileWeakness = getCorridorWeakness(definition);

      return {
        name: definition.shortName,
        queryCount,
        avgDuration,
        congestionIndex,
        lastMileWeakness,
        greenRatio,
        suggestion: getCorridorSuggestion(definition, congestionIndex)
      };
    });
  }

  function renderOdAnalysis() {
    const topOd = buildTopOdData();
    const corridors = buildCorridorAnalysis();

    elements.odTopFive.innerHTML = renderBarList(topOd.map((item) => ({
      name: item.name,
      value: item.totalCount,
      note: `${item.count || 0} 次来自历史查询，${item.simulatedCount || 0} 次为模拟热度折算。`
    })), "value", {
      formatValue: (value) => `${value} 次`
    });
    elements.odCorridorChart.innerHTML = renderBarList(corridors.map((item) => ({
      name: item.name,
      value: item.queryCount,
      note: `平均 ${item.avgDuration.toFixed(0)} 分钟 · 绿色比例 ${Math.round(item.greenRatio * 100)}%`
    })), "value", {
      formatValue: (value) => `${value} 次`
    });
    elements.odCorridorTable.innerHTML = renderSimpleTable(
      ["通勤走廊", "查询次数", "平均通勤时间", "拥挤指数", "接驳短板", "绿色比例", "治理建议"],
      corridors.map((item) => [
        item.name,
        `${item.queryCount} 次`,
        `${item.avgDuration.toFixed(0)} 分钟`,
        `${item.congestionIndex}/100`,
        item.lastMileWeakness,
        `${Math.round(item.greenRatio * 100)}%`,
        item.suggestion
      ])
    );
  }

  function renderPopularRoutes() {
    const history = SmartStorage.getAllHistory();
    const routeMap = history.reduce((map, item) => {
      const key = `${item.start} → ${item.end}`;
      if (!map[key]) {
        map[key] = {
          route: key,
          count: 0,
          latestTime: item.queryTime
        };
      }
      map[key].count += 1;
      return map;
    }, {});

    const popular = Object.values(routeMap).sort((a, b) => b.count - a.count).slice(0, 6);
    elements.popularRoutes.innerHTML = popular.length
      ? popular.map((item, index) => `
        <div class="record-item">
          <div class="record-main">
            <strong>TOP ${index + 1} · ${escapeHtml(item.route)}</strong>
            <p>查询次数：${item.count}</p>
            <small>最近查询：${escapeHtml(item.latestTime || "-")}</small>
          </div>
        </div>
      `).join("")
      : `<p class="empty">暂无历史查询记录。</p>`;
  }

  function renderGreenStats() {
    const records = getAllGreenRecords();
    const total = records.reduce((sum, record) => sum + Number(record.reduceCO2 || 0), 0);
    const points = records.reduce((sum, record) => sum + Number(record.greenPoints ?? record.score ?? 0), 0);
    const level = SmartStorage.getGreenLevel ? SmartStorage.getGreenLevel(points) : { name: "青铜通勤者" };
    const trees = total / 18;

    elements.greenStats.innerHTML = `
      <div class="record-item">
        <div class="record-main">
          <strong>累计绿色出行次数</strong>
          <p>${records.length} 次</p>
        </div>
      </div>
      <div class="record-item">
        <div class="record-main">
          <strong>累计减排量</strong>
          <p>${total.toFixed(2)} kg CO₂</p>
        </div>
      </div>
      <div class="record-item">
        <div class="record-main">
          <strong>累计绿色积分</strong>
          <p>${Math.round(points)} 分</p>
        </div>
      </div>
      <div class="record-item">
        <div class="record-main">
          <strong>当前绿色等级</strong>
          <p>${escapeHtml(level.name)}</p>
        </div>
      </div>
      <div class="record-item">
        <div class="record-main">
          <strong>等效种树</strong>
          <p>${trees.toFixed(1)} 棵树年度吸收量</p>
        </div>
      </div>
    `;
  }

  function renderLastMileWeaknesses() {
    const weaknesses = SmartCommuteData.lastMileWeaknesses || [];
    elements.lastMileWeaknessList.innerHTML = weaknesses.length
      ? weaknesses.map((item) => `
        <div class="record-item">
          <div class="record-main">
            <strong>${escapeHtml(item.station)} → ${escapeHtml(item.target)}</strong>
            <p>${escapeHtml(item.weakness)}</p>
            <small>步行 ${escapeHtml(item.walkingDistance)} km · 单车可用性 ${escapeHtml(item.bikeAvailability)} · 班车需求 ${escapeHtml(item.shuttleDemand)} · 风险 ${escapeHtml(item.riskLevel)}</small>
            <small>治理建议：${escapeHtml(item.suggestion)}</small>
          </div>
        </div>
      `).join("")
      : `<p class="empty">暂无接驳短板数据。</p>`;
  }

  function renderDashboard() {
    renderOverview();
    renderRoleDashboards();
    renderOdAnalysis();
    renderUsers();
    renderRoutes();
    renderPopularRoutes();
    renderGreenStats();
    renderLastMileWeaknesses();
  }

  function clearRouteForm() {
    elements.routeForm.reset();
    elements.routeIdInput.value = "";
    elements.routeDurationInput.value = "45";
    elements.routeTransfersInput.value = "1";
    elements.routeCostInput.value = "6";
    elements.routeCarbonInput.value = "0.80";
    elements.routeStatusInput.value = "畅通";
  }

  function getRouteFormData() {
    const modes = elements.routeModesInput.value
      .split(/[,，+、]/)
      .map((mode) => mode.trim())
      .filter(Boolean);
    const distance = Number(elements.routeDurationInput.value) * 0.45;

    return {
      id: elements.routeIdInput.value || `R_ADMIN_${Date.now()}`,
      name: elements.routeNameInput.value.trim(),
      start: elements.routeStartInput.value.trim(),
      end: elements.routeEndInput.value.trim(),
      modes,
      duration: Number(elements.routeDurationInput.value) || 0,
      transfers: Number(elements.routeTransfersInput.value) || 0,
      transferCount: Number(elements.routeTransfersInput.value) || 0,
      cost: Number(elements.routeCostInput.value) || 0,
      distance,
      carbon: Number(elements.routeCarbonInput.value) || 0,
      comfort: 3,
      crowdedLevel: elements.routeStatusInput.value === "拥挤" ? 4 : 2,
      status: elements.routeStatusInput.value,
      segments: modes.map((mode) => ({ mode, distance: Number((distance / Math.max(modes.length, 1)).toFixed(1)) })),
      steps: modes.map((mode, index) => `第 ${index + 1} 段使用${mode}出行`),
      reason: "后台维护的课程演示路线。"
    };
  }

  function saveRoute(event) {
    event.preventDefault();
    const route = getRouteFormData();
    if (!route.name || !route.start || !route.end || route.modes.length === 0) {
      return;
    }

    const routes = getManagedRoutes();
    const index = routes.findIndex((item) => item.id === route.id);
    if (index >= 0) {
      routes[index] = route;
    } else {
      routes.unshift(route);
    }
    saveManagedRoutes(routes);
    clearRouteForm();
    renderRoutes();
  }

  function editRoute(routeId) {
    const route = getManagedRoutes().find((item) => item.id === routeId);
    if (!route) return;

    elements.routeIdInput.value = route.id;
    elements.routeNameInput.value = route.name;
    elements.routeStartInput.value = route.start;
    elements.routeEndInput.value = route.end;
    elements.routeModesInput.value = (route.modes || []).join(",");
    elements.routeDurationInput.value = route.duration;
    elements.routeTransfersInput.value = route.transfers ?? route.transferCount ?? 0;
    elements.routeCostInput.value = route.cost;
    elements.routeCarbonInput.value = route.carbon;
    elements.routeStatusInput.value = route.status || "畅通";
    elements.routeNameInput.focus();
  }

  function deleteRoute(routeId) {
    const routes = getManagedRoutes().filter((item) => item.id !== routeId);
    saveManagedRoutes(routes);
    renderRoutes();
  }

  function handleRouteTableClick(event) {
    const editButton = event.target.closest(".edit-route-btn");
    const deleteButton = event.target.closest(".delete-route-btn");
    if (editButton) {
      editRoute(editButton.dataset.routeId);
    }
    if (deleteButton) {
      deleteRoute(deleteButton.dataset.routeId);
    }
  }

  function enterDashboard() {
    elements.loginCard.classList.add("hidden");
    elements.dashboard.classList.remove("hidden");
    renderDashboard();
  }

  function showDemoMessage(message) {
    elements.demoMessage.textContent = message;
    elements.demoMessage.classList.remove("hidden");
  }

  function handleLoadDemoData() {
    const currentAdmin = SmartStorage.getCurrentUser();
    const result = SmartStorage.loadDemoData();
    if (currentAdmin && currentAdmin.role === "admin") {
      SmartStorage.saveCurrentUser(currentAdmin);
    }
    renderDashboard();
    showDemoMessage(`${result.message} 后台已刷新：热门 OD、绿色积分、用户管理和月报相关数据均已写入 localStorage。`);
  }

  function handleClearDemoData() {
    const result = SmartStorage.clearDemoData();
    renderDashboard();
    showDemoMessage(result.message);
  }

  function bindEvents() {
    elements.loginBtn.addEventListener("click", () => {
      const result = SmartStorage.login(elements.username.value, elements.password.value);
      if (!result.ok || result.user.role !== "admin") {
        elements.message.textContent = result.ok ? "当前账号不是管理员。" : result.message;
        return;
      }
      enterDashboard();
    });

    elements.refreshBtn.addEventListener("click", renderDashboard);
    elements.loadDemoDataBtn.addEventListener("click", handleLoadDemoData);
    elements.clearDemoAdminDataBtn.addEventListener("click", handleClearDemoData);
    elements.routeForm.addEventListener("submit", saveRoute);
    elements.resetRouteFormBtn.addEventListener("click", clearRouteForm);
    elements.resetRoutesBtn.addEventListener("click", () => {
      saveManagedRoutes(cloneInitialRoutes());
      clearRouteForm();
      renderRoutes();
    });
    elements.routeTable.addEventListener("click", handleRouteTableClick);
    elements.managementTabs.addEventListener("click", (event) => {
      const tabButton = event.target.closest("[data-admin-tab]");
      if (tabButton) {
        switchManagementTab(tabButton.dataset.adminTab);
      }
    });
  }

  bindEvents();
  if (isAdmin()) {
    enterDashboard();
  }
}
