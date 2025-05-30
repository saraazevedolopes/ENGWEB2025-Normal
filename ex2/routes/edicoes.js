var express = require('express');
var router = express.Router();
var axios = require('axios');

const API_URL = 'http://localhost:25000/edicoes';

// Página principal: lista de todas as edições
router.get('/', function(req, res) {
  const date = new Date().toISOString().substring(0, 16);

  axios.get(API_URL)
    .then(dados => {
      res.status(200).render('index', {
        edicoes: dados.data,
        date: date
      });
    })
    .catch(error => res.status(500).render('error', { error: error }));
});

// Página de um país organizador ou vencedor
router.get('/paises/:nomePais', function(req, res) {
  const date = new Date().toISOString().substring(0, 16);
  const nomePais = decodeURIComponent(req.params.nomePais);

  // Busca edições onde o país é organizador ou vencedor
  axios.get(API_URL)
    .then(dados => {
      const relacionadas = dados.data.filter(e =>
        e.organização === nomePais || e.vencedor === nomePais
      );

      res.status(200).render('pais', {
        nome: nomePais,
        edicoes: relacionadas,
        date: date
      });
    })
    .catch(error => res.status(500).render('error', { error: error }));
});

// Página de uma edição específica
router.get('/:id', function(req, res) {
  const date = new Date().toISOString().substring(0, 16);

  axios.get(`${API_URL}/${req.params.id}`)
    .then(dados => {
      res.status(200).render('edicao', {
        edicao: dados.data,
        date: date
      });
    })
    .catch(error => res.status(500).render('error', { error: error }));
});

module.exports = router;
