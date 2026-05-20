const RouteAlgorithm = {
  normalize(value, min, max) {
    if (max === min) return 0;
    return (value - min) / (max - min);
  },

  scoreRoutes(plans, strategyKey) {
    const weights = COMMUTE_DATA.strategyWeights[strategyKey] || COMMUTE_DATA.strategyWeights.time;
    const ranges = {
      duration: this.getRange(plans, "duration"),
      transferCount: this.getRange(plans, "transferCount"),
      cost: this.getRange(plans, "cost"),
      carbon: this.getRange(plans, "carbon"),
      crowdedLevel: this.getRange(plans, "crowdedLevel")
    };

    return plans
      .map((plan) => {
        const score =
          weights.time * this.normalize(plan.duration, ranges.duration.min, ranges.duration.max) +
          weights.transfer * this.normalize(plan.transferCount, ranges.transferCount.min, ranges.transferCount.max) +
          weights.cost * this.normalize(plan.cost, ranges.cost.min, ranges.cost.max) +
          weights.carbon * this.normalize(plan.carbon, ranges.carbon.min, ranges.carbon.max) +
          weights.crowd * this.normalize(plan.crowdedLevel, ranges.crowdedLevel.min, ranges.crowdedLevel.max);
        return { ...plan, score: Number(score.toFixed(3)), strategyLabel: weights.label };
      })
      .sort((a, b) => a.score - b.score);
  },

  getRange(plans, field) {
    const values = plans.map((plan) => plan[field]);
    return { min: Math.min(...values), max: Math.max(...values) };
  },

  findCandidatePlans(start, end) {
    const startText = start.trim();
    const endText = end.trim();
    const exact = COMMUTE_DATA.routePlans.filter((plan) => plan.start.includes(startText) && plan.end.includes(endText));
    if (exact.length > 0) return exact;
    return COMMUTE_DATA.routePlans.slice(0, 3);
  }
};

