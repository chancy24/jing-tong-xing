const CarbonService = {
  calculateReduction(plan) {
    const carEmission = plan.distance * COMMUTE_DATA.emissionFactors.car;
    const actualEmission = plan.segments.reduce((sum, segment) => {
      const factor = COMMUTE_DATA.emissionFactors[segment.mode] || 0;
      return sum + segment.distance * factor;
    }, 0);
    return Math.max(0, carEmission - actualEmission);
  },

  scoreFromReduction(reduction) {
    return Math.round(reduction * 10);
  },

  levelFromScore(score) {
    if (score >= 300) return "都市圈绿色先锋";
    if (score >= 120) return "低碳达人";
    return "绿色通勤新手";
  },

  saveCarbonRecord(plan) {
    const user = StorageService.getCurrentUser();
    if (!user) return;
    const reduction = this.calculateReduction(plan);
    StorageService.append(StorageService.keys.carbonRecords, {
      recordId: `C${Date.now()}`,
      userId: user.userId,
      planId: plan.planId,
      planName: plan.name,
      distance: plan.distance,
      reduceCO2: Number(reduction.toFixed(2)),
      score: this.scoreFromReduction(reduction),
      createTime: new Date().toLocaleString()
    });
  },

  getUserSummary() {
    const records = StorageService.listForUser(StorageService.keys.carbonRecords);
    const totalCarbon = records.reduce((sum, record) => sum + Number(record.reduceCO2 || 0), 0);
    const score = records.reduce((sum, record) => sum + Number(record.score || 0), 0);
    return {
      records,
      totalCarbon: Number(totalCarbon.toFixed(2)),
      score,
      level: this.levelFromScore(score)
    };
  }
};

