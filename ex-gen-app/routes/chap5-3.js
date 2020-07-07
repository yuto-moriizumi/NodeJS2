const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const mysql_setting = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my-nodeapp-db',
};

router.get('/', (req, res, next) => {
    console.log('access');
    const connection = mysql.createConnection(mysql_setting);
    console.log('access1');
    connection.connect();
    console.log('access2');
    connection.query('SELECT * FROM mydata', function (error, results, fields) {
        if (error == null) {
            const data = { title: 'mysql', content: results };
            res.render('chap5-3', data);
        };
    });
    console.log('access3');
    connection.end();
});

module.exports = router;