const mongoose = require('mongoose')

// Subdocumento: música
const musicaSchema = new mongoose.Schema({
    id: String,
    título: String,
    país: String,
    compositor: { type: String, default: null },
    intérprete: { type: String, default: null },
    letra: { type: String, default: null },
    link: { type: String, default: null }
}, { _id: false })

// Documento principal: edição
const edicaoSchema = new mongoose.Schema({
    _id: String, // exemplo: "ed1956"
    anoEdição: Number,
    organização: String,
    vencedor: { type: String, default: null },
    musicas: [musicaSchema]
}, { versionKey: false })

module.exports = mongoose.model('edicao', edicaoSchema, 'edicoes')
