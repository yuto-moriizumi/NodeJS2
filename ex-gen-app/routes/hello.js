const express = require('express');
const router = express.Router();

const http = require('https');
const parseString = require('xml2js').parseString;

router.get('/', (req, res, next) => {
    const opt = {
        host: 'news.google.com',
        port: 443,
        path: '/rss?ie=UTF-8&oe=UTF-8&hl=en-US&gl=US&ceid=US:en',
    };
    const name = req.query.name;
    const mail = req.query.mail;
    let msg;
    if (req.session.message != undefined) {
        msg = "Last Message:" + req.session.message;
    }
    if (msg == null) {
        msg = 'これは、サンプルです。' + name + 'さん。<br>' + mail;
    }
    let data = {
        title: 'HellO!',
        content: msg,
    };
    http.get(opt, (res2) => {
        let body = '';
        res2.on('data', (data) => {
            body += data;
        });
        res2.on('end', () => {
            parseString(body.trim(), (err, result) => {
                const data = {
                    title: 'Hello!',
                    content: result.rss.channel[0].item,
                };
                console.log(result.rss.channel[0].item);
            });

            res.render('hello', data);
        });
    });
});

router.post('/post', (req, res, next) => {
    const msg = req.body['message'];
    req.session.message = msg;
    const data = {
        title: 'Hello!',
        content: 'あなたは、「' + msg + '」とそうしんしました。',
    };
    res.render('hello', data);
})

module.exports = router;