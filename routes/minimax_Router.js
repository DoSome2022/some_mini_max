const express = require('express'); 
const router = express.Router();
require('dotenv').config()


router.get('/minimax_Get', (req, res) => {
    res.render('minimax_Get',{ apiKey: process.env.MINIMAX_API_KEY });
});

router.get('/minimax_image', (req, res) => {
    res.render('minimax_Image',{ apiKey: process.env.MINIMAX_API_KEY });
});

router.get('/minimax_Subject-Reference', (req, res) => {
    res.render('minimax_Subject-Reference');
});

router.get('/minimax_Text',(req,res)=>{
    res.render('minimax_Text');
})

module.exports = router;