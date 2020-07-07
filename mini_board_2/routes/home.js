const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const knex = require('knex')({
    dialect: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'my-nodeapp-db',
        charset: 'utf8',
    }
})

const BookShelf = require('BookShelf')(knex);

const User = BookShelf.Model.extend({
    tableName: 'users',
});

const Message = BookShelf.Model.extend({
    tableName: 'messages',
    hasTimestamps: true,
    user: () => {
        return this.belongsTo(User);
    }
})

router.get('/', (req, res, next) => {
    res.redirect('/');
})

router.get('/:id', (req, res, next) => {
    res.redirect('/home/' + req.params.id + '/1');
})

router.get('/:id/:page', (req, res, next) => {
    const id = req.params.id;
    id *= 1;
    const page = req.params.page;
    page *= 1;
    if (page < 1) { page = 1 };
    new Message().orderBy('created_at', 'DESC').where('user_id', '=', id).fetchPage({ page: page, pageSize: 10, withRelated: ['user'] }).then((collection) => {
        const data = {
            title: 'miniBoard',
            login: req.session.login,
            user_id: id,
            collection: collection.toArray(),
            pagination: collection.pagination,
        }
        res.render('home', data);
    }).catch((err) => {
        res.status(500).json({ error: true, data: { message: err.message } });
    })
})

module.exports = router;