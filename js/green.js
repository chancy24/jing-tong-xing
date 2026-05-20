document.addEventListener("DOMContentLoaded", () => {
  const summary = CarbonService.getUserSummary();
  document.getElementById("totalCarbon").textContent = `${summary.totalCarbon.toFixed(2)} kg`;
  document.getElementById("greenScore").textContent = summary.score;
  document.getElementById("greenLevel").textContent = summary.level;
  document.getElementById("greenTripCount").textContent = `${summary.records.length} 次`;

  const list = document.getElementById("greenRecords");
  if (summary.records.length === 0) {
    list.innerHTML = '<p class="empty-state">暂无绿色出行记录。登录后完成一次路线规划即可生成统计。</p>';
    return;
  }

  list.innerHTML = summary.records
    .slice(0, 8)
    .map((record) => `
      <div class="record-item">
        <strong>${record.planName}</strong>
        <span>${record.createTime} · 里程 ${record.distance} km · 减排 ${record.reduceCO2} kg · 积分 ${record.score}</span>
      </div>
    `)
    .join("");
});

