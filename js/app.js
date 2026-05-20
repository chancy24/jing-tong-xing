document.addEventListener("DOMContentLoaded", () => {
  try {
    initApp();
  } catch (error) {
    console.error("系统初始化失败：", error);
    const errorBox = document.getElementById("appError");
    if (errorBox) {
      errorBox.textContent = "系统初始化出现问题，部分按钮可能暂时不可用。请打开控制台查看错误。";
      errorBox.style.display = "block";
    }
  }
});

function initApp() {
  const Data = window.SmartCommuteData || {};
  const Store = window.SmartStorage;
  const Planner = window.SmartRoutePlanner;

  if (!Store || !Planner) {
    throw new Error("核心脚本未正确加载：请检查 data.js、storage.js、routePlanner.js 的 script 顺序。");
  }

  Store.ensureSeedData();

  const $ = (id) => document.getElementById(id);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const on = (node, type, handler) => {
    if (node) {
      node.addEventListener(type, handler);
    } else {
      console.warn(`事件绑定跳过：${type} 的目标元素不存在。`);
    }
  };

  const el = {
    currentUserLabel: $("currentUserLabel"),
    homeUserName: $("homeUserName"),
    todayDate: $("todayDate"),
    todayRouteName: $("todayRouteName"),
    todayDepartTime: $("todayDepartTime"),
    todayArrivalTime: $("todayArrivalTime"),
    todayRiskTag: $("todayRiskTag"),
    todayStabilityScore: $("todayStabilityScore"),
    todayStabilityBar: $("todayStabilityBar"),
    todayRouteBadge: $("todayRouteBadge"),
    viewTodayPlanBtn: $("viewTodayPlanBtn"),
    homeReminderList: $("homeReminderList"),
    unreadCount: $("unreadCount"),
    openAuthModalBtn: $("openAuthModalBtn"),
    logoutBtn: $("logoutBtn"),
    authModal: $("authModal"),
    closeAuthModalBtn: $("closeAuthModalBtn"),
    usernameInput: $("usernameInput"),
    passwordInput: $("passwordInput"),
    loginBtn: $("loginBtn"),
    registerBtn: $("registerBtn"),
    authMessage: $("authMessage"),
    plannerForm: $("plannerForm"),
    startInput: $("startInput"),
    endInput: $("endInput"),
    strategySelect: $("strategySelect"),
    targetArrivalInput: $("targetArrivalInput"),
    routeResults: $("routeResults"),
    fixedCommuteForm: $("fixedCommuteForm"),
    fixedRouteNameInput: $("fixedRouteNameInput"),
    fixedStartInput: $("fixedStartInput"),
    fixedEndInput: $("fixedEndInput"),
    fixedDepartTimeInput: $("fixedDepartTimeInput"),
    fixedTargetArrivalInput: $("fixedTargetArrivalInput"),
    fixedUserTypeSelect: $("fixedUserTypeSelect"),
    fixedPreferenceSelect: $("fixedPreferenceSelect"),
    fixedCommuteMessage: $("fixedCommuteMessage"),
    fixedCommuteList: $("fixedCommuteList"),
    profileFixedCommuteList: $("profileFixedCommuteList"),
    lastMileRecommendations: $("lastMileRecommendations"),
    greenLevel: $("greenLevel"),
    greenPointTotal: $("greenPointTotal"),
    greenTripCount: $("greenTripCount"),
    carbonTotal: $("carbonTotal"),
    treeEquivalent: $("treeEquivalent"),
    greenProgressBar: $("greenProgressBar"),
    greenProgressText: $("greenProgressText"),
    greenRewardList: $("greenRewardList"),
    greenRankingList: $("greenRankingList"),
    generateMonthlyReportBtn: $("generateMonthlyReportBtn"),
    monthlyReportCard: $("monthlyReportCard"),
    messageList: $("messageList"),
    markAllReadBtn: $("markAllReadBtn"),
    profileUserName: $("profileUserName"),
    profileUserType: $("profileUserType"),
    profileGreenLevel: $("profileGreenLevel"),
    favoriteList: $("favoriteList"),
    historyList: $("historyList"),
    clearHistoryBtn: $("clearHistoryBtn"),
    homeAddressInput: $("homeAddressInput"),
    schoolAddressInput: $("schoolAddressInput"),
    internAddressInput: $("internAddressInput"),
    metroAddressInput: $("metroAddressInput"),
    saveAddressBtn: $("saveAddressBtn"),
    addressMessage: $("addressMessage"),
    enterDemoModeBtn: $("enterDemoModeBtn"),
    profileLoadDemoBtn: $("profileLoadDemoBtn"),
    clearDemoDataBtn: $("clearDemoDataBtn"),
    demoModeMessage: $("demoModeMessage"),
    homeDemoModeMessage: $("homeDemoModeMessage")
  };

  const strategyLabels = {
    stable: "稳定优先",
    time: "时间优先",
    transfer: "换乘少",
    green: "绿色优先",
    cost: "低成本优先"
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getDisplayName(user = Store.getCurrentUser()) {
    if (!user) return "张成学";
    return user.displayName || user.username || "张成学";
  }

  function getUserType(user = Store.getCurrentUser()) {
    if (!user) return "北京联合大学学生";
    return user.userType || (user.role === "admin" ? "管理员" : "北京联合大学学生");
  }

  function getRiskClass(risk) {
    const text = String(risk || "");
    if (text.includes("高")) return "high";
    if (text.includes("中")) return "medium";
    return "low";
  }

  function minutesOf(value) {
    const [h, m] = String(value || "08:00").split(":").map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : 8 * 60;
  }

  function formatMinutes(total) {
    const normalized = ((Math.round(total) % 1440) + 1440) % 1440;
    const h = Math.floor(normalized / 60);
    const m = normalized % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function routeById(routeId) {
    return (Data.routes || []).find((route) => route.id === routeId || route.routeId === routeId);
  }

  function getRouteName(route) {
    return route.routeName || route.name || `${route.origin || route.start} → ${route.destination || route.end}`;
  }

  function getRouteOrigin(route) {
    return route.origin || route.start || "";
  }

  function getRouteDestination(route) {
    return route.destination || route.end || "";
  }

  function getRouteTags(route, strategy, index = 0) {
    if (route.tags && route.tags.length) return route.tags.slice(0, 3);
    if (strategy === "stable") return ["最稳方案"];
    if (strategy === "time") return ["最快方案"];
    if (strategy === "green") return ["绿色推荐"];
    if (strategy === "cost") return ["低成本方案"];
    return index === 0 ? ["最优推荐"] : ["备选方案"];
  }

  function selectTab(tabName, options = {}) {
    const targetName = tabName || "home";
    $$("[data-page], .app-panel").forEach((panel) => {
      const pageName = panel.dataset.page || panel.dataset.tabPanel;
      panel.classList.toggle("active", pageName === targetName);
    });
    $$("[data-tab], .app-tab-link").forEach((button) => {
      const buttonTab = button.dataset.tab || button.dataset.tabTarget;
      button.classList.toggle("active", buttonTab === targetName);
    });
    if (!options.keepScroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (options.focus === "planner") $("plannerSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (options.focus === "fixed") $("fixedSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (options.focus === "last-mile") $("lastMileSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (options.focus === "report") $("monthlyReportSection")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function fillLocationSelects() {
    const options = (Data.locations || [])
      .map((location) => `<option value="${escapeHtml(location.name)}">${escapeHtml(location.name)} · ${escapeHtml(location.area)}</option>`)
      .join("");

    [el.startInput, el.endInput, el.fixedStartInput, el.fixedEndInput].forEach((select) => {
      if (select) select.innerHTML = `<option value="">请选择</option>${options}`;
    });
  }

  function openAuthModal(message = "课程原型演示账号：student / 123456。") {
    el.authMessage.textContent = message;
    el.authModal.classList.remove("hidden");
    el.authModal.setAttribute("aria-hidden", "false");
  }

  function closeAuthModal() {
    el.authModal.classList.add("hidden");
    el.authModal.setAttribute("aria-hidden", "true");
  }

  function renderUserState() {
    const user = Store.getCurrentUser();
    const displayName = getDisplayName(user);
    const greenData = Store.getGreenTravelData();
    const level = greenData.level || Store.getGreenLevel(greenData.greenPoints);

    el.currentUserLabel.textContent = user ? `欢迎，${displayName}` : "游客模式";
    el.homeUserName.textContent = displayName;
    el.profileUserName.textContent = displayName;
    el.profileUserType.textContent = getUserType(user);
    el.profileGreenLevel.textContent = `${level.name} · ${Math.round(greenData.greenPoints || 0)} 分`;
    el.openAuthModalBtn.classList.toggle("hidden", Boolean(user));
    el.logoutBtn.classList.toggle("hidden", !user);
  }

  function renderTodayDate() {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      weekday: "long"
    });
    el.todayDate.textContent = formatter.format(date);
  }

  function getDefaultFixedCommute() {
    const fixed = Store.getFixedCommutes()[0];
    return fixed || {
      fixedId: "DEFAULT_TODAY",
      routeName: "霍营 → 北京联合大学",
      start: "霍营",
      end: "北京联合大学",
      departTime: "07:05",
      targetArrivalTime: "08:00",
      userType: "北京联合大学学生",
      preference: "stable"
    };
  }

  function getBestPlanForCommute(commute) {
    const plans = Planner.planRoute(commute.start, commute.end, commute.preference || "stable");
    return plans[0] || null;
  }

  function renderTodayCommute() {
    const commute = getDefaultFixedCommute();
    const plan = getBestPlanForCommute(commute);
    const score = plan ? Planner.calculateStabilityScore(plan) : 86;
    const riskInfo = plan
      ? Planner.calculateArrivalRisk(plan, commute.targetArrivalTime || "08:00", commute.departTime || "07:05")
      : { level: "低风险", riskClass: "low" };
    const target = commute.targetArrivalTime || "08:00";
    const depart = riskInfo.latestDepartTime || commute.departTime || "07:05";
    const arrival = plan ? formatMinutes(minutesOf(depart) + Number(plan.duration || 46)) : "07:51";
    const tags = plan ? getRouteTags(plan, commute.preference, 0) : ["最稳方案"];

    el.todayRouteName.textContent = `${commute.start} → ${commute.end}`;
    el.todayDepartTime.textContent = depart;
    el.todayArrivalTime.textContent = arrival;
    el.todayRiskTag.textContent = riskInfo.level || `${riskInfo.risk || "低"}风险`;
    el.todayRiskTag.className = `risk-chip ${riskInfo.riskClass || getRiskClass(riskInfo.level)}`;
    el.todayStabilityScore.textContent = `${score} 分`;
    el.todayStabilityBar.style.width = `${Math.max(8, Math.min(100, score))}%`;
    el.todayRouteBadge.textContent = tags[0] || "最稳方案";
    el.todayRouteBadge.className = `route-badge ${badgeClass(tags[0])}`;

    if (plan) {
      el.viewTodayPlanBtn.onclick = () => {
        el.startInput.value = commute.start;
        el.endInput.value = commute.end;
        el.strategySelect.value = commute.preference || "stable";
        el.targetArrivalInput.value = target;
        selectTab("commute", { focus: "planner" });
        planAndRender(commute.start, commute.end, commute.preference || "stable", target, { saveHistory: false });
      };
    }
  }

  function badgeClass(label) {
    const text = String(label || "");
    if (text.includes("稳")) return "stable";
    if (text.includes("快")) return "time";
    if (text.includes("绿")) return "green";
    if (text.includes("成本") || text.includes("低")) return "cost";
    return "default";
  }

  function renderFixedCommutes() {
    const commutes = Store.getFixedCommutes();
    const cardHtml = commutes.length
      ? commutes.map((commute) => {
        const plan = getBestPlanForCommute(commute);
        const score = plan ? Planner.calculateStabilityScore(plan) : 75;
        const risk = plan
          ? Planner.calculateArrivalRisk(plan, commute.targetArrivalTime || "09:00", commute.departTime)
          : { level: "中风险", riskClass: "medium", latestDepartTime: commute.departTime || "--" };
        const tag = plan ? getRouteTags(plan, commute.preference, 0)[0] : "固定路线";
        return `
          <article class="fixed-card">
            <div>
              <strong>${escapeHtml(commute.routeName)}</strong>
              <span>${escapeHtml(commute.start)} → ${escapeHtml(commute.end)}</span>
            </div>
            <div class="mini-metrics">
              <span>${escapeHtml(commute.departTime || "--")} 出发</span>
              <span>${escapeHtml(strategyLabels[commute.preference] || commute.preference)}</span>
              <span class="risk-chip ${risk.riskClass}">${escapeHtml(risk.level)}</span>
              <span>${score} 分</span>
            </div>
            <p class="muted">今日建议 ${escapeHtml(risk.latestDepartTime || commute.departTime || "--")} 前出发 · ${escapeHtml(tag)}</p>
            <div class="button-row">
              <button class="mini-action use-fixed-commute-btn" type="button" data-action="use-commute" data-fixed-id="${escapeHtml(commute.fixedId)}">一键规划</button>
              <button class="mini-action danger delete-fixed-commute-btn" type="button" data-action="delete-commute" data-fixed-id="${escapeHtml(commute.fixedId)}">删除</button>
            </div>
          </article>
        `;
      }).join("")
      : `<article class="empty-state"><strong>暂无固定通勤</strong><span>可以创建“宿舍到学校”“家到公司”“学校到实习单位”等路线。</span></article>`;

    el.fixedCommuteList.innerHTML = cardHtml;
    el.profileFixedCommuteList.innerHTML = cardHtml;
  }

  function buildLastMileDetail(route) {
    const type = normalizeLastMileType(route.lastMileType);
    const mode = (Data.lastMileModes || []).find((item) => item.type === type) || {
      type,
      estimatedTime: "8-15 分钟",
      cost: "0 元",
      reliability: "中",
      scenario: "固定通勤末端接驳",
      weatherAffected: "中"
    };
    const distance = Number(route.walkingDistance || 0);
    const warning = distance >= 1.2 ? "最后一公里距离较长，建议选择共享单车或接驳车。" : "末端距离较短，可按天气和舒适度选择。";
    return { ...mode, distance, warning };
  }

  function normalizeLastMileType(value) {
    const text = String(value || "");
    if (text.includes("校园")) return "校园接驳车";
    if (text.includes("园区") || text.includes("班车")) return "园区班车";
    if (text.includes("单车") || text.includes("骑行")) return "共享单车";
    if (text.includes("公交")) return "公交短驳";
    return "步行";
  }

  function renderRouteCards(plans, strategy, targetArrivalTime) {
    el.routeResults.innerHTML = plans.map((route, index) => {
      const saving = Planner.calculateCarbonSaving(route);
      const stability = Planner.calculateStabilityScore(route);
      const risk = Planner.calculateArrivalRisk(route, targetArrivalTime, "");
      const lastMile = buildLastMileDetail(route);
      const tags = getRouteTags(route, strategy, index);
      const reason = Planner.getRecommendationReason
        ? Planner.getRecommendationReason(route, strategy)
        : route.reason || route.recommendReason || "该方案综合通勤时间、费用、稳定性和绿色出行表现生成。";
      const steps = (route.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("");

      return `
        <article class="route-card">
          <div class="card-header-row">
            <span class="section-kicker">第 ${index + 1} 推荐</span>
            <span class="risk-chip ${risk.riskClass}">${escapeHtml(risk.level)}</span>
          </div>
          <h2>${escapeHtml(getRouteName(route))}</h2>
          <div class="route-tag-row">
            ${tags.map((tag) => `<span class="route-badge ${badgeClass(tag)}">${escapeHtml(tag)}</span>`).join("")}
          </div>
          <div class="mode-chain">${(route.modes || []).map((mode) => `<span>${escapeHtml(mode)}</span>`).join("<i>→</i>")}</div>
          <div class="route-stat-grid">
            <div><span>总用时</span><strong>${escapeHtml(route.duration)} 分钟</strong></div>
            <div><span>费用</span><strong>${escapeHtml(route.cost)} 元</strong></div>
            <div><span>换乘</span><strong>${escapeHtml(route.transferCount ?? route.transfers)} 次</strong></div>
            <div><span>稳定性</span><strong>${stability} 分</strong></div>
            <div><span>碳减排</span><strong>${saving.toFixed(2)} kg</strong></div>
            <div><span>舒适度</span><strong>${escapeHtml(route.comfortScore ?? route.comfort)}/5</strong></div>
          </div>
          <div class="risk-alert ${risk.riskClass}">
            <strong>迟到风险预警：${escapeHtml(risk.level)}</strong>
            <span>${escapeHtml(risk.advice)}。</span>
          </div>
          <div class="last-mile-mini">
            <strong>最后一公里：${escapeHtml(lastMile.type)}</strong>
            <span>${escapeHtml(lastMile.estimatedTime)} · ${escapeHtml(lastMile.cost)} · 可靠性${escapeHtml(lastMile.reliability)}</span>
            <p>${escapeHtml(lastMile.warning)}</p>
          </div>
          <p class="route-reason">${escapeHtml(reason)}</p>
          <details class="route-detail">
            <summary>展开查看详细步骤</summary>
            <ol>${steps}</ol>
          </details>
          <div class="button-row">
            <button class="app-primary-btn select-route-btn" type="button" data-action="select-route" data-route-id="${escapeHtml(route.id)}">选择此路线</button>
            <button class="app-secondary-btn favorite-btn" type="button" data-action="favorite-route" data-route-id="${escapeHtml(route.id)}">收藏</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function renderEmptyRoute(title, text) {
    el.routeResults.innerHTML = `<article class="empty-state"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span></article>`;
  }

  function planAndRender(start, end, strategy, targetArrivalTime, options = {}) {
    if (!start || !end) {
      renderEmptyRoute("请完整选择起点和终点", "系统会根据你的通勤偏好推荐 2-3 条方案。");
      return [];
    }
    if (start === end) {
      renderEmptyRoute("起点和终点不能相同", "请选择两个不同地点。");
      return [];
    }

    const plans = Planner.planRoute(start, end, strategy);
    if (!plans.length) {
      renderEmptyRoute("暂无匹配路线", "当前模拟数据暂未覆盖该 OD，可尝试霍营、北京联合大学、回龙观、西二旗、国贸等地点。");
      return [];
    }

    renderRouteCards(plans, strategy, targetArrivalTime);
    if (options.saveHistory !== false) {
      const saving = Planner.calculateCarbonSaving(plans[0]);
      Store.saveHistoryRecord(plans[0], strategy, saving);
      renderRecords();
    }
    return plans;
  }

  function renderLastMileRecommendations() {
    el.lastMileRecommendations.innerHTML = (Data.lastMileRecommendations || []).map((item) => `
      <article class="last-mile-card">
        <div class="card-header-row">
          <strong>${escapeHtml(item.station)} → ${escapeHtml(item.target)}</strong>
          <span class="route-badge stable">${escapeHtml(item.recommendedType)}</span>
        </div>
        <div class="mini-metrics">
          <span>${escapeHtml(item.estimatedTime)}</span>
          <span>${escapeHtml(item.cost)}</span>
          <span>可靠性${escapeHtml(item.reliability)}</span>
          <span>天气影响${escapeHtml(item.weatherAffected)}</span>
        </div>
        <p>${escapeHtml(item.note)}</p>
      </article>
    `).join("");
  }

  function renderGreenStats() {
    const greenData = Store.getGreenTravelData();
    const points = Number(greenData.greenPoints || 0);
    const level = greenData.level || Store.getGreenLevel(points);
    const totalCarbon = Number(greenData.totalCarbonReduction || 0);
    const treeCount = totalCarbon / 18;
    const remain = Math.max(Number(level.nextPoints || 0) - points, 0);

    el.greenLevel.textContent = level.name;
    el.greenPointTotal.textContent = `${Math.round(points)} 分`;
    el.greenTripCount.textContent = `${greenData.tripCount || 0} 次`;
    el.carbonTotal.textContent = `${totalCarbon.toFixed(2)} kg`;
    el.treeEquivalent.textContent = `${treeCount.toFixed(1)} 棵`;
    el.greenProgressBar.style.width = `${Math.max(4, Math.min(100, level.progress || 0))}%`;
    el.greenProgressText.textContent = remain > 0 ? `距离“${level.nextName}”还差 ${Math.ceil(remain)} 分` : `已达到当前最高等级：${level.name}`;

    const rewards = Data.greenRewards || [];
    el.greenRewardList.innerHTML = rewards.map((reward) => {
      const canUse = points >= Number(reward.points || 0);
      return `
        <article class="reward-card ${canUse ? "available" : ""}">
          <strong>${escapeHtml(reward.name)}</strong>
          <span>${escapeHtml(reward.points)} 分</span>
          <p>${escapeHtml(reward.description)}</p>
        <button class="mini-action reward-btn" type="button" data-action="exchange-reward" ${canUse ? "" : "disabled"}>${canUse ? "兑换" : "未解锁"}</button>
        </article>
      `;
    }).join("");

    const ranking = [
      { name: "李明", points: 1420, level: "低碳先锋" },
      { name: "王雨", points: 980, level: "黄金通勤者" },
      { name: getDisplayName(), points: Math.max(points, 620), level: level.name, current: true },
      { name: "陈晨", points: 410, level: "白银通勤者" }
    ].sort((a, b) => b.points - a.points);

    el.greenRankingList.innerHTML = ranking.map((item, index) => `
      <div class="rank-item ${item.current ? "current" : ""}">
        <span>${index + 1}</span>
        <strong>${escapeHtml(item.name)}</strong>
        <em>${escapeHtml(item.level)} · ${Math.round(item.points)} 分</em>
      </div>
    `).join("");
  }

  function buildMonthlyReport() {
    const history = Store.getHistoryRecords();
    const favorites = Store.getFavorites();
    const green = Store.getGreenTravelData();
    const records = [...history, ...favorites, ...green.records];
    const routes = records.map((record) => routeById(record.planId)).filter(Boolean);
    const tripCount = green.tripCount || history.length || favorites.length;
    const totalDuration = routes.reduce((sum, route) => sum + Number(route.duration || 0), 0);
    const avgDuration = tripCount ? totalDuration / tripCount : 0;
    const routeCount = {};

    records.forEach((record) => {
      const key = `${record.start || ""} → ${record.end || ""}`;
      if (key.trim() !== "→") routeCount[key] = (routeCount[key] || 0) + 1;
    });

    const commonRoute = Object.entries(routeCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "暂无";
    const stableRoute = routes.sort((a, b) => Planner.calculateStabilityScore(b) - Planner.calculateStabilityScore(a))[0];
    const crowdedRoute = [...routes].sort((a, b) => Number(b.congestionLevel || b.crowdedLevel || 0) - Number(a.congestionLevel || a.crowdedLevel || 0))[0];

    return {
      empty: records.length === 0,
      tripCount,
      totalDuration,
      avgDuration,
      commonRoute,
      totalCarbon: Number(green.totalCarbonReduction || 0),
      points: Number(green.greenPoints || 0),
      stableRoute,
      crowdedRoute
    };
  }

  function renderMonthlyReport() {
    const report = buildMonthlyReport();
    if (report.empty) {
      el.monthlyReportCard.innerHTML = `
        <article class="empty-state">
          <strong>本月暂无可生成的数据</strong>
          <span>先完成一次路线规划，或在“我的”页加载演示数据。</span>
        </article>
      `;
      return;
    }

    const suggestion = report.avgDuration > 55
      ? "本月平均通勤时间偏长，建议优先使用稳定优先并适当错峰。"
      : "本月通勤状态较稳定，可继续保持固定路线和低碳出行习惯。";

    el.monthlyReportCard.innerHTML = `
      <article class="report-card">
        <h3>本月你完成了 ${report.tripCount} 次绿色通勤</h3>
        <p>累计减少碳排放 ${report.totalCarbon.toFixed(2)} kg，相当于种下 ${(report.totalCarbon / 18).toFixed(1)} 棵树。</p>
        <div class="route-stat-grid">
          <div><span>总通勤时长</span><strong>${Math.round(report.totalDuration)} 分钟</strong></div>
          <div><span>平均时长</span><strong>${Math.round(report.avgDuration)} 分钟</strong></div>
          <div><span>常用路线</span><strong>${escapeHtml(report.commonRoute)}</strong></div>
          <div><span>绿色积分</span><strong>${Math.round(report.points)} 分</strong></div>
          <div><span>最稳定路线</span><strong>${escapeHtml(report.stableRoute ? getRouteName(report.stableRoute) : "暂无")}</strong></div>
          <div><span>最拥挤路线</span><strong>${escapeHtml(report.crowdedRoute ? getRouteName(report.crowdedRoute) : "暂无")}</strong></div>
        </div>
        <div class="risk-alert low"><strong>本月优化建议</strong><span>${escapeHtml(suggestion)}</span></div>
      </article>
    `;
    Store.saveMonthlyReport?.(report);
    renderMessages();
  }

  function renderRecords() {
    const favorites = Store.getFavorites();
    el.favoriteList.innerHTML = favorites.length ? favorites.map((item) => `
      <article class="record-row">
        <div>
          <strong>${escapeHtml(item.routeName)}</strong>
          <span>${escapeHtml(item.start)} → ${escapeHtml(item.end)} · ${escapeHtml(item.duration)} 分钟</span>
        </div>
        <button class="mini-action danger delete-favorite-btn" type="button" data-action="delete-favorite" data-favorite-id="${escapeHtml(item.favoriteId || item.planId)}">删除</button>
      </article>
    `).join("") : `<article class="empty-state"><strong>暂无收藏</strong><span>登录后可以收藏高频通勤路线。</span></article>`;

    const history = Store.getHistoryRecords().slice(0, 5);
    el.historyList.innerHTML = history.length ? history.map((item) => `
      <article class="record-row">
        <div>
          <strong>${escapeHtml(item.start)} → ${escapeHtml(item.end)}</strong>
          <span>${escapeHtml(strategyLabels[item.strategy] || item.strategy)} · ${escapeHtml(item.queryTime)}</span>
        </div>
        <button class="mini-action reuse-history-btn" type="button" data-action="reuse-history" data-start="${escapeHtml(item.start)}" data-end="${escapeHtml(item.end)}" data-strategy="${escapeHtml(item.strategy || "stable")}">复用</button>
      </article>
    `).join("") : `<article class="empty-state"><strong>暂无历史</strong><span>路线规划后会保存在这里。</span></article>`;
  }

  function getMessages() {
    if (Store.getMessages) return Store.getMessages();
    return Data.messages || [];
  }

  function renderMessages() {
    const messages = getMessages();
    const unread = messages.filter((item) => !item.read).length;
    el.unreadCount.textContent = `${unread} 条未读`;

    const messageHtml = messages.map((item) => `
      <article class="message-card ${item.read ? "read" : "unread"}">
        <div class="card-header-row">
          <span class="route-badge ${messageBadgeClass(item.type)}">${escapeHtml(item.type)}</span>
          <small>${escapeHtml(item.time)}</small>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.content)}</p>
        <button class="mini-action read-message-btn" type="button" data-action="read-message" data-message-id="${escapeHtml(item.id)}">${item.read ? "已读" : "标为已读"}</button>
      </article>
    `).join("");

    el.messageList.innerHTML = messageHtml || `<article class="empty-state"><strong>暂无消息</strong><span>加载演示数据后可查看风险、拥挤、积分和月报提醒。</span></article>`;
    el.homeReminderList.innerHTML = messages.slice(0, 4).map((item) => `
      <article class="home-reminder ${item.read ? "" : "unread"}">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.content)}</span>
      </article>
    `).join("");
  }

  function messageBadgeClass(type) {
    const text = String(type || "");
    if (text.includes("风险")) return "cost";
    if (text.includes("积分")) return "green";
    if (text.includes("拥挤")) return "time";
    return "stable";
  }

  function renderAddresses() {
    const addresses = Store.getAddresses?.() || {};
    if (addresses.home) el.homeAddressInput.value = addresses.home;
    if (addresses.school) el.schoolAddressInput.value = addresses.school;
    if (addresses.intern) el.internAddressInput.value = addresses.intern;
    if (addresses.metro) el.metroAddressInput.value = addresses.metro;
  }

  function saveAddresses() {
    const addresses = {
      home: el.homeAddressInput.value,
      school: el.schoolAddressInput.value,
      intern: el.internAddressInput.value,
      metro: el.metroAddressInput.value
    };
    Store.saveAddresses?.(addresses);
    el.addressMessage.textContent = "常用地址已保存到本地。";
  }

  function setDemoMessage(message, isError = false) {
    [el.demoModeMessage, el.homeDemoModeMessage].filter(Boolean).forEach((node) => {
      node.textContent = message;
      node.classList.toggle("error", isError);
    });
  }

  function loadDemoMode() {
    const result = Store.loadDemoData();
    el.startInput.value = "霍营";
    el.endInput.value = "北京联合大学";
    el.strategySelect.value = "stable";
    el.targetArrivalInput.value = "08:00";
    refreshAll();
    planAndRender("霍营", "北京联合大学", "stable", "08:00", { saveHistory: false });
    renderMonthlyReport();
    selectTab("home");
    setDemoMessage(`${result.message} 已生成固定通勤、历史、收藏、绿色积分、月报、消息和后台 OD 数据。`);
  }

  function clearDemoMode() {
    const result = Store.clearDemoData();
    refreshAll();
    renderEmptyRoute("演示数据已清除", "可以重新加载演示模式，或手动进行路线规划。");
    el.monthlyReportCard.innerHTML = `<article class="empty-state"><strong>演示月报已清除</strong><span>重新加载演示数据后会自动生成。</span></article>`;
    setDemoMessage(result.message);
  }

  function refreshAll() {
    renderUserState();
    renderTodayDate();
    renderTodayCommute();
    renderFixedCommutes();
    renderLastMileRecommendations();
    renderGreenStats();
    renderRecords();
    renderMessages();
    renderAddresses();
  }

  function bindEvents() {
    $$(".app-tab-link").forEach((button) => {
      button.addEventListener("click", () => selectTab(button.dataset.tab || button.dataset.tabTarget || "home"));
    });

    $$("[data-go-tab]").forEach((button) => {
      button.addEventListener("click", () => selectTab(button.dataset.goTab, { focus: button.dataset.focus }));
    });

    on(el.openAuthModalBtn, "click", () => openAuthModal());
    on(el.closeAuthModalBtn, "click", closeAuthModal);
    on(el.authModal, "click", (event) => {
      if (event.target === el.authModal) closeAuthModal();
    });

    on(el.loginBtn, "click", () => {
      const result = Store.loginUser(el.usernameInput.value, el.passwordInput.value);
      el.authMessage.textContent = result.message;
      if (result.ok) {
        closeAuthModal();
        refreshAll();
      }
    });

    on(el.registerBtn, "click", () => {
      const result = Store.registerUser(el.usernameInput.value, el.passwordInput.value);
      el.authMessage.textContent = result.message;
      if (result.ok) {
        closeAuthModal();
        refreshAll();
      }
    });

    on(el.logoutBtn, "click", () => {
      Store.logout();
      refreshAll();
    });

    on(el.fixedCommuteForm, "submit", (event) => {
      event.preventDefault();
      const result = Store.saveFixedCommuteRoute({
        routeName: el.fixedRouteNameInput.value,
        start: el.fixedStartInput.value,
        end: el.fixedEndInput.value,
        departTime: el.fixedDepartTimeInput.value,
        targetArrivalTime: el.fixedTargetArrivalInput.value,
        userType: el.fixedUserTypeSelect.value,
        preference: el.fixedPreferenceSelect.value
      });
      el.fixedCommuteMessage.textContent = result.message;
      el.fixedCommuteMessage.className = `form-message ${result.ok ? "success" : "error"}`;
      if (result.ok) {
        el.fixedCommuteForm.reset();
        el.fixedDepartTimeInput.value = "07:05";
        el.fixedTargetArrivalInput.value = "08:00";
        el.fixedPreferenceSelect.value = "stable";
        refreshAll();
      }
    });

    document.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-action]");
      const action = actionButton?.dataset.action || "";

      if (action === "load-demo") {
        loadDemoMode();
        return;
      }
      if (action === "clear-demo") {
        clearDemoMode();
        return;
      }
      if (action === "generate-report") {
        renderMonthlyReport();
        return;
      }
      if (action === "mark-all-read") {
        Store.markAllMessagesRead?.();
        renderMessages();
        return;
      }
      if (action === "save-address") {
        saveAddresses();
        return;
      }
      if (action === "clear-history") {
        Store.clearHistoryRecords?.();
        renderRecords();
        return;
      }
      if (action === "exchange-reward") {
        event.preventDefault();
        actionButton.textContent = "已模拟兑换";
        actionButton.disabled = true;
        return;
      }

      const useFixed = action === "use-commute" ? actionButton : event.target.closest(".use-fixed-commute-btn");
      const deleteFixed = action === "delete-commute" ? actionButton : event.target.closest(".delete-fixed-commute-btn");
      const deleteFavorite = action === "delete-favorite" ? actionButton : event.target.closest(".delete-favorite-btn");
      const reuseHistory = action === "reuse-history" ? actionButton : event.target.closest(".reuse-history-btn");
      const selectRoute = action === "select-route" ? actionButton : event.target.closest(".select-route-btn");
      const favoriteRoute = action === "favorite-route" ? actionButton : event.target.closest(".favorite-btn");
      const readMessage = action === "read-message" ? actionButton : event.target.closest(".read-message-btn");

      if (useFixed) {
        const commute = Store.getFixedCommutes().find((item) => item.fixedId === useFixed.dataset.fixedId);
        if (commute) {
          el.startInput.value = commute.start;
          el.endInput.value = commute.end;
          el.strategySelect.value = commute.preference || "stable";
          el.targetArrivalInput.value = commute.targetArrivalTime || "08:00";
          selectTab("commute", { focus: "planner" });
          planAndRender(commute.start, commute.end, commute.preference || "stable", commute.targetArrivalTime || "08:00");
        }
      }

      if (deleteFixed) {
        const result = Store.deleteFixedCommuteRoute(deleteFixed.dataset.fixedId);
        el.fixedCommuteMessage.textContent = result.message;
        refreshAll();
      }

      if (deleteFavorite) {
        const result = Store.deleteFavoriteRoute(deleteFavorite.dataset.favoriteId);
        if (!result.ok) openAuthModal(result.message);
        refreshAll();
      }

      if (reuseHistory) {
        el.startInput.value = reuseHistory.dataset.start || "";
        el.endInput.value = reuseHistory.dataset.end || "";
        el.strategySelect.value = reuseHistory.dataset.strategy || "stable";
        selectTab("commute", { focus: "planner" });
      }

      if (selectRoute || favoriteRoute) {
        const route = routeById((selectRoute || favoriteRoute).dataset.routeId);
        if (!route) return;

        const saving = Planner.calculateCarbonSaving(route);
        if (favoriteRoute) {
          const result = Store.saveFavoriteRoute(route);
          if (!result.ok) {
            openAuthModal("请先登录");
            return;
          }
          if (result.created) Store.saveGreenTravelData(route, saving, "favorite");
          favoriteRoute.textContent = "已收藏";
          favoriteRoute.disabled = true;
        }

        if (selectRoute) {
          const record = Store.saveGreenTravelData(route, saving, "selected");
          selectRoute.textContent = `已累计 +${Math.round(record.greenPoints || 0)}分`;
          selectRoute.disabled = true;
        }

        refreshAll();
      }

      if (readMessage) {
        Store.markMessageRead?.(readMessage.dataset.messageId);
        renderMessages();
      }
    });

    on(el.plannerForm, "submit", (event) => {
      event.preventDefault();
      planAndRender(el.startInput.value, el.endInput.value, el.strategySelect.value, el.targetArrivalInput.value);
    });

  }

  function init() {
    fillLocationSelects();
    refreshAll();
    bindEvents();
  }

  init();
}
