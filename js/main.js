document.addEventListener("DOMContentLoaded", () => {
  AuthService.renderNavUser();

  if (document.body.dataset.page === "home") {
    const users = StorageService.getUsers().filter((user) => user.role !== "admin");
    const planCount = document.getElementById("homePlanCount");
    const lineCount = document.getElementById("homeLineCount");
    const userCount = document.getElementById("homeUserCount");
    if (planCount) planCount.textContent = COMMUTE_DATA.routePlans.length;
    if (lineCount) lineCount.textContent = COMMUTE_DATA.lines.length;
    if (userCount) userCount.textContent = users.length;
  }
});

