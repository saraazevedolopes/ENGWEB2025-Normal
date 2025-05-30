const Edicao = require('../models/edicao.js')

// GET /edicoes
module.exports.getAll = () => {
    // incluiu agora 'musicas'
    return Edicao.find({}, { _id: 1, anoEdição: 1, organização: 1, vencedor: 1, musicas: 1 }).exec()
}

// GET /edicoes/:id
module.exports.getById = id => {
    return Edicao.findById(id).exec()
}

// GET /edicoes?org=XXXX
module.exports.getByOrganizacao = org => {
    // incluiu também 'musicas'
    return Edicao.find(
      { organização: org },
      { _id: 1, anoEdição: 1, organização: 1, vencedor: 1, musicas: 1 }
    ).exec()
}

// GET /paises?papel=org
module.exports.getOrganizadores = () => {
    return Edicao.aggregate([
        { $group: { _id: "$organização", anos: { $push: "$anoEdição" } } },
        { $sort: { _id: 1 } }
    ])
}

// GET /paises?papel=venc
module.exports.getVencedores = () => {
    return Edicao.aggregate([
        { $match: { vencedor: { $ne: null } } },
        { $group: { _id: "$vencedor", anos: { $push: "$anoEdição" } } },
        { $sort: { _id: 1 } }
    ])
}

// GET /interpretes
module.exports.getInterpretes = () => {
    return Edicao.aggregate([
        { $unwind: "$musicas" },
        {
            $group: {
                _id: "$musicas.intérprete",
                pais: { $first: "$musicas.país" }
            }
        },
        { $sort: { _id: 1 } }
    ])
}

// POST /edicoes
module.exports.insert = edicao => {
    const nova = new Edicao(edicao)
    return nova.save()
}

// PUT /edicoes/:id
module.exports.update = (id, edicao) => {
    return Edicao.findByIdAndUpdate(id, edicao, { new: true }).exec()
}

// DELETE /edicoes/:id
module.exports.delete = id => {
    return Edicao.findByIdAndDelete(id).exec()
}
