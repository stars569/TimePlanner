// 引入 Express 核心模块
const express = require('express');
// 引入跨域中间件
const cors = require('cors');
// 引入路由配置
const routes = require('./routes');
// 引入统一配置
const config = require('./config');

// 创建 Express 应用实例
const app = express();

// 挂载全局中间件
app.use(cors()); // 允许所有跨域请求（开发环境，生产环境可配置具体域名）
app.use(express.json()); // 解析 JSON 格式的请求体（处理 POST/PUT 等请求的参数）

// 挂载所有接口路由，统一前缀 /api
app.use('/api', routes);

// 全局错误处理中间件（捕获所有接口的异常）
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
});

// 启动 Express 服务，监听指定端口
app.listen(config.port, () => {
  console.log(`🚀 后端服务已启动，端口：${config.port}`);
  console.log(`📡 接口访问前缀：http://localhost:${config.port}/api`);
});