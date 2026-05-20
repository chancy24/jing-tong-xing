document.addEventListener("DOMContentLoaded", () => {
  renderList("favoriteList", StorageService.listForUser(StorageService.keys.favorites), "暂无收藏路线。请登录后在路线规划页点击收藏。");
  renderList("historyList", StorageService.listForUser(StorageService.keys.history), "暂无查询历史。请登录后完成一次路线规划。");
});

function renderList(id, records, emptyText) {
  const box = document.getElementById(id);
  if (records.length === 0) {
    box.innerHTML = `<p class="empty-state">${emptyText}</p>`;
    return;
  }

  box.innerHTML = records
    .map((record) => `
      <div class="record-item">
        <strong>${record.planName}</strong>
        <span>${record.queryTime || record.createTime || ""}</span>
      </div>
    `)
    .join("");
}

