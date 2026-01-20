const { sequelize } = require('../sequelize/sequelize_object.js')

const { Sequelize } = require('sequelize');

// 引入计划模型
const Plan = require('../models/Plan.js')(sequelize, Sequelize);

// 新增计划接口逻辑
exports.addPlan = async (req, res) => {
  try {
    // 从请求体中获取计划参数
    const { activity, time, location, remark, isRemind } = req.body;
    // 从权限中间件中获取当前登录用户 ID
    const userId = req.userId;

    // 验证必填项（活动和时间）
    if (!activity || !time) {
      return res.status(400).json({ code: 400, message: '活动和时间为必填项' });
    }

    // 创建新计划（存入数据库）
    const newPlan = await Plan.create({
      userId,
      activity,
      time,
      location,
      remark,
      isRemind: isRemind || false, // 若未传入 isRemind，默认值为 false
    });

    // 返回新增成功结果
    return res.status(201).json({
      code: 201,
      message: '规划添加成功',
      data: newPlan,
    });
  } catch (err) {
    // 新增失败时输出错误信息并返回异常响应
    console.error('添加失败:', err);
    return res.status(500).json({ code: 500, message: '服务器异常' });
  }
};

// 查询用户所有计划接口逻辑
exports.getUserPlans = async (req, res) => {
  try {
    // 从权限中间件中获取当前登录用户 ID
    const userId = req.userId;

    // 查询该用户的所有计划，按时间升序排序
    const plans = await Plan.findAll({
      where: { userId },
      order: [['time', 'ASC']],
    });

    // 返回查询成功结果
    return res.status(200).json({
      code: 200,
      message: '查询成功',
      data: plans,
    });
  } catch (err) {
    // 查询失败时输出错误信息并返回异常响应
    console.error('查询失败:', err);
    return res.status(500).json({ code: 500, message: '服务器异常' });
  }
};