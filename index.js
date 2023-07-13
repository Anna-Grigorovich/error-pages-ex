'use strict'

/**
 * Module dependencies.
 */

// если я в пакет джейсоне напишу type module можно не делать эту переменную а сверху просто написать import express from express?
var express = require('express');   
var path = require('path');
var app = module.exports = express();
// что за морган??? 
var logger = require('morgan');       
   //    что тут происходит?
var silent = process.env.NODE_ENV === 'test'

// general config     что такое конфигурация простіми словами и для чего мы создам штуки внизу? 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// our custom "verbose errors" setting
// which we can use in the templates
// via settings['verbose errors']  ??????
app.enable('verbose errors');

app.set('env', process.env.NODE_ENV === 'production' ? 'production' : 'local')

// disable them in production
// use $ NODE_ENV=production node examples/error-pages
if (app.settings.env === 'production') app.disable('verbose errors')
// ????
silent || app.use(logger('dev'));

app.get('/admin/*', function(req, res, next){
  req.admin = true;
  next();
});

// Routes
// тут когда делаешь гет запрос то рендрит файл index.ejs?

app.get('/', function(req, res){
  res.render('index.ejs');
});
// тут когда делаешь гет запрос c маршрутом http://localhost:3000/404 то что????

app.get('/news', function(req, res){
  
  res.render('news-main.ejs');
});

app.get('/news/admin', function(req, res){
  res.render('news-item.ejs');
});

app.get('/news/*', function(req, res, next){
  if (false) {
    res.render('news-item.ejs');
  } else {
    const error = new Error();
    error.message = "News not available";
    next(error);
  }
});

app.get('/image/*', function(req, res, next){
  if (false) {
    res.render('news-item.ejs');
  } else {
    const error = new Error();
    error.message = "Image not available";
    next(error);
  }
});

app.get('/admin/image/*', function(req, res, next){
  if (false) {
    res.render('news-item.ejs');
  } else {
    const error = new Error();
    error.message = "Image not available";
    next(error);
  }
});



app.get('/404', function(req, res, next){
  // trigger a 404 since no other middleware
  // will match /404 after this one, and we're not
  // responding here
  next();
});
// тут когда делаешь гет запрос c маршрутом http://localhost:3000/403 то что????
app.get('/403', function(req, res, next){
  // trigger a 403 error
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});
// тут когда делаешь гет запрос c маршрутом http://localhost:3000/500 то что????
app.get('/500', function(req, res, next){
  // trigger a generic (500) error
  next(new Error('keyboard cat!'));
});

// Error handlers

// Since this is the last non-error-handling
// middleware use()d, we assume 404, as nothing else
// responded.

// $ curl http://localhost:3000/notfound
// $ curl http://localhost:3000/notfound -H "Accept: application/json"
// $ curl http://localhost:3000/notfound -H "Accept: text/plain"


// app.use что делает? что такое next?
app.use(function(req, res, next){  
  res.status(404);

  res.format({
    html: function () {
      res.render('404', { url: req.url })
    },
    json: function () {
      res.json({ error: 'Not found' })
    },
    default: function () {
      res.type('txt').send('Not found')
    }
  })
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err, message: !!req.admin && err.message });
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}