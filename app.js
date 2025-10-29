const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname);

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.static(publicPath));

app.get('/login', (req, res) => res.sendFile(path.join(publicPath, 'login.html')));
app.get('/registro', (req, res) => res.sendFile(path.join(publicPath, 'registro.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(publicPath, 'dashboard.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(publicPath, 'admin_panel.html')));
app.get('/gob', (req, res) => res.sendFile(path.join(publicPath, 'dashboard_gobierno.html')));

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
