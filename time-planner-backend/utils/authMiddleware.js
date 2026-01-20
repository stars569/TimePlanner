// 引入 jsonwebtoken 模块，用于验证 token
const jwt = require('jsonwebtoken');
// 引入 JWT 配置
const { jwt: jwtConfig } = require('../config');

// 导出中间件函数（req：请求对象，res：响应对象，next：下一步中间件/控制器）
module.exports = (req, res, next) => {
  // 从请求头中获取 Authorization 字段（格式：Bearer <token>）
  const authHeader = req.headers.authorization;

  // 验证请求头中是否存在有效 token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '未授权，请先登录' });
  }

  // 提取 token（分割字符串，取第二个部分）
  const token = authHeader.split(' ')[1];

  try {
    // 验证 token 有效性，解密获取用户信息
    const decoded = jwt.verify(token, jwtConfig.secret);
    // 将解密后的用户 ID 存入请求对象，供后续控制器使用
    req.userId = decoded.userId;
    // 验证通过，执行下一步（进入控制器）
    next();
  } catch (err) {
    // token 无效或过期时，返回授权失败
    return res.status(401).json({ code: 401, message: 'token无效或已过期' });
  }
};