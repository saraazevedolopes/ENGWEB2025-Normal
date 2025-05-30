var express = require('express');
var router = express.Router();
var Edicoes = require('../controllers/edicoes');

// GET /edicoes (com opção ?org=XXXX)
router.get('/', function(req, res, next) {
  const { org } = req.query;

  if (org) {
    Edicoes.getByOrganizacao(org)
      .then(data => {
        if (data) res.status(200).jsonp(data);
        else res.status(404).jsonp({ error: 'Nenhuma edição encontrada com essa organização' });
      })
      .catch(error => res.status(500).jsonp(error));
  } else {
    Edicoes.getAll()
      .then(data => {
        if (data) res.status(200).jsonp(data);
        else res.status(404).jsonp({ error: 'Nenhuma edição encontrada' });
      })
      .catch(error => res.status(500).jsonp(error));
  }
});

// GET /paises?papel=org ou ?papel=venc
router.get('/paises', function(req, res, next) {
  const { papel } = req.query;

  if (papel === 'org') {
    Edicoes.getOrganizadores()
      .then(data => {
        if (data) res.status(200).jsonp(data);
        else res.status(404).jsonp({ error: 'Nenhum organizador encontrado' });
      })
      .catch(error => res.status(500).jsonp(error));
  } else if (papel === 'venc') {
    Edicoes.getVencedores()
      .then(data => {
        if (data) res.status(200).jsonp(data);
        else res.status(404).jsonp({ error: 'Nenhum vencedor encontrado' });
      })
      .catch(error => res.status(500).jsonp(error));
  } else {
    res.status(400).jsonp({ error: 'Parâmetro "papel" inválido. Use "org" ou "venc".' });
  }
});

// GET /interpretes
router.get('/interpretes', function(req, res, next) {
  Edicoes.getInterpretes()
    .then(data => {
      if (data) res.status(200).jsonp(data);
      else res.status(404).jsonp({ error: 'Nenhum intérprete encontrado' });
    })
    .catch(error => res.status(500).jsonp(error));
});

// GET /edicoes/:id
router.get('/:id', function(req, res, next) {
  Edicoes.getById(req.params.id)
    .then(data => {
      if (data) res.status(200).jsonp(data);
      else res.status(404).jsonp({ error: 'Edição não encontrada' });
    })
    .catch(error => res.status(500).jsonp(error));
});

// POST /edicoes
router.post('/', function(req, res, next) {
  Edicoes.insert(req.body)
    .then(data => {
      if (data) res.status(201).jsonp(data);
      else res.status(500).jsonp({ error: 'Falha ao criar edição' });
    })
    .catch(error => res.status(500).jsonp(error));
});

// PUT /edicoes/:id
router.put('/:id', function(req, res, next) {
  Edicoes.update(req.params.id, req.body)
    .then(data => {
      if (data) res.status(200).jsonp(data);
      else res.status(404).jsonp({ error: 'Edição não encontrada para atualização' });
    })
    .catch(error => res.status(500).jsonp(error));
});

// DELETE /edicoes/:id
router.delete('/:id', function(req, res, next) {
  Edicoes.delete(req.params.id)
    .then(data => {
      if (data) res.status(200).jsonp(data);
      else res.status(404).jsonp({ error: 'Edição não encontrada para remoção' });
    })
    .catch(error => res.status(500).jsonp(error));
});

module.exports = router;
