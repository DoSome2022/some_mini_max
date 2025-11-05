// controllers/OssController.js
const ossClient = require('../config/oss.config');
const path = require('path');

const formatFileSize = (bytes) => {
  if (!bytes) return '未知';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

class OssController {

  // 1. 顯示上傳頁面
  static showUploadPage(req, res) {
    res.render('minimax_UploadImage');
  }

  // 2. 上傳圖片到 OSS
  static async uploadToOss(req, res) {
    if (!req.files || !req.files.images) {
      return res.status(400).json({ success: false, message: '未選擇檔案' });
    }

    const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    const uploaded = [];

    try {
      for (const file of files) {
        if (!file.mimetype.startsWith('image/')) {
          continue;
        }

        const fileName = `images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.name)}`;
        const result = await ossClient.put(fileName, file.data);

        uploaded.push({
          name: file.name,
          url: result.url,
          key: fileName,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toLocaleString('zh-TW')
        });
      }

      res.json({
        success: true,
        message: `成功上傳 ${uploaded.length} 張圖片`,
        images: uploaded
      });
    } catch (error) {
      console.error('OSS 上傳失敗:', error);
      res.status(500).json({ success: false, message: '上傳失敗' });
    }
  }

  // 3. 顯示 OSS 中所有圖片
// controllers/OssController.js 中的 listOssImages 方法
static async listOssImages(req, res) {
  try {
    const result = await ossClient.list({
      prefix: 'images/',
      'max-keys': 100
    });

    const images = result.objects
      ?.filter(obj => !obj.name.endsWith('/'))
      .map(obj => ({
        name: path.basename(obj.name),
        url: ossClient.signatureUrl(obj.name, { expires: 3600 }),  // 簽名 URL，有效期 1 小時
        key: obj.name,
        size: formatFileSize(obj.size),
        uploadedAt: new Date(obj.lastModified).toLocaleString('zh-TW')
      })) || [];

    res.render('imageLists', { images });
  } catch (error) {
    console.error('列出 OSS 失敗（詳細）:', {
      message: error.message,
      code: error.code,
      endpoint: process.env.ALIYUN_OSS_ENDPOINT  // 記錄端點以除錯
    });

    let errorMsg = '無法載入圖片列表';
    if (error.code === 'RequestError' || error.message.includes('ENOTFOUND')) {
      errorMsg = 'OSS 連線失敗：請確認端點配置正確（.env 中的 ALIYUN_OSS_ENDPOINT）。若持續，請檢查網路或阿里雲權限。';
    } else if (error.message.includes('AccessDenied')) {
      errorMsg = '存取被拒絕：請確認 AccessKey 有 ListBucket 權限。';
    }

    res.render('imageLists', { images: [], error: errorMsg });
  }
}

  // 4. 刪除 OSS 圖片
  static async deleteFromOss(req, res) {
    const { key } = req.body;
    if (!key) {
      return res.redirect('/minimax_UploadImage/list');
    }

    try {
      await ossClient.delete(key);
      res.redirect('/minimax_UploadImage/list');
    } catch (error) {
      console.error('刪除失敗:', error);
      res.redirect('/minimax_UploadImage/list');
    }
  }
}

module.exports = OssController;