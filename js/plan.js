document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("plannerForm");
  const strategySelect = document.getElementById("strategySelect");
  const initialStrategy = strategySelect.value || "time";

  renderWeights(initialStrategy);
  renderRoutes(RouteAlgorithm.scoreRoutes(COMMUTE_DATA.routePlans.slice(0, 3), initialStrategy));

  strategySelect.addEventListener("change", () => renderWeights(strategySelect.value || "time"));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const start = document.getElementById("startInput").value.trim();
    const end = document.getElementById("endInput").value.trim();
    const message = document.getElementById("plannerMessage");

    if (!start || !end) {
      message.textContent = "请完整输入起点和终点。";
      message.className = "form-message error";
      return;
    }

    const plans = RouteAlgorithm.findCandidatePlans(start, end);
    const scoredPlans = RouteAlgorithm.scoreRoutes(plans, strategySelect.value || "time").slice(0, 3);
    renderRoutes(scoredPlans);
    saveSearchHistory(start, end, scoredPlans[0]);
    message.textContent = "已生成推荐路线，第一条为当前策略下综合得分最低方案。";
    message.className = "form-message success";
  });
});

function renderWeights(strategyKey) {
  const weights = COMMUTE_DATA.strategyWeights[strategyKey] || COMMUTE_DATA.strategyWeights.time;
  const box = document.getElementById("weightList");
  box.innerHTML = [
    ["时间", weights.time],
    ["换乘", weights.transfer],
    ["费用", weights.cost],
    ["碳排", weights.carbon],
    ["拥挤", weights.crowd]
  ]
    .map(([label, value]) => `<div class="weight-item"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
}

function renderRoutes(plans) {
  const box = document.getElementById("routeResults");
  box.innerHTML = plans.map((plan, index) => routeCard(plan, index)).join("");

  document.querySelectorAll("[data-favorite-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const plan = plans.find((item) => item.planId === button.dataset.favoritePlan);
      saveFavorite(plan);
    });
  });
}

function routeCard(plan, index) {
  const reduction = CarbonService.calculateReduction(plan).toFixed(2);
  const modes = plan.modes
    .map((mode) => `<span class="tag">${COMMUTE_DATA.modeLabels[mode] || mode}</span>`)
    .join("");

  return `
    <article class="route-card">
      <div class="route-card-header">
        <div>
          <span class="tag green">第 ${index + 1} 推荐 · ${plan.strategyLabel}</span>
          <h3>${plan.name}</h3>
        </div>
        <button class="btn ghost" type="button" data-favorite-plan="${plan.planId}">收藏路线</button>
      </div>
      <div class="route-modes">${modes}</div>
      <div class="route-metrics">
        <div class="metric"><span>总用时</span><strong>${plan.duration} 分钟</strong></div>
        <div class="metric"><span>换乘</span><strong>${plan.transferCount} 次</strong></div>
        <div class="metric"><span>费用</span><strong>${plan.cost} 元</strong></div>
        <div class="metric"><span>减排</span><strong>${reduction} kg</strong></div>
        <div class="metric"><span>评分</span><strong>${plan.score}</strong></div>
      </div>
      <p class="muted small">${plan.reason}</p>
    </article>
  `;
}

function saveSearchHistory(start, end, plan) {
  const user = StorageService.getCurrentUser();
  if (!user) return;
  StorageService.append(StorageService.keys.history, {
    historyId: `H${Date.now()}`,
    userId: user.userId,
    start,
    end,
    planId: plan.planId,
    planName: plan.name,
    queryTime: new Date().toLocaleString()
  });
  CarbonService.saveCarbonRecord(plan);
}

function saveFavorite(plan) {
  const user = StorageService.getCurrentUser();
  if (!user) {
    alert("请先登录后再收藏路线。");
    return;
  }
  StorageService.append(StorageService.keys.favorites, {
    favoriteId: `F${Date.now()}`,
    userId: user.userId,
    planId: plan.planId,
    planName: plan.name,
    createTime: new Date().toLocaleString()
  });
  alert("路线已加入收藏。");
}
