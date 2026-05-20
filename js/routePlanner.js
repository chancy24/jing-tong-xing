const SmartRoutePlanner = (() => {
  // 五种出行策略的权重配置。
  // time/transfer/green/cost 保留原有课程原型逻辑，stable 新增通勤稳定性维度。
  const strategyWeights = {
    time: {
      duration: 0.5,
      transfers: 0.2,
      carbon: 0.2,
      cost: 0.1
    },
    transfer: {
      transfers: 0.5,
      duration: 0.3,
      cost: 0.1,
      carbon: 0.1
    },
    green: {
      carbon: 0.5,
      duration: 0.2,
      transfers: 0.2,
      cost: 0.1
    },
    cost: {
      cost: 0.5,
      duration: 0.2,
      transfers: 0.2,
      carbon: 0.1
    },
    stable: {
      stability: 0.7,
      duration: 0.1,
      transfers: 0.1,
      cost: 0.05,
      carbon: 0.05
    }
  };

  const strategyNames = {
    time: "时间优先",
    stable: "稳定优先",
    transfer: "换乘少",
    green: "绿色优先",
    cost: "费用最低"
  };

  const weatherImpactScores = {
    "低": 100,
    "较低": 85,
    "中": 65,
    "较高": 45,
    "高": 30
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function safeRoute(route) {
    return route && typeof route === "object" ? route : {};
  }

  function getDuration(route) {
    route = safeRoute(route);
    return toNumber(route.duration, 0);
  }

  // 从路线对象中统一读取换乘次数，兼容 data.js 中的 transfers 和 transferCount 字段。
  function getTransfers(route) {
    route = safeRoute(route);
    return toNumber(route.transfers ?? route.transferCount, 0);
  }

  function getCost(route) {
    route = safeRoute(route);
    return toNumber(route.cost, 0);
  }

  function getCarbonEmission(route) {
    route = safeRoute(route);
    return toNumber(route.carbonEmission ?? route.carbon, 0);
  }

  function getPunctualityRate(route) {
    route = safeRoute(route);
    const raw = toNumber(route.punctualityRate, 0.8);
    return clamp(raw <= 1 ? raw * 100 : raw, 0, 100);
  }

  function getCongestionLevel(route) {
    route = safeRoute(route);
    return clamp(toNumber(route.congestionLevel ?? route.crowdedLevel, 3), 1, 5);
  }

  function getWalkingDistance(route) {
    route = safeRoute(route);
    return toNumber(route.walkingDistance, 0);
  }

  function getWeatherScore(route) {
    route = safeRoute(route);
    const impact = String(route.weatherImpact || "中");
    return weatherImpactScores[impact] ?? 60;
  }

  function getLastMileScore(route) {
    route = safeRoute(route);
    const lastMileType = String(route.lastMileType || "");

    if (lastMileType.includes("班车")) {
      return 100;
    }
    if (lastMileType.includes("地铁")) {
      return 90;
    }
    if (lastMileType.includes("步行")) {
      return 85;
    }
    if (lastMileType.includes("共享单车") || lastMileType.includes("骑行")) {
      return 80;
    }
    if (lastMileType.includes("跨城")) {
      return 60;
    }
    if (lastMileType.includes("公交")) {
      return 70;
    }
    return 55;
  }

  // 将“越低越好”的指标换算为 0-100 分。
  function scoreLowerIsBetter(value, bestValue, worstValue) {
    const cleanValue = toNumber(value, bestValue);
    if (cleanValue <= bestValue) {
      return 100;
    }
    if (cleanValue >= worstValue) {
      return 0;
    }
    return ((worstValue - cleanValue) / (worstValue - bestValue)) * 100;
  }

  function getStabilityScoreDetail(route) {
    return {
      punctuality: getPunctualityRate(route),
      congestion: scoreLowerIsBetter(getCongestionLevel(route), 1, 5),
      transfers: scoreLowerIsBetter(getTransfers(route), 0, 4),
      walking: scoreLowerIsBetter(getWalkingDistance(route), 0.3, 3),
      weather: getWeatherScore(route),
      lastMile: getLastMileScore(route),
      duration: scoreLowerIsBetter(getDuration(route), 35, 90),
      cost: scoreLowerIsBetter(getCost(route), 4, 16),
      carbon: scoreLowerIsBetter(getCarbonEmission(route), 0.8, 4)
    };
  }

  // 通勤稳定性评分：输出 0-100 分。
  // 准点率、拥挤程度、换乘风险、步行距离、天气影响和最后一公里接驳是固定通勤稳定性的核心。
  function calculateStabilityScore(route) {
    const detail = getStabilityScoreDetail(route);
    const score = detail.punctuality * 0.28
      + detail.congestion * 0.14
      + detail.transfers * 0.12
      + detail.walking * 0.1
      + detail.weather * 0.1
      + detail.lastMile * 0.1
      + detail.duration * 0.06
      + detail.cost * 0.04
      + detail.carbon * 0.06;

    return Math.round(clamp(score, 0, 100));
  }

  function calculateLateRisk(route, targetArrivalOrStabilityScore = calculateStabilityScore(route)) {
    route = safeRoute(route);
    if (typeof targetArrivalOrStabilityScore === "string") {
      return calculateArrivalRisk(route, targetArrivalOrStabilityScore).level;
    }

    const stabilityScore = Number.isFinite(Number(targetArrivalOrStabilityScore))
      ? Number(targetArrivalOrStabilityScore)
      : calculateStabilityScore(route);
    const status = String(route.status || "");
    const punctualityRate = getPunctualityRate(route);
    const congestionLevel = getCongestionLevel(route);
    const weatherScore = getWeatherScore(route);

    if (status === "停运" || status === "延误") {
      return "高";
    }
    if (stabilityScore >= 85 && punctualityRate >= 86 && congestionLevel <= 3) {
      return "低";
    }
    if (stabilityScore >= 72 && weatherScore >= 60 && congestionLevel <= 4) {
      return "中";
    }
    return "高";
  }

  function timeToMinutes(value) {
    const [hour, minute] = String(value || "").split(":").map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
      return null;
    }
    return hour * 60 + minute;
  }

  function formatMinutes(totalMinutes) {
    const minutesInDay = 24 * 60;
    const normalized = ((Math.round(totalMinutes) % minutesInDay) + minutesInDay) % minutesInDay;
    const hour = Math.floor(normalized / 60);
    const minute = normalized % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  function getStatusRiskPenalty(route) {
    const status = String(route.status || "");
    if (status === "停运") {
      return 45;
    }
    if (status === "延误") {
      return 25;
    }
    if (status === "拥挤") {
      return 12;
    }
    return 0;
  }

  function buildRiskLevel(score) {
    if (score >= 60) {
      return { risk: "高", level: "高风险", riskClass: "high" };
    }
    if (score >= 32) {
      return { risk: "中", level: "中风险", riskClass: "medium" };
    }
    return { risk: "低", level: "低风险", riskClass: "low" };
  }

  // 迟到风险预警算法：
  // 1. 用拥挤度、历史准点率、天气影响、换乘次数和实时状态估算“波动风险”；
  // 2. 根据目标到达时间倒推建议最晚出发时间；
  // 3. 如果用户提供了计划出发时间，再判断“计划到达 + 缓冲”是否会超过目标时间。
  // 课程原型阶段不接入真实天气和路况 API，所有指标来自 data.js 的模拟数据。
  function calculateArrivalRisk(route, targetArrivalTime = "09:00", plannedDepartTime = "") {
    route = safeRoute(route);
    const duration = getDuration(route);
    const congestionLevel = getCongestionLevel(route);
    const punctualityRate = getPunctualityRate(route);
    const transferCount = getTransfers(route);
    const weatherScore = getWeatherScore(route);
    const targetMinutes = timeToMinutes(targetArrivalTime);
    const departMinutes = timeToMinutes(plannedDepartTime);

    const congestionPenalty = (congestionLevel - 1) * 8;
    const punctualityPenalty = (100 - punctualityRate) * 0.45;
    const weatherPenalty = weatherScore >= 85 ? 0 : weatherScore >= 60 ? 8 : 16;
    const transferPenalty = Math.min(transferCount * 5, 18);
    const statusPenalty = getStatusRiskPenalty(route);

    let riskScore = congestionPenalty
      + punctualityPenalty
      + weatherPenalty
      + transferPenalty
      + statusPenalty;

    let bufferMinutes = 5;
    if (congestionLevel >= 4) {
      bufferMinutes += 5;
    }
    if (punctualityRate < 82) {
      bufferMinutes += 5;
    }
    if (weatherScore < 60 || transferCount >= 2 || statusPenalty >= 20) {
      bufferMinutes += 5;
    }
    bufferMinutes = clamp(bufferMinutes, 5, 25);

    let estimatedArrivalTime = "";
    let latestDepartTime = "";
    let isPlannedDepartTooLate = false;
    let isBufferTight = false;
    if (targetMinutes !== null) {
      latestDepartTime = formatMinutes(targetMinutes - duration - bufferMinutes);
    }
    if (departMinutes !== null) {
      const estimatedArrivalMinutes = departMinutes + duration;
      estimatedArrivalTime = formatMinutes(estimatedArrivalMinutes);
      if (targetMinutes !== null && estimatedArrivalMinutes > targetMinutes) {
        riskScore += 50;
        isPlannedDepartTooLate = true;
      } else if (targetMinutes !== null && estimatedArrivalMinutes + bufferMinutes > targetMinutes) {
        riskScore += 25;
        isBufferTight = true;
      }
    }

    const level = buildRiskLevel(clamp(riskScore, 0, 100));
    const advice = [];
    advice.push(`建议提前 ${bufferMinutes} 分钟出发`);
    if (latestDepartTime) {
      advice.push(`最晚建议 ${latestDepartTime} 出发`);
    }
    if (isPlannedDepartTooLate && latestDepartTime) {
      advice.push(`当前计划出发偏晚，请改为 ${latestDepartTime} 前出发`);
    } else if (isBufferTight) {
      advice.push("当前出发时间余量不足，请预留更大缓冲");
    }
    if (congestionLevel >= 4 || statusPenalty >= 20) {
      advice.push("当前路线拥挤度较高，建议选择更稳定路线");
    }
    if (punctualityRate < 80) {
      advice.push("该路线历史准点率偏低，请预留更大缓冲");
    }

    return {
      ...level,
      riskScore: Math.round(clamp(riskScore, 0, 100)),
      bufferMinutes,
      targetArrivalTime,
      estimatedArrivalTime,
      latestDepartTime,
      advice: advice.join("；")
    };
  }

  // 归一化为“越高越好”的分数。
  // duration/transfers/carbon/cost 都是越低越好，所以使用 1 - minMax 值。
  function normalizeLowerIsBetter(value, min, max) {
    if (max === min) {
      return 1;
    }
    return 1 - (value - min) / (max - min);
  }

  function buildRange(values) {
    const cleanValues = values.map((value) => Number(value)).filter(Number.isFinite);
    if (!cleanValues.length) {
      return { min: 0, max: 0 };
    }
    return {
      min: Math.min(...cleanValues),
      max: Math.max(...cleanValues)
    };
  }

  function buildRanges(plans) {
    return {
      duration: buildRange(plans.map(getDuration)),
      transfers: buildRange(plans.map(getTransfers)),
      carbon: buildRange(plans.map(getCarbonEmission)),
      cost: buildRange(plans.map(getCost))
    };
  }

  function buildScoreDetail(plan, ranges) {
    const stabilityScore = calculateStabilityScore(plan);
    return {
      duration: normalizeLowerIsBetter(getDuration(plan), ranges.duration.min, ranges.duration.max),
      transfers: normalizeLowerIsBetter(getTransfers(plan), ranges.transfers.min, ranges.transfers.max),
      carbon: normalizeLowerIsBetter(getCarbonEmission(plan), ranges.carbon.min, ranges.carbon.max),
      cost: normalizeLowerIsBetter(getCost(plan), ranges.cost.min, ranges.cost.max),
      stability: stabilityScore / 100
    };
  }

  // 根据策略进行加权评分。最终 score 越高，说明路线越符合当前策略。
  function calculateScore(plan, ranges, strategy) {
    const weights = strategyWeights[strategy] || strategyWeights.time;
    const detail = buildScoreDetail(plan, ranges);
    const score = Object.entries(weights).reduce((sum, [field, weight]) => {
      return sum + (detail[field] || 0) * weight;
    }, 0);

    return {
      score,
      detail
    };
  }

  function buildStableReason(plan, ranges) {
    const highlights = [];
    const punctualityRate = getPunctualityRate(plan);
    const congestionLevel = getCongestionLevel(plan);
    const transferCount = getTransfers(plan);
    const walkingDistance = getWalkingDistance(plan);
    const stabilityScore = calculateStabilityScore(plan);
    const lateRisk = calculateLateRisk(plan, stabilityScore);
    const isLongerThanFastest = getDuration(plan) > ranges.duration.min + 5;
    const durationLead = isLongerThanFastest ? "该路线虽然用时略长" : "该路线通勤时间和稳定性较均衡";
    const conjunction = isLongerThanFastest ? "但" : "并且";

    if (punctualityRate >= 88) {
      highlights.push("历史准点率高");
    }
    if (congestionLevel <= 3) {
      highlights.push("拥挤程度可控");
    }
    if (transferCount <= 1) {
      highlights.push("换乘风险低");
    }
    if (walkingDistance <= 1.2) {
      highlights.push("步行距离短");
    }
    if (getWeatherScore(plan) >= 85) {
      highlights.push("受天气影响小");
    }
    if (getLastMileScore(plan) >= 85) {
      highlights.push("最后一公里接驳可靠");
    }

    const reasonText = highlights.length ? highlights.join("、") : "整体波动较小";
    return `${durationLead}，${conjunction}${reasonText}，稳定性评分 ${stabilityScore} 分，迟到风险${lateRisk}，适合早高峰稳定通勤。`;
  }

  function buildRecommendReason(plan, strategy, ranges) {
    if (strategy === "stable") {
      return buildStableReason(plan, ranges);
    }

    const stabilityScore = calculateStabilityScore(plan);
    const lateRisk = calculateLateRisk(plan, stabilityScore);
    const reasons = {
      time: `该路线总用时约 ${getDuration(plan)} 分钟，适合早高峰赶时间通勤。`,
      transfer: `该路线换乘 ${getTransfers(plan)} 次，换乘压力较小，适合携带行李或低频出行用户。`,
      green: `该路线碳排放约 ${getCarbonEmission(plan).toFixed(2)} kg，公共交通和慢行接驳占比较高。`,
      cost: `该路线费用约 ${getCost(plan)} 元，适合学生和低预算通勤场景。`
    };

    return `${reasons[strategy] || reasons.time} 稳定性评分 ${stabilityScore} 分，迟到风险${lateRisk}。`;
  }

  function getRecommendationReason(route, strategy = "stable") {
    const ranges = buildRanges([route]);
    return buildRecommendReason(route, strategy, ranges);
  }

  function scorePlans(plans, strategy) {
    const ranges = buildRanges(plans);

    return plans
      .map((plan) => {
        const stabilityScore = calculateStabilityScore(plan);
        const lateRisk = calculateLateRisk(plan, stabilityScore);
        const enrichedPlan = {
          ...plan,
          transfers: getTransfers(plan),
          transferCount: getTransfers(plan),
          carbon: getCarbonEmission(plan),
          carbonEmission: getCarbonEmission(plan),
          stabilityScore,
          lateRisk
        };
        const { score, detail } = calculateScore(enrichedPlan, ranges, strategy);
        const recommendReason = buildRecommendReason(enrichedPlan, strategy, ranges);

        return {
          ...enrichedPlan,
          score,
          scoreDetail: {
            ...detail,
            stabilityDetail: getStabilityScoreDetail(enrichedPlan)
          },
          recommendReason,
          reason: `${recommendReason}${plan.reason ? ` ${plan.reason}` : ""}`
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        if (b.stabilityScore !== a.stabilityScore) {
          return b.stabilityScore - a.stabilityScore;
        }
        return getDuration(a) - getDuration(b);
      });
  }

  // 第一步：严格筛选起点和终点均匹配的路线。
  // 如果没有完全匹配路线，交给 app.js 显示友好提示。
  function findCandidateRoutes(start, end) {
    const cleanStart = String(start || "").trim();
    const cleanEnd = String(end || "").trim();
    if (!cleanStart || !cleanEnd || cleanStart === cleanEnd) {
      return [];
    }
    const allRoutes = SmartCommuteData.routes || SmartCommuteData.routePlans || [];
    return allRoutes.filter((plan) => {
      const routeStart = String(plan.start ?? plan.origin ?? "").trim();
      const routeEnd = String(plan.end ?? plan.destination ?? "").trim();
      return routeStart === cleanStart && routeEnd === cleanEnd;
    });
  }

  function planRoute(start, end, strategy) {
    const candidates = findCandidateRoutes(start, end);
    if (candidates.length === 0) {
      return [];
    }

    return scorePlans(candidates, strategy).slice(0, 3);
  }

  // 对外推荐接口：兼容课程报告中的 origin/destination 命名。
  // 返回结果会附加迟到风险对象和推荐理由，便于页面直接渲染。
  function planRoutes(origin, destination, strategy = "stable", targetArrivalTime = "09:00") {
    return planRoute(origin, destination, strategy).map((route) => ({
      ...route,
      arrivalRisk: calculateArrivalRisk(route, targetArrivalTime),
      recommendationReason: getRecommendationReason(route, strategy)
    }));
  }

  // 绿色出行统计：用“全程私家车排放”减去“实际多方式组合排放”。
  function calculateCarbonSaving(plan) {
    plan = safeRoute(plan);
    const carbonFactors = {
      car: 0.192,
      "公交": 0.082,
      "地铁": 0.045,
      "步行": 0,
      "共享单车": 0,
      "骑行": 0,
      "校园接驳车": 0.045,
      "园区班车": 0.045,
      "公交短驳": 0.082
    };
    const carEmission = Number(plan.distance) * carbonFactors.car;
    const lowCarbonEmission = (plan.segments || []).reduce((sum, segment) => {
      const factor = carbonFactors[segment.mode] ?? carbonFactors.car;
      return sum + Number(segment.distance) * factor;
    }, 0);

    return Math.max(carEmission - lowCarbonEmission, 0);
  }

  function calculateGreenPoints(plan) {
    plan = safeRoute(plan);
    const carbonSaving = calculateCarbonSaving(plan);
    const modePoints = (plan.segments || []).reduce((sum, segment) => {
      const mode = String(segment.mode || "");
      const distance = Number(segment.distance || 0);
      if (mode === "步行" || mode === "骑行" || mode === "共享单车") {
        return sum + distance * 5;
      }
      if (mode === "地铁") {
        return sum + distance * 3;
      }
      if (mode === "公交" || mode === "公交短驳" || mode === "校园接驳车" || mode === "园区班车") {
        return sum + distance * 2;
      }
      return sum;
    }, 0);

    return Math.max(Math.round(modePoints + carbonSaving * 10), 0);
  }

  function strategyLabel(strategy) {
    return strategyNames[strategy] || strategyNames.time;
  }

  return {
    planRoute,
    planRoutes,
    calculateCarbonSaving,
    calculateStabilityScore,
    calculateLateRisk,
    calculateArrivalRisk,
    getRecommendationReason,
    calculateGreenPoints,
    strategyLabel
  };
})();

window.SmartRoutePlanner = SmartRoutePlanner;
