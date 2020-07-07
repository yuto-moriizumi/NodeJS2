var express = require('express');
var router = express.Router();

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
});

const Bookshelf = require('bookshelf')(knex);

const User = Bookshelf.Model.extend({
  tableName: 'users',
});

const Message = Bookshelf.Model.extend({
  tableName: 'messages',
  hasTimestamps: true,
  user: () => {
    return this.belongsTo(User);
  },
});

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.login == null) {
    res.redirect('/users');
  } else {
    res.redirect('/1');
  }
});

router.get('/:page', (req, res, next) => {
  if (req.session.login == null) {
    res.redirect('/users');
    return;
  }
  let page = req.params.page;
  page *= 1;
  if (page < 1) { page = 1 };
  new Message().orderBy('created_at', 'DESC').fecthPage({
    page: page, pageSize: 10, withRelated: ['user']
  }).then((collection) => {
    const data = {
      title: 'miniBoard',
      login: req.session.login,
      collection: collection.toArray(),
      pagination: collection.pagination,
    }
    res.render('index', data);
  }).catch((err) => {
    res.status(500).json({
      error: true, data: { message: err.message }
    });
  })

});

router.post('/', (req, res, next) => {
  const rec = {
    message: req.body.msg,
    user_id: req.session.login.id,
  };
  new Message(rec).save().then((model) => {
    res.redirect('/');
  })
})

module.exports = router;
