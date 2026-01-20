// 引入 Sequelize ORM 核心模块
const { Sequelize } = require('sequelize');
// 引入统一配置
const config = require('../config');

// 初始化 Sequelize 连接（传入数据库名、用户名、密码、配置项）
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host, // 数据库主机
    port: config.db.port, // 数据库端口
    dialect: 'postgres', // 数据库类型
    timezone: '+08:00', // 关键配置：东八区时区，避免时间相差 8 小时
    logging: false, // 关闭 SQL 日志输出（开发时若需调试，可改为 true）
  }
);

// 测试数据库连接（异步函数，自动执行）
async function testDBConnection() {
  try {
    // 尝试验证数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    // 连接失败时输出错误信息
    console.error('❌ 数据库连接失败:', error);
  }
}
// 调用测试连接函数
testDBConnection();

// 导出 Sequelize 连接实例和计划模型（后续其他文件可直接引入）
module.exports = {
  sequelize
};