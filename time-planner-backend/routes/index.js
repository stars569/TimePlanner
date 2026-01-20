// 引入 Express 路由模块
const express = require('express');
// 创建路由实例
const router = express.Router();

// 引入各个控制器
const parseController = require('../controllers/parseController');
const planController = require('../controllers/planController');
const userController = require('../controllers/userController');

// 引入 JWT 权限验证中间件
const authMiddleware = require('../utils/authMiddleware');

// 公开接口（无需登录，直接访问）
router.post('/parse-text', parseController.parseText); // 文本解析接口
router.post('/user/login', userController.login); // 简易登录接口（生成 token）
router.post('/user/register', userController.register); // 简易登录接口（生成 token）

// 需登录授权的接口（先通过 authMiddleware 验证，再执行控制器逻辑）
router.post('/plan/add', authMiddleware, planController.addPlan); // 新增计划接口
router.get('/plan/list', authMiddleware, planController.getUserPlans); // 查询用户所有计划接口

// 导出路由实例，供入口文件挂载
module.exports = router;