// 加载 .env 环境变量文件
require('dotenv').config();

// 统一导出所有配置，供其他文件调用
module.exports = {
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  baiduNlp: {
    appId: process.env.BAIDU_APP_ID,
    apiKey: process.env.BAIDU_API_KEY,
    secretKey: process.env.BAIDU_SECRET_KEY,
  },
  port: process.env.PORT || 3001, // 若 .env 未配置 PORT，默认使用 3000
};