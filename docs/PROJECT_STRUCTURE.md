# 项目文件结构说明

本项目是基于《软件工程导论》课程报告开发的“都市圈智慧通勤出行服务系统”初级网页原型。当前阶段重点先建立清晰结构，复杂功能后续逐步补充。

## 顶层结构

```text
smart-commute-system/
├─ index.html              用户端首页与主交互入口
├─ login.html              登录注册页
├─ plan.html               通勤路线规划页
├─ traffic.html            实时交通信息模拟页
├─ green.html              绿色出行统计页
├─ history.html            收藏与历史记录页
├─ admin.html              管理员端页面
├─ css/
│  └─ style.css            全局样式，蓝绿色科技风与轨道交通主题
├─ js/
│  ├─ data.js              JavaScript/JSON 模拟数据
│  ├─ storage.js           localStorage 数据读写
│  ├─ auth.js              用户注册、登录、退出与权限判断
│  ├─ routeAlgorithm.js    路线加权评分算法
│  ├─ routePlanner.js      通勤路线规划业务逻辑
│  ├─ carbon.js            碳减排与绿色积分计算
│  ├─ main.js              公共页面交互
│  ├─ app.js               用户端综合交互
│  ├─ plan.js              路线规划页交互
│  ├─ traffic.js           实时交通页交互
│  ├─ green.js             绿色出行页交互
│  ├─ history.js           收藏历史页交互
│  ├─ login.js             登录注册页交互
│  └─ admin.js             管理员端交互
├─ assets/
│  ├─ icons/               图标素材
│  ├─ images/              城市轨道交通主题图片
│  └─ mockups/             答辩展示截图或页面草图
├─ docs/
│  ├─ PROJECT_STRUCTURE.md 项目结构说明
│  ├─ DEVELOPMENT_ORDER.md 开发顺序
│  ├─ TEST_CASES.md        测试用例
│  └─ DEMO_SCRIPT.md       答辩演示稿
└─ README.md               项目说明
```

## 模块边界

- 用户端：围绕首页展示、路线规划、多模式出行组合、路线推荐、实时交通模拟、绿色出行统计、收藏路线和历史记录展开。
- 管理员端：围绕数据概览、用户管理、线路数据管理、热门路线统计和绿色出行统计展开。
- 数据层：课程初级版本不接入后端，使用 `data.js` 中的模拟数据和浏览器 `localStorage`。
- 算法层：采用报告中的多指标加权评分思想，不接入真实地图 API。
- 展示层：保持蓝绿色科技风，突出城市轨道交通、公共交通优先和绿色低碳主题。
