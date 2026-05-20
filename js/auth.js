const AuthService = {
  register({ username, password, phone, homeAddress }) {
    const users = StorageService.getUsers();
    if (!username || !password) {
      return { ok: false, message: "用户名和密码不能为空。" };
    }
    if (password.length < 4) {
      return { ok: false, message: "密码至少需要 4 位。" };
    }
    if (users.some((user) => user.username === username)) {
      return { ok: false, message: "用户名已存在，请更换。" };
    }

    const newUser = {
      userId: `U${Date.now()}`,
      username,
      password,
      phone: phone || "",
      homeAddress: homeAddress || "",
      role: "user"
    };
    users.push(newUser);
    StorageService.saveUsers(users);
    return { ok: true, message: "注册成功，可以登录系统。", user: newUser };
  },

  login(username, password) {
    const user = StorageService.getUsers().find((item) => item.username === username && item.password === password);
    if (!user) {
      return { ok: false, message: "账号或密码错误。" };
    }
    StorageService.setCurrentUser(user.userId);
    return { ok: true, message: "登录成功。", user };
  },

  logout() {
    StorageService.clearCurrentUser();
    window.location.href = "index.html";
  },

  renderNavUser() {
    const box = document.getElementById("navUser");
    if (!box) return;

    const user = StorageService.getCurrentUser();
    if (!user) {
      box.innerHTML = '<a class="btn ghost" href="login.html">登录 / 注册</a>';
      return;
    }

    box.innerHTML = `
      <span class="tag green">${user.role === "admin" ? "管理员" : "用户"}：${user.username}</span>
      <button class="btn text" type="button" id="logoutBtn">退出</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", () => this.logout());
  }
};

