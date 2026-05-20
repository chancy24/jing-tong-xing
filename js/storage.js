const SmartStorage = (() => {
  const STORAGE_KEYS = {
    users: "smart_commute_users",
    currentUser: "smart_commute_current_user",
    favorites: "smart_commute_favorites",
    fixedCommutes: "smart_commute_fixed_commutes",
    history: "smart_commute_history",
    carbonRecords: "smart_commute_carbon_records",
    legacyCarbon: "smart_commute_carbon",
    messages: "smart_commute_messages",
    monthlyReports: "smart_commute_monthly_reports",
    addresses: "smart_commute_addresses",
    backendStats: "smart_commute_backend_stats",
    demoMode: "smart_commute_demo_mode"
  };

  const DEMO_USER_ID = "U_DEMO_STUDENT";

  function safeRead(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (error) {
      console.warn(`读取 localStorage 失败：${key}`, error);
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`写入 localStorage 失败：${key}`, error);
      return false;
    }
  }

  function removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`删除 localStorage 失败：${key}`, error);
    }
  }

  function ensureArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getDefaultUsers() {
    return Array.isArray(SmartCommuteData?.users) ? SmartCommuteData.users : [];
  }

  function isDemoRecord(item) {
    return Boolean(item && (item.demo === true || item.userId === DEMO_USER_ID || item.id === DEMO_USER_ID));
  }

  function getRouteById(routeId) {
    return (SmartCommuteData.routes || []).find((route) => route.id === routeId) || null;
  }

  function getDefaultMessages(userId = getCurrentUserId()) {
    if (Array.isArray(SmartCommuteData.messages) && SmartCommuteData.messages.length) {
      return SmartCommuteData.messages.map((item) => ({ ...item, userId: item.userId || userId }));
    }

    return [
      {
        id: "MSG_DEFAULT_001",
        userId,
        type: "风险提醒",
        title: "今日迟到风险较低",
        time: "07:00",
        content: "你常走的“霍营—北京联合大学”路线整体稳定，建议 07:05 前出发。",
        read: false
      },
      {
        id: "MSG_DEFAULT_002",
        userId,
        type: "线路拥挤",
        title: "13 号线早高峰客流较大",
        time: "07:15",
        content: "霍营进站客流略高，建议预留 5 分钟安检和进站时间。",
        read: false
      },
      {
        id: "MSG_DEFAULT_003",
        userId,
        type: "接驳提醒",
        title: "校园接驳车运行正常",
        time: "07:20",
        content: "地铁站到北京联合大学建议选择校园接驳车，雨天比共享单车更稳定。",
        read: true
      }
    ];
  }

  function calculateDemoCarbonSaving(plan) {
    if (!plan) {
      return 0;
    }
    if (Number.isFinite(Number(plan.carbonReduction))) {
      return Number(plan.carbonReduction);
    }
    const factors = SmartCommuteData.carbonFactors || {};
    const carFactor = Number(factors.car || 0.192);
    const carEmission = Number(plan.distance || 0) * carFactor;
    const actualEmission = ensureArray(plan.segments).reduce((sum, segment) => {
      const factor = Number(factors[segment.mode] ?? carFactor);
      return sum + Number(segment.distance || 0) * factor;
    }, 0);
    return Number(Math.max(carEmission - actualEmission, 0).toFixed(2));
  }

  function demoDate(dayOffset, hour = 7, minute = 20) {
    const now = new Date();
    const day = Math.max(1, now.getDate() - dayOffset);
    return new Date(now.getFullYear(), now.getMonth(), day, hour, minute).toISOString();
  }

  function clearDemoData() {
    const users = getUsers().filter((user) => !isDemoRecord(user));
    const favorites = getAllFavorites().filter((item) => !isDemoRecord(item));
    const fixedCommutes = getAllFixedCommutes().filter((item) => !isDemoRecord(item));
    const history = getAllHistory().filter((item) => !isDemoRecord(item));
    const carbonRecords = getAllCarbonRecords().filter((item) => !isDemoRecord(item));
    const messages = getAllMessages().filter((item) => !isDemoRecord(item));
    const monthlyReports = getAllMonthlyReports().filter((item) => !isDemoRecord(item));
    const currentUser = getCurrentUser();
    const addresses = getAllAddresses();
    delete addresses[DEMO_USER_ID];

    safeWrite(STORAGE_KEYS.users, users);
    safeWrite(STORAGE_KEYS.favorites, favorites);
    safeWrite(STORAGE_KEYS.fixedCommutes, fixedCommutes);
    safeWrite(STORAGE_KEYS.history, history);
    safeWrite(STORAGE_KEYS.carbonRecords, carbonRecords);
    safeWrite(STORAGE_KEYS.legacyCarbon, carbonRecords);
    safeWrite(STORAGE_KEYS.messages, messages);
    safeWrite(STORAGE_KEYS.monthlyReports, monthlyReports);
    safeWrite(STORAGE_KEYS.addresses, addresses);
    removeItem(STORAGE_KEYS.backendStats);
    removeItem(STORAGE_KEYS.demoMode);
    if (currentUser && currentUser.id === DEMO_USER_ID) {
      removeItem(STORAGE_KEYS.currentUser);
    }

    return { ok: true, message: "演示数据已清除。" };
  }

  function loadDemoData() {
    ensureSeedData();
    clearDemoData();
    ensureSeedData();

    const demoUser = {
      id: DEMO_USER_ID,
      username: "张成学",
      displayName: "张成学",
      password: "123456",
      role: "user",
      userType: "北京联合大学学生",
      createTime: demoDate(18, 9, 0),
      demo: true
    };

    const users = getUsers();
    users.unshift(demoUser);
    safeWrite(STORAGE_KEYS.users, users);
    saveCurrentUser(demoUser);

    const fixedCommute = {
      fixedId: "FC_DEMO_HOYING_BUU",
      userId: DEMO_USER_ID,
      routeName: "早八：霍营到北京联合大学",
      start: "霍营",
      end: "北京联合大学",
      departTime: "07:05",
      targetArrivalTime: "08:00",
      userType: "北京联合大学学生",
      preference: "stable",
      createTime: demoDate(16, 19, 30),
      updateTime: demoDate(0, 7, 0),
      demo: true
    };

    const demoRouteIds = ["R024", "R024", "R025", "R024", "R026", "R024", "R025", "R001", "R013", "R005"];
    const strategies = ["stable", "stable", "time", "stable", "cost", "green", "time", "stable", "green", "green"];
    const demoHistory = demoRouteIds.map((routeId, index) => {
      const route = getRouteById(routeId) || getRouteById("R024");
      return {
        historyId: `H_DEMO_${String(index + 1).padStart(2, "0")}`,
        userId: DEMO_USER_ID,
        planId: route.id,
        routeName: route.name,
        start: route.start,
        end: route.end,
        strategy: strategies[index] || "stable",
        carbonSaving: calculateDemoCarbonSaving(route),
        queryTime: demoDate(index, 7 + (index % 2), index % 2 ? 42 : 18),
        demo: true
      };
    });

    const greenRouteIds = ["R024", "R024", "R025", "R024", "R001", "R013", "R005", "R024"];
    const demoCarbonRecords = greenRouteIds.map((routeId, index) => {
      const route = getRouteById(routeId) || getRouteById("R024");
      const saving = calculateDemoCarbonSaving(route);
      const greenPoints = calculateGreenPoints(route, saving);
      return {
        recordId: `C_DEMO_${String(index + 1).padStart(2, "0")}`,
        userId: DEMO_USER_ID,
        planId: route.id,
        routeName: route.name,
        start: route.start,
        end: route.end,
        distance: Number(route.distance) || 0,
        reduceCO2: saving,
        greenPoints,
        score: greenPoints,
        source: index % 3 === 0 ? "selected" : "favorite",
        createTime: demoDate(index, 8, 5),
        demo: true
      };
    });

    const demoFavorites = [getRouteById("R024"), getRouteById("R013"), getRouteById("R005")]
      .filter(Boolean)
      .map((route, index) => ({
        favoriteId: `F_DEMO_${String(index + 1).padStart(2, "0")}`,
        userId: DEMO_USER_ID,
        planId: route.id,
        routeName: route.name,
        start: route.start,
        end: route.end,
        modes: route.modes,
        duration: route.duration,
        cost: route.cost,
        createTime: demoDate(index + 2, 20, 10),
        demo: true
      }));

    const demoMessages = [
      {
        id: "MSG_DEMO_001",
        userId: DEMO_USER_ID,
        type: "风险提醒",
        title: "今日迟到风险较低",
        time: "07:00",
        content: "“霍营—北京联合大学”最稳方案稳定性 90 分，建议 07:05 前出发。",
        read: false,
        demo: true
      },
      {
        id: "MSG_DEMO_002",
        userId: DEMO_USER_ID,
        type: "线路拥挤",
        title: "13 号线早高峰进站客流较大",
        time: "07:12",
        content: "霍营站客流上升，建议预留 5 分钟安检和进站时间。",
        read: false,
        demo: true
      },
      {
        id: "MSG_DEMO_003",
        userId: DEMO_USER_ID,
        type: "接驳短板",
        title: "雨天建议使用校园接驳车",
        time: "07:20",
        content: "最后一公里距离较长，雨天共享单车可靠性下降，推荐校园接驳车。",
        read: false,
        demo: true
      },
      {
        id: "MSG_DEMO_004",
        userId: DEMO_USER_ID,
        type: "积分到账",
        title: "绿色积分已到账",
        time: "08:05",
        content: "本次绿色通勤预计减少碳排放 2.71kg，获得 94 绿色积分。",
        read: true,
        demo: true
      },
      {
        id: "MSG_DEMO_005",
        userId: DEMO_USER_ID,
        type: "月报提醒",
        title: "5 月通勤月报可生成",
        time: "18:30",
        content: "系统已根据历史查询、收藏路线和绿色积分生成本月通勤总结。",
        read: false,
        demo: true
      },
      {
        id: "MSG_DEMO_006",
        userId: DEMO_USER_ID,
        type: "系统公告",
        title: "京通行课程原型升级完成",
        time: "昨天",
        content: "用户端已升级为首页、通勤、绿色、消息、我的五个 App Tab。",
        read: true,
        demo: true
      }
    ];

    const demoMonthlyReport = {
      reportId: "MR_DEMO_202605",
      userId: DEMO_USER_ID,
      month: "2026-05",
      tripCount: 18,
      totalDuration: 842,
      avgDuration: 47,
      mostCommonRoute: "霍营 → 北京联合大学",
      carbonReduction: 12.6,
      greenPoints: 860,
      mostStableRoute: "霍营至北京联合大学早八稳定通勤线",
      mostCongestedRoute: "霍营至北京联合大学最快到校方案",
      suggestion: "建议继续使用稳定优先方案，并在雨天选择校园接驳车。",
      createTime: new Date().toISOString(),
      demo: true
    };

    const demoBackendStats = {
      demo: true,
      loadedAt: new Date().toISOString(),
      odTop: [
        { origin: "霍营", destination: "北京联合大学", count: 10 },
        { origin: "北京联合大学", destination: "国贸", count: 6 },
        { origin: "北京站", destination: "北京联合大学", count: 4 }
      ],
      note: "演示模式生成的后台 OD 模拟统计。"
    };

    const mergedFixedCommutes = [fixedCommute, ...getAllFixedCommutes()];
    const mergedHistory = [...demoHistory, ...getAllHistory()].slice(0, 100);
    const mergedCarbonRecords = [...demoCarbonRecords, ...getAllCarbonRecords()];
    const mergedFavorites = [...demoFavorites, ...getAllFavorites()];
    const mergedMessages = [...demoMessages, ...getAllMessages()];
    const mergedMonthlyReports = [demoMonthlyReport, ...getAllMonthlyReports()];

    safeWrite(STORAGE_KEYS.fixedCommutes, mergedFixedCommutes);
    safeWrite(STORAGE_KEYS.history, mergedHistory);
    safeWrite(STORAGE_KEYS.carbonRecords, mergedCarbonRecords);
    safeWrite(STORAGE_KEYS.legacyCarbon, mergedCarbonRecords);
    safeWrite(STORAGE_KEYS.favorites, mergedFavorites);
    safeWrite(STORAGE_KEYS.messages, mergedMessages);
    safeWrite(STORAGE_KEYS.monthlyReports, mergedMonthlyReports);
    safeWrite(STORAGE_KEYS.addresses, {
      ...getAllAddresses(),
      [DEMO_USER_ID]: {
        home: "霍营",
        school: "北京联合大学",
        intern: "国贸",
        metro: "霍营站"
      }
    });
    safeWrite(STORAGE_KEYS.backendStats, demoBackendStats);
    safeWrite(STORAGE_KEYS.demoMode, {
      active: true,
      userId: DEMO_USER_ID,
      loadedAt: new Date().toISOString(),
      scenario: "北京联合大学学生早八通勤演示"
    });

    return {
      ok: true,
      message: "演示模式已加载：北京联合大学学生早八通勤场景。",
      user: demoUser,
      fixedCommute,
      historyCount: demoHistory.length,
      greenRecordCount: demoCarbonRecords.length
    };
  }

  function ensureSeedData() {
    if (!localStorage.getItem(STORAGE_KEYS.users)) {
      safeWrite(STORAGE_KEYS.users, getDefaultUsers());
    } else {
      const users = getUsers();
      const mergedUsers = [...users];
      getDefaultUsers().forEach((defaultUser) => {
        const exists = mergedUsers.some((user) => user.username === defaultUser.username || user.id === defaultUser.id);
        if (!exists) {
          mergedUsers.push(defaultUser);
        }
      });
      if (mergedUsers.length !== users.length) {
        safeWrite(STORAGE_KEYS.users, mergedUsers);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.favorites)) {
      safeWrite(STORAGE_KEYS.favorites, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.fixedCommutes)) {
      safeWrite(STORAGE_KEYS.fixedCommutes, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.history)) {
      safeWrite(STORAGE_KEYS.history, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.carbonRecords)) {
      const legacyCarbon = ensureArray(safeRead(STORAGE_KEYS.legacyCarbon, []));
      safeWrite(STORAGE_KEYS.carbonRecords, legacyCarbon);
    }
    if (!localStorage.getItem(STORAGE_KEYS.messages)) {
      safeWrite(STORAGE_KEYS.messages, getDefaultMessages());
    }
    if (!localStorage.getItem(STORAGE_KEYS.monthlyReports)) {
      safeWrite(STORAGE_KEYS.monthlyReports, []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.addresses)) {
      safeWrite(STORAGE_KEYS.addresses, {});
    }
  }

  function getUsers() {
    return ensureArray(safeRead(STORAGE_KEYS.users, []));
  }

  function saveUsers(users) {
    return safeWrite(STORAGE_KEYS.users, ensureArray(users));
  }

  function saveCurrentUser(user) {
    if (!user) {
      removeItem(STORAGE_KEYS.currentUser);
      return;
    }
    safeWrite(STORAGE_KEYS.currentUser, user);
  }

  function getCurrentUser() {
    return safeRead(STORAGE_KEYS.currentUser, null);
  }

  function registerUser(username, password) {
    const cleanName = String(username || "").trim();
    const cleanPassword = String(password || "");

    if (!cleanName || !cleanPassword) {
      return { ok: false, message: "用户名和密码不能为空。" };
    }

    const users = getUsers();
    const exists = users.some((user) => user.username === cleanName);
    if (exists) {
      return { ok: false, message: "用户名已存在，请更换。" };
    }

    const user = {
      id: `U${Date.now()}`,
      username: cleanName,
      password: cleanPassword,
      role: "user",
      createTime: new Date().toLocaleString()
    };

    users.push(user);
    saveUsers(users);
    saveCurrentUser(user);
    return { ok: true, message: "注册成功，已自动登录。", user };
  }

  function loginUser(username, password) {
    const cleanName = String(username || "").trim();
    const cleanPassword = String(password || "");
    const user = getUsers().find((item) => item.username === cleanName && item.password === cleanPassword);

    if (!user) {
      return { ok: false, message: "账号或密码错误。" };
    }

    saveCurrentUser(user);
    return { ok: true, message: "登录成功。", user };
  }

  function logout() {
    removeItem(STORAGE_KEYS.currentUser);
  }

  function getCurrentUserId() {
    const user = getCurrentUser();
    return user ? user.id : "guest";
  }

  function getAllFavorites() {
    return ensureArray(safeRead(STORAGE_KEYS.favorites, []));
  }

  function getFavorites() {
    const user = getCurrentUser();
    if (!user) {
      return [];
    }
    return getAllFavorites().filter((item) => item.userId === user.id);
  }

  function saveFavoriteRoute(plan) {
    const user = getCurrentUser();
    if (!user) {
      return { ok: false, message: "请先登录" };
    }

    const favorites = getAllFavorites();
    const exists = favorites.some((item) => item.userId === user.id && item.planId === plan.id);
    if (exists) {
      return { ok: true, created: false, message: "该路线已在收藏列表中。" };
    }

    const favorite = {
      favoriteId: `F${Date.now()}`,
      userId: user.id,
      planId: plan.id,
      routeName: plan.name,
      start: plan.start,
      end: plan.end,
      modes: plan.modes,
      duration: plan.duration,
      cost: plan.cost,
      createTime: new Date().toLocaleString()
    };

    favorites.unshift(favorite);
    safeWrite(STORAGE_KEYS.favorites, favorites);
    return { ok: true, created: true, message: "路线已加入收藏。", favorite };
  }

  function deleteFavoriteRoute(favoriteIdOrPlanId) {
    const user = getCurrentUser();
    if (!user) {
      return { ok: false, message: "请先登录后再删除收藏。" };
    }

    const before = getAllFavorites();
    const after = before.filter((item) => {
      const isCurrentUser = item.userId === user.id;
      const isTarget = item.favoriteId === favoriteIdOrPlanId || item.planId === favoriteIdOrPlanId;
      return !(isCurrentUser && isTarget);
    });

    safeWrite(STORAGE_KEYS.favorites, after);
    return {
      ok: before.length !== after.length,
      message: before.length !== after.length ? "收藏路线已删除。" : "未找到要删除的收藏路线。"
    };
  }

  function getAllHistory() {
    return ensureArray(safeRead(STORAGE_KEYS.history, []));
  }

  function getAllFixedCommutes() {
    return ensureArray(safeRead(STORAGE_KEYS.fixedCommutes, []));
  }

  function getFixedCommutes() {
    const currentUserId = getCurrentUserId();
    return getAllFixedCommutes().filter((item) => item.userId === currentUserId);
  }

  function saveFixedCommuteRoute(commute) {
    const routeName = String(commute.routeName || "").trim();
    const start = String(commute.start || "").trim();
    const end = String(commute.end || "").trim();
    const departTime = String(commute.departTime || "").trim();
    const targetArrivalTime = String(commute.targetArrivalTime || "09:00").trim();
    const userType = String(commute.userType || "").trim();
    const preference = String(commute.preference || "time").trim();

    if (!routeName || !start || !end || !departTime || !userType) {
      return { ok: false, message: "请完整填写固定通勤路线信息。" };
    }

    if (start === end) {
      return { ok: false, message: "固定通勤的起点和终点不能相同。" };
    }

    const fixedCommutes = getAllFixedCommutes();
    const record = {
      fixedId: commute.fixedId || `FC${Date.now()}`,
      userId: getCurrentUserId(),
      routeName,
      start,
      end,
      departTime,
      targetArrivalTime,
      userType,
      preference,
      createTime: commute.createTime || new Date().toLocaleString(),
      updateTime: new Date().toLocaleString()
    };

    const index = fixedCommutes.findIndex((item) => item.fixedId === record.fixedId && item.userId === record.userId);
    if (index >= 0) {
      fixedCommutes[index] = record;
    } else {
      fixedCommutes.unshift(record);
    }
    safeWrite(STORAGE_KEYS.fixedCommutes, fixedCommutes);
    return { ok: true, message: "固定通勤路线已保存。", commute: record };
  }

  function deleteFixedCommuteRoute(fixedId) {
    const currentUserId = getCurrentUserId();
    const before = getAllFixedCommutes();
    const after = before.filter((item) => !(item.fixedId === fixedId && item.userId === currentUserId));
    safeWrite(STORAGE_KEYS.fixedCommutes, after);
    return {
      ok: before.length !== after.length,
      message: before.length !== after.length ? "固定通勤路线已删除。" : "未找到要删除的固定通勤路线。"
    };
  }

  function saveHistoryRecord(plan, strategy, carbonSaving = 0) {
    const history = getAllHistory();
    const record = {
      historyId: `H${Date.now()}`,
      userId: getCurrentUserId(),
      planId: plan.id,
      routeName: plan.name,
      start: plan.start,
      end: plan.end,
      strategy,
      carbonSaving: Number(carbonSaving) || 0,
      queryTime: new Date().toLocaleString()
    };

    history.unshift(record);
    safeWrite(STORAGE_KEYS.history, history.slice(0, 100));
    return record;
  }

  function getHistoryRecords() {
    const currentUserId = getCurrentUserId();
    return getAllHistory().filter((item) => item.userId === currentUserId);
  }

  function getAllCarbonRecords() {
    return ensureArray(safeRead(STORAGE_KEYS.carbonRecords, []));
  }

  function getSegmentPointRate(mode) {
    if (mode === "步行" || mode === "骑行" || mode === "共享单车") {
      return 5;
    }
    if (mode === "地铁") {
      return 3;
    }
    if (mode === "公交" || mode === "公交短驳" || mode === "园区班车" || mode === "校园接驳车") {
      return 2;
    }
    return 0;
  }

  // 绿色积分账户算法：
  // 慢行每公里 5 分，地铁每公里 3 分，公交/班车每公里 2 分；
  // 保留原有碳减排公式，并按每减少 1kg CO2 额外奖励 10 分。
  function calculateGreenPoints(plan, carbonSaving = 0) {
    const modePoints = ensureArray(plan.segments).reduce((sum, segment) => {
      const distance = Number(segment.distance || 0);
      return sum + distance * getSegmentPointRate(segment.mode);
    }, 0);
    const carbonBonus = Number(carbonSaving || 0) * 10;
    return Math.max(Math.round(modePoints + carbonBonus), 0);
  }

  function getGreenLevel(totalPoints) {
    const points = Number(totalPoints || 0);
    if (points >= 1200) {
      return { name: "低碳先锋", nextName: "已达最高等级", nextPoints: 1200, progress: 100 };
    }
    if (points >= 600) {
      return { name: "黄金通勤者", nextName: "低碳先锋", nextPoints: 1200, progress: Math.min((points / 1200) * 100, 100) };
    }
    if (points >= 200) {
      return { name: "白银通勤者", nextName: "黄金通勤者", nextPoints: 600, progress: Math.min((points / 600) * 100, 100) };
    }
    return { name: "青铜通勤者", nextName: "白银通勤者", nextPoints: 200, progress: Math.min((points / 200) * 100, 100) };
  }

  function saveGreenTravelData(plan, carbonSaving = 0, source = "selected") {
    const records = getAllCarbonRecords();
    const greenPoints = calculateGreenPoints(plan, carbonSaving);
    const record = {
      recordId: `C${Date.now()}`,
      userId: getCurrentUserId(),
      planId: plan.id,
      routeName: plan.name,
      start: plan.start,
      end: plan.end,
      distance: Number(plan.distance) || 0,
      reduceCO2: Number(carbonSaving) || 0,
      greenPoints,
      score: greenPoints,
      source,
      createTime: new Date().toLocaleString()
    };

    records.unshift(record);
    safeWrite(STORAGE_KEYS.carbonRecords, records);
    safeWrite(STORAGE_KEYS.legacyCarbon, records);
    return record;
  }

  function getGreenTravelData() {
    const currentUserId = getCurrentUserId();
    const records = getAllCarbonRecords().filter((item) => item.userId === currentUserId);
    const totalCarbonReduction = records.reduce((sum, item) => sum + Number(item.reduceCO2 || 0), 0);
    const totalDistance = records.reduce((sum, item) => sum + Number(item.distance || 0), 0);
    const greenPoints = records.reduce((sum, item) => sum + Number(item.greenPoints ?? item.score ?? 0), 0);
    const level = getGreenLevel(greenPoints);

    return {
      records,
      tripCount: records.length,
      totalCarbonReduction,
      totalDistance,
      greenPoints,
      greenScore: greenPoints,
      level
    };
  }

  function getAllMessages() {
    return ensureArray(safeRead(STORAGE_KEYS.messages, []));
  }

  function getMessages() {
    const currentUserId = getCurrentUserId();
    const messages = getAllMessages().filter((item) => item.userId === currentUserId || item.userId === "guest");
    if (messages.length) {
      return messages;
    }
    const defaults = getDefaultMessages(currentUserId);
    safeWrite(STORAGE_KEYS.messages, [...defaults, ...getAllMessages()]);
    return defaults;
  }

  function saveMessages(messages) {
    return safeWrite(STORAGE_KEYS.messages, ensureArray(messages));
  }

  function markMessageRead(messageId) {
    const messages = getAllMessages().map((item) => item.id === messageId ? { ...item, read: true } : item);
    saveMessages(messages);
  }

  function markAllMessagesRead() {
    const currentUserId = getCurrentUserId();
    const messages = getAllMessages().map((item) => {
      if (item.userId === currentUserId || item.userId === "guest") {
        return { ...item, read: true };
      }
      return item;
    });
    saveMessages(messages);
  }

  function getAllMonthlyReports() {
    return ensureArray(safeRead(STORAGE_KEYS.monthlyReports, []));
  }

  function saveMonthlyReport(report) {
    const reports = getAllMonthlyReports();
    const currentUserId = getCurrentUserId();
    const record = {
      ...report,
      reportId: report.reportId || `MR${Date.now()}`,
      userId: report.userId || currentUserId,
      createTime: report.createTime || new Date().toLocaleString()
    };
    const next = reports.filter((item) => !(item.userId === record.userId && item.reportId === record.reportId));
    next.unshift(record);
    safeWrite(STORAGE_KEYS.monthlyReports, next);
    return record;
  }

  function getMonthlyReports() {
    const currentUserId = getCurrentUserId();
    return getAllMonthlyReports().filter((item) => item.userId === currentUserId);
  }

  function getAllAddresses() {
    const addresses = safeRead(STORAGE_KEYS.addresses, {});
    return addresses && typeof addresses === "object" ? addresses : {};
  }

  function getAddresses() {
    return getAllAddresses()[getCurrentUserId()] || {};
  }

  function saveAddresses(addresses) {
    const allAddresses = getAllAddresses();
    allAddresses[getCurrentUserId()] = {
      home: String(addresses.home || ""),
      school: String(addresses.school || ""),
      intern: String(addresses.intern || ""),
      metro: String(addresses.metro || "")
    };
    return safeWrite(STORAGE_KEYS.addresses, allAddresses);
  }

  function clearHistoryRecords() {
    const currentUserId = getCurrentUserId();
    const history = getAllHistory().filter((item) => item.userId !== currentUserId);
    safeWrite(STORAGE_KEYS.history, history);
    return { ok: true, message: "历史记录已清空。" };
  }

  function getBackendStats() {
    return safeRead(STORAGE_KEYS.backendStats, null);
  }

  function saveBackendStats(stats) {
    return safeWrite(STORAGE_KEYS.backendStats, stats || {});
  }

  // 兼容当前页面已有调用名。
  const register = registerUser;
  const login = loginUser;
  const addFavorite = saveFavoriteRoute;
  const removeFavorite = deleteFavoriteRoute;
  const addHistory = saveHistoryRecord;
  const getHistory = getHistoryRecords;
  const addCarbonRecord = saveGreenTravelData;
  const getCarbonRecords = () => getGreenTravelData().records;
  const getAllCarbon = getAllCarbonRecords;

  return {
    ensureSeedData,
    loadDemoData,
    clearDemoData,
    getUsers,
    saveUsers,
    saveCurrentUser,
    getCurrentUser,
    registerUser,
    loginUser,
    logout,
    saveFavoriteRoute,
    deleteFavoriteRoute,
    getFavorites,
    getAllFavorites,
    saveFixedCommuteRoute,
    deleteFixedCommuteRoute,
    getFixedCommutes,
    getAllFixedCommutes,
    saveHistoryRecord,
    getHistoryRecords,
    getAllHistory,
    saveGreenTravelData,
    getGreenTravelData,
    calculateGreenPoints,
    getGreenLevel,
    getAllCarbonRecords,
    getMessages,
    getAllMessages,
    saveMessages,
    markMessageRead,
    markAllMessagesRead,
    saveMonthlyReport,
    getMonthlyReports,
    getAllMonthlyReports,
    getAddresses,
    saveAddresses,
    clearHistoryRecords,
    getBackendStats,
    saveBackendStats,
    register,
    login,
    addFavorite,
    removeFavorite,
    addHistory,
    getHistory,
    addCarbonRecord,
    getCarbonRecords,
    getAllCarbon
  };
})();

window.SmartStorage = SmartStorage;

const StorageService = (() => {
  const keys = {
    users: "smart_commute_users",
    currentUser: "smart_commute_current_user",
    favorites: "smart_commute_favorites",
    history: "smart_commute_history",
    carbonRecords: "smart_commute_carbon_records"
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function normalizeUser(user) {
    if (!user) {
      return null;
    }
    const id = user.id || user.userId;
    return {
      ...user,
      id,
      userId: id
    };
  }

  function getUsers() {
    SmartStorage.ensureSeedData();
    return SmartStorage.getUsers().map(normalizeUser);
  }

  function saveUsers(users) {
    return SmartStorage.saveUsers((Array.isArray(users) ? users : []).map(normalizeUser));
  }

  function setCurrentUser(userId) {
    const user = getUsers().find((item) => item.id === userId || item.userId === userId);
    if (user) {
      SmartStorage.saveCurrentUser(user);
    }
  }

  function clearCurrentUser() {
    SmartStorage.logout();
  }

  function getCurrentUser() {
    return normalizeUser(SmartStorage.getCurrentUser());
  }

  function append(key, record) {
    const list = Array.isArray(read(key, [])) ? read(key, []) : [];
    list.unshift(record);
    write(key, list);
    return record;
  }

  function listForUser(key) {
    const user = getCurrentUser();
    if (!user) {
      return [];
    }
    const list = Array.isArray(read(key, [])) ? read(key, []) : [];
    return list.filter((item) => item.userId === user.userId || item.userId === user.id);
  }

  return {
    keys,
    getUsers,
    saveUsers,
    setCurrentUser,
    clearCurrentUser,
    getCurrentUser,
    append,
    listForUser
  };
})();

window.StorageService = StorageService;
