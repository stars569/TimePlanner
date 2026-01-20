const { sequelize } = require('../sequelize/sequelize_object.js')

const { Sequelize } = require('sequelize');

// 引入 jsonwebtoken 模块，用于生成 token
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { jwt: jwtConfig } = require('../config');
const User = require("../repositories/User.js")(sequelize, Sequelize);

// 登录接口（与数据库解耦版）
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. 从 Repository 查找用户
    const user = await User.findOne({
      where: { username }
    })
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "用户名或密码错误"
      });
    }

    // 2. 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: "用户名或密码错误"
      });
    }

    // 3. 生成 JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    // 4. 返回结果
    return res.status(200).json({
      code: 200,
      message: "登录成功",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error("登录失败:", error);
    return res.status(500).json({
      code: 500,
      message: "登录失败",
      error: error.message
    });
  }
};

// 注册接口
exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      where: { username }
    });
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: "用户名已存在"
      });
    }

    // 创建新用户
    const newUser = await User.create({
      username,
      password,
      email : email || null
    })

    return res.status(201).json({
      code: 201,
      message: "注册成功",
      user: {
        id: newUser.id,
        username: newUser.username
      }
    });
  } catch (error) {
    console.error("注册失败:", error);
    return res.status(500).json({
      code: 500,
      message: "注册失败",
      error: error.message
    });
  }
};