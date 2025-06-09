const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const serverless = require('serverless-http');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: 'segredo',
  resave: false,
  saveUninitialized: true,
}));

// Usuários simulados
const USUARIOS = [
  { usuario: 'admin', senha: '123' },
  { usuario: 'user', senha: '456' }
];

let produtos = [];

// Middleware de autenticação
function autenticar(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ erro: 'Não autorizado' });
  }
  next();
}

app.post('/api/login', (req, res) => {
  const { usuario, senha } = req.body;
  const encontrado = USUARIOS.find(u => u.usuario === usuario && u.senha === senha);
  if (encontrado) {
    req.session.usuario = usuario;
    res.cookie('ultimoAcesso', new Date().toLocaleString());
    return res.status(200).json({ sucesso: true });
  } else {
    return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
  }
});

app.post('/api/cadastro-produto', autenticar, (req, res) => {
  produtos.push(req.body);
  res.status(200).json({ sucesso: true });
});

app.get('/api/produtos', autenticar, (req, res) => {
  res.json(produtos);
});

module.exports = app;
module.exports.handler = serverless(app);
