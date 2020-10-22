const express = require('express');

const shortUrlService = require('./shorturl-service.js');

const router = express.Router();

router.post('/generation/shorturl', async(req,res,next)=> {
    try{
        let body = req.body;
        let url = body.url;
        if(url){
            let shortUrl = await shortUrlService.generateShortUrl(url);
            shortUrl = req.headers.host.concat("/shorturl/", shortUrl);
            res.json({ success: true, data: shortUrl});
        }else {
            res.json({ success: false, data: "Please correct the input data."});
        }
    }catch(err){
        next(err);
    }
});

router.get('/shorturl/:shortUrl', async (req, res,next)=> {
    try{
        let shortUrl = req.params.shortUrl;
        let originUrl = await shortUrlService.getOriginUrl(shortUrl);
        if(originUrl){
            res.redirect(302, originUrl);
        }else {
            res.json({ success: false, msg: "not found"});
        }
    }catch(err){
        next(err);
    }
});

module.exports = router;