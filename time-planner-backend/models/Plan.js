// 导出模型定义函数（接收 sequelize 实例和 Sequelize 核心对象）
module.exports = (sequelize, Sequelize) => {
  // 定义 Plan 模型（对应数据库中的 plans 表）
  const Plan = sequelize.define('Plan', {
    // 主键 id
    id: {
      type: Sequelize.INTEGER, // 整数类型
      primaryKey: true, // 设为主键
      autoIncrement: true, // 自动递增
    },
    // 关联的用户 id
    userId: {
      type: Sequelize.INTEGER, // 整数类型
      allowNull: false, // 不允许为空
    },
    // 计划活动名称
    activity: {
      type: Sequelize.STRING, // 字符串类型
      allowNull: false, // 不允许为空
    },
    // 计划时间
    time: {
      type: Sequelize.STRING, // 字符串类型（后续可改为 DATE 类型优化）
      allowNull: false, // 不允许为空
    },
    // 计划地点
    location: {
      type: Sequelize.STRING, // 字符串类型
      allowNull: true, // 允许为空（可选字段）
    },
    // 计划备注
    remark: {
      type: Sequelize.STRING, // 字符串类型
      allowNull: true, // 允许为空（可选字段）
    },
    // 是否提醒
    isRemind: {
      type: Sequelize.BOOLEAN, // 布尔类型
      defaultValue: false, // 默认值为 false（不提醒）
    },
    // 创建时间
    createTime: {
      type: Sequelize.DATE, // 日期时间类型
      defaultValue: Sequelize.NOW, // 默认值为当前时间
    },
  }, {
    tableName: 'plans', // 明确指定数据库中的表名为 plans（避免 Sequelize 自动复数化）
    timestamps: false, // 关闭 Sequelize 自动添加的 createdAt 和 updatedAt 字段
  });

  // 同步模型到数据库（不存在则创建表，存在则不修改，安全无数据丢失）
  Plan.sync({ force: false });

  // 返回 Plan 模型
  return Plan;
};