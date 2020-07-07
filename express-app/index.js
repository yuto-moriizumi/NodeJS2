const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express();
app.engine('ejs', ejs.renderFile);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const data = {
    'Taro': 'taro@yamada',
    'Hanako': 'Hanako@japan',
};

app.get('/', (req, res) => {
    const url = '/other?name=taro&pass=yamada';
    res.render('index.ejs', {
        title: 'Index',
        content: 'This is Express-app Top page!',
        link: {
            href: url,
            text: '※別のページへ移動',
        },
        data: data,
    });
});

app.post('/', (req, res) => {
    const url = '/other?name=taro&pass=yamada';
    const msg = 'This is Posted Page!<br>' +
        'あなたは、<b>' + req.body.message + '</b>と送信しました。';
    res.render('index.ejs', {
        title: 'Postetd',
        content: msg,
        link: {
            href: url,
            text: '※別のページへ移動',
        },
        data: data,
    });
});

app.get('/other', (req, res) => {
    const name = req.query.name;
    const pass = req.query.pass;
    res.render('index.ejs', {
        title: 'Other',
        content: name + 'さん、パスワードは' + pass + '\n別のページへようこそ',
        link: {
            href: './',
            text: 'トップへ戻る',
        },
    });
});

app.listen(3000, () => {
    console.log('Start server port:3000');
});
