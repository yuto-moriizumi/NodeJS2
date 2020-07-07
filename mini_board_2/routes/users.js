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

const BookShelf = require('bookshelf')(knex);

const User = BookShelf.Model.extend({
  tableName: 'users',
});

/* GET users listing. */
router.get('/add', function (req, res, next) {
  const data = {
    title: 'Users/Add',
    form: { name: '', password: '', comment: '', },
    content: '※登録する名前、パスワード・コメントを入力ください',
  };
  res.render('users/add', data);
});

router.post('/add', (req, res, next) => {
  const request = req;
  const response = res;
  //req.check('name', 'NAMEは必ず入力してください。').notEmpty();
  //req.check('password', 'PASSWORD は必ず入力してください').notEmpty();
  //req.getValidationResult().then((result) => {
  result = null;
  if (!result.isEmpty()) {
    const content = '<ul class="error">';
    const result_arr = result.array();
    for (const i of result_arr) {
      content += '<li>' + i.msg + '</li>';
    }
    content += '</ul>';
    const data = {
      title: 'Users/Add',
      content: content,
      form: req.body,
    }
    response.render('users/add', data);
  } else {
    request.session.login = null;
    new User(req.body).save().then((model) => {
      responce.redirect('/');
    });
  }
  //})
})

router.get('/', (req, res, next) => {
  console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
  const data = {
    title: 'users/Login',
    form: { name: '', password: '', },
    content: '名前とパスワードを入力ください',
  };
  res.render('users/login', data);
});

router.post('/', (req, res, next) => {
  const request = req;
  const response = res;

  req.check('name', 'NAME は必ず入力してください。').notEmpty();
  req.check('password', 'PASSWORD は必ず入力してください').notEmpty();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      const content = '<ul class="error">'
      const result_arr = result.toArray();
      for (const i of result_arr) {
        content += '<li>' + i.msg + '</li>';
      }
      content += '</ul>';
      const data = {
        title: 'Users/Login',
        content: content,
        form: req.body,
      }
      response.render('users/login', data);
    } else {
      const name = req.body.name;
      const password = req.body.password;
      User.query({
        where: { name: name },
        andWhere: { password: password },
      }).fetch().then((model) => {
        if (model == null) {
          const data = {
            title: '再入力',
            content: '<p class="error">名前またはパスワードが違います。</p>',
            form: req.body,
          };
          responce.render('users/login', data);
        } else {
          request.session.login = model.attributes;
          const data = {
            title: 'Users/Login',
            content: '<p>ログインしました！<br>トップページに戻ってメッセージを送信してください。</p>',
            form: req.body,
          };
          responce.render('users/login', data);
        }
      })
    }
  })
})

module.exports = router;
