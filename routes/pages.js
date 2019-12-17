const pages = require('express').Router();

pages.get('*', (req, res) => {
  res.statusCode = 404;
  res.json({ message: 'Здесь будет Фронт' });
});

pages.get('/', (req, res) => {
  res.render('./public/index.html');
});


module.exports = pages;
