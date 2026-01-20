require('dotenv').config({ path: '.env' });
const AipNlpClient = require("baidu-aip-sdk").nlp;
const { baiduNlp } = require("../config");

// 初始化百度AI客户端
const client = new AipNlpClient(
  baiduNlp.appId,
  baiduNlp.apiKey,
  baiduNlp.secretKey
);

// 匹配常见时间格式的正则表达式
const timeRegex = /(\d{1,2}点|\d{1,2}:\d{2}|上午|下午|晚上|凌晨|明天|后天|昨天|今天|周一|周二|周三|周四|周五|周六|周日|星期[一二三四五六日]|(?:\d{1,2}月)?\d{1,2}日|\d{4}年\d{1,2}月\d{1,2}日)/g;

// 文本解析接口
exports.parseText = async (req, res) => {
  try {
    const { text } = req.body;
    console.log("收到的文本:", text);

    // 1. 先用正则提取时间
    let time = "未识别时间";
    const timeMatches = text.match(timeRegex);
    if (timeMatches && timeMatches.length > 0) {
      time = timeMatches.join(" ");
    }

    // 2. 调用百度AI词法分析接口
    const result = await client.lexer(text);
    console.log("百度AI词法分析返回结果:", result);

    // 3. 提取活动相关的名词、动词
    let activity = "未识别活动";
    let activityParts = [];
    if (result.items && result.items.length > 0) {
      for (const item of result.items) {
        // 提取活动相关的名词、动词
        if (item.pos === "n" || item.pos === "v" || item.pos === "vn") {
          activityParts.push(item.item);
        }
        // 如果AI识别出时间，覆盖正则的结果
        if (item.ne === "TIME") {
          time = item.item;
        }
      }

      // 拼接活动名称
      if (activityParts.length > 0) {
        activity = activityParts.join("");
      }
    }

    // 返回解析结果
    res.status(200).json({
      code: 200,
      message: "解析成功",
      time,
      activity,
    });
  } catch (error) {
    console.error("百度AI接口调用失败:", error);
    res.status(500).json({
      code: 500,
      message: "解析失败",
      error: error.message,
    });
  }
};