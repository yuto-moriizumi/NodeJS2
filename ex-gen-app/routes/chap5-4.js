const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const validator = require('express-validator');

const mysql_setting = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my-nodeapp-db',
};

const knex = require('knex')({
    dialect: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'my-nodeapp-db',
        charset: 'utf8',
    }
});

const Bookshelf = require('bookshelf')(knex);

const MyData = Bookshelf.Model.extend({
    tableName: 'mydata',
});

router.get('/', (req, res, next) => {
    new MyData().fetchAll().then((collection) => {
        const data = {
            title: 'Chap6',
            content: collection.toArray(),
        };
        res.render('chap5-4/index', data);
    }).catch((err) => {
        res.status(500).json({ error: true, data: { message: err.message } });
    })
    /* 
    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata', function (error, results, fields) {
        if (error == null) {
            const data = { title: 'mysql', content: results };
            res.render('chap5-4/index', data);
        };
    });
    console.log('access3');
    connection.end();
    */
});

router.get('/add', (req, res, next) => {

    const data = {
        title: 'Chap5-4/Add',
        content: '新しいレコードを入力：',
        form: { name: '', mail: '', age: 0 },
    }
    res.render('chap5-4/add', data);

})
router.post('/add', (req, res, next) => {
    validator.check('name', 'NAMEは必ず入力してください。').notEmpty();
    validator.check('mail', 'MAILはメールアドレスを記入して下さい。').isEmail();
    validator.check('age', 'AGEは必ず年齢（整数）を入力してください。').isInt();
    console.log(validator.validationResult(req).formatter());
    if (!validator.validationResult) {
        const re = '<ul class="error">';
        const results = result.array();
        for (const i of results) {
            re += '<li>' + i.msg + '</li>';
        }
        re += '</ul>';
        const data = {
            title: 'Chap6/Add',
            content: re,
            form: req.body,
        }
        res.render('chap5-4/add', data);
    } else {
        new MyData(req.body).save().then((model) => {
            res.redirect('/chap5-4');
        });
        /*
        const nm = req.body.name;
        const ml = req.body.mail;
        const ag = req.body.age;
        const data = {
            'name': nm,
            'mail': ml,
            'age': ag,
        };

        const connection = mysql.createConnection(mysql_setting);
        connection.connect();
        connection.query('insert into mydata set ?', data, (error, results, fields) => {
            res.redirect('/chap5-4');
        });
        connection.end();*/
    }
});

router.get('/show', (req, res, next) => {
    const id = req.query.id;

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata where id=?', id, function (error, results, fields) {
        if (error == null) {
            const data = {
                title: 'Chap5-4/show',
                content: 'id=' + id + 'のレコード',
                mydata: results[0],
            }
            res.render('chap5-4/show', data);
        }
    });
    connection.end();
})

router.get('/edit', (req, res, next) => {
    const id = req.query.id;

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata WHERE id=?', id, (error, results, fields) => {
        if (error == null) {
            const data = {
                title: 'Chap5-4/edit',
                content: 'id=' + id + 'のレコード：',
                mydata: results[0],
            }
            res.render('chap5-4/edit', data);
        }
    });
    connection.end();
})

router.post('/edit', (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const mail = req.body.mail;
    const age = req.body.age;
    const data = { 'name': name, 'mail': mail, 'age': age };

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('UPDATE mydata SET ? WHERE id = ?', [data, id], (error, results, fields) => {
        res.redirect('/chap5-4');
    });
    connection.end();
});

router.get('/delete', (req, res, next) => {
    const id = req.query.id;

    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('SELECT * FROM mydata WHERE id = ?', id, (error, results, fields) => {
        if (error == null) {
            const data = {
                title: 'Chap5-4/delete',
                content: 'id=' + id + 'のレコード',
                mydata: results[0],
            };
            res.render('chap5-4/delete', data);
        }
    })
    connection.end();
})

router.post('/delete', (req, res, next) => {
    const id = req.body.id;
    const connection = mysql.createConnection(mysql_setting);
    connection.connect();
    connection.query('DELETE FROM mydata WHERE id = ?', id, (error, results, fields) => {
        res.redirect('/chap5-4');
    })
    connection.end();
})

router.get('/find', (req, res, next) => {
    const data = {
        title: 'Chap5-4/Find',
        content: '検索IDを入力',
        form: { fstr: '' },
        mydata: null,
    }
    res.render('chap5-4/find', data);
})

router.post('/find', (req, res, next) => {
    new MyData().where('id', '=', req.body.fstr).fetch().then((collection) => {
        const data = {
            title: 'Chap5-4',
            content: '※id = ' + req.body.fstr + ' の検索結果：',
            form: req.body,
            mydata: collection,
        }
        res.render('Chap5-4/find', data);
    })
})

router.get('/:page', (req, res, next) => {
    let page = req.params.page;
    page *= 1;
    if (page <= 1) { page = 1 }
    new MyData().fetchPage({ page: page, pageSize: 3 }).then((collection) => {
        const data = {
            title: 'Chap6-2',
            content: collection.toArray(),
            pagination: collection.pagination,
        }
        console.log(collection.pagenation);
        res.render('chap5-4/index', data);
    }).catch((err) => {
        res.status(500).json({ error: true, data: { message: err.message } });
    });
});

module.exports = router;