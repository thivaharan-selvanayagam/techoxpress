const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/',         require('./routes/home'));
app.use('/services', require('./routes/services'));
app.use('/tracking', require('./routes/tracking'));
app.use('/about',    require('./routes/about'));
app.use('/contact',  require('./routes/contact'));

app.use((req, res) => {
  res.status(404).render('404', { title: '404 — Techo Xpress', page: '404' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Techo Xpress → http://localhost:${PORT}`));