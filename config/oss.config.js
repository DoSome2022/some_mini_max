// config/oss.config.js
const OSS = require('ali-oss');
require('dotenv').config();

// 驗證必要環境變數
if (!process.env.ALIYUN_OSS_ENDPOINT) {
  throw new Error('ALIYUN_OSS_ENDPOINT 未設定，請檢查 .env 檔案。預期格式：https://oss-cn-hongkong.aliyuncs.com');
}
if (!process.env.ALIYUN_OSS_BUCKET) {
  throw new Error('ALIYUN_OSS_BUCKET 未設定，請檢查 .env 檔案。');
}

// 除錯日誌：確認環境變數
console.log('OSS 配置檢查:', {
  endpoint: process.env.ALIYUN_OSS_ENDPOINT,
  bucket: process.env.ALIYUN_OSS_BUCKET,
  region: process.env.OSS_REGION
});

// 方法1：直接使用環境變數中的區域（推薦）
const region = process.env.OSS_REGION || 'oss-cn-hongkong';

// 方法2：修正的端點解析邏輯（備用）
// let endpoint = process.env.ALIYUN_OSS_ENDPOINT;
// if (!endpoint.startsWith('https://')) {
//   endpoint = 'https://' + endpoint.replace(/^http:\/\//, '');
// }
// // 正確的區域提取：從 oss-cn-hongkong.aliyuncs.com 提取出 oss-cn-hongkong
// const regionMatch = endpoint.match(/https:\/\/(oss-cn-[^.]+|oss-ap-[^.]+)/);
// const region = regionMatch ? regionMatch[1] : 'oss-cn-hongkong';

const client = new OSS({
  region: region,  // 使用正確的區域標識
  accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
  bucket: process.env.ALIYUN_OSS_BUCKET,
  secure: true,
  timeout: 30000,
  internal: false,
});

// 可選：模組載入時測試連線
client.list({ 'max-keys': 1 })
  .then(result => {
    console.log('OSS 連線測試成功，Bucket 內容數量:', result.objects?.length || 0);
  })
  .catch(err => {
    console.error('OSS 連線測試失敗:', {
      message: err.message,
      code: err.code,
      region: region,
      bucket: process.env.ALIYUN_OSS_BUCKET
    });
  });

module.exports = client;