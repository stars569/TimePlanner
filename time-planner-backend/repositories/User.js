const bcrypt = require('bcrypt');

// 导出模型定义函数（接收 sequelize 实例和 Sequelize 核心对象）
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
      // 主键 id
      id: {
        type: Sequelize.INTEGER, // 整数类型
        primaryKey: true, // 设为主键
        autoIncrement: true, // 自动递增
      },
      // 用户名
      username: {
        type: Sequelize.STRING, // 字符串类型
        allowNull: false, // 不允许为空
        unique: true, // 唯一索引
      },
      // 密码
      password: {
        type: Sequelize.STRING, // 密码类型
        allowNull: false, // 不允许为空
      },
      // 邮箱
      email: {
        type: Sequelize.STRING, // 邮箱类型
        allowNull: true, // 允许为空
        unique: true, // 唯一索引
      },
    }, {
      tableName: 'users', // 明确指定数据库中的表名为 users（避免 Sequelize 自动复数化）
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        }
      }
    });
  
    // 同步模型到数据库（不存在则创建表，存在则不修改，安全无数据丢失）
    User.sync({ force: false });
  
    // 返回 User 模型
    return User;
};