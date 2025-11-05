// routes/minimax_Router.js


const express = require('express'); 
const router = express.Router();
require('dotenv').config()
const OssController = require('../controllers/UploadController.js');
const fileUpload = require('express-fileupload');
// GET 路由：顯示頁面
router.get('/minimax_Get', (req, res) => {
    res.render('minimax_Get', { apiKey: process.env.MINIMAX_API_KEY });
});

router.get('/minimax_image', (req, res) => {
    res.render('minimax_Image', { apiKey: process.env.MINIMAX_API_KEY });
});

router.get('/minimax_Subject-Reference', (req, res) => {
    res.render('minimax_Subject-Reference');
});

router.get('/minimax_Text', (req, res) => {
    res.render('minimax_Text');
});

// 修正：直接使用控制器函數
router.get('/minimax_UploadImage', OssController.showUploadPage);

// POST：上傳圖片
router.post('/minimax_UploadImage', fileUpload(), OssController.uploadToOss);

// 其他 OSS 相關路由（建議移到獨立 router，此處保留方便）
router.get('/minimax_UploadImage/list', OssController.listOssImages);
router.post('/minimax_UploadImage/delete', OssController.deleteFromOss);

module.exports = router;